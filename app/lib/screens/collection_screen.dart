import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/user_data.dart';
import '../theme.dart';
import 'reader_screen.dart';

/// The "Koleksi" tab: bookmarked verses. Tap opens the reader at that page;
/// swipe or long-press to remove.
class CollectionScreen extends StatelessWidget {
  const CollectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userData = context.watch<UserData>();
    final repo = context.read<QuranRepo>();
    return Scaffold(
      appBar: AppBar(title: const Text('Koleksi')),
      body: FutureBuilder<List<BookmarkEntry>>(
        future: userData.bookmarks(),
        builder: (context, snap) {
          final marks = snap.data ?? const [];
          if (snap.connectionState == ConnectionState.done && marks.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.bookmark_border,
                      size: 48, color: CaknaColors.teal.withValues(alpha: 0.35)),
                  const SizedBox(height: 12),
                  const Text('Belum ada penanda.\nKetuk ayat, kemudian ikon penanda.',
                      textAlign: TextAlign.center, style: TextStyle(color: CaknaColors.inkSoft)),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: marks.length,
            separatorBuilder: (_, _) => const Divider(height: 1, indent: 16),
            itemBuilder: (context, i) => _BookmarkTile(entry: marks[i], repo: repo),
          );
        },
      ),
    );
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
              leading: const Icon(Icons.bookmark, color: CaknaColors.teal),
              title: Text(s == null || v == null ? '…' : '${s.nameTrans}  ${v.surahId}:${v.verseNumber}',
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
