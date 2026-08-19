import 'dart:math';
import 'package:flutter/material.dart';

/// Animated waveform bars — active when audio is flowing, flat otherwise.
class HalaqahWaveform extends StatefulWidget {
  final bool active;
  final double height;
  final Color color;

  const HalaqahWaveform({
    super.key,
    required this.active,
    this.height = 20,
    this.color = Colors.white,
  });

  @override
  State<HalaqahWaveform> createState() => _HalaqahWaveformState();
}

class _HalaqahWaveformState extends State<HalaqahWaveform>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final barW = widget.height * 0.18;
    return SizedBox(
      width: widget.height * 1.6,
      height: widget.height,
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, child) {
          final t = _ctrl.value;
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [0.0, 0.2, 0.4, 0.6, 0.8].map((offset) {
              final fraction = widget.active
                  ? 0.25 + 0.75 * ((sin((t + offset) * 2 * pi) + 1) / 2)
                  : 0.2;
              return Container(
                width: barW,
                height: widget.height * fraction,
                decoration: BoxDecoration(
                  color: widget.color.withValues(alpha: 0.85),
                  borderRadius: BorderRadius.circular(barW / 2),
                ),
              );
            }).toList(),
          );
        },
      ),
    );
  }
}
