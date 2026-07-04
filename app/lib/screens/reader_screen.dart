import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/page_font.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../theme.dart';
import '../widgets/mushaf_page.dart';

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

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    return Scaffold(
      appBar: AppBar(
        title: Text('Halaman $_page'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {}, // wired in a later pass
          ),
        ],
      ),
      body: PageView.builder(
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
                  onTapVerse: (_) {},
                ),
              ),
              _PageFooter(page: page),
            ],
          );
        },
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
