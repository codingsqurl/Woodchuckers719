// session.ts — port of auth.go's session half. Server-side sessions table +
// opaque 256-bit hex token in an HttpOnly cookie. Cookie mutation (set/clear)
// only runs inside Server Actions or Route Handlers, where next/headers allows
// writing cookies; resolveSession is a plain DB read usable anywhere.
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from './db'
import { employeeByID, type Employee } from './employees'

export const SESSION_COOKIE = 'session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// newToken returns a random opaque 256-bit session id (hex).
function newToken(): string {
  return randomBytes(32).toString('hex')
}

// Prepared once at module load and reused — better-sqlite3 does not cache, so a
// fresh db.prepare() per call would recompile the SQL on every request. The
// sessions table exists from migration 0001, so eager prepare is safe here.
const pruneStmt = db.prepare(`DELETE FROM sessions WHERE expires_at <= ?`)
const insertStmt = db.prepare(
  `INSERT INTO sessions (token, employee_id, expires_at) VALUES (?, ?, ?)`,
)
const resolveStmt = db.prepare(`SELECT employee_id FROM sessions WHERE token = ? AND expires_at > ?`)
const deleteStmt = db.prepare(`DELETE FROM sessions WHERE token = ?`)
const deleteByEmployeeStmt = db.prepare(`DELETE FROM sessions WHERE employee_id = ?`)

// pruneExpiredSessions deletes already-expired rows so the table never grows
// unbounded on a long-running single machine. Only removes sessions that are
// already invalid (expires_at <= now), so it can never log anyone out. Cheap;
// runs opportunistically at each new login. expires_at is epoch seconds.
export function pruneExpiredSessions(): void {
  pruneStmt.run(Math.floor(Date.now() / 1000))
}

// createSessionRow persists a session row and returns its token + expiry.
export function createSessionRow(employeeID: number): { token: string; expires: Date } {
  pruneExpiredSessions()
  const token = newToken()
  const expires = new Date(Date.now() + SESSION_TTL_MS)
  insertStmt.run(token, employeeID, Math.floor(expires.getTime() / 1000))
  return { token, expires }
}

// resolveSession resolves a non-expired session token to its (active) employee.
export function resolveSession(token: string): Employee | null {
  const row = resolveStmt.get(token, Math.floor(Date.now() / 1000)) as
    | { employee_id: number }
    | undefined
  if (!row) return null
  return employeeByID(row.employee_id)
}

function deleteSession(token: string): void {
  deleteStmt.run(token)
}

// deleteSessionsForEmployee removes every session row for an account, forcing a
// log-out on all devices. Called when an account is deactivated so a stale
// cookie can't ride the remaining TTL — and can't come back to life if the
// account is re-enabled inside the 7-day window.
export function deleteSessionsForEmployee(employeeID: number): void {
  deleteByEmployeeStmt.run(employeeID)
}

// startSession creates the row and sets the cookie. The `Secure` flag is on in
// production (the target is HTTPS); off in dev so the cookie works over http.
export async function startSession(employeeID: number): Promise<void> {
  const { token, expires } = createSessionRow(employeeID)
  const c = await cookies()
  c.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires,
  })
}

// endSession destroys the current session row (if any) and clears the cookie.
export async function endSession(): Promise<void> {
  const c = await cookies()
  const token = c.get(SESSION_COOKIE)?.value
  if (token) deleteSession(token)
  c.set(SESSION_COOKIE, '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  })
}

// ── OAuth flow cookies (state / nonce), short-lived (10 min) ────────────────
export async function setFlowCookie(name: string, value: string): Promise<void> {
  const c = await cookies()
  c.set(name, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 10 * 60 * 1000),
  })
}

export async function clearFlowCookie(name: string): Promise<void> {
  const c = await cookies()
  c.set(name, '', { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 0 })
}

export async function readFlowCookie(name: string): Promise<string | undefined> {
  const c = await cookies()
  return c.get(name)?.value
}
