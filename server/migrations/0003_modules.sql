CREATE TABLE asma_ul_husna (
  position   smallint PRIMARY KEY,
  arabic     text NOT NULL,
  translit   text NOT NULL,
  meaning_ms text NOT NULL,
  meaning_en text NOT NULL
);

CREATE TABLE cities (
  id          smallint PRIMARY KEY, -- original array index; the client `city` key stores it
  name        text NOT NULL,
  lat         double precision NOT NULL,
  lng         double precision NOT NULL,
  tz          text NOT NULL,
  is_malaysia boolean NOT NULL
);

CREATE TABLE hijri_events (
  id         smallserial PRIMARY KEY,
  month_code text NOT NULL,
  day        smallint NOT NULL,
  label_key  text NOT NULL
);

CREATE TABLE dhikr (
  id           smallserial PRIMARY KEY,
  kind         text NOT NULL CHECK (kind IN ('phrase','quran')),
  position     smallint NOT NULL,
  arabic       text,
  label_ms     text NOT NULL,
  label_en     text NOT NULL,
  target_count smallint,
  quran_ref    jsonb,
  tajweed      smallint[] NOT NULL DEFAULT '{}'
);

CREATE TABLE duas (
  id         smallserial PRIMARY KEY,
  kind       text NOT NULL CHECK (kind IN ('quran','hadith')),
  position   smallint NOT NULL,
  title_ms   text NOT NULL,
  title_en   text NOT NULL,
  quran_ref  jsonb,
  arabic     text,
  meaning_ms text,
  meaning_en text,
  tajweed    smallint[] NOT NULL DEFAULT '{}'
);

CREATE TABLE mathurat_items (
  position       smallint PRIMARY KEY,
  quran_ref      jsonb,
  arabic         text,
  arabic_pagi    text,
  arabic_petang  text,
  repeat_n       smallint NOT NULL DEFAULT 1,
  repeat_full    smallint,
  core           boolean NOT NULL DEFAULT false,
  title_ms       text NOT NULL,
  title_en       text NOT NULL,
  meaning_ms     text,
  meaning_en     text,
  tajweed        smallint[] NOT NULL DEFAULT '{}',
  tajweed_pagi   smallint[] NOT NULL DEFAULT '{}',
  tajweed_petang smallint[] NOT NULL DEFAULT '{}'
);

CREATE TABLE module_docs (
  slug text PRIMARY KEY,
  body jsonb NOT NULL
);
