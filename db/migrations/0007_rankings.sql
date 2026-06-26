-- 0007_rankings.sql — manual SEO rank tracker (admin only). Each row is one
-- observation KING typed in: for a search keyword, who sat at a given position
-- when he checked. is_self flags Woodchuckers' own listing, so the admin can see
-- who ranks above us per keyword and watch it move over time.
-- apply: runs automatically on next server boot via runMigrations.
-- timestamps are Unix epoch seconds (INTEGER); booleans are 0/1 (INTEGER).

BEGIN;

CREATE TABLE rankings (
    id         INTEGER PRIMARY KEY,
    keyword    TEXT NOT NULL,                 -- the search query, e.g. "contract tree climber colorado springs"
    position   INTEGER NOT NULL,              -- rank position seen (1 = top)
    competitor TEXT NOT NULL,                 -- who's there (domain or name); our own listing too
    is_self    INTEGER NOT NULL DEFAULT 0 CHECK (is_self IN (0, 1)),  -- 1 = that's us
    note       TEXT,                          -- optional: map pack, ad, etc.
    checked_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_rankings_keyword ON rankings(keyword);
CREATE INDEX idx_rankings_checked_at ON rankings(checked_at);

COMMIT;
