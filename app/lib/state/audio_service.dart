import 'package:audio_session/audio_session.dart';
import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import '../data/quran_repo.dart';
import '../data/reciters.dart';
import '../data/timing_repo.dart';
import 'audio_downloads.dart';

/// Per-ayah audio playback. Streams verse recitation from the reciter's
/// verified CDN source (see reciters.dart), addressed by the 1-based global
/// ayah id (= quran.db verse_id), and auto-advances to the next ayah for
/// continuous reading. Sources carry a MediaItem tag so just_audio_background
/// shows lock-screen / notification transport controls and playback survives
/// backgrounding. Exposes the currently playing verse id so the mushaf can
/// highlight it.
class AudioService extends ChangeNotifier {
  final _player = AudioPlayer();
  final QuranRepo? _repo; // for surah names on the lock screen
  final AudioDownloads? _downloads; // offline cache fast-path
  final TimingRepo? _timing; // word-by-word highlight windows

  AudioService([this._repo, this._downloads, this._timing]);

  String reciter = 'ar.alafasy';

  int? _verseId; // currently loaded/playing global verse id
  int? _stopAfter; // last verse of the continuous run (inclusive), null = single
  bool _ready = false;

  // playback controls
  double _speed = 1.0;
  int _repeat = 1; // per-ayah replays before advancing; 0 = infinite (∞)
  int _playsOfCurrent = 0;
  static const _speeds = [1.0, 1.25, 1.5, 0.75];
  static const _repeats = [1, 2, 3, 0];

  // A–B range repeat (memorization loop): loops [_rangeStart.._rangeEnd]
  // until cleared. Armed = A set, waiting for B.
  int? _rangeStart, _rangeEnd;

  double get speed => _speed;
  int get repeat => _repeat;
  String get speedLabel => _speed % 1 == 0 ? _speed.toStringAsFixed(1) : _speed.toString();
  String get repeatLabel => _repeat == 0 ? '∞' : '${_repeat}x';

  bool get rangeArmed => _rangeStart != null && _rangeEnd == null;
  bool get rangeActive => _rangeStart != null && _rangeEnd != null;

  int? get playingVerseId => _isActive ? _verseId : null;
  bool get isPlaying => _player.playing;
  bool get _isActive => _verseId != null;

  // word-by-word highlight: the 1-based word position currently sounding in
  // the playing ayah (null when no timing data for the reciter)
  List<WordTiming> _segments = const [];
  int? _wordPos;
  int? get playingWordPos => _isActive ? _wordPos : null;

  void _onPosition(Duration pos) {
    if (_segments.isEmpty) return;
    final ms = pos.inMilliseconds;
    int? cur;
    for (final s in _segments) {
      if (ms >= s.startMs && ms < s.endMs) {
        cur = s.word;
        break;
      }
    }
    if (cur != _wordPos) {
      _wordPos = cur;
      notifyListeners();
    }
  }

  void cycleSpeed() {
    final i = _speeds.indexOf(_speed);
    _speed = _speeds[(i < 0 ? 0 : i + 1) % _speeds.length];
    _player.setSpeed(_speed);
    notifyListeners();
  }

  void cycleRepeat() {
    final i = _repeats.indexOf(_repeat);
    _repeat = _repeats[(i < 0 ? 0 : i + 1) % _repeats.length];
    notifyListeners();
  }

  /// A–B repeat control: 1st tap arms A at the current ayah, 2nd tap sets B
  /// and starts looping A..B, 3rd tap clears.
  void cycleRange() {
    if (_rangeStart == null) {
      _rangeStart = _verseId; // arm A (null tolerated: stays unarmed)
    } else if (_rangeEnd == null) {
      final cur = _verseId;
      if (cur == null || cur < _rangeStart!) {
        _rangeStart = null; // invalid selection → disarm
      } else {
        _rangeEnd = cur;
        _stopAfter = null; // the range now bounds the run
      }
    } else {
      _rangeStart = null;
      _rangeEnd = null;
    }
    notifyListeners();
  }

  Future<void> _ensureSession() async {
    if (_ready) return;
    final session = await AudioSession.instance;
    await session.configure(const AudioSessionConfiguration.music());
    _player.playerStateStream.listen((s) {
      if (s.processingState == ProcessingState.completed) {
        _onCompleted();
      }
      notifyListeners();
    });
    _player.positionStream.listen(_onPosition);
    _ready = true;
  }

  /// Play a single verse (tap-to-play). Toggles off if it's already playing.
  Future<void> toggleVerse(int verseId) async {
    if (_verseId == verseId && _player.playing) {
      await stop();
      return;
    }
    await playFrom(verseId, stopAfter: verseId);
  }

  Future<MediaItem> _mediaItem(int verseId) async {
    final (surah, ayah) = surahAyahOf(verseId);
    String title = 'Surah $surah · Ayat $ayah';
    try {
      final s = await _repo?.surah(surah);
      if (s != null) title = '${s.nameTrans} · Ayat $ayah';
    } catch (_) {/* lock-screen title falls back to the numeric form */}
    return MediaItem(
      id: '$verseId',
      album: 'Cakna',
      title: title,
      artist: reciterById(reciter).name,
    );
  }

  /// Play from [verseId], continuing through [stopAfter] (inclusive).
  /// [fromRangeLoop] marks the internal A–B wrap call — any OTHER playback
  /// start clears the range, else a single-verse tap gets hijacked into the
  /// loop (next > B wraps back to A forever).
  Future<void> playFrom(int verseId, {int? stopAfter, bool fromRangeLoop = false}) async {
    await _ensureSession();
    if (!fromRangeLoop && (_rangeStart != null || _rangeEnd != null)) {
      _rangeStart = null;
      _rangeEnd = null;
    }
    _verseId = verseId;
    _stopAfter = stopAfter;
    _playsOfCurrent = 0;
    _isWordClip = false;
    _segments = const [];
    _wordPos = null;
    notifyListeners();
    try {
      // downloaded audio plays from disk; otherwise stream from the CDN
      final local = await _downloads?.localFile(reciter, verseId);
      final uri = local != null ? Uri.file(local.path) : Uri.parse(reciterById(reciter).url(verseId));
      await _player.setAudioSource(AudioSource.uri(uri, tag: await _mediaItem(verseId)));
      await _player.setSpeed(_speed);
      _loadSegments(verseId); // fire-and-forget; highlight starts when loaded
      await _player.play();
    } catch (_) {
      await stop();
    }
  }

  Future<void> _loadSegments(int verseId) async {
    final t = _timing;
    if (t == null) return;
    final (surah, ayah) = surahAyahOf(verseId);
    try {
      final segs = await t.segments(reciter, surah, ayah);
      if (_verseId == verseId) _segments = segs; // ignore stale loads
    } catch (_) {/* no highlight */}
  }

  /// Switch reciter. If something is playing, restart the current ayah with
  /// the new voice (keeping the run bounds and any A–B range) so the audio,
  /// timings and mini-player label stay in agreement.
  Future<void> setReciter(String id) async {
    if (reciter == id) return;
    reciter = id;
    final v = _verseId;
    if (v != null && !_isWordClip && _player.playing) {
      await playFrom(v, stopAfter: _stopAfter, fromRangeLoop: true);
    } else {
      notifyListeners();
    }
  }

  /// Word timing windows for an ayah with the current reciter (empty when no
  /// timing data exists).
  Future<List<WordTiming>> wordTimings(int verseId) async {
    final t = _timing;
    if (t == null) return const [];
    final (surah, ayah) = surahAyahOf(verseId);
    try {
      return await t.segments(reciter, surah, ayah);
    } catch (_) {
      return const [];
    }
  }

  /// Play just one word of an ayah (verse-sheet word tap) by clipping the
  /// ayah recording to the word's timing window.
  Future<void> playWord(int verseId, WordTiming t) async {
    await _ensureSession();
    _verseId = verseId;
    _stopAfter = verseId;
    _playsOfCurrent = 0;
    _isWordClip = true;
    _segments = const [];
    _wordPos = t.word;
    notifyListeners();
    try {
      final local = await _downloads?.localFile(reciter, verseId);
      final uri = local != null ? Uri.file(local.path) : Uri.parse(reciterById(reciter).url(verseId));
      // just_audio_background reads the tag from the OUTERMOST source — a tag
      // on the inner child throws and kills playback silently
      await _player.setAudioSource(ClippingAudioSource(
        child: AudioSource.uri(uri),
        start: Duration(milliseconds: t.startMs),
        end: Duration(milliseconds: t.endMs),
        tag: await _mediaItem(verseId),
      ));
      await _player.setSpeed(_speed);
      await _player.play();
    } catch (_) {
      await stop();
    }
  }

  bool _handlingComplete = false;
  bool _isWordClip = false;

  Future<void> _onCompleted() async {
    if (_handlingComplete) return; // guard against duplicate `completed` events
    _handlingComplete = true;
    try {
      await _handleCompleted();
    } finally {
      _handlingComplete = false;
    }
  }

  Future<void> _handleCompleted() async {
    final current = _verseId;
    if (current == null) return;
    // a word clip plays exactly once — never repeats or advances
    if (_isWordClip) {
      await stop();
      return;
    }
    // per-ayah repeat: replay the same verse before advancing. Inside an A–B
    // range, ∞ would starve the loop on its first ayah — treat it as 1 there
    // (finite N× still repeats each ayah of the range).
    _playsOfCurrent++;
    final effRepeat = (rangeActive && _repeat == 0) ? 1 : _repeat;
    if (effRepeat == 0 || _playsOfCurrent < effRepeat) {
      await _player.seek(Duration.zero);
      await _player.play();
      return;
    }
    final next = current + 1;
    // A–B loop: wrap back to A after finishing B (internal continuations keep
    // the range — only a user-initiated playback start clears it)
    if (rangeActive && next > _rangeEnd!) {
      await playFrom(_rangeStart!, stopAfter: _stopAfter, fromRangeLoop: true);
      return;
    }
    final within = _stopAfter == null || next <= _stopAfter!;
    if (within && next <= 6236) {
      await playFrom(next, stopAfter: _stopAfter, fromRangeLoop: true);
    } else {
      await stop();
    }
  }

  Future<void> pauseResume() async {
    if (!_isActive) return;
    if (_player.playing) {
      await _player.pause();
    } else {
      await _player.play();
    }
    notifyListeners();
  }

  Future<void> stop() async {
    _verseId = null;
    _stopAfter = null;
    _rangeStart = null;
    _rangeEnd = null;
    _isWordClip = false;
    _segments = const [];
    _wordPos = null;
    await _player.stop();
    notifyListeners();
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}
