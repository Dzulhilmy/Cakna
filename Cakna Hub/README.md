# Cakna Hub

A central hub for **QC Group / Cakna** community-programme (CSR) initiatives — the 7 Core areas, a Society & Others space for logging programmes, and an admin area for funding analytics.

Built with **Next.js 15 (App Router) + TypeScript**, **Tailwind CSS v4**, and **lucide-react**. Next.js serves as both the frontend and the backend (route handlers).

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint`.

Requires Node 20+ (developed on Node 24).

---

## What's inside

### 1. Hub home — `/`
Landing page with the "Cakna Hub" title and two clickable tiles → **7 Core** and **Society & Others**, plus a discreet **Admin** link.

### 2. The 7 Core — `/core`
Grid of the seven core initiatives (Assist, Biz, Circle, Digital, Edu, Future, Green), each seeded with its tagline, programs, and PIC.

- Click a core → **`/core/[coreId]`** lists that core's programs.
- Click a program → **`/core/[coreId]/[program]`** — a placeholder page ready for real content.
- URL slugs are derived from program names (e.g. "MKT Blast" → `mkt-blast`). All core & program pages are statically generated.

### 3. Society & Others — `/society`
Two ways to log community programmes:

- **Funding Applications** (`/society/funding`) — events that need funding. The **`/new`** form is a digital version of the *Laporan Program Hub Cakna* paper form (branch info, HOME cluster, programme details, beneficiaries, expenditure & funding source, photo-folder link, impact/notes). Each submission gets an auto reference `HCQC/2026/000N`.
- **Event Records** (`/society/events`) — events documented for the record (details + **image uploads**, no funding). The gallery shows photo covers; the **`/new`** form supports multiple image uploads (JPG/PNG/WebP/GIF, 5 MB each) with live previews.

Submissions persist to JSON files and appear in their lists immediately.

### 4. Authentication & roles
Login/registration with three roles — **admin (HQ/IT)**, **reviewer (Team CAKNA)**, **franchisee**. New sign-ups are **pending** until an admin approves them at `/admin/users`. `/admin/*` requires admin or reviewer; `/society/*` requires any logged-in user. Sessions use an HMAC-signed httpOnly cookie; passwords are `scrypt`-hashed in `data/users.json`. Demo accounts are shown on the login page.

### 5. Admin — `/admin`
- **Dashboard** (`/admin/dashboard`) — funding **collected vs given by state**, KPI tiles, and a live feed of funding applications. Only **approved** applications count toward the "given"/disbursed totals.
- **Funding** (`/admin/funding`) — **review queue**: approve or request improvements (with a note) on each application; status lifecycle **Menunggu Semakan → Diluluskan / Perlu Penambahbaikan**. Also links to the consolidated report and CSV export.
- **Analytics** (`/admin/analytics`) — statistics **by core** and **by PIC**.
- **Users** (`/admin/users`, admin only) — approve pending franchisee accounts.
- **Consolidated report** (`/admin/funding/report`) — a print-optimized "Laporan Konsolidasi" for HQ/Yayasan; **Cetak / Simpan PDF** (browser print → PDF) and **Excel (CSV)** download.

### API endpoints
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/cores` | GET | The 7 cores as JSON |
| `/api/reports` | GET | Programme ledger + aggregations |
| `/api/funding` | GET, POST | List / create funding applications (POST requires login) |
| `/api/funding/review` | POST | Approve / request revision (reviewer/admin) |
| `/api/funding/export` | GET | CSV export of all applications (reviewer/admin) |
| `/api/events` | GET, POST | List / create event records (multipart upload) |
| `/api/auth/login`, `/register`, `/logout` | POST | Session auth |
| `/api/admin/users` | GET, POST | List / approve users (admin) |

---

## Project structure

```
app/
  page.tsx                     Hub home
  core/                        7 Core grid, [coreId], [coreId]/[program]
  society/                     landing, funding/(new), events/(new)
  admin/                       layout, dashboard, analytics
  api/                         cores, reports, funding, events
components/
  PartitionTile, SiteHeader, CoreCard, CoreIcon
  admin/  AdminNav, StatCard, FundingBars, ChartLegend
  society/  FormControls, FundingForm, EventForm
lib/
  cores.ts          7 cores + slug / lookup helpers
  reports.ts        sample programme ledger + funding→dashboard integration
  society.ts        HOME clusters + funding / event types (client-safe)
  society-store.ts  JSON-file persistence (server-only)
  format.ts         Ringgit formatting
data/
  funding.json      funding applications (seed + submissions)
  events.json       event records (seed + submissions)
public/uploads/     uploaded event images (sample-*.svg are placeholders)
```

---

## Data & persistence

- **Live data** — funding applications and event records are stored in `data/*.json` via `lib/society-store.ts`, and uploaded images are written to `public/uploads/`. These survive server restarts. Swap `society-store.ts` for a real database later without touching the pages or API contracts.
- **Sample data** — `lib/reports.ts` holds a deterministic sample "programme ledger" (collected/given by state, core, and PIC) that powers the Admin Dashboard and Analytics baseline. Replace `buildReports()` with a real source when reporting data is available.

---

## Design

Minimalist, neutral theme: white/zinc surfaces, generous whitespace, rounded cards, a single emerald accent, and amber as the second data-series color (a colorblind-safe pair, validated for the charts). Every chart bar carries a visible value so nothing relies on color alone. Fully responsive and keyboard-accessible.

---

## Current limitations / next steps

- **Demo-grade auth** — custom session auth is fine for a prototype; set `AUTH_SECRET` and move users + sessions to a real database/identity provider before production.
- **File-based storage** is fine for a single instance / demo; move to a database for concurrent, multi-instance use.
- **Revision loop** — franchisees see a "Perlu Penambahbaikan" note but can't yet edit & resubmit in place.
- **Analytics by PIC/core** still uses the sample ledger (the funding form doesn't capture a PIC).
- **Sharing** is via the exported PDF/CSV files; there's no in-app send/share or archive/audit trail yet.
- **Deployment** — local dev only; no domain (`cakna.com` / `laporan.cakna.com`) or email setup.

## Reference flow coverage (Pengurusan Domain, steps 12–19)

| Step | Status |
|------|--------|
| 12 User registration + HQ/IT approval | ✅ Done |
| 13 Submit report (+ attachments) | ✅ Done |
| 14 Review & approval | ✅ Done |
| 15 Record & secure storage | 🟡 Stored + approval-gated (file-based, not hardened) |
| 16 Dashboard & analytics | ✅ Summary/KPIs (trend charts still to add) |
| 17 Consolidated report | ✅ Done (`/admin/funding/report`) |
| 18 Export & share | 🟡 PDF + Excel export done; in-app sharing not built |
| 19 Archive / audit | ❌ Not built |
