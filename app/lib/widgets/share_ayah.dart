import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../theme.dart';
import 'ayah_marker.dart';

/// Share sheet for one ayah: a branded preview card with "Kongsi teks"
/// (plain text) and "Kongsi imej" (the card rendered to a PNG) actions.
Future<void> showShareAyahSheet(BuildContext context, int verseId) async {
  final repo = context.read<QuranRepo>();
  final verse = await repo.verse(verseId);
  final surah = await repo.surah(verse.surahId);
  if (!context.mounted) return;
  await showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => _ShareAyahSheet(verse: verse, surah: surah),
  );
}

class _ShareAyahSheet extends StatefulWidget {
  final Verse verse;
  final Surah surah;
  const _ShareAyahSheet({required this.verse, required this.surah});

  @override
  State<_ShareAyahSheet> createState() => _ShareAyahSheetState();
}

class _ShareAyahSheetState extends State<_ShareAyahSheet> {
  final _cardKey = GlobalKey();
  bool _busy = false;

  String _tr(String lang) => switch (lang) {
        'en' => widget.verse.translationEn,
        'id' => widget.verse.translationId,
        _ => widget.verse.translationMs,
      };

  String _shareText(String lang) =>
      '${widget.verse.textUthmani}\n\n${_tr(lang)}\n(${widget.surah.nameTrans} ${widget.verse.surahId}:${widget.verse.verseNumber})\n\n— Cakna';

  Future<void> _shareAsText() async {
    final lang = context.read<AppState>().transLang;
    await SharePlus.instance.share(ShareParams(text: _shareText(lang)));
  }

  Future<void> _shareAsImage() async {
    setState(() => _busy = true);
    try {
      final boundary =
          _cardKey.currentContext!.findRenderObject()! as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 3);
      final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
      final dir = await getTemporaryDirectory();
      final file = File(
          '${dir.path}/cakna_${widget.verse.surahId}_${widget.verse.verseNumber}.png');
      await file.writeAsBytes(bytes!.buffer.asUint8List());
      await SharePlus.instance.share(ShareParams(
        files: [XFile(file.path, mimeType: 'image/png')],
        text: '${widget.surah.nameTrans} ${widget.verse.surahId}:${widget.verse.verseNumber}',
      ));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = context.watch<AppState>().transLang;
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Kongsi ayat',
                style: TextStyle(fontFamily: 'Lora', fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 14),
            RepaintBoundary(
              key: _cardKey,
              child: _AyahCard(verse: widget.verse, surah: widget.surah, translation: _tr(lang)),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _busy ? null : _shareAsText,
                    icon: const Icon(Icons.notes),
                    label: const Text('Kongsi teks'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton.icon(
                    style: FilledButton.styleFrom(backgroundColor: CaknaColors.olive),
                    onPressed: _busy ? null : _shareAsImage,
                    icon: _busy
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.image_outlined),
                    label: const Text('Kongsi imej'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// The branded card that gets rendered to the shared image.
class _AyahCard extends StatelessWidget {
  final Verse verse;
  final Surah surah;
  final String translation;
  const _AyahCard({required this.verse, required this.surah, required this.translation});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(22, 24, 22, 18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFFFDFBF4), Color(0xFFF3EEDD)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.45)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text.rich(
            TextSpan(children: [
              TextSpan(
                text: verse.textUthmani,
                style: const TextStyle(
                    fontFamily: 'Uthmani',
                    fontSize: 24,
                    height: 1.9,
                    color: CaknaColors.ink),
              ),
              const TextSpan(text: ' '),
              WidgetSpan(
                alignment: PlaceholderAlignment.middle,
                child: AyahEndMarker(number: verse.verseNumber, size: 28),
              ),
            ]),
            textAlign: TextAlign.center,
            textDirection: TextDirection.rtl,
          ),
          const SizedBox(height: 14),
          Text(translation,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13.5, height: 1.55, color: CaknaColors.inkSoft)),
          const SizedBox(height: 14),
          Text('${surah.nameTrans} · ${verse.surahId}:${verse.verseNumber}',
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 12, fontWeight: FontWeight.w700, color: CaknaColors.oliveDeep)),
          const SizedBox(height: 10),
          Container(height: 1, color: CaknaColors.olive.withValues(alpha: 0.25)),
          const SizedBox(height: 8),
          const Text('Cakna — Digital Mushaf',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 10.5, color: CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}
