// prospects.ts — the OUTBOUND side of the CRM: the finite list of Front Range
// tree companies to cold-call, tracked through an outreach funnel. Mirror of the
// employees.ts style: raw better-sqlite3, prepared statements hoisted once (the
// list/filter reads run on every /admin/prospects render), explicit column
// lists, no ORM. Sibling to estimates.ts (inbound leads); a prospect that books
// is worked over there.
import { db } from './db'
import { formatStamp } from './format'

// The outbound funnel. `new` = freshly imported, unreviewed. `queued` = on the
// call list. `contacted` = reached out, awaiting reply. `interested` = warm.
// `not_interested` = passed. `won` = has hired me. `bad` = dead number / closed
// / not actually a tree company. Matches the CHECK in migration 0009.
export const PROSPECT_STATUSES = [
  'new',
  'queued',
  'contacted',
  'interested',
  'not_interested',
  'won',
  'bad',
] as const
export type ProspectStatus = (typeof PROSPECT_STATUSES)[number]

export function isProspectStatus(s: string): s is ProspectStatus {
  return (PROSPECT_STATUSES as readonly string[]).includes(s)
}

// Statuses that mean an actual outreach happened — reaching any of these stamps
// last_contacted_at so the call log is truthful without a separate button.
const CONTACTED_STATUSES: ReadonlySet<string> = new Set([
  'contacted',
  'interested',
  'not_interested',
  'won',
])

export type Prospect = {
  id: number
  company: string
  phone: string
  phoneKey: string
  email: string
  website: string
  town: string
  source: string
  license: string
  status: string
  notes: string
  lastContactedAt: number | null
  nextFollowupAt: number | null
  createdAt: number
  updatedAt: number
}

// The shape an import or the manual add form supplies (no id/status/timestamps).
export type NewProspect = {
  company: string
  phone?: string
  email?: string
  website?: string
  town?: string
  source?: string
  license?: string
  notes?: string
}

type ProspectRow = {
  id: number
  company: string
  phone: string
  phone_key: string
  email: string
  website: string
  town: string
  source: string
  license: string
  status: string
  notes: string
  last_contacted_at: number | null
  next_followup_at: number | null
  created_at: number
  updated_at: number
}

function mapProspect(r: ProspectRow): Prospect {
  return {
    id: r.id,
    company: r.company,
    phone: r.phone,
    phoneKey: r.phone_key,
    email: r.email,
    website: r.website,
    town: r.town,
    source: r.source,
    license: r.license,
    status: r.status,
    notes: r.notes,
    lastContactedAt: r.last_contacted_at ?? null,
    nextFollowupAt: r.next_followup_at ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

// normalizePhone reduces any phone string to its 10-digit US local form — the
// dedup key. Strips a leading US country code (1). Returns '' when the input
// doesn't yield a usable 10 digits, so phone-less rows never collide.
export function normalizePhone(raw: string): string {
  const digits = (raw ?? '').replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1)
  if (digits.length === 10) return digits
  return digits.length > 10 ? digits.slice(-10) : ''
}

const P_COLS = `id, company, phone, phone_key, email, website, town, source, license,
       status, notes, last_contacted_at, next_followup_at, created_at, updated_at`

const insertStmt = db.prepare(
  `INSERT INTO prospects (company, phone, phone_key, email, website, town, source, license, notes)
   VALUES (@company, @phone, @phone_key, @email, @website, @town, @source, @license, @notes)`,
)
// Enrich an existing row on re-import: only fill columns that are currently
// blank, never clobber KING's own edits (status, notes, contact stamps). Bumps
// updated_at so a re-scrape is visible.
const enrichStmt = db.prepare(
  `UPDATE prospects SET
     email   = CASE WHEN email   = '' THEN @email   ELSE email   END,
     website = CASE WHEN website = '' THEN @website ELSE website END,
     town    = CASE WHEN town    = '' THEN @town    ELSE town    END,
     license = CASE WHEN license = '' THEN @license ELSE license END,
     source  = CASE WHEN source  = '' THEN @source  ELSE source  END,
     updated_at = unixepoch()
   WHERE id = @id`,
)
const findByPhoneKeyStmt = db.prepare(`SELECT id FROM prospects WHERE phone_key = ?`)
const listAllStmt = db.prepare(
  `SELECT ${P_COLS} FROM prospects
     ORDER BY (next_followup_at IS NULL), next_followup_at ASC, created_at DESC
     LIMIT ?`,
)
const listByStatusStmt = db.prepare(
  `SELECT ${P_COLS} FROM prospects WHERE status = ?
     ORDER BY (next_followup_at IS NULL), next_followup_at ASC, created_at DESC
     LIMIT ?`,
)
const countByStatusStmt = db.prepare(
  `SELECT status, COUNT(*) AS n FROM prospects GROUP BY status`,
)
// Status change. Stamps last_contacted_at only on the first time it reaches a
// contacted-type status (COALESCE keeps the original first-contact time).
const setStatusStmt = db.prepare(
  `UPDATE prospects SET status = @status, updated_at = unixepoch(),
     last_contacted_at = CASE WHEN @stamp = 1
       THEN COALESCE(last_contacted_at, unixepoch()) ELSE last_contacted_at END
   WHERE id = @id`,
)
const setNotesStmt = db.prepare(
  `UPDATE prospects SET notes = @notes, updated_at = unixepoch() WHERE id = @id`,
)
const setFollowupStmt = db.prepare(
  `UPDATE prospects SET next_followup_at = @at, updated_at = unixepoch() WHERE id = @id`,
)

// upsertProspect inserts a new prospect, or (when the phone is known and already
// present) enriches the existing row instead of duplicating it. Returns which
// happened so an import can report inserted vs deduped. The partial UNIQUE index
// is the hard backstop against a duplicate ever persisting.
export function upsertProspect(p: NewProspect): 'inserted' | 'updated' {
  const phoneKey = normalizePhone(p.phone ?? '')
  if (phoneKey !== '') {
    const existing = findByPhoneKeyStmt.get(phoneKey) as { id: number } | undefined
    if (existing) {
      enrichStmt.run({
        id: existing.id,
        email: (p.email ?? '').trim(),
        website: (p.website ?? '').trim(),
        town: (p.town ?? '').trim(),
        license: (p.license ?? '').trim(),
        source: (p.source ?? '').trim(),
      })
      return 'updated'
    }
  }
  insertStmt.run({
    company: p.company.trim(),
    phone: (p.phone ?? '').trim(),
    phone_key: phoneKey,
    email: (p.email ?? '').trim(),
    website: (p.website ?? '').trim(),
    town: (p.town ?? '').trim(),
    source: (p.source ?? '').trim(),
    license: (p.license ?? '').trim(),
    notes: (p.notes ?? '').trim(),
  })
  return 'inserted'
}

export function listProspects(limit = 500, status?: string): Prospect[] {
  const rows =
    status && isProspectStatus(status)
      ? (listByStatusStmt.all(status, limit) as ProspectRow[])
      : (listAllStmt.all(limit) as ProspectRow[])
  return rows.map(mapProspect)
}

// prospectCounts returns a per-status tally (every status present, zero-filled)
// for the funnel header. One grouped query, not seven.
export function prospectCounts(): Record<ProspectStatus, number> & { total: number } {
  const base = Object.fromEntries(PROSPECT_STATUSES.map((s) => [s, 0])) as Record<
    ProspectStatus,
    number
  >
  const out = { ...base, total: 0 }
  for (const r of countByStatusStmt.all() as { status: string; n: number }[]) {
    if (isProspectStatus(r.status)) out[r.status] = r.n
    out.total += r.n
  }
  return out
}

export function setProspectStatus(id: number, status: string): void {
  if (!isProspectStatus(status)) return
  setStatusStmt.run({ id, status, stamp: CONTACTED_STATUSES.has(status) ? 1 : 0 })
}

export function setProspectNotes(id: number, notes: string): void {
  setNotesStmt.run({ id, notes: notes.slice(0, 2000) })
}

// setProspectFollowup accepts a YYYY-MM-DD string (from a <input type=date>) or
// '' to clear. Parsed as local midnight to epoch seconds.
export function setProspectFollowup(id: number, date: string): void {
  const at = parseDateToEpoch(date)
  setFollowupStmt.run({ id, at })
}

function parseDateToEpoch(date: string): number | null {
  const s = (date ?? '').trim()
  if (s === '') return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (Number.isNaN(d.getTime())) return null
  return Math.floor(d.getTime() / 1000)
}

// contacted renders the last-outreach time for the admin view, or "—".
export function contactedAt(p: Pick<Prospect, 'lastContactedAt'>): string {
  return p.lastContactedAt ? formatStamp(p.lastContactedAt) : '—'
}

// followupDate renders next_followup_at back as YYYY-MM-DD for the date input
// (local date), or '' when none.
export function followupDate(p: Pick<Prospect, 'nextFollowupAt'>): string {
  if (!p.nextFollowupAt) return ''
  const d = new Date(p.nextFollowupAt * 1000)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
