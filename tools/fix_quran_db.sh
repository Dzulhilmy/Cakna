#!/usr/bin/env bash
# Data-correctness fixes for app/assets/data/quran.db (the DB itself is
# gitignored — this script is the committed record of the changes).
#
# 1. Juz boundaries: the source DB assigned juz by 20-page blocks; four
#    boundaries disagree with the canonical ayah-based divisions
#    (verified against https://api.quran.com/api/v4/juzs on 2026-07-08):
#      3:92    juz 4  -> 3   (juz 3 ends at Al-Imran 92)
#      5:82    juz 6  -> 7   (juz 7 starts at Al-Ma'idah 82)
#      9:93    juz 10 -> 11  (juz 11 starts at At-Tawbah 93)
#      45:33-37 juz 26 -> 25 (juz 25 ends at Al-Jathiyah 37; juz 26 = 46:1)
#    A full programmatic diff of all 6236 verses found exactly these 8 rows.
# 2. quran_surah.name_en: 94 of 114 rows carried a trailing newline.
set -euo pipefail

DB="$(dirname "$0")/../app/assets/data/quran.db"

sqlite3 "$DB" <<'SQL'
BEGIN TRANSACTION;

UPDATE quran_verse SET juz_number = 3  WHERE surah_id = 3  AND verse_number = 92;
UPDATE quran_verse SET juz_number = 7  WHERE surah_id = 5  AND verse_number = 82;
UPDATE quran_verse SET juz_number = 11 WHERE surah_id = 9  AND verse_number = 93;
UPDATE quran_verse SET juz_number = 25 WHERE surah_id = 45 AND verse_number BETWEEN 33 AND 37;

UPDATE quran_surah SET name_en = TRIM(name_en, char(10) || char(13) || ' ');

COMMIT;
SQL

echo "verify (both counts must be 0):"
sqlite3 "$DB" "SELECT COUNT(*) FROM quran_verse
  WHERE (surah_id = 3  AND verse_number = 92  AND juz_number <> 3)
     OR (surah_id = 5  AND verse_number = 82  AND juz_number <> 7)
     OR (surah_id = 9  AND verse_number = 93  AND juz_number <> 11)
     OR (surah_id = 45 AND verse_number BETWEEN 33 AND 37 AND juz_number <> 25);"
sqlite3 "$DB" "SELECT COUNT(*) FROM quran_surah
  WHERE substr(name_en, -1, 1) IN (char(10), char(13), ' ');"
