import 'package:audio_session/audio_session.dart';
import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';

/// Per-ayah audio playback. Streams verse recitation from the islamic.network
/// CDN addressed by the 1-based global ayah id (= quran.db verse_id), and
/// auto-advances to the next ayah for continuous reading. Exposes the currently
/// playing verse id so the mushaf can highlight it.
class AudioService extends ChangeNotifier {
  final _player = AudioPlayer();

  static const _cdn = 'https://cdn.islamic.network/quran/audio/128';
  String reciter = 'ar.alafasy';

  int? _verseId; // currently loaded/playing global verse id
  int? _stopAfter; // last verse of the continuous run (inclusive), null = single
  bool _ready = false;

  int? get playingVerseId => _isActive ? _verseId : null;
  bool get isPlaying => _player.playing;
  bool get _isActive => _verseId != null;

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

  /// Play from [verseId], continuing through [stopAfter] (inclusive).
  Future<void> playFrom(int verseId, {int? stopAfter}) async {
    await _ensureSession();
    _verseId = verseId;
    _stopAfter = stopAfter;
    notifyListeners();
    try {
      await _player.setUrl('$_cdn/$reciter/$verseId.mp3');
      await _player.play();
    } catch (_) {
      await stop();
    }
  }

  Future<void> _onCompleted() async {
    final current = _verseId;
    if (current == null) return;
    final next = current + 1;
    final within = _stopAfter == null || next <= _stopAfter!;
    if (within && next <= 6236) {
      await playFrom(next, stopAfter: _stopAfter);
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
    await _player.stop();
    notifyListeners();
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}
