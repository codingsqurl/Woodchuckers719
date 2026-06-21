-- 0002_login_tracking.sql — record last sign-in per employee for the admin view.
-- apply: sqlite3 woodchuckers.db < db/migrations/0002_login_tracking.sql

BEGIN;

ALTER TABLE employees ADD COLUMN last_login_at  INTEGER;  -- unix seconds, NULL = never
ALTER TABLE employees ADD COLUMN last_login_via TEXT;     -- 'password' | 'google'

COMMIT;
