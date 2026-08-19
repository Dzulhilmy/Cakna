import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, q } from './db.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(fs.readFileSync(path.join(__dir, 'data', 'mathurat.json'), 'utf8'));

async function main() {
  await q('TRUNCATE mathurat RESTART IDENTITY');
  for (const it of items) {
    await q(
      `INSERT INTO mathurat(sort_order,reps_s,reps_k,jenis,tajuk,bi,ar,bm,rumi,info,basmalah,n)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [it.sort_order, it.reps_s, it.reps_k, it.jenis, it.tajuk, it.bi, it.ar, it.bm, it.rumi, it.info, it.basmalah, it.n]
    );
  }
  const c = await q('SELECT count(*) n FROM mathurat');
  console.log('mathurat rows seeded:', c.rows[0].n);
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
