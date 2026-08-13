# Cakna — Mushaf Digital

Malay-first Islamic companion app for Malaysian Muslims: a 604-page digital Mushaf Madani with
coloured tajweed, three translations (Malay / English / Indonesian), romanised transliteration and
qari audio, plus ~20 surrounding modules — prayer times (JAKIM zones), qibla, dhikr/tasbih, Asmaul
Husna, du'as, Surah Yasin, **Al-Ma'thurat** wirid, khatam tracker, qada-puasa log, zakat calculator,
a Shafi'i ibadah guide and an "Asas Mengaji" hijaiyah quiz.

Full-stack rebuild of the Nur Al-Quran PWA (`sample/`): Rust (Axum + SQLx) API, PostgreSQL 16
content + user-sync store, SvelteKit (Svelte 5 + shadcn-svelte, Tailwind v4) SPA, and a Flutter
mobile app. Guest-first: works without an account; signing in syncs all user state across devices.

## Layout

    server/          Rust crate: API server (`cakna`) + seeder (`seed`), sqlx migrations
    web/             SvelteKit SPA (adapter-static; dev proxies /api -> :8787)
    app/             Flutter app (Android + iOS)
    tools/extract/   Node pipeline: sample/pwa/index.html -> data/ JSON artifacts
    data/extracted/  committed content artifacts (loaded into Postgres by `seed`)
    data/frontend/   i18n + enums + quran-meta consumed by the web build
    deploy/          Dockerfile.api, docker-compose.prod.yml, Caddyfile
    sample/          the original single-file PWA (spec / source of truth)
    legacy/          the superseded Node/Express stack — still what serves production
                     until a cutover happens; see legacy/README.md and DECISIONS.md

## Dev

    docker compose up -d                     # Postgres 16 on :54329
    cd server && cargo run --bin seed        # migrate + load content
    PORT=8787 cargo run --bin cakna          # API on :8787
    cd web && npm install && npm run dev     # SPA on :5173 (proxies /api)

Tests: `cd server && CAKNA_TEST_DATABASE_URL=postgres://cakna:cakna@localhost:54329/cakna cargo test`
Extraction drift check: `cd tools/extract && node verify.mjs`

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgres://cakna:cakna@localhost:54329/cakna` | Postgres connection |
| `PORT` | `8080` | HTTP listen port |
| `STATIC_DIR` | *(unset)* | Serve the SPA build from here; unset = API only |
| `COOKIE_SECURE` | `false` | `true` in production (HTTPS) |
| `SESSION_TTL_DAYS` | `30` | Session lifetime; refreshes past the halfway mark |
| `ADMIN_EMAILS` | *(empty)* | Comma-separated allowlist for the admin panel, **in addition to** `users.is_admin` |
| `QCXIS_CLIENT_ID` | *(empty)* | QCXIS SSO; empty disables the flow |
| `QCXIS_CLIENT_SECRET` | *(empty)* | Optional — omit for a public PKCE client |
| `QCXIS_ISSUER` | `https://qcxis.com` | OIDC issuer |
| `QCXIS_REDIRECT_URI` | `http://localhost:8080/auth/sso/callback` | Must match the registered URI **exactly** |

### Bootstrapping the first admin

`users.is_admin` defaults to false and the allowlist starts empty, so a fresh deployment has no way
into the admin panel. Set `ADMIN_EMAILS` to your address, sign in, then grant the flag to others
from the dashboard. Admins cannot change their own role, so you cannot lock yourself out.

## Auth

Two paths, one session model (opaque token → `sessions`, `HttpOnly` cookie):

- **Email + password** — Argon2id.
- **QCXIS SSO** — OpenID Connect, OAuth 2.1 authorization code + PKCE S256. The code exchange is
  server-side (QCXIS locks browser CORS to its own origin) and works as either a confidential
  client (`client_secret_basic`) or a public PKCE client. In-flight state lives in `sso_pending`,
  so the flow survives a restart and works with more than one app process.

An SSO-only account has `password_hash IS NULL` and cannot be signed into with a password —
attempts take the same path as an unknown account, so timing does not reveal existence. Linking a
QCXIS identity to an existing local account requires `email_verified` from the provider.

## Admin

`/admin.html`, backed by `GET /api/admin/{overview,users}` and `POST /api/admin/set-role`.
401 unauthenticated, 403 for a signed-in non-admin. Reports Al-Ma'thurat progress per user:
completion, streak, sessions this month, and a 14-day heatmap.

Day keys are computed at **UTC+8**, matching the client's local-time keys. Progress is stored as
`rekod[YYYY-MM-DD] = { pagi?, petang? }` — flat, with no version dimension — so a day counts for at
most two sessions, and today's status is reported once per user rather than per Sughra/Kubra.

## Deploy (cakna.qcxis.com)

    cd web && npm run build
    # NOTE: keep the deploy/.env exclude — the file exists only on the server
    rsync -az --delete --exclude target --exclude node_modules --exclude .git \
      --exclude deploy/.env . ubuntu@56.68.66.106:~/cakna-app/
    ssh ubuntu@56.68.66.106 'cd ~/cakna-app && docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build'
    ssh ubuntu@56.68.66.106 'cd ~/cakna-app && docker compose -f deploy/docker-compose.prod.yml exec api seed'

Caddy terminates TLS and proxies everything to the API, which serves both
`/api/*` and the SPA build (`STATIC_DIR`).

## Data sources

Quran text & translations: Tanzil.net (Basmeih ms, Sahih International en, Kemenag id);
transliteration: risan/quran-json; Madani page map: MohamadHajjRabee/quran-qcf4; audio streamed from
cdn.islamic.network at a **per-edition bitrate** — several editions are not published at 128 kbps
and return 403 if requested there (see `QARI_BITRATE` in `web/src/lib/quran/meta.ts`, mirrored in
`app/lib/data/reciters.dart`).

## Decisions

See [DECISIONS.md](DECISIONS.md) — which Al-Ma'thurat dataset is canonical, and an open question on
the `ibadah` prose.