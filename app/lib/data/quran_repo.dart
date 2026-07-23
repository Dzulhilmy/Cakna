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
    // Order by the page-level `arrangement` sequence (NOT per-verse `position`),
    // which correctly interleaves each ayah-end marker between the verses that
    // share a line. Ordering by position scrambles the ~44% of lines that hold
    // more than one verse.
    // wpos is the DENSE per-verse word rank (1..N), not the raw sparse
    // quran_word.position — timing_segments.word_position is dense, and ~43%
    // of verses have gaps in `position`, so matching on the raw value would
    // highlight the wrong word. The correlated count also stays correct for
    // verses that span a page boundary.
    final rows = await db.rawQuery('''
      SELECT w.line_number AS line, w.arrangement AS arr, w.text_code AS code,
             w.verse_id AS vid, v.verse_number AS vn, '' AS mk,
             (SELECT COUNT(*) FROM quran_word w2
               WHERE w2.verse_id = w.verse_id AND w2.text_code IS NOT NULL
                 AND w2.position <= w.position) AS wpos
      FROM quran_word w JOIN quran_verse v ON v.id = w.verse_id
      WHERE v.page_number = ? AND w.text_code IS NOT NULL
      UNION ALL
      SELECT pu.line_number, pu.arrangement, NULL, pu.verse_id, v.verse_number, pu.char_type, 0
      FROM quran_punctuation pu JOIN quran_verse v ON v.id = pu.verse_id
      WHERE v.page_number = ? AND pu.char_type IN ('end','rub-el-hizb','sajdah','sajdah_obligatory')
      ORDER BY line, arr
    ''', [page, page]);
    return rows
        .map((r) => PageGlyph(
              line: r['line'] as int,
              position: r['arr'] as int,
              code: (r['code'] ?? '') as String,
              verseId: r['vid'] as int,
              ayahNumber: r['vn'] as int,
              marker: (r['mk'] ?? '') as String,
              wordPos: (r['wpos'] ?? 0) as int,
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

  /// First mushaf page of a surah.
  Future<int> firstPageOfSurah(int surahId) async {
    final db = await _db.quran;
    final r = await db.rawQuery(
      'SELECT MIN(page_number) AS p FROM quran_verse WHERE surah_id = ?',
      [surahId],
    );
    return (r.first['p'] as int?) ?? 1;
  }

  /// Search surahs by name — latin transliteration or meaning, ignoring
  /// case/hyphens/apostrophes ("alkahfi", "Ya Sin" → Al-Kahfi, Ya-Sin);
  /// Arabic queries match the surah's Arabic name, harakat-insensitive.
  Future<List<Surah>> searchSurahs(String q, {int limit = 12}) async {
    final raw = q.trim();
    if (raw.length < 2) return [];
    final all = await surahs();
    if (RegExp(r'[؀-ۿ]').hasMatch(raw)) {
      final bare = _stripHarakat(raw);
      return [
        for (final s in all)
          if (_stripHarakat(s.name).contains(bare)) s
      ].take(limit).toList();
    }
    String norm(String s) => s.toLowerCase().replaceAll(RegExp(r"[-'’\s]"), '');
    final query = norm(raw);
    return [
      for (final s in all)
        if (norm(s.nameTrans).contains(query) || norm(s.nameEn).contains(query)) s
    ].take(limit).toList();
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
