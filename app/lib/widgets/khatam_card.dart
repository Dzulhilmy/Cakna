import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/user_data.dart';
import '../theme.dart';

/// Khatam (Quran-completion) progress + reading stats, shared by Home and
/// Profile. Reads live from UserData.
class KhatamCard extends StatelessWidget {
  const KhatamCard({super.key});

  @override
  Widget build(BuildContext context) {
    final u = context.watch<UserData>();
    final pct = (u.khatamProgress * 100).clamp(0, 100);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Kemajuan khatam',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                Text('${pct.toStringAsFixed(pct < 10 ? 1 : 0)}%',
                    style: const TextStyle(
                        color: CaknaColors.oliveDeep, fontWeight: FontWeight.w700, fontSize: 15)),
              ],
            ),
            const SizedBox(height: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: u.khatamProgress,
                minHeight: 9,
                backgroundColor: CaknaColors.olive.withValues(alpha: 0.12),
                valueColor: const AlwaysStoppedAnimation(CaknaColors.olive),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                _Stat(value: '${u.readCount}', label: 'Halaman dibaca'),
                _divider(),
                _Stat(value: '${u.todayPages}', label: 'Hari ini'),
                _divider(),
                _Stat(value: '${u.streak}', label: 'Hari berturut'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _divider() =>
      Container(width: 1, height: 34, color: CaknaColors.border.withValues(alpha: 0.6));
}

class _Stat extends StatelessWidget {
  final String value;
  final String label;
  const _Stat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value,
              style: const TextStyle(
                  fontSize: 20, fontWeight: FontWeight.w700, color: CaknaColors.oliveDeep)),
          const SizedBox(height: 2),
          Text(label,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 10.5, color: CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}
