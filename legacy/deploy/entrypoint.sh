#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Cakna container entrypoint.
#   1. Wait for PostgreSQL to accept queries.
#   2. GUARDED one-time init: if the DB has no seeded Quran data, apply the SQL
#      schema and run the extract + seed pipeline (runs ONCE, on first boot).
#   3. ALWAYS re-sync the bundled frontend data in build/ from the DB (cheap).
#   4. exec the Node server.
# All Node/psql commands run from /app/server and share $DATABASE_URL.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd /app/server

: "${DATABASE_URL:?DATABASE_URL must be set (see deploy/.env)}"

# ── 1. Wait for PostgreSQL ───────────────────────────────────────────────────
# We poll with an actual `SELECT 1` (stricter than pg_isready — proves the
# server will answer queries, not just that the port is open).
echo "==> Waiting for PostgreSQL to accept connections..."
tries=0
until psql "$DATABASE_URL" -tAc 'SELECT 1' >/dev/null 2>&1; do
  tries=$((tries + 1))
  if [ "$tries" -ge 30 ]; then
    echo "!! PostgreSQL not reachable after ${tries} attempts — giving up." >&2
    exit 1
  fi
  echo "   ...not ready yet (attempt ${tries}/30); sleeping 2s"
  sleep 2
done
echo "==> PostgreSQL is accepting connections."

# ── 2. Guarded one-time init ─────────────────────────────────────────────────
# Init runs only when the DB is "empty": the ayahs table is missing, OR it
# exists but has 0 rows. Otherwise we skip straight to the server.
NEEDS_INIT=0
REG="$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.ayahs')" 2>/dev/null | tr -d '[:space:]' || true)"
if [ -z "$REG" ]; then
  NEEDS_INIT=1
else
  CNT="$(psql "$DATABASE_URL" -tAc "SELECT count(*) FROM ayahs" 2>/dev/null | tr -d '[:space:]' || echo 0)"
  if [ -z "$CNT" ] || [ "$CNT" = "0" ]; then NEEDS_INIT=1; fi
fi

if [ "$NEEDS_INIT" = "1" ]; then
  echo "==> Empty database detected — running one-time schema + seed."

  echo "--> Applying SQL schema (schema, mathurat, frontend-data, auth)"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
    -f schema.sql \
    -f mathurat.sql \
    -f frontend-data.sql \
    -f auth-schema.sql

  echo "--> extract.mjs   (regenerate surahs/ayahs/modules JSON from pwa/index.html)"
  node extract.mjs
  echo "--> seed.mjs             (surahs + ayahs + modules)"
  node seed.mjs
  echo "--> seed-modules.mjs     (module content: asma, dhikr, duas, yasin, ...)"
  node seed-modules.mjs
  echo "--> seed-mathurat.mjs    (Al-Ma'thurat wirid items)"
  node seed-mathurat.mjs
  echo "--> seed-frontend-data.mjs (interface strings + app config)"
  node seed-frontend-data.mjs

  if [ "${SEED_DEMO:-1}" != "0" ]; then
    echo "--> seed-demo.mjs        (demo users for the admin dashboard; SEED_DEMO=${SEED_DEMO:-1})"
    node seed-demo.mjs
  else
    echo "--> Skipping demo users (SEED_DEMO=0)"
  fi

  echo "==> One-time init complete."
else
  echo "==> Existing Quran data found (ayahs=${CNT:-?}) — skipping schema + seed."
fi

# ── 3. Always re-sync bundled frontend data from the DB (non-fatal) ──────────
# Keeps build/ in step with the DB (e.g. after content edits). A failure here
# must NOT stop the site from serving the already-bundled data, so it is soft.
echo "==> Syncing bundled frontend data from the DB (build/)"
if node sync-frontend.mjs; then
  echo "==> Frontend sync OK."
else
  echo "!! sync-frontend.mjs failed — serving the existing bundled data." >&2
fi

# ── 4. Start the server ──────────────────────────────────────────────────────
echo "==> Starting Cakna server on port ${PORT:-3000}"
exec node server.mjs
