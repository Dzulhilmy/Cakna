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

/// Local bookmarks + notes + reading progress, backed by the writable user DB.
/// Cloud sync uses an LWW-element-set (per-item timestamps + tombstones) so
/// edits, collection names, and deletions all propagate correctly across
/// devices without resurrecting deleted items.
class UserData extends ChangeNotifier {
  final UserDb _udb;
  UserData(this._udb);

  final Map<int, ({String collection, int at})> _bookmarks = {};
  final Map<int, ({String body, int at})> _notes = {};
  final Map<int, int> _bmDel = {}; // verse_id → deleted_at tombstone
  final Map<int, int> _ntDel = {};
  final Map<int, String> _lastCol = {}; // verse_id → last collection (for re-toggle)
  final Set<int> _readPages = {};
  final Map<String, int> _readLog = {};
  final Map<String, int> _readTime = {}; // day → seconds
  bool _loaded = false;

  static int _nowMs() => DateTime.now().millisecondsSinceEpoch;

  Future<void> ensureLoaded() async {
    if (_loaded) return;
    final db = await _udb.db;
    for (final r in await db.query('bookmarks')) {
      _bookmarks[r['verse_id'] as int] =
          (collection: (r['collection'] ?? 'Umum') as String, at: (r['created_at'] ?? 0) as int);
    }
    for (final r in await db.query('notes')) {
      _notes[r['verse_id'] as int] =
          (body: r['body'] as String, at: (r['updated_at'] ?? 0) as int);
    }
    for (final r in await db.query('read_pages', columns: ['page'])) {
      _readPages.add(r['page'] as int);
    }
    for (final r in await db.query('read_log')) {
      _readLog[r['day'] as String] = r['count'] as int;
    }
    for (final r in await db.query('read_time')) {
      _readTime[r['day'] as String] = r['seconds'] as int;
    }
    for (final r in await db.query('deletions')) {
      final ref = r['ref'] as int, at = r['deleted_at'] as int;
      if (r['kind'] == 'bm') {
        _bmDel[ref] = at;
      } else {
        _ntDel[ref] = at;
      }
    }
    _loaded = true;
    notifyListeners();
  }

  // ---- bookmarks ----
  bool isBookmarked(int verseId) => _bookmarks.containsKey(verseId);
  String collectionOf(int verseId) => _bookmarks[verseId]?.collection ?? 'Umum';

  /// All bookmarks, newest first (drives the home "Penanda" strip).
  List<({int verseId, String collection, int at})> get recentBookmarks {
    final list = [
      for (final e in _bookmarks.entries)
        (verseId: e.key, collection: e.value.collection, at: e.value.at)
    ]..sort((a, b) => b.at.compareTo(a.at));
    return list;
  }

  Future<void> toggleBookmark(int verseId, {String collection = 'Umum'}) async {
    // Preserve the collection across a toggle-off/on cycle (fixes the toggle-vs-
    // collection fight): _removeBookmark remembers it, and re-adding restores it.
    if (_bookmarks.containsKey(verseId)) {
      await _removeBookmark(verseId);
    } else {
      await addBookmarkTo(verseId, _lastCol[verseId] ?? collection);
    }
  }

  /// Bookmark a verse into a specific named collection (insert or move).
  Future<void> addBookmarkTo(int verseId, String collection) async {
    final db = await _udb.db;
    final now = _nowMs();
    _bookmarks[verseId] = (collection: collection, at: now);
    _bmDel.remove(verseId);
    await db.insert('bookmarks', {'verse_id': verseId, 'collection': collection, 'created_at': now},
        conflictAlgorithm: ConflictAlgorithm.replace);
    await db.delete('deletions', where: 'kind = ? AND ref = ?', whereArgs: ['bm', verseId]);
    notifyListeners();
  }

  /// Move every bookmark in [from] to [to] — used when a collection is
  /// renamed or deleted. One bulk UPDATE + one notify (per-bookmark
  /// addBookmarkTo would fan out N notifies and N sync-debounce resets); the
  /// bumped timestamp makes the move win LWW on sync.
  Future<void> reassignCollection(String from, String to) async {
    final ids = [
      for (final e in _bookmarks.entries)
        if (e.value.collection == from) e.key
    ];
    if (ids.isEmpty) return;
    final db = await _udb.db;
    final now = _nowMs();
    for (final id in ids) {
      _bookmarks[id] = (collection: to, at: now);
      _bmDel.remove(id);
    }
    await db.update('bookmarks', {'collection': to, 'created_at': now},
        where: 'collection = ?', whereArgs: [from]);
    notifyListeners();
  }

  Future<void> _removeBookmark(int verseId) async {
    final db = await _udb.db;
    final now = _nowMs();
    _lastCol[verseId] = _bookmarks[verseId]?.collection ?? 'Umum';
    _bookmarks.remove(verseId);
    _bmDel[verseId] = now;
    await db.delete('bookmarks', where: 'verse_id = ?', whereArgs: [verseId]);
    await db.insert('deletions', {'kind': 'bm', 'ref': verseId, 'deleted_at': now},
        conflictAlgorithm: ConflictAlgorithm.replace);
    notifyListeners();
  }

  Future<List<BookmarkEntry>> bookmarks() async {
    final entries = _bookmarks.entries.toList()..sort((a, b) => b.value.at.compareTo(a.value.at));
    return entries.map((e) => BookmarkEntry(e.key, e.value.collection)).toList();
  }

  // ---- notes ----
  bool hasNote(int verseId) => _notes.containsKey(verseId);
  String noteBody(int verseId) => _notes[verseId]?.body ?? '';

  Future<void> setNote(int verseId, String body) async {
    final db = await _udb.db;
    final now = _nowMs();
    final trimmed = body.trim();
    if (trimmed.isEmpty) {
      _notes.remove(verseId);
      _ntDel[verseId] = now;
      await db.delete('notes', where: 'verse_id = ?', whereArgs: [verseId]);
      await db.insert('deletions', {'kind': 'nt', 'ref': verseId, 'deleted_at': now},
          conflictAlgorithm: ConflictAlgorithm.replace);
    } else {
      _notes[verseId] = (body: trimmed, at: now);
      _ntDel.remove(verseId);
      await db.insert('notes', {'verse_id': verseId, 'body': trimmed, 'updated_at': now},
          conflictAlgorithm: ConflictAlgorithm.replace);
      await db.delete('deletions', where: 'kind = ? AND ref = ?', whereArgs: ['nt', verseId]);
    }
    notifyListeners();
  }

  Future<List<NoteEntry>> notes() async {
    final entries = _notes.entries.toList()..sort((a, b) => b.value.at.compareTo(a.value.at));
    return entries.map((e) => NoteEntry(e.key, e.value.body, e.value.at)).toList();
  }

  // ---- reading progress ----
  int get readCount => _readPages.length;
  double get khatamProgress => _readPages.length / 604;

  static String _dayKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

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
  int pagesOnDay(DateTime d) => _readLog[_dayKey(d)] ?? 0;
  int get activeDays => _readLog.length;

  Future<void> addReadSeconds(int seconds) async {
    if (seconds <= 0) return;
    final today = _dayKey(DateTime.now());
    _readTime[today] = (_readTime[today] ?? 0) + seconds;
    final db = await _udb.db;
    await db.insert('read_time', {'day': today, 'seconds': _readTime[today]},
        conflictAlgorithm: ConflictAlgorithm.replace);
    notifyListeners();
  }

  int secondsOnDay(DateTime d) => _readTime[_dayKey(d)] ?? 0;

  int minutesSince(DateTime? from) => _sumSince(_readTime, from) ~/ 60;
  int pagesSince(DateTime? from) => _sumSince(_readLog, from);
  int activeDaysSince(DateTime? from) {
    final cutoff = from == null ? '' : _dayKey(from);
    return _readLog.entries.where((e) => e.value > 0 && e.key.compareTo(cutoff) >= 0).length;
  }

  static int _sumSince(Map<String, int> m, DateTime? from) {
    final cutoff = from == null ? '' : _dayKey(from);
    var total = 0;
    for (final e in m.entries) {
      if (e.key.compareTo(cutoff) >= 0) total += e.value;
    }
    return total;
  }

  /// Mark a page read. `read_pages` (distinct-ever) drives khatam %; the daily
  /// `read_log` is bumped on a page's first-ever read, or on the first read of
  /// any day, so the streak/heatmap keep working even after a full khatam (when
  /// there are no more first-ever reads). Uses only the persisted read_log — no
  /// session-only state that would double-count across restarts.
  Future<void> markRead(int page) async {
    final today = _dayKey(DateTime.now());
    final firstEver = _readPages.add(page);
    final bumpToday = firstEver || !_readLog.containsKey(today);
    if (!firstEver && !bumpToday) return; // re-read on an already-active day
    final db = await _udb.db;
    if (firstEver) {
      await db.insert('read_pages', {'page': page, 'read_at': _nowMs()},
          conflictAlgorithm: ConflictAlgorithm.ignore);
    }
    if (bumpToday) {
      _readLog[today] = (_readLog[today] ?? 0) + 1;
      await db.insert('read_log', {'day': today, 'count': _readLog[today]},
          conflictAlgorithm: ConflictAlgorithm.replace);
    }
    notifyListeners();
  }

  // ─────────────────────────────────────────────── cloud sync ────────────

  /// Snapshot for the server. bookmarks/notes carry per-item timestamps +
  /// deletion tombstones (LWW-element-set); readlog folds in reading seconds.
  Map<String, Object> exportSync() {
    final days = {..._readLog.keys, ..._readTime.keys};
    return {
      'bookmarks': {
        'i': [
          for (final e in _bookmarks.entries) {'id': e.key, 'c': e.value.collection, 't': e.value.at}
        ],
        'd': {for (final e in _bmDel.entries) e.key.toString(): e.value},
      },
      'notes': {
        'i': {for (final e in _notes.entries) e.key.toString(): {'b': e.value.body, 'u': e.value.at}},
        'd': {for (final e in _ntDel.entries) e.key.toString(): e.value},
      },
      'read': _readPages.toList()..sort(),
      'readlog': {
        for (final day in days) day: {'c': _readLog[day] ?? 0, 's': _readTime[day] ?? 0}
      },
    };
  }

  /// True while a server payload is being merged — sync listeners use this to
  /// tell remote-driven notifications apart from real local changes.
  bool get isMerging => _merging;
  bool _merging = false;

  /// Merge server state locally with LWW-element-set semantics. Returns true if
  /// anything changed. Accepts both the new object shape and the legacy shapes
  /// (bookmarks = int list, notes = {id: text}, readlog = {day: count}).
  Future<bool> mergeSync(Map<String, dynamic> remote) async {
    _merging = true;
    try {
      return await _mergeSync(remote);
    } finally {
      _merging = false;
    }
  }

  Future<bool> _mergeSync(Map<String, dynamic> remote) async {
    final db = await _udb.db;
    var changed = false;

    // ---- bookmarks ----
    final rb = remote['bookmarks'];
    if (rb is List) {
      for (final v in rb) {
        if (v is int) changed |= await _mergeBmItem(db, v, 'Umum', 0);
      }
    } else if (rb is Map) {
      for (final it in (rb['i'] as List? ?? const [])) {
        if (it is Map) {
          changed |= await _mergeBmItem(
              db, it['id'] as int, (it['c'] ?? 'Umum') as String, (it['t'] ?? 0) as int);
        }
      }
      final del = rb['d'];
      if (del is Map) {
        for (final e in del.entries) {
          final id = int.tryParse(e.key.toString());
          if (id != null) changed |= await _mergeBmDel(db, id, (e.value as num).toInt());
        }
      }
    }

    // ---- notes ----
    final rn = remote['notes'];
    if (rn is Map && rn['i'] == null && rn['d'] == null) {
      // legacy {id: text}
      for (final e in rn.entries) {
        final id = int.tryParse(e.key.toString());
        if (id != null && e.value is String) {
          changed |= await _mergeNtItem(db, id, e.value as String, 0);
        }
      }
    } else if (rn is Map) {
      final items = rn['i'];
      if (items is Map) {
        for (final e in items.entries) {
          final id = int.tryParse(e.key.toString());
          if (id != null && e.value is Map) {
            final m = e.value as Map;
            changed |= await _mergeNtItem(db, id, (m['b'] ?? '') as String, (m['u'] ?? 0) as int);
          }
        }
      }
      final del = rn['d'];
      if (del is Map) {
        for (final e in del.entries) {
          final id = int.tryParse(e.key.toString());
          if (id != null) changed |= await _mergeNtDel(db, id, (e.value as num).toInt());
        }
      }
    }

    // ---- read pages (union) ----
    for (final v in (remote['read'] as List? ?? const [])) {
      final p = v as int;
      if (_readPages.add(p)) {
        changed = true;
        await db.insert('read_pages', {'page': p, 'read_at': _nowMs()},
            conflictAlgorithm: ConflictAlgorithm.ignore);
      }
    }

    // ---- readlog + reading time (max-merge) ----
    (remote['readlog'] as Map?)?.forEach((k, v) {
      final day = k.toString();
      int c = 0, s = 0;
      if (v is int) {
        c = v;
      } else if (v is Map) {
        c = (v['c'] ?? 0) as int;
        s = (v['s'] ?? 0) as int;
      }
      if ((_readLog[day] ?? 0) < c) {
        _readLog[day] = c;
        changed = true;
        db.insert('read_log', {'day': day, 'count': c}, conflictAlgorithm: ConflictAlgorithm.replace);
      }
      if ((_readTime[day] ?? 0) < s) {
        _readTime[day] = s;
        changed = true;
        db.insert('read_time', {'day': day, 'seconds': s}, conflictAlgorithm: ConflictAlgorithm.replace);
      }
    });

    if (changed) notifyListeners();
    return changed;
  }

  // LWW-element-set: an item is present iff its add-time strictly exceeds its
  // tombstone; ties favour deletion.
  Future<bool> _mergeBmItem(dynamic db, int id, String c, int t) async {
    if ((_bmDel[id] ?? -1) >= t) return false; // deleted at/after this add
    final cur = _bookmarks[id];
    if (cur != null && cur.at >= t) return false; // local copy newer
    _bookmarks[id] = (collection: c, at: t);
    _bmDel.remove(id);
    await db.insert('bookmarks', {'verse_id': id, 'collection': c, 'created_at': t},
        conflictAlgorithm: ConflictAlgorithm.replace);
    await db.delete('deletions', where: 'kind = ? AND ref = ?', whereArgs: ['bm', id]);
    return true;
  }

  Future<bool> _mergeBmDel(dynamic db, int id, int ts) async {
    final cur = _bookmarks[id];
    if (cur != null && cur.at > ts) return false; // local add strictly newer → keep
    var changed = false;
    if ((_bmDel[id] ?? -1) < ts) {
      _bmDel[id] = ts;
      await db.insert('deletions', {'kind': 'bm', 'ref': id, 'deleted_at': ts},
          conflictAlgorithm: ConflictAlgorithm.replace);
      changed = true;
    }
    if (cur != null) {
      _bookmarks.remove(id);
      await db.delete('bookmarks', where: 'verse_id = ?', whereArgs: [id]);
      changed = true;
    }
    return changed;
  }

  Future<bool> _mergeNtItem(dynamic db, int id, String body, int u) async {
    if ((_ntDel[id] ?? -1) >= u) return false;
    final cur = _notes[id];
    if (cur != null && cur.at >= u) return false;
    _notes[id] = (body: body, at: u);
    _ntDel.remove(id);
    await db.insert('notes', {'verse_id': id, 'body': body, 'updated_at': u},
        conflictAlgorithm: ConflictAlgorithm.replace);
    await db.delete('deletions', where: 'kind = ? AND ref = ?', whereArgs: ['nt', id]);
    return true;
  }

  Future<bool> _mergeNtDel(dynamic db, int id, int ts) async {
    final cur = _notes[id];
    if (cur != null && cur.at > ts) return false;
    var changed = false;
    if ((_ntDel[id] ?? -1) < ts) {
      _ntDel[id] = ts;
      await db.insert('deletions', {'kind': 'nt', 'ref': id, 'deleted_at': ts},
          conflictAlgorithm: ConflictAlgorithm.replace);
      changed = true;
    }
    if (cur != null) {
      _notes.remove(id);
      await db.delete('notes', where: 'verse_id = ?', whereArgs: [id]);
      changed = true;
    }
    return changed;
  }
}
