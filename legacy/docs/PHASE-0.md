# Phase 0 — Secure `~/qcx-cakna` before anything else

Every command here is **yours to run** — you asked to keep git in your hands. I have run none of
them. Work top to bottom; the order matters.

Context: [`MIGRATION.md`](MIGRATION.md). The situation: ~3 weeks of work (2026-07-08 → 07-22) exists
in exactly one place — **no git remote, no stashes** — buried under 1,267 phantom mode changes from
a tree-wide `chmod`.

---

## Step 1 — Silence the mode noise (do this first)

```bash
cd ~/qcx-cakna && git config core.fileMode false
```

I measured the effect with a non-persistent `-c` override: this takes `git status` from **1,312
entries to 95** — 51 modified, 33 untracked, 11 deleted. Until you run it, `git add -A` would bake
1,267 useless mode flips into history, and any `git stash` / `git checkout .` / `git clean` would
silently take your real work with it.

Confirm — should print `95`:

```bash
cd ~/qcx-cakna && git status --porcelain | wc -l
```

---

## Step 2 — Commit in six chunks

Grouped so each commit is revertible on its own. I verified these groups against the real 95
entries: **all 95 covered, nothing left over.**

### 2a. Server — live Al-Ma'thurat presence + account deletion  *(7 files)*

```bash
cd ~/qcx-cakna && git add server/src/mathurat.rs server/src/lib.rs server/src/auth/routes.rs server/src/state.rs server/src/solat.rs server/Cargo.toml server/Cargo.lock && git commit -m "Live Al-Ma'thurat presence (SSE) + DELETE /api/account"
```

`server/src/mathurat.rs` is untracked — it's the SSE presence hub. `lib.rs` registers
`/mathurat/live`, `/mathurat/presence`, `/mathurat/leave` and `delete(/account)`.

### 2b. Web — Al-Ma'thurat v2 rewrite  *(5 files)*

```bash
cd ~/qcx-cakna && git add web/src/lib/data/mathurat-master.ts "web/src/routes/(tabs)/mathurat/+page.svelte" "web/src/routes/(tabs)/mathurat/+page.ts" web/src/lib/state/stores.svelte.ts web/src/lib/components/modules/MathuratCard.svelte && git commit -m "Al-Ma'thurat v2: single-item counter, per-version progress, daily rekod"
```

`+page.svelte` is **+826/−156**, plus the untracked 78 KB `mathurat-master.ts` (46 hand-curated
items), and deletions of `MathuratCard.svelte` and the old `+page.ts`.

> ⚠️ This commit carries the **incompatible sync-shape change**: v1 `{d,v,s_pagi[],s_petang[],…}` →
> v2 `{v2,version,mode,idx,counts,tetapan,rekod}`. The code comment says v1 values are *"digantikan
> dengan lalai semasa migrasi"*. **Anyone who synced Ma'thurat progress under the deployed build
> loses it on first load.** Commit it now to make it safe; write the v1→v2 upgrade path before you
> deploy it.

### 2c. Web — the temporary home redirect, on its own  *(1 file)*

```bash
cd ~/qcx-cakna && git add "web/src/routes/(tabs)/+page.ts" && git commit -m "SEMENTARA: redirect / -> /mathurat (delete this file to restore the home page)"
```

Deliberately isolated. The file is marked `SEMENTARA (2026-07-10)` and makes the real home page
unreachable — you'll want to revert exactly this and nothing else.

### 2d. Flutter — app source  *(56 files)*

```bash
cd ~/qcx-cakna && git add app/lib app/pubspec.yaml app/pubspec.lock && git commit -m "Cakna app: prayer widget, audio downloads, tafsir, per-reciter audio, JAKIM zones"
```

32 modified + 3 deleted + 19 untracked Dart files. The untracked ones are the substantive new work:
`reciters.dart`, `timing_repo.dart`, `audio_downloads_screen.dart`, `progress_screen.dart`,
`quick_access_picker.dart`, `quran_settings_screen.dart`, `tajweed_guide_screen.dart`,
`prayer_widget_service.dart`, `solat_service.dart`, `tafsir_service.dart`, `audio_downloads.dart`,
`hijri.dart`, `jakim_zones.dart`, `note_text.dart`, `ayah_marker.dart`, `cakna_bottom_nav.dart`,
`share_ayah.dart`, `tab_scaffold.dart`, `translation_page.dart`.

### 2e. Flutter — asset pipeline + Android/iOS platform  *(25 files)*

```bash
cd ~/qcx-cakna && git add app/tool app/assets app/android app/ios && git commit -m "Cakna app: Android home-screen prayer widget, azan sounds, bundled asset pipeline"
```

`bundle_assets.sh` plus the 6 now-bundled `app/assets/data/*.json` deletions; the untracked
`PrayerWidgetProvider.kt`, widget layouts/drawables/styles, and `azan2`/`azan3` in both
`res/raw` and `ios/Runner`.

### 2f. Tooling  *(1 file)*

```bash
cd ~/qcx-cakna && git add tools/fix_quran_db.sh && git commit -m "Quran juz-boundary correction script"
```

> This file is **untracked** despite its own header describing itself as "the committed record" of
> 8 juz-boundary corrections. It has never actually been committed.

Confirm nothing is left — this should print nothing:

```bash
cd ~/qcx-cakna && git status --porcelain
```

> **Not in any commit above, because they are not actually changed:** `README.md`, `.gitignore`,
> `app/README.md`, `app/RELEASE.md`, `app/store/`, `brand/`, `sample/`, `web/static/favicon.png` and
> the ~600 other `app/assets` files. They appeared in `git diff` only because of the `chmod`, and
> Step 1 makes them vanish. Don't add them.

---

## Step 3 — Get it off this disk

The step that actually removes the risk. Create an empty **private** repo, then:

```bash
cd ~/qcx-cakna && git remote add origin <YOUR_REPO_URL> && git push -u origin main
```

**Secrets check — I verified this, and it is clean.** Nothing sensitive is tracked, and nothing
sensitive would be swept in by the commands above:

| File | Status |
|---|---|
| `server/.env` | ignored — `.gitignore:6` |
| `app/android/app/cakna-upload.jks` | ignored — `app/android/.gitignore:14` (`**/*.jks`) |
| `app/android/key.properties` | ignored — `app/android/.gitignore:12` |
| any other `.env` / `.jks` / `.keystore` / `.pem` / `.p12` | none tracked |

---

## Step 4 — Database backup

✅ **Done** — this isn't a git operation, so I took it:

```
~/cakna-backups/cakna-local-2026-07-23.sql   (21 KB, 17 tables)
```

That is the **local** `cakna` database (4 users, 5 sessions, content tables empty). The
**production** database on `56.68.66.106` is a separate volume and is **not** backed up:

```bash
ssh ubuntu@56.68.66.106 'cd ~/cakna-app && docker compose -f deploy/docker-compose.prod.yml exec -T postgres pg_dump -U cakna cakna' > ~/cakna-backups/cakna-prod-2026-07-23.sql
```

Do that before any deploy in this migration. Never `docker compose down -v`.

---

## Rules for the rest of the migration

1. **Never run anything from `Cakna Project/server` without an explicit `DATABASE_URL`** pointing somewhere other than `cakna`. `schema.sql:2` drops the live `users`/`sessions` and CASCADEs into `user_data`, `ayah_translations`, `ayah_transliterations`, `ayah_words`.
2. **Never run `sync-frontend.mjs` again.** It patches a compiled bundle that a rebuild re-hashes anyway, and it is stale relative to the bundle it last touched.
3. **Don't delete `~/Cakna Project` yet.** Four things exist only there: the Doa Rabitah edit (inside the patched bundle), `PROJECT-SUMMARY.md`, the `.dockerignore`, and the `.orig2` records. Salvage in Phase 2, delete in Phase 6.
4. **Decide the 46-vs-28 Ma'thurat question** before touching either dataset — `mathurat-master.ts` has 46 hand-curated items, `mathurat_items` has 28 sample-extracted ones, and `seed/mod.rs` hard-asserts 28.

---

## When Step 3 is done

Tell me and I'll start Phase 1: prove the trunk builds and deploys clean — add `.dockerignore`,
`npm run build`, `cargo build --release`, seed against a scratch DB, build the prod image. That's
what establishes the Express server is genuinely redundant, which is the precondition for deleting
it.
