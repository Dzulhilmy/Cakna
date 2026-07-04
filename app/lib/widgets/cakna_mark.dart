import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme.dart';

/// The Cakna brand mark — a ring ("O") cradling a heart — drawn as a vector so
/// it scales crisply and follows the theme colour.
class CaknaMark extends StatelessWidget {
  final double size;
  final Color? color;
  const CaknaMark({super.key, this.size = 40, this.color});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size.square(size),
      painter: _MarkPainter(color ?? CaknaColors.olive),
    );
  }
}

class _MarkPainter extends CustomPainter {
  final Color color;
  _MarkPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    final r = size.width * 0.44;
    // ring
    canvas.drawCircle(
      c,
      r,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = r * 0.15
        ..color = color,
    );
    // centred heart
    final path = Path();
    final scale = r * 0.0315;
    final cy = c.dy + r * 0.03;
    for (var i = 0; i <= 360; i += 3) {
      final t = i * math.pi / 180;
      final x = 16 * math.pow(math.sin(t), 3).toDouble();
      final y = -(13 * math.cos(t) -
          5 * math.cos(2 * t) -
          2 * math.cos(3 * t) -
          math.cos(4 * t));
      final px = c.dx + x * scale;
      final py = cy + y * scale * 0.92;
      if (i == 0) {
        path.moveTo(px, py);
      } else {
        path.lineTo(px, py);
      }
    }
    path.close();
    canvas.drawPath(path, Paint()..color = color);
  }

  @override
  bool shouldRepaint(_MarkPainter old) => old.color != color;
}
