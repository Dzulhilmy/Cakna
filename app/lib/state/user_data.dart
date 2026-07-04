import 'package:flutter/foundation.dart';
import 'package:sqflite/sqflite.dart' show ConflictAlgorithm;
import '../data/user_db.dart';

class BookmarkEntry {
  final int verseId;
  final String collection;
  BookmarkEntry(this.verseId, this.collection);
}

class NoteEntry {
  final int verseId;
  final String body;
  final int updatedAt;
  NoteEntry(this.verseId, this.body, this.updatedAt);
}

/// Local bookmarks + notes, backed by the writable user DB. In-memory caches
/// keep synchronous lookups (isBookmarked/hasNote) cheap for the reader.
class UserData extends ChangeNotifier {
  final UserDb _udb;
  UserData(this._udb);

  final Set<int> _bookmarks = {};
  final Map<int, String> _notes = {};
  bool _loaded = false;

  Future<void> ensureLoaded() async {
    if (_loaded) return;
    final db = await _udb.db;
    for (final r in await db.query('bookmarks', columns: ['verse_id'])) {
      _bookmarks.add(r['verse_id'] as int);
    }
    for (final r in await db.query('notes', columns: ['verse_id', 'body'])) {
      _notes[r['verse_id'] as int] = r['body'] as String;
    }
    _loaded = true;
    notifyListeners();
  }

  // ---- bookmarks ----
  bool isBookmarked(int verseId) => _bookmarks.contains(verseId);

  Future<void> toggleBookmark(int verseId, {String collection = 'Umum'}) async {
    final db = await _udb.db;
    if (_bookmarks.remove(verseId)) {
      await db.delete('bookmarks', where: 'verse_id = ?', whereArgs: [verseId]);
    } else {
      _bookmarks.add(verseId);
      await db.insert('bookmarks', {
        'verse_id': verseId,
        'collection': collection,
        'created_at': DateTime.now().millisecondsSinceEpoch,
      });
    }
    notifyListeners();
  }

  Future<List<BookmarkEntry>> bookmarks() async {
    final db = await _udb.db;
    final rows = await db.query('bookmarks', orderBy: 'created_at DESC');
    return rows.map((r) => BookmarkEntry(r['verse_id'] as int, r['collection'] as String)).toList();
  }

  List<String> get collections {
    // derived lazily elsewhere; default single collection for now
    return const ['Umum'];
  }

  // ---- notes ----
  bool hasNote(int verseId) => _notes.containsKey(verseId);
  String noteBody(int verseId) => _notes[verseId] ?? '';

  Future<void> setNote(int verseId, String body) async {
    final db = await _udb.db;
    final trimmed = body.trim();
    if (trimmed.isEmpty) {
      _notes.remove(verseId);
      await db.delete('notes', where: 'verse_id = ?', whereArgs: [verseId]);
    } else {
      _notes[verseId] = trimmed;
      await db.insert(
        'notes',
        {'verse_id': verseId, 'body': trimmed, 'updated_at': DateTime.now().millisecondsSinceEpoch},
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    notifyListeners();
  }

  Future<List<NoteEntry>> notes() async {
    final db = await _udb.db;
    final rows = await db.query('notes', orderBy: 'updated_at DESC');
    return rows
        .map((r) => NoteEntry(r['verse_id'] as int, r['body'] as String, r['updated_at'] as int))
        .toList();
  }
}
