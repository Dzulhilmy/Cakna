-- Shared mushaf page for a halaqah room.
--
-- The room broadcasts a page NUMBER, not a screen: every participant renders it
-- with their own reader, keeping their own font size, translation and theme. A
-- page turn is a few bytes rather than a continuous video stream.
--
-- Live turns travel over the LiveKit data channel; this column is the durable
-- copy so somebody joining mid-session lands on the right page immediately.
ALTER TABLE halaqah_rooms
  ADD COLUMN IF NOT EXISTS page int NOT NULL DEFAULT 1
  CONSTRAINT halaqah_rooms_page_range CHECK (page BETWEEN 1 AND 604);
