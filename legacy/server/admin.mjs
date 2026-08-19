/* Admin dashboard API — real data from users + sessions + sync_data['mathurat'].
   GET /api/admin/overview  (admin session required)  -> the full dashboard payload. */
import { q } from './db.mjs';

const SUGHRA_TARGET = 70, SUGHRA_ITEMS = 32, KUBRA_TARGET = 207, KUBRA_ITEMS = 46;
const DAYS_MS = 86400000;
const sum = a => (Array.isArray(a) ? a.reduce((x, y) => x + (+y || 0), 0) : 0);
const pctOf = (done, target) => Math.max(0, Math.min(100, Math.round((done / target) * 100)));
const initials = (name, email) => (name ? name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('') : (email || '?')[0]).toUpperCase();
const isoDay = d => new Date(d).toISOString().slice(0, 10);

function relLabel(iso) {
  if (!iso) return '—';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'baru sahaja';
  if (m < 60) return `${m} min lalu`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24); if (d === 1) return 'Semalam';
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
}

// a day "has a session" if any mode/session flag is true in that rekod entry
const dayActive = e => !!e && ['sughra', 'kubra'].some(k => e[k] && (e[k].pagi || e[k].petang));

function streakFrom(rekod) {
  if (!rekod || typeof rekod !== 'object') return 0;
  let s = 0;
  for (let i = 0; i < 400; i++) {
    const key = isoDay(Date.now() - i * DAYS_MS);
    if (dayActive(rekod[key])) s++;
    else if (i === 0) continue;     // allow "not yet done today" without breaking the streak
    else break;
  }
  return s;
}
function sessionsThisMonth(rekod) {
  if (!rekod) return 0;
  const now = new Date(), ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  let n = 0;
  for (const [day, e] of Object.entries(rekod)) {
    if (!day.startsWith(ym) || !e) continue;
    for (const k of ['sughra', 'kubra']) if (e[k]) { if (e[k].pagi) n++; if (e[k].petang) n++; }
  }
  return n;
}
function todayFlags(rekod, mode) {
  const e = rekod?.[isoDay(Date.now())];
  return { pagi: !!e?.[mode]?.pagi, petang: !!e?.[mode]?.petang };
}
function lastCompletedLabel(rekod) {
  if (!rekod) return '—';
  const days = Object.keys(rekod).filter(d => dayActive(rekod[d])).sort().reverse();
  if (!days.length) return 'Belum bermula';
  const d = days[0];
  if (d === isoDay(Date.now())) return 'Hari ini';
  if (d === isoDay(Date.now() - DAYS_MS)) return 'Semalam';
  return new Date(d).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
}

function userDetail(m) {
  m = m && m.counts ? m : { counts: {}, idx: {}, rekod: {}, version: 'sughra', mode: 'pagi' };
  const sReps = sum(m.counts?.sughra), kReps = sum(m.counts?.kubra);
  const sPct = pctOf(sReps, SUGHRA_TARGET), kPct = pctOf(kReps, KUBRA_TARGET);
  const version = m.version === 'kubra' ? 'kubra' : 'sughra';
  const mode = m.mode === 'petang' ? 'petang' : 'pagi';
  const heatmap = Array.from({ length: 14 }, (_, i) => dayActive(m.rekod?.[isoDay(Date.now() - (13 - i) * DAYS_MS)]));
  return {
    version, mode,
    streak: streakFrom(m.rekod),
    sessions_month: sessionsThisMonth(m.rekod),
    headline_pct: version === 'kubra' ? kPct : sPct,
    last_completed_label: lastCompletedLabel(m.rekod),
    total_ulangan: { done: sReps + kReps, target: SUGHRA_TARGET + KUBRA_TARGET },
    heatmap,
    sughra: { pct: sPct, reps: sReps, target: SUGHRA_TARGET, item: Math.min((m.idx?.sughra ?? 0) + 1, SUGHRA_ITEMS), items: SUGHRA_ITEMS, ...todayFlags(m.rekod, 'sughra') },
    kubra: { pct: kPct, reps: kReps, target: KUBRA_TARGET, item: Math.min((m.idx?.kubra ?? 0) + 1, KUBRA_ITEMS), items: KUBRA_ITEMS, ...todayFlags(m.rekod, 'kubra') },
  };
}

/* Admin identity = the `users.is_admin` flag OR an email in the ADMIN_EMAILS allowlist
   (env, comma-separated; read lazily so a .env loaded after imports is picked up). */
const adminEmails = () => new Set((process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean));
export const isAdmin = u => !!u && (u.is_admin || (u.email && adminEmails().has(String(u.email).toLowerCase())));

export async function getSessionUser(req) {
  const sid = req.cookies?.sid;
  if (!sid) return null;
  const r = await q(`SELECT u.id,u.email,u.name,u.is_admin FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=$1`, [sid]);
  return r.rows[0] || null;
}

// API guard: JSON 401 (no session) / 403 (not admin)
async function requireAdmin(req, res, next) {
  const u = await getSessionUser(req);
  if (!u) return res.status(401).json({ error: 'not authenticated' });
  if (!isAdmin(u)) return res.status(403).json({ error: 'admin only' });
  req.userId = u.id;
  next();
}

// PAGE guard: redirect (not JSON) — unauth → login (with return path), non-admin → user dashboard
export async function requireAdminPage(req, res, next) {
  const u = await getSessionUser(req);
  if (!u) return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl || '/admin'));
  if (!isAdmin(u)) return res.redirect('/mathurat');
  next();
}

export function mountAdmin(app) {
  app.get('/api/admin/overview', requireAdmin, async (req, res) => {
    // real users + their latest mathurat progress (exclude the admin's own utility rows if desired)
    const rows = (await q(`
      SELECT u.id,u.name,u.email,u.login_method,u.last_login,
             (SELECT value FROM sync_data d WHERE d.user_id=u.id AND d.key='mathurat') AS mathurat
      FROM users u
      WHERE u.email NOT LIKE 'test@cakna.my'
      ORDER BY u.last_login DESC NULLS LAST`)).rows;

    const users = rows.map(u => {
      const detail = userDetail(u.mathurat);
      return {
        id: u.id, name: u.name || u.email, email: u.email, initials: initials(u.name, u.email),
        login_method: u.login_method === 'qcxis' ? 'qcxis' : 'email',
        last_active_iso: u.last_login, last_active_label: relLabel(u.last_login),
        streak: detail.streak, sessions_month: detail.sessions_month,
        headline_pct: detail.headline_pct, version: detail.version, mode: detail.mode,
        detail,
      };
    });

    const activeToday = users.filter(u => u.last_active_iso && (Date.now() - new Date(u.last_active_iso)) < DAYS_MS).length;
    const avgCompletion = users.length ? Math.round(users.reduce((a, u) => a + u.detail.sughra.pct, 0) / users.length) : 0;

    // weekly Pagi/Petang aggregate (last 7 days across everyone)
    const weekLabels = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const dayKey = isoDay(Date.now() - (6 - i) * DAYS_MS);
      let pagi = 0, petang = 0;
      for (const u of rows) {
        const e = u.mathurat?.rekod?.[dayKey]; if (!e) continue;
        for (const k of ['sughra', 'kubra']) { if (e[k]?.pagi) pagi++; if (e[k]?.petang) petang++; }
      }
      return { day: weekLabels[new Date(dayKey).getDay()], pagi, petang };
    });
    const sessionsWeek = weekly.reduce((a, w) => a + w.pagi + w.petang, 0);

    const login_split = {
      qcxis: users.filter(u => u.login_method === 'qcxis').length,
      email: users.filter(u => u.login_method === 'email').length,
    };
    const streak_leaders = [...users].sort((a, b) => b.streak - a.streak).slice(0, 5)
      .map(u => ({ name: u.name, initials: u.initials, streak: u.streak, login_method: u.login_method }));

    res.json({
      kpis: { total_users: users.length, active_today: activeToday, avg_completion: avgCompletion, sessions_week: sessionsWeek },
      login_split, weekly, streak_leaders,
      generated_at: new Date().toISOString(),
      users,
    });
  });

  // ── Role management ──────────────────────────────────────────────
  // List every user with role info (the is_admin flag + whether the
  // email is on the ADMIN_EMAILS env allowlist). Admin session required.
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    const allow = adminEmails();
    const rows = (await q(
      `SELECT id,email,name,login_method,is_admin,last_login
       FROM users ORDER BY is_admin DESC, last_login DESC NULLS LAST, id`
    )).rows;
    res.json({
      me: req.userId,
      users: rows.map(u => {
        const allowlisted = !!(u.email && allow.has(String(u.email).toLowerCase()));
        return {
          id: u.id, email: u.email, name: u.name || null,
          login_method: u.login_method === 'qcxis' ? 'qcxis' : 'email',
          last_login: u.last_login,
          is_admin: !!u.is_admin,
          allowlisted,
          effective_admin: !!u.is_admin || allowlisted,
        };
      }),
    });
  });

  // Grant or revoke admin (toggles users.is_admin). Works for both SSO and
  // email/password accounts. You cannot change your OWN role (prevents lockout).
  app.post('/api/admin/set-role', requireAdmin, async (req, res) => {
    const targetId = Number.parseInt(req.body?.user_id, 10);
    const makeAdmin = !!req.body?.make_admin;
    if (!Number.isInteger(targetId)) return res.status(400).json({ error: 'user_id tidak sah' });
    if (targetId === req.userId) return res.status(400).json({ error: 'Anda tidak boleh menukar peranan akaun sendiri' });
    const t = (await q('SELECT id,email FROM users WHERE id=$1', [targetId])).rows[0];
    if (!t) return res.status(404).json({ error: 'Pengguna tidak dijumpai' });
    await q('UPDATE users SET is_admin=$1 WHERE id=$2', [makeAdmin, targetId]);
    const allowlisted = adminEmails().has(String(t.email || '').toLowerCase());
    res.json({
      ok: true, id: targetId, is_admin: makeAdmin,
      effective_admin: makeAdmin || allowlisted,
      note: (!makeAdmin && allowlisted)
        ? 'Akaun ini masih pentadbir melalui senarai ADMIN_EMAILS (tetapan pelayan).'
        : null,
    });
  });
}
