-- Read-only audit of the legacy (Node/Express, cakna.org) database.
-- SELECT-only: safe to run against live production.
--
--   psql "postgres://user:pass@legacy-host:5432/cakna" -f audit-production.sql
--
-- Confirms the assumptions run-migration.sh / legacy-to-rust.sql rely on, and is
-- the check to run against the LIVE database before a cutover (the .sql backup is
-- only a point-in-time snapshot; live data may have drifted).

\echo '== users: count and how they sign in =='
SELECT login_method, count(*) AS users
FROM public.users
GROUP BY ROLLUP (login_method)
ORDER BY login_method NULLS LAST;

\echo ''
\echo '== login_method values OUTSIDE the new CHECK (email, qcxis) — must be 0 =='
SELECT coalesce(login_method, '(null)') AS login_method, count(*)
FROM public.users
WHERE login_method IS DISTINCT FROM 'email' AND login_method IS DISTINCT FROM 'qcxis'
GROUP BY login_method;

\echo ''
\echo '== duplicate emails, case-insensitive (must be 0 — they key the id remap) =='
SELECT lower(email) AS email, count(*)
FROM public.users
GROUP BY lower(email)
HAVING count(*) > 1;

\echo ''
\echo '== password hash format (counts only, no hashes revealed) =='
SELECT
  CASE
    WHEN password_hash IS NULL                    THEN 'none (SSO-only)'
    WHEN password_hash LIKE '$argon2%'            THEN 'argon2 (already upgraded)'
    WHEN password_hash ~ '^[0-9a-f]+:[0-9a-f]+$'  THEN 'legacy scrypt (rehashed on first login)'
    ELSE 'UNRECOGNISED — investigate'
  END AS hash_format,
  count(*)
FROM public.users
GROUP BY 1
ORDER BY 2 DESC;

\echo ''
\echo '== sync_data keys: counts, and whether each is accepted by the new CHECK =='
SELECT
  s.key,
  count(*) AS rows,
  (s.key IN ('settings','bookmarks','notes','hls','read','readlog','khatamToasted',
             'tasbih','city','sgdays','onboarded','mathurat','mgquiz','puasa','manasik'))
    AS accepted_by_new_schema
FROM public.sync_data s
GROUP BY s.key
ORDER BY accepted_by_new_schema, s.key;

\echo ''
\echo '== sync_data keys that the new schema would REJECT (must be empty) =='
SELECT DISTINCT s.key
FROM public.sync_data s
WHERE s.key NOT IN ('settings','bookmarks','notes','hls','read','readlog','khatamToasted',
                    'tasbih','city','sgdays','onboarded','mathurat','mgquiz','puasa','manasik');

\echo ''
\echo '== mathurat payloads: v2 vs v1 (v1 count must be 0 or the import aborts) =='
SELECT
  CASE WHEN (value ->> 'v2')::boolean IS TRUE THEN 'v2 (ok)'
       WHEN value ? 'd' OR value ? 's_pagi'   THEN 'v1 (needs upgrade)'
       ELSE 'unknown shape' END AS shape,
  count(*)
FROM public.sync_data
WHERE key = 'mathurat'
GROUP BY 1;

\echo ''
\echo '== orphan sync_data (user_id with no matching user — would be dropped) =='
SELECT count(*) AS orphan_rows
FROM public.sync_data s
LEFT JOIN public.users u ON u.id = s.user_id
WHERE u.id IS NULL;

\echo ''
\echo '== totals =='
SELECT
  (SELECT count(*) FROM public.users)      AS users,
  (SELECT count(*) FROM public.sync_data)  AS sync_rows,
  (SELECT count(*) FROM public.sessions)   AS sessions_not_migrated;
