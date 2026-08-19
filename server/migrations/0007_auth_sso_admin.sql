-- SSO + admin columns on users.
--
-- Additive only: every statement is guarded, and every new column is either
-- nullable or has a default, so this is safe against a populated `users` table.
--
-- Context: the Node/Express deployment at cakna.org carries these columns and
-- has live QCXIS SSO accounts. This brings the Rust schema to parity so that
-- deployment's users can be migrated without loss, and so the admin dashboard
-- (Phase 4) and the QCXIS OIDC flow (Phase 5) have somewhere to write.

-- SSO users authenticate against QCXIS and have no local password.
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Subject claim from the QCXIS id_token. UNIQUE so one QCXIS identity maps to
-- exactly one local account; NULL for password-only users.
ALTER TABLE users ADD COLUMN IF NOT EXISTS qcxis_sub text UNIQUE;

-- Display name, from the OIDC `name` claim where available.
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;

-- How the account signs in. Constrained rather than free text so a typo cannot
-- silently create a third class of user that no code handles.
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_method text NOT NULL DEFAULT 'email';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_login_method_check'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_login_method_check
      CHECK (login_method IN ('email', 'qcxis'));
  END IF;
END $$;

-- Written on every successful sign-in, by BOTH the password and SSO paths.
-- (The Node implementation only ever set this from the SSO path, so every
-- password account showed as never-active in its admin dashboard.)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login timestamptz;

-- Admin flag. The effective check is this OR membership of the ADMIN_EMAILS
-- allowlist, so a fresh deployment can bootstrap its first admin via env.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Supports the admin dashboard's "most recently active first" listing.
CREATE INDEX IF NOT EXISTS users_last_login_idx ON users (last_login DESC NULLS LAST);
