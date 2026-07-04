import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../theme.dart';
import '../widgets/khatam_card.dart';
import '../widgets/next_prayer_card.dart';
import 'mathurat_screen.dart';
import 'prayer_times_screen.dart';
import 'qibla_screen.dart';
import 'reader_screen.dart';

/// Home dashboard: continue-reading card + quick module shortcuts.
/// (Prayer-times card and richer widgets land in a later pass.)
class HomeScreen extends StatelessWidget {
  final void Function(int tabIndex)? onNavigateTab;
  const HomeScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SizedBox(height: 8),
            Text('Cakna',
                style: TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 30,
                    fontWeight: FontWeight.w600,
                    color: CaknaColors.tealDeep)),
            const Text('Mushaf Digital',
                style: TextStyle(fontSize: 13, color: CaknaColors.inkSoft)),
            const SizedBox(height: 20),
            _ContinueCard(
              page: app.lastPage,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: app.lastPage)),
              ),
            ),
            const SizedBox(height: 14),
            const NextPrayerCard(),
            const SizedBox(height: 14),
            const KhatamCard(),
            const SizedBox(height: 20),
            const Text('Modul',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              children: [
                _ModuleTile(icon: Icons.menu_book, label: 'Al-Quran', onTap: () => onNavigateTab?.call(1)),
                _ModuleTile(
                    icon: Icons.access_time,
                    label: 'Solat',
                    onTap: () => Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const PrayerTimesScreen()))),
                _ModuleTile(
                    icon: Icons.explore,
                    label: 'Kiblat',
                    onTap: () => Navigator.push(
                        context, MaterialPageRoute(builder: (_) => const QiblaScreen()))),
                _ModuleTile(
                    icon: Icons.brightness_5,
                    label: "Ma'thurat",
                    onTap: () => Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const MathuratScreen()))),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ContinueCard extends StatelessWidget {
  final int page;
  final VoidCallback onTap;
  const _ContinueCard({required this.page, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: const LinearGradient(
            colors: [CaknaColors.teal, CaknaColors.tealBright],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Row(
          children: [
            const Icon(Icons.menu_book, color: Colors.white, size: 32),
            const SizedBox(width: 14),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Sambung bacaan',
                    style: TextStyle(color: Colors.white70, fontSize: 12)),
                Text('Halaman $page',
                    style: const TextStyle(
                        color: Colors.white, fontSize: 20, fontWeight: FontWeight.w700)),
              ],
            ),
            const Spacer(),
            const Icon(Icons.arrow_forward_ios, color: Colors.white70, size: 16),
          ],
        ),
      ),
    );
  }
}

class _ModuleTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _ModuleTile({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              color: CaknaColors.teal.withValues(alpha: dark ? 0.18 : 0.10),
            ),
            child: Icon(icon, color: CaknaColors.teal),
          ),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 11), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
