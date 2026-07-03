// Extracts all embedded data from the sample PWA into committed JSON artifacts.
// Usage: node extract.mjs [path-to-index.html]
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { loadSource, sha256, SOURCE } from "./lib.mjs";

const OUT = new URL("../../data/extracted/", import.meta.url).pathname;
const OUT_FE = new URL("../../data/frontend/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
mkdirSync(OUT_FE, { recursive: true });

const srcPath = process.argv[2] ?? SOURCE;
const { data, consts: c } = loadSource(srcPath);
const { QURAN, PAGE_STARTS, JUZ_STARTS, TAJ, TRANS_EXTRA, TAJ_DUA, TRANSLIT } = data;

const die = (msg) => {
  throw new Error("VALIDATION: " + msg);
};
const assert = (cond, msg) => cond || die(msg);

// ---------- normAr: EXACT port of sample L1534 ----------
const normAr = (t) =>
  t
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");

// ---------- index math (sample is 0-based; artifacts are 1-BASED global) ----------
const OFFSETS = [0];
for (let i = 0; i < 114; i++) OFFSETS.push(OFFSETS[i] + QURAN[i][0].length);
const TOTAL = OFFSETS[114];
assert(TOTAL === 6236, `total ayahs ${TOTAL}`);

const bsearch = (arr, g) => {
  let lo = 0,
    hi = arr.length - 1;
  while (lo < hi) {
    const m = (lo + hi + 1) >> 1;
    if (arr[m] <= g) lo = m;
    else hi = m - 1;
  }
  return lo;
};

const sajdahSet = new Set(c.SAJDAH);
assert(sajdahSet.size === 15, "sajdah count");

// ---------- surahs ----------
const surahs = c.SURAHS.map((s, i) => ({
  number: i + 1,
  name_ar: s[0],
  name_translit: s[1],
  name_ms: s[2],
  name_en: c.SURAH_EN[i],
  ayah_count: s[3],
  revelation: s[4],
  first_global: OFFSETS[i] + 1,
}));
assert(surahs.length === 114, "surah count");
surahs.forEach((s, i) => assert(s.ayah_count === QURAN[i][0].length, `ayah_count mismatch surah ${s.number}`));

// ---------- ayahs ----------
const surrogate = /[\uD800-\uDFFF]/;
const ayahs = [];
const ruleFreq = {};
for (let s = 0; s < 114; s++) {
  for (let a = 0; a < QURAN[s][0].length; a++) {
    const g0 = OFFSETS[s] + a; // 0-based
    const text = QURAN[s][0][a];
    assert(!surrogate.test(text), `surrogate pair in ${s + 1}:${a + 1}`);
    const rawTaj = TAJ[s][a];
    const taj = rawTaj === 0 ? [] : rawTaj;
    for (let i = 0; i < taj.length; i += 3) {
      const [pos, len, rule] = [taj[i], taj[i + 1], taj[i + 2]];
      assert(rule >= 0 && rule <= 10, `taj rule ${rule} at ${s + 1}:${a + 1}`);
      assert(pos >= 0 && pos + len <= text.length, `taj bounds at ${s + 1}:${a + 1}`);
      ruleFreq[rule] = (ruleFreq[rule] || 0) + 1;
    }
    ayahs.push({
      global: g0 + 1,
      surah: s + 1,
      ayah: a + 1,
      page: bsearch(PAGE_STARTS, g0) + 1,
      juz: bsearch(JUZ_STARTS, g0) + 1,
      sajdah: sajdahSet.has(`${s + 1}:${a + 1}`),
      text_ar: text,
      text_plain: normAr(text),
      tajweed: taj,
    });
  }
}
assert(ayahs.length === 6236, "ayahs count");
assert(ayahs.filter((a) => a.sajdah).length === 15, "sajdah rows");

// Audited tajweed rule frequencies — guards against drift/mis-parse.
const EXPECT_FREQ = { 0: 4978, 1: 10598, 2: 7862, 3: 2072, 4: 1124, 5: 992, 6: 1664, 7: 3743, 8: 1868, 9: 2868, 10: 1607 };
for (const [r, n] of Object.entries(EXPECT_FREQ))
  assert(ruleFreq[r] === n, `rule ${r} freq ${ruleFreq[r]} != ${n}`);

// page/juz sanity
assert(PAGE_STARTS.length === 604 && PAGE_STARTS[0] === 0, "PAGE_STARTS shape");
PAGE_STARTS.forEach((v, i) => i > 0 && assert(v > PAGE_STARTS[i - 1] && v < 6236, "PAGE_STARTS monotonic"));
assert(JUZ_STARTS.length === 30, "JUZ_STARTS shape");
assert(ayahs.filter((a) => a.page === 1).length === 7 && ayahs[6].surah === 1, "page 1 = Fatihah 1..7");
assert(ayahs[7].page === 2 && ayahs[7].surah === 2 && ayahs[7].ayah === 1, "page 2 starts 2:1");
assert(ayahs[6235].surah === 114 && ayahs[6235].ayah === 6, "g6236 = 114:6");
assert(new Set(ayahs.map((a) => a.page)).size === 604, "604 pages");
assert(new Set(ayahs.map((a) => a.juz)).size === 30, "30 juz");

// ---------- translations (ms lives inside QURAN[s][1]) ----------
const flat = (get) => {
  const out = [];
  for (let s = 0; s < 114; s++)
    for (let a = 0; a < QURAN[s][0].length; a++) out.push(get(s, a));
  return out;
};
const translations = {
  ms: flat((s, a) => QURAN[s][1][a]),
  en: flat((s, a) => TRANS_EXTRA.en[s][a]),
  id: flat((s, a) => TRANS_EXTRA.id[s][a]),
};
for (const l of ["ms", "en", "id"])
  assert(translations[l].length === 6236 && translations[l].every((t) => typeof t === "string" && t.length), `translations ${l}`);
const transliterations = flat((s, a) => TRANSLIT[s][a]);
assert(transliterations.length === 6236, "translit count");

// ---------- TAJ_DUA join ----------
const tdUsed = new Set();
const tajFor = (arabic) => {
  if (arabic && TAJ_DUA[arabic]) {
    tdUsed.add(arabic);
    return TAJ_DUA[arabic];
  }
  return [];
};

// ---------- modules ----------
const asma = c.ASMA.map((r, i) => ({
  position: i + 1,
  arabic: r[0],
  translit: r[1],
  meaning_ms: r[2],
  meaning_en: c.ASMA_EN[i],
}));
assert(asma.length === 99, "asma count");

const cities = c.CITIES.map((r, i) => ({
  id: i,
  name: r[0],
  lat: r[1],
  lng: r[2],
  tz: r[3],
  is_malaysia: i < c.MY_CITIES,
}));
assert(cities.length === 54 && cities.filter((x) => x.is_malaysia).length === 21, "cities");

const hijri_events = c.HIJRI_EVENTS.map(([month_code, day, label_key]) => ({ month_code, day, label_key }));

const qref = (s, a1, a2) => ({ surah: s, ayah_from: a1, ayah_to: a2 });

const dhikr = [
  ...c.ZIKIR.map((z, i) => ({
    kind: "phrase",
    position: i + 1,
    arabic: z[0],
    label_ms: z[1],
    label_en: c.ZIKIR_EN[i],
    target_count: z[2],
    quran_ref: null,
    tajweed: tajFor(z[0]),
  })),
  ...c.ZIKIR_QURAN.map((z, i) => ({
    kind: "quran",
    position: i + 1,
    arabic: null,
    label_ms: z[0],
    label_en: c.ZIKIR_QURAN_EN[i],
    target_count: null,
    quran_ref: qref(z[1], z[2], z[3]),
    tajweed: [],
  })),
];

const duas = [
  ...c.DOA.map((d, i) => ({
    kind: "quran",
    position: i + 1,
    title_ms: d[0],
    title_en: c.DOA_EN[i],
    quran_ref: qref(d[1], d[2], d[3]),
    arabic: null,
    meaning_ms: null,
    meaning_en: null,
    tajweed: [],
  })),
  // DOA_H rows: [title_ms, title_en, arabic|null, [s,a1,a2]|null, meaning_ms, meaning_en]
  ...c.DOA_H.map((d, i) => ({
    kind: "hadith",
    position: i + 1,
    title_ms: d[0],
    title_en: d[1],
    arabic: d[2],
    quran_ref: d[3] ? qref(d[3][0], d[3][1], d[3][2]) : null,
    meaning_ms: d[4],
    meaning_en: d[5],
    tajweed: tajFor(d[2]),
  })),
];

// MATHURAT item: {q:[s,a1,a2]} | {ar} | {arP,arM}; n, nk?, k?; titles/meanings by index in MT_T/MT_M
const mathurat = c.MATHURAT.map((m, i) => ({
  position: i + 1,
  quran_ref: m.q ? qref(m.q[0], m.q[1], m.q[2]) : null,
  arabic: m.ar ?? null,
  arabic_pagi: m.arP ?? null,
  arabic_petang: m.arM ?? null,
  repeat_n: m.n ?? 1,
  repeat_full: m.nk ?? null,
  core: !!m.k, // k:true = Kubra-only
  title_ms: c.MT_T.ms[i],
  title_en: c.MT_T.en[i],
  meaning_ms: c.MT_M.ms[i],
  meaning_en: c.MT_M.en[i],
  tajweed: tajFor(m.ar),
  tajweed_pagi: tajFor(m.arP),
  tajweed_petang: tajFor(m.arM),
}));
assert(mathurat.length === 28, "mathurat count");

// IBD row: [flag, title_ms, title_en, arabic|null, desc_ms, desc_en]
const ibdRow = (r) => ({
  flag: r[0],
  title_ms: r[1],
  title_en: r[2],
  arabic: r[3],
  tajweed: tajFor(r[3]),
  desc_ms: r[4],
  desc_en: r[5],
});
const ibadah = {
  sections: Object.fromEntries(Object.entries(c.IBD).map(([k, rows]) => [k, rows.map(ibdRow)])),
  batal: c.IBD_BATAL,
  rakaat: c.IBD_RAKAAT,
  ihram_ban: c.IHRAM_BAN,
  tawaf_ar: c.TAWAF_AR.map((ar) => ({ arabic: ar, tajweed: tajFor(ar) })),
  tawaf_doa: c.TAWAF_DOA.map((r) => ({ quran_ref: qref(r[0][0], r[0][1], r[0][2]), title_ms: r[1], title_en: r[2] })),
  rukun_haji: c.RUKUN_HAJI,
};

const mengaji = {
  hija: c.HIJA, // [[letter, name] x29]
  harakat: c.HARAKAT, // [[mark, name, desc_ms, desc_en] x8]
  hrk3: c.HRK3, // [[mark, vowel] x3]
  mg_sound: c.MG_SOUND, // [29 latin sounds]
};

const yasin = {
  closing: c.YASIN_AR.map((ar) => ({ arabic: ar, tajweed: tajFor(ar) })),
};

assert(tdUsed.size === Object.keys(TAJ_DUA).length, `TAJ_DUA keys consumed ${tdUsed.size}/50`);

// ---------- frontend data ----------
const rebrand = (x) => JSON.parse(JSON.stringify(x).replaceAll("Nur Al-Quran", "Cakna").replaceAll("NUR AL-QURAN", "CAKNA"));
const i18n = rebrand({ ms: c.I18N.ms, en: c.I18N.en, onb: c.ONB, onb_icons: c.ONB_ICONS });
const enums = {
  qaris: [
    { id: "ar.alafasy", name: "Mishary Alafasy" },
    { id: "ar.abdulbasitmurattal", name: "Abdul Basit" },
    { id: "ar.husary", name: "Al-Husary" },
  ],
  rule_names: c.RULE_NAMES,
  tj_chips: c.TJ_CHIPS,
  tj_desc: c.TJ_DESC,
  pz_types: c.PZ_TYPES,
  pz_reasons: c.PZ_REASONS,
  data_keys: c.DATA_KEYS,
};
const quranMeta = {
  page_first_global: PAGE_STARTS.map((v) => v + 1),
  juz_first_global: JUZ_STARTS.map((v) => v + 1),
  surah_ayah_counts: surahs.map((s) => s.ayah_count),
  surahs: surahs.map((s) => ({
    number: s.number,
    name_ar: s.name_ar,
    name_translit: s.name_translit,
    name_ms: s.name_ms,
    name_en: s.name_en,
    ayah_count: s.ayah_count,
    revelation: s.revelation,
    first_global: s.first_global,
  })),
  sajdah: c.SAJDAH,
};

// ---------- write ----------
const artifacts = {
  "surahs.json": surahs,
  "ayahs.json": ayahs,
  "translations.json": translations,
  "transliterations.json": transliterations,
  "asma.json": asma,
  "cities.json": cities,
  "hijri_events.json": hijri_events,
  "dhikr.json": dhikr,
  "duas.json": duas,
  "mathurat.json": mathurat,
  "ibadah.json": ibadah,
  "mengaji.json": mengaji,
  "yasin.json": yasin,
};
const manifest = {
  source_sha256: sha256(readFileSync(srcPath, "utf8")),
  counts: {
    surahs: surahs.length,
    ayahs: ayahs.length,
    pages: 604,
    juz: 30,
    asma: asma.length,
    sajdah: 15,
    cities: cities.length,
    dhikr: dhikr.length,
    duas: duas.length,
    mathurat: mathurat.length,
  },
  artifacts: {},
};
for (const [name, value] of Object.entries(artifacts)) {
  const json = JSON.stringify(value);
  manifest.artifacts[name] = { sha256: sha256(json), bytes: json.length };
  writeFileSync(OUT + name, json);
}
writeFileSync(OUT + "manifest.json", JSON.stringify(manifest, null, 2));
writeFileSync(OUT_FE + "i18n.json", JSON.stringify(i18n));
writeFileSync(OUT_FE + "enums.json", JSON.stringify(enums, null, 2));
writeFileSync(OUT_FE + "quran-meta.json", JSON.stringify(quranMeta));

console.log("OK — extracted", Object.keys(artifacts).length, "artifacts");
console.log(JSON.stringify(manifest.counts));
