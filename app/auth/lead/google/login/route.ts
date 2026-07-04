import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes } from 'node:crypto'
import {
  googleEnabled,
  googleLeadAuthURL,
  LEAD_STATE_COOKIE,
  LEAD_NONCE_COOKIE,
  LEAD_RETURN_COOKIE,
} from '@/lib/sso'
import { setFlowCookie } from '@/lib/session'
import { ssoRL, clientIP } from '@/lib/ratelimit'
import { appBaseURL } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const token = () => randomBytes(32).toString('hex')

// safeReturn keeps the post-login redirect on this site. Resolve the candidate
// against the app origin and confirm it stayed same-origin, rather than
// inspecting characters — a raw tab/newline/CR (e.g. ?return=/%09//evil.com) is
// stripped by the URL parser and slips past a char-2 check, but a resolved
// cross-origin URL is caught here. Anything off-origin or unparseable falls back
// to the contract page. Returns a path+query only (never an absolute URL).
function safeReturn(raw: string | null | undefined): string {
  if (!raw) return '/contract-climbing'
  try {
    const base = appBaseURL()
    const u = new URL(raw, base)
    if (u.origin !== new URL(base).origin) return '/contract-climbing'
    return u.pathname + u.search
  } catch {
    return '/contract-climbing'
  }
}

// GET /auth/lead/google/login — start the PUBLIC lead-identity flow. Distinct
// from the staff /auth/google/login: own cookies, own redirect URI, and the
// callback sets a lead-identity cookie instead of an admin session.
export async function GET(req: NextRequest) {
  if (!googleEnabled()) {
    return new NextResponse('Google sign-in is not configured', { status: 404 })
  }
  if (!ssoRL.allow(await clientIP())) {
    return new NextResponse('too many requests, slow down', {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }
  const state = token()
  const nonce = token()
  await setFlowCookie(LEAD_STATE_COOKIE, state)
  await setFlowCookie(LEAD_NONCE_COOKIE, nonce)
  await setFlowCookie(LEAD_RETURN_COOKIE, safeReturn(new URL(req.url).searchParams.get('return')))
  return NextResponse.redirect(googleLeadAuthURL(state, nonce), { status: 303 })
}
