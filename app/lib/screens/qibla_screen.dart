import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_compass/flutter_compass.dart';
import '../services/location_service.dart';
import '../theme.dart';
import '../utils/prayers.dart';

class QiblaScreen extends StatefulWidget {
  const QiblaScreen({super.key});

  @override
  State<QiblaScreen> createState() => _QiblaScreenState();
}

class _QiblaScreenState extends State<QiblaScreen> {
  double? _qibla; // bearing from north to Kaaba
  double _heading = 0; // device heading from north
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
    // angle of the qibla marker relative to the device's current heading
    final relative = qibla == null ? 0.0 : (qibla - _heading);
    final aligned = ((relative % 360) + 360) % 360;
    final isAligned = aligned < 5 || aligned > 355;

    return Scaffold(
      appBar: AppBar(title: const Text('Arah Kiblat')),
      body: qibla == null
          ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
          : Column(
              children: [
                const SizedBox(height: 24),
                Text('${qibla.toStringAsFixed(1)}° dari Utara',
                    style: const TextStyle(fontSize: 15, color: CaknaColors.inkSoft)),
                const SizedBox(height: 24),
                Expanded(
                  child: Center(
                    child: AspectRatio(
                      aspectRatio: 1,
                      child: Padding(
                        padding: const EdgeInsets.all(28),
                        child: _Compass(heading: _heading, qibla: qibla, aligned: isAligned),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text(
                    _noCompass
                        ? 'Kompas tidak tersedia pada peranti ini — gunakan bacaan darjah di atas dengan kompas fizikal.'
                        : isAligned
                            ? 'Anda sedang menghadap kiblat. 🕋'
                            : 'Putarkan peranti sehingga penunjuk emas berada di atas.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 13,
                        color: isAligned ? CaknaColors.olive : CaknaColors.inkSoft),
                  ),
                ),
              ],
            ),
    );
  }
}

class _Compass extends StatelessWidget {
  final double heading;
  final double qibla;
  final bool aligned;
  const _Compass({required this.heading, required this.qibla, required this.aligned});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Stack(
      alignment: Alignment.center,
      children: [
        // dial rotates opposite to heading so N points to true north
        Transform.rotate(
          angle: -heading * math.pi / 180,
          child: CustomPaint(size: Size.infinite, painter: _DialPainter(dark: dark)),
        ),
        // qibla needle points to (qibla - heading)
        Transform.rotate(
          angle: (qibla - heading) * math.pi / 180,
          child: CustomPaint(
            size: Size.infinite,
            painter: _NeedlePainter(color: aligned ? CaknaColors.olive : CaknaColors.gold),
          ),
        ),
        Container(
          width: 14,
          height: 14,
          decoration: const BoxDecoration(color: CaknaColors.oliveDeep, shape: BoxShape.circle),
        ),
      ],
    );
  }
}

class _DialPainter extends CustomPainter {
  final bool dark;
  _DialPainter({required this.dark});

  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    final r = size.width / 2;
    final ring = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..color = dark ? CaknaColors.borderDark : CaknaColors.border;
    canvas.drawCircle(c, r, ring);

    const marks = {0: 'U', 90: 'T', 180: 'S', 270: 'B'};
    for (final entry in marks.entries) {
      final ang = (entry.key - 90) * math.pi / 180;
      final p = Offset(c.dx + (r - 18) * math.cos(ang), c.dy + (r - 18) * math.sin(ang));
      final tp = TextPainter(
        text: TextSpan(
            text: entry.value,
            style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: entry.key == 0 ? CaknaColors.olive : CaknaColors.inkSoft)),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, p - Offset(tp.width / 2, tp.height / 2));
    }
  }

  @override
  bool shouldRepaint(_DialPainter old) => old.dark != dark;
}

class _NeedlePainter extends CustomPainter {
  final Color color;
  _NeedlePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    final r = size.width / 2 - 30;
    final tip = Offset(c.dx, c.dy - r);
    final left = Offset(c.dx - 12, c.dy);
    final right = Offset(c.dx + 12, c.dy);
    final path = Path()
      ..moveTo(tip.dx, tip.dy)
      ..lineTo(left.dx, left.dy)
      ..lineTo(right.dx, right.dy)
      ..close();
    canvas.drawPath(path, Paint()..color = color);
    // Kaaba glyph at the tip
    final tp = TextPainter(
      text: const TextSpan(text: '🕋', style: TextStyle(fontSize: 22)),
      textDirection: TextDirection.ltr,
    )..layout();
    tp.paint(canvas, tip - Offset(tp.width / 2, tp.height + 2));
  }

  @override
  bool shouldRepaint(_NeedlePainter old) => old.color != color;
}
