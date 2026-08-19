#!/usr/bin/env bash
#
# End-to-end test of the legacy -> Rust migration against the REAL backup, using
# throwaway databases in the local dev Postgres (docker-compose.yml, :54329).
# Non-destructive: it only touches databases named cakna_mig_*, never the dev db.
#
#   ./test-migration.sh                 # uses the default backup + local dev pg
#   BACKUP=/path/to.sql ./test-migration.sh
#   KEEP=1 ./test-migration.sh          # leave the scratch dbs up for inspection
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(cd "$here/../.." && pwd)"

BACKUP="${BACKUP:-$HOME/cakna-backups/cakna-PROD-cakna.org-2026-07-23.sql}"
PGHOST_URL="${PGHOST_URL:-postgres://cakna:cakna@localhost:54329}"
ADMIN="$PGHOST_URL/postgres"
LEGACY_DB=cakna_mig_legacy
TARGET_DB=cakna_mig_target
LEGACY_URL="$PGHOST_URL/$LEGACY_DB"
TARGET_URL="$PGHOST_URL/$TARGET_DB"

fail() { echo "  ✗ $1" >&2; exit 1; }
ok()   { echo "  ✓ $1"; }
scalar() { psql "$1" -Atc "$2"; }

[ -f "$BACKUP" ] || fail "backup not found: $BACKUP"
psql "$ADMIN" -Atc "SELECT 1" >/dev/null 2>&1 || fail "cannot reach dev Postgres at $ADMIN (docker compose up -d?)"

cleanup() {
  [ "${KEEP:-0}" = "1" ] && { echo "→ KEEP=1: leaving $LEGACY_DB and $TARGET_DB up"; return; }
  psql "$ADMIN" -q -c "DROP DATABASE IF EXISTS $LEGACY_DB WITH (FORCE)" \
                -c "DROP DATABASE IF EXISTS $TARGET_DB WITH (FORCE)" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "→ (re)creating scratch databases…"
psql "$ADMIN" -q \
  -c "DROP DATABASE IF EXISTS $LEGACY_DB WITH (FORCE)" \
  -c "DROP DATABASE IF EXISTS $TARGET_DB WITH (FORCE)" \
  -c "CREATE DATABASE $LEGACY_DB" \
  -c "CREATE DATABASE $TARGET_DB"

echo "→ restoring backup into $LEGACY_DB…"
# pg_dump plain output is noisy (roles/ownership); tolerate that benign noise but
# surface any other error, and assert BOTH tables actually loaded rows — a
# users-only partial restore must not sail through as a green test (every later
# check compares target-to-legacy, so both being empty would look "consistent").
rlog="$(mktemp)"
psql "$LEGACY_URL" -q -f "$BACKUP" >"$rlog" 2>&1 || true
rerr="$(grep -Ei 'ERROR' "$rlog" | grep -vi 'role .* does not exist' || true)"
rm -f "$rlog"
[ -z "$rerr" ] || fail "restore reported errors:"$'\n'"$(echo "$rerr" | head -20)"
lu=$(scalar "$LEGACY_URL" "SELECT count(*) FROM public.users")
ls=$(scalar "$LEGACY_URL" "SELECT count(*) FROM public.sync_data")
[ "$lu" -gt 0 ] || fail "restore produced 0 users — backup did not load"
[ "$ls" -gt 0 ] || fail "restore produced 0 sync_data rows — backup only partially loaded"
ok "legacy restored: $lu users, $ls sync_data rows"

echo "→ applying Rust migrations to $TARGET_DB…"
for m in "$repo"/server/migrations/[0-9]*.sql; do
  psql "$TARGET_URL" -v ON_ERROR_STOP=1 -q -f "$m" || fail "migration failed: $(basename "$m")"
done
ok "schema migrated ($(ls "$repo"/server/migrations/[0-9]*.sql | wc -l | tr -d ' ') migrations)"

echo "→ running the migration…"
LEGACY_URL="$LEGACY_URL" TARGET_URL="$TARGET_URL" "$here/run-migration.sh"

echo "→ validating results…"
tu=$(scalar "$TARGET_URL" "SELECT count(*) FROM users")
td=$(scalar "$TARGET_URL" "SELECT count(*) FROM user_data")
[ "$tu" = "$lu" ] || fail "user count mismatch: legacy=$lu target=$tu"
ok "users migrated: $tu"

# Every allowed sync row landed (this dataset has no out-of-CHECK keys).
allowed=$(scalar "$LEGACY_URL" "SELECT count(*) FROM public.sync_data WHERE key IN ('settings','bookmarks','notes','hls','read','readlog','khatamToasted','tasbih','city','sgdays','onboarded','mathurat','mgquiz','puasa','manasik')")
[ "$td" = "$allowed" ] || fail "user_data count mismatch: expected $allowed got $td"
ok "user_data migrated: $td (of $ls legacy rows)"

# All uuids, no integers leaked.
badids=$(scalar "$TARGET_URL" "SELECT count(*) FROM users WHERE id IS NULL")
[ "$badids" = "0" ] || fail "found users with null uuid"
ok "all users keyed by uuid"

# mathurat payloads intact and v2.
m_total=$(scalar "$TARGET_URL" "SELECT count(*) FROM user_data WHERE key='mathurat'")
m_v2=$(scalar "$TARGET_URL" "SELECT count(*) FROM user_data WHERE key='mathurat' AND (value->>'v2')::boolean IS TRUE")
[ "$m_total" = "$m_v2" ] || fail "mathurat: $m_total present but only $m_v2 are v2"
ok "mathurat payloads intact and v2: $m_v2"

# Per-user integrity: the set of (email, key) pairs a user owns must be identical
# on both sides — this is what proves the int->uuid remap put each user's data
# back on the right account. Compared as a sorted digest of both databases.
allowed_in="('settings','bookmarks','notes','hls','read','readlog','khatamToasted','tasbih','city','sgdays','onboarded','mathurat','mgquiz','puasa','manasik')"
li=$(scalar "$LEGACY_URL" "SELECT md5(string_agg(lower(u.email)||'|'||s.key, ',' ORDER BY lower(u.email), s.key)) FROM public.users u JOIN public.sync_data s ON s.user_id=u.id WHERE s.key IN $allowed_in")
ti=$(scalar "$TARGET_URL" "SELECT md5(string_agg(lower(u.email::text)||'|'||d.key, ',' ORDER BY lower(u.email::text), d.key)) FROM users u JOIN user_data d ON d.user_id=u.id")
[ "$li" = "$ti" ] || fail "per-user (email,key) ownership differs between legacy and target"
ok "per-user key ownership preserved (verified by email)"

echo "→ idempotency: running the migration a second time…"
LEGACY_URL="$LEGACY_URL" TARGET_URL="$TARGET_URL" "$here/run-migration.sh" >/dev/null
tu2=$(scalar "$TARGET_URL" "SELECT count(*) FROM users")
td2=$(scalar "$TARGET_URL" "SELECT count(*) FROM user_data")
[ "$tu2" = "$tu" ] && [ "$td2" = "$td" ] || fail "re-run changed row counts: users $tu->$tu2, user_data $td->$td2"
ok "second run is a no-op ($tu2 users, $td2 user_data)"

echo
echo "✓ ALL CHECKS PASSED"
