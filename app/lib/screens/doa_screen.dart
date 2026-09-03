import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../theme.dart';

class DoaScreen extends StatefulWidget {
  const DoaScreen({super.key});
  @override
  State<DoaScreen> createState() => _DoaScreenState();
}

class _DoaScreenState extends State<DoaScreen> {
  List<dynamic>? _items;
  int _expanded = -1;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/data/duas.json');
    setState(() => _items = jsonDecode(raw) as List<dynamic>);
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(title: const Text('Doa')),
      body: _items == null
          ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 32),
              itemCount: _items!.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (_, i) {
                final d = _items![i];
                final open = _expanded == i;
                return _DoaCard(
                  doa: d,
                  open: open,
                  dark: dark,
                  onTap: () => setState(() => _expanded = open ? -1 : i),
                );
              },
            ),
    );
  }
}

class _DoaCard extends StatelessWidget {
  final dynamic doa;
  final bool open;
  final bool dark;
  final VoidCallback onTap;
  const _DoaCard({required this.doa, required this.open, required this.dark, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final hasArabic = doa['arabic'] != null && (doa['arabic'] as String).isNotEmpty;
    final quranRef = doa['quran_ref'];
    final kind = doa['kind'] as String;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: open
              ? (dark ? CaknaColors.o700.withValues(alpha: 0.4) : CaknaColors.o300.withValues(alpha: 0.15))
              : (dark ? CaknaColors.surfaceDark : CaknaColors.surface),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: open ? CaknaColors.olive.withValues(alpha: 0.4) : (dark ? CaknaColors.borderDark : CaknaColors.border)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    doa['title_ms'] as String,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: CaknaColors.olive.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    kind == 'quran' ? 'Al-Quran' : 'Hadith',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: CaknaColors.olive),
                  ),
                ),
                const SizedBox(width: 6),
                Icon(
                  open ? Icons.expand_less : Icons.expand_more,
                  size: 20,
                  color: CaknaColors.inkSoft,
                ),
              ],
            ),
            if (open) ...[
              const SizedBox(height: 14),
              if (quranRef != null) ...[
                Text(
                  'Surah ${quranRef['surah']}:${quranRef['ayah_from']}${quranRef['ayah_to'] != quranRef['ayah_from'] ? '–${quranRef['ayah_to']}' : ''}',
                  style: TextStyle(
                      fontSize: 12,
                      color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
                      fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
              ],
              if (hasArabic) ...[
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    doa['arabic'] as String,
                    textAlign: TextAlign.right,
                    textDirection: TextDirection.rtl,
                    style: const TextStyle(
                        fontFamily: 'Uthmani', fontSize: 22, height: 2.0, color: CaknaColors.olive),
                  ),
                ),
                const SizedBox(height: 12),
              ],
              if (doa['meaning_ms'] != null && (doa['meaning_ms'] as String).isNotEmpty)
                Text(
                  doa['meaning_ms'] as String,
                  style: TextStyle(
                      fontSize: 13.5,
                      height: 1.6,
                      color: dark ? CaknaColors.inkDark : CaknaColors.ink),
                ),
            ],
          ],
        ),
      ),
    );
  }
}
