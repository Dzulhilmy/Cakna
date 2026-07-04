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

/// Bottom sheet for a single ayah: Arabic, translation, word-by-word and
/// play/copy actions. Shown when a verse is tapped in the mushaf.
Future<void> showVerseSheet(BuildContext context, int verseId) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => VerseSheet(verseId: verseId),
  );
}

class VerseSheet extends StatefulWidget {
  final int verseId;
  const VerseSheet({super.key, required this.verseId});

  @override
  State<VerseSheet> createState() => _VerseSheetState();
}

class _VerseSheetState extends State<VerseSheet> {
  late Future<(Verse, Surah, List<Word>)> _future;
  bool _showWords = false;
  bool _editingNote = false;
  final _noteController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final repo = context.read<QuranRepo>();
    _future = () async {
      final v = await repo.verse(widget.verseId);
      final s = await repo.surah(v.surahId);
      final w = await repo.words(widget.verseId);
      return (v, s, w);
    }();
    _noteController.text = context.read<UserData>().noteBody(widget.verseId);
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  String _tr(Verse v, String lang) => switch (lang) {
        'en' => v.translationEn,
        'id' => v.translationId,
        _ => v.translationMs,
      };

  String _wordGloss(Word w, String lang) => switch (lang) {
        'en' => w.en,
        'id' => w.id,
        _ => w.ms,
      };

  /// The ayah Arabic as spans — tajweed-coloured (from per-word rules) when
  /// enabled, otherwise plain. Falls back to the verse's own text.
  List<InlineSpan> _ayahSpans(List<Word> words, String fallback, bool dark, BuildContext context) {
    final base = TextStyle(
      fontFamily: 'Uthmani',
      fontSize: 26,
      height: 1.9,
      color: dark ? CaknaColors.inkDark : CaknaColors.ink,
    );
    final tajweedOn = context.watch<AppState>().tajweed;
    if (words.isEmpty) return [TextSpan(text: fallback, style: base)];
    final out = <InlineSpan>[];
    for (var i = 0; i < words.length; i++) {
      if (tajweedOn) {
        out.addAll(Tajweed.spans(words[i].arabic, words[i].rules, base));
      } else {
        out.add(TextSpan(text: words[i].arabic, style: base));
      }
      if (i != words.length - 1) out.add(TextSpan(text: ' ', style: base));
    }
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final lang = context.watch<AppState>().transLang;
    final dark = Theme.of(context).brightness == Brightness.dark;
    return FutureBuilder<(Verse, Surah, List<Word>)>(
      future: _future,
      builder: (context, snap) {
        if (!snap.hasData) {
          return const SizedBox(
              height: 200, child: Center(child: CircularProgressIndicator(strokeWidth: 2)));
        }
        final (verse, surah, words) = snap.data!;
        return ConstrainedBox(
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
            shrinkWrap: true,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: CaknaColors.olive.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text('${surah.nameTrans} · ${verse.surahId}:${verse.verseNumber}',
                        style: const TextStyle(
                            fontSize: 12, fontWeight: FontWeight.w600, color: CaknaColors.oliveDeep)),
                  ),
                  const Spacer(),
                  IconButton(
                    tooltip: 'Warna tajwid',
                    icon: Icon(Icons.brush_outlined,
                        color: context.watch<AppState>().tajweed
                            ? CaknaColors.olive
                            : CaknaColors.inkSoft),
                    onPressed: () =>
                        context.read<AppState>().tajweed = !context.read<AppState>().tajweed,
                  ),
                  Builder(builder: (context) {
                    final marked = context.watch<UserData>().isBookmarked(widget.verseId);
                    return IconButton(
                      icon: Icon(marked ? Icons.bookmark : Icons.bookmark_border,
                          color: marked ? CaknaColors.olive : CaknaColors.inkSoft),
                      onPressed: () => context.read<UserData>().toggleBookmark(widget.verseId),
                    );
                  }),
                ],
              ),
              const SizedBox(height: 16),
              Text.rich(
                TextSpan(children: _ayahSpans(words, verse.textUthmani, dark, context)),
                textAlign: TextAlign.right,
                textDirection: TextDirection.rtl,
              ),
              if (context.watch<AppState>().tajweed) ...[
                const SizedBox(height: 12),
                const _TajweedLegend(),
              ],
              const SizedBox(height: 12),
              Text(_tr(verse, lang),
                  style: TextStyle(
                      fontSize: 14,
                      height: 1.5,
                      color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: _PlayButton(verseId: widget.verseId)),
                  const SizedBox(width: 10),
                  _IconAction(
                    icon: Icons.copy,
                    label: 'Salin',
                    onTap: () async {
                      await Clipboard.setData(ClipboardData(
                          text:
                              '${verse.textUthmani}\n\n${_tr(verse, lang)}\n(${surah.nameTrans} ${verse.surahId}:${verse.verseNumber})'));
                      if (context.mounted) {
                        ScaffoldMessenger.of(context)
                            .showSnackBar(const SnackBar(content: Text('Ayat disalin')));
                      }
                    },
                  ),
                  const SizedBox(width: 10),
                  _IconAction(
                    icon: _showWords ? Icons.translate : Icons.translate_outlined,
                    label: 'Perkataan',
                    active: _showWords,
                    onTap: () => setState(() => _showWords = !_showWords),
                  ),
                  const SizedBox(width: 10),
                  _IconAction(
                    icon: context.watch<UserData>().hasNote(widget.verseId)
                        ? Icons.edit_note
                        : Icons.note_add_outlined,
                    label: 'Nota',
                    active: _editingNote,
                    onTap: () => setState(() => _editingNote = !_editingNote),
                  ),
                ],
              ),
              if (_editingNote) ...[
                const SizedBox(height: 14),
                TextField(
                  controller: _noteController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Tulis nota anda untuk ayat ini…',
                    filled: true,
                    fillColor: dark ? CaknaColors.surfaceDark : CaknaColors.bg,
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: dark ? CaknaColors.borderDark : CaknaColors.border)),
                  ),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: CaknaColors.olive),
                    onPressed: () async {
                      await context.read<UserData>().setNote(widget.verseId, _noteController.text);
                      if (context.mounted) {
                        setState(() => _editingNote = false);
                        ScaffoldMessenger.of(context)
                            .showSnackBar(const SnackBar(content: Text('Nota disimpan')));
                      }
                    },
                    child: const Text('Simpan'),
                  ),
                ),
              ],
              if (_showWords) ...[
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  textDirection: TextDirection.rtl,
                  children: [
                    for (final w in words)
                      Container(
                        constraints: const BoxConstraints(minWidth: 64),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
                          color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
                        ),
                        child: Column(
                          children: [
                            Text(w.arabic,
                                textDirection: TextDirection.rtl,
                                style: const TextStyle(fontFamily: 'Uthmani', fontSize: 22)),
                            const SizedBox(height: 3),
                            Text(_wordGloss(w, lang),
                                textDirection: TextDirection.ltr,
                                style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
                          ],
                        ),
                      ),
                  ],
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}

class _TajweedLegend extends StatelessWidget {
  const _TajweedLegend();

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 6,
      children: [
        for (final (code, label) in Tajweed.legend)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: Tajweed.colors[code],
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(width: 4),
              Text(label, style: const TextStyle(fontSize: 10.5, color: CaknaColors.inkSoft)),
            ],
          ),
      ],
    );
  }
}

class _PlayButton extends StatelessWidget {
  final int verseId;
  const _PlayButton({required this.verseId});

  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioService>();
    final playing = audio.playingVerseId == verseId && audio.isPlaying;
    return FilledButton.icon(
      style: FilledButton.styleFrom(
          backgroundColor: CaknaColors.olive, minimumSize: const Size.fromHeight(46)),
      onPressed: () => context.read<AudioService>().toggleVerse(verseId),
      icon: Icon(playing ? Icons.stop : Icons.play_arrow),
      label: Text(playing ? 'Berhenti' : 'Main'),
    );
  }
}

class _IconAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool active;
  const _IconAction(
      {required this.icon, required this.label, required this.onTap, this.active = false});

  @override
  Widget build(BuildContext context) {
    final color = active ? CaknaColors.olive : CaknaColors.inkSoft;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 22, color: color),
            const SizedBox(height: 3),
            Text(label, style: TextStyle(fontSize: 10, color: color)),
          ],
        ),
      ),
    );
  }
}
