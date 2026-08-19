# What ships, what stays, what was removed

Reference for keeping the deployment lean. Written 2026-07-24, after a cleanup
that took the working tree from **11.3 GB to 714 MB**.

Nothing here touches the database. `deploy/.env` is server-only and is never
copied, built, or backed up from this machine.

---

## 1. What the deployment actually needs

Everything else is noise. From `deploy/Dockerfile.api` and `docker-compose.prod.yml`:

| Path | Why | How it gets there |
|---|---|---|
| `server/` | the Rust crate | `COPY server/` — rebuilt inside the image |
| `data/extracted/` | seed content (13 MB) | `COPY data/extracted` |
| `deploy/` | compose, Caddyfile, livekit.yaml, Dockerfile | read from the checkout |
| `web/build/` | the compiled SPA | **bind-mounted** `../web/build:/app/static:ro` |

`web/build` is the trap: it is bind-mounted rather than baked into the image, so
a stale or missing build silently serves the wrong frontend. **Always
`npm run build` before deploying.**

---

## 2. Removed from the working tree

All regenerable. Each row rebuilds with one command.

| Removed | Size | Regenerate with |
|---|---|---|
| `server/target/` | 8.2 GB | `cd server && cargo build --release` |
| `app/build/` | 2.1 GB | `cd app && flutter build apk` |
| `web/node_modules/` | 180 MB | `cd web && npm install` |
| `app/.dart_tool/` | 99 MB | `cd app && flutter pub get` |
| `app/android/.gradle/` | 30 MB | next Gradle build |
| `web/.svelte-kit/` | 5.7 MB | `cd web && npm run build` |
| `app/ios/Pods/` | 1.4 MB | `cd app/ios && pod install` |
| `.DS_Store` × 10 | — | — |

**Verified, not assumed:** `npm install && npm run build` and
`cargo build --release` were both re-run from empty after deletion.

Backups taken first, in `~/cakna-backups/`:

- `CaknaProject-PRE-CLEANUP-2026-07-24.tgz` — 348 MB, all source excluding caches; integrity-checked and spot-restored
- `cakna-git-2026-07-24.bundle` — 19 MB, full git history

---

## 3. Kept locally, excluded from the deployment

Real work or real dependencies — not shipped, not deleted. Excluded via
`.dockerignore` (Docker build context) and the rsync excludes below.

| Kept | Size | Why it stays |
|---|---|---|
| `Tilawah/` | 398 MB | source data for the word-by-word extraction — `tools/extract/verify.mjs` and `extract-words.mjs` read `Tilawah/extracted/.../quran.db`. Delete it and re-extraction breaks. |
| `app/` | 225 MB | the Flutter client — not part of the web deployment |
| `legacy/` | 27 MB | the Node/Express stack — **still what serves production** until the cutover |
| `sample/` | 13 MB | the original single-file PWA; the extraction pipeline's source |
| `brand/`, `docs/`, `tools/` | ~1.5 MB | assets, documentation, extraction scripts |

`.dockerignore` was stale — it predated the consolidation and did not exclude
`legacy/` or `docs/`. Both are now excluded, along with `*.md`.

---

## 4. Deploying

```bash
cd web && npm run build
```

```bash
rsync -az --delete \
  --exclude server/target --exclude node_modules --exclude .git \
  --exclude app --exclude Tilawah --exclude legacy --exclude sample \
  --exclude .svelte-kit --exclude .dart_tool --exclude .DS_Store \
  --exclude deploy/.env \
  . ubuntu@<SERVER>:~/cakna-app/
```

**Keep `--exclude deploy/.env`.** That file exists only on the server; syncing
over it destroys the production credentials, including the database password.

For LiveKit specifically — DNS, firewall ports, credentials — see
[LIVEKIT-DEPLOY.md](LIVEKIT-DEPLOY.md).

---

## 5. Not touched

- **The database.** No dump, migration, or schema change was part of this cleanup. Local `cakna` and the production volume are both untouched.
- **`deploy/.env`** on the server.
- **`legacy/`**, which is still serving production.

One repair was made along the way: `legacy/pwa/index.html` was found truncated to
0 bytes and was restored from `legacy/nur-al-quran-mushaf.html` (identical
content, verified by md5 against `sample/pwa/index.html`).
