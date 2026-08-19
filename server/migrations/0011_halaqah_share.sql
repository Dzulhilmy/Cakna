-- What the mic-holder is currently showing the room.
--
-- Generalises the shared mushaf page to any part of the app. Two shapes:
--   {"kind":"page","page":248}
--   {"kind":"route","path":"/mathurat","label":"Al-Ma'thurat"}
-- NULL means the reciter has stopped sharing.
--
-- Still a description of a VIEW, not pixels: each participant renders it with
-- their own settings, and it costs a few bytes per change instead of a video
-- stream. The existing `page` column is kept in step whenever kind = 'page', so
-- the minimised bar's jump-to-page chip keeps working unchanged.
ALTER TABLE halaqah_rooms ADD COLUMN IF NOT EXISTS share jsonb;

-- Seed the column from the page rooms are already on, so nothing goes blank
-- for a session that is live while this migration runs.
UPDATE halaqah_rooms
   SET share = jsonb_build_object('kind', 'page', 'page', page)
 WHERE share IS NULL AND closed_at IS NULL;
