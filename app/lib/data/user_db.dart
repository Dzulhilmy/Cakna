import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

/// A small writable SQLite database for local user state (bookmarks, notes,
/// collections). Separate from the read-only bundled quran.db.
class UserDb {
  Database? _db;

  Future<Database> get db async => _db ??= await _open();

  Future<Database> _open() async {
    final dir = await getApplicationSupportDirectory();
    return openDatabase(
      p.join(dir.path, 'cakna_user.db'),
      version: 4,
      onCreate: (db, _) async {
        await _bookmarksAndNotes(db);
        await _reading(db);
        await _readTime(db);
        await _deletions(db);
      },
      onUpgrade: (db, oldV, newV) async {
        if (oldV < 2) await _reading(db);
        if (oldV < 3) await _readTime(db);
        if (oldV < 4) await _deletions(db);
      },
    );
  }

  Future<void> _bookmarksAndNotes(Database db) async {
    await db.execute('''
      CREATE TABLE bookmarks (
        verse_id   INTEGER PRIMARY KEY,
        collection TEXT NOT NULL DEFAULT 'Umum',
        created_at INTEGER NOT NULL
      )''');
    await db.execute('''
      CREATE TABLE notes (
        verse_id   INTEGER PRIMARY KEY,
        body       TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )''');
  }

  Future<void> _reading(Database db) async {
    // pages ever read (for khatam progress) and per-day counts (for streak)
    await db.execute('''
      CREATE TABLE read_pages (
        page    INTEGER PRIMARY KEY,
        read_at INTEGER NOT NULL
      )''');
    await db.execute('''
      CREATE TABLE read_log (
        day   TEXT PRIMARY KEY,
        count INTEGER NOT NULL
      )''');
  }

  Future<void> _readTime(Database db) async {
    // per-day reading time in seconds (for the "Minutes" progress stat)
    await db.execute('''
      CREATE TABLE read_time (
        day     TEXT PRIMARY KEY,
        seconds INTEGER NOT NULL
      )''');
  }

  Future<void> _deletions(Database db) async {
    // tombstones for cross-device deletion sync (LWW-element-set).
    // kind: 'bm' (bookmark) | 'nt' (note); ref = verse_id.
    await db.execute('''
      CREATE TABLE deletions (
        kind       TEXT NOT NULL,
        ref        INTEGER NOT NULL,
        deleted_at INTEGER NOT NULL,
        PRIMARY KEY (kind, ref)
      )''');
  }
}
