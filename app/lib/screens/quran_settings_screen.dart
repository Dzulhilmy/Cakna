import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../theme.dart';
import 'audio_downloads_screen.dart';
import 'tajweed_guide_screen.dart';

const _langs = [('ms', 'Bahasa Melayu'), ('en', 'English'), ('id', 'Bahasa Indonesia')];

/// Quran settings (matches Tilawah): reading-mode toggle, Arabic + translation
/// font sizes, tajweed, and tafsir (translation language), with a live preview.
class QuranSettingsScreen extends StatelessWidget {
  const QuranSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final repo = context.read<QuranRepo>();
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(title: const Text('Tetapan Quran')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 32),
        children: [
          // ---- live preview (Al-Fatihah 1:1 = bismillah) ----
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: dark ? CaknaColors.surfaceDark : const Color(0xFFF1F0E9),
              borderRadius: BorderRadius.circular(16),
            ),
            child: FutureBuilder<Verse>(
              future: repo.verse(1),
              builder: (context, snap) {
                final v = snap.data;
                return Column(
                  children: [
                    Text(
                      v?.textUthmani ?? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
                      textAlign: TextAlign.center,
                      textDirection: TextDirection.rtl,
                      style: TextStyle(
                          fontFamily: 'Uthmani',
                          fontSize: app.arabicFontSize,
                          height: 1.8),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      v == null ? '' : _tr(v, app.transLang),
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: app.translationFontSize,
                          height: 1.45,
                          color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
                    ),
                  ],
                );
              },
            ),
          ),
          const SizedBox(height: 22),

          const _Label('Mod bacaan'),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'mushaf', label: Text('Mushaf'), icon: Icon(Icons.menu_book_outlined)),
              ButtonSegment(
                  value: 'translation', label: Text('Terjemahan'), icon: Icon(Icons.notes_outlined)),
            ],
            selected: {app.readingMode},
            showSelectedIcon: false,
            onSelectionChanged: (s) => app.readingMode = s.first,
            style: SegmentedButton.styleFrom(
              selectedBackgroundColor: CaknaColors.olive.withValues(alpha: 0.16),
              selectedForegroundColor: CaknaColors.oliveDeep,
            ),
          ),
          const SizedBox(height: 22),

          const _Label('Saiz tulisan Arab'),
          _FontSizeRow(
            presets: AppState.arabicSizePresets,
            value: app.arabicFontSize,
            onMinus: () => app.arabicFontSize = app.arabicFontSize - 2,
            onPlus: () => app.arabicFontSize = app.arabicFontSize + 2,
            onPreset: (s) => app.arabicFontSize = s,
          ),
          const SizedBox(height: 22),

          const _Label('Saiz terjemahan'),
          _FontSizeRow(
            presets: AppState.transSizePresets,
            value: app.translationFontSize,
            onMinus: () => app.translationFontSize = app.translationFontSize - 1,
            onPlus: () => app.translationFontSize = app.translationFontSize + 1,
            onPreset: (s) => app.translationFontSize = s,
          ),
          const SizedBox(height: 22),

          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Theme.of(context).dividerColor),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.brush_outlined, color: CaknaColors.olive),
                  title: const Text('Tajwid'),
                  subtitle: Text(app.tajweed ? 'Warna tajwid · panduan hukum' : 'Dimatikan'),
                  trailing: const Icon(Icons.chevron_right, color: CaknaColors.inkSoft),
                  onTap: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => const TajweedGuideScreen())),
                ),
                const Divider(height: 1, indent: 56),
                ListTile(
                  leading: const Icon(Icons.translate, color: CaknaColors.olive),
                  title: const Text('Terjemahan / Tafsir'),
                  subtitle: Text(_langName(app.transLang)),
                  trailing: const Icon(Icons.chevron_right, color: CaknaColors.inkSoft),
                  onTap: () => _pickLang(context, app),
                ),
                const Divider(height: 1, indent: 56),
                ListTile(
                  leading: const Icon(Icons.download_for_offline_outlined,
                      color: CaknaColors.olive),
                  title: const Text('Muat turun audio'),
                  subtitle: const Text('Simpan bacaan qari untuk luar talian'),
                  trailing: const Icon(Icons.chevron_right, color: CaknaColors.inkSoft),
                  onTap: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => const AudioDownloadsScreen())),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _tr(Verse v, String lang) => switch (lang) {
        'en' => v.translationEn,
        'id' => v.translationId,
        _ => v.translationMs,
      };

  static String _langName(String v) =>
      _langs.firstWhere((l) => l.$1 == v, orElse: () => _langs.first).$2;

  Future<void> _pickLang(BuildContext context, AppState app) async {
    final v = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (final (id, name) in _langs)
              ListTile(
                title: Text(name),
                trailing: id == app.transLang ? const Icon(Icons.check, color: CaknaColors.olive) : null,
                onTap: () => Navigator.pop(ctx, id),
              ),
          ],
        ),
      ),
    );
    if (v != null) app.transLang = v;
  }
}

class _Label extends StatelessWidget {
  final String text;
  const _Label(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 10, left: 2),
        child: Text(text.toUpperCase(),
            style: const TextStyle(
                fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: CaknaColors.inkSoft)),
      );
}

class _FontSizeRow extends StatelessWidget {
  final List<double> presets; // S M L XL
  final double value;
  final VoidCallback onMinus, onPlus;
  final ValueChanged<double> onPreset;
  const _FontSizeRow({
    required this.presets,
    required this.value,
    required this.onMinus,
    required this.onPlus,
    required this.onPreset,
  });

  static const _labels = ['S', 'M', 'L', 'XL'];

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: dark ? CaknaColors.surfaceDark : const Color(0xFFEDECE4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _btn(dark: dark, child: const Icon(Icons.remove, size: 18), onTap: onMinus),
          for (var i = 0; i < presets.length; i++)
            _btn(
              dark: dark,
              child: Text(_labels[i],
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13 + i * 1.0)),
              selected: (value - presets[i]).abs() < 0.5,
              onTap: () => onPreset(presets[i]),
            ),
          _btn(dark: dark, child: const Icon(Icons.add, size: 18), onTap: onPlus),
        ],
      ),
    );
  }

  Widget _btn(
      {required bool dark,
      required Widget child,
      bool selected = false,
      required VoidCallback onTap}) {
    final selBg = dark ? CaknaColors.olive : Colors.white;
    final selFg = dark ? Colors.white : CaknaColors.oliveDeep;
    final fg = selected ? selFg : (dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft);
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(2),
        child: Material(
          color: selected ? selBg : Colors.transparent,
          borderRadius: BorderRadius.circular(9),
          elevation: selected && !dark ? 1 : 0,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(9),
            child: Container(
              height: 40,
              alignment: Alignment.center,
              child: DefaultTextStyle.merge(
                style: TextStyle(color: fg),
                child: IconTheme.merge(data: IconThemeData(color: fg), child: child),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
