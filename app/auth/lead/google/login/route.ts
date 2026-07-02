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

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const token = () => randomBytes(32).toString('hex')

// safeReturn keeps the post-login redirect on this site: a single leading slash,
// never a scheme-relative "//evil.com" or a back-slash trick. Anything else falls
// back to the contract page. Open-redirect guard.
function safeReturn(raw: string | null): string {
  if (!raw || raw[0] !== '/' || raw[1] === '/' || raw[1] === '\\') return '/contract-climbing'
  return raw
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
