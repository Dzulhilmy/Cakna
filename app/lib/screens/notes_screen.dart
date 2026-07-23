import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../state/user_data.dart';
import '../theme.dart';
import '../utils/note_text.dart';
import '../widgets/tab_scaffold.dart';
import 'reader_screen.dart';

/// Notes tab — per-ayah notes, newest first (matches Tilawah's Notes). Notes
/// are authored from an ayah in the mushaf; the empty state opens the reader.
class NotesScreen extends StatelessWidget {
  const NotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userData = context.watch<UserData>();
    final repo = context.read<QuranRepo>();
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TabHeader(title: 'Nota', onAdd: () => _openReader(context)),
            Expanded(
              child: FutureBuilder<List<NoteEntry>>(
                future: userData.notes(),
                builder: (context, snap) {
                  final notes = snap.data ?? const [];
                  if (snap.connectionState == ConnectionState.done && notes.isEmpty) {
                    return EmptyState(
                      icon: Icons.edit_note_rounded,
                      title: 'Nota',
                      body: 'Cipta nota untuk mencatat pengajaran dan renungan ayat.',
                      actionLabel: 'Cipta nota',
                      onAction: () => _openReader(context),
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
            ),
          ],
        ),
      ),
    );
  }

  void _openReader(BuildContext context) {
    final page = context.read<AppState>().lastPage;
    Navigator.push(context, MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: page)));
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
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: CaknaColors.olive.withValues(alpha: 0.12),
            ),
            child: const Icon(Icons.sticky_note_2_outlined, size: 20, color: CaknaColors.olive),
          ),
          title: Text(notePlainText(entry.body), maxLines: 2, overflow: TextOverflow.ellipsis),
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
