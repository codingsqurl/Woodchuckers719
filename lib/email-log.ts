// email-log.ts — CRM email history. Every email the site sends or receives about
// a lead is one row in email_log (migration 0011), linked to the estimates row.
// Statements are prepared per-call (not at module load) and reads are guarded, so
// admin keeps rendering and mail keeps flowing even before 0011 applies on boot.
import { db } from './db'

export type EmailDirection = 'out' | 'in'
export type EmailStatus = 'sent' | 'failed' | 'received'

// What a caller hands logEmail. estimateId is the lead it's about (null if it
// couldn't be matched, e.g. an inbound reply from an unknown address).
export type EmailLogEntry = {
  estimateId: number | null
  direction: EmailDirection
  from: string
  to: string
  subject: string
  bodyPreview?: string
  status: EmailStatus
  providerId?: string | null
}

type EmailLogRow = {
  id: number
  estimate_id: number | null
  direction: string
  from_addr: string | null
  to_addr: string | null
  subject: string | null
  body_preview: string | null
  status: string
  provider_id: string | null
  created_at: number
}

export type EmailRecord = {
  id: number
  estimateId: number | null
  direction: string
  from: string
  to: string
  subject: string
  bodyPreview: string
  status: string
  providerId: string
  createdAt: number
}

// logEmail records one send/receive. Best-effort by design: a logging failure
// (including the table not existing until 0011 applies) must never break the
// mail flow it is recording, so it swallows and logs its own errors.
export function logEmail(e: EmailLogEntry): void {
  try {
    db.prepare(
      `INSERT INTO email_log
         (estimate_id, direction, from_addr, to_addr, subject, body_preview, status, provider_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      e.estimateId,
      e.direction,
      e.from,
      e.to,
      e.subject,
      e.bodyPreview ?? null,
      e.status,
      e.providerId ?? null,
    )
  } catch (err) {
    console.error('logEmail:', err)
  }
}

const EMAIL_COLS = `id, estimate_id, direction, from_addr, to_addr, subject,
  COALESCE(body_preview, '') AS body_preview, status,
  COALESCE(provider_id, '') AS provider_id, created_at`

function mapEmail(r: EmailLogRow): EmailRecord {
  return {
    id: r.id,
    estimateId: r.estimate_id,
    direction: r.direction,
    from: r.from_addr ?? '',
    to: r.to_addr ?? '',
    subject: r.subject ?? '',
    bodyPreview: r.body_preview ?? '',
    status: r.status,
    providerId: r.provider_id ?? '',
    createdAt: r.created_at,
  }
}

// emailsForEstimate returns the email history for one lead, oldest first. Guarded
// so admin renders before 0011 applies (no table yet -> empty history).
export function emailsForEstimate(estimateId: number): EmailRecord[] {
  try {
    const rows = db
      .prepare(`SELECT ${EMAIL_COLS} FROM email_log WHERE estimate_id = ? ORDER BY created_at ASC`)
      .all(estimateId) as EmailLogRow[]
    return rows.map(mapEmail)
  } catch (err) {
    if (err instanceof Error && err.message.includes('no such table')) return []
    throw err
  }
}
