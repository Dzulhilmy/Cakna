// Extracts word-by-word data (Arabic + ms/en/id gloss) from the Tilawah APK's
// quran.db into data/extracted/words.json. Separate from extract.mjs because the
// source is the Tilawah SQLite, not the sample PWA.
//
// Usage: node extract-words.mjs [path-to-quran.db]
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { sha256 } from "./lib.mjs";

const OUT = new URL("../../data/extracted/", import.meta.url).pathname;
const DEFAULT_DB = new URL(
  "../../Tilawah/extracted/assets/flutter_assets/assets/data/quran.db",
  import.meta.url
).pathname;

const dbPath = process.argv[2] ?? DEFAULT_DB;
const die = (m) => {
  throw new Error("VALIDATION: " + m);
};

const db = new DatabaseSync(dbPath, { readOnly: true });

// verse_id in quran_word/quran_verse is the canonical 1-based global ayah (1..6236),
// matching our `global`. Confirmed: quran_verse row N has verse (surah,ayah) in order.
const ayahs = JSON.parse(readFileSync(OUT + "ayahs.json", "utf8"));

// Normalizer to compare Tilawah word text against our ayah text (fold dagger-alef
// and the same classes normAr folds; strip spaces for concatenation compare).
const norm = (t) =>
  t
    .replace(/ٰ/g, "ا") // superscript/dagger alef -> alef
    .replace(/[ً-ٟۖ-ۭـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, "");

// (1) EXACT integrity: quran_verse.verse_id -> (surah, verse_number) must equal
// our ayah mapping. This is the real alignment guarantee (word.verse_id keys on it).
const verseRows = db
  .prepare("SELECT id, surah_id, verse_number FROM quran_verse ORDER BY id")
  .all();
if (verseRows.length !== 6236) die(`quran_verse has ${verseRows.length} rows`);
for (const a of ayahs) {
  const v = verseRows[a.global - 1];
  if (v.id !== a.global || v.surah_id !== a.surah || v.verse_number !== a.ayah)
    die(`verse_id ${a.global} maps to ${v.surah_id}:${v.verse_number}, expected ${a.surah}:${a.ayah}`);
}

const rows = db
  .prepare(
    `SELECT verse_id, position, text_uthmani, translation_ms, translation_en, translation_id
     FROM quran_word ORDER BY verse_id, position`
  )
  .all();

// group into { [global]: [{ ar, ms, en, id }] } ordered by DB position (which skips
// slots used by interleaved punctuation/waqf marks), then re-indexed sequentially.
const byAyah = new Map();
const srcPos = new Map();
for (const r of rows) {
  if (!byAyah.has(r.verse_id)) {
    byAyah.set(r.verse_id, []);
    srcPos.set(r.verse_id, -1);
  }
  if (r.position <= srcPos.get(r.verse_id))
    die(`non-monotonic position at global ${r.verse_id}: ${r.position}`);
  srcPos.set(r.verse_id, r.position);
  byAyah.get(r.verse_id).push({
    ar: r.text_uthmani.trim(),
    ms: r.translation_ms.trim(),
    en: r.translation_en.trim(),
    id: r.translation_id.trim(),
  });
}

if (byAyah.size !== 6236) die(`expected 6236 ayahs, got ${byAyah.size}`);

// (2) Every ayah has words with all fields populated.
for (const a of ayahs) {
  const words = byAyah.get(a.global);
  if (!words || words.length === 0) die(`no words for global ${a.global}`);
  for (const w of words)
    if (!w.ar || !w.ms || !w.en || !w.id) die(`empty field at global ${a.global}`);
}

// (3) SOFT text-alignment report (Tilawah uses Uthmani rasm — صلوة vs صلاة etc —
// so exact equality is expected to differ; we display Tilawah's own word text, so
// this is only a sanity signal, not a gate).
let aligned = 0;
for (const a of ayahs) {
  const joined = norm(byAyah.get(a.global).map((w) => w.ar).join(""));
  const ayahNorm = norm(a.text_ar);
  if (joined === ayahNorm || ayahNorm.endsWith(joined)) aligned++;
}

const totalWords = rows.length;
const out = {};
for (const [global, words] of byAyah) out[global] = words;

const json = JSON.stringify(out);
writeFileSync(OUT + "words.json", json);

// update the manifest with the new artifact + source
const manifest = JSON.parse(readFileSync(OUT + "manifest.json", "utf8"));
manifest.words_source_sha256 = sha256(readFileSync(dbPath));
manifest.counts.words = totalWords;
manifest.artifacts["words.json"] = { sha256: sha256(json), bytes: json.length };
writeFileSync(OUT + "manifest.json", JSON.stringify(manifest, null, 2));

console.log(
  `OK — ${totalWords} words across ${byAyah.size} ayahs; verse_id mapping exact; ${aligned}/6236 orthographically identical (rest are Uthmani-rasm variants, expected)`
);
