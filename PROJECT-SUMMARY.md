# Cakna — project summary

> Status snapshot, 2026-07-24. For build and configuration detail see [README.md](README.md);
> for the consolidation history see [MIGRATION.md](docs/MIGRATION.md) and [DECISIONS.md](DECISIONS.md).

---

## 1. What Cakna is

A Malay-first Islamic companion app for Malaysian Muslims. At its core, a 604-page digital
**Mushaf Madani** with coloured tajweed, three translations (MS/EN/ID), romanised transliteration
and qari audio. Around it, ~20 modules:

| | |
|---|---|
| **Quran** | reader, search, surah/juz index, bookmarks, notes, khatam tracker |
| **Worship** | prayer times (JAKIM zones), qibla, **Al-Ma'thurat** wirid, Surah Yasin, du'as |
| **Dhikr** | tasbih counter, daily dhikr, Asmaul Husna |
| **Learning** | "Asas Mengaji" hijaiyah quiz, Shafi'i ibadah guide |
| **Utilities** | qada-puasa log, zakat calculator, settings, export/import |
| **Halaqah** | moderated group audio rooms with a shared screen *(new)* |

Guest-first: everything works signed out; an account syncs state across devices. This deployment is
run as an **organisational Al-Ma'thurat tracker** — post-login lands on `/mathurat`, and the admin
dashboard measures wirid completion per member.

---

## 2. Stack

| Layer | Technology | State |
|---|---|---|
| Backend | Rust (Axum + SQLx), PostgreSQL 16 | 21 files · 5,508 lines · 33 routes · 11 migrations |
| Web | SvelteKit 2 / Svelte 5 runes, shadcn-svelte, Tailwind 4 | 22 routes |
| Mobile | Flutter (Android + iOS) | 57 files · Play Store prepped |
| Realtime | **LiveKit** (self-hosted SFU) | audio rooms + shared screen · production config built, **not deployed** |

All four items in the declared stack are now present — LiveKit was the last gap.

---

## 3. Halaqah — group audio rooms

The feature built most recently, and the one that completes the stack.

**Model.** An admin opens a room and is its **host**. Any signed-in user may join and listen. The
host designates **one participant at a time** to hold the microphone. That participant and the host
may publish audio; everyone else subscribes. Rooms have **no time limit** — they end when the host
closes them.

**Shared screen.** The room broadcasts a *description of a view*, never pixels:

| Share kind | Rendered as |
|---|---|
| `page` | the mushaf page, inline, in each viewer's own font size and translation |
| `mathurat` | the wirid item, inline, read-only |
| `route` | a destination card — "Pembaca sedang membuka Al-Ma'thurat → Ikut ke sana" |
| `null` | sharing stopped |

Chosen over screen sharing deliberately: a page turn costs a few bytes instead of ~1–2 Mbps, Arabic
stays crisp instead of being scaled video, and each participant keeps their own settings.

**Minimise.** The session lives in a module-level store, not the room page, so navigating away keeps
the call alive. A persistent bar (like the existing MiniPlayer) shows who is reciting and what page
they are on. Participants can browse the mushaf, Al-Ma'thurat or anything else while listening, and
tap the bar to return — the live session is reused, never reconnected.

**Follow / unfollow.** Views track the reciter by default. Anyone can browse away and snap back with
"⤺ Kembali ke halaman pembaca".

---

## 3a. LiveKit — production deployment (built, not deployed)

Audio works locally today. Making it work **between devices** is an infrastructure task, and the
config for it is now written and validated: [`deploy/livekit.yaml`](deploy/livekit.yaml),
the `livekit` service in [`docker-compose.prod.yml`](deploy/docker-compose.prod.yml), a second Caddy
site for `wss://`, and the runbook in [`deploy/LIVEKIT-DEPLOY.md`](deploy/LIVEKIT-DEPLOY.md).

**What changed from the dev container**

| | Dev (works on one Mac) | Production |
|---|---|---|
| ICE address | `node_ip: 127.0.0.1` — fatal across devices | `use_external_ip: true` (STUN-discovered) |
| Signalling | `ws://localhost:7880` | `wss://live.<domain>` via Caddy |
| Media | single UDP port | UDP 50000–50200, TCP 7881 fallback |
| Restrictive networks | nothing | embedded TURN on 3478 + relay 30000–30200 |
| Networking | Docker NAT | `network_mode: host` — Docker NAT rewrites the source addresses ICE depends on |

**Validated, not assumed.** `docker compose config` parses; `caddy validate` passes; and the LiveKit
image was booted against this exact config — TURN starts on 3478 with the pinned relay range, TCP
7881 binds, and `nodeIP` resolves to a public address.

That run also surfaced two things worth keeping:

- **TURN needs a second port range.** LiveKit relays each stream on a *separate* port (default 30000–40000, pinned here to 30000–30200). Missing it means TURN accepts the allocation and then has nowhere to send audio — so precisely the users who need TURN still cannot be heard. This came from reading LiveKit's boot log, not the docs.
- **A scary-looking warning is benign.** `could not validate external IP` appears even when LiveKit then adopts the correct public address. The rule is: **read `nodeIP`, not the warning.** Only a private `nodeIP` is fatal.

**Three things still need a human** — DNS records for `live.<domain>`, the AWS security-group rules
above, and credentials in `deploy/.env`. Until then the app runs fine and reports
`livekit_configured: false`; the halaqah page says the voice server is not set up rather than
failing obscurely.

---

## 4. Security posture

Fixed during the Node → Rust port, each a real defect in the superseded implementation:

| | Before | Now |
|---|---|---|
| OIDC nonce | conditional — an id_token omitting it passed | checked unconditionally |
| SSO email linking | any matching address adopted the account | requires `email_verified` |
| PKCE/state store | in-process `Map` — lost on restart | `sso_pending` table |
| SSO-only accounts | — | password login takes the miss path; timing reveals nothing |
| Passwords | scrypt | Argon2id |
| Session tokens | plaintext | SHA-256 hashed, with expiry |

Halaqah adds: **403** for anyone without the mic attempting to set the page/share/speaker; share
paths validated as same-origin relative (`https://…`, `//…`, `javascript:` all rejected); and
`mathurat` share indices clamped server-side, since they drive an array index in every client.

**Still outstanding:** no rate limiting on auth endpoints; the container runs as root; no healthcheck
on `api` or `caddy`.

---

## 5. Verification

**25 tests passing** — unit (admin aggregation, SSO helpers, halaqah slugs/grants, config parsing)
plus integration against a real database. `svelte-check` reports **0 errors**.

```bash
cd server && CAKNA_TEST_DATABASE_URL=postgres://cakna:cakna@localhost:54329/cakna cargo test
```

Beyond tests, the halaqah was driven end-to-end with three live participants: role-based tokens,
live floor handoff without reconnect, page sync reaching a client browsing another feature, a late
joiner landing on the correct page, and dismiss/restore of the shared panel.

**Not verified:** actual audio has never been *heard*. The automation browser blocks microphone
access, so capture → publish → subscribe is proven only as far as data flowing into Web Audio. Two
normal Chrome windows on `/halaqah` will confirm the last mile.

---

## 6. Open items

**Blocking a production cutover**

1. **Ma'thurat v1 → v2 sync migration.** The payload shape changed with no upgrade path; cutting over as-is destroys every user's wirid progress. This is the one true blocker.
2. Migrate production user data — schemas differ (`serial` vs `uuid`, unconstrained keys vs a 15-key CHECK). Audit `SELECT DISTINCT key` first.
3. `cakna.qcxis.com` fails its TLS handshake — it CNAMEs to `cakna.org`, whose certificate covers only that name.
4. Confirm the production backup restores (`~/cakna-backups/cakna-PROD-cakna.org-2026-07-23.sql`).

**Known gaps**

- **`DUPLICATE_IDENTITY`** — the same account in two places kicks itself out of a room. Phone + laptop is normal usage. Fix is a per-session identity suffix, which complicates the mic handover (it targets an exact identity).
- **A full page reload drops the call** — no WebRTC connection to inherit. A "Sambung semula halaqah?" prompt via `sessionStorage` would cover it.
- **LiveKit production config is written but not deployed** (§3a). Needs DNS, security-group rules and credentials before cross-device audio works at all.
- **Web vs app wirid content differs** — 46-item master (canonical) vs the app's 28-item set, pending the dataset migration.
- Flutter Ma'thurat progress is device-local; QCXIS SSO is web-only.

**Needs a human decision**

- The `ibadah` prose differs between stacks *in both directions* — a fiqh judgement, deliberately not made.
- The Doa Rabitah Arabic was ported **verbatim** and contains likely errors (missing initial alif, misplaced shadda, tanwin on a definite noun). Live in production today; needs a proofreader.

---

## 6a. Repository size

Cleaned 2026-07-24: **11.3 GB → 714 MB**, entirely by removing regenerable build
caches (`server/target` 8.2 GB, `app/build` 2.1 GB, `web/node_modules` 180 MB and
similar). Both rebuilds were re-run from empty to confirm nothing was lost.

`.dockerignore` was stale — it predated the consolidation and did not exclude
`legacy/` or `docs/`, so 27 MB of the superseded Node stack was being tarred into
every image build. Fixed; the build context is now ~13 MB.

Full breakdown, regeneration commands and the rsync exclude list:
[deploy/CLEANUP.md](deploy/CLEANUP.md).

---

## 7. Working state

40 commits on `main`, remote `github.com/Dzulhilmy/cakna` (private), **43 uncommitted entries** —
the halaqah feature, the LiveKit integration, and `legacy/`. Nothing committed on your behalf.

Backups in `~/cakna-backups/`: production and local database dumps, a full-history git bundle, the
pre-move tree of both folders, and pre-edit content files.

`legacy/` holds the superseded Node/Express stack — **still what serves production** until a cutover
happens. Do not delete it before the four items in §6 are done.
