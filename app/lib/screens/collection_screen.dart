import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../state/user_data.dart';
import '../theme.dart';
import '../widgets/tab_scaffold.dart';
import 'reader_screen.dart';

/// Collections tab — bookmarked ayahs grouped into named collections
/// (matches Tilawah's Collections). Empty state + "create collection".
class CollectionScreen extends StatelessWidget {
  const CollectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userData = context.watch<UserData>();
    final app = context.watch<AppState>();
    final repo = context.read<QuranRepo>();
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TabHeader(
              title: 'Koleksi',
              onAdd: () => _createDialog(context),
            ),
            Expanded(
              child: FutureBuilder<List<BookmarkEntry>>(
                future: userData.bookmarks(),
                builder: (context, snap) {
                  final marks = snap.data ?? const [];
                  final onlyDefault =
                      app.collections.length == 1 && app.collections.first == 'Umum';
                  if (snap.connectionState == ConnectionState.done &&
                      marks.isEmpty &&
                      onlyDefault) {
                    return EmptyState(
                      icon: Icons.grid_view_rounded,
                      title: 'Koleksi',
                      body: 'Cipta senarai ayat dari pelbagai surah untuk kemudahan anda.',
                      actionLabel: 'Cipta koleksi',
                      onAction: () => _createDialog(context),
                    );
                  }
                  // group bookmarks by collection name
                  final groups = <String, List<BookmarkEntry>>{
                    for (final c in app.collections) c: [],
                  };
                  for (final m in marks) {
                    (groups[m.collection] ??= []).add(m);
                  }
                  return ListView(
                    padding: const EdgeInsets.only(bottom: 16),
                    children: [
                      for (final entry in groups.entries)
                        _CollectionGroup(name: entry.key, marks: entry.value, repo: repo),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _createDialog(BuildContext context) async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Koleksi baharu'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Nama koleksi'),
          onSubmitted: (v) => Navigator.pop(ctx, v),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: CaknaColors.olive),
            onPressed: () => Navigator.pop(ctx, controller.text),
            child: const Text('Cipta'),
          ),
        ],
      ),
    );
    if (name != null && name.trim().isNotEmpty && context.mounted) {
      context.read<AppState>().addCollection(name);
    }
  }
}

class _CollectionGroup extends StatelessWidget {
  final String name;
  final List<BookmarkEntry> marks;
  final QuranRepo repo;
  const _CollectionGroup({required this.name, required this.marks, required this.repo});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Row(
            children: [
              const Icon(Icons.folder_outlined, size: 18, color: CaknaColors.olive),
              const SizedBox(width: 8),
              Text(name,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              const SizedBox(width: 6),
              Text('${marks.length}',
                  style: const TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft)),
              const Spacer(),
              if (name != 'Umum')
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_horiz, size: 18, color: CaknaColors.inkSoft),
                  onSelected: (v) => v == 'rename'
                      ? _rename(context)
                      : _delete(context),
                  itemBuilder: (_) => const [
                    PopupMenuItem(value: 'rename', child: Text('Namakan semula')),
                    PopupMenuItem(value: 'delete', child: Text('Padam koleksi')),
                  ],
                ),
            ],
          ),
        ),
        if (marks.isEmpty)
          const Padding(
            padding: EdgeInsets.fromLTRB(42, 0, 16, 8),
            child: Text('Belum ada ayat dalam koleksi ini.',
                style: TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft)),
          )
        else
          for (final m in marks) _BookmarkTile(entry: m, repo: repo),
      ],
    );
  }

  Future<void> _rename(BuildContext context) async {
    final controller = TextEditingController(text: name);
    final newName = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Namakan semula'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Nama koleksi'),
          onSubmitted: (v) => Navigator.pop(ctx, v),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: CaknaColors.olive),
            onPressed: () => Navigator.pop(ctx, controller.text),
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
    final n = newName?.trim() ?? '';
    if (n.isEmpty || n == name || !context.mounted) return;
    final app = context.read<AppState>();
    final userData = context.read<UserData>();
    app.addCollection(n);
    await userData.reassignCollection(name, n);
    app.removeCollection(name);
  }

  Future<void> _delete(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Padam "$name"?'),
        content: Text(marks.isEmpty
            ? 'Koleksi ini akan dipadamkan.'
            : 'Ayat di dalamnya akan dipindahkan ke "Umum".'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red.shade700),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Padam'),
          ),
        ],
      ),
    );
    if (ok != true || !context.mounted) return;
    final app = context.read<AppState>();
    final userData = context.read<UserData>();
    await userData.reassignCollection(name, 'Umum');
    app.removeCollection(name);
  }
}

class _BookmarkTile extends StatelessWidget {
  final BookmarkEntry entry;
  final QuranRepo repo;
  const _BookmarkTile({required this.entry, required this.repo});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Verse>(
      future: repo.verse(entry.verseId),
      builder: (context, vSnap) {
        final v = vSnap.data;
        return FutureBuilder<Surah?>(
          future: v == null ? Future.value(null) : repo.surah(v.surahId),
          builder: (context, sSnap) {
            final s = sSnap.data;
            return ListTile(
              leading: const Icon(Icons.bookmark, color: CaknaColors.olive),
              title: Text(
                  s == null || v == null ? '…' : '${s.nameTrans}  ${v.surahId}:${v.verseNumber}',
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: v == null
                  ? null
                  : Text(v.textUthmani,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.right,
                      textDirection: TextDirection.rtl,
                      style: const TextStyle(fontFamily: 'Uthmani', fontSize: 16)),
              trailing: IconButton(
                icon: const Icon(Icons.close, size: 18, color: CaknaColors.inkSoft),
                onPressed: () => context.read<UserData>().toggleBookmark(entry.verseId),
              ),
              onTap: v == null
                  ? null
                  : () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: v.page))),
            );
          },
        );
      },
    );
  }
}

