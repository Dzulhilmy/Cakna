# Decisions

Short records of choices that are expensive to reverse or easy to re-litigate.

---

## 2026-07-23 — The Node/Express stack is superseded but NOT yet decommissioned

**Status:** decided · **Blocked on:** a production cutover

`~/Cakna Project` (Node/Express + a hand-patched copy of this repo's compiled `web/build`) is
**currently serving production** at `https://cakna.org` → `56.69.195.145`, with real accounts and
59 synced records. This repo now has everything that deployment does — QCXIS SSO, the admin
dashboard, the salvaged Ma'thurat content — but nothing has been cut over.

**It must not be deleted yet.** Deleting it before a cutover removes the only running production
system. Retire it only after:

1. Production user data is migrated into this schema. The two schemas differ substantially:
   `serial` vs `uuid` ids, `sync_data` (unconstrained keys) vs `user_data` (15-key CHECK). Audit
   `SELECT DISTINCT key FROM sync_data` first — one unrecognised key aborts the whole load.
2. DNS moves, or this stack is deployed to `56.69.195.145`.
3. `cakna.qcxis.com` is fixed — it currently CNAMEs to `cakna.org`, whose Caddy holds a certificate
   for `cakna.org` alone, so that hostname fails its TLS handshake outright.
4. A backup is confirmed restorable. `~/cakna-backups/cakna-PROD-cakna.org-2026-07-23.sql`
   (6.5 MB) is verified row-for-row against live.

Also note: the Ma'thurat sync payload changed shape (v1 → v2) in this repo without an upgrade path,
so a naive cutover loses every user's wirid progress. Write that migration before moving anyone.

---

## 2026-07-23 — The 46-item Al-Ma'thurat dataset is canonical

**Status:** decided · **Supersedes:** the 28-item `mathurat_items` table as a content source

### Context

Two datasets in this repo are both called "mathurat", and they share **zero field names**:

| | `mathurat_items` (28) | `MASTER` (46) |
|---|---|---|
| Location | `server/migrations/0003_modules.sql`, `app/assets/data/mathurat.json` | `web/src/lib/data/mathurat-master.ts` |
| Read by | Rust API (`content/routes.rs:308`), Flutter (`app/lib/data/mathurat_repo.dart`) | Web (`web/src/routes/(tabs)/mathurat/+page.svelte`) |
| Origin | extracted from `sample/pwa/index.html` | hand-curated |
| Repeat model | `repeat_n` / `repeat_full` | `reps.s` / `reps.k` |
| Arabic | `arabic`, `arabic_pagi`, `arabic_petang` | `ar` (string or `{pagi,petang}`) |
| Meaning | `meaning_ms` / `meaning_en` | `bm` / `bi` |
| Transliteration | ✗ | `rumi` — all 46 items |
| Tajweed | ✓ — 15 items | ✗ |
| Quran references | `quran_ref` | ✗ |
| Notes / type | `core` (bool) | `info`, `jenis` (`quran`/`zikir`/`doa`) |

### Decision

**The 46-item `MASTER` dataset is canonical.** `mathurat_items` is demoted from a content source
to, at most, an enrichment source for tajweed.

### Why

1. **Production already serves the 46.** `cakna.org` serves the `mathurat` table (46 rows), and as
   of 2026-07-23 real users' synced progress is recorded against that structure. Switching them to
   a 28-item wirid would silently change what people read.
2. **The entire progress model depends on the Sughra/Kubra split**, which only the 46 expresses.
   Sughra = 32 items / 70 repetitions and Kubra = 46 items / 207 repetitions are derived by summing
   `reps.s` and `reps.k`. `repeat_n` / `repeat_full` cannot represent two versions of one wirid.
3. **The web app — the frontend of the target stack — already uses it**, and it is now verified
   byte-for-byte identical to production content (see the Doa Rabitah salvage, 2026-07-23).
4. **It is strictly richer on the fields that matter for reading**: transliteration for all 46
   items, per-item notes, and a content-type classification. The 28 has none of these.

### What this costs

The 28 holds two things the 46 does not, and they are genuinely lost unless carried across:

- **Tajweed colouring** for 15 items. Recoverable later by matching on Arabic text, or by joining
  through `quran_ref` to the `ayahs` table, which already carries tajweed for all 6,236 verses.
- **`quran_ref`**, which lets Quranic items render from the Quran tables rather than from an
  embedded copy. Worth re-deriving during the schema migration.

Neither blocks the decision; both are additive follow-ups.

### Work this implies (not yet done)

- A migration replacing `mathurat_items` with a 46-row table in the `MASTER` shape.
- `server/src/seed/mod.rs` — the INSERT at line 230 and the hard assertion `("mathurat_items", 28)`
  at line 266 both change. **The assert will fail loudly until updated**, which is the desired
  behaviour: it is a tripwire, not an obstacle.
- `server/src/content/routes.rs:308-312` — the `"mathurat"` query.
- Flutter: `app/lib/data/mathurat_repo.dart` and `app/lib/data/models.dart` move to the new shape;
  `app/assets/data/mathurat.json` is regenerated from `MASTER`.

Until that lands, **web and Flutter show different wirid content**. That divergence exists today —
this decision names it and fixes the direction, rather than introducing it.

### Open: the `ibadah` prose needs a human comparison

Not decided — flagged so it is not lost when `~/Cakna Project` is deleted.

Both projects carry a hand-written Shafi'i ibadah guide, and the step counts differ **in both
directions**. Production (`cakna.org`) currently serves the left-hand column:

| Section | `Cakna Project/server/content/ibadah.mjs` (live) | `data/extracted/ibadah.json` (trunk) |
|---|---|---|
| wuduk | **14** | 10 |
| solat | **17** | 12 |
| tayammum | **7** | 6 |
| umrah | 8 | **12** |
| haji | **10** | 8 |

Neither is a superset. Choosing which wuduk or solat steps to keep is a fiqh-content decision, so
it needs someone qualified to read both — it is deliberately **not** merged here. The trunk's
version has the advantage of carrying real Arabic + tajweed from the extractor; the live version has
more detail in four of five sections.

`mengaji` is the easier case: the trunk has **29** hijaiyah letters and `mg_sound` entries against
the live version's **28** — consistent with the trunk including lam-alif (لا). The trunk is very
likely correct; confirm and keep it.

### Note on the Flutter app

`app/lib/state/mathurat_state.dart` persists progress to a device-local `SharedPreferences` key
(`mathurat_progress`), not to the `mathurat` sync key. So app-side progress has no cloud backup and
is unaffected by the web's v1→v2 shape change — but it also will not survive a reinstall. Separate
issue, recorded here so it is not rediscovered as a side effect of this migration.
