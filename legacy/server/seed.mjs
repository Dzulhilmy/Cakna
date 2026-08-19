import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, q } from './db.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const load = f => JSON.parse(fs.readFileSync(path.join(__dir, 'data', f), 'utf8'));

const normAr = t => (t || '')
  .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');

const surahs = load('surahs.json');
const ayahs = load('ayahs.json');
const raw = load('modules-raw.json');

async function main() {
  await q('TRUNCATE surahs, ayahs, modules RESTART IDENTITY CASCADE');

  // ---- surahs ----
  for (const s of surahs) {
    await q(
      `INSERT INTO surahs(number,name_arabic,name_translit,name_ms,name_en,ayah_count,type)
       VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [s.number, s.name_arabic, s.name_translit, s.name_ms, s.name_en, s.ayah_count, s.type]
    );
  }
  console.log('surahs:', surahs.length);

  // ---- ayahs (batched) ----
  const cols = 13, batch = 400;
  for (let i = 0; i < ayahs.length; i += batch) {
    const slice = ayahs.slice(i, i + batch);
    const vals = [];
    const ph = slice.map((a, j) => {
      const b = j * cols;
      vals.push(a.global, a.surah, a.ayah, a.page, a.juz, a.ar, normAr(a.ar),
        a.tr_ms, a.tr_en, a.tr_id, a.translit, JSON.stringify(a.tajweed), a.sajdah);
      // 13 values + placeholder count must match cols-1... keep 13 cols
      return `($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},$${b + 8},$${b + 9},$${b + 10},$${b + 11},$${b + 12},$${b + 13})`;
    });
    await q(
      `INSERT INTO ayahs(global,surah,ayah,page,juz,ar,ar_plain,tr_ms,tr_en,tr_id,translit,tajweed,sajdah)
       VALUES ${ph.join(',')}`,
      vals
    );
  }
  console.log('ayahs:', ayahs.length);

  // ---- modules ----
  const mod = {};

  // cities -> [{name,lat,lng,tz}]
  mod.cities = (raw.cities || []).map(c => ({ name: c[0], lat: c[1], lng: c[2], tz: c[3] }));

  // asma -> [{number,arabic,latin,meaning_ms,meaning_en}]
  mod.asma = (raw.asma || []).map((a, i) => ({
    number: i + 1, arabic: a[0], latin: a[1], meaning_ms: a[2], meaning_en: raw.asma_en?.[i] ?? a[2],
  }));

  // helper: resolve a surah:from-to range to ayah rows from DB-less ayahs list
  const byKey = new Map(ayahs.map(a => [a.surah + ':' + a.ayah, a]));
  const range = (s, from, to) => {
    const out = [];
    for (let n = from; n <= to; n++) { const a = byKey.get(s + ':' + n); if (a) out.push({ global: a.global, surah: a.surah, ayah: a.ayah, ar: a.ar, tr: { ms: a.tr_ms, en: a.tr_en, id: a.tr_id }, tajweed: a.tajweed, translit: a.translit }); }
    return out;
  };

  // duas (quranic) -> [{title_ms,title_en,surah,from,to,ayahs:[...]}]
  mod.duas = (raw.doa || []).map((d, i) => ({
    title_ms: d[0], title_en: raw.doa_en?.[i] ?? d[0], surah: d[1], from: d[2], to: d[3], ayahs: range(d[1], d[2], d[3]),
  }));

  // dhikr -> { daily:[{arabic,latin_ms,latin_en,count}], quran:[{title_ms,title_en,surah,from,to,ayahs}] }
  mod.dhikr = {
    daily: (raw.zikir || []).map((z, i) => ({ arabic: z[0], latin_ms: z[1], latin_en: raw.zikir_en?.[i] ?? z[1], count: z[2] })),
    quran: (raw.zikir_quran || []).map((z, i) => ({ title_ms: z[0], title_en: raw.zikir_quran_en?.[i] ?? z[0], surah: z[1], from: z[2], to: z[3], ayahs: range(z[1], z[2], z[3]) })),
  };

  // yasin module: opening (istighfar/salawat) + fatihah + closing duas (best-effort from yasin_ar)
  mod.yasin = { opening: raw.yasin_ar || [], closing: [] };

  // hijri events -> [{key,month,i18n}]
  mod['hijri-events'] = (raw.hijri_events || []).map(e => ({ key: e[0], month: e[1], i18n: e[2] }));

  // daily duas -> [{title_ms,title_en,arabic,latin,meaning_ms,meaning_en}]
  mod['doa_h'] = (raw.doa_h || []).map(d => ({
    title_ms: d[0], title_en: d[1], arabic: d[2], latin: d[3], meaning_ms: d[4], meaning_en: d[5],
  }));

  // ibadah & mengaji: not in legacy data blob (were inline-rendered) -> minimal valid stubs
  mod.ibadah = raw.ibadah ?? { note: 'stub' };
  mod.mengaji = raw.mengaji ?? { note: 'stub' };

  for (const [key, value] of Object.entries(mod)) {
    await q('INSERT INTO modules(key,value) VALUES($1,$2) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value',
      [key, JSON.stringify(value)]);
  }
  console.log('modules:', Object.keys(mod).join(', '));

  const c = await q('SELECT (SELECT count(*) FROM surahs) s,(SELECT count(*) FROM ayahs) a,(SELECT count(*) FROM modules) m');
  console.log('DB counts:', c.rows[0]);
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
