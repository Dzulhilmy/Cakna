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
  final Set<int> _readPages = {};
  final Map<String, int> _readLog = {};
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
    for (final r in await db.query('read_pages', columns: ['page'])) {
      _readPages.add(r['page'] as int);
    }
    for (final r in await db.query('read_log')) {
      _readLog[r['day'] as String] = r['count'] as int;
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

  // ---- reading progress ----
  int get readCount => _readPages.length;
  double get khatamProgress => _readPages.length / 604;

  static String _dayKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  /// Consecutive days (ending today, or yesterday if nothing read today yet)
  /// with at least one page read.
  int get streak {
    var day = DateTime.now();
    if (!_readLog.containsKey(_dayKey(day))) {
      day = day.subtract(const Duration(days: 1));
    }
    var count = 0;
    while (_readLog.containsKey(_dayKey(day))) {
      count++;
      day = day.subtract(const Duration(days: 1));
    }
    return count;
  }

  int get todayPages => _readLog[_dayKey(DateTime.now())] ?? 0;

  // ---- cloud sync (bookmarks/notes/read/readlog) ----
  /// Snapshot of the syncable user data as JSON values keyed by sync key.
  Map<String, Object> exportSync() => {
        'bookmarks': _bookmarks.toList()..sort(),
        'notes': _notes.map((k, v) => MapEntry(k.toString(), v)),
        'read': _readPages.toList()..sort(),
        'readlog': Map<String, int>.from(_readLog),
      };

  /// Union-merge remote data into the local store (never loses local data),
  /// writing new rows to the DB. Returns true if anything changed locally.
  Future<bool> mergeSync(Map<String, dynamic> remote) async {
    final db = await _udb.db;
    var changed = false;
    final now = DateTime.now().millisecondsSinceEpoch;

    for (final v in (remote['bookmarks'] as List? ?? const [])) {
      final id = v as int;
      if (_bookmarks.add(id)) {
        changed = true;
        await db.insert('bookmarks', {'verse_id': id, 'collection': 'Umum', 'created_at': now},
            conflictAlgorithm: ConflictAlgorithm.ignore);
      }
    }
    (remote['notes'] as Map?)?.forEach((k, v) {
      final id = int.tryParse(k.toString());
      if (id != null && !_notes.containsKey(id)) {
        _notes[id] = v as String;
        changed = true;
        db.insert('notes', {'verse_id': id, 'body': v, 'updated_at': now},
            conflictAlgorithm: ConflictAlgorithm.ignore);
      }
    });
    for (final v in (remote['read'] as List? ?? const [])) {
      final p = v as int;
      if (_readPages.add(p)) {
        changed = true;
        await db.insert('read_pages', {'page': p, 'read_at': now},
            conflictAlgorithm: ConflictAlgorithm.ignore);
      }
    }
    (remote['readlog'] as Map?)?.forEach((k, v) {
      final day = k.toString();
      final n = v as int;
      if ((_readLog[day] ?? 0) < n) {
        _readLog[day] = n;
        changed = true;
        db.insert('read_log', {'day': day, 'count': n},
            conflictAlgorithm: ConflictAlgorithm.replace);
      }
    });
    if (changed) notifyListeners();
    return changed;
  }

  /// Mark a page read (idempotent per page). First-ever read bumps today's log.
  Future<void> markRead(int page) async {
    if (_readPages.contains(page)) return;
    _readPages.add(page);
    final today = _dayKey(DateTime.now());
    _readLog[today] = (_readLog[today] ?? 0) + 1;
    final db = await _udb.db;
    final now = DateTime.now().millisecondsSinceEpoch;
    await db.insert('read_pages', {'page': page, 'read_at': now},
        conflictAlgorithm: ConflictAlgorithm.ignore);
    await db.insert('read_log', {'day': today, 'count': _readLog[today]},
        conflictAlgorithm: ConflictAlgorithm.replace);
    notifyListeners();
  }
}
