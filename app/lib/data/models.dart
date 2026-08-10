// Domain models mapped from the bundled quran.db (Tilawah dataset).

class Surah {
  final int id; // 1..114
  final String name; // Arabic
  final String nameTrans; // latin
  final String nameEn; // english meaning
  final String type; // Mekah / Madinah
  final int order; // revelation order
  final bool bismillah;
  final int verseCount;

  Surah({
    required this.id,
    required this.name,
    required this.nameTrans,
    required this.nameEn,
    required this.type,
    required this.order,
    required this.bismillah,
    required this.verseCount,
  });

  factory Surah.fromRow(Map<String, Object?> r) => Surah(
        id: r['id'] as int,
        name: r['name'] as String,
        nameTrans: r['name_trans'] as String,
        nameEn: (r['name_en'] as String).trim(),
        type: r['type'] as String,
        order: r['order'] as int,
        bismillah: (r['bismillah'] as int) == 1,
        verseCount: r['verse_count'] as int,
      );

  bool get isMakki => type.toLowerCase().startsWith('mek');
}

class Verse {
  final int id; // global 1..6236
  final int surahId;
  final int verseNumber;
  final int juz;
  final int page;
  final String textUthmani;
  final String translationMs;
  final String translationEn;
  final String translationId;

  Verse({
    required this.id,
    required this.surahId,
    required this.verseNumber,
    required this.juz,
    required this.page,
    required this.textUthmani,
    required this.translationMs,
    required this.translationEn,
    required this.translationId,
  });

  factory Verse.fromRow(Map<String, Object?> r) => Verse(
        id: r['id'] as int,
        surahId: r['surah_id'] as int,
        verseNumber: r['verse_number'] as int,
        juz: r['juz_number'] as int,
        page: r['page_number'] as int,
        textUthmani: r['text_uthmani'] as String,
        translationMs: (r['translation_ms'] ?? '') as String,
        translationEn: (r['translation_en'] ?? '') as String,
        translationId: (r['translation_id'] ?? '') as String,
      );

  String ref() => '$surahId:$verseNumber';
}

/// A token on a mushaf page line. A word carries its `text_code` glyph string
/// (rendered by the page-specific QCF font, family QCFP{page}); an ayah-end
/// marker carries the ayah number (rendered as a circular badge). Both keep
/// their verse id so taps map back to an ayah.
class PageGlyph {
  final int line;
  final int position; // page `arrangement` sequence (correct render order)
  final String code; // page-font glyph string (words only)
  final int verseId;
  final int ayahNumber;
  final String marker; // '' = word; else 'end' | 'rub-el-hizb' | 'sajdah' | 'sajdah_obligatory'
  final int wordPos; // 1-based word position in the ayah (0 for punctuation)

  PageGlyph({
    required this.line,
    required this.position,
    required this.code,
    required this.verseId,
    required this.ayahNumber,
    required this.marker,
    this.wordPos = 0,
  });

  bool get isWord => marker.isEmpty;
  bool get isEnd => marker == 'end';
  bool get isRub => marker == 'rub-el-hizb';
  bool get isSajdah => marker == 'sajdah' || marker == 'sajdah_obligatory';
}

/// Marks a special line on a page (surah header band or bismillah).
class LineMark {
  final int page;
  final int line;
  final String type; // 'surah' | 'bismillah'
  final int? surahId;

  LineMark({required this.page, required this.line, required this.type, this.surahId});

  factory LineMark.fromRow(Map<String, Object?> r) => LineMark(
        page: r['page_number'] as int,
        line: r['line_number'] as int,
        type: r['type'] as String,
        surahId: r['surah_id'] as int?,
      );
}

class QuranRef {
  final int surah, ayahFrom, ayahTo;
  QuranRef(this.surah, this.ayahFrom, this.ayahTo);
  factory QuranRef.fromJson(Map<String, dynamic> j) =>
      QuranRef(j['surah'] as int, j['ayah_from'] as int, j['ayah_to'] as int);
}

/// One Al-Ma'thurat item (from mathurat.json). Either a Quran range
/// (`quranRef`), a fixed dhikr (`arabic`), or morning/evening variants
/// (`arabicPagi`/`arabicPetang`).
class MathuratItem {
  final int position; // 1..46
  final QuranRef? quranRef;
  final String? arabic;
  final String? arabicPagi;
  final String? arabicPetang;
  final int repeatN; // Sughra count
  final int? repeatFull; // Kubra count (defaults to repeatN)
  final bool core; // Kubra-only
  final String titleMs, titleEn;
  final String? meaningMs, meaningEn;

  MathuratItem({
    required this.position,
    required this.quranRef,
    required this.arabic,
    required this.arabicPagi,
    required this.arabicPetang,
    required this.repeatN,
    required this.repeatFull,
    required this.core,
    required this.titleMs,
    required this.titleEn,
    required this.meaningMs,
    required this.meaningEn,
  });

  factory MathuratItem.fromJson(Map<String, dynamic> j) => MathuratItem(
        position: j['position'] as int,
        quranRef: j['quran_ref'] == null
            ? null
            : QuranRef.fromJson(j['quran_ref'] as Map<String, dynamic>),
        arabic: j['arabic'] as String?,
        arabicPagi: j['arabic_pagi'] as String?,
        arabicPetang: j['arabic_petang'] as String?,
        repeatN: j['repeat_n'] as int,
        repeatFull: j['repeat_full'] as int?,
        core: j['core'] as bool,
        titleMs: j['title_ms'] as String,
        titleEn: j['title_en'] as String,
        meaningMs: j['meaning_ms'] as String?,
        meaningEn: j['meaning_en'] as String?,
      );

  int target(bool kubra) => kubra ? (repeatFull ?? repeatN) : repeatN;

  /// Fixed dhikr text for a given time of day (null for Quran-ref items).
  String? dhikrFor(bool pagi) => arabic ?? (pagi ? arabicPagi : arabicPetang);
}

class Word {
  final int verseId;
  final int position;
  final String arabic; // uthmani
  final String madani; // text_madani — pre-shaped glyphs for the MeQuran font;
  // its codepoints align 1:1 with the `rules` tokens (unlike text_uthmani)
  final String ms;
  final String en;
  final String id;
  final String? rules; // per-char tajweed rule codes (comma-separated)

  Word({
    required this.verseId,
    required this.position,
    required this.arabic,
    required this.madani,
    required this.ms,
    required this.en,
    required this.id,
    required this.rules,
  });

  factory Word.fromRow(Map<String, Object?> r) => Word(
        verseId: r['verse_id'] as int,
        position: r['position'] as int,
        arabic: r['text_uthmani'] as String,
        madani: (r['text_madani'] ?? r['text_uthmani'] ?? '') as String,
        ms: (r['translation_ms'] ?? '') as String,
        en: (r['translation_en'] ?? '') as String,
        id: (r['translation_id'] ?? '') as String,
        rules: r['rules'] as String?,
      );
}
