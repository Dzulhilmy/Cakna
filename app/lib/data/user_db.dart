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
      version: 1,
      onCreate: (db, _) async {
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
      },
    );
  }
}
