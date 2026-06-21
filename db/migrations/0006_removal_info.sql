-- 0006_removal_info.sql — extra tree-removal details captured on the estimate
-- form (height, proximity, condition, count, drop zone). Stored as one summary
-- string since it only informs the quote. apply: runs on next server boot.

BEGIN;

ALTER TABLE estimates ADD COLUMN removal_info TEXT;

COMMIT;
