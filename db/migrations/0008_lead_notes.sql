-- 0008_lead_notes.sql — CRM: a freeform notes / follow-up field on each lead.
-- The status pipeline already exists on estimates (0003 status CHECK: new,
-- contacted, quoted, won, lost, archived); this adds the notes column so admin
-- can WORK a lead (move its stage, jot a note), not just read it.
-- apply: runs automatically on next server boot via runMigrations.

BEGIN;

ALTER TABLE estimates ADD COLUMN notes TEXT;

COMMIT;
