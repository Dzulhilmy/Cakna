import 'package:flutter/material.dart';
import '../theme.dart';

/// Temporary screen for modules built in later passes (Collection, Notes,
/// Profile, Prayer times, Qibla, Ma'thurat…).
class PlaceholderScreen extends StatelessWidget {
  final String title;
  final IconData icon;
  const PlaceholderScreen({super.key, required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: CaknaColors.teal.withValues(alpha: 0.4)),
            const SizedBox(height: 12),
            Text('$title — akan datang',
                style: const TextStyle(color: CaknaColors.inkSoft)),
          ],
        ),
      ),
    );
  }
}
