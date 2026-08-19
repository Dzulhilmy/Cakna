#!/usr/bin/env bash
#
# Legacy (Node/Express, cakna.org) -> Rust schema migration driver.
#
# Copies users + sync_data out of the legacy database (read-only SELECTs) and
# imports them into an already-migrated Rust database via legacy-to-rust.sql.
# The import is transactional: on any error nothing is committed to the target.
#
# Usage:
#   LEGACY_URL=postgres://user:pass@legacy-host:5432/cakna \
#   TARGET_URL=postgres://cakna:pass@new-host:5432/cakna \
#   ./run-migration.sh
#
# LEGACY_URL may point at the still-running legacy Postgres, or at a throwaway
# database you restored the .sql backup into (see verify-backup-restore.sh).
# Nothing is written to LEGACY_URL.
set -euo pipefail

: "${LEGACY_URL:?set LEGACY_URL — libpq URL of the legacy database (read-only source)}"
: "${TARGET_URL:?set TARGET_URL — libpq URL of the new Rust database (already migrated)}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "→ preflight: reachable + schema present?"
# Probe connectivity first, so an unreachable host / bad credentials is reported
# as such instead of masquerading as "no tables" (an empty psql result).
psql "$TARGET_URL" -Atc "SELECT 1" >/dev/null 2>&1 \
  || { echo "  ✗ cannot reach TARGET_URL — check host and credentials." >&2; exit 1; }
if [ "$(psql "$TARGET_URL" -Atc \
      "SELECT (to_regclass('public.users') IS NOT NULL AND to_regclass('public.user_data') IS NOT NULL)")" != "t" ]; then
  echo "  ✗ TARGET_URL has no users/user_data tables — run the Rust migrations first (seed binary)." >&2
  exit 1
fi

users_csv="$(mktemp)"; sync_csv="$(mktemp)"
trap 'rm -f "$users_csv" "$sync_csv"' EXIT

echo "→ exporting legacy users + sync_data (read-only)…"
psql "$LEGACY_URL" -v ON_ERROR_STOP=1 -c \
  "\copy (SELECT id, email, password_hash, created_at, qcxis_sub, name, login_method, last_login, is_admin FROM public.users ORDER BY id) TO STDOUT WITH (FORMAT csv)" \
  > "$users_csv"
psql "$LEGACY_URL" -v ON_ERROR_STOP=1 -c \
  "\copy (SELECT user_id, key, value, updated_at FROM public.sync_data ORDER BY user_id, key) TO STDOUT WITH (FORMAT csv)" \
  > "$sync_csv"
echo "  users:     $(wc -l < "$users_csv" | tr -d ' ') row(s)"
echo "  sync_data: $(wc -l < "$sync_csv" | tr -d ' ') row(s)"

echo "→ importing into target (transactional)…"
# The staging setup and the import SQL are concatenated and piped to one psql
# session (so the session-scoped temp tables outlive each \copy). Piping via cat
# avoids psql's \i, which cannot handle a space in the script's path.
{
  cat <<SQL
-- Session-scoped (not ON COMMIT DROP): each \copy is its own autocommit
-- statement, and legacy-to-rust.sql reads these inside its own transaction.
CREATE TEMP TABLE _legacy_users (
  id int, email text, password_hash text, created_at timestamptz,
  qcxis_sub text, name text, login_method text, last_login timestamptz, is_admin boolean
);
\copy _legacy_users FROM '$users_csv' WITH (FORMAT csv)

CREATE TEMP TABLE _legacy_sync (
  user_id int, key text, value jsonb, updated_at timestamptz
);
\copy _legacy_sync FROM '$sync_csv' WITH (FORMAT csv)
SQL
  cat "$here/legacy-to-rust.sql"
} | psql "$TARGET_URL" -v ON_ERROR_STOP=1

echo "✓ migration complete"
