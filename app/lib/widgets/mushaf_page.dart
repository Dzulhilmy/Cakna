import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/page_font.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../theme.dart';
import 'ayah_marker.dart';

/// Dark-mode mushaf palette: a warm, lifted charcoal page (not pure black) with
/// bright cream glyphs and a warm-gold accent, tuned for comfortable night
/// reading. Light mode keeps the cream parchment.
const _readerBgLight = Color(0xFFFDFBF4);
const _readerInkLight = Color(0xFF1D1D16);
const _readerBgDark = Color(0xFF1C1B13);
const _readerInkDark = Color(0xFFF2EEE0);
const _readerGoldDark = Color(0xFFDACB8E);

/// Renders one mushaf page (1..604) with the authentic QCF per-page font:
/// 15 lines, each a centre-justified run of code_v2 glyphs, with surah-header
/// bands and bismillah lines placed from quran_linemark.
class MushafPageView extends StatefulWidget {
  final int page;
  final QuranRepo repo;
  final int? playingVerseId;
  final int? playingWordPos; // word-by-word highlight within the playing ayah
  final void Function(int verseId)? onTapVerse;

  const MushafPageView({
    super.key,
    required this.page,
    required this.repo,
    this.playingVerseId,
    this.playingWordPos,
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
        if (snap.hasError) {
          return const Center(child: Text('Gagal memuat halaman.'));
        }
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
        // Mushaf is a fixed 15-line page; map the S/M/L/XL presets (24–40)
        // into a safe 22–32 range so each preset stays distinct without
        // overflowing the page height.
        final pref = context.watch<AppState>().arabicFontSize;
        final fontSize = (22 + (pref - 24) * 10 / 16).clamp(22.0, 32.0);
        final lines = <Widget>[];
        // Line 0 holds the surah-name band that sits above the first text line
        // when a surah opens at the very top of a page (21 surahs).
        for (var ln = 0; ln <= maxLine; ln++) {
          final mark = markByLine[ln];
          if (mark != null && mark.type == 'surah') {
            final s = data.surahs.firstWhere((x) => x.id == mark.surahId,
                orElse: () => data.surahs.first);
            lines.add(_SurahBand(surah: s));
          } else if (mark != null && mark.type == 'bismillah') {
            lines.add(_BismillahLine(dark: dark));
          } else if (ln >= 1) {
            final glyphs = byLine[ln] ?? const [];
            lines.add(_GlyphLine(
              page: widget.page,
              glyphs: glyphs,
              fontSize: fontSize,
              playingVerseId: widget.playingVerseId,
              playingWordPos: widget.playingWordPos,
              onTapVerse: widget.onTapVerse,
            ));
          }
        }

        return Container(
          color: dark ? _readerBgDark : _readerBgLight,
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

class _GlyphLine extends StatefulWidget {
  final int page;
  final List<PageGlyph> glyphs;
  final double fontSize;
  final int? playingVerseId;
  final int? playingWordPos;
  final void Function(int verseId)? onTapVerse;

  const _GlyphLine({
    required this.page,
    required this.glyphs,
    required this.fontSize,
    this.playingVerseId,
    this.playingWordPos,
    this.onTapVerse,
  });

  @override
  State<_GlyphLine> createState() => _GlyphLineState();
}

class _GlyphLineState extends State<_GlyphLine> {
  // One tap recognizer per verse on the line, so tapping a word opens THAT
  // ayah (not the line's first ayah) even when a line holds two verses. The
  // recognizers are kept across rebuilds — disposing them inside build()
  // dropped any tap that straddled the frequent word-highlight rebuilds
  // during recitation — and only torn down with the State.
  final _recByVerse = <int, TapGestureRecognizer>{};

  @override
  void dispose() {
    for (final r in _recByVerse.values) {
      r.dispose();
    }
    super.dispose();
  }

  TapGestureRecognizer _recFor(int verseId) {
    final r = _recByVerse.putIfAbsent(verseId, TapGestureRecognizer.new);
    r.onTap = () => widget.onTapVerse?.call(verseId); // keep the latest callback
    return r;
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final family = PageFontLoader.family(widget.page);
    final ink = dark ? _readerInkDark : _readerInkLight;
    final accent = dark ? _readerGoldDark : CaknaColors.olive;
    final playingInk = accent;
    final playingBg = accent.withValues(alpha: dark ? 0.16 : 0.10);

    final spans = <InlineSpan>[];
    for (final g in widget.glyphs) {
      if (g.isWord) {
        final playing = g.verseId == widget.playingVerseId;
        // the word currently sounding gets a stronger wash than the rest of
        // the playing ayah (word-by-word follow, when timings exist)
        final sounding =
            playing && widget.playingWordPos != null && g.wordPos == widget.playingWordPos;
        spans.add(TextSpan(
          text: g.code,
          recognizer: _recFor(g.verseId),
          style: TextStyle(
            fontFamily: family,
            fontSize: widget.fontSize,
            height: 1.0,
            color: playing ? playingInk : ink,
            backgroundColor: sounding
                ? accent.withValues(alpha: dark ? 0.38 : 0.28)
                : (playing ? playingBg : null),
          ),
        ));
      } else if (g.isEnd) {
        spans.add(WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: GestureDetector(
            onTap: () => widget.onTapVerse?.call(g.verseId),
            child: AyahEndMarker(number: g.ayahNumber, size: widget.fontSize * 1.15),
          ),
        ));
      } else if (g.isRub) {
        spans.add(TextSpan(
          text: ' ۞ ',
          style: TextStyle(fontFamily: 'Uthmani', fontSize: widget.fontSize * 0.85, color: accent),
        ));
      } else if (g.isSajdah) {
        spans.add(TextSpan(
          text: ' ۩ ',
          style: TextStyle(fontFamily: 'Uthmani', fontSize: widget.fontSize * 0.85, color: accent),
        ));
      }
    }
    return Directionality(
      textDirection: TextDirection.rtl,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Text.rich(TextSpan(children: spans), textAlign: TextAlign.center),
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
              style: TextStyle(
                  fontFamily: 'Uthmani',
                  fontSize: 20,
                  color: dark ? _readerGoldDark : CaknaColors.oliveDeep)),
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
          color: dark ? _readerInkDark : _readerInkLight,
        ),
      ),
    );
  }
}
