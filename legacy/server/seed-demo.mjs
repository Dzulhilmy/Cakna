/* Seed realistic demo users + Al-Ma'thurat reading progress so the admin dashboard shows
   live data. Progress is stored under sync_data key 'mathurat' in the SAME shape the frontend
   syncs: { v2, version, mode, counts:{sughra:[32],kubra:[46]}, idx:{sughra,kubra}, rekod, tetapan }
   Run: node seed-demo.mjs   (idempotent — re-running refreshes the demo users) */
import { pool, q } from './db.mjs';

// deterministic-ish pseudo-random so re-seeds are stable-ish (no external randomness needed)
let _s = 12345;
const rnd = () => (_s = (_s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));

const SUGHRA_ITEMS = 32, KUBRA_ITEMS = 46;

// build a counts array of `n` items summing toward `pct` of `target`
function counts(n, target, pct) {
  const goal = Math.round(target * pct / 100);
  const arr = new Array(n).fill(0);
  let left = goal, i = 0;
  const per = Math.max(1, Math.round(target / n));
  while (left > 0 && i < n) { const add = Math.min(per, left); arr[i] = add; left -= add; i++; }
  return { arr, idx: Math.min(n - 1, i) };
}
function isoDay(daysAgo) { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d.toISOString().slice(0, 10); }

// a plausible rekod (session history) for the last `streak` days + a few gaps before
function rekod(streak, monthSessions) {
  const r = {};
  for (let i = 0; i < streak; i++) {
    r[isoDay(i)] = { sughra: { pagi: rnd() > 0.15, petang: rnd() > 0.4 }, kubra: { pagi: rnd() > 0.7, petang: rnd() > 0.85 } };
  }
  // scatter a few older sessions so "sesi bulan ini" > streak
  let extra = Math.max(0, monthSessions - streak);
  for (let d = streak + 2; d < 30 && extra > 0; d += ri(1, 3)) { r[isoDay(d)] = { sughra: { pagi: true, petang: rnd() > 0.5 }, kubra: { pagi: false, petang: false } }; extra--; }
  return r;
}

const DEMO = [
  { name: 'Ahmad Faiz Roslan', method: 'qcxis', mins: 2, sPct: 94, kPct: 10, streak: 21, sess: 48, ver: 'sughra', mode: 'pagi' },
  { name: 'Nurul Aina Kamal', method: 'qcxis', mins: 8, sPct: 78, kPct: 24, streak: 12, sess: 41, ver: 'sughra', mode: 'petang' },
  { name: 'Muhammad Haziq Idris', method: 'email', mins: 34, sPct: 100, kPct: 62, streak: 30, sess: 58, ver: 'kubra', mode: 'pagi' },
  { name: 'Siti Aisyah Rahman', method: 'qcxis', mins: 55, sPct: 66, kPct: 0, streak: 7, sess: 19, ver: 'sughra', mode: 'pagi' },
  { name: 'Aiman Hakimi Zulkifli', method: 'qcxis', mins: 180, sPct: 41, kPct: 0, streak: 3, sess: 9, ver: 'sughra', mode: 'petang' },
  { name: 'Farah Nabila Yusof', method: 'email', mins: 320, sPct: 88, kPct: 33, streak: 16, sess: 37, ver: 'kubra', mode: 'petang' },
  { name: 'Danial Arif Hamzah', method: 'qcxis', mins: 1440, sPct: 52, kPct: 5, streak: 0, sess: 14, ver: 'sughra', mode: 'pagi' },
  { name: 'Wan Nur Sofea Adnan', method: 'qcxis', mins: 26, sPct: 72, kPct: 18, streak: 9, sess: 28, ver: 'sughra', mode: 'petang' },
  { name: 'Hafizuddin Kamarul', method: 'email', mins: 2880, sPct: 100, kPct: 90, streak: 45, sess: 72, ver: 'kubra', mode: 'pagi' },
  { name: 'Iman Sofia Ismail', method: 'qcxis', mins: 12, sPct: 60, kPct: 12, streak: 5, sess: 16, ver: 'sughra', mode: 'pagi' },
];

async function main() {
  // clean previous demo users (kept separate from real users via email domain)
  await q("DELETE FROM users WHERE email LIKE '%@demo.cakna.my'");
  for (const d of DEMO) {
    const email = d.name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@demo.cakna.my';
    const lastLogin = new Date(Date.now() - d.mins * 60000).toISOString();
    const u = await q(
      `INSERT INTO users(email,name,login_method,last_login,qcxis_sub)
       VALUES($1,$2,$3,$4,$5) RETURNING id`,
      [email, d.name, d.method, lastLogin, d.method === 'qcxis' ? 'demo_' + email : null]
    );
    const uid = u.rows[0].id;
    const s = counts(SUGHRA_ITEMS, 70, d.sPct), k = counts(KUBRA_ITEMS, 207, d.kPct);
    const mathurat = {
      v2: true, version: d.ver, mode: d.mode,
      counts: { sughra: s.arr, kubra: k.arr },
      idx: { sughra: s.idx, kubra: k.idx },
      rekod: rekod(d.streak, d.sess),
      tetapan: { autoWaktu: true },
    };
    await q(`INSERT INTO sync_data(user_id,key,value,updated_at) VALUES($1,'mathurat',$2,$3)
             ON CONFLICT (user_id,key) DO UPDATE SET value=EXCLUDED.value, updated_at=EXCLUDED.updated_at`,
      [uid, JSON.stringify(mathurat), lastLogin]);
  }
  const c = await q("SELECT count(*) n FROM users WHERE email LIKE '%@demo.cakna.my'");
  console.log('demo users seeded:', c.rows[0].n);
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
