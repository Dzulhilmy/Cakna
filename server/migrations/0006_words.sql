-- Word-by-word data (Arabic + ms/en/id gloss) from the Tilawah dataset.
-- One row per ayah; `words` is an ordered JSONB array of { ar, ms, en, id }.
-- Fetched on demand (not part of the page bundle) — see GET /api/ayahs/{global}/words.
CREATE TABLE ayah_words (
    global integer PRIMARY KEY REFERENCES ayahs(global),
    words  jsonb NOT NULL
);
