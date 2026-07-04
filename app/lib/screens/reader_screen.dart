import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/page_font.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../state/audio_service.dart';
import '../theme.dart';
import '../widgets/mini_player.dart';
import '../widgets/mushaf_page.dart';
import '../widgets/verse_sheet.dart';

/// The mushaf reader: a horizontally-paged 604-page Madani view. RTL paging
/// (swipe right-to-left advances, matching a physical mushaf).
class ReaderScreen extends StatefulWidget {
  final int initialPage;
  const ReaderScreen({super.key, required this.initialPage});

  @override
  State<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends State<ReaderScreen> {
  late final PageController _controller;
  late int _page;

  @override
  void initState() {
    super.initState();
    _page = widget.initialPage.clamp(1, 604);
    // RTL: page index 0 = mushaf page 604, index 603 = page 1
    _controller = PageController(initialPage: 604 - _page);
    _prefetch(_page);
    // apply the user's chosen reciter to the shared audio service
    context.read<AudioService>().reciter = context.read<AppState>().reciter;
  }

  void _prefetch(int page) {
    for (final p in [page, page - 1, page + 1]) {
      if (p >= 1 && p <= 604) PageFontLoader.load(p);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _playPage(int page) async {
    final repo = context.read<QuranRepo>();
    final verses = await repo.versesForPage(page);
    if (verses.isEmpty || !mounted) return;
    await context.read<AudioService>().playFrom(verses.first.id, stopAfter: verses.last.id);
  }

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    final playingVerseId = context.watch<AudioService>().playingVerseId;
    return Scaffold(
      appBar: AppBar(
        title: Text('Halaman $_page'),
        actions: [
          IconButton(
            icon: const Icon(Icons.play_circle_outline),
            tooltip: 'Main halaman',
            onPressed: () => _playPage(_page),
          ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {}, // wired in a later pass
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
                _prefetch(page);
              },
              itemBuilder: (context, i) {
                final page = 604 - i;
                return Column(
                  children: [
                    Expanded(
                      child: MushafPageView(
                        page: page,
                        repo: repo,
                        playingVerseId: playingVerseId,
                        onTapVerse: (verseId) => showVerseSheet(context, verseId),
                      ),
                    ),
                    _PageFooter(page: page),
                  ],
                );
              },
            ),
          ),
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
