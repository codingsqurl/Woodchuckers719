// estimates.ts — port of the Estimate half of store.go plus the tree-summary
// and clamp helpers from handlers_estimate.go.
import { db } from './db'
import { formatStamp } from './format'

export type Estimate = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  service: string
  details: string
  source: string // how they heard about us (marketing attribution)
  removalInfo: string // tree-removal specifics (height, proximity, etc.)
  estDays: number
  cleanup: boolean // on-site cut & pile (+$100)
  debrisRemoval: boolean // organized full haul-off (+$150)
  estLow: number // whole dollars
  estHigh: number
  status: string
  createdAt: number
}

// NewEstimate is the shape inserted from the public form (no id/status/createdAt yet).
export type NewEstimate = Omit<Estimate, 'id' | 'status' | 'createdAt'>

type EstimateRow = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  service: string
  details: string
  source: string
  removal_info: string
  est_days: number
  cleanup: number
  debris_removal: number
  est_low: number
  est_high: number
  status: string
  created_at: number
}

function mapEstimate(r: EstimateRow): Estimate {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    address: r.address,
    service: r.service,
    details: r.details,
    source: r.source,
    removalInfo: r.removal_info,
    estDays: r.est_days,
    cleanup: r.cleanup === 1,
    debrisRemoval: r.debris_removal === 1,
    estLow: r.est_low,
    estHigh: r.est_high,
    status: r.status,
    createdAt: r.created_at,
  }
}

// createEstimate inserts a public estimate request and returns its new id.
export function createEstimate(e: NewEstimate): number {
  const info = db
    .prepare(
      `INSERT INTO estimates
         (name, email, phone, address, service, details, source, removal_info, est_days, cleanup, debris_removal, est_low, est_high)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      e.name,
      e.email,
      e.phone,
      e.address,
      e.service,
      e.details,
      e.source,
      e.removalInfo,
      e.estDays,
      e.cleanup ? 1 : 0,
      e.debrisRemoval ? 1 : 0,
      e.estLow,
      e.estHigh,
    )
  return Number(info.lastInsertRowid)
}

// listEstimates returns recent estimate requests, newest first, for the admin view.
export function listEstimates(limit: number): Estimate[] {
  const rows = db
    .prepare(
      `SELECT id, name, email, phone, address, service, details, COALESCE(source, '') AS source,
              COALESCE(removal_info, '') AS removal_info, est_days, cleanup, debris_removal,
              est_low, est_high, status, created_at
       FROM estimates ORDER BY created_at DESC LIMIT ?`,
    )
    .all(limit) as EstimateRow[]
  return rows.map(mapEstimate)
}

// DebrisLabel describes the chosen debris add-on for the owner views.
export function debrisLabel(e: Pick<Estimate, 'cleanup' | 'debrisRemoval'>): string {
  if (e.debrisRemoval) return 'Full removal (+$150)'
  if (e.cleanup) return 'On-site cleanup (+$100)'
  return 'None'
}

// Submitted renders the request time for the admin view, e.g. "Jan 2, 3:04 PM".
export function submitted(e: Pick<Estimate, 'createdAt'>): string {
  return formatStamp(e.createdAt)
}

// Contact returns the best single contact line for the admin list.
export function contact(e: Pick<Estimate, 'phone' | 'email'>): string {
  if (e.phone && e.email) return `${e.phone} · ${e.email}`
  if (e.phone) return e.phone
  return e.email
}

// Per-tree builder columns submitted as parallel arrays (order matters — the
// server zips them by index).
export type TreeColumns = {
  service: string[]
  species: string[]
  height: string[]
  condition: string[]
  near: string[]
  drop: string[]
}

const TREE_LABELS: Record<string, string> = {
  remove: 'Remove',
  trim: 'Trim',
  sectional: 'Sectional removal',
  storm: 'Storm damage',
  unsure: 'Not sure',
}

// summarizeTrees turns the per-tree builder rows into a short service summary
// (e.g. "3 trees (2 Remove, 1 Trim)") plus a detailed per-tree breakdown
// ("Tree 1: Remove, Oak, 40ft, ... | Tree 2: ..."). Port of summarizeTrees.
export function summarizeTrees(cols: TreeColumns): { service: string; detail: string } {
  const services = cols.service
  if (services.length === 0) return { service: '', detail: '' }

  const at = (arr: string[], i: number): string => (i < arr.length ? arr[i].trim() : '')
  const extraCols = [cols.species, cols.height, cols.condition, cols.near, cols.drop]

  const lines: string[] = []
  const order: string[] = []
  const counts = new Map<string, number>()

  for (let i = 0; i < services.length; i++) {
    const sv = TREE_LABELS[services[i]] ?? services[i]
    const parts = [sv]
    for (const col of extraCols) {
      const v = at(col, i)
      if (v !== '') parts.push(v)
    }
    lines.push(`Tree ${i + 1}: ${parts.join(', ')}`)
    if (!counts.has(sv)) order.push(sv)
    counts.set(sv, (counts.get(sv) ?? 0) + 1)
  }

  const sum = order.map((sv) => `${counts.get(sv)} ${sv}`)
  const noun = services.length !== 1 ? 'trees' : 'tree'
  return {
    service: `${services.length} ${noun} (${sum.join(', ')})`,
    detail: lines.join(' | '),
  }
}

// atoiClamp parses s as an int, returning lo on failure, then clamps to [lo, hi].
export function atoiClamp(s: string, lo: number, hi: number): number {
  const n = parseInt((s ?? '').trim(), 10)
  if (Number.isNaN(n)) return lo
  if (n < lo) return lo
  if (n > hi) return hi
  return n
}
