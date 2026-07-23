import 'package:flutter/material.dart';
import '../theme.dart';

/// Large title + "+" action, used by the Collections and Notes tabs
/// (matching Tilawah's plain tab headers).
class TabHeader extends StatelessWidget {
  final String title;
  final VoidCallback onAdd;
  const TabHeader({super.key, required this.title, required this.onAdd});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 14, 12, 6),
      child: Row(
        children: [
          Text(title,
              style: const TextStyle(
                  fontFamily: 'Lora', fontSize: 26, fontWeight: FontWeight.w600)),
          const Spacer(),
          Material(
            color: CaknaColors.olive.withValues(alpha: 0.12),
            shape: const CircleBorder(),
            child: InkWell(
              onTap: onAdd,
              customBorder: const CircleBorder(),
              child: const Padding(
                padding: EdgeInsets.all(9),
                child: Icon(Icons.add, color: CaknaColors.olive),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Centered empty-state block: circular icon, title, body, primary action.
class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title, body, actionLabel;
  final VoidCallback onAction;
  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.body,
    required this.actionLabel,
    required this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 84,
              height: 84,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: CaknaColors.olive.withValues(alpha: 0.10),
              ),
              child: Icon(icon, size: 38, color: CaknaColors.olive),
            ),
            const SizedBox(height: 20),
            Text(title,
                style: const TextStyle(
                    fontFamily: 'Lora', fontSize: 20, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(body,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13.5, color: CaknaColors.inkSoft, height: 1.5)),
            const SizedBox(height: 22),
            FilledButton.icon(
              onPressed: onAction,
              icon: const Icon(Icons.add, size: 18),
              label: Text(actionLabel),
              style: FilledButton.styleFrom(
                backgroundColor: CaknaColors.olive,
                minimumSize: const Size(200, 48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
