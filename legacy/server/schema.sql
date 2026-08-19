-- Cakna backend schema (PostgreSQL)
DROP TABLE IF EXISTS sync_data, sessions, users, ayahs, surahs, modules CASCADE;

CREATE TABLE surahs (
  number        int PRIMARY KEY,
  name_arabic   text NOT NULL,
  name_translit text NOT NULL,
  name_ms       text NOT NULL,
  name_en       text NOT NULL,
  ayah_count    int  NOT NULL,
  type          text NOT NULL          -- 'M' Makki | 'D' Madani
);

CREATE TABLE ayahs (
  global   int PRIMARY KEY,            -- 1..6236 (matches cdn.islamic.network audio numbering)
  surah    int NOT NULL REFERENCES surahs(number),
  ayah     int NOT NULL,
  page     int NOT NULL,
  juz      int NOT NULL,
  ar       text NOT NULL,
  ar_plain text NOT NULL,              -- diacritics stripped, for search
  tr_ms    text NOT NULL,
  tr_en    text NOT NULL,
  tr_id    text NOT NULL,
  translit text NOT NULL,
  tajweed  jsonb NOT NULL,             -- flat [start,len,rule,...] triples
  sajdah   boolean NOT NULL
);
CREATE INDEX ayahs_page_idx  ON ayahs(page);
CREATE INDEX ayahs_surah_idx ON ayahs(surah, ayah);

CREATE TABLE modules (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

CREATE TABLE users (
  id            serial PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  token      text PRIMARY KEY,
  user_id    int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sync_data (
  user_id    int  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key        text NOT NULL,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
