CREATE TABLE user_data (
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key        text NOT NULL CHECK (key IN
    ('settings','bookmarks','notes','hls','read','readlog','khatamToasted',
     'tasbih','city','sgdays','onboarded','mathurat','mgquiz','puasa','manasik')),
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
