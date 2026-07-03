CREATE TABLE surahs (
  number        smallint PRIMARY KEY CHECK (number BETWEEN 1 AND 114),
  name_ar       text NOT NULL,
  name_translit text NOT NULL,
  name_ms       text NOT NULL,
  name_en       text NOT NULL,
  ayah_count    smallint NOT NULL,
  revelation    char(1)  NOT NULL CHECK (revelation IN ('M','D')),
  first_global  integer  NOT NULL,
  first_page    smallint NOT NULL
);

CREATE TABLE ayahs (
  global     integer  PRIMARY KEY CHECK (global BETWEEN 1 AND 6236),
  surah      smallint NOT NULL REFERENCES surahs(number),
  ayah       smallint NOT NULL,
  page       smallint NOT NULL CHECK (page BETWEEN 1 AND 604),
  juz        smallint NOT NULL CHECK (juz BETWEEN 1 AND 30),
  sajdah     boolean  NOT NULL DEFAULT false,
  text_ar    text     NOT NULL,
  text_plain text     NOT NULL,
  tajweed    smallint[] NOT NULL DEFAULT '{}',
  UNIQUE (surah, ayah)
);
CREATE INDEX ayahs_page_idx ON ayahs (page);
CREATE INDEX ayahs_juz_idx ON ayahs (juz);
CREATE INDEX ayahs_plain_trgm ON ayahs USING gin (text_plain gin_trgm_ops);

CREATE TABLE ayah_translations (
  global integer NOT NULL REFERENCES ayahs(global),
  lang   text    NOT NULL CHECK (lang IN ('ms','en','id')),
  text   text    NOT NULL,
  PRIMARY KEY (global, lang)
);
CREATE INDEX ayah_tr_trgm ON ayah_translations USING gin (lower(text) gin_trgm_ops);

CREATE TABLE ayah_transliterations (
  global integer PRIMARY KEY REFERENCES ayahs(global),
  text   text NOT NULL
);

CREATE TABLE meta (
  key   text PRIMARY KEY,
  value text NOT NULL
);
