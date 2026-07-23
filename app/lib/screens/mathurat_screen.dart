import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../data/mathurat_repo.dart';
import '../data/models.dart';
import '../state/mathurat_state.dart';
import '../theme.dart';
import '../widgets/mathurat_card.dart';

/// Al-Ma'thurat: morning/evening wird with Sughra/Kubra versions and a
/// tap-to-count tracker (daily reset).
class MathuratScreen extends StatefulWidget {
  const MathuratScreen({super.key});

  @override
  State<MathuratScreen> createState() => _MathuratScreenState();
}

class _MathuratScreenState extends State<MathuratScreen> with WidgetsBindingObserver {
  late bool _pagi; // morning vs evening
  Future<List<MathuratItem>>? _future;

  @override
  void initState() {
    super.initState();
    _pagi = DateTime.now().hour < 15; // morning until mid-afternoon
    _future = context.read<MathuratRepo>().items();
    WidgetsBinding.instance.addObserver(this);
    context.read<MathuratState>().refreshDay();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (mounted) {
        setState(() => _pagi = DateTime.now().hour < 15);
        context.read<MathuratState>().refreshDay();
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<MathuratState>();
    final kubra = state.version == 'k';
    return Scaffold(
      appBar: AppBar(title: const Text("Al-Ma'thurat")),
      body: FutureBuilder<List<MathuratItem>>(
        future: _future,
        builder: (context, snap) {
          if (!snap.hasData) {
            return const Center(child: CircularProgressIndicator(strokeWidth: 2));
          }
          final all = snap.data!;
          final visible = kubra ? all : all.where((i) => !i.core).toList();
          final done = visible.where((i) {
            final idx = i.position - 1;
            return state.count(_pagi, idx) >= i.target(kubra);
          }).length;

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _Segment(
                left: 'Wirid Pagi',
                right: 'Wirid Petang',
                leftActive: _pagi,
                onLeft: () => setState(() => _pagi = true),
                onRight: () => setState(() => _pagi = false),
              ),
              const SizedBox(height: 10),
              _Segment(
                left: 'Sughra',
                right: 'Kubra',
                leftActive: !kubra,
                onLeft: () => state.setVersion('s'),
                onRight: () => state.setVersion('k'),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  const Text('Papar maksud', style: TextStyle(fontSize: 14)),
                  const Spacer(),
                  Switch(
                    value: state.showMeaning,
                    activeThumbColor: CaknaColors.olive,
                    onChanged: state.setShowMeaning,
                  ),
                ],
              ),
              const SizedBox(height: 6),
              _ProgressCard(done: done, total: visible.length),
              const SizedBox(height: 14),
              for (final (i, item) in visible.indexed)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: MathuratCard(
                    serial: i + 1,
                    item: item,
                    pagi: _pagi,
                    kubra: kubra,
                    onTap: () {
                      final idx = item.position - 1;
                      final tgt = item.target(kubra);
                      if (state.count(_pagi, idx) < tgt) {
                        HapticFeedback.selectionClick();
                        state.increment(_pagi, idx, tgt);
                        if (done + 1 == visible.length) {
                          HapticFeedback.mediumImpact();
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(
                                  'Alhamdulillah — ${_pagi ? "Wirid Pagi" : "Wirid Petang"} selesai!')));
                        }
                      }
                    },
                  ),
                ),
              const SizedBox(height: 4),
              TextButton.icon(
                onPressed: () => state.resetActive(_pagi),
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Set semula hari ini'),
                style: TextButton.styleFrom(foregroundColor: CaknaColors.inkSoft),
              ),
              const SizedBox(height: 8),
              Text(
                "Susunan Al-Ma'thurat (Imam Hasan al-Banna): Sughra ialah versi ringkas, "
                'Kubra versi penuh. Ketuk setiap item untuk mengira; kemajuan pagi, petang, '
                'Sughra dan Kubra direkod berasingan dan diset semula setiap hari.',
                style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft, height: 1.5),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _Segment extends StatelessWidget {
  final String left, right;
  final bool leftActive;
  final VoidCallback onLeft, onRight;
  const _Segment({
    required this.left,
    required this.right,
    required this.leftActive,
    required this.onLeft,
    required this.onRight,
  });

  @override
  Widget build(BuildContext context) {
    Widget seg(String label, bool active, VoidCallback onTap) => Expanded(
          child: GestureDetector(
            onTap: onTap,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 11),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: active ? CaknaColors.olive : Colors.transparent,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(label,
                  style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: active ? Colors.white : CaknaColors.inkSoft)),
            ),
          ),
        );
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: CaknaColors.olive.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(children: [seg(left, leftActive, onLeft), seg(right, !leftActive, onRight)]),
    );
  }
}

class _ProgressCard extends StatelessWidget {
  final int done, total;
  const _ProgressCard({required this.done, required this.total});

  @override
  Widget build(BuildContext context) {
    final frac = total == 0 ? 0.0 : done / total;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Kemajuan hari ini',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                Text('$done / $total selesai',
                    style: const TextStyle(color: CaknaColors.oliveDeep, fontWeight: FontWeight.w700)),
              ],
            ),
            const SizedBox(height: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: frac,
                minHeight: 8,
                backgroundColor: CaknaColors.olive.withValues(alpha: 0.12),
                valueColor: const AlwaysStoppedAnimation(CaknaColors.olive),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
