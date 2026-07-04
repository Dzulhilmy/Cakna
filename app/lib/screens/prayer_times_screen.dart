import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../services/location_service.dart';
import '../services/notification_service.dart';
import '../state/app_state.dart';
import '../theme.dart';
import '../utils/prayers.dart';

class PrayerTimesScreen extends StatefulWidget {
  const PrayerTimesScreen({super.key});

  @override
  State<PrayerTimesScreen> createState() => _PrayerTimesScreenState();
}

class _PrayerTimesScreenState extends State<PrayerTimesScreen> {
  PrayerCalc? _calc;
  bool _fallback = false;
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
    final loc = await LocationService.current();
    if (!mounted) return;
    setState(() {
      _calc = PrayerCalc.forDate(loc.lat, loc.lng, DateTime.now());
      _fallback = loc.isFallback;
    });
  }

  @override
  Widget build(BuildContext context) {
    final calc = _calc;
    return Scaffold(
      appBar: AppBar(title: const Text('Waktu Solat')),
      body: calc == null
          ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _NextPrayerCard(calc: calc, now: _now),
                const SizedBox(height: 16),
                Card(
                  child: Column(
                    children: [
                      for (final (i, entry) in calc.all.indexed) ...[
                        if (i > 0) const Divider(height: 1),
                        _PrayerRow(
                          label: entry.$1,
                          time: entry.$2,
                          isNext: entry.$1 == calc.nextPrayer(_now).$1,
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                _AzanToggle(calc: calc),
                const SizedBox(height: 12),
                Text(
                  'Waktu dikira secara astronomi (Subuh 20°, Isyak 18°, Asar Syafi\'i). '
                  '${_fallback ? "Lokasi lalai: Kuala Lumpur — benarkan akses lokasi untuk waktu tepat." : "Berdasarkan lokasi semasa anda."} '
                  'Rujuk takwim rasmi JAKIM untuk pengesahan.',
                  style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft, height: 1.5),
                ),
              ],
            ),
    );
  }
}

class _NextPrayerCard extends StatelessWidget {
  final PrayerCalc calc;
  final DateTime now;
  const _NextPrayerCard({required this.calc, required this.now});

  @override
  Widget build(BuildContext context) {
    final (name, time) = calc.nextPrayer(now);
    final diff = time.difference(now);
    final h = diff.inHours, m = diff.inMinutes % 60;
    final countdown = h > 0 ? '$h jam $m minit' : '$m minit';
    return Container(
      height: 150,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        image: const DecorationImage(
          image: AssetImage('assets/images/bg_prayer_times.jpg'),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [Colors.black.withValues(alpha: 0.55), Colors.black.withValues(alpha: 0.25)],
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            const Text('Solat seterusnya',
                style: TextStyle(color: Colors.white70, fontSize: 13)),
            Text(name,
                style: const TextStyle(
                    color: Colors.white, fontSize: 30, fontFamily: 'Lora', fontWeight: FontWeight.w600)),
            Text('${DateFormat('h:mm a').format(time)}  ·  dalam $countdown',
                style: const TextStyle(color: Colors.white, fontSize: 14)),
          ],
        ),
      ),
    );
  }
}

class _AzanToggle extends StatelessWidget {
  final PrayerCalc calc;
  const _AzanToggle({required this.calc});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Row(
          children: [
            const Icon(Icons.notifications_active_outlined, color: CaknaColors.olive, size: 20),
            const SizedBox(width: 12),
            const Expanded(
              child: Text('Notifikasi azan', style: TextStyle(fontSize: 14)),
            ),
            Switch(
              value: app.azanEnabled,
              activeThumbColor: CaknaColors.olive,
              onChanged: (on) async {
                if (on) {
                  final granted = await NotificationService.requestPermission();
                  if (!granted) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                          content: Text('Kebenaran notifikasi diperlukan untuk azan.')));
                    }
                    return;
                  }
                  await NotificationService.scheduleAzan(calc.lat, calc.lng);
                } else {
                  await NotificationService.cancelAll();
                }
                if (context.mounted) {
                  context.read<AppState>().azanEnabled = on;
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                      content: Text(on
                          ? 'Notifikasi azan diaktifkan.'
                          : 'Notifikasi azan dimatikan.')));
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _PrayerRow extends StatelessWidget {
  final String label;
  final DateTime time;
  final bool isNext;
  const _PrayerRow({required this.label, required this.time, required this.isNext});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: isNext ? CaknaColors.olive.withValues(alpha: 0.08) : null,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: isNext ? FontWeight.w700 : FontWeight.w500,
                  color: isNext ? CaknaColors.oliveDeep : null)),
          Text(DateFormat('h:mm a').format(time),
              style: TextStyle(
                  fontSize: 15,
                  fontFeatures: const [],
                  fontWeight: isNext ? FontWeight.w700 : FontWeight.w500,
                  color: isNext ? CaknaColors.oliveDeep : null)),
        ],
      ),
    );
  }
}
