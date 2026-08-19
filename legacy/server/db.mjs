import pg from 'pg';
// Production: set DATABASE_URL (e.g. postgres://user:pass@host:5432/cakna). Add ?sslmode=require
// or PGSSL=1 for managed DBs (RDS). Local dev: falls back to PG* env / trust auth on db "cakna".
export const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === '1' || /sslmode=require/.test(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined,
    })
  : new pg.Pool({
      database: process.env.PGDATABASE || 'cakna',
      host: process.env.PGHOST || undefined,
      port: process.env.PGPORT || undefined,
      user: process.env.PGUSER || undefined,
      password: process.env.PGPASSWORD || undefined,
    });
export const q = (text, params) => pool.query(text, params);
