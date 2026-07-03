# Cakna — Mushaf Digital

Full-stack rebuild of the Nur Al-Quran PWA (`sample/`): Rust (Axum + SQLx) API,
PostgreSQL 16 content + user-sync store, SvelteKit (Svelte 5 + shadcn-svelte,
Tailwind v4) SPA. Guest-first: works without an account; signing in syncs all
user state across devices.

## Layout

    server/          Rust crate: API server (`cakna`) + seeder (`seed`), sqlx migrations
    web/             SvelteKit SPA (adapter-static; dev proxies /api -> :8787)
    tools/extract/   Node pipeline: sample/pwa/index.html -> data/ JSON artifacts
    data/extracted/  committed content artifacts (loaded into Postgres by `seed`)
    data/frontend/   i18n + enums + quran-meta consumed by the web build
    deploy/          Dockerfile.api, docker-compose.prod.yml, Caddyfile
    sample/          the original single-file PWA (spec / source of truth)

## Dev

    docker compose up -d                     # Postgres 16 on :54329
    cd server && cargo run --bin seed        # migrate + load content
    PORT=8787 cargo run --bin cakna          # API on :8787
    cd web && npm install && npm run dev     # SPA on :5173 (proxies /api)

Tests: `cd server && CAKNA_TEST_DATABASE_URL=postgres://cakna:cakna@localhost:54329/cakna cargo test`
Extraction drift check: `cd tools/extract && node verify.mjs`

## Deploy (cakna.qcxis.com)

    cd web && npm run build
    rsync -az --delete --exclude target --exclude node_modules --exclude .git . ubuntu@56.68.66.106:~/cakna-app/
    ssh ubuntu@56.68.66.106 'cd ~/cakna-app && docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build'
    ssh ubuntu@56.68.66.106 'cd ~/cakna-app && docker compose -f deploy/docker-compose.prod.yml exec api seed'

Caddy terminates TLS and proxies everything to the API, which serves both
`/api/*` and the SPA build (`STATIC_DIR`).

## Data sources

Quran text & translations: Tanzil.net (Basmeih ms, Sahih International en,
Kemenag id); transliteration: risan/quran-json; Madani page map:
MohamadHajjRabee/quran-qcf4; audio streamed from cdn.islamic.network.
