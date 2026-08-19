# Cakna — Backend (PostgreSQL + Express)

Backend for the SvelteKit `../build` frontend. Serves the compiled app **and** the
`/api/*` endpoints it expects, on one origin, backed by PostgreSQL.

## Requirements
- Node 18+ and PostgreSQL running locally (this machine: PG 17, Node 24).

## One-time setup
```bash
cd server
npm install
createdb cakna                 # or: psql -d postgres -c 'CREATE DATABASE cakna'
psql -d cakna -f schema.sql    # tables
node extract.mjs               # pull Quran+module data out of ../pwa/index.html -> data/*.json
node seed.mjs                  # load data/*.json into PostgreSQL
```

## Run
```bash
cd server
node server.mjs                # http://localhost:3000   (node --watch server.mjs to auto-reload)
```
Override DB connection with standard `PG*` env vars (`PGHOST`, `PGUSER`, `PGDATABASE`, …).
Override port with `PORT`.

## What's implemented (reverse-engineered from the compiled frontend)
| Endpoint | Status |
|---|---|
| `GET /api/auth/me`, `POST /api/auth/{register,login,logout}` | ✅ session cookie, scrypt-hashed passwords |
| `GET /api/pages/:n` (1–604) | ✅ page bundle `{page,ayahs,surahs}` |
| `GET /api/surahs/:n` | ✅ surah detail + ayahs |
| `GET /api/search?q=&lang=&limit=` | ✅ Postgres ILIKE, Arabic-aware |
| `GET /api/ayahs/:g/words` | ✅ (basic whitespace split) |
| `GET /api/solat/:zone` | ✅ astronomical times + Hijri (matches the client fallback) |
| `GET /api/sync`, `PUT /api/sync` | ✅ per-user key/value with cookie auth |
| `GET /api/modules/cities` | ✅ |
| `GET /api/modules/asma` | ✅ 99 names |
| `GET /api/modules/dhikr` | ✅ tasbih phrases + Quranic dhikr |
| `GET /api/modules/duas` | ✅ Quranic + daily du'as |
| `GET /api/modules/yasin` | ✅ opening/closing du'as (surahs 36 & 1 come from /api/surahs) |
| `GET /api/modules/ibadah` | ✅ authored: wuduk/solat/tayammum/umrah/haji + hajj tables |
| `GET /api/modules/mengaji` | ✅ authored: 28 hijaiyah letters, baris, quiz |
| `GET /api/modules/hijri-events` | ✅ [{month_code,day,label_key}] — client computes upcoming dates |
| `GET /api/modules/mathurat` | ✅ 46 wirid items from the `mathurat` table |

Every route in the app renders with no console errors.

## Single source of truth — ALL app data is in PostgreSQL
Nothing that is *data* is hardcoded in the frontend anymore. Everything the bundle used to embed
is now DB-backed and regenerated into the build by `sync-frontend.mjs`:

| Data | DB source | Bundle it feeds |
|---|---|---|
| Quran text (6236 ayahs, 3 translations, translit, tajweed) | `ayahs` | served live via `/api/pages`,`/api/surahs`,`/api/search` |
| Content panels (asma, dhikr, duas, yasin, ibadah, mengaji, hijri, cities) | `modules` | served live via `/api/modules/*` |
| **Al-Ma'thurat** (46 wirid items) | `mathurat` | `var F=[…]` in route node `10.*.js` |
| **Surah index** (114, + `first_global`) | `surahs`+`ayahs` | `surahs:[…]` in `RVSxgVWS.js` |
| **Page starts** (604) + **sajdah** (15) | `ayahs` (derived) | `page_first_global:[…]`,`sajdah:[…]` in `RVSxgVWS.js` |
| **Interface strings** (300 keys, MS+EN) | `i18n` | `ms/en:JSON.parse(…)` in `CGhbo2j02.js` |
| **App config** (qaris, tajweed rules/chips/desc, fasting types/reasons, sync-key list) | `app_config` | `var e={…}` in `C3APuZRv.js` |
| **Mengaji drills** (5 reading examples) | `app_config` (`mengaji_drills`) | `g=[…]` in node `11.*.js` |

Panels above the double line are **fetched live** from the DB. The rest are read synchronously at
module load (no SvelteKit `load` fn to hijack, and only the build output is available — not the
source), so a generator writes the DB values back into the build instead.

### Editing anything
```bash
psql -d cakna -c "UPDATE mathurat SET ar='…', bm='…' WHERE tajuk='Doa Rabitah'"   # content
psql -d cakna -c "UPDATE i18n SET ms='…' WHERE key='p_solat'"                       # a label
node sync-frontend.mjs      # regenerate all bundled arrays from the DB
```
`sync-frontend.mjs` finds targets by **content signature** (survives hash renames), **parse-checks**
every generated literal, and keeps a one-time `*.orig` backup per file. Verified: every regenerated
structure (i18n, config, surahs, page-starts, sajdah, mathurat, drills) is functionally identical to
the original. New API reads: `GET /api/i18n`, `GET /api/config`.

### What is NOT in the DB (and shouldn't be)
- **Framework/library code**: the Svelte runtime, tailwind-merge, component logic, SVG icons — this is executable code, not data.
- **~4 fixed literals woven into component render code**: the Basmalah separator shown before a surah, the word `سُورَةُ` in the reader's band header, and one hardcoded `{surah:1,from:1,to:7}` (Al-Fatihah) reference in the ibadah "read Al-Fatihah" step. These are structural presentation constants inside compiled component control-flow, not standalone data — their proper home is the SvelteKit source, not a DB.

**Note:** a rebuild from SvelteKit source regenerates hashed filenames and overwrites these patches —
the permanent home for all this data is that source; this DB + generator is the source of truth for
the running build.

## Architecture
- `db.mjs` — pg pool
- `schema.sql` — surahs, ayahs (6236), modules, users, sessions, sync_data
- `mathurat.sql` — mathurat table · `frontend-data.sql` — i18n + app_config tables
- `extract.mjs` — lifts embedded data out of the legacy single-file PWA · `seed.mjs` — loads it
- `seed-modules.mjs` — content modules · `seed-mathurat.mjs` — Al-Ma'thurat · `seed-frontend-data.mjs` — i18n + config + drills
- `sync-frontend.mjs` — writes ALL bundled data (mathurat, surahs, page-starts, sajdah, i18n, config, drills) back into the build
- `solat.mjs` — prayer-time math + JAKIM zone map (ported from the frontend bundle)
- `server.mjs` — Express: `/api/*` (incl. `/api/i18n`, `/api/config`) + static `../build` + SPA fallback

## Authentication — QCXIS SSO + login page
Sign-in supports **"Teruskan dengan QCXIS"** (QCXIS OpenID Connect SSO) alongside the existing
email/password. Files: `auth-sso.mjs` (the OIDC flow), `public/login.html` (the login page).

**Flow** (OAuth 2.1 Authorization Code + PKCE, confidential client — code exchange is server-side
because QCXIS CORS is locked to its own origin):
`/login` → **Teruskan dengan QCXIS** → `GET /auth/sso/start` (builds PKCE + state + nonce, redirects
to `qcxis.com/v1/oauth/authorize`) → user logs in at QCXIS → `GET /auth/sso/callback` (verifies
`state`, exchanges the code at the token endpoint with HTTP-Basic client auth, verifies the `id_token`
via JWKS with `jose`, checks `nonce`) → upserts a row in `users` (linked by `qcxis_sub`, else email)
→ creates a `sessions` row + `sid` cookie → redirects to `/`.

**Setup (you must do this — I can't register the app for you):**
1. At `https://qcxis.com` → Console → Settings → SSO apps → **New app**, type **Confidential**.
   - Redirect URI (exact): `http://localhost:3000/auth/sso/callback`
   - Scopes: `openid profile email offline_access`
2. Copy `server/.env.example` → `server/.env` and fill `QCXIS_CLIENT_ID` + `QCXIS_CLIENT_SECRET`.
3. Restart the server. Check `GET /api/auth/sso-status` → `{"configured":true}`.

Until configured, **Teruskan dengan QCXIS** bounces back to `/login?sso=unconfigured` (email/password
still works). Verified end-to-end up to the QCXIS redirect (authorize URL built to spec: PKCE S256,
state, nonce); the callback/token-exchange runs once a real app is registered.

Users table gained: `qcxis_sub` (unique, links the SSO identity), `name`, `login_method`
(`email`|`qcxis`), `last_login`; `password_hash` is now nullable (SSO users have no password).

## Admin dashboard (live)
`GET /admin` serves `public/admin-dashboard.html` — an admin view of **who logged in** and their
**Al-Ma'thurat reading progress**, backed by real data.

- **API:** `GET /api/admin/overview` (in `admin.mjs`) — **admin session required** (401 unauth / 403 non-admin).
  Computes, from `users` + `sessions` + `sync_data['mathurat']`: KPIs (users, active-today, avg completion,
  sessions this week), per-user login method + last-active, and per-user Ma'thurat detail — Sughra/Kubra
  completion %, ulangan (reps/target, 70 & 207), current item, today's Pagi/Petang status, 14-day heatmap,
  streak, sessions/month, last-completed. Also `login_split`, `weekly` Pagi/Petang aggregate, `streak_leaders`.
- **Admin gate:** `users.is_admin` (added). `test@cakna.my` is flagged admin. The page shows a
  "log masuk sebagai admin" fallback on 401/403.
- **Progress shape:** reads the exact object the frontend syncs —
  `{v2, version, mode, counts:{sughra[32],kubra[46]}, idx, rekod, tetapan}` — so it works with real
  user data once people sync. `node seed-demo.mjs` seeds 10 realistic demo users
  (`*@demo.cakna.my`, delete-and-reinsert) with progress in that shape so the dashboard is populated now.
