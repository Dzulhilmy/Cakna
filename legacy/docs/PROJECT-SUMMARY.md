# Cakna — Project Summary

> Orientation document for the whole repository. The detailed docs live in
> [`server/README.md`](server/README.md) (API + DB), [`deploy/DEPLOY-EC2.md`](deploy/DEPLOY-EC2.md)
> (production runbook) and [`pwa/README-TWA.md`](pwa/README-TWA.md) (Android/TWA). This file explains
> what those pieces are, how they fit together, and what state each one is actually in.
>
> Last surveyed: 2026-07-23. This directory is **not** a git repository — there is no history to
> consult, so treat this file as the record.

---

## 1. What Cakna is

**Cakna** (Malay: *to be mindful, to care*) is a Malay-first Islamic companion app for Malaysian
Muslims. At its core is a 604-page digital **Mushaf Madani** with coloured tajweed, three
translations (Malay / English / Indonesian), romanised transliteration and qari audio. Around that
sit ~20 modules:

| | |
|---|---|
| **Quran** | mushaf reader, search, surah/juz index, bookmarks, notes, khatam target tracker |
| **Worship** | prayer times (JAKIM zones), qibla compass, Al-Ma'thurat wirid, Surah Yasin, selected du'as |
| **Dhikr** | tasbih counter, daily dhikr, Asmaul Husna (99 names) |
| **Learning** | "Asas Mengaji" hijaiyah quiz, Shafi'i ibadah guide (wuduk / solat / tayammum / umrah / haji) |
| **Utilities** | qada-puasa (fasting-debt) log, zakat calculator, settings, export/import |

Everything is Malay-first (`<html lang="ms">`; English is a fallback layer, `t[uiLang][k] ?? t.ms[k] ?? k`).
Prayer zones are JAKIM codes, fiqh is explicitly Shafi'i/Malaysian, and Hijri dates use Umm al-Qura
with an in-app note that they may differ by a day from Malaysia's official rukyah.

### The narrower identity worth knowing

Read the code and a second, more specific purpose emerges: **this deployment is operated as an
organisational Al-Ma'thurat wirid tracker with leadership oversight**, layered on top of the general
mushaf app. The evidence is consistent:

- The post-login landing page is `/mathurat`, not the mushaf — [`server/auth-sso.mjs:33,133`](server/auth-sso.mjs:33), [`server/public/login.html:528`](server/public/login.html:528)
- Non-admins bounced from `/admin` are redirected to `/mathurat` — [`server/admin.mjs:106`](server/admin.mjs:106)
- The entire admin dashboard measures *only* Ma'thurat completion, streaks and 14-day consistency, per named user
- [`server/public/mathurat-hint.js`](server/public/mathurat-hint.js) exists solely to annotate one wirid phrase, and is injected app-wide
- Route node `10.-xY5Wh5P.js` (the Ma'thurat page, 99 KB) is both the largest route in the bundle and the only one rewritten by hand after the build

The wirid is Hasan al-Banna's Al-Ma'thurat (attributed in `server/data/mathurat.json`, item 45,
"Doa Rabitah") — in Malaysia, the daily litany of tarbiyah/usrah circles. The audience is a member
of an organised study circle whose coordinator monitors daily completion.

### Lineage — why there are stray artifacts

The same product has carried three names, which explains the loose files at the repo root:

1. **Nur Al-Quran** — the legacy single-file PWA, branded for QC Group Sdn. Bhd., Android package `my.qcgroup.nuralquran`
2. **Mathurat** — the original working directory, still fossilised at [`deploy/DEPLOY-EC2.md:102`](deploy/DEPLOY-EC2.md:102) as `/Users/akmalfarhan/Desktop/Mathurat`
3. **Cakna** — the current name

---

## 2. Repository map

| Path | Size | What it is |
|---|---|---|
| `server/` | ~200 KB | Express + PostgreSQL backend. **The only hand-written application code in this repo.** |
| `build/` | 2.3 MB | Compiled SvelteKit SPA. ⚠️ No source *in this repo* — but see the note below: the source exists at `~/qcx-cakna/web`. |
| `pwa/` | 5.8 MB | The legacy single-file app. ⚠️ **Still a live build dependency** — not archaeology. |
| `deploy/` | ~25 KB | Dockerfile, docker-compose, Caddyfile, entrypoint, EC2 runbook. |
| `nur-al-quran-mushaf.html` | 6.0 MB | Byte-identical copy of `pwa/index.html` (same MD5). |
| `nur-al-quran-pwa.zip` | 1.7 MB | A third copy of the same legacy app, plus its original README. |
| `server.md` | 36 B | Two lines holding production EC2 access details. See §8. |

Note the ~7.7 MB of triplicated legacy content. Only `pwa/index.html` is actually read (by
`extract.mjs`); with no version control, the three copies can silently diverge.

### ⚠️ This directory is an offshoot of a larger project

**`~/qcx-cakna` is the parent project**, and it is further along. It is a git repository (34
commits) implementing the stack declared in [`pwa/README.md`](pwa/README.md):

| | `~/qcx-cakna` | this directory |
|---|---|---|
| Backend | **Rust** (Axum + SQLx) — `server/` | Node/Express — `server/` |
| Web | **SvelteKit source** (Svelte 5 + shadcn-svelte + Tailwind 4) — `web/src` | *compiled bundle only* |
| Mobile | **Flutter** app — `app/` (Play Store ship-prep done) | none |
| Deployed | `cakna.qcxis.com` | never deployed from here |

**`build/` in this directory is a byte-for-byte copy of `~/qcx-cakna/web/build`** — identical content
hashes across all 24 route nodes and an identical `version.json` stamp (`1783656859255`) — which was
then hand-patched here. So the "missing" SvelteKit source is not missing; it lives at
`~/qcx-cakna/web/src`, and its route tree matches this bundle exactly.

What exists **only here**, and nowhere in the parent project: the **QCXIS SSO** flow, the **admin
Ma'thurat dashboard**, and the Node/Express reimplementation of the API. Those are the genuinely
novel work in this directory.

---

## 3. Architecture

One Express process serves **both** the API and the compiled SPA on a single origin — this is
deliberate, because the frontend's fetch wrapper uses `credentials: 'same-origin'`.

```
Internet ──► Caddy (80/443, auto-TLS)  ──►  app (Node/Express, :3000)  ──►  postgres (:5432)
             caddy service                  app service                     postgres service
```

Only ports 80 and 443 are public. The app and database talk over a private Docker network and are
never published to the host.

**Stack:** Node 20 · Express 4 · PostgreSQL 16 · Caddy 2. Dependencies are just four, all pure-JS:
`express`, `cookie-parser`, `pg`, `jose`.

---

## 4. The data flow — the unusual part

This is the thing to understand before changing anything. Content moves through five stages, and
the last one runs **backwards**.

```
  pwa/index.html ──extract──► server/data/*.json ──seed──► PostgreSQL ──API──► browser
   (6 MB legacy)                                                │
                                                                │  sync-frontend.mjs
                                                                ▼
                                        build/_app/immutable/**.js  ◄── rewritten in place
                                                                │
                                                                ▼
                                            …and then patched again by hand
```

**1 — Origin.** [`pwa/index.html`](pwa/index.html) (6,026,500 bytes) is a zero-build vanilla-JS app
that embeds the *entire* Quran inline: `QURAN` (Arabic + Basmeih Malay), `TRANS_EXTRA` (Sahih
International English + Kemenag Indonesian), `TRANSLIT`, `TAJ` (per-ayah tajweed triples),
`PAGE_STARTS` (604), `JUZ_STARTS` (30), plus 16 module constants.

**2 — Extract.** [`server/extract.mjs`](server/extract.mjs) string-splits the `<script id="quran-data">`
block, brace-scans the 16 named consts out of the raw HTML, and evaluates ~5.2 MB of legacy JS via
`new Function()`. It emits `data/surahs.json` (114), `data/ayahs.json` (6,236 rows, 6.5 MB — `page`
and `juz` resolved by binary search) and `data/modules-raw.json`.

> ⚠️ **Only those three files are regenerable.** `mathurat.json` (46 wirid items), `i18n.json`
> (300 keys), `app_config.json` and `mengaji_drills.json` have **no generator anywhere in the repo**.
> They are irreplaceable hand-curated source. Back them up.

**3 — Seed.** Four SQL files then five Node scripts, in a **load-bearing order** that is codified
only in [`deploy/entrypoint.sh:45-72`](deploy/entrypoint.sh:45). `server/README.md`'s setup section
is incomplete — following it literally produces a half-built database. The correct sequence is in §6.

**4 — Serve.** [`server/server.mjs`](server/server.mjs) (271 lines) — 20 first-party route
registrations (15 `/api/*` handlers + 5 page routes), plus mounted SSO (3 routes) and admin (3 routes)
groups, plus static `build/` and an `app.get('*')` SPA fallback.

**5 — ⬅ The reverse flow.** Six data groups are read *synchronously at module load* inside minified
chunks — there is no SvelteKit `load` function to intercept, and (in *this* directory) no source to
change; the actual source lives at `~/qcx-cakna/web/src`, which this approach bypasses entirely. So
[`server/sync-frontend.mjs`](server/sync-frontend.mjs) closes the loop backwards: it queries Postgres
and **rewrites minified data literals in place** inside `build/_app/immutable/**`. Eight rewrite
targets:

| # | Data | Anchor | File |
|---|---|---|---|
| 1 | Al-Ma'thurat (46 items) | `var F=[` | `nodes/10.-xY5Wh5P.js` |
| 2–4 | Surah index, page starts, sajdah | `surahs:[` `page_first_global:[` `sajdah:[` | `chunks/RVSxgVWS.js` |
| 5–6 | i18n MS + EN (300 keys) | ``ms:JSON.parse(` `` ``en:JSON.parse(` `` | `chunks/CGhbo2j02.js` |
| 7 | App config (qaris, tajweed, puasa types…) | `var e={` | `chunks/C3APuZRv.js` |
| 8 | Mengaji drills (5) | `,g=[` | `nodes/11.DLQiIJVd.js` |

Each target is located by **content signature** (so it survives content-hash renames),
brace-balanced, parse-checked with `new Function`, and backed up write-once to `*.orig`.
`entrypoint.sh:82` runs it on every container start, soft-failing.

**…and then a human patched it again by hand.** Three files carry `.orig2` backups from a separate
manual pass on 2026-07-22 21:25 that rewrote `/auth/login` → `/login`. No script in this repo
produces, references, or can reapply that edit. If the build is ever restored from `.orig`, that
change is silently lost.

---

## 5. Subsystem reference

### 5.1 HTTP API — `server/server.mjs`, `db.mjs`, `solat.mjs`

| Method · Path | Auth | Returns |
|---|---|---|
| `GET /api/auth/me` | session | `{id, email, name, is_admin}` |
| `POST /api/auth/register` | — | creates user + session; 400/409 on bad input |
| `POST /api/auth/login` | — | sets `sid` cookie; 401 on mismatch |
| `POST /api/auth/logout` | — | deletes the session row |
| `GET /api/pages/:n` | — | `{page, ayahs[], surahs[]}` for pages 1–604 |
| `GET /api/surahs/:t` | — | **polymorphic**: numeric → one surah *object* with ayahs; non-numeric → *array* of all 114 |
| `GET /api/ayahs/:g/words` | — | whitespace-split Arabic words (stub — see §8) |
| `GET /api/search?q=&lang=&limit=` | — | `{total, hits[]}`; Arabic-aware, `ILIKE` |
| `GET /api/modules/mathurat` | — | 46 wirid items |
| `GET /api/modules/:key` | — | raw JSONB for `cities`, `asma`, `dhikr`, `duas`, `yasin`, `ibadah`, `mengaji`, `hijri-events`, `doa_h` |
| `GET /api/i18n` | — | `{ms:{…}, en:{…}}`, 300 keys |
| `GET /api/config` | — | qaris, tajweed rules/chips/descriptions, puasa types/reasons, sync-key list |
| `GET /api/solat/:zone` | — | prayer times + Hijri date for a JAKIM zone |
| `GET`/`PUT /api/sync` | session | per-user key/value store |
| `GET /login` · `GET /auth/login` · `GET /admin` · `/admin-switch.js` · `/mathurat-hint.js` | mixed | page routes |

Auth is `sid` cookie → `sessions` table → `users` join. Passwords use `scrypt` with a per-user salt
and `timingSafeEqual`, no native dependencies.

[`solat.mjs`](server/solat.mjs) (61 lines) is a verbatim port of the frontend bundle's astronomical
calculation — Fajr 20°, Isha 18°, Shafi'i Asr — plus a hardcoded 21-entry city→JAKIM-zone map and an
`Intl` Umm al-Qura Hijri converter.

[`db.mjs`](server/db.mjs) (16 lines) exports a `pg.Pool` and a `q(text, params)` helper. It uses
`DATABASE_URL` when set, otherwise falls back to standard `PG*` variables with database `cakna`.

### 5.2 Auth — `auth-sso.mjs`, `auth-schema.sql`, `public/login.html`

Two login paths share one session model.

**QCXIS SSO** (OAuth 2.1 authorization code + PKCE S256, confidential client). `GET /auth/sso/start`
builds `verifier`/`challenge`/`state`/`nonce`, stores them in an in-process `Map`, and redirects to
the discovered authorization endpoint. `GET /auth/sso/callback` verifies `state`, exchanges the code
server-side (CORS at QCXIS is locked to its own origin), verifies the `id_token` against JWKS with
`jose`, checks `nonce`, upserts the user (linked by `qcxis_sub`, else email), creates a session, and
redirects to `/mathurat`. Configured via `QCXIS_CLIENT_ID` / `QCXIS_CLIENT_SECRET`; when unset,
`/auth/sso/start` redirects to `/login?sso=unconfigured`.

**Email + password** — `POST /api/auth/register` / `login` / `logout` in `server.mjs`.

`auth-schema.sql` is the only idempotent SQL file — pure `ALTER TABLE … IF NOT EXISTS`, adding
`qcxis_sub`, `name`, `login_method`, `last_login`, `is_admin` and making `password_hash` nullable.

`public/login.html` (552 lines) is a standalone, self-contained Malay login page — the QCXIS button,
an email/password form, and a show/hide password toggle.

### 5.3 Data model

Ten tables across four SQL files:

| File | Tables |
|---|---|
| `schema.sql` | `surahs` (114) · `ayahs` (6,236) · `modules` (9 JSONB rows) · `users` · `sessions` · `sync_data` |
| `mathurat.sql` | `mathurat` (46 wirid items) |
| `frontend-data.sql` | `i18n` (300 keys × ms/en) · `app_config` (8 named JSONB groups) |
| `auth-schema.sql` | *(ALTERs on `users` only)* |

`ayahs` carries `ar`, `ar_plain` (diacritics stripped, for search), `tr_ms`/`tr_en`/`tr_id`,
`translit`, `tajweed` (JSONB `[start,len,rule,…]` triples), `sajdah`, plus `page` and `juz`.

⚠️ Only `auth-schema.sql` is idempotent. The other three begin with `DROP TABLE … CASCADE`.

### 5.4 Admin dashboard — `admin.mjs`, `public/admin-dashboard.html`

Three endpoints, all behind a `requireAdmin` gate (`users.is_admin` **OR** the `ADMIN_EMAILS`
allowlist):

- `GET /api/admin/overview` — KPIs (total users, active today, average completion, sessions this week), a weekly Pagi/Petang aggregate, login split, streak leaderboard, and per-user Ma'thurat detail
- `GET /api/admin/users` — role table with `is_admin` / `allowlisted` / `effective_admin`
- `POST /api/admin/set-role` — grant/revoke admin; refuses to change your own role (anti-lockout)

Metrics derive entirely from `sync_data['mathurat']`. Constants: Sughra = 32 items / 70 repetitions,
Kubra = 46 items / 207 repetitions — both verified against the shipped wirid content.

The dashboard (1,174 lines) is hand-rolled: no chart library, no CDN scripts, four chart types built
from pure CSS and inline SVG. Its only external dependency is Google Fonts.

`admin-switch.js` and `mathurat-hint.js` are injected into the app shell by `server.mjs`'s SPA
fallback — the first renders a "Panel Admin" button for admins only, the second adds a reading hint
to the Ma'thurat page for everyone.

### 5.5 Frontend — `build/`

Svelte **5** + SvelteKit **2** with `adapter-static` in SPA-fallback mode, Tailwind CSS **4.3.2**,
and bits-ui / vaul-svelte / sonner for components. 24 route nodes → 21 client routes:

| Route | Node | Feature |
|---|---|---|
| `/` | 3 | Home: greeting, next-prayer countdown, continue-reading, 604-page progress |
| `/read` → `/read/[page]` | 22, 23 | **The mushaf reader** (64 KB) — long-press actions, tajweed guide, A–B loop, bookmarks, notes, share cards |
| `/surah` | 18 | Index: Surah / Juzuk / Bookmarks / Notes tabs |
| `/search` | 15 | Verse search |
| `/solat` | 17 | Prayer times, GPS, azan toggle, Hijri calendar |
| `/qibla` | 14 | SVG compass |
| `/zikir` | 21 | Daily dhikr + free tasbih counter |
| `/mathurat` | 10 | **Al-Ma'thurat wirid reader** (99 KB — the largest node) |
| `/yasin` | 19 | Surah Yasin reader |
| `/asma` | 4 | Asmaul Husna |
| `/doa` | 7 | Selected du'as |
| `/ibadah` | 8 | Shafi'i ibadah guide + tawaf/sa'ie counters |
| `/mengaji` | 11 | Hijaiyah lessons + quiz |
| `/khatam` | 9 | Khatam target + 12-week heatmap |
| `/puasa` | 13 | Qada-puasa log |
| `/zakat` | 20 | Zakat calculator |
| `/menu` | 12 | Module directory |
| `/settings` | 16 | Qari, language, theme, font size, export/import |
| `/auth/login` `/auth/register` | 5, 6 | Original SvelteKit auth pages (node 5 now orphaned — see §7) |

Client state lives in localStorage under a `cakna:` prefix across 15 keys (`settings`, `bookmarks`,
`notes`, `hls`, `read`, `readlog`, `khatamToasted`, `tasbih`, `city`, `sgdays`, `onboarded`,
`mathurat`, `mgquiz`, `puasa`, `manasik`). Six are conflict-merged on sync. Writes are debounced
1.5 s and pushed to `PUT /api/sync` whenever a session cookie exists.

### 5.6 Deploy — `deploy/`

Single-stage image from `node:20-bookworm-slim` plus `postgresql-client` (needed by the entrypoint's
`psql` step). Three compose services — `postgres:16` with a `pgdata` volume and healthcheck, the app
(internal only, `expose: 3000`), and `caddy:2` terminating TLS with automatic Let's Encrypt.

`entrypoint.sh` waits for Postgres with a real `SELECT 1`, runs a **guarded** one-time init (only
when `ayahs` is missing or empty), always re-runs `sync-frontend.mjs` (soft-fail), then execs the
server.

### 5.7 Legacy PWA — `pwa/`

The original product: a single-file, zero-build, offline vanilla-JS Quran app ("Nur Al-Quran —
Mushaf Digital"), with a service worker (`nur-al-quran-v25`) and a web manifest. `README-TWA.md`
documents wrapping it as an Android TWA via Bubblewrap.

> ⚠️ **Do not delete `pwa/`.** [`deploy/Dockerfile:31`](deploy/Dockerfile:31) does `COPY pwa/ ./pwa/`,
> and `.dockerignore` *deliberately* excludes the pre-generated `ayahs.json` / `surahs.json` /
> `modules-raw.json` so there is no fallback copy. Removing `pwa/` breaks `docker build` immediately.

---

## 6. Running it

### Local development

Requires Node 20.12+ (the server uses `process.loadEnvFile`) and PostgreSQL.

```bash
cd "/Users/dzulhilmy/Cakna Project/server" && npm install
```

⚠️ **Do not use the database name `cakna` on this machine** — see §7. Pick a fresh one:

```bash
createdb cakna_dev
```

Apply all four SQL files (the `server/README.md` version omits three of them):

```bash
cd "/Users/dzulhilmy/Cakna Project/server" && psql -d cakna_dev -v ON_ERROR_STOP=1 -f schema.sql -f mathurat.sql -f frontend-data.sql -f auth-schema.sql
```

Then seed, **in this order** (the order is destructive if reversed — see §8):

```bash
cd "/Users/dzulhilmy/Cakna Project/server" && PGDATABASE=cakna_dev node extract.mjs && PGDATABASE=cakna_dev node seed.mjs && PGDATABASE=cakna_dev node seed-modules.mjs && PGDATABASE=cakna_dev node seed-mathurat.mjs && PGDATABASE=cakna_dev node seed-frontend-data.mjs
```

Optionally add ~10 demo users so the admin dashboard has data:

```bash
cd "/Users/dzulhilmy/Cakna Project/server" && PGDATABASE=cakna_dev node seed-demo.mjs
```

Run:

```bash
cd "/Users/dzulhilmy/Cakna Project/server" && PGDATABASE=cakna_dev node server.mjs
```

`http://localhost:3000`. Override the port with `PORT`.

> `extract.mjs` regenerates `server/data/{surahs,ayahs,modules-raw}.json` from `pwa/index.html`. It
> is safe to skip if those files are already present and current.

### Editing content

PostgreSQL is the source of truth. After changing content, regenerate the bundled copies:

```bash
cd "/Users/dzulhilmy/Cakna Project/server" && PGDATABASE=cakna_dev node sync-frontend.mjs
```

### Production

See [`deploy/DEPLOY-EC2.md`](deploy/DEPLOY-EC2.md) for the full runbook. Short version:

```bash
cd deploy && cp .env.example .env
```

Fill in `DOMAIN`, `POSTGRES_PASSWORD`, the `QCXIS_*` credentials and `ADMIN_EMAILS`, point an A
record at the instance, then:

```bash
cd deploy && docker compose up -d --build
```

---

## 7. Current state

Honest status per area, as of 2026-07-23. Items marked ✔ were verified directly against a running
system or the live database.

### Working

- ✔ **The read path works end-to-end.** Verified by seeding a scratch database from the JSON sources and running the server: 114 surahs, 6,236 ayahs, 46 wirid items, 300 i18n keys, 8 config groups, 9 module rows all load, and `/read/1` renders Al-Fatihah correctly with Arabic, page number and surah header.
- ✔ **Both auth entry points resolve.** Clicking "Log masuk" in the app loads the standalone login page; `/auth/register` falls through the SPA fallback and renders the SvelteKit register form; `/auth/login` 302s to `/login`.
- **The frontend feature set is complete** — all 21 routes are present and compiled.

### Half-done

- ✔ **The admin dashboard reads zero for real users.** [`admin.mjs:24`](server/admin.mjs:24) expects `rekod[day].sughra.pagi`, but the shipped frontend writes `rekod[day] = {pagi: true}` (`nodes/10.-xY5Wh5P.js`: `rekod[e]={...rekod[e]||{},[mode]:!0}`). The version level is missing from what the app writes. So `dayActive()` is always false for real users — streak, heatmap, sessions and "last completed" all read zero. Only the `@demo.cakna.my` seed users look alive, because [`seed-demo.mjs:29`](server/seed-demo.mjs:29) writes the *nested* shape the API expects. **Either the frontend writer or the admin reader has to change; they currently disagree.**
- **The auth-page migration is mid-step.** `login.html` was added, then three bundle files were hand-patched to send `/auth/login` → `/login`, while the `/auth/register` links were deliberately left alone. The result works, but: SvelteKit node 5 (the original login page) is now **unreachable** — Express intercepts `/auth/login` with a 302 before the SPA ever sees it — and the register page is still the old SvelteKit form, so **it offers no QCXIS option**. The two auth entry points are inconsistent.
- **The dashboard has drifted from its own mockup.** `.delta`, `.delta.up`, `.status.prog` and `.status.stall` CSS survive from `server/mockups/admin-dashboard.html` with no API data behind them — there is no week-over-week comparison anywhere in the backend.

### Blocked

- ✔ **The Node backend cannot start against the default database on this machine.** `db.mjs` defaults `PGDATABASE` to `cakna` — but the local `cakna` database is occupied by a **different, abandoned Rust/`sqlx` backend**: 6 migrations applied 2026-07-22 09:33 (`extensions`, `content`, `modules`, `auth`, `user data`, `words`), holding **4 real user accounts, 5 sessions and 1 `user_data` row**, with every content table at 0 rows. None of the Node schema's tables (`modules`, `i18n`, `app_config`, `mathurat`) exist there.

  > 🚨 Running `psql -d cakna -f schema.sql` — the command in `server/README.md` — fires
  > `DROP TABLE IF EXISTS sync_data, sessions, users, ayahs, surahs, modules CASCADE` at those
  > four real accounts. **Always use a separate database name locally.** (Production is safe:
  > `entrypoint.sh` guards the whole init behind an empty-database check.)

### Not yet exercised

- ✔ **QCXIS SSO is implemented but has never run.** `server/.env` is byte-identical to `.env.example` (`cmp` reports no difference) — every credential is empty. `server/README.md` confirms verification reached only "up to the QCXIS redirect"; the callback, token exchange, JWKS verification and user upsert paths await a registered app.
- **Never deployed from this machine.** `deploy/.env` does not exist, so `docker compose up` would fail immediately on the `${POSTGRES_PASSWORD:?}` and `${DOMAIN:?}` guards. `server.md` does hold a production EC2 IP, so an instance exists somewhere — just not launched from this copy.

### Stubbed

- `GET /api/ayahs/:g/words` selects `translit`, `tr_ms`, `tr_en`, `tr_id` and **discards all four**, returning a bare whitespace split of the Arabic. There is no word-level translation, root or timing data.
- [`seed.mjs:91-93`](server/seed.mjs:91) writes `{note:'stub'}` for `ibadah` and `mengaji` — the only TODO-class markers in the entire codebase. Real content arrives only via `seed-modules.mjs`.

### Unreproducible

- **No SvelteKit source *in this directory*** — no `src/`, no `svelte.config.js`, no `vite.config.*`, so `build/` is opaque *here*. `_app/version.json` still stamps 2026-07-10 while six bundle files were hand-edited on 2026-07-22, and the version string was never bumped. **A rebuild silently reverts every patch.**

  ✔ **The source does exist**, at `~/qcx-cakna/web/src` — verified by matching content hashes and `version.json` across both builds (see §2). So the patches *are* reproducible, but only by porting each one into that source and rebuilding there. Nothing in this directory can do it.
- 41 of the 300 i18n keys are referenced nowhere in the bundle — including all ten `mt_*` (Ma'thurat) keys, since node 10 was rewritten with hardcoded Malay, plus `votd` ("Ayat Hari Ini"), a feature translated but never shipped.

### Planned but absent

`pwa/README.md` (overwritten 2026-07-23 09:48) now names the *intended* stack: **Svelte + shadcn-svelte**
for web, **Flutter** for mobile, **Rust + PostgreSQL + self-hosted LiveKit** for audio on the backend.
Neither the Flutter client nor any LiveKit integration exists in this tree. The Rust backend was
started (its migrations are in the local `cakna` DB) and abandoned ~7.5 hours later in favour of the
Node rewrite; its source is not in this directory.

> ⚠️ That overwrite destroyed the original 3,229-byte PWA deploy/attribution guide. A copy survives
> inside `nur-al-quran-pwa.zip`, and `pwa/README-TWA.md:10` still points readers at it.

---

## 8. Known issues & hazards

The highest-value items only. Each is one line, with where it lives and why it bites.

### Destructive by design

- `schema.sql:2`, `mathurat.sql:2`, `frontend-data.sql:2` all start with `DROP TABLE … CASCADE`. There is no migration tool and no version table — **any schema change on a live database must be applied by hand**, and `entrypoint.sh` will never re-run the SQL.
- **Re-running `seed.mjs` after `seed-modules.mjs` reverts content.** It restores `ibadah`/`mengaji` to `{note:'stub'}` and rewrites `asma`/`dhikr`/`duas`/`yasin` in older, incompatible shapes the frontend cannot render. `npm run seed` is wired to `seed.mjs` **alone** — so the packaged command is the dangerous one.
- `seed.mjs` also writes a `doa_h` row that `seed-modules.mjs` neither writes nor deletes; `GET /api/modules/doa_h` serves stale content already folded into `duas`.

### Security

- `ssl: { rejectUnauthorized: false }` ([`db.mjs:7`](server/db.mjs:7)) **disables certificate verification** on every TLS Postgres connection, including the documented AWS RDS path. Encrypted but not authenticated.
- **Sessions never expire server-side.** `sessions` has no `expires_at`, the cookie lives a year, tokens are stored in plaintext, login never rotates or invalidates prior sessions, and there is no cleanup job. The table grows unbounded and a stolen `sid` is valid forever.
- **No rate limiting anywhere** — `/api/auth/login` and `/api/auth/register` are freely brute-forceable.
- The container **runs as root** — `deploy/Dockerfile` has no `USER` directive.
- SSO account linking falls back to email with **no `email_verified` check**, and the nonce check is conditional (`if (payload.nonce && …)`), so an `id_token` omitting `nonce` passes.
- `POST /api/admin/set-role` has **no CSRF token**; it relies entirely on the cookie being `sameSite: 'lax'`.
- The default `ADMIN_EMAILS` is empty and `is_admin` defaults to false, so **a fresh deploy has no way into `/admin`** — the first admin must be created out-of-band. Documented, but a real bootstrap trap.

### Correctness

- **Timezone off-by-one in the admin dashboard.** `admin.mjs` builds day keys with `toISOString()` (UTC); the frontend uses local time. In Malaysia (UTC+8) every hour from 00:00 to 08:00 resolves to the *previous* UTC date, shifting the streak, heatmap, today-flags and weekly buckets.
- `avg_completion` ([`admin.mjs:133`](server/admin.mjs:133)) averages the **Sughra** percentage only, but the card is labelled "Purata Kemajuan Ma'thurat" with the footnote "Min. Sughra & Kubra".
- `WHERE u.email NOT LIKE 'test@cakna.my'` ([`admin.mjs:117`](server/admin.mjs:117)) has **no `%` wildcard** — it is an exact-match exclusion of one address and does *not* exclude the `@demo.cakna.my` seed users, which therefore inflate every KPI. `/api/admin/users` applies no filter at all, so the two endpoints disagree.
- `POST /api/auth/login` never updates `users.last_login`, so **every email/password account shows as never-active** in the dashboard. Only the SSO path sets it.
- `GET /api/search` runs two unindexed `ILIKE '%…%'` sequential scans over 6,236 rows per request — no trigram or GIN index exists.

### Operational

- `ZONE_COORDS` ([`server.mjs:187`](server/server.mjs:187)) caches permanently. If `modules.cities` is empty at the first `/api/solat/:zone` request, it caches `{}` — which is truthy — and **every solat request 404s for the life of the process**. Only a restart clears it.
- `appShell()` memoises `build/index.html` on first request, so frontend rebuilds need a server restart — this directly contradicts the `maxAge: 0` comment two lines above it.
- **No healthcheck on `app` or `caddy`** (only `postgres` has one). A hung — as opposed to crashed — Node process is never detected, and Caddy's `depends_on` has no condition, so it can start before the app serves.
- `sync-frontend.mjs` has no transaction: a mid-run failure leaves the build in a mixed state, and the pool is never closed on that path.
- Async route handlers have no `try`/`catch`, and Express 4 does not catch rejected promises — so the error handler at `server.mjs:265` is unreachable for the most common failure (Postgres down).

### Hygiene

- **Nine stray `.bak` / `.orig` / `.orig2` files ship inside `build/`** (~180 KB) and will be served publicly by any static host. `.dockerignore` excludes `*.orig` but **not** `*.bak` or `*.orig2`, so four of them — precisely the ones recording undocumented hand-edits — are baked into the Docker image.
- Four `.DS_Store` files, three of them inside `build/`, leaking local directory listings.
- ⚠️ **`server.md` at the repo root holds production access details** (a live EC2 public IP and an SSH key filename). It is covered by **no ignore rule anywhere** — not `.dockerignore`, and there is no root `.gitignore` — so it is uploaded into every Docker build context and would be committed the moment version control is introduced. Move it out of the tree or add an ignore rule.
- No version control at all. `deploy/DEPLOY-EC2.md:102` still scp's from `/Users/akmalfarhan/Desktop/Mathurat` — a different machine, user and project name.
- `deploy/DEPLOY-EC2.md` has an unmatched code fence at line 333, which breaks Markdown rendering of the document's tail.

---

## 9. Glossary

Malay and Arabic terms that appear untranslated throughout the code.

| Term | Meaning |
|---|---|
| **Ma'thurat** | A daily litany of Quranic verses and supplications; here, Hasan al-Banna's compilation |
| **Sughra / Kubra** | The short (32 items, 70 repetitions) and long (46 items, 207 repetitions) forms of the wirid |
| **Wirid** | A regularly recited devotional litany |
| **Pagi / Petang** | Morning (Subuh–Zohor) / evening (Asar–Maghrib) — the two daily recitation windows |
| **Rekod** | Record — the per-day completion log |
| **Ulangan** | Repetitions — how many times an item is recited |
| **Tetapan** | Settings |
| **Solat** | The five daily prayers |
| **Zikir** | Remembrance of God; repeated devotional phrases |
| **Doa** | Supplication |
| **Khatam** | Completing a full reading of the Quran |
| **Puasa** | Fasting; here the qada (make-up) debt log |
| **Mengaji** | Learning to recite the Quran |
| **Hijaiyah** | The Arabic alphabet as taught for Quranic reading |
| **Qibla / Kiblat** | The direction of prayer, toward the Kaaba |
| **Juz / Juzuk** | One of the Quran's 30 equal divisions |
| **Sajdah** | A verse of prostration (15 in the Quran) |
| **Tajwid** | The rules of Quranic pronunciation; colour-coded in the reader |
| **Qari** | A reciter (the app bundles three) |
| **Rumi** | Romanised transliteration of Arabic or Malay |
| **JAKIM** | Malaysia's federal Islamic authority; defines the prayer-time zone codes |
