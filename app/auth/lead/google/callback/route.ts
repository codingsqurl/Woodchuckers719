import { NextResponse, type NextRequest } from 'next/server'
import {
  googleEnabled,
  googleLeadExchangeAndVerify,
  SSOError,
  LEAD_STATE_COOKIE,
  LEAD_NONCE_COOKIE,
  LEAD_RETURN_COOKIE,
} from '@/lib/sso'
import { readFlowCookie, clearFlowCookie } from '@/lib/session'
import { setLeadIdentity } from '@/lib/lead-identity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// safeReturn mirrors the login route: keep the redirect on-site. Open-redirect guard.
function safeReturn(raw: string | undefined): string {
  if (!raw || raw[0] !== '/' || raw[1] === '/' || raw[1] === '\\') return '/contract-climbing'
  return raw
}

// GET /auth/lead/google/callback — finish the PUBLIC lead-identity flow. Verify
// state + id_token + nonce, then drop a signed lead-identity cookie and bounce
// back to the form. Deliberately does NOT create an employee or a session: a lead
// is never a staff account.
export async function GET(req: NextRequest) {
  if (!googleEnabled()) {
    return new NextResponse('Google sign-in is not configured', { status: 404 })
  }
  const url = new URL(req.url)
  const back = safeReturn(await readFlowCookie(LEAD_RETURN_COOKIE))

  // CSRF: state in the query must match the state cookie.
  const stateCookie = await readFlowCookie(LEAD_STATE_COOKIE)
  if (!stateCookie || url.searchParams.get('state') !== stateCookie) {
    return new NextResponse('invalid SSO state', { status: 400 })
  }
  await clearFlowCookie(LEAD_STATE_COOKIE)

  const nonceCookie = await readFlowCookie(LEAD_NONCE_COOKIE)
  let result: { email: string; emailVerified: boolean; name: string }
  try {
    result = await googleLeadExchangeAndVerify(
      url.searchParams.get('code') ?? '',
      nonceCookie ?? '',
    )
  } catch (err) {
    if (err instanceof SSOError) return new NextResponse(err.message, { status: err.status })
    return new NextResponse('SSO sign-in failed', { status: 502 })
  }
  await clearFlowCookie(LEAD_NONCE_COOKIE)
  await clearFlowCookie(LEAD_RETURN_COOKIE)

  // Only a Google-verified email counts; bounce back with a flag the form shows.
  if (!result.emailVerified) {
    const u = new URL(back, req.url)
    u.searchParams.set('signin', 'unverified')
    return NextResponse.redirect(u, { status: 303 })
  }

  // Fall back to the email's local part if Google withheld a display name.
  const name = result.name.trim() || result.email.split('@')[0]
  await setLeadIdentity({ email: result.email, name })
  return NextResponse.redirect(new URL(back, req.url), { status: 303 })
}
