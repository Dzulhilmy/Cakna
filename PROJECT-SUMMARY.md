# Cakna — Project Summary

> Malay-first Islamic companion app for Malaysian Muslims.  
> Live at [cakna.org](https://cakna.org) · Production server: `56.69.195.145`

---

## What It Is

Cakna is a full-stack Islamic companion platform built for the Malaysian Muslim community. It centres on a 604-page digital Mushaf Madani with coloured tajweed, three translations (Malay, English, Indonesian), romanised transliteration, and qari audio — surrounded by ~20 supporting modules covering daily ibadah, community tools, and society management.

The project also runs a community hub (Cakna Hub) used by registered societies: admins manage members, funding, notices, media, and events; members get a curated portal with live features including Halaqah study circles.

---

## Architecture

```
Cakna Project/
├── Cakna Hub/        SvelteKit SPA (Svelte 5, Tailwind v4) — main web frontend
├── server/           Rust crate: Axum + SQLx API, PostgreSQL 16 migrations
├── app/              Flutter mobile app (Android + iOS)
├── web/              Legacy SvelteKit SPA (adapter-static) — superseded by Cakna Hub
├── legacy/           Node/Express stack — currently serving production (pending cutover)
├── hub-server/       Hub-specific server logic
├── data/             Extracted content artefacts (loaded by Rust seeder)
├── tools/            Node pipeline: sample PWA → JSON content artefacts
├── deploy/           Dockerfile, docker-compose.prod.yml, Caddyfile
└── sample/           Original single-file PWA (content source of truth)
```

### Stack

| Layer | Tech |
|---|---|
| Frontend | SvelteKit 2, Svelte 5, Tailwind CSS v4, TypeScript |
| Backend | Rust (Axum + SQLx), PostgreSQL 16 |
| Mobile | Flutter (Android + iOS, App Store ready) |
| Auth | QCXIS SSO (OIDC/PKCE) + local email/password — guest-first |
| Real-time | LiveKit (Halaqah audio/video sessions) |
| Deploy | Docker + docker-compose, Caddy reverse proxy, SSH to VPS |

---

## Features & Routes

### Quran & Reading
| Route | Feature |
|---|---|
| `/mushaf` | 604-page digital Mushaf Madani — tajweed, 3 translations, transliteration, audio |
| `/surah` | Surah index with metadata |
| `/mengaji` | Asas Mengaji — hijaiyah quiz game for beginners |
| `/khatam` | Khatam Quran tracker |

### Daily Ibadah
| Route | Feature |
|---|---|
| `/solat` | Prayer times (JAKIM zones) |
| `/qibla` | Qibla compass |
| `/mathurat` | Al-Ma'thurat wirid (46-item canonical dataset, Sughra/Kubra split) |
| `/zikir` | Dhikr / tasbih counter |
| `/asma` | Asmaul Husna (99 names) |
| `/doa` | Du'a collection |
| `/selawat` | Selawat Nabi (Ashraqal Badr, 21 stanzas) |
| `/yasin` | Surah Yasin |
| `/ibadah` | Shafi'i ibadah guide |
| `/puasa` | Qada-puasa log |
| `/zakat` | Zakat calculator |

### Community & Society
| Route | Feature |
|---|---|
| `/halaqah` | Live study circle — group sessions, auto-close after 5 hours, LiveKit audio/video |
| `/society` | Society profile and member dashboard |
| `/society/funding/[id]` | Funding campaign progress |
| `/search` | Global search |

### Hub Admin Panel
| Route | Feature |
|---|---|
| `/hub/admin/dashboard` | Stats overview (members, activity) |
| `/hub/admin/users` | Member management |
| `/hub/admin/calendar` | Events calendar |
| `/hub/admin/media` | Media library |
| `/hub/admin/notifications` | Push notifications |
| `/hub/admin/site/home` | Home page content editor |
| `/hub/admin/site/[section]` | Custom section editor |

---

## Key Components

- **`HubShell`** / **`HubPortal`** — authenticated hub layout and portal wrapper
- **`SideNav`** — main navigation sidebar
- **`Hub`** — central hub landing page
- **`Halaqah`** — live session orchestration (store, UI, LiveKit integration)
- **`MathuratView`** — wirid reading with rep counting and Sughra/Kubra modes
- **`QuizGame`** — hijaiyah learning game
- **`AuthForm`** — unified login/register form
- **`AdminNav`** / **`AdminShell`** — admin layout and navigation
- **`CustomSectionsEditor`** — drag-and-drop site section management
- **`FundingBars`** — funding campaign progress bars
- **`StatCard`** — admin dashboard stat tiles

---

## Auth Model

Two sign-in paths, one session model (opaque token → `sessions` table, `HttpOnly` cookie):

1. **Local** — email + password
2. **QCXIS SSO** — OIDC/PKCE via `qcxis.com`

Guest-first: all reading features work without an account. Sign-in unlocks sync, community, and admin features.

**Bootstrapping admin:** set `ADMIN_EMAILS` env var → sign in → grant `is_admin` to others from the dashboard.

---

## Data Notes

### Al-Ma'thurat Dataset
The **46-item `MASTER` dataset** (`src/lib/data/mathurat-master.ts`) is canonical. The 28-item `mathurat_items` table is demoted. Production users' progress is keyed against the 46-item set (Sughra = 32 items, Kubra = 46 items).

### Ma'thurat Sync Format
The sync payload changed shape (v1 → v2) in this repo. A migration must be written before cutover to preserve existing users' wirid progress.

---

## Deploy

```bash
# Local dev
docker compose up -d                     # Postgres 16 on :54329
cd server && cargo run --bin seed        # migrate + load content
PORT=8787 cargo run --bin cakna          # API on :8787
cd "Cakna Hub" && npm install && npm run dev   # SPA on :5173

# Production build (Cakna Hub)
cd "Cakna Hub" && npm run build          # outputs to build/
```

Production is deployed via SSH to `56.69.195.145`. rsync is blocked on the server; use the tar-over-SSH fallback. Rollback snapshots are maintained on the server.

---

## Current Status (as of 2026-08-20)

| Item | Status |
|---|---|
| Live production | cakna.org — Node/Express legacy stack |
| Cakna Hub SvelteKit | Active dev, deployed to production |
| Flutter mobile | iOS App Store ready, Play Asset Delivery configured |
| Legacy cutover | **Pending** — blocked on schema migration (serial → uuid, sync_data → user_data), DNS move, and Ma'thurat v1→v2 progress migration |
| `cakna.qcxis.com` | Broken — CNAMEs to cakna.org but TLS cert covers only cakna.org |

### Recent Work
- Mushaf Digital theme-aware text colours
- Halaqah: auto-close after 5 hours, hero slideshow, LiveKit integration
- Onboarding welcome slide updated for community focus
- Selawat Nabi page (Ashraqal Badr)
- iOS App Store readiness (PrivacyInfo.xcprivacy)
- Ma'thurat sync, QCXIS SSO on mobile
