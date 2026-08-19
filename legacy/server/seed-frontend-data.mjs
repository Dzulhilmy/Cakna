import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, q } from './db.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const load = f => JSON.parse(fs.readFileSync(path.join(__dir, 'data', f), 'utf8'));

async function main() {
  // i18n
  const i18n = load('i18n.json');
  await q('TRUNCATE i18n');
  for (const r of i18n) await q('INSERT INTO i18n(key,ms,en) VALUES($1,$2,$3)', [r.key, r.ms, r.en]);
  console.log('i18n rows:', i18n.length);

  // app_config: one row per config group + the mengaji drill examples (from node 11)
  const cfg = load('app_config.json');
  cfg.mengaji_drills = load('mengaji_drills.json');
  await q('TRUNCATE app_config');
  for (const [name, value] of Object.entries(cfg)) {
    await q('INSERT INTO app_config(name,value) VALUES($1,$2)', [name, JSON.stringify(value)]);
  }
  console.log('app_config rows:', Object.keys(cfg).join(', '));
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
