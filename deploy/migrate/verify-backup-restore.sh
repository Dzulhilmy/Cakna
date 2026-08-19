#!/usr/bin/env bash
#
# Verify the production .sql backup actually restores, and audit its contents.
# Non-destructive: restores into a throwaway database (cakna_verify_restore) in
# the local dev Postgres, runs the read-only audit, then drops it. Never touches
# the real production database or the local dev database.
#
#   ./verify-backup-restore.sh
#   BACKUP=/path/to.sql ./verify-backup-restore.sh
#   KEEP=1 ./verify-backup-restore.sh     # leave the restored db up for poking
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP="${BACKUP:-$HOME/cakna-backups/cakna-PROD-cakna.org-2026-07-23.sql}"
PGHOST_URL="${PGHOST_URL:-postgres://cakna:cakna@localhost:54329}"
ADMIN="$PGHOST_URL/postgres"
DB=cakna_verify_restore
URL="$PGHOST_URL/$DB"

fail() { echo "  ✗ $1" >&2; exit 1; }
ok()   { echo "  ✓ $1"; }

[ -f "$BACKUP" ] || fail "backup not found: $BACKUP"
psql "$ADMIN" -Atc "SELECT 1" >/dev/null 2>&1 || fail "cannot reach dev Postgres at $ADMIN (docker compose up -d?)"
echo "→ backup: $BACKUP ($(du -h "$BACKUP" | cut -f1))"

cleanup() {
  [ "${KEEP:-0}" = "1" ] && { echo "→ KEEP=1: leaving $DB up ($URL)"; return; }
  psql "$ADMIN" -q -c "DROP DATABASE IF EXISTS $DB WITH (FORCE)" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "→ restoring into throwaway db $DB…"
psql "$ADMIN" -q -c "DROP DATABASE IF EXISTS $DB WITH (FORCE)" -c "CREATE DATABASE $DB"

# Capture restore output. Benign role/ownership noise is expected from a plain
# pg_dump; surface anything else so real errors are visible. The row-count checks
# below are the actual pass/fail signal.
log="$(mktemp)"
psql "$URL" -f "$BACKUP" >"$log" 2>&1 || true
real_errors="$(grep -Ei 'ERROR' "$log" | grep -vi 'role .* does not exist' || true)"
rm -f "$log"
if [ -n "$real_errors" ]; then
  echo "  ✗ restore reported non-ownership errors:"
  echo "$real_errors" | head -20
  fail "backup did not restore cleanly (see errors above)"
fi

for t in users sync_data sessions; do
  psql "$URL" -Atc "SELECT to_regclass('public.$t') IS NOT NULL" | grep -qx t \
    || fail "table public.$t missing after restore"
done
u=$(psql "$URL" -Atc "SELECT count(*) FROM public.users")
s=$(psql "$URL" -Atc "SELECT count(*) FROM public.sync_data")
[ "$u" -gt 0 ] || fail "0 users after restore — backup did not load data"
[ "$s" -gt 0 ] || fail "0 sync_data rows after restore — backup only partially loaded"
ok "restore OK: $u users, $s sync_data rows"

echo
echo "→ auditing restored data…"
psql "$URL" -f "$here/audit-production.sql"

echo
echo "✓ backup restores cleanly and was audited"
