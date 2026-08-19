# legacy/ — the Node/Express stack

This is the previous implementation, moved here on 2026-07-23 when the Rust + SvelteKit + Flutter
trunk took over the top level of this repository. **Nothing here is built or run by the current
stack.** It is kept because, at the time of the move, it was still the code serving production.

    server/                     Node/Express API + seed scripts + the DB-as-CMS tooling
    build/                      compiled SvelteKit bundle, HAND-PATCHED (see below)
    pwa/                        the original single-file Nur Al-Quran PWA
    deploy/                     its Docker/Caddy stack (Node)
    docs/                       PROJECT-SUMMARY.md, MIGRATION.md, PHASE-0.md
    nur-al-quran-mushaf.html    byte-identical copy of pwa/index.html
    nur-al-quran-pwa.zip        a third copy, plus the original PWA README
    server.md                   deployment access notes
    .dockerignore               for the Node image

## Why it still matters

At the time of the move this stack was **live at `https://cakna.org`** (`56.69.195.145`) with real
accounts and 59 synced records. The trunk has functional parity — QCXIS SSO, the admin dashboard,
the salvaged Al-Ma'thurat content — but **no cutover has happened**. See the first entry in
[`../DECISIONS.md`](../DECISIONS.md) for the four preconditions before this directory can be
deleted, including the one real blocker: the Ma'thurat sync payload changed shape (v1 → v2) with no
upgrade path, so a naive cutover loses every user's wirid progress.

## Two things that will bite you

**`deploy/docker-compose.yml` no longer works from here.** Its Dockerfile uses `context: ..`, which
used to be the repository root and is now `legacy/`. It expects to find `server/`, `build/` and
`pwa/` as siblings of `deploy/` — which is still true inside `legacy/` — but the compose file itself
must be run from `legacy/deploy/`, and `../.dockerignore` resolves differently. Treat it as a record
of how production was deployed, not as a working command.

**`build/` is hand-patched and unreproducible from here.** It is a copy of the trunk's compiled
output with roughly 107 bytes of manual edits layered on. Those edits have since been ported into
the trunk's source — verified byte-identical — so `build/` has no unique content left. Do not run
`server/sync-frontend.mjs` against it: that tool patches minified literals in place and is now stale
relative to everything.

## What was salvaged into the trunk

- The Doa Rabitah preamble (Arabic + Malay) and the `﴿٣×﴾` repeat marker → `web/src/lib/data/mathurat-master.ts`
- The "Ulang 3 kali" reading hint → `web/src/routes/(tabs)/mathurat/+page.svelte`
- QCXIS SSO → `server/src/auth/sso.rs` (rewritten, with three security fixes)
- The admin dashboard → `server/src/admin.rs` + `web/static/admin.html` (aggregation rewritten)
- The architecture docs → `../docs/`

`docs/` here also holds `PHASE-0.md`, whose git instructions are already done, and which refers to
paths as they were before this move.
