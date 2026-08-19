# Legacy → Rust data migration (production cutover)

Moves the four cakna.org accounts and their synced data from the legacy
Node/Express schema into the new Rust schema. This is the user-data half of
PROJECT-SUMMARY §6.2 — the real blocker to a cutover.

## What changed from the plan

PROJECT-SUMMARY §6.1 called the **Ma'thurat v1→v2** payload change "the one true
blocker". Inspecting the backup showed it is **already resolved in the data**:
all three `mathurat` payloads in `cakna-PROD-cakna.org-2026-07-23.sql` are v2
(the v2 web build wrote them straight into the legacy backend's opaque `jsonb`).
So this migration carries the `mathurat` value **as-is** and only guards against
a v1 straggler (it aborts loudly if it ever sees one).

The genuine work is the **schema difference**:

| | Legacy (Node) | New (Rust) | Handled by |
|---|---|---|---|
| `users.id` | `integer` | `uuid` | remap, keyed by email |
| user data | `sync_data(user_id int, …)` | `user_data(user_id uuid, key CHECK)` | `legacy-to-rust.sql` |
| passwords | Node **scrypt** (`salt:hash`) | **Argon2id** | verified + rehashed on first login (`auth::password`) |
| sessions | plaintext `token` | `token_hash` + expiry | **not migrated** — users re-login |
| content (`ayahs`, `mathurat`…) | in DB | `seed` binary | **not migrated** |

For this dataset (4 users: 1 email/password, 3 QCXIS SSO; 59 sync rows, all keys
within the new CHECK) nothing is dropped.

## Files

| File | Purpose |
|---|---|
| `legacy-to-rust.sql` | the import: int→uuid users, `sync_data`→`user_data`, guardrails. Idempotent. |
| `run-migration.sh` | driver — copies from the legacy DB (read-only) and runs the import transactionally against the target. |
| `audit-production.sql` | **read-only** audit; run against the LIVE legacy DB before cutover. |
| `verify-backup-restore.sh` | restores the `.sql` backup into a throwaway DB and audits it (non-destructive). |
| `test-migration.sh` | full end-to-end test against the real backup in the local dev Postgres. |

## Before the cutover

1. **Audit the live database** (the backup is only a snapshot; live data may have
   drifted — a v1 `mathurat` straggler or an out-of-CHECK key would matter):
   ```bash
   psql "postgres://USER:PASS@LEGACY_HOST:5432/cakna" -f deploy/migrate/audit-production.sql
   ```
   Every "must be 0 / must be empty" section must hold.

2. **Confirm the backup restores** (also runs the audit):
   ```bash
   ./deploy/migrate/verify-backup-restore.sh
   ```

3. **Rehearse the whole migration** against the real backup:
   ```bash
   ./deploy/migrate/test-migration.sh
   ```
   Requires the local dev Postgres (`docker compose up -d`). Uses only
   `cakna_mig_*` scratch DBs; drops them after.

## Running the migration (production)

The target Rust DB must already be migrated (`docker compose … exec api seed`
runs the schema migrations). Then, with the legacy Postgres reachable
read-only — either still running, or a throwaway restore of the backup:

```bash
LEGACY_URL="postgres://USER:PASS@LEGACY_HOST:5432/cakna" \
TARGET_URL="postgres://cakna:PASS@NEW_HOST:5432/cakna" \
./deploy/migrate/run-migration.sh
```

The import is one transaction: on any guardrail failure nothing is committed.
It is idempotent — safe to re-run.

## After the cutover

- **The one email/password user** logs in with their existing password; the login
  transparently rehashes scrypt → Argon2id (proven by the `legacy_scrypt_login_rehashes`
  integration test and the `auth::password` fixture test).
- **The three QCXIS SSO users** authenticate via SSO on `qcxis_sub`. They can only
  log in once **QCXIS SSO is configured** in `deploy/.env` (`QCXIS_CLIENT_ID` etc.);
  until then those accounts exist but cannot sign in.
- **Sessions were not migrated** — everyone signs in again once.
