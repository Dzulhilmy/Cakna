# Cakna — web

SvelteKit SPA (Svelte 5 runes + shadcn-svelte + Tailwind v4), built with `@sveltejs/adapter-static`
in fallback mode. See the [root README](../README.md) for the project as a whole.

## Dev

    npm install
    npm run dev        # :5173, proxies /api -> :8787 (see vite.config.ts)

The API must be running for anything beyond the shell to render — Quran text, modules and prayer
times all come from `/api/*`. Start it with `cd ../server && PORT=8787 cargo run --bin cakna`.

## Build

    npm run build      # -> build/

`build/` is git-ignored. The Rust server serves it when `STATIC_DIR` points there; in production
`deploy/docker-compose.prod.yml` bind-mounts it read-only at `/app/static`.

> Because the deploy bind-mounts rather than baking the SPA into the image, a stale or half-written
> `build/` silently serves the wrong frontend. Always `npm run build` before `rsync`.

## Layout

    src/lib/components/ui/     shadcn-svelte primitives
    src/lib/components/        app components: mushaf, chrome, modules
    src/lib/state/             runes-based stores; localStorage under the `cakna:` prefix
    src/lib/quran/             page/juz maps, tajweed, audio URLs
    src/lib/data/              hand-curated content (Al-Ma'thurat master, 46 items)
    src/routes/(tabs)/         the tab-bar routes
    src/routes/read/[page]/    the mushaf reader
    static/admin.html          standalone admin dashboard (no framework, no CDN)

## State and sync

All persisted state lives in localStorage under `cakna:` across 15 keys. Six are conflict-merged
(`bookmarks`, `notes`, `hls`, `read`, `readlog`, `puasa`). Writes debounce ~1.5 s and push to
`PUT /api/sync` when a session cookie is present. The server enforces the same 15-key list as a
CHECK constraint on `user_data`, so an unrecognised key aborts the whole batch.

> The `mathurat` payload is **v2** — `{v2, version, mode, idx, counts, tetapan, rekod}`. v1 values
> (`{d, v, s_pagi, …}`) are replaced with defaults on load, so anyone who synced under a pre-v2
> build loses their Ma'thurat progress. Write a v1→v2 upgrade before shipping this to users who
> already have v1 data.

## Notable

`src/routes/(tabs)/+page.ts` is a **temporary** 307 redirect from `/` to `/mathurat`, added for the
Al-Ma'thurat tracker deployment. Delete that file to restore the real home page.
