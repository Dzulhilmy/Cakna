#!/usr/bin/env python3
"""
Reseed mobile app/assets/data/quran.db from data/extracted/ JSON files.

What is updated:
  quran_surah : name_trans, name_en (real English), name_ms (new column, Malay)
  quran_verse : text_uthmani, text_simple, translation_ms, translation_en, translation_id

What is NOT touched (intentional):
  quran_verse.page_number  — locked to QCF page-font glyph encoding; changing it
                             would render wrong glyphs on the mushaf page view.
  quran_verse.juz_number   — already in sync (0 differences confirmed).
  quran_verse.text_madani  — pre-shaped glyphs for MeQuran font; no equivalent
                             in extracted JSON.
  quran_word.*             — QCF glyph codes and timing data; different source.
  quran_punctuation.*      — page-layout markers tied to page_number encoding.
  quran_linemark.*         — same as above.
"""
import json
import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).parent.parent
DB_SRC = BASE / 'app/assets/data/quran.db'
EXTRACTED = BASE / 'data/extracted'

# ── Load JSON sources ────────────────────────────────────────────────────────
print('Loading extracted data...')
surahs_json  = json.load(open(EXTRACTED / 'surahs.json', encoding='utf-8'))
ayahs_json   = json.load(open(EXTRACTED / 'ayahs.json',  encoding='utf-8'))
trans_json   = json.load(open(EXTRACTED / 'translations.json', encoding='utf-8'))

trans_ms = trans_json['ms']   # indexed 0..6235
trans_en = trans_json['en']
trans_id = trans_json['id']

assert len(ayahs_json) == 6236, f"expected 6236 ayahs, got {len(ayahs_json)}"
assert len(trans_ms)   == 6236
assert len(trans_en)   == 6236
assert len(trans_id)   == 6236

# ── Backup ───────────────────────────────────────────────────────────────────
backup = DB_SRC.parent / 'quran.db.bak'
if not backup.exists():
    print(f'Backing up to {backup.name}...')
    shutil.copy2(DB_SRC, backup)
else:
    print(f'Backup already exists at {backup.name}, skipping.')

# ── Open DB ──────────────────────────────────────────────────────────────────
print(f'Opening {DB_SRC}...')
db = sqlite3.connect(str(DB_SRC))
db.row_factory = sqlite3.Row
now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')

# ── Add name_ms column (idempotent) ─────────────────────────────────────────
existing_cols = {row['name'] for row in db.execute('PRAGMA table_info(quran_surah)')}
if 'name_ms' not in existing_cols:
    print('Adding name_ms column to quran_surah...')
    db.execute('ALTER TABLE quran_surah ADD COLUMN name_ms TEXT NOT NULL DEFAULT ""')
else:
    print('name_ms column already exists.')

# ── Update quran_surah ───────────────────────────────────────────────────────
print('Updating quran_surah (name_trans, name_en, name_ms)...')
surah_rows = {row['id']: row for row in db.execute('SELECT id, name_trans, name_en FROM quran_surah')}

changed_surahs = 0
for s in surahs_json:
    sid          = s['number']
    name_trans   = s['name_translit']
    name_en      = s['name_en']
    name_ms      = s['name_ms']
    old          = surah_rows.get(sid)
    if old and (old['name_trans'] != name_trans or old['name_en'] != name_en):
        changed_surahs += 1
    db.execute(
        'UPDATE quran_surah SET name_trans=?, name_en=?, name_ms=?, modified=? WHERE id=?',
        (name_trans, name_en, name_ms, now, sid)
    )

print(f'  {changed_surahs} surahs had name changes.')

# ── Build ayah lookup by (surah, verse_number) ───────────────────────────────
# ayahs_json is ordered global 1..6236; translations are parallel arrays.
ayah_by_key = {}
for i, a in enumerate(ayahs_json):
    key = (a['surah'], a['ayah'])
    ayah_by_key[key] = {
        'text_uthmani':   a['text_ar'],
        'text_simple':    a['text_plain'],
        'translation_ms': trans_ms[i],
        'translation_en': trans_en[i],
        'translation_id': trans_id[i],
    }

# ── Update quran_verse ───────────────────────────────────────────────────────
print('Fetching verses from DB...')
db_verses = db.execute(
    'SELECT id, surah_id, verse_number FROM quran_verse ORDER BY id'
).fetchall()
print(f'Updating {len(db_verses)} verses...')

unmatched = []
text_changes = 0
trans_changes = 0

for v in db_verses:
    key = (v['surah_id'], v['verse_number'])
    ext = ayah_by_key.get(key)
    if ext is None:
        unmatched.append(key)
        continue

    db.execute('''
        UPDATE quran_verse
        SET text_uthmani=?,   text_simple=?,
            translation_ms=?, translation_en=?, translation_id=?,
            modified=?
        WHERE id=?
    ''', (
        ext['text_uthmani'], ext['text_simple'],
        ext['translation_ms'], ext['translation_en'], ext['translation_id'],
        now, v['id']
    ))
    text_changes  += 1
    trans_changes += 1

if unmatched:
    print(f'  WARNING: {len(unmatched)} unmatched verses: {unmatched[:10]}')

print(f'  Text updated:         {text_changes}')
print(f'  Translations updated: {trans_changes}')

# ── Commit & vacuum ──────────────────────────────────────────────────────────
print('Committing...')
db.commit()
print('Running VACUUM to shrink file...')
db.execute('VACUUM')
db.close()

print()
print('Done. Remember to bump _assetVersion in app/lib/data/db.dart.')
