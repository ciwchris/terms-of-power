-- "Notify me" list. One row per email; re-signups are ignored (idempotent).
CREATE TABLE IF NOT EXISTS subscribers (
  email      TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source     TEXT
);
