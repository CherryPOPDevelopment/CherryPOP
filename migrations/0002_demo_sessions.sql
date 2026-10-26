CREATE TABLE IF NOT EXISTS demo_sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,
  expires INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_expires ON demo_sessions (expires);
