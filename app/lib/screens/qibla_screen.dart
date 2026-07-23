import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_compass/flutter_compass.dart';
import '../services/location_service.dart';
import '../utils/prayers.dart';

/// Qibla compass — dark full-screen with an olive accent ring and the qibla
/// bearing at centre (matches Tilawah's layout). Turns green when aligned.
class QiblaScreen extends StatefulWidget {
  const QiblaScreen({super.key});

  @override
  State<QiblaScreen> createState() => _QiblaScreenState();
}

class _QiblaScreenState extends State<QiblaScreen> {
  static const _bg = Color(0xFF0C0C09);
  static const _accent = Color(0xFFC9C87E); // warm olive-gold, legible on dark
  static const _aligned = Color(0xFF8FBF6B); // green when facing qibla

  double? _qibla;
  double _heading = 0;
  StreamSubscription? _sub;
  bool _noCompass = false;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final loc = await LocationService.current();
    if (!mounted) return;
    setState(() => _qibla = qiblaBearing(loc.lat, loc.lng));
    final stream = FlutterCompass.events;
    if (stream == null) {
      setState(() => _noCompass = true);
      return;
    }
    _sub = stream.listen((e) {
      if (e.heading != null && mounted) setState(() => _heading = e.heading!);
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final qibla = _qibla;
    final relative = qibla == null ? 0.0 : ((qibla - _heading) % 360 + 360) % 360;
    final isAligned = qibla != null && (relative < 5 || relative > 355);
    final accent = isAligned ? _aligned : _accent;

    return Scaffold(
      backgroundColor: _bg,
      body: SafeArea(
        child: Column(
          children: [
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white70),
                  onPressed: () => Navigator.maybePop(context),
                ),
                const Spacer(),
                const Padding(
                  padding: EdgeInsets.only(right: 16),
                  child: Text('Arah Kiblat',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontFamily: 'Lora')),
                ),
                const Spacer(),
                const SizedBox(width: 48),
              ],
            ),
            const SizedBox(height: 20),
            const Text('🕋', style: TextStyle(fontSize: 40)),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Text(
                _noCompass
                    ? 'Kompas tidak tersedia — gunakan bacaan darjah di bawah dengan kompas fizikal.'
                    : isAligned
                        ? 'Anda sedang menghadap kiblat.'
                        : 'Putarkan peranti sehingga penunjuk berada di atas.',
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: isAligned ? _aligned : Colors.white60, fontSize: 13, height: 1.4),
              ),
            ),
            Expanded(
              child: Center(
                child: qibla == null
                    ? const CircularProgressIndicator(strokeWidth: 2, color: Colors.white24)
                    : AspectRatio(
                        aspectRatio: 1,
                        child: Padding(
                          padding: const EdgeInsets.all(36),
                          child: CustomPaint(
                            painter: _QiblaDial(
                                heading: _heading, qibla: qibla, accent: accent),
                            child: Center(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text('${qibla.toStringAsFixed(1)}°',
                                      style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 44,
                                          fontWeight: FontWeight.w700)),
                                  const Text('dari Utara',
                                      style: TextStyle(color: Colors.white38, fontSize: 12)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _QiblaDial extends CustomPainter {
  final double heading, qibla;
  final Color accent;
  _QiblaDial({required this.heading, required this.qibla, required this.accent});

  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    final r = size.width / 2;

    // base ring
    canvas.drawCircle(
        c,
        r,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2
          ..color = Colors.white.withValues(alpha: 0.10));

    // tick marks (rotate with -heading so N is true north)
    for (var deg = 0; deg < 360; deg += 15) {
      final a = (deg - heading - 90) * math.pi / 180;
      final major = deg % 90 == 0;
      final inner = r - (major ? 16 : 9);
      canvas.drawLine(
        Offset(c.dx + inner * math.cos(a), c.dy + inner * math.sin(a)),
        Offset(c.dx + r * math.cos(a), c.dy + r * math.sin(a)),
        Paint()
          ..strokeWidth = major ? 2 : 1
          ..color = Colors.white.withValues(alpha: major ? 0.5 : 0.18),
      );
    }

    // cardinal letters
    const cards = {0: 'U', 90: 'T', 180: 'S', 270: 'B'};
    for (final e in cards.entries) {
      final a = (e.key - heading - 90) * math.pi / 180;
      final p = Offset(c.dx + (r - 34) * math.cos(a), c.dy + (r - 34) * math.sin(a));
      final tp = TextPainter(
        text: TextSpan(
            text: e.value,
            style: TextStyle(
                color: e.key == 0 ? accent : Colors.white54,
                fontSize: 15,
                fontWeight: FontWeight.w700)),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, p - Offset(tp.width / 2, tp.height / 2));
    }

    // qibla accent arc + marker at (qibla - heading)
    final qa = (qibla - heading - 90) * math.pi / 180;
    canvas.drawArc(
      Rect.fromCircle(center: c, radius: r),
      qa - 0.35,
      0.70,
      false,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 5
        ..strokeCap = StrokeCap.round
        ..color = accent,
    );
    final marker = Offset(c.dx + (r - 2) * math.cos(qa), c.dy + (r - 2) * math.sin(qa));
    canvas.drawCircle(marker, 7, Paint()..color = accent);

    // needle to qibla
    final tip = Offset(c.dx + (r - 20) * math.cos(qa), c.dy + (r - 20) * math.sin(qa));
    canvas.drawLine(
        c,
        tip,
        Paint()
          ..strokeWidth = 3
          ..strokeCap = StrokeCap.round
          ..color = accent.withValues(alpha: 0.8));
  }

  @override
  bool shouldRepaint(_QiblaDial old) =>
      old.heading != heading || old.qibla != qibla || old.accent != accent;
}
