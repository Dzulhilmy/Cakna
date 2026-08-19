/* Extract embedded data from the legacy pwa/index.html and normalise it
   into the shapes the new "Cakna" SvelteKit frontend expects from /api/*. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dir, '../pwa/index.html');
const OUT = path.resolve(__dir, 'data');
fs.mkdirSync(OUT, { recursive: true });

const html = fs.readFileSync(SRC, 'utf8');

/* ---- 1. the embedded data <script id="quran-data"> block (pure data) ---- */
const dataBlock = html.split('<script id="quran-data">')[1].split('</script>')[0];

/* ---- 2. balanced-extract specific `const NAME=...;` from the main script ---- */
function extractConst(name) {
  const re = new RegExp('const\\s+' + name + '\\s*=');
  const m = re.exec(html);
  if (!m) throw new Error('const not found: ' + name);
  let i = m.index + m[0].length;
  // scan to the terminating ; at bracket-depth 0, respecting strings
  let depth = 0, str = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (str) {
      if (c === '\\') { i++; continue; }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '[' || c === '{' || c === '(') depth++;
    else if (c === ']' || c === '}' || c === ')') depth--;
    else if (c === ';' && depth === 0) break;
  }
  return html.slice(m.index, i + 1);
}

const mainConsts = [
  'SURAHS', 'SAJDAH', 'SURAH_EN',
  'ASMA', 'ASMA_EN', 'DOA', 'DOA_EN',
  'ZIKIR', 'ZIKIR_EN', 'ZIKIR_QURAN', 'ZIKIR_QURAN_EN',
  'CITIES', 'HIJRI_EVENTS', 'DOA_H', 'YASIN_AR', 'MATHURAT',
];
let mainSrc = '';
for (const n of mainConsts) {
  try { mainSrc += extractConst(n) + '\n'; }
  catch (e) { console.warn('  skip', n, '-', e.message); }
}

/* ---- 3. evaluate everything in one function scope, return the values ---- */
const names = ['QURAN', 'PAGE_STARTS', 'JUZ_STARTS', 'TAJ', 'TRANS_EXTRA', 'TRANSLIT', 'TAJ_DUA',
  ...mainConsts];
const body = dataBlock + '\n' + mainSrc + '\n return {' +
  names.map(n => `${n}: (typeof ${n}!=="undefined"?${n}:undefined)`).join(',') + '};';
const D = new Function(body)();

/* ---- 4. normalise ---- */
const { QURAN, PAGE_STARTS, JUZ_STARTS, TAJ, TRANS_EXTRA, TRANSLIT, SURAHS, SAJDAH, SURAH_EN } = D;

const bsearch = (arr, g) => { let lo = 0, hi = arr.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (arr[m] <= g) lo = m; else hi = m - 1; } return lo; };
const sajdahSet = SAJDAH instanceof Set ? SAJDAH : new Set(SAJDAH);

// surahs
const surahs = SURAHS.map((s, i) => ({
  number: i + 1,
  name_arabic: s[0],
  name_translit: s[1],
  name_ms: s[2],
  name_en: SURAH_EN?.[i] ?? s[2],
  ayah_count: s[3],
  type: s[4],                         // "M" (Makki) | "D" (Madani)
}));

// ayahs — global 1-based sequential (matches cdn.islamic.network numbering)
const ayahs = [];
let global = 0;
for (let s = 0; s < 114; s++) {
  const ar = QURAN[s][0], ms = QURAN[s][1];
  const en = TRANS_EXTRA?.en?.[s] || [], id = TRANS_EXTRA?.id?.[s] || [];
  const tl = TRANSLIT?.[s] || [], tj = TAJ?.[s] || [];
  for (let a = 0; a < ar.length; a++) {
    global++;
    const g0 = global - 1;             // 0-based for PAGE/JUZ_STARTS
    const taj = Array.isArray(tj[a]) ? tj[a] : [];
    ayahs.push({
      global,
      surah: s + 1,
      ayah: a + 1,
      page: bsearch(PAGE_STARTS, g0) + 1,
      juz: bsearch(JUZ_STARTS, g0) + 1,
      ar: ar[a],
      tr_ms: ms[a] ?? '',
      tr_en: en[a] ?? '',
      tr_id: id[a] ?? '',
      translit: tl[a] ?? '',
      tajweed: taj,
      sajdah: sajdahSet.has((s + 1) + ':' + (a + 1)),
    });
  }
}

fs.writeFileSync(path.join(OUT, 'surahs.json'), JSON.stringify(surahs));
fs.writeFileSync(path.join(OUT, 'ayahs.json'), JSON.stringify(ayahs));

/* ---- 5. modules: stash raw + lightly-shaped content for later ---- */
const modules = {
  asma: D.ASMA, asma_en: D.ASMA_EN,
  doa: D.DOA, doa_en: D.DOA_EN,
  zikir: D.ZIKIR, zikir_en: D.ZIKIR_EN,
  zikir_quran: D.ZIKIR_QURAN, zikir_quran_en: D.ZIKIR_QURAN_EN,
  cities: D.CITIES,
  hijri_events: D.HIJRI_EVENTS,
  doa_h: D.DOA_H,
  yasin_ar: D.YASIN_AR,
  mathurat: D.MATHURAT,
};
fs.writeFileSync(path.join(OUT, 'modules-raw.json'), JSON.stringify(modules));

console.log('surahs:', surahs.length, '| ayahs:', ayahs.length,
  '| last global:', global, '| pages:', ayahs[ayahs.length - 1].page,
  '| juz:', ayahs[ayahs.length - 1].juz);
console.log('sajdah ayahs:', ayahs.filter(a => a.sajdah).length);
console.log('sample ayah[0]:', JSON.stringify(ayahs[0]).slice(0, 200));
console.log('modules present:', Object.entries(modules).filter(([k, v]) => v != null).map(([k]) => k).join(', '));
