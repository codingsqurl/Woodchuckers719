// lead-identity.ts — a *verified* lead identity carried in a signed, HttpOnly
// cookie. NOT a session: there is no row in the `sessions` table, no `employees`
// row, and no portal access. This only proves "Google says this email+name is
// real" so the contract/lead form can require sign-in and the boss knows exactly
// who to email back. Public-side only; completely separate from the staff auth in
// session.ts and the staff Google flow at /auth/google/*.
//
// Shape: base64url(JSON {e,n,x}) + "." + base64url(HMAC-SHA256). The HMAC key is
// LEAD_IDENTITY_SECRET, or GOOGLE_CLIENT_SECRET as a fallback (always present
// whenever the mandatory-Google flow is live, so no new env var is required). The
// client never sees the key and cannot forge the cookie; tampering fails the MAC.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const LEAD_IDENTITY_COOKIE = 'lead_id'
const TTL_MS = 2 * 60 * 60 * 1000 // 2 hours — long enough to fill the form, not a login

export type LeadIdentity = { email: string; name: string }

// signingKey returns the HMAC key, or null when neither secret is set (the whole
// feature is then "not configured" and the form falls back to its gate forever).
function signingKey(): string | null {
  return process.env.LEAD_IDENTITY_SECRET || process.env.GOOGLE_CLIENT_SECRET || null
}

function b64url(buf: Buffer): string {
  return buf.toString('base64url')
}

function mac(key: string, payload: string): Buffer {
  return createHmac('sha256', key).update(payload).digest()
}

// signLeadIdentity returns the cookie value for a verified identity, or null if
// unconfigured. exp is baked in so a stolen cookie can't outlive the window.
export function signLeadIdentity(id: LeadIdentity): string | null {
  const key = signingKey()
  if (!key) return null
  const body = JSON.stringify({ e: id.email, n: id.name, x: Date.now() + TTL_MS })
  const payload = b64url(Buffer.from(body, 'utf8'))
  const sig = b64url(mac(key, payload))
  return `${payload}.${sig}`
}

// verifyLeadIdentity validates the MAC (constant-time) and the expiry, returning
// the identity or null. Any malformed/forged/expired value is null — never throws.
export function verifyLeadIdentity(value: string | undefined): LeadIdentity | null {
  const key = signingKey()
  if (!key || !value) return null
  const dot = value.indexOf('.')
  if (dot <= 0) return null
  const payload = value.slice(0, dot)
  const sig = value.slice(dot + 1)

  let given: Buffer
  let want: Buffer
  try {
    given = Buffer.from(sig, 'base64url')
    want = mac(key, payload)
  } catch {
    return null
  }
  // timingSafeEqual throws on length mismatch; guard first, then compare.
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null

  try {
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      e?: unknown
      n?: unknown
      x?: unknown
    }
    if (typeof obj.e !== 'string' || typeof obj.n !== 'string' || typeof obj.x !== 'number') {
      return null
    }
    if (obj.x <= Date.now()) return null
    return { email: obj.e, name: obj.n }
  } catch {
    return null
  }
}

// setLeadIdentity writes the signed cookie. HttpOnly + Secure(prod) + Lax so it
// survives the OAuth redirect back from Google. Call only inside a Route Handler
// or Server Action (where next/headers permits writing cookies).
export async function setLeadIdentity(id: LeadIdentity): Promise<void> {
  const value = signLeadIdentity(id)
  if (!value) return
  const c = await cookies()
  c.set(LEAD_IDENTITY_COOKIE, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + TTL_MS),
  })
}

// readLeadIdentity returns the verified identity for this request, or null. A
// plain cookie read + MAC check — safe to call from server components and the
// server action alike.
export async function readLeadIdentity(): Promise<LeadIdentity | null> {
  const c = await cookies()
  return verifyLeadIdentity(c.get(LEAD_IDENTITY_COOKIE)?.value)
}

export async function clearLeadIdentity(): Promise<void> {
  const c = await cookies()
  c.set(LEAD_IDENTITY_COOKIE, '', { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 0 })
}
