# ─────────────────────────────────────────────────────────────────────────────
# Cakna app image: Node (Express) server that serves /api/* AND the compiled
# SvelteKit frontend in build/. Includes the psql client for the one-time
# schema step run by the entrypoint.
#
# Build context is the REPO ROOT (../ from deploy/) — see deploy/docker-compose.yml.
# That lets us COPY server/ build/ pwa/ directly.  Build with:
#     docker compose up -d --build      # from the deploy/ directory
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim

# psql is needed by entrypoint.sh for the `psql -f schema.sql ...` step.
RUN apt-get update \
 && apt-get install -y --no-install-recommends postgresql-client \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1) Install server dependencies first so this layer is cached unless the
#    lockfile changes. (All deps are pure-JS: express, cookie-parser, pg, jose.)
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# 2) App code.
#    - server/ : the Express app, seed scripts, and *.sql
#    - build/  : compiled frontend (served as-is AND patched at runtime by
#                sync-frontend.mjs, so it must be present and writable)
#    - pwa/    : legacy single-file app, the data source for extract.mjs (seed)
COPY server/ ./server/
COPY build/ ./build/
COPY pwa/ ./pwa/

# 3) Entrypoint: waits for DB, guarded init + seed, frontend sync, then server.
COPY deploy/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
