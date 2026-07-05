// session.ts — the staff-session half of auth. Stateless: a signed JWT (HS256)
// in an HttpOnly cookie, no server-side `sessions` table. The cookie carries
// only the employee id (JWT `sub`); every request verifies the signature, then
// resolveSession hydrates the employee from the DB — so employeeByID's
// `active = 1` filter still logs out a deactivated account on its next request.
// What statelessness costs: no per-session revoke (a leaked token is valid until
// it expires); deactivating the employee, or rotating SESSION_SECRET, are the
// revocation levers. The `sessions` table from migration 0001 is now unused.
//
// Cookie mutation (set/clear) only runs inside Server Actions or Route Handlers,
// where next/headers allows writing cookies; resolveSession is a read usable
// anywhere. The OAuth flow-cookie helpers (state/nonce) are unchanged.
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { employeeByID, type Employee } from './employees'
import { sessionSecret } from './env'

export const SESSION_COOKIE = 'session'
const SESSION_TTL_S = 7 * 24 * 60 * 60 // 7 days

// The HMAC key as bytes, or null when SESSION_SECRET is unset (fail closed).
function key(): Uint8Array | null {
  const s = sessionSecret()
  return s ? new TextEncoder().encode(s) : null
}

// resolveSession verifies a session JWT and resolves it to its (active)
// employee, or null. Any bad/expired/forged/deactivated case is null — never
// throws. Async because JWT verification is async (the old opaque-token lookup
// was sync; callers already await currentUser()).
export async function resolveSession(token: string): Promise<Employee | null> {
  const k = key()
  if (!k) return null
  try {
    const { payload } = await jwtVerify(token, k, { algorithms: ['HS256'] })
    const id = Number(payload.sub)
    if (!Number.isInteger(id) || id <= 0) return null
    return employeeByID(id)
  } catch {
    return null
  }
}

// startSession mints the JWT and sets the cookie. `Secure` is on in production
// (HTTPS target); off in dev so the cookie works over http.
export async function startSession(employeeID: number): Promise<void> {
  const k = key()
  if (!k) throw new Error('SESSION_SECRET is not set; cannot start a session')
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(employeeID))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_S}s`)
    .sign(k)
  const c = await cookies()
  c.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + SESSION_TTL_S * 1000),
  })
}

// endSession clears the cookie. Stateless: nothing to delete server-side.
export async function endSession(): Promise<void> {
  const c = await cookies()
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
