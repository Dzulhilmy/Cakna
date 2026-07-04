import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../screens/prayer_times_screen.dart';
import '../services/location_service.dart';
import '../theme.dart';
import '../utils/prayers.dart';

/// Compact next-prayer card for the home dashboard. Uses a silent location
/// lookup (no permission prompt); taps through to the full prayer screen.
class NextPrayerCard extends StatefulWidget {
  const NextPrayerCard({super.key});

  @override
  State<NextPrayerCard> createState() => _NextPrayerCardState();
}

class _NextPrayerCardState extends State<NextPrayerCard> {
  PrayerCalc? _calc;
  Timer? _ticker;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _load();
    _ticker = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    final loc = await LocationService.currentSilent();
    if (!mounted) return;
    setState(() => _calc = PrayerCalc.forDate(loc.lat, loc.lng, DateTime.now()));
  }

  @override
  Widget build(BuildContext context) {
    final calc = _calc;
    if (calc == null) return const SizedBox.shrink();
    final (name, time) = calc.nextPrayer(_now);
    final diff = time.difference(_now);
    final h = diff.inHours, m = diff.inMinutes % 60;
    final countdown = h > 0 ? '$h jam $m minit' : '$m minit';

    return InkWell(
      onTap: () => Navigator.push(
          context, MaterialPageRoute(builder: (_) => const PrayerTimesScreen())),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.35)),
          color: CaknaColors.olive.withValues(alpha: 0.06),
        ),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: CaknaColors.olive.withValues(alpha: 0.14),
              ),
              child: const Icon(Icons.access_time_filled, color: CaknaColors.olive),
            ),
            const SizedBox(width: 14),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Solat seterusnya · $name',
                    style: const TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
                Text('${DateFormat('h:mm a').format(time)}  ·  dalam $countdown',
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w700, color: CaknaColors.oliveDeep)),
              ],
            ),
            const Spacer(),
            const Icon(Icons.chevron_right, color: CaknaColors.inkSoft),
          ],
        ),
      ),
    );
  }
}
