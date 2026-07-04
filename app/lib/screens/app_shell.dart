import 'package:flutter/material.dart';
import '../theme.dart';
import 'collection_screen.dart';
import 'home_screen.dart';
import 'notes_screen.dart';
import 'profile_screen.dart';
import 'quran_screen.dart';

/// Root shell with the 5-tab bottom navigation (matching Tilawah's layout:
/// Home, Quran, Collection, Notes, Profile).
class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomeScreen(onNavigateTab: (i) => setState(() => _index = i)),
      const QuranScreen(),
      const CollectionScreen(),
      const NotesScreen(),
      const ProfileScreen(),
    ];
    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        indicatorColor: CaknaColors.teal.withValues(alpha: 0.14),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home, color: CaknaColors.teal),
              label: 'Utama'),
          NavigationDestination(
              icon: Icon(Icons.menu_book_outlined),
              selectedIcon: Icon(Icons.menu_book, color: CaknaColors.teal),
              label: 'Al-Quran'),
          NavigationDestination(
              icon: Icon(Icons.bookmark_border),
              selectedIcon: Icon(Icons.bookmark, color: CaknaColors.teal),
              label: 'Koleksi'),
          NavigationDestination(
              icon: Icon(Icons.edit_note_outlined),
              selectedIcon: Icon(Icons.edit_note, color: CaknaColors.teal),
              label: 'Nota'),
          NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person, color: CaknaColors.teal),
              label: 'Profil'),
        ],
      ),
    );
  }
}
