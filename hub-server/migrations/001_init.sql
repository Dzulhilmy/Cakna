-- Hub users (matched to Cakna by email, carry Hub-specific role/branch/status)
CREATE TABLE IF NOT EXISTS hub_users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL DEFAULT '',
    role        TEXT NOT NULL DEFAULT 'franchisee',
    branch      TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Funding applications
CREATE TABLE IF NOT EXISTS funding_applications (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference            TEXT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_by_id      TEXT,
    submitted_by_name    TEXT,
    submitted_by_role    TEXT,
    submitted_by_branch  TEXT,
    status               TEXT NOT NULL DEFAULT 'pending_dept',
    reviewed_by_id       TEXT,
    reviewed_by_name     TEXT,
    reviewed_at          TIMESTAMPTZ,
    review_note          TEXT NOT NULL DEFAULT '',
    cawangan             TEXT NOT NULL DEFAULT '',
    nama_francaisi       TEXT NOT NULL DEFAULT '',
    ajk                  TEXT NOT NULL DEFAULT '',
    kluster              TEXT NOT NULL DEFAULT '',
    nama_program         TEXT NOT NULL DEFAULT '',
    tarikh               TEXT NOT NULL DEFAULT '',
    lokasi               TEXT NOT NULL DEFAULT '',
    penerangan           TEXT NOT NULL DEFAULT '',
    jumlah_peserta       TEXT NOT NULL DEFAULT '',
    kategori_penerima    TEXT NOT NULL DEFAULT '',
    nama_komuniti        TEXT NOT NULL DEFAULT '',
    jumlah_perbelanjaan  NUMERIC(14, 2) NOT NULL DEFAULT 0,
    sumber_dana          TEXT NOT NULL DEFAULT '',
    pautan_gambar        TEXT NOT NULL DEFAULT '',
    impak                TEXT NOT NULL DEFAULT '',
    cadangan             TEXT NOT NULL DEFAULT ''
);

-- Immutable audit trail for each application
CREATE TABLE IF NOT EXISTS funding_review_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES funding_applications(id) ON DELETE CASCADE,
    stage           TEXT NOT NULL,
    decision        TEXT NOT NULL,
    by_name         TEXT NOT NULL DEFAULT '',
    by_role         TEXT NOT NULL DEFAULT '',
    at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    note            TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_review_log_app ON funding_review_log(application_id);

-- Events / QC Calendar
CREATE TABLE IF NOT EXISTS events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_by_id     TEXT,
    submitted_by_name   TEXT,
    submitted_by_role   TEXT,
    submitted_by_branch TEXT,
    title               TEXT NOT NULL DEFAULT '',
    kluster             TEXT NOT NULL DEFAULT '',
    tarikh              TEXT NOT NULL DEFAULT '',
    lokasi              TEXT NOT NULL DEFAULT '',
    anjuran             TEXT NOT NULL DEFAULT '',
    jumlah_peserta      TEXT NOT NULL DEFAULT '',
    penerangan          TEXT NOT NULL DEFAULT '',
    images              TEXT[] NOT NULL DEFAULT '{}'
);

-- Programme catalogue (seeded from cores.ts static list on first use)
CREATE TABLE IF NOT EXISTS programs (
    id          TEXT PRIMARY KEY,
    core_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (core_id, slug)
);

-- Site content singleton (entire JSON blob)
CREATE TABLE IF NOT EXISTS site_content (
    id      INT PRIMARY KEY DEFAULT 1,
    content JSONB NOT NULL,
    CONSTRAINT only_one_row CHECK (id = 1)
);

-- Internal notices (per-role, per-user-id for franchisee)
CREATE TABLE IF NOT EXISTS notices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    audience    TEXT NOT NULL,
    user_id     UUID,
    kind        TEXT NOT NULL,
    title       TEXT NOT NULL DEFAULT '',
    body        TEXT NOT NULL DEFAULT '',
    href        TEXT,
    read_by     UUID[] NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_notices_audience ON notices(audience);

-- Push-style announcements sent to franchisees
CREATE TABLE IF NOT EXISTS notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    type            TEXT NOT NULL,
    title           TEXT NOT NULL DEFAULT '',
    content         TEXT NOT NULL DEFAULT '',
    callout         TEXT NOT NULL DEFAULT '',
    audience        TEXT NOT NULL DEFAULT '',
    created_by_id   TEXT,
    created_by_name TEXT
);
