-- 0004_estimate_source.sql — marketing attribution: how the customer found us.
-- apply: runs automatically on next server boot via runMigrations.

BEGIN;

ALTER TABLE estimates ADD COLUMN source TEXT;  -- google | facebook | nextdoor | ...

COMMIT;
