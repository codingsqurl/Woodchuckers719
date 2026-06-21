-- 0005_debris_removal.sql — track the $150 full-debris-removal add-on,
-- distinct from the $100 on-site cleanup. Both are 0/1; at most one is set.
-- apply: runs automatically on next server boot via runMigrations.

BEGIN;

ALTER TABLE estimates ADD COLUMN debris_removal INTEGER NOT NULL DEFAULT 0
    CHECK (debris_removal IN (0, 1));

COMMIT;
