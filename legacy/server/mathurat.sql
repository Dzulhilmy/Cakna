-- Al-Ma'thurat wirid items (was hardcoded in the frontend bundle; now DB-backed)
DROP TABLE IF EXISTS mathurat CASCADE;
CREATE TABLE mathurat (
  id         serial PRIMARY KEY,
  sort_order int  NOT NULL,      -- order within the wirid
  reps_s     int,                -- repetitions in Sughra (NULL = not part of Sughra)
  reps_k     int,                -- repetitions in Kubra
  jenis      text,               -- 'quran' | 'zikir' | 'doa'
  tajuk      text,               -- title (e.g. 'Doa Rabitah')
  bi         text,               -- English meaning
  ar         text,               -- Arabic
  bm         text,               -- Malay meaning
  rumi       text,               -- transliteration
  info       text,               -- note
  basmalah   boolean NOT NULL DEFAULT false,
  n          int                 -- optional reference number
);
CREATE INDEX mathurat_order_idx ON mathurat(sort_order);
