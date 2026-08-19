import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { q } from './db.mjs';
import { prayerTimes, fmt, NAME_ZONE, hijriOf } from './solat.mjs';
import { mountSso, ssoConfigured } from './auth-sso.mjs';
import { mountAdmin, requireAdminPage, isAdmin } from './admin.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.resolve(__dir, '../build');
const PUBLIC = path.resolve(__dir, 'public');
const PORT = process.env.PORT || 3000;
// load server/.env if present (QCXIS_CLIENT_ID, etc.)
try { process.loadEnvFile(path.join(__dir, '.env')); } catch { /* no .env — env vars optional */ }

const app = express();
app.set('trust proxy', 1);                       // correct req.protocol/secure behind the Caddy/ALB proxy
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());

/* ---------------- helpers ---------------- */
const normAr = t => (t || '')
  .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
const hasArabic = t => /[؀-ۿ]/.test(t || '');

const mapAyah = r => ({
  global: r.global, surah: r.surah, ayah: r.ayah, page: r.page, juz: r.juz,
  ar: r.ar, arabic: r.ar,
  tr: { ms: r.tr_ms, en: r.tr_en, id: r.tr_id }, translation: r.tr_ms,
  tajweed: r.tajweed, translit: r.translit, sajdah: r.sajdah,
});
const mapSurah = r => ({
  number: r.number, name_arabic: r.name_arabic, name_translit: r.name_translit,
  name_ms: r.name_ms, name_en: r.name_en, name: r.name_translit, meaning: r.name_ms,
  ayah_count: r.ayah_count, type: r.type,
});
const AYAH_COLS = 'global,surah,ayah,page,juz,ar,tr_ms,tr_en,tr_id,translit,tajweed,sajdah';

/* password hashing (scrypt, no native deps) */
const hashPw = pw => { const s = crypto.randomBytes(16).toString('hex'); return s + ':' + crypto.scryptSync(pw, s, 64).toString('hex'); };
const verifyPw = (pw, stored) => {
  const [s, h] = (stored || '').split(':'); if (!s || !h) return false;
  const a = Buffer.from(h, 'hex'), b = crypto.scryptSync(pw, s, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

async function userFromReq(req) {
  const sid = req.cookies?.sid; if (!sid) return null;
  const r = await q('SELECT u.id,u.email,u.name,u.is_admin FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=$1', [sid]);
  return r.rows[0] || null;
}
function setSession(res, token) {
  res.cookie('sid', token, { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === '1', maxAge: 1000 * 60 * 60 * 24 * 365, path: '/' });
}

/* =============================================================
   AUTH
============================================================= */
app.get('/api/auth/me', async (req, res) => {
  const u = await userFromReq(req);
  if (!u) return res.status(401).json({ error: 'not authenticated' });
  res.json({ id: u.id, email: u.email, name: u.name || null, is_admin: isAdmin(u) });
});
app.post('/api/auth/register', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const exists = await q('SELECT 1 FROM users WHERE email=$1', [email]);
  if (exists.rowCount) return res.status(409).json({ error: 'Email already registered' });
  const r = await q('INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING id,email', [email, hashPw(password)]);
  const token = crypto.randomBytes(32).toString('hex');
  await q('INSERT INTO sessions(token,user_id) VALUES($1,$2)', [token, r.rows[0].id]);
  setSession(res, token);
  res.json({ id: r.rows[0].id, email: r.rows[0].email });
});
app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const r = await q('SELECT id,email,password_hash FROM users WHERE email=$1', [email]);
  const u = r.rows[0];
  if (!u || !verifyPw(password, u.password_hash)) return res.status(401).json({ error: 'Wrong email or password' });
  const token = crypto.randomBytes(32).toString('hex');
  await q('INSERT INTO sessions(token,user_id) VALUES($1,$2)', [token, u.id]);
  setSession(res, token);
  res.json({ id: u.id, email: u.email });
});
app.post('/api/auth/logout', async (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) await q('DELETE FROM sessions WHERE token=$1', [sid]);
  res.clearCookie('sid', { path: '/' });
  res.json({ ok: true });
});

/* =============================================================
   QURAN DATA
============================================================= */
app.get('/api/pages/:n', async (req, res) => {
  const n = +req.params.n;
  if (!(n >= 1 && n <= 604)) return res.status(404).json({ error: 'page out of range' });
  const a = await q(`SELECT ${AYAH_COLS} FROM ayahs WHERE page=$1 ORDER BY global`, [n]);
  const nums = [...new Set(a.rows.map(r => r.surah))];
  const s = await q('SELECT * FROM surahs WHERE number = ANY($1) ORDER BY number', [nums]);
  res.json({ page: n, ayahs: a.rows.map(mapAyah), surahs: s.rows.map(mapSurah) });
});

app.get('/api/surahs/:t', async (req, res) => {
  const t = req.params.t;
  if (/^\d+$/.test(t)) {
    const num = +t;
    const s = await q('SELECT * FROM surahs WHERE number=$1', [num]);
    if (!s.rowCount) return res.status(404).json({ error: 'surah not found' });
    const a = await q(`SELECT ${AYAH_COLS} FROM ayahs WHERE surah=$1 ORDER BY ayah`, [num]);
    return res.json({ ...mapSurah(s.rows[0]), ayahs: a.rows.map(mapAyah) });
  }
  // non-numeric (e.g. "all" / "list") -> full surah index
  const s = await q('SELECT * FROM surahs ORDER BY number');
  res.json(s.rows.map(mapSurah));
});

app.get('/api/ayahs/:g/words', async (req, res) => {
  const g = +req.params.g;
  const r = await q('SELECT global,ar,translit,tr_ms,tr_en,tr_id FROM ayahs WHERE global=$1', [g]);
  if (!r.rowCount) return res.status(404).json({ error: 'ayah not found' });
  const row = r.rows[0];
  const words = row.ar.split(/\s+/).filter(Boolean).map((w, i) => ({ i, arabic: w, ar: w }));
  res.json({ global: g, words });
});

app.get('/api/search', async (req, res) => {
  const term = String(req.query.q || '').trim();
  const lang = ['ms', 'en', 'id'].includes(req.query.lang) ? req.query.lang : 'ms';
  const limit = Math.min(+req.query.limit || 60, 100);
  if (term.length < 2) return res.json({ total: 0, hits: [] });
  const arabicSearch = hasArabic(term);
  let where, param;
  if (arabicSearch) { where = 'ar_plain ILIKE $1'; param = '%' + normAr(term) + '%'; }
  else { where = `tr_${lang} ILIKE $1`; param = '%' + term + '%'; }
  const cnt = await q(`SELECT count(*)::int c FROM ayahs WHERE ${where}`, [param]);
  const r = await q(`SELECT ${AYAH_COLS} FROM ayahs WHERE ${where} ORDER BY global LIMIT $2`, [param, limit]);
  // hits need a `.text` snippet: arabic when searching arabic, else the translation in `lang`
  const hits = r.rows.map(row => ({ ...mapAyah(row), text: arabicSearch ? row.ar : row['tr_' + lang] }));
  res.json({ total: cnt.rows[0].c, hits });
});

/* =============================================================
   MODULES
============================================================= */
// Al-Ma'thurat: dedicated table (was hardcoded in the frontend bundle). Returned in the
// same item shape the frontend uses: {reps:{s,k},jenis,tajuk,bi,ar,bm,rumi,info,basmalah,n}
app.get('/api/modules/mathurat', async (req, res) => {
  const r = await q('SELECT * FROM mathurat ORDER BY sort_order');
  res.json(r.rows.map(m => ({
    reps: { s: m.reps_s, k: m.reps_k },
    jenis: m.jenis, tajuk: m.tajuk, bi: m.bi, ar: m.ar, bm: m.bm,
    rumi: m.rumi, info: m.info, basmalah: m.basmalah, n: m.n,
  })));
});

app.get('/api/modules/:key', async (req, res) => {
  const r = await q('SELECT value FROM modules WHERE key=$1', [req.params.key]);
  if (!r.rowCount) return res.status(404).json({ error: 'module not found' });
  res.json(r.rows[0].value);
});

/* =============================================================
   INTERFACE STRINGS & APP CONFIG (were hardcoded in the bundle; now DB-backed)
============================================================= */
app.get('/api/i18n', async (req, res) => {
  const r = await q('SELECT key,ms,en FROM i18n ORDER BY key');
  const ms = {}, en = {};
  for (const row of r.rows) { if (row.ms != null) ms[row.key] = row.ms; if (row.en != null) en[row.key] = row.en; }
  res.json({ ms, en });
});
app.get('/api/config', async (req, res) => {
  const r = await q('SELECT name,value FROM app_config');
  res.json(Object.fromEntries(r.rows.map(row => [row.name, row.value])));
});

/* =============================================================
   SOLAT (official times for a JAKIM zone; client falls back if absent)
============================================================= */
let ZONE_COORDS = null;
async function zoneCoords() {
  if (ZONE_COORDS) return ZONE_COORDS;
  const r = await q("SELECT value FROM modules WHERE key='cities'");
  const cities = r.rows[0]?.value || [];
  const byName = Object.fromEntries(cities.map(c => [c.name, c]));
  ZONE_COORDS = {};
  for (const [name, zone] of Object.entries(NAME_ZONE)) {
    const c = byName[name];
    if (c && !ZONE_COORDS[zone]) ZONE_COORDS[zone] = { lat: c.lat, lng: c.lng, tz: 8 };
  }
  return ZONE_COORDS;
}
app.get('/api/solat/:zone', async (req, res) => {
  const zc = await zoneCoords();
  const c = zc[req.params.zone];
  if (!c) return res.status(404).json({ error: 'unknown zone' });
  const now = new Date();
  const t = prayerTimes(c.lat, c.lng, now, c.tz);
  const times = {}; for (const k of Object.keys(t)) times[k] = fmt(t[k]);
  res.json({ zone: req.params.zone, date: now.toISOString().slice(0, 10), hijri: hijriOf(now), times });
});

/* =============================================================
   SYNC (per-user key/value; auth required)
============================================================= */
app.get('/api/sync', async (req, res) => {
  const u = await userFromReq(req);
  if (!u) return res.status(401).json({ error: 'not authenticated' });
  const r = await q('SELECT key,value FROM sync_data WHERE user_id=$1', [u.id]);
  const keys = {};
  for (const row of r.rows) keys[row.key] = { value: row.value };
  res.json({ keys });
});
app.put('/api/sync', async (req, res) => {
  const u = await userFromReq(req);
  if (!u) return res.status(401).json({ error: 'not authenticated' });
  const items = Array.isArray(req.body) ? req.body : [];
  for (const it of items) {
    if (!it || typeof it.key !== 'string') continue;
    await q(`INSERT INTO sync_data(user_id,key,value,updated_at) VALUES($1,$2,$3,now())
             ON CONFLICT (user_id,key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`,
      [u.id, it.key, JSON.stringify(it.value ?? null)]);
  }
  res.json({ ok: true });
});

/* =============================================================
   SSO (QCXIS OpenID Connect) + login/admin pages
============================================================= */
mountSso(app);                                   // /auth/sso/start, /auth/sso/callback, /api/auth/sso-status
mountAdmin(app);                                 // /api/admin/overview (admin session required)
app.get('/login', (req, res) => res.sendFile(path.join(PUBLIC, 'login.html')));
// the app's old built-in login route → our login page (preserve any ?next=)
app.get('/auth/login', (req, res) => res.redirect('/login' + (req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '')));
app.get('/admin', requireAdminPage, (req, res) => res.sendFile(path.join(PUBLIC, 'admin-dashboard.html')));
// small script injected into the app shell; renders a "Panel Admin" button for admins only
app.get('/admin-switch.js', (req, res) => res.type('application/javascript').sendFile(path.join(PUBLIC, 'admin-switch.js')));
// Al-Ma'thurat reading hint (the "Ulang 3 kali" card) — injected app-wide for all users
app.get('/mathurat-hint.js', (req, res) => res.type('application/javascript').sendFile(path.join(PUBLIC, 'mathurat-hint.js')));

/* =============================================================
   STATIC FRONTEND + SPA FALLBACK
============================================================= */
app.use('/api', (req, res) => res.status(404).json({ error: 'not found' }));
// maxAge 0 + revalidation so hand-edits to the build show up on reload (dev preview)
app.use(express.static(BUILD, { index: false, maxAge: 0, etag: true, lastModified: true }));
// SPA fallback — serve the app shell with the admin-only "Panel Admin" button injected.
let _shell = null;
function appShell() {
  if (_shell) return _shell;
  const html = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
  const tag = '<script src="/mathurat-hint.js" defer></script><script src="/admin-switch.js" defer></script>';
  _shell = html.includes('</body>') ? html.replace('</body>', tag + '</body>') : html + tag;
  return _shell;
}
app.get('*', (req, res) => res.type('html').send(appShell()));

app.use((err, req, res, next) => {
  console.error('ERR', req.method, req.url, err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'server error' });
});

app.listen(PORT, () => console.log(`Cakna server on http://localhost:${PORT}`));
