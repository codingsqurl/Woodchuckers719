-- 0003_estimates.sql — public estimate requests (lead capture from /estimate).
-- apply: runs automatically on next server boot via runMigrations.
-- timestamps are Unix epoch seconds (INTEGER); booleans are 0/1 (INTEGER).
-- money is whole US dollars (INTEGER); the day-rate ballpark the customer saw.

BEGIN;

CREATE TABLE estimates (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT,                    -- at least one of email/phone required at handler
    phone      TEXT,
    address    TEXT,                    -- service location
    service    TEXT,                    -- removal | trim | stump | storm | clearing | other
    details    TEXT,                    -- customer's description of the trees/job
    est_days   INTEGER,                 -- estimated days from the calculator
    cleanup    INTEGER NOT NULL DEFAULT 0 CHECK (cleanup IN (0, 1)),
    est_low    INTEGER,                 -- ballpark low, whole dollars
    est_high   INTEGER,                 -- ballpark high, whole dollars
    status     TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost', 'archived')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at);

COMMIT;
