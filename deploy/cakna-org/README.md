# Halaqah + LiveKit on cakna.org — one vessel

Deploy the new **Rust (Axum) + SvelteKit** app *and* self-hosted **LiveKit** under
the **single hostname `cakna.org`** — no `live.*` or `baru.*` subdomains — while the
legacy container and database stay intact and rollback stays one edit away.

## Architecture (proven, not assumed)

```
                    ┌──────────── existing Caddy (owns :80/:443, cakna.org cert) ─────────┐
  cakna.org/rtc*  ──┤  → host.docker.internal:7880   LiveKit signalling (WebSocket)        │
  cakna.org/*     ──┤  → api:8080                    new Rust API + SvelteKit SPA          │
                    └─────────────────────────────────────────────────────────────────────┘
   audio media bypasses Caddy entirely, straight to the host:
     UDP 50000-50200 (main) · TCP 7881 (fallback) · UDP 3478 TURN → relayed UDP 30000-30200
```

The `/rtc` path-split was verified against a real Caddy + LiveKit locally:
`/rtc/validate` and the WebSocket **upgrade** both reach LiveKit (401 without a
token — i.e. LiveKit answered), while every other path hit the app. The
LiveKit browser client takes `LIVEKIT_URL` and appends `/rtc`, so
`LIVEKIT_URL=wss://cakna.org` → `wss://cakna.org/rtc`. Nothing in the app claims
`/rtc`.

## What one-vessel removes

Collapsing onto `cakna.org` erases three prerequisites the subdomain plan needed:

| Subdomain plan needed | One vessel |
|---|---|
| DNS A records for `live.` + `baru.` | **none** — `cakna.org` already resolves |
| a second TLS cert for `live.` | **none** — the `cakna.org` cert covers it |
| QCXIS re-registration for the new host | **none** — same host + same `/auth/sso/callback` path; reuse the legacy client, all SSO users work immediately |

## The one trade-off

There is **no public staging** — editing the Caddyfile *is* the cutover to
production. Mitigations: verify the new stack internally on the box before the
flip (step 5), and keep the legacy `cakna.org` block commented for an instant
one-edit rollback (step 7). The legacy container never stops.

## Server state (inventoried, resized ✓)

`56.69.195.145` — 2 vCPU, **1.9 GB RAM**, **28 GB disk (24% used)**. Compose
project `cakna` at `/home/ubuntu/cakna/deploy/` runs `caddy` + `app` (legacy
Express, internal :3000) + `postgres` (db `cakna`). The new services join that
project.

---

## Prerequisites (only two are yours now)

1. **AWS security-group inbound rules** — media does not pass through Caddy:

   | Protocol | Port range | Source |
   |---|---|---|
   | UDP | **50000–50200** | 0.0.0.0/0 |
   | TCP | **7881** | 0.0.0.0/0 |
   | UDP | **3478** | 0.0.0.0/0 |
   | UDP | **30000–30200** | 0.0.0.0/0 |

   (80/443 already open; leave 7880/8080 closed — Caddy proxies them.) I cannot
   read the SG from here; the real check is step 6's `nodeIP` + a two-device call.

2. **The amd64 API image** — the server can't compile Rust. Build it on GitHub's
   native amd64 runners via [.github/workflows/build-api.yml](../../.github/workflows/build-api.yml):
   Actions → **Build API image → Run**, download the `cakna-api-amd64` artifact.

No DNS, no cert, no QCXIS changes.

## 3. Ship image, frontend, config

```bash
scp -i ~/.ssh/Cakna.pem ~/Downloads/cakna-api-amd64.tar.gz ubuntu@56.69.195.145:~/
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'gunzip -c ~/cakna-api-amd64.tar.gz | sudo docker load && rm ~/cakna-api-amd64.tar.gz'
```

```bash
cd "/Users/dzulhilmy/Cakna Project/web" && npm run build
rsync -az -e "ssh -i ~/.ssh/Cakna.pem" web/build/ ubuntu@56.69.195.145:~/cakna/web-build/
scp -i ~/.ssh/Cakna.pem deploy/cakna-org/docker-compose.halaqah.yml deploy/livekit.yaml ubuntu@56.69.195.145:~/cakna/deploy/
```

Append LiveKit creds to the existing `~/cakna/deploy/.env` (never overwrite it —
it holds `POSTGRES_PASSWORD`, the QCXIS secrets, `DOMAIN`):

```
LIVEKIT_API_KEY=<openssl rand -hex 16>
LIVEKIT_API_SECRET=<openssl rand -hex 32>
LIVEKIT_URL=wss://cakna.org
```

`livekit.yaml` must have `use_external_ip: true` (the shipped one does); if
`nodeIP` later resolves private, pin `rtc: external_ip: 56.69.195.145`.

## 4. New database + start the new services (legacy untouched)

```bash
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cd ~/cakna/deploy && sudo docker compose exec -T postgres createdb -U cakna cakna_rust'
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cd ~/cakna/deploy && sudo docker compose -f docker-compose.yml -f docker-compose.halaqah.yml up -d api livekit'
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cd ~/cakna/deploy && sudo docker compose -f docker-compose.yml -f docker-compose.halaqah.yml exec -T api seed'
```

## 5. Verify internally, before the flip

```bash
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cd ~/cakna/deploy && sudo docker compose exec -T caddy wget -qO- http://api:8080/api/meta | head -c 80; echo; sudo docker compose logs livekit | grep -i nodeIP'
```

`/api/meta` should return JSON; `nodeIP` must be the **public** address.

## 6. Migrate the data (fresh dump — live has drifted to 15 users)

Legacy DB is only read. See [../migrate/README.md](../migrate/README.md).

```bash
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cd ~/cakna/deploy && sudo docker compose exec -T postgres psql -U cakna -d cakna' < deploy/migrate/audit-production.sql
```

Then `run-migration.sh` with `LEGACY_URL=…/cakna`, `TARGET_URL=…/cakna_rust`.

## 7. Flip Caddy — the cutover

Back up, then replace the `cakna.org` block with the one from
[Caddyfile.snippet](Caddyfile.snippet) (keep the old block commented above it):

```bash
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cp ~/cakna/deploy/Caddyfile ~/cakna/deploy/Caddyfile.pre-halaqah.bak'
# ...edit ~/cakna/deploy/Caddyfile...
ssh -i ~/.ssh/Cakna.pem ubuntu@56.69.195.145 'cd ~/cakna/deploy && sudo docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile && sudo docker compose restart caddy'
```

Then the real test: `https://cakna.org` serves the new app, and **two people on
two devices / two networks** confirm halaqah audio.

**Rollback (instant):** restore `Caddyfile.pre-halaqah.bak` and
`docker compose restart caddy` — back to legacy Express. The legacy container,
files, and `cakna` database were never touched.

## What is preserved

- `cakna-app-1` (legacy) keeps running; `cakna` database is read-only to this work (new stack uses `cakna_rust`).
- `caddy_data` is untouched — the existing cakna.org certificate survives.
- `~/cakna/build` (legacy frontend) untouched; the new SPA lives in `~/cakna/web-build`.

## Known gaps that survive this deployment

- Same account on two devices kicks itself out of a room (`DUPLICATE_IDENTITY`).
- A full page reload drops the call.
- `web/static/admin.html` is 0 bytes — the new admin dashboard renders blank until it has content.
- Single LiveKit node, no Redis — fine for a study circle.
