import 'package:flutter/material.dart';
import '../data/models.dart';
import '../data/page_font.dart';
import '../data/quran_repo.dart';
import '../theme.dart';

/// Renders one mushaf page (1..604) with the authentic QCF per-page font:
/// 15 lines, each a centre-justified run of code_v2 glyphs, with surah-header
/// bands and bismillah lines placed from quran_linemark.
class MushafPageView extends StatefulWidget {
  final int page;
  final QuranRepo repo;
  final int? playingVerseId;
  final void Function(int verseId)? onTapVerse;

  const MushafPageView({
    super.key,
    required this.page,
    required this.repo,
    this.playingVerseId,
    this.onTapVerse,
  });

  @override
  State<MushafPageView> createState() => _MushafPageViewState();
}

class _MushafPageViewState extends State<MushafPageView> {
  late Future<_PageData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  @override
  void didUpdateWidget(MushafPageView old) {
    super.didUpdateWidget(old);
    if (old.page != widget.page) _future = _load();
  }

  Future<_PageData> _load() async {
    final results = await Future.wait([
      widget.repo.pageGlyphs(widget.page),
      widget.repo.lineMarks(widget.page),
      widget.repo.surahs(),
      PageFontLoader.load(widget.page),
    ]);
    return _PageData(
      glyphs: results[0] as List<PageGlyph>,
      marks: results[1] as List<LineMark>,
      surahs: results[2] as List<Surah>,
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_PageData>(
      future: _future,
      builder: (context, snap) {
        if (!snap.hasData) {
          return const Center(child: CircularProgressIndicator(strokeWidth: 2));
        }
        final data = snap.data!;
        final maxLine = [
          ...data.glyphs.map((g) => g.line),
          ...data.marks.map((m) => m.line),
        ].fold<int>(0, (a, b) => a > b ? a : b);

        // group glyphs by line
        final byLine = <int, List<PageGlyph>>{};
        for (final g in data.glyphs) {
          (byLine[g.line] ??= []).add(g);
        }
        final markByLine = {for (final m in data.marks) m.line: m};

        final dark = Theme.of(context).brightness == Brightness.dark;
        final lines = <Widget>[];
        for (var ln = 1; ln <= maxLine; ln++) {
          final mark = markByLine[ln];
          if (mark != null && mark.type == 'surah') {
            final s = data.surahs.firstWhere((x) => x.id == mark.surahId,
                orElse: () => data.surahs.first);
            lines.add(_SurahBand(surah: s));
          } else if (mark != null && mark.type == 'bismillah') {
            lines.add(_BismillahLine(dark: dark));
          } else {
            final glyphs = byLine[ln] ?? const [];
            lines.add(_GlyphLine(
              page: widget.page,
              glyphs: glyphs,
              playingVerseId: widget.playingVerseId,
              onTapVerse: widget.onTapVerse,
            ));
          }
        }

        return Container(
          color: dark ? CaknaColors.bgDark : const Color(0xFFFDFBF4),
          padding: const EdgeInsets.fromLTRB(14, 18, 14, 18),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: lines,
          ),
        );
      },
    );
  }
}

class _PageData {
  final List<PageGlyph> glyphs;
  final List<LineMark> marks;
  final List<Surah> surahs;
  _PageData({required this.glyphs, required this.marks, required this.surahs});
}

const _arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
String _toArabicNumber(int n) =>
    n.toString().split('').map((d) => _arabicIndic[int.parse(d)]).join();

class _GlyphLine extends StatelessWidget {
  final int page;
  final List<PageGlyph> glyphs;
  final int? playingVerseId;
  final void Function(int verseId)? onTapVerse;

  const _GlyphLine({
    required this.page,
    required this.glyphs,
    this.playingVerseId,
    this.onTapVerse,
  });

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final family = PageFontLoader.family(page);
    final ink = dark ? CaknaColors.inkDark : const Color(0xFF1D1D16);
    final spans = <InlineSpan>[];
    for (final g in glyphs) {
      final playing = g.verseId == playingVerseId;
      if (g.isEnd) {
        spans.add(WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: _AyahBadge(number: g.ayahNumber, dark: dark),
        ));
      } else {
        spans.add(TextSpan(
          text: g.code,
          style: TextStyle(
            fontFamily: family,
            fontSize: 26,
            height: 1.0,
            color: playing ? CaknaColors.olive : ink,
            backgroundColor: playing ? CaknaColors.olive.withValues(alpha: 0.10) : null,
          ),
        ));
      }
    }
    return Directionality(
      textDirection: TextDirection.rtl,
      child: GestureDetector(
        onTapUp: (_) {
          if (glyphs.isNotEmpty) onTapVerse?.call(glyphs.first.verseId);
        },
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Text.rich(TextSpan(children: spans), textAlign: TextAlign.center),
        ),
      ),
    );
  }
}

class _AyahBadge extends StatelessWidget {
  final int number;
  final bool dark;
  const _AyahBadge({required this.number, required this.dark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 3),
      child: Container(
        constraints: const BoxConstraints(minWidth: 22, minHeight: 22),
        padding: const EdgeInsets.all(3),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.55), width: 1.2),
          color: CaknaColors.olive.withValues(alpha: dark ? 0.18 : 0.08),
        ),
        child: Text(
          _toArabicNumber(number),
          style: const TextStyle(
            fontFamily: 'Uthmani',
            fontSize: 11,
            height: 1.0,
            color: CaknaColors.oliveDeep,
          ),
        ),
      ),
    );
  }
}

class _SurahBand extends StatelessWidget {
  final Surah surah;
  const _SurahBand({required this.surah});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.4)),
        gradient: LinearGradient(
          colors: [
            CaknaColors.olive.withValues(alpha: dark ? 0.18 : 0.10),
            Colors.transparent,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        children: [
          Text('سُورَةُ ${surah.name}',
              style: const TextStyle(
                  fontFamily: 'Uthmani', fontSize: 20, color: CaknaColors.oliveDeep)),
          Text('${surah.id}. ${surah.nameTrans}',
              style: TextStyle(
                  fontSize: 11,
                  color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}

class _BismillahLine extends StatelessWidget {
  final bool dark;
  const _BismillahLine({required this.dark});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        style: TextStyle(
          fontFamily: 'Uthmani',
          fontSize: 22,
          color: dark ? CaknaColors.inkDark : const Color(0xFF1D1D16),
        ),
      ),
    );
  }
}
