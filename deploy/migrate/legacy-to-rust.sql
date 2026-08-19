-- Legacy (Node/Express, cakna.org) -> Rust schema import.
--
-- Runs against the TARGET (new Rust) database, which must already be migrated to
-- the current schema. Two staging tables must exist in the same session, loaded
-- by run-migration.sh straight from the legacy database:
--
--   _legacy_users(id int, email text, password_hash text, created_at timestamptz,
--                 qcxis_sub text, name text, login_method text,
--                 last_login timestamptz, is_admin boolean)
--   _legacy_sync(user_id int, key text, value jsonb, updated_at timestamptz)
--
-- What it does
--   * users:      integer id  ->  uuid (gen_random_uuid), all other columns 1:1.
--   * user_data:  legacy sync_data, owner remapped via email, value carried as-is
--                 (the mathurat payload is already v2 in this dataset).
--   * passwords:  the legacy scrypt hash is carried over verbatim; auth::password
--                 verifies it and rehashes to Argon2id on the user's first login.
--
-- Idempotent: re-running maps each account to the same row by email and upserts
-- user_data by (user_id, key); a password already upgraded to Argon2id is kept.
--
-- Fails loudly (whole transaction rolls back) rather than guessing when it meets
-- data it was not designed for: a non-v2 mathurat payload, a login_method outside
-- the CHECK, or duplicate emails.

\set ON_ERROR_STOP on

BEGIN;

-- ---- guardrails -------------------------------------------------------------

-- Duplicate emails would make the email-keyed id map ambiguous.
DO $$
DECLARE dups int;
BEGIN
  SELECT count(*) INTO dups FROM (
    SELECT lower(email) e FROM _legacy_users GROUP BY 1 HAVING count(*) > 1
  ) d;
  IF dups > 0 THEN
    RAISE EXCEPTION 'aborting: % duplicate email(s) in legacy users (case-insensitive)', dups;
  END IF;
END $$;

-- login_method must satisfy the new users_login_method_check ('email','qcxis').
DO $$
DECLARE bad int;
BEGIN
  SELECT count(*) INTO bad FROM _legacy_users
   WHERE login_method IS NOT NULL AND login_method NOT IN ('email', 'qcxis');
  IF bad > 0 THEN
    RAISE EXCEPTION 'aborting: % legacy user(s) have login_method outside (email,qcxis)', bad;
  END IF;
END $$;

-- The 15 keys the new user_data.key CHECK permits.
CREATE TEMP TABLE _allowed_keys(key text PRIMARY KEY) ON COMMIT DROP;
INSERT INTO _allowed_keys VALUES
  ('settings'), ('bookmarks'), ('notes'), ('hls'), ('read'), ('readlog'),
  ('khatamToasted'), ('tasbih'), ('city'), ('sgdays'), ('onboarded'),
  ('mathurat'), ('mgquiz'), ('puasa'), ('manasik');

-- Warn about (and later skip) any sync key the new schema does not accept, so a
-- surprise key is visible in the log instead of aborting the whole migration.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT s.key, count(*) n
    FROM _legacy_sync s
    LEFT JOIN _allowed_keys a ON a.key = s.key
    WHERE a.key IS NULL
    GROUP BY s.key
  LOOP
    RAISE WARNING 'skipping % row(s) with user_data key not in CHECK constraint: %', r.n, r.key;
  END LOOP;
END $$;

-- mathurat payloads must already be v2. A v1 payload {d, v, s_pagi, ...} would
-- need a shape upgrade this import deliberately does not attempt.
DO $$
DECLARE bad int;
BEGIN
  SELECT count(*) INTO bad FROM _legacy_sync
   WHERE key = 'mathurat'
     AND COALESCE((value ->> 'v2')::boolean, false) IS NOT TRUE;
  IF bad > 0 THEN
    RAISE EXCEPTION
      'aborting: % mathurat payload(s) are not v2; a v1->v2 upgrade is required first', bad;
  END IF;
END $$;

-- ---- users: integer id -> uuid ---------------------------------------------

INSERT INTO users
  (email, password_hash, created_at, qcxis_sub, name, login_method, last_login, is_admin)
SELECT
  lower(email)::citext,
  password_hash,
  created_at,
  qcxis_sub,
  name,
  COALESCE(login_method, 'email'),
  last_login,
  COALESCE(is_admin, false)
FROM _legacy_users
ON CONFLICT (email) DO UPDATE SET
  -- Idempotent re-run: refresh SSO/profile fields, never downgrade a password
  -- that was already rehashed to Argon2id, never clobber a value with NULL.
  qcxis_sub     = COALESCE(EXCLUDED.qcxis_sub, users.qcxis_sub),
  name          = COALESCE(EXCLUDED.name, users.name),
  login_method  = EXCLUDED.login_method,
  last_login    = GREATEST(users.last_login, EXCLUDED.last_login),
  is_admin      = users.is_admin OR EXCLUDED.is_admin,
  password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash);

-- Map legacy integer id -> new uuid, by email (stable across re-runs).
CREATE TEMP TABLE _idmap ON COMMIT DROP AS
SELECT lu.id AS legacy_id, u.id AS new_id
FROM _legacy_users lu
JOIN users u ON u.email = lower(lu.email)::citext;

-- ---- user_data: remap owner, carry value as-is -----------------------------

INSERT INTO user_data (user_id, key, value, updated_at)
SELECT m.new_id, s.key, s.value, s.updated_at
FROM _legacy_sync s
JOIN _idmap m ON m.legacy_id = s.user_id
JOIN _allowed_keys a ON a.key = s.key
ON CONFLICT (user_id, key) DO UPDATE SET
  value      = EXCLUDED.value,
  updated_at = EXCLUDED.updated_at;

-- ---- summary ----------------------------------------------------------------

DO $$
DECLARE nu int; nd int;
BEGIN
  SELECT count(*) INTO nu FROM _idmap;
  SELECT count(*) INTO nd
    FROM _legacy_sync s JOIN _allowed_keys a ON a.key = s.key;
  RAISE NOTICE 'imported/updated % user(s), % user_data row(s)', nu, nd;
END $$;

COMMIT;
