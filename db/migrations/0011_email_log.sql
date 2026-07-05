-- 0011_email_log.sql — CRM email history. One row per email the site sends or
-- receives about a lead, linked to the estimates row. Outbound: the owner
-- notification and the customer auto-reply. Inbound (added in the same table so
-- no second migration is needed): customer replies captured via the Resend
-- inbound webhook, stored with direction='in'. Additive only — no change to any
-- existing table. apply: runs automatically on next server boot via runMigrations.
-- timestamps are Unix epoch seconds (INTEGER).

BEGIN;

CREATE TABLE email_log (
    id           INTEGER PRIMARY KEY,
    estimate_id  INTEGER REFERENCES estimates(id) ON DELETE SET NULL,  -- the lead, if matched
    direction    TEXT NOT NULL CHECK (direction IN ('out', 'in')),
    from_addr    TEXT,
    to_addr      TEXT,
    subject      TEXT,
    body_preview TEXT,                     -- short snippet only, never the full body
    status       TEXT NOT NULL DEFAULT 'sent'
                 CHECK (status IN ('sent', 'failed', 'received')),
    provider_id  TEXT,                     -- Resend message id (out) / inbound id (in)
    created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_email_log_estimate ON email_log(estimate_id);
CREATE INDEX idx_email_log_created ON email_log(created_at);

COMMIT;
