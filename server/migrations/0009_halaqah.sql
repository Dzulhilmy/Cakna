-- Halaqah: moderated group audio rooms (LiveKit).
--
-- Model: an admin opens a room and is its host. Everyone signed in may join and
-- listen. The host designates ONE participant at a time to hold the floor; that
-- participant and the host may publish audio, everyone else subscribes only.
--
-- Rooms have no time limit — `closed_at` is set explicitly by the host, never by
-- a timeout. LiveKit itself is told to keep the room alive when empty.

CREATE TABLE halaqah_rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- LiveKit room name. Slug rather than uuid so it is readable in LiveKit's
  -- own dashboards and logs.
  slug        text UNIQUE NOT NULL,
  title       text NOT NULL,
  host_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- The participant currently holding the floor. NULL = nobody chosen yet, so
  -- only the host can be heard.
  speaker_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  -- Set when the host ends the session. No automatic expiry.
  closed_at   timestamptz
);

-- The room list only ever shows open rooms, newest first.
CREATE INDEX halaqah_rooms_open_idx ON halaqah_rooms (created_at DESC) WHERE closed_at IS NULL;
CREATE INDEX halaqah_rooms_host_idx ON halaqah_rooms (host_id);
