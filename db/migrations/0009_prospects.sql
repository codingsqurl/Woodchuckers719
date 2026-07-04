-- 0009_prospects.sql — outbound prospect pipeline. The finite, enumerable list
-- of Front Range tree companies to cold-call/email, tracked through an outreach
-- funnel. Distinct from `estimates` (INBOUND leads that came to us); a prospect
-- that books becomes a lead. Additive only: CREATE TABLE + indexes, no change to
-- any existing table, so it cannot touch existing rows.
--
-- apply: runs automatically on next server boot via runMigrations.
-- timestamps are Unix epoch seconds (INTEGER); money N/A here. Text columns
-- default '' (never NULL) so the app never juggles null strings.

BEGIN;

CREATE TABLE prospects (
    id         INTEGER PRIMARY KEY,
    company    TEXT NOT NULL,
    phone      TEXT NOT NULL DEFAULT '',   -- display form, e.g. "(719) 555-1212"
    phone_key  TEXT NOT NULL DEFAULT '',   -- normalized 10 digits, the dedup key; '' when unknown
    email      TEXT NOT NULL DEFAULT '',
    website    TEXT NOT NULL DEFAULT '',
    town       TEXT NOT NULL DEFAULT '',   -- El Paso County / Front Range town
    source     TEXT NOT NULL DEFAULT '',   -- cda | google | isa | referral | manual | ...
    license    TEXT NOT NULL DEFAULT '',   -- CDA applicator license # when known
    status     TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','queued','contacted','interested','not_interested','won','bad')),
    notes      TEXT NOT NULL DEFAULT '',
    last_contacted_at INTEGER,             -- epoch seconds; NULL = never contacted
    next_followup_at  INTEGER,             -- epoch seconds; NULL = none scheduled
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- One row per real phone number. Partial: uniqueness is enforced only when a
-- phone is known, so any number of phone-less prospects can coexist and get
-- merged by hand later.
CREATE UNIQUE INDEX idx_prospects_phone_key ON prospects(phone_key) WHERE phone_key <> '';
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_followup ON prospects(next_followup_at) WHERE next_followup_at IS NOT NULL;

COMMIT;
