import 'package:flutter/material.dart';
import '../widgets/cakna_bottom_nav.dart';
import 'collection_screen.dart';
import 'home_screen.dart';
import 'notes_screen.dart';
import 'profile_screen.dart';
import 'quran_screen.dart';

/// Root shell with the 5-tab bottom navigation matching Tilawah's layout:
/// Home · Collections · Quran (raised centre) · Notes · Profile.
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
      const CollectionScreen(),
      const QuranScreen(),
      const NotesScreen(),
      const ProfileScreen(),
    ];
    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      bottomNavigationBar: CaknaBottomNav(
        index: _index,
        onSelected: (i) => setState(() => _index = i),
      ),
    );
  }
}
