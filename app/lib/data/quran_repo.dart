import 'db.dart';
import 'models.dart';

/// Read queries over the bundled quran.db.
class QuranRepo {
  final CaknaDb _db;
  QuranRepo(this._db);

  List<Surah>? _surahCache;

  Future<List<Surah>> surahs() async {
    if (_surahCache != null) return _surahCache!;
    final db = await _db.quran;
    final rows = await db.query('quran_surah', orderBy: 'id');
    return _surahCache = rows.map(Surah.fromRow).toList();
  }

  Future<Surah> surah(int id) async {
    final all = await surahs();
    return all.firstWhere((s) => s.id == id);
  }

  Future<List<Verse>> versesForSurah(int surahId) async {
    final db = await _db.quran;
    final rows = await db.query(
      'quran_verse',
      where: 'surah_id = ?',
      whereArgs: [surahId],
      orderBy: 'verse_number',
    );
    return rows.map(Verse.fromRow).toList();
  }

  Future<List<Verse>> versesForPage(int page) async {
    final db = await _db.quran;
    final rows = await db.query(
      'quran_verse',
      where: 'page_number = ?',
      whereArgs: [page],
      orderBy: 'id',
    );
    return rows.map(Verse.fromRow).toList();
  }

  Future<Verse> verse(int global) async {
    final db = await _db.quran;
    final rows = await db.query('quran_verse', where: 'id = ?', whereArgs: [global], limit: 1);
    return Verse.fromRow(rows.first);
  }

  /// All glyph tokens (words via `text_code` + ayah-end markers) on a mushaf
  /// page, ordered by line then position. `text_code` maps 1:1 onto the page
  /// font (QCFP{page}); markers render as number badges.
  Future<List<PageGlyph>> pageGlyphs(int page) async {
    final db = await _db.quran;
    final rows = await db.rawQuery('''
      SELECT w.line_number AS line, w.position AS pos, w.text_code AS code,
             w.verse_id AS vid, v.verse_number AS vn, 0 AS is_end
      FROM quran_word w JOIN quran_verse v ON v.id = w.verse_id
      WHERE v.page_number = ? AND w.text_code IS NOT NULL
      UNION ALL
      SELECT pu.line_number, pu.position, NULL, pu.verse_id, v.verse_number, 1
      FROM quran_punctuation pu JOIN quran_verse v ON v.id = pu.verse_id
      WHERE v.page_number = ? AND pu.char_type = 'end'
      ORDER BY line, pos
    ''', [page, page]);
    return rows
        .map((r) => PageGlyph(
              line: r['line'] as int,
              position: r['pos'] as int,
              code: (r['code'] ?? '') as String,
              verseId: r['vid'] as int,
              ayahNumber: r['vn'] as int,
              isEnd: (r['is_end'] as int) == 1,
            ))
        .toList();
  }

  Future<List<LineMark>> lineMarks(int page) async {
    final db = await _db.quran;
    final rows = await db.query('quran_linemark',
        where: 'page_number = ?', whereArgs: [page], orderBy: 'line_number');
    return rows.map(LineMark.fromRow).toList();
  }

  Future<List<Word>> words(int verseId) async {
    final db = await _db.quran;
    final rows = await db.query('quran_word',
        where: 'verse_id = ?', whereArgs: [verseId], orderBy: 'position');
    return rows.map(Word.fromRow).toList();
  }

  /// First mushaf page of a juz (1..30).
  Future<int> firstPageOfJuz(int juz) async {
    final db = await _db.quran;
    final r = await db.rawQuery(
      'SELECT MIN(page_number) AS p FROM quran_verse WHERE juz_number = ?',
      [juz],
    );
    return (r.first['p'] as int?) ?? 1;
  }

  /// Page count (604 for the Madani mushaf).
  Future<int> pageCount() async {
    final db = await _db.quran;
    final r = await db.rawQuery('SELECT MAX(page_number) AS n FROM quran_verse');
    return (r.first['n'] as int?) ?? 604;
  }

  /// Search verses. Arabic queries match the harakat-free `text_simple`
  /// column (diacritic-insensitive); other queries match the translation in
  /// the given language.
  Future<List<Verse>> search(String q, {String lang = 'ms', int limit = 60}) async {
    final query = q.trim();
    if (query.length < 2) return [];
    final db = await _db.quran;
    final isArabic = RegExp(r'[؀-ۿ]').hasMatch(query);
    if (isArabic) {
      final bare = _stripHarakat(query);
      final rows = await db.rawQuery(
        'SELECT * FROM quran_verse WHERE text_simple LIKE ? ORDER BY id LIMIT ?',
        ['%$bare%', limit],
      );
      return rows.map(Verse.fromRow).toList();
    }
    final col = switch (lang) { 'en' => 'translation_en', 'id' => 'translation_id', _ => 'translation_ms' };
    final rows = await db.rawQuery(
      'SELECT * FROM quran_verse WHERE $col LIKE ? ORDER BY id LIMIT ?',
      ['%$query%', limit],
    );
    return rows.map(Verse.fromRow).toList();
  }

  static String _stripHarakat(String t) => t
      .replaceAll(RegExp(r'[ً-ٰٟۖ-ۭـ]'), '')
      .replaceAll(RegExp('[أإآٱ]'), 'ا')
      .replaceAll('ى', 'ي')
      .replaceAll('ؤ', 'و')
      .replaceAll('ئ', 'ي');
}
