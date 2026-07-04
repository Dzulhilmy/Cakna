import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/mathurat_repo.dart';
import '../data/models.dart';
import '../state/app_state.dart';
import '../state/mathurat_state.dart';
import '../theme.dart';

/// One Al-Ma'thurat item card: index badge, title, RTL Arabic body (Quran
/// range from the DB or a dhikr string), optional meaning, and a tap-to-count
/// target pill. Dims when the target is reached.
class MathuratCard extends StatelessWidget {
  final int serial;
  final MathuratItem item;
  final bool pagi;
  final bool kubra;
  final VoidCallback onTap;

  const MathuratCard({
    super.key,
    required this.serial,
    required this.item,
    required this.pagi,
    required this.kubra,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final state = context.watch<MathuratState>();
    final lang = context.watch<AppState>().transLang;
    final en = lang == 'en';
    final idx = item.position - 1;
    final target = item.target(kubra);
    final count = state.count(pagi, idx);
    final complete = count >= target;

    return Opacity(
      opacity: complete ? 0.55 : 1,
      child: GestureDetector(
        onTap: onTap,
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 26,
                      height: 26,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: CaknaColors.gold.withValues(alpha: 0.25),
                        border: Border.all(color: CaknaColors.gold),
                      ),
                      child: Text('$serial',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(en ? item.titleEn : item.titleMs,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                    _TargetPill(count: count, target: target, complete: complete),
                  ],
                ),
                const SizedBox(height: 12),
                _ArabicBody(item: item, pagi: pagi),
                if (state.showMeaning) _Meaning(item: item, pagi: pagi, en: en),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TargetPill extends StatelessWidget {
  final int count, target;
  final bool complete;
  const _TargetPill({required this.count, required this.target, required this.complete});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: complete ? CaknaColors.teal : CaknaColors.teal.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(20),
      ),
      child: complete
          ? const Icon(Icons.check, size: 15, color: Colors.white)
          : Text('$count / $target',
              style: const TextStyle(
                  fontSize: 12, fontWeight: FontWeight.w700, color: CaknaColors.tealDeep)),
    );
  }
}

class _ArabicBody extends StatelessWidget {
  final MathuratItem item;
  final bool pagi;
  const _ArabicBody({required this.item, required this.pagi});

  @override
  Widget build(BuildContext context) {
    const style = TextStyle(fontFamily: 'Uthmani', fontSize: 22, height: 1.9);
    if (item.quranRef != null) {
      final repo = context.read<MathuratRepo>();
      return FutureBuilder<List<Verse>>(
        future: repo.versesFor(item.quranRef!),
        builder: (context, snap) {
          final verses = snap.data ?? const [];
          final text = verses
              .map((v) => '${v.textUthmani} ۝${_arabicNum(v.verseNumber)}')
              .join('  ');
          return Text(text,
              textAlign: TextAlign.right, textDirection: TextDirection.rtl, style: style);
        },
      );
    }
    final dhikr = item.dhikrFor(pagi) ?? '';
    return Text(dhikr, textAlign: TextAlign.right, textDirection: TextDirection.rtl, style: style);
  }
}

class _Meaning extends StatelessWidget {
  final MathuratItem item;
  final bool pagi;
  final bool en;
  const _Meaning({required this.item, required this.pagi, required this.en});

  @override
  Widget build(BuildContext context) {
    const muted = TextStyle(fontSize: 12.5, height: 1.5, color: CaknaColors.inkSoft);
    if (item.quranRef != null) {
      final repo = context.read<MathuratRepo>();
      return Padding(
        padding: const EdgeInsets.only(top: 10),
        child: FutureBuilder<List<Verse>>(
          future: repo.versesFor(item.quranRef!),
          builder: (context, snap) {
            final verses = snap.data ?? const [];
            final text = verses
                .map((v) => en ? v.translationEn : v.translationMs)
                .where((s) => s.isNotEmpty)
                .join(' ');
            return Text(text, style: muted);
          },
        ),
      );
    }
    final meaning = en ? item.meaningEn : item.meaningMs;
    if (meaning == null || meaning.isEmpty) return const SizedBox.shrink();
    return Padding(padding: const EdgeInsets.only(top: 10), child: Text(meaning, style: muted));
  }
}

const _arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
String _arabicNum(int n) =>
    n.toString().split('').map((d) => _arabicIndic[int.parse(d)]).join();
