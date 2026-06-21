// auth.ts — port of withUser / requireAuth / requireAdmin from auth.go.
//
// currentUser is the withUser equivalent: it reads the session cookie and
// resolves the active employee, cached per-request (React cache) so multiple
// callers in one render share a single DB lookup. It runs in Node (RSC / route
// handler / server action), NOT Edge middleware, because it touches
// better-sqlite3.
import { cache } from 'react'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { resolveSession, SESSION_COOKIE } from './session'
import { isAdmin, type Employee } from './employees'

export const currentUser = cache(async (): Promise<Employee | null> => {
  const c = await cookies()
  const token = c.get(SESSION_COOKIE)?.value
  if (!token) return null
  return resolveSession(token)
})

// requireAuth sends unauthenticated users to the staff login (Go used a 303;
// Next's redirect() is a 307, which for a GET navigation lands the same place).
export async function requireAuth(): Promise<Employee> {
  const u = await currentUser()
  if (!u) redirect('/admin/login')
  return u
}

// requireAdmin gates admin-only surfaces. Anyone who is not a signed-in admin —
// the public included — gets a plain 404 (notFound()), so the route is
// indistinguishable from one that does not exist. No redirect, no 403: deny by
// vanishing. Server Actions guarding admin mutations call this too.
export async function requireAdmin(): Promise<Employee> {
  const u = await currentUser()
  if (!u || !isAdmin(u)) notFound()
  return u
}
