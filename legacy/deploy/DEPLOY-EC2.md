# Deploying Cakna to a single AWS EC2 instance

This guide runs the whole app — PostgreSQL, the Node/Express server (which serves
both `/api/*` and the compiled frontend), and Caddy (automatic HTTPS) — on one
EC2 instance with Docker Compose. The database is seeded automatically on first
boot.

**Architecture**

```
Internet ──► Caddy (80/443, TLS)  ──►  app (Node, :3000)  ──►  postgres (:5432)
             caddy service             app service             postgres service
```

Only ports **80** and **443** are exposed to the world (Caddy). The app and the
database talk over a private Docker network; neither is published to the host.

Everything below is run from the `deploy/` directory unless stated otherwise.

---

## 1. Prerequisites

- **An AWS account** with permission to launch EC2 instances.
- **A domain name** (strongly recommended). HTTPS via Let's Encrypt and QCXIS SSO
  both need a real domain. You will point an **A record** at the instance's
  public IP. (No domain? See the IP-only note in §7 — HTTP only, no SSO.)
- **A registered QCXIS SSO app** (only if you want QCXIS login):
  - Type: **Confidential** (the server exchanges the code with a client secret).
  - Redirect URI: `https://YOURDOMAIN/auth/sso/callback` — must match **exactly**.
  - Scopes: `openid profile email offline_access`.
  - You can register it now with the prod URL, or register `http://localhost:3000/...`
    first and update it to the prod URL after deploy (§7).

---

## 2. Launch the EC2 instance

1. EC2 → **Launch instance**.
2. **AMI:** Ubuntu Server 24.04 LTS (22.04 LTS also fine).
3. **Instance type:** `t3.small` or larger (≥ 2 GB RAM — the one-time seed of
   ~6,236 ayahs is comfortable at 2 GB; `t3.micro` at 1 GB can struggle).
4. **Key pair:** create/download one (you'll SSH with it).
5. **Storage:** ~20 GB gp3 is plenty.
6. **Security group — inbound rules:**

   | Type       | Port | Source            | Why                         |
   |------------|------|-------------------|-----------------------------|
   | SSH        | 22   | **My IP**         | your admin access only      |
   | HTTP       | 80   | `0.0.0.0/0`       | Let's Encrypt + redirect     |
   | HTTPS      | 443  | `0.0.0.0/0`       | the app                     |

   Do **not** open 5432 or 3000 — they stay internal.
7. Launch, then note the instance's **public IPv4 address**.

SSH in:

```bash
ssh -i /path/to/key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## 3. Install Docker + the Compose plugin

On the instance:

```bash
# Docker Engine (official convenience script)
curl -fsSL https://get.docker.com | sudo sh

# Docker Compose v2 plugin (provides `docker compose`)
sudo apt-get update && sudo apt-get install -y docker-compose-plugin

# Run docker without sudo (log out/in afterwards for this to take effect)
sudo usermod -aG docker $USER
newgrp docker      # apply the group in the current shell without re-login

# Verify
docker --version
docker compose version
```

---

## 4. Get the project onto the instance

The image build needs **`server/`, `build/`, `pwa/`, and `deploy/`** all present
under one project root (Caddy/compose config lives in `deploy/`, the Dockerfile
COPYs the other three).

**Option A — git clone** (if the project is in a repo):

```bash
git clone <YOUR_REPO_URL> cakna
cd cakna
```

**Option B — copy from your machine with scp** (run locally, not on the instance):

```bash
scp -i /path/to/key.pem -r /Users/akmalfarhan/Desktop/Mathurat ubuntu@YOUR_EC2_PUBLIC_IP:~/cakna
```

Then on the instance the project root is `~/cakna` and this guide's directory is
`~/cakna/deploy`.

Confirm the four pieces are there:

```bash
cd ~/cakna
ls -d server build pwa deploy      # should list all four
```

---

## 5. Configure

```bash
cd ~/cakna/deploy
cp .env.example .env
nano .env            # or vim/your editor
```

Fill in `.env`:

- `DOMAIN` — e.g. `cakna.example.com` (the exact hostname you'll browse to).
- `POSTGRES_PASSWORD` — a strong random value, e.g. from `openssl rand -base64 24`
  (avoid spaces, quotes, and `@`, since it goes into the DB connection URL).
- `QCXIS_CLIENT_ID`, `QCXIS_CLIENT_SECRET` — from your QCXIS Confidential app.
- `QCXIS_REDIRECT_URI` — `https://YOURDOMAIN/auth/sso/callback` (same domain as above).
- `ADMIN_EMAILS` — your email so you can reach `/admin`, e.g. `you@qcxis.com`.
- Leave `SEED_DEMO=1` to populate the admin dashboard with demo users, or set `0`.
- Leave `COOKIE_SECURE=1` (required for HTTPS in production).

`.env` holds secrets — it is git-ignored and never baked into the image.

---

## 6. DNS (do this before launching, so Caddy can get a certificate)

Create an **A record** at your DNS provider:

```
YOURDOMAIN  ->  A  ->  YOUR_EC2_PUBLIC_IP
```

Wait until it resolves (can take a few minutes). Check from your laptop:

```bash
dig +short YOURDOMAIN         # should print YOUR_EC2_PUBLIC_IP
```

Caddy cannot obtain a TLS certificate until the domain resolves to this instance
and ports 80/443 are reachable.

---

## 7. Launch

From `~/cakna/deploy`:

```bash
docker compose up -d --build
```

This builds the app image, starts `postgres`, `app`, and `caddy`. On the very
first boot the app container runs a **one-time** DB init + seed (schema, then
`extract` → `seed` → `seed-modules` → `seed-mathurat` → `seed-frontend-data` →
`seed-demo`), then syncs the bundled frontend data. Watch it:

```bash
docker compose logs -f app
```

You're ready when you see the seed lines followed by:

```
==> Starting Cakna server on port 3000
Cakna server on http://localhost:3000
```

Certificate provisioning is visible in Caddy's logs:

```bash
docker compose logs -f caddy      # look for "certificate obtained successfully"
```

Check status any time:

```bash
docker compose ps
```

---

## 8. Verify

- `https://YOURDOMAIN` — the app loads (padlock/valid TLS).
- `https://YOURDOMAIN/login` — the login page; the "Log in with QCXIS" button is
  active when the QCXIS creds are set.
- `https://YOURDOMAIN/admin` — redirects to `/login` unless your email is in
  `ADMIN_EMAILS` (or your user has `is_admin=true`), in which case the dashboard
  loads.

A few `/api` smoke checks:

```bash
curl -s https://YOURDOMAIN/api/config | head -c 200
curl -s https://YOURDOMAIN/api/surahs/1 | head -c 200
```

---

## 9. Post-deploy tasks

### Point QCXIS at the production URL
In the QCXIS console, make sure the SSO app's redirect URI is **exactly**
`https://YOURDOMAIN/auth/sso/callback` (this must match `QCXIS_REDIRECT_URI` in
`.env`). Any mismatch → login fails.

### Make yourself an admin
Add your email to `ADMIN_EMAILS` in `.env`, then recreate the app container so it
picks up the new environment (no rebuild needed):

```bash
docker compose up -d          # recreates `app` because its env changed
```

### Edit content later
PostgreSQL is the source of truth; the bundled frontend data in `build/` is
regenerated from it by `sync-frontend.mjs`. After changing content in the DB, run:

```bash
# example: change an interface string, then re-sync the bundle
docker compose exec -T postgres psql -U cakna -d cakna \
  -c "UPDATE i18n SET ms='...' WHERE key='...';"
docker compose exec app sh -c 'cd server && node sync-frontend.mjs'
```

(`sync-frontend.mjs` also runs automatically on every container start.)

### Back up the database

```bash
docker compose exec -T postgres pg_dump -U cakna cakna > backup.sql
```

Restore into a fresh DB:

```bash
cat backup.sql | docker compose exec -T postgres psql -U cakna -d cakna
```

### Update the app
Pull the new code (or re-`scp`), then rebuild and restart:

```bash
cd ~/cakna && git pull          # or re-copy the folder
cd deploy
docker compose up -d --build
```

Your data is safe in the `pgdata` volume; because the DB already has data, the
one-time init is skipped and only `sync-frontend.mjs` re-runs.

### Stop / start

```bash
docker compose stop             # stop (keeps volumes/data)
docker compose start            # start again
docker compose down             # stop + remove containers (volumes kept)
# docker compose down -v        # DANGER: also deletes the DB volume
```

---

## 10. Alternative: managed PostgreSQL (AWS RDS)

To use RDS instead of the bundled `postgres` container:

1. Create an RDS **PostgreSQL** instance; create a database named `cakna` and a
   user. Put its security group / rules so the EC2 instance can reach it on 5432.
2. In `deploy/docker-compose.yml`:
   - Delete the whole `postgres:` service and the `pgdata` volume.
   - In the `app` service, remove the `depends_on: postgres` block, and change
     `DATABASE_URL` to your RDS endpoint **with SSL**:
     ```yaml
     environment:
       DATABASE_URL: postgres://USER:PASSWORD@YOUR-RDS-ENDPOINT:5432/cakna?sslmode=require
       PGSSL: "1"
       COOKIE_SECURE: "${COOKIE_SECURE:-1}"
       PORT: "3000"
     ```
     `?sslmode=require` makes both `psql` (seed step) and the app's `pg` client
     use TLS; `PGSSL=1` is the app's explicit SSL switch.
3. `docker compose up -d --build`. The entrypoint still runs the one-time seed —
   now against RDS.

---

## 11. Troubleshooting

**Caddy can't get a certificate / HTTPS doesn't come up**
- `dig +short YOURDOMAIN` must return this instance's public IP (DNS propagated).
- Security group must allow inbound **80 and 443** from `0.0.0.0/0`.
- `DOMAIN` in `.env` must be the exact hostname you're browsing to.
- Inspect: `docker compose logs caddy`.

**Login page says SSO is unconfigured** (`/login?sso=unconfigured`)
- `QCXIS_CLIENT_ID` / `QCXIS_CLIENT_SECRET` are blank in `.env`. Fill them, then
  `docker compose up -d` to recreate the app container.

**QCXIS login fails after the consent screen** ("Log masuk QCXIS gagal")
- `QCXIS_REDIRECT_URI` in `.env` must match the URI registered in QCXIS **exactly**
  (scheme, host, and the `/auth/sso/callback` path).

**Logged in but the session doesn't stick / immediately logged out**
- Over HTTPS, `COOKIE_SECURE` must be `1` and you must visit `https://` (not `http://`).
- If you're using the IP-only `:80` Caddy block for testing, set `COOKIE_SECURE=0`
  in `.env` and `docker compose up -d` (Secure cookies aren't sent over plain HTTP).

**App container keeps restarting / seed errors**
- `docker compose logs app`. A failed one-time seed leaves the DB partially
  populated; to retry from scratch (this **deletes DB data**):
  ```bash
  docker compose down -v && docker compose up -d --build
  ```

**Where's the data?**
- In the `pgdata` Docker volume (`docker volume ls`). It survives
  `docker compose down` (without `-v`), rebuilds, and app updates.
```
