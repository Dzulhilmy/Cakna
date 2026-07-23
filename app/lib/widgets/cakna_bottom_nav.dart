import 'package:flutter/material.dart';
import '../theme.dart';

/// Bottom navigation matching Tilawah's layout: four flat tabs flanking a
/// raised circular "Quran" medallion in the centre. Olive identity.
class CaknaBottomNav extends StatelessWidget {
  final int index;
  final ValueChanged<int> onSelected;
  const CaknaBottomNav({super.key, required this.index, required this.onSelected});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final active = dark ? CaknaColors.oliveBright : CaknaColors.olive;
    final idle = dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft;
    final surface = dark ? CaknaColors.surfaceDark : CaknaColors.surface;
    final border = dark ? CaknaColors.borderDark : CaknaColors.border;

    return Container(
      decoration: BoxDecoration(
        color: surface,
        border: Border(top: BorderSide(color: border)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 62,
          child: Row(
            children: [
              _Tab(
                icon: Icons.home_outlined,
                activeIcon: Icons.home_rounded,
                label: 'Utama',
                selected: index == 0,
                active: active,
                idle: idle,
                onTap: () => onSelected(0),
              ),
              _Tab(
                icon: Icons.grid_view_outlined,
                activeIcon: Icons.grid_view_rounded,
                label: 'Koleksi',
                selected: index == 1,
                active: active,
                idle: idle,
                onTap: () => onSelected(1),
              ),
              _QuranTab(
                selected: index == 2,
                active: active,
                idle: idle,
                onTap: () => onSelected(2),
              ),
              _Tab(
                icon: Icons.event_note_outlined,
                activeIcon: Icons.event_note_rounded,
                label: 'Nota',
                selected: index == 3,
                active: active,
                idle: idle,
                onTap: () => onSelected(3),
              ),
              _Tab(
                icon: Icons.person_outline_rounded,
                activeIcon: Icons.person_rounded,
                label: 'Profil',
                selected: index == 4,
                active: active,
                idle: idle,
                onTap: () => onSelected(4),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool selected;
  final Color active;
  final Color idle;
  final VoidCallback onTap;
  const _Tab({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.selected,
    required this.active,
    required this.idle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = selected ? active : idle;
    return Expanded(
      child: InkResponse(
        onTap: onTap,
        radius: 42,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(selected ? activeIcon : icon, size: 25, color: color),
            const SizedBox(height: 3),
            Text(label,
                style: TextStyle(
                    fontSize: 10.5,
                    height: 1,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                    color: color)),
          ],
        ),
      ),
    );
  }
}

class _QuranTab extends StatelessWidget {
  final bool selected;
  final Color active;
  final Color idle;
  final VoidCallback onTap;
  const _QuranTab({
    required this.selected,
    required this.active,
    required this.idle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkResponse(
        onTap: onTap,
        radius: 42,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: selected ? active : idle,
                boxShadow: selected
                    ? [
                        BoxShadow(
                            color: active.withValues(alpha: 0.35),
                            blurRadius: 10,
                            offset: const Offset(0, 4))
                      ]
                    : null,
              ),
              child: const Icon(Icons.menu_book_rounded, size: 24, color: Colors.white),
            ),
            const SizedBox(height: 2),
            Text('Quran',
                style: TextStyle(
                    fontSize: 10.5,
                    height: 1,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                    color: selected ? active : idle)),
          ],
        ),
      ),
    );
  }
}
