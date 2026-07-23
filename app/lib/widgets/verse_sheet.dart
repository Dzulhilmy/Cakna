import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../data/timing_repo.dart';
import '../quran/tajweed.dart';
import '../services/tafsir_service.dart';
import '../state/app_state.dart';
import '../state/audio_service.dart';
import '../state/user_data.dart';
import '../theme.dart';
import '../utils/note_text.dart';
import 'share_ayah.dart';

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

/// Shows the collection picker and files the ayah into the chosen collection.
/// Shared by the verse sheet (mushaf mode) and the translation reader.
Future<void> pickCollectionAndBookmark(BuildContext context, int verseId) async {
  final app = context.read<AppState>();
  final name = await showModalBottomSheet<String>(
    context: context,
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
    builder: (ctx) => SafeArea(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text('Tambah ke koleksi',
                  style:
                      TextStyle(fontFamily: 'Lora', fontSize: 17, fontWeight: FontWeight.w600)),
            ),
          ),
          for (final c in app.collections)
            ListTile(
              leading: const Icon(Icons.folder_outlined, color: CaknaColors.olive),
              title: Text(c),
              onTap: () => Navigator.pop(ctx, c),
            ),
        ],
      ),
    ),
  );
  if (name != null && context.mounted) {
    await context.read<UserData>().addBookmarkTo(verseId, name);
    if (context.mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Ditambah ke "$name"')));
    }
  }
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
  bool _showTafsir = false;
  bool _editingNote = false;
  QuillController? _quill; // rich-note editor, created when editing opens

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
  }

  void _toggleNote() {
    _quill ??= QuillController(
      document: noteDocument(context.read<UserData>().noteBody(widget.verseId)),
      selection: const TextSelection.collapsed(offset: 0),
    );
    setState(() => _editingNote = !_editingNote);
  }

  @override
  void dispose() {
    _quill?.dispose();
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
    final app = context.watch<AppState>();
    final tajweedOn = app.tajweed;
    // Tajweed rules align 1:1 with text_madani codepoints (not text_uthmani),
    // rendered with the MeQuran font. The plain view keeps the Uthmani script.
    final base = TextStyle(
      fontFamily: tajweedOn ? 'MeQuran' : 'Uthmani',
      fontSize: app.arabicFontSize,
      height: 1.9,
      color: dark ? CaknaColors.inkDark : CaknaColors.ink,
    );
    if (words.isEmpty) {
      return [TextSpan(text: fallback, style: base.copyWith(fontFamily: 'Uthmani'))];
    }
    final out = <InlineSpan>[];
    for (var i = 0; i < words.length; i++) {
      if (tajweedOn) {
        out.addAll(Tajweed.spans(words[i].madani, words[i].rules, base));
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
        return Padding(
          // lift the sheet above the keyboard while editing a note
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: ConstrainedBox(
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
                      fontSize: context.watch<AppState>().translationFontSize,
                      height: 1.5,
                      color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  style: TextButton.styleFrom(
                      padding: EdgeInsets.zero, foregroundColor: CaknaColors.olive),
                  onPressed: () => setState(() => _showTafsir = !_showTafsir),
                  icon: Icon(_showTafsir ? Icons.expand_less : Icons.expand_more, size: 18),
                  label: Text(_showTafsir ? 'Tutup tafsir' : 'Baca tafsir',
                      style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
                ),
              ),
              if (_showTafsir)
                _TafsirSection(
                    surahId: verse.surahId, verseNumber: verse.verseNumber, dark: dark),
              const SizedBox(height: 8),
              // Flexible + FittedBox: five labelled actions plus the play
              // button exceed 320pt (and any width at large OS text scale) —
              // scale the actions down instead of overflowing.
              Row(
                children: [
                  Expanded(flex: 3, child: _PlayButton(verseId: widget.verseId)),
                  const SizedBox(width: 6),
                  _flexAction(_IconAction(
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
                  )),
                  const SizedBox(width: 6),
                  _flexAction(_IconAction(
                    icon: Icons.ios_share,
                    label: 'Kongsi',
                    onTap: () => showShareAyahSheet(context, widget.verseId),
                  )),
                  const SizedBox(width: 6),
                  _flexAction(_IconAction(
                    icon: Icons.grid_view_outlined,
                    label: 'Koleksi',
                    onTap: () => pickCollectionAndBookmark(context, widget.verseId),
                  )),
                  const SizedBox(width: 6),
                  _flexAction(_IconAction(
                    icon: _showWords ? Icons.translate : Icons.translate_outlined,
                    label: 'Perkataan',
                    active: _showWords,
                    onTap: () => setState(() => _showWords = !_showWords),
                  )),
                  const SizedBox(width: 6),
                  _flexAction(_IconAction(
                    icon: context.watch<UserData>().hasNote(widget.verseId)
                        ? Icons.edit_note
                        : Icons.note_add_outlined,
                    label: 'Nota',
                    active: _editingNote,
                    onTap: _toggleNote,
                  )),
                ],
              ),
              if (_editingNote && _quill != null) ...[
                const SizedBox(height: 14),
                // rich note editing (Tilawah parity): bold/italic/underline,
                // colours and lists; stored as a Quill delta with plain-text
                // back-compat for older notes
                QuillSimpleToolbar(
                  controller: _quill!,
                  config: const QuillSimpleToolbarConfig(
                    multiRowsDisplay: false,
                    showFontFamily: false,
                    showFontSize: false,
                    showHeaderStyle: false,
                    showStrikeThrough: false,
                    showInlineCode: false,
                    showCodeBlock: false,
                    showQuote: false,
                    showIndent: false,
                    showLink: false,
                    showUndo: false,
                    showRedo: false,
                    showSubscript: false,
                    showSuperscript: false,
                    showSearchButton: false,
                    showAlignmentButtons: false,
                    showDirection: false,
                    showListCheck: false,
                    showClearFormat: false,
                    showClipboardCut: false,
                    showClipboardCopy: false,
                    showClipboardPaste: false,
                    showDividers: false,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  height: 150,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: dark ? CaknaColors.surfaceDark : CaknaColors.bg,
                    borderRadius: BorderRadius.circular(12),
                    border:
                        Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
                  ),
                  child: QuillEditor.basic(
                    controller: _quill!,
                    config: const QuillEditorConfig(
                      placeholder: 'Tulis nota anda untuk ayat ini…',
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: CaknaColors.olive),
                    onPressed: () async {
                      await context
                          .read<UserData>()
                          .setNote(widget.verseId, encodeNote(_quill!.document));
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
                // word-by-word: tap a word to hear it (when the reciter has
                // timing data); the sounding word is tinted while playing
                FutureBuilder<List<WordTiming>>(
                  future: context.read<AudioService>().wordTimings(widget.verseId),
                  builder: (context, tSnap) {
                    final timings = {for (final t in tSnap.data ?? const <WordTiming>[]) t.word: t};
                    final audio = context.watch<AudioService>();
                    final sounding = audio.playingVerseId == widget.verseId
                        ? audio.playingWordPos
                        : null;
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (tSnap.connectionState == ConnectionState.done && timings.isEmpty)
                          const Padding(
                            padding: EdgeInsets.only(bottom: 8),
                            child: Text('Audio per perkataan tiada untuk qari ini.',
                                style: TextStyle(fontSize: 11.5, color: CaknaColors.inkSoft)),
                          ),
                        Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      textDirection: TextDirection.rtl,
                      children: [
                        for (var i = 0; i < words.length; i++)
                          InkWell(
                            onTap: timings[i + 1] == null
                                ? null
                                : () => context
                                    .read<AudioService>()
                                    .playWord(widget.verseId, timings[i + 1]!),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              constraints: const BoxConstraints(minWidth: 64),
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                    color: sounding == i + 1
                                        ? CaknaColors.olive
                                        : dark
                                            ? CaknaColors.borderDark
                                            : CaknaColors.border),
                                color: sounding == i + 1
                                    ? CaknaColors.olive.withValues(alpha: dark ? 0.25 : 0.12)
                                    : dark
                                        ? CaknaColors.surfaceDark
                                        : CaknaColors.surface,
                              ),
                              child: Column(
                                children: [
                                  Text(words[i].arabic,
                                      textDirection: TextDirection.rtl,
                                      style: const TextStyle(
                                          fontFamily: 'Uthmani', fontSize: 22)),
                                  const SizedBox(height: 3),
                                  Text(_wordGloss(words[i], lang),
                                      textDirection: TextDirection.ltr,
                                      style: const TextStyle(
                                          fontSize: 11, color: CaknaColors.inkSoft)),
                                ],
                              ),
                            ),
                          ),
                      ],
                        ),
                      ],
                    );
                  },
                ),
              ],
            ],
          ),
          ),
        );
      },
    );
  }
}

class _TafsirSection extends StatefulWidget {
  final int surahId, verseNumber;
  final bool dark;
  const _TafsirSection({required this.surahId, required this.verseNumber, required this.dark});

  @override
  State<_TafsirSection> createState() => _TafsirSectionState();
}

class _TafsirSectionState extends State<_TafsirSection> {
  // cache the fetch per edition — the parent sheet rebuilds on every
  // AppState/UserData notify, and a fresh future each build would collapse
  // the loaded tafsir back to a spinner (and refetch) on unrelated taps
  Future<String?>? _future;
  int _edition = -1;

  int get surahId => widget.surahId;
  int get verseNumber => widget.verseNumber;
  bool get dark => widget.dark;

  @override
  Widget build(BuildContext context) {
    final edition = context.watch<AppState>().tafsirEdition;
    if (_edition != edition) {
      _edition = edition;
      _future = TafsirService.fetch(edition, surahId, verseNumber);
    }
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: dark ? CaknaColors.surfaceDark : CaknaColors.bg,
        border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
      ),
      child: FutureBuilder<String?>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
            );
          }
          final text = snap.data;
          // the Arabic editions (Muyassar 16, Ibn Kathir 14) must lay out RTL
          // in an Arabic face; the default LTR Inter render is visually broken
          final arabicEd = edition == 16 || edition == 14;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(tafsirEditionName(edition),
                  style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w700,
                      color: CaknaColors.oliveDeep)),
              const SizedBox(height: 6),
              Text(
                text ?? 'Tafsir tidak dapat dimuatkan — semak sambungan internet.',
                textDirection: arabicEd && text != null ? TextDirection.rtl : TextDirection.ltr,
                textAlign: arabicEd && text != null ? TextAlign.right : TextAlign.left,
                style: TextStyle(
                    fontFamily: arabicEd && text != null ? 'Uthmani' : null,
                    fontSize: arabicEd && text != null ? 16 : 12.5,
                    height: arabicEd && text != null ? 1.9 : 1.55,
                    color: dark ? CaknaColors.inkDark : CaknaColors.ink),
              ),
            ],
          );
        },
      ),
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

Widget _flexAction(Widget child) =>
    Flexible(child: FittedBox(fit: BoxFit.scaleDown, child: child));

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
