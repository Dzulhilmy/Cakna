import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import '../data/page_font.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../state/audio_service.dart';
import '../state/user_data.dart';
import '../theme.dart';
import '../widgets/halaqah_bar.dart';
import '../widgets/mini_player.dart';
import '../widgets/mushaf_page.dart';
import '../widgets/translation_page.dart';
import '../widgets/verse_sheet.dart';
import 'quran_settings_screen.dart';
import 'search_screen.dart';

/// The mushaf reader: a horizontally-paged 604-page Madani view. RTL paging
/// (swipe right-to-left advances, matching a physical mushaf).
class ReaderScreen extends StatefulWidget {
  final int initialPage;
  const ReaderScreen({super.key, required this.initialPage});

  @override
  State<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends State<ReaderScreen> with WidgetsBindingObserver {
  late final PageController _controller;
  late int _page;

  // reading-time tracking (for the "Minutes" progress stat)
  final _stopwatch = Stopwatch();
  int _carryMs = 0; // sub-second remainder carried between flushes
  bool _pausedByRoute = false; // a pushed route is on top → don't count time
  Timer? _timeTimer;
  late final UserData _userData;
  late final QuranRepo _repo;
  late final AudioService _audio;

  // header context (surah calligraphy + juz for the current page)
  int _juz = 1;
  int _surahId = 1;
  int _headerGen = 0; // guards against out-of-order _loadHeader on fast swipes

  // follow-the-reciter: animate the page to the playing ayah, but stop
  // following once the user manually navigates to a different page.
  int? _lastFollowVerse;
  int? _followPage;

  @override
  void initState() {
    super.initState();
    _page = widget.initialPage.clamp(1, 604);
    // RTL: page index 0 = mushaf page 604, index 603 = page 1
    _controller = PageController(initialPage: 604 - _page);
    _prefetch(_page);
    _userData = context.read<UserData>();
    _repo = context.read<QuranRepo>();
    _audio = context.read<AudioService>();
    _audio.addListener(_onAudioTick);
    _loadHeader(_page);
    // apply the user's chosen reciter to the shared audio service
    _audio.reciter = context.read<AppState>().reciter;
    // mark the opening page read
    WidgetsBinding.instance.addPostFrameCallback((_) => _userData.markRead(_page));
    // accumulate active reading time, flushed periodically
    WidgetsBinding.instance.addObserver(this);
    _stopwatch.start();
    _timeTimer = Timer.periodic(const Duration(seconds: 20), (_) => _flushTime());
  }

  void _flushTime() {
    _carryMs += _stopwatch.elapsedMilliseconds;
    _stopwatch.reset(); // keeps running if already running
    final s = _carryMs ~/ 1000;
    if (s > 0) {
      _userData.addReadSeconds(s);
      _carryMs -= s * 1000; // carry the sub-second remainder forward
    }
  }

  /// Pause reading-time tracking while a route/modal opened from the reader is
  /// on top, so that time isn't counted as reading.
  Future<void> _pauseWhile(Future<void> Function() action) async {
    _flushTime();
    _stopwatch.stop();
    _pausedByRoute = true;
    try {
      await action();
    } finally {
      _pausedByRoute = false;
      if (mounted) _stopwatch.start();
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // don't resume counting while a pushed route/modal is still on top
      if (!_pausedByRoute && !_stopwatch.isRunning) _stopwatch.start();
    } else {
      _flushTime();
      _stopwatch.stop();
    }
  }

  void _prefetch(int page) {
    for (final p in [page, page - 1, page + 1]) {
      if (p >= 1 && p <= 604) PageFontLoader.load(p);
    }
  }

  Future<void> _loadHeader(int page) async {
    final gen = ++_headerGen;
    final verses = await _repo.versesForPage(page);
    if (gen != _headerGen || !mounted || verses.isEmpty) return; // superseded
    setState(() {
      _juz = verses.first.juz;
      _surahId = verses.first.surahId;
    });
    // feed the home "Sambung bacaan" history (one entry per surah)
    context.read<AppState>().recordRead(verses.first.surahId, page);
  }

  /// Follow the reciter: when playback moves to an ayah on another page,
  /// animate the reader to it.
  Future<void> _onAudioTick() async {
    final vid = _audio.playingVerseId;
    if (vid == null) {
      _followPage = null; // playback stopped → next play re-enables following
      return;
    }
    if (vid == _lastFollowVerse) return;
    _lastFollowVerse = vid;
    final v = await _repo.verse(vid);
    if (!mounted || v.page == _page) return;
    // stop following if the user has browsed away from the followed page
    if (_followPage != null && _page != _followPage) return;
    _followPage = v.page;
    _controller.animateToPage(604 - v.page,
        duration: const Duration(milliseconds: 350), curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _flushTime();
    _stopwatch.stop();
    _timeTimer?.cancel();
    _audio.removeListener(_onAudioTick);
    WidgetsBinding.instance.removeObserver(this);
    _controller.dispose();
    super.dispose();
  }

  /// Play continuously from the top of [page] to the end of the mushaf, so the
  /// reciter crosses page boundaries (the reader follows via _onAudioTick).
  Future<void> _playPage(int page) async {
    final verses = await _repo.versesForPage(page);
    if (verses.isEmpty || !mounted) return;
    _followPage = page; // re-enable follow from this page
    await _audio.playFrom(verses.first.id);
  }

  Future<void> _jumpTo() async {
    final controller = TextEditingController();
    final page = await showDialog<int>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Pergi ke halaman'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Nombor halaman (1–604)'),
          onSubmitted: (v) => Navigator.pop(ctx, int.tryParse(v)),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: CaknaColors.olive),
            onPressed: () => Navigator.pop(ctx, int.tryParse(controller.text)),
            child: const Text('Pergi'),
          ),
        ],
      ),
    );
    if (page != null && page >= 1 && page <= 604 && mounted) {
      _controller.jumpToPage(604 - page);
    }
  }

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    // rebuild only when the playing ayah changes, not on every player-state tick
    final playingVerseId = context.select<AudioService, int?>((a) => a.playingVerseId);
    final playingWordPos = context.select<AudioService, int?>((a) => a.playingWordPos);
    final translation = context.watch<AppState>().readingMode == 'translation';
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(
        // FittedBox: the four action buttons leave the title ~140pt on a
        // 390pt phone — page + surah calligraphy + juz must scale down
        // rather than overflow
        title: FittedBox(
          fit: BoxFit.scaleDown,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Halaman $_page',
                  style: const TextStyle(
                      fontFamily: 'Lora', fontSize: 15, fontWeight: FontWeight.w600)),
              const SizedBox(width: 8),
              SvgPicture.asset(
                'assets/images/sname_$_surahId.svg',
                height: 19,
                colorFilter: ColorFilter.mode(
                    dark ? CaknaColors.oliveBright : CaknaColors.oliveDeep, BlendMode.srcIn),
                placeholderBuilder: (_) => const SizedBox(width: 1),
              ),
              const SizedBox(width: 8),
              Text('Juz $_juz',
                  style: const TextStyle(
                      fontFamily: 'Lora', fontSize: 15, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.play_circle_outline),
            tooltip: 'Main halaman',
            onPressed: () => _playPage(_page),
          ),
          IconButton(
            icon: const Icon(Icons.numbers),
            tooltip: 'Pergi ke halaman',
            onPressed: _jumpTo,
          ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => _pauseWhile(() => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const SearchScreen()))),
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            tooltip: 'Tetapan Quran',
            onPressed: () => _pauseWhile(() => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const QuranSettingsScreen()))),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _controller,
              reverse: true, // RTL paging
              itemCount: 604,
              onPageChanged: (i) {
                final page = 604 - i;
                setState(() => _page = page);
                context.read<AppState>().lastPage = page;
                context.read<UserData>().markRead(page);
                _prefetch(page);
                _loadHeader(page);
              },
              itemBuilder: (context, i) {
                final page = 604 - i;
                return Column(
                  children: [
                    Expanded(
                      child: translation
                          ? TranslationPageView(
                              page: page,
                              repo: repo,
                              playingVerseId: playingVerseId,
                            )
                          : MushafPageView(
                              page: page,
                              repo: repo,
                              playingVerseId: playingVerseId,
                              playingWordPos: playingWordPos,
                              onTapVerse: (verseId) =>
                                  _pauseWhile(() => showVerseSheet(context, verseId)),
                            ),
                    ),
                    _PageFooter(page: page),
                  ],
                );
              },
            ),
          ),
          const HalaqahBar(),
          const MiniPlayer(),
        ],
      ),
    );
  }
}

class _PageFooter extends StatelessWidget {
  final int page;
  const _PageFooter({required this.page});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: EdgeInsets.only(
          top: 6, bottom: 6 + MediaQuery.of(context).padding.bottom, left: 16, right: 16),
      decoration: BoxDecoration(
        color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
        border: Border(top: BorderSide(color: dark ? CaknaColors.borderDark : CaknaColors.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('$page',
              style: TextStyle(
                  fontSize: 12,
                  color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}
