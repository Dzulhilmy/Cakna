# Migration register — consolidating onto the README stack

> Companion to [`PROJECT-SUMMARY.md`](PROJECT-SUMMARY.md). Produced 2026-07-23 from a 13-agent
> analysis of both codebases (762 tool calls), with every area report independently fact-checked.

## The finding

[`pwa/README.md`](pwa/README.md) declares a target stack:

```
Web:      Svelte (shadcn-svelte)
Mobile:   Flutter
Backend:  Rust, PgSQL, self-hosted LiveKit focus for Audio
```

**That stack already exists, at `~/qcx-cakna`** — and it is the parent of this directory.

| | `~/qcx-cakna` | `~/Cakna Project` |
|---|---|---|
| Backend | Rust/Axum + SQLx, 18 source files, 6 migrations, 22 routes | Node/Express, re-implements a **degraded subset** of the same API |
| Web | SvelteKit 2 / Svelte 5 runes + shadcn-svelte (24 UI components) | *compiled bundle only, hand-patched* |
| Mobile | Flutter — 57 files, 11,156 lines, Play Store ship-prep | none |
| VCS | git, 34 commits on `main` | **not a repository** |
| Deployed | `cakna.qcxis.com` | never |

`Cakna Project/build/` is a **byte-level copy** of `qcx-cakna/web/build/` — identical SvelteKit
version stamp (`1783656859255`), identical content hashes across all 24 route nodes, identical
`index.html` (md5 `000acc07cbd060ce9af332a0454df7bf`). Six minified files were then hand-patched
here on 2026-07-22, leaving 9 `.orig`/`.orig2`/`.bak` backups.

**So this is a consolidation, not a conversion.** Nothing needs converting *to* the README stack —
the work is folding this directory's genuinely novel additions into the trunk and retiring the rest.

## 🚨 Do this first, regardless of everything else

`~/qcx-cakna` has roughly **three weeks of uncommitted work (2026-07-08 → 2026-07-22) that exists in
exactly one place**:

- **no git remote** (`git remote -v` is empty), **no stashes**
- **34 untracked files**, including `web/src/lib/data/mathurat-master.ts` (78 KB of hand-curated Ma'thurat content), `server/src/mathurat.rs`, and 29 Flutter source files (prayer widget, audio downloads, tafsir service, JAKIM zones, reciters)
- **51 modified, 11 deleted** files

And a tree-wide `chmod` created **1,267 phantom mode-change entries**, so `git status` shows 1,312
lines hiding the 95 real ones. That is a loaded footgun: `git add -A` bakes the mode flips into
history, and any `git stash` / `git checkout .` / `git clean` run to "tidy up" silently takes the
real work with it.

```bash
cd ~/qcx-cakna && git config core.fileMode false
```

Run that **before any other git command** in that repo. Then commit in logical chunks, add a remote,
and push. A disk failure or one careless command destroys the lot.

## Gap list — what exists only here

Effort tags: **S** = hours · **M** = a day · **L** = multiple days.

| Effort | Item | Notes |
|---|---|---|
| **L** | QCXIS OIDC SSO | `server/auth-sso.mjs` (142 lines). No equivalent in the trunk. ⚠️ **Has never executed** — `server/.env` is byte-identical to `.env.example`, so no credential was ever set. Two latent bugs must not be reproduced: the nonce check is conditional, and `upsertUser` inserts `email \|\| null` into a NOT NULL column. Budget for live debugging, not translation. |
| **L** | Admin JSON API | `server/admin.mjs` (207 lines). **Rewrite, do not port** — its streak/heatmap/weekly maths reads `rekod[day].sughra.pagi`, a nesting no frontend has ever written. |
| **M** | Admin dashboard page | `server/public/admin-dashboard.html` (1,174 lines, framework-free). Drops into `web/static/admin.html` near-verbatim; needs 4 edits (Google Fonts, two `Number()` coercions that break on uuid PKs, `/login` → `/auth/login`). |
| **M** | 46-item Al-Ma'thurat dataset | The trunk's `mathurat_items` holds a **different 28-item** sample-extracted set that structurally cannot hold `rumi`/`info`/`jenis`/`basmalah`. See the danger note below. |
| **M** | Runtime-editable i18n + app config | The **values** are already identical in `qcx-cakna/data/frontend/` (0 key diffs, 0 value diffs). What's missing is the *capability* to `UPDATE i18n SET ms=…` without a rebuild — a product decision, not a data migration. |
| **S** | `users` SSO/admin columns | `qcxis_sub`, `name`, `login_method`, `last_login`, `is_admin`; drop `NOT NULL` on `password_hash`. Purely additive migration `0007`. |
| **S** | Admin role model + 403 | `is_admin` OR `ADMIN_EMAILS` allowlist. Needs an `AdminUser` extractor and an `AppError::Forbidden` variant (`src/error.rs` has no 403 arm). |
| **S** | `is_admin` on `/api/auth/me` | Trunk returns `{id,email,created_at}`; the admin pill depends on `is_admin`. |
| **S** | Server-side page routes | `GET /login`, `GET /auth/login` (302 preserving query), `GET /admin` behind a guard. Axum currently has only `.nest("/api")` + SPA fallback — nothing precedes the catch-all. |
| **S** | QCXIS button on the login screen | ~25 lines in the existing `AuthForm.svelte`. **Do not port the 552-line `login.html`** — the trunk's form already has i18n, shadcn components, sync-on-login and toasts. |
| **S** | Doa Rabitah content edit | Item 45: a 235-char Arabic preamble + 260-char Malay counterpart + a `﴿٣×﴾` marker. **Exists only inside the patched minified bundle and its `.orig`** — not in `mathurat-master.ts`. `bi`/`rumi` were never updated to match, and the Arabic opens with a typo. |
| **S** | "Ulang 3 kali" reading hint | `server/public/mathurat-hint.js`. Belongs inline in `mathurat/+page.svelte`. |
| **S** | `mengaji_drills` as data | 5 pairs; currently hardcoded as `const DRILLS` in the trunk. Zero effort if build-time is acceptable. |
| **S** | JSON 404 for `/api/*` | Trunk lets a mistyped API path fall through to `index.html`. One line: `api.fallback(...)`. |
| **S** | Sync body limit | Express `4mb` vs Axum's default `2 MB`, never overridden. A large bookmarks/notes payload that worked here will `413` against the trunk. |
| **S** | `.dockerignore` | 985 bytes here; the trunk has none, and `Dockerfile.api`'s build context is the repo root — a server-side build tars `app/` (2.4 GB) + `server/target` (4.6 GB). |
| **S** | `PROJECT-SUMMARY.md` | The only written architecture doc on this machine. The trunk's READMEs are 44 lines and two stock scaffolds. |

## Recommended sequence

| Phase | Delivers | Why here |
|---|---|---|
| **0 — Preserve** | `core.fileMode false`, commit in 4 chunks, add remote, push, `pg_dump` | Everything else is unsafe until this lands |
| **1 — Prove the trunk** | `.dockerignore`; clean `npm run build` + `cargo build --release` + seed against a scratch DB + prod image build | Establishes the Express server is genuinely redundant — the precondition for deleting it |
| **2 — Content salvage** | Doa Rabitah edit into `mathurat-master.ts` (with an Arabic proofread), the reading hint, the 46-vs-28 decision | Cheap, and the only truly irreplaceable material. Unblocks deleting this directory |
| **3 — Schema foundation** | Migration `0007`, `AppError::Forbidden`, `is_admin` on `/api/auth/me` | Additive DDL, safe against the 4 live rows. Decouples certain work from risky work |
| **4 — Admin surface** | `AdminUser` extractor + 3 handlers, aggregation **rewritten** against the real flat `rekod` shape with UTC+8 day keys | Delivers something this directory never actually had: a dashboard that reads non-zero |
| **5 — QCXIS SSO** | `server/src/auth/sso.rs` — discovery, JWKS caching, **DB-backed** pending state (not an in-process `Map`), PKCE S256, both client-auth modes | Last of the port work: the only code being migrated that has never run |
| **6 — Decommission** | Delete `Cakna Project/server` + `build`; `/api` 404; 4 MB body limit; per-reciter bitrates; rewrite the READMEs | One codebase, one build. The hand-patch loop is gone permanently |
| **7 — Deferred** | Runtime-editable i18n/config; Flutter SSO; LiveKit | Nothing downstream depends on these — listed so they stop being confused with migration work |

## On LiveKit

**It exists in neither codebase** — zero hits for `livekit|webrtc|agora|mediasoup|janus` across all
of `~/qcx-cakna`. It appears on this machine only in `pwa/README.md` and `PROJECT-SUMMARY.md`.

Audio today is **one-way HTTP streaming of pre-recorded recitation** from `cdn.islamic.network`.
LiveKit is an SFU for *live, bidirectional, many-participant* audio — it does nothing for
pre-recorded playback, and routing ayah MP3s through it would be a pure regression (losing CDN
caching and the Flutter app's offline audio downloads). There is no capture path anywhere: the
Android manifest does not request `RECORD_AUDIO` and the iOS `Info.plist` has no
`NSMicrophoneUsageDescription`.

Its only real use here is a feature that does not exist yet: live halaqah/tadarus rooms, talaqqi
correction sessions (the one case that genuinely needs a microphone), or live group Al-Ma'thurat —
which is the natural counterpart to the unused SSE presence hub already sitting in
`server/src/mathurat.rs`.

**Verdict: separate project.** It is greenfield in both trees, shares no data model or endpoint with
anything being consolidated, and is blocked on a product question neither repo answers. It should
not gate this work. One bridge worth preserving: don't delete `server/src/mathurat.rs`.

## Dangers

1. **Single-copy work in `~/qcx-cakna`** — see the urgent section above. By a wide margin the biggest risk.
2. **The chmod noise is a footgun** — set `core.fileMode false` before any git command there.
3. **This project's SQL is destructive against the shared local DB.** There is one local `cakna` database and it runs the *trunk's* schema (17 tables, users=4, sessions=5). `Cakna Project/server/db.mjs` defaults to it. `schema.sql:2` would `DROP` the live users/sessions and CASCADE into `user_data`, `ayah_translations`, `ayah_transliterations`, `ayah_words`. `npm run seed` additionally `TRUNCATE`s. **Never run anything from `Cakna Project/server` without an explicit `DATABASE_URL` elsewhere.**
4. **Two different datasets are both called "mathurat"** — the 46-item hand-curated set here vs the 28-item sample-extracted `mathurat_items` in the trunk (`seed/mod.rs` hard-asserts 28). Three consumers read something named `mathurat`. Conflating them swaps users' wirid content silently and without error. **Decide and document which is canonical before touching either.**
5. **Silent user-data loss already staged in the trunk's uncommitted web work.** `stores.svelte.ts` changes the synced `mathurat` payload incompatibly (v1 → v2) and the code comment says v1 shapes are *"digantikan dengan lalai semasa migrasi"*. Anyone who synced progress under the deployed build loses it on first load. **Write a real v1→v2 upgrade path before deploying.**
6. **`user_data` has a hard 15-key CHECK constraint** (migration 0005). This project's `sync_data` had none. Audit `SELECT DISTINCT key` before migrating any rows — one stray key aborts the whole transaction.
7. **The live deployment has sharp edges.** `docker-compose.prod.yml` bind-mounts `../web/build` rather than baking it in, so a stale or mid-rebuild directory silently serves the wrong frontend; `deploy/.env` holds the DB password and is server-only. `pg_dump` before any deploy; never `docker compose down -v`.
8. **Deleting this directory too early is unrecoverable** — the Doa Rabitah edit, `PROJECT-SUMMARY.md`, the `.dockerignore` and the `.orig2` records exist only here, and there is no git history to fall back on. Salvage in Phase 2, delete in Phase 6.
9. **Rebuilding `web/` orphans everything keyed to the current hashes.** Every `.orig`/`.orig2`/`.bak` becomes a stale patch that must not be reapplied. **Do not run `sync-frontend.mjs` at any point** — it is additionally stale (dated after the bundle it last patched).
