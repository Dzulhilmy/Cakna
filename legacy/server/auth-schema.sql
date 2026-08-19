-- Auth/SSO/admin columns on users (idempotent) — part of a fresh-deploy schema
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS qcxis_sub     text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name          text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_method  text NOT NULL DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login    timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin      boolean NOT NULL DEFAULT false;
