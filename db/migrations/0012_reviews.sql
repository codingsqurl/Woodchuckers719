-- 0012_reviews.sql — customer-submitted reviews from the public /reviews/new
-- form. NOTHING here is public on its own: a row lands as 'pending' and only an
-- admin approval flips it to 'approved'. The /reviews page shows the curated
-- file reviews (lib/reviews.ts) and, when REVIEWS_PUBLIC is on, the approved
-- rows from this table on top. Additive only — no existing table is touched.
-- apply: runs automatically on your next server boot via runMigrations (dev
-- points at woodchuckers.dev.db; the live file is never touched by hand).
-- timestamps are Unix epoch seconds (INTEGER); rating is a whole 1–5; booleans 0/1.

BEGIN;

CREATE TABLE review_submissions (
    id         INTEGER PRIMARY KEY,
    author     TEXT NOT NULL,                        -- display name as it will show, e.g. "Marcus T."
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    body       TEXT NOT NULL,                        -- the review text, stored verbatim
    email      TEXT,                                 -- optional; owner follow-up only, never shown publicly
    town       TEXT,                                 -- optional service town/city
    source     TEXT,                                 -- which page + locale the form was on (attribution)
    verified   INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),  -- 1 = Google-verified email at submit
    status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_review_submissions_status ON review_submissions(status);
CREATE INDEX idx_review_submissions_created ON review_submissions(created_at);

COMMIT;
