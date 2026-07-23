import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../quran/tajweed.dart';
import '../state/app_state.dart';
import '../state/audio_service.dart';
import '../state/user_data.dart';
import '../theme.dart';
import 'ayah_marker.dart';
import 'share_ayah.dart';
import 'verse_sheet.dart';

/// Translation reading mode: the ayahs of one mushaf page as a vertical scroll,
/// each with tajweed-coloured Arabic, its translation, and per-ayah actions
/// (matches Tilawah's "Translation" reader mode).
class TranslationPageView extends StatefulWidget {
  final int page;
  final QuranRepo repo;
  final int? playingVerseId;

  const TranslationPageView({
    super.key,
    required this.page,
    required this.repo,
    this.playingVerseId,
  });

  @override
  State<TranslationPageView> createState() => _TranslationPageViewState();
}

class _TranslationPageViewState extends State<TranslationPageView> {
  late Future<List<_AyahData>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  @override
  void didUpdateWidget(TranslationPageView old) {
    super.didUpdateWidget(old);
    if (old.page != widget.page) _future = _load();
  }

  Future<List<_AyahData>> _load() async {
    final verses = await widget.repo.versesForPage(widget.page);
    final surahs = await widget.repo.surahs();
    final out = <_AyahData>[];
    for (final v in verses) {
      final words = await widget.repo.words(v.id);
      final surah = surahs.firstWhere((s) => s.id == v.surahId, orElse: () => surahs.first);
      out.add(_AyahData(v, surah, words));
    }
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return FutureBuilder<List<_AyahData>>(
      future: _future,
      builder: (context, snap) {
        if (snap.hasError) {
          return const Center(child: Text('Gagal memuat halaman.'));
        }
        if (!snap.hasData) {
          return const Center(child: CircularProgressIndicator(strokeWidth: 2));
        }
        final ayahs = snap.data!;
        return Container(
          color: dark ? const Color(0xFF1C1B13) : const Color(0xFFFDFBF4),
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: ayahs.length,
            separatorBuilder: (_, _) => Divider(
                height: 1,
                indent: 16,
                endIndent: 16,
                color: dark ? CaknaColors.borderDark : CaknaColors.border),
            itemBuilder: (context, i) {
              final a = ayahs[i];
              final firstOfSurah = a.verse.verseNumber == 1;
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (firstOfSurah) _SurahHeader(surah: a.surah, dark: dark),
                  _AyahTile(
                    data: a,
                    playing: a.verse.id == widget.playingVerseId,
                    dark: dark,
                  ),
                ],
              );
            },
          ),
        );
      },
    );
  }
}

class _AyahData {
  final Verse verse;
  final Surah surah;
  final List<Word> words;
  _AyahData(this.verse, this.surah, this.words);
}

class _SurahHeader extends StatelessWidget {
  final Surah surah;
  final bool dark;
  const _SurahHeader({required this.surah, required this.dark});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 10, 16, 4),
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.4)),
        gradient: LinearGradient(
          colors: [CaknaColors.olive.withValues(alpha: dark ? 0.18 : 0.10), Colors.transparent],
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
                  color: dark ? const Color(0xFFDACB8E) : CaknaColors.oliveDeep)),
          Text('${surah.id}. ${surah.nameTrans}',
              style: TextStyle(
                  fontSize: 11, color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}

class _AyahTile extends StatelessWidget {
  final _AyahData data;
  final bool playing;
  final bool dark;
  const _AyahTile({required this.data, required this.playing, required this.dark});

  String _tr(String lang) => switch (lang) {
        'en' => data.verse.translationEn,
        'id' => data.verse.translationId,
        _ => data.verse.translationMs,
      };

  String _translator(String lang) => switch (lang) {
        'en' => 'Translation by Abdullah Yusuf Ali',
        'id' => 'Terjemahan Kementerian Agama RI',
        _ => 'Terjemahan oleh Abdullah Basmeih',
      };

  List<InlineSpan> _arabicSpans(BuildContext context, double size, bool tajweedOn) {
    // Tajweed rules align 1:1 with text_madani codepoints (MeQuran font); the
    // plain view keeps the Uthmani script.
    final base = TextStyle(
      fontFamily: tajweedOn ? 'MeQuran' : 'Uthmani',
      fontSize: size,
      height: 1.9,
      color: dark ? const Color(0xFFF2EEE0) : CaknaColors.ink,
    );
    final out = <InlineSpan>[];
    if (data.words.isEmpty) {
      out.add(TextSpan(
          text: data.verse.textUthmani, style: base.copyWith(fontFamily: 'Uthmani')));
    } else {
      for (var i = 0; i < data.words.length; i++) {
        if (tajweedOn) {
          out.addAll(Tajweed.spans(data.words[i].madani, data.words[i].rules, base));
        } else {
          out.add(TextSpan(text: data.words[i].arabic, style: base));
        }
        if (i != data.words.length - 1) out.add(TextSpan(text: ' ', style: base));
      }
    }
    // authentic ayah-end ornament with the number inside
    out.add(const TextSpan(text: ' '));
    out.add(WidgetSpan(
      alignment: PlaceholderAlignment.middle,
      child: AyahEndMarker(number: data.verse.verseNumber, size: size * 1.15),
    ));
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final lang = app.transLang;
    final v = data.verse;
    return Container(
      color: playing ? CaknaColors.olive.withValues(alpha: dark ? 0.14 : 0.07) : null,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text.rich(
            TextSpan(children: _arabicSpans(context, app.arabicFontSize, app.tajweed)),
            textAlign: TextAlign.right,
            textDirection: TextDirection.rtl,
          ),
          const SizedBox(height: 14),
          Text('${v.verseNumber}. ${_tr(lang)}',
              style: TextStyle(
                  fontSize: app.translationFontSize,
                  height: 1.5,
                  color: dark ? CaknaColors.inkDark : CaknaColors.ink)),
          const SizedBox(height: 4),
          Text(_translator(lang),
              style: TextStyle(
                  fontSize: 12,
                  color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
          const SizedBox(height: 6),
          _ActionRow(data: data),
        ],
      ),
    );
  }
}

class _ActionRow extends StatelessWidget {
  final _AyahData data;
  const _ActionRow({required this.data});

  @override
  Widget build(BuildContext context) {
    final id = data.verse.id;
    final audio = context.watch<AudioService>();
    final playing = audio.playingVerseId == id && audio.isPlaying;
    final marked = context.watch<UserData>().isBookmarked(id);
    final hasNote = context.watch<UserData>().hasNote(id);
    return Row(
      children: [
        _act(
          icon: playing ? Icons.stop_circle_outlined : Icons.play_circle_outline,
          active: playing,
          onTap: () => context.read<AudioService>().toggleVerse(id),
        ),
        _act(
          icon: marked ? Icons.bookmark : Icons.bookmark_border,
          active: marked,
          onTap: () => context.read<UserData>().toggleBookmark(id),
        ),
        _act(
          icon: hasNote ? Icons.edit : Icons.edit_outlined,
          active: hasNote,
          onTap: () => showVerseSheet(context, id),
        ),
        _act(icon: Icons.grid_view_outlined, onTap: () => pickCollectionAndBookmark(context, id)),
        _act(icon: Icons.ios_share, onTap: () => showShareAyahSheet(context, id)),
        _act(
          icon: Icons.copy_outlined,
          onTap: () async {
            final lang = context.read<AppState>().transLang;
            final t = switch (lang) {
              'en' => data.verse.translationEn,
              'id' => data.verse.translationId,
              _ => data.verse.translationMs,
            };
            await Clipboard.setData(ClipboardData(
                text:
                    '${data.verse.textUthmani}\n\n$t\n(${data.surah.nameTrans} ${data.verse.surahId}:${data.verse.verseNumber})'));
            if (context.mounted) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(const SnackBar(content: Text('Ayat disalin')));
            }
          },
        ),
        _act(icon: Icons.more_horiz, onTap: () => showVerseSheet(context, id)),
      ],
    );
  }

  Widget _act({required IconData icon, bool active = false, required VoidCallback onTap}) {
    return Expanded(
      child: IconButton(
        icon: Icon(icon, size: 22),
        color: active ? CaknaColors.olive : CaknaColors.inkSoft,
        onPressed: onTap,
      ),
    );
  }
}
