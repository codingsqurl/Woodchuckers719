// review-submissions.ts — the customer-submitted half of the reviews system.
// (The curated Google reviews KING pastes by hand live in lib/reviews.ts; this
// file is the /reviews/new form → DB → admin-moderation → display pipeline.)
//
// A submission lands as 'pending' and is invisible until an admin approves it.
// Approved rows surface on the public /reviews page ONLY when REVIEWS_PUBLIC is
// on (reviewsPublic() below) — off, the queue is a private testimonial inbox
// KING curates into lib/reviews.ts by hand.
//
// Every statement is prepared INSIDE its function, never at module scope: the
// table arrives with migration 0012 on the next boot, and preparing against a
// missing table at import time would 500 /reviews and /admin until then. The
// readers also swallow "no such table" and return empty, so both pages render
// unchanged in the window before the migration applies. Same defensive shape as
// listEstimates()'s missing-column fallback.
import { db } from './db'
import type { Review } from './reviews'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const
export function isReviewStatus(s: string): s is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(s)
}

// REVIEWS_PUBLIC gates whether approved submissions show on the public page.
// Default OFF (private/testimonial mode) — publishing customer-typed reviews is
// an explicit opt-in, never a surprise. Set REVIEWS_PUBLIC=1 (or true) to go live.
export function reviewsPublic(): boolean {
  const v = (process.env.REVIEWS_PUBLIC || '').trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes' || v === 'on'
}

export type ReviewSubmission = {
  id: number
  author: string
  rating: number
  body: string
  email: string
  town: string
  source: string
  verified: boolean
  status: ReviewStatus
  createdAt: number
}

// Inserted from the public form — no id/status/createdAt yet (status defaults to
// 'pending' in the schema).
export type NewReviewSubmission = Omit<ReviewSubmission, 'id' | 'status' | 'createdAt'>

type Row = {
  id: number
  author: string
  rating: number
  body: string
  email: string
  town: string
  source: string
  verified: number
  status: string
  created_at: number
}

function mapRow(r: Row): ReviewSubmission {
  return {
    id: r.id,
    author: r.author,
    rating: r.rating,
    body: r.body,
    email: r.email ?? '',
    town: r.town ?? '',
    source: r.source ?? '',
    verified: r.verified === 1,
    status: (isReviewStatus(r.status) ? r.status : 'pending'),
    createdAt: r.created_at,
  }
}

// True when the table hasn't been created yet (migration 0012 not applied).
function tableMissing(err: unknown): boolean {
  return err instanceof Error && err.message.includes('no such table')
}

// epoch seconds → 'YYYY-MM-DD' (UTC), the ISO date shape lib/reviews.ts uses so
// the display's monthYear() renders a customer review the same as a curated one.
function isoDate(epochSec: number): string {
  return new Date(epochSec * 1000).toISOString().slice(0, 10)
}

const SELECT_COLS =
  'id, author, rating, body, COALESCE(email, \'\') AS email, COALESCE(town, \'\') AS town, ' +
  "COALESCE(source, '') AS source, verified, status, created_at"

// createReviewSubmission inserts a pending review and returns its new id. Throws
// if the table doesn't exist yet — the caller (the server action) catches it and
// shows the visitor a transient error, exactly like createEstimate.
export function createReviewSubmission(r: NewReviewSubmission): number {
  const info = db
    .prepare(
      `INSERT INTO review_submissions (author, rating, body, email, town, source, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(r.author, r.rating, r.body, r.email, r.town, r.source, r.verified ? 1 : 0)
  return Number(info.lastInsertRowid)
}

// listReviewSubmissions returns rows for the admin queue, newest first,
// optionally filtered by status. Empty (never throws) before the table exists.
export function listReviewSubmissions(limit: number, status?: string): ReviewSubmission[] {
  const filtered = !!status && isReviewStatus(status)
  const where = filtered ? 'WHERE status = ?' : ''
  const params: (string | number)[] = filtered ? [status as string, limit] : [limit]
  try {
    const rows = db
      .prepare(`SELECT ${SELECT_COLS} FROM review_submissions ${where} ORDER BY created_at DESC LIMIT ?`)
      .all(...params) as Row[]
    return rows.map(mapRow)
  } catch (err) {
    if (tableMissing(err)) return []
    throw err
  }
}

// countPendingReviews powers the admin badge. 0 before the table exists.
export function countPendingReviews(): number {
  try {
    const row = db
      .prepare(`SELECT COUNT(*) AS n FROM review_submissions WHERE status = 'pending'`)
      .get() as { n: number } | undefined
    return row?.n ?? 0
  } catch (err) {
    if (tableMissing(err)) return 0
    throw err
  }
}

// setReviewStatus moves a submission to approved/rejected (or back to pending).
// An invalid status is a no-op, matching setEstimateStatus.
export function setReviewStatus(id: number, status: string): void {
  if (!isReviewStatus(status)) return
  try {
    db.prepare(`UPDATE review_submissions SET status = ? WHERE id = ?`).run(status, id)
  } catch (err) {
    if (tableMissing(err)) return
    throw err
  }
}

// approvedReviews returns approved submissions mapped into the shared Review
// shape (lib/reviews.ts), newest first, so the /reviews page renders them
// identically to the curated ones. Empty when REVIEWS_PUBLIC is off or the
// table doesn't exist yet — the public page never leaks a pending/unapproved row.
export function approvedReviews(): Review[] {
  if (!reviewsPublic()) return []
  try {
    const rows = db
      .prepare(
        `SELECT author, rating, body, created_at
           FROM review_submissions
          WHERE status = 'approved'
          ORDER BY created_at DESC`,
      )
      .all() as Pick<Row, 'author' | 'rating' | 'body' | 'created_at'>[]
    return rows.map((r) => ({
      author: r.author,
      rating: r.rating,
      text: r.body,
      date: isoDate(r.created_at),
    }))
  } catch (err) {
    if (tableMissing(err)) return []
    throw err
  }
}
