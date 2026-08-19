/* Generate the frontend's bundled DATA from the database, so PostgreSQL is the single source
   of truth. Run after editing content/strings/config in the DB:  node sync-frontend.mjs

   Syncs every data literal the frontend hardcodes:
     - Al-Ma'thurat     mathurat table            -> `var F=[...]`               (route node 10)
     - Surah index      surahs + ayahs            -> `surahs:[...]`             (chunk RVSxgVWS)
     - Page starts      ayahs (MIN global/page)   -> `page_first_global:[...]`  (chunk RVSxgVWS)
     - Sajdah verses    ayahs (sajdah=true)       -> `sajdah:[...]`             (chunk RVSxgVWS)
     - Interface strings i18n table               -> `ms:JSON.parse(`…`)` / `en:…`  (chunk CGhbo2j02)
     - App config       app_config table          -> `var e={...}`             (chunk C3APuZRv)

   Targets are found by CONTENT SIGNATURE (survives hash renames), every generated literal is
   parse-checked before writing, and each build file is backed up once as `*.orig`.
   NOTE: a real rebuild from SvelteKit source regenerates hashed filenames and overwrites these
   patches — the permanent home for this data is that source; this keeps the running app in sync. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, q } from './db.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.resolve(__dir, '../build/_app/immutable');

const esc = s => (s == null ? '' : String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'));
const bt = s => '`' + esc(s) + '`';

function allJs() {
  const out = [];
  for (const dir of ['nodes', 'chunks']) {
    const d = path.join(BUILD, dir);
    for (const f of fs.readdirSync(d)) if (f.endsWith('.js')) out.push(path.join(d, f));
  }
  return out;
}
function findBySignature(sig) {
  const hits = allJs().filter(f => fs.readFileSync(f, 'utf8').includes(sig));
  if (hits.length !== 1) throw new Error(`expected 1 file for ${JSON.stringify(sig)}, found ${hits.length}`);
  return hits[0];
}
const writeOnce = (file, src) => { if (!fs.existsSync(file + '.orig')) fs.writeFileSync(file + '.orig', src); };

// replace the balanced [...] or {...} region that begins at `decl` (which ends in '[' or '{')
function spliceBalanced(src, decl, literal) {
  const at = src.indexOf(decl);
  if (at < 0) throw new Error('declaration not found: ' + decl);
  const open = at + decl.length - 1;
  const openCh = src[open], closeCh = openCh === '[' ? ']' : '}';
  let i = open, depth = 0, str = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (str) { if (c === '\\') { i++; continue; } if (c === str) str = null; continue; }
    if (c === '`' || c === '"' || c === "'") { str = c; continue; }
    if (c === openCh) depth++;
    else if (c === closeCh) { depth--; if (depth === 0) { i++; break; } }
  }
  const after = src.slice(i);
  if (![';', ',', '}', ')'].includes(after[0])) throw new Error('structure check failed after literal: ' + JSON.stringify(after.slice(0, 6)));
  new Function('return ' + literal); // parse-check
  return src.slice(0, open) + literal + after;
}
// replace a `<decl>` + backtick-string, where decl ends in "JSON.parse(`"
function spliceTemplateArg(src, decl, newInner) {
  const at = src.indexOf(decl);
  if (at < 0) throw new Error('declaration not found: ' + decl);
  let i = at + decl.length; // inside the template
  for (; i < src.length; i++) { const c = src[i]; if (c === '\\') { i++; continue; } if (c === '`') break; }
  return src.slice(0, at + decl.length) + newInner + src.slice(i);
}
function patch(file, fn) {
  const src = fs.readFileSync(file, 'utf8');
  writeOnce(file, src);
  fs.writeFileSync(file, fn(src));
}

async function syncMathurat() {
  const rows = (await q('SELECT * FROM mathurat ORDER BY sort_order')).rows;
  // A few items store morning/evening variants as {"pagi":…,"petang":…} JSON, but the
  // app renders each text field as a plain string. Resolve to the pagi (morning) text
  // here so the reader shows clean Arabic/meaning. The DB keeps both variants intact.
  const pagiOf = v => {
    if (typeof v === 'string' && v.charCodeAt(0) === 123) {
      try { const o = JSON.parse(v); if (o && (o.pagi || o.petang)) return o.pagi ?? o.petang; } catch { /* not JSON */ }
    }
    return v;
  };
  const literal = '[' + rows.map(m => {
    const p = [`reps:{s:${m.reps_s == null ? 'null' : m.reps_s},k:${m.reps_k == null ? 'null' : m.reps_k}}`];
    if (m.jenis != null) p.push(`jenis:${bt(m.jenis)}`);
    if (m.tajuk != null) p.push(`tajuk:${bt(m.tajuk)}`);
    if (m.bi != null) p.push(`bi:${bt(pagiOf(m.bi))}`);
    if (m.info != null) p.push(`info:${bt(pagiOf(m.info))}`);
    if (m.rumi != null) p.push(`rumi:${bt(pagiOf(m.rumi))}`);
    if (m.basmalah) p.push('basmalah:!0');
    if (m.ar != null) p.push(`ar:${bt(pagiOf(m.ar))}`);
    if (m.bm != null) p.push(`bm:${bt(pagiOf(m.bm))}`);
    if (m.n != null) p.push(`n:${m.n}`);
    return '{' + p.join(',') + '}';
  }).join(',') + ']';
  patch(findBySignature('var F=[{reps:'), src => spliceBalanced(src, 'var F=[', literal));
  return rows.length;
}

async function syncSurahChunk() {
  const surahs = (await q('SELECT number,name_arabic,name_translit,name_ms,name_en,ayah_count,type FROM surahs ORDER BY number')).rows;
  const fg = Object.fromEntries((await q('SELECT surah, MIN(global)::int fg FROM ayahs GROUP BY surah')).rows.map(r => [r.surah, r.fg]));
  const surahsLit = '[' + surahs.map(s =>
    `{number:${s.number},name_ar:${bt(s.name_arabic)},name_translit:${bt(s.name_translit)},name_ms:${bt(s.name_ms)},name_en:${bt(s.name_en)},ayah_count:${s.ayah_count},revelation:${bt(s.type)},first_global:${fg[s.number]}}`
  ).join(',') + ']';
  const pages = (await q('SELECT page, MIN(global)::int g FROM ayahs GROUP BY page ORDER BY page')).rows;
  const pageLit = '[' + pages.map(p => p.g).join(',') + ']';
  const sajdah = (await q("SELECT surah||':'||ayah k FROM ayahs WHERE sajdah ORDER BY global")).rows;
  const sajdahLit = '[' + sajdah.map(r => bt(r.k)).join(',') + ']';
  patch(findBySignature('surahs:[{number:1,name_ar:'), src => {
    src = spliceBalanced(src, 'surahs:[', surahsLit);
    src = spliceBalanced(src, 'page_first_global:[', pageLit);
    src = spliceBalanced(src, 'sajdah:[', sajdahLit);
    return src;
  });
  return { surahs: surahs.length, pages: pages.length, sajdah: sajdah.length };
}

async function syncI18n() {
  const rows = (await q('SELECT key,ms,en FROM i18n ORDER BY key')).rows;
  const msObj = {}, enObj = {};
  for (const r of rows) { if (r.ms != null) msObj[r.key] = r.ms; if (r.en != null) enObj[r.key] = r.en; }
  const file = findBySignature('ms:JSON.parse(`');
  patch(file, src => {
    src = spliceTemplateArg(src, 'ms:JSON.parse(`', esc(JSON.stringify(msObj)));
    src = spliceTemplateArg(src, 'en:JSON.parse(`', esc(JSON.stringify(enObj)));
    return src;
  });
  return rows.length;
}

async function syncConfig() {
  const rows = (await q('SELECT name,value FROM app_config')).rows;
  const cfg = Object.fromEntries(rows.map(r => [r.name, r.value]));
  // serialize as a JS object literal with backtick strings (matches the original style)
  const jsVal = v => {
    if (v === null) return 'null';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v === 'string') return bt(v);
    if (Array.isArray(v)) return '[' + v.map(jsVal).join(',') + ']';
    return '{' + Object.entries(v).map(([k, x]) => `${k}:${jsVal(x)}`).join(',') + '}';
  };
  const order = ['qaris', 'rule_names', 'tj_chips', 'tj_desc', 'pz_types', 'pz_reasons', 'data_keys'];
  const literal = '{' + order.filter(k => k in cfg).map(k => `${k}:${jsVal(cfg[k])}`).join(',') + '}';
  patch(findBySignature('var e={qaris:['), src => spliceBalanced(src, 'var e={', literal));
  return order.length;
}

async function syncMengajiDrills() {
  const r = await q("SELECT value FROM app_config WHERE name='mengaji_drills'");
  const drills = r.rows[0]?.value || [];
  const literal = '[' + drills.map(d => '[' + bt(d[0]) + ',' + bt(d[1]) + ']').join(',') + ']';
  patch(findBySignature('بَ تَ ثَ · جَ حَ خَ'), src => spliceBalanced(src, ',g=[', literal));
  return drills.length;
}

async function main() {
  console.log('✓ mathurat:', await syncMathurat(), 'items');
  console.log('✓ surah chunk:', JSON.stringify(await syncSurahChunk()));
  console.log('✓ i18n:', await syncI18n(), 'keys');
  console.log('✓ app config:', await syncConfig(), 'groups');
  console.log('✓ mengaji drills:', await syncMengajiDrills(), 'items');
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
