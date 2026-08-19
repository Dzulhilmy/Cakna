/* Rebuild ONLY the modules table (fast to iterate; ayahs/surahs untouched).
   Shapes reverse-engineered from the compiled frontend route nodes. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, q } from './db.mjs';
import { authorIbadah } from './content/ibadah.mjs';
import { authorMengaji } from './content/mengaji.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(fs.readFileSync(path.join(__dir, 'data', 'modules-raw.json'), 'utf8'));
const ayahs = JSON.parse(fs.readFileSync(path.join(__dir, 'data', 'ayahs.json'), 'utf8'));

async function main() {
  const mod = {};

  // cities -> [{name,lat,lng,tz}]
  mod.cities = (raw.cities || []).map(c => ({ name: c[0], lat: c[1], lng: c[2], tz: c[3] }));

  // asma -> [{position,arabic,translit,meaning_ms,meaning_en}]
  mod.asma = (raw.asma || []).map((a, i) => ({
    position: i + 1, arabic: a[0], translit: a[1], meaning_ms: a[2], meaning_en: raw.asma_en?.[i] ?? a[2],
  }));

  // dhikr -> flat array; kind 'phrase' | 'quran'; keyed in the UI by unique `position`
  let dpos = 0;
  mod.dhikr = [
    ...(raw.zikir || []).map((z, i) => ({ kind: 'phrase', position: dpos++, arabic: z[0], label_ms: z[1], label_en: raw.zikir_en?.[i] ?? z[1], target_count: z[2] })),
    ...(raw.zikir_quran || []).map((z, i) => ({ kind: 'quran', position: dpos++, label_ms: z[0], label_en: raw.zikir_quran_en?.[i] ?? z[0], quran_ref: { surah: z[1], ayah_from: z[2], ayah_to: z[3] } })),
  ];

  // duas -> flat array; kind 'quran' | 'hadith'
  let pos = 0;
  mod.duas = [
    ...(raw.doa || []).map((d, i) => ({ kind: 'quran', position: pos++, title_ms: d[0], title_en: raw.doa_en?.[i] ?? d[0], surah: d[1], ayah_from: d[2], ayah_to: d[3], quran_ref: { surah: d[1], ayah_from: d[2], ayah_to: d[3] } })),
    ...(raw.doa_h || []).map(d => ({ kind: 'hadith', position: pos++, title_ms: d[0], title_en: d[1], arabic: d[2], meaning_ms: d[4], meaning_en: d[5] })),
  ];

  // yasin -> {closing:[{arabic,tajweed}]}  the page loops closing[] AND indexes closing[2],
  // so all three yasin_ar entries are needed: [0]=istighfar, [1]=salawat, [2]=closing du'a
  mod.yasin = { closing: (raw.yasin_ar || []).map(a => ({ arabic: a, tajweed: [] })) };

  // ibadah + mengaji -> authored (no source data in the legacy blob)
  mod.ibadah = authorIbadah();
  mod.mengaji = authorMengaji();

  // hijri-events -> [{month_code,day,label_key}]  (client fn P scans forward from today,
  // matching day + Umm-al-Qura month name, to build the "upcoming dates" list)
  mod['hijri-events'] = (raw.hijri_events || []).map(e => ({ month_code: e[0], day: e[1], label_key: e[2] }));

  for (const [key, value] of Object.entries(mod)) {
    await q('INSERT INTO modules(key,value) VALUES($1,$2) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value',
      [key, JSON.stringify(value)]);
  }
  console.log('modules rebuilt:', Object.keys(mod).map(k => `${k}(${Array.isArray(mod[k]) ? mod[k].length : 'obj'})`).join(', '));
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
