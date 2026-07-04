import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/user_data.dart';
import '../theme.dart';
import 'reader_screen.dart';

/// The "Nota" tab: every per-ayah note, newest first. Tap opens the reader at
/// that verse's page.
class NotesScreen extends StatelessWidget {
  const NotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userData = context.watch<UserData>();
    final repo = context.read<QuranRepo>();
    return Scaffold(
      appBar: AppBar(title: const Text('Nota')),
      body: FutureBuilder<List<NoteEntry>>(
        // rebuilds when UserData notifies (watch above)
        future: userData.notes(),
        builder: (context, snap) {
          final notes = snap.data ?? const [];
          if (snap.connectionState == ConnectionState.done && notes.isEmpty) {
            return const _Empty(
              icon: Icons.edit_note,
              text: 'Belum ada nota.\nKetuk ayat dalam mushaf, kemudian butang Nota.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: notes.length,
            separatorBuilder: (_, _) => const Divider(height: 1, indent: 16),
            itemBuilder: (context, i) => _NoteTile(entry: notes[i], repo: repo),
          );
        },
      ),
    );
  }
}

class _NoteTile extends StatelessWidget {
  final NoteEntry entry;
  final QuranRepo repo;
  const _NoteTile({required this.entry, required this.repo});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Verse>(
      future: repo.verse(entry.verseId),
      builder: (context, vSnap) {
        final v = vSnap.data;
        return ListTile(
          leading: const Icon(Icons.sticky_note_2_outlined, color: CaknaColors.teal),
          title: Text(entry.body, maxLines: 2, overflow: TextOverflow.ellipsis),
          subtitle: v == null
              ? null
              : Text('Ayat ${v.surahId}:${v.verseNumber}',
                  style: const TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
          onTap: v == null
              ? null
              : () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: v.page))),
        );
      },
    );
  }
}

class _Empty extends StatelessWidget {
  final IconData icon;
  final String text;
  const _Empty({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 48, color: CaknaColors.teal.withValues(alpha: 0.35)),
          const SizedBox(height: 12),
          Text(text, textAlign: TextAlign.center, style: const TextStyle(color: CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}
