import { NextResponse, type NextRequest } from 'next/server'
import {
  googleEnabled,
  googleExchangeAndVerify,
  SSOError,
  OAUTH_STATE_COOKIE,
  OAUTH_NONCE_COOKIE,
} from '@/lib/sso'
import { readFlowCookie, clearFlowCookie, startSession } from '@/lib/session'
import { employeeByEmail, touchLogin } from '@/lib/employees'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /auth/google/callback — verify state, exchange code, verify id_token +
// nonce, and start a session for a pre-existing employee whose email matches.
export async function GET(req: NextRequest) {
  if (!googleEnabled()) {
    return new NextResponse('Google sign-in is not configured', { status: 404 })
  }
  const url = new URL(req.url)

  // CSRF: state in the query must match the state cookie.
  const stateCookie = await readFlowCookie(OAUTH_STATE_COOKIE)
  if (!stateCookie || url.searchParams.get('state') !== stateCookie) {
    return new NextResponse('invalid SSO state', { status: 400 })
  }
  await clearFlowCookie(OAUTH_STATE_COOKIE)

  const nonceCookie = await readFlowCookie(OAUTH_NONCE_COOKIE)
  let result: { email: string; emailVerified: boolean }
  try {
    result = await googleExchangeAndVerify(url.searchParams.get('code') ?? '', nonceCookie ?? '')
  } catch (err) {
    if (err instanceof SSOError) return new NextResponse(err.message, { status: err.status })
    return new NextResponse('SSO sign-in failed', { status: 502 })
  }
  await clearFlowCookie(OAUTH_NONCE_COOKIE)

  if (!result.emailVerified) {
    return NextResponse.redirect(new URL('/admin/login?denied=google_unverified', req.url), {
      status: 303,
    })
  }

  // Pre-created only: the email must already map to an active employee. Lowercase
  // to match how accounts are stored (createEmployee/invite lowercase on write);
  // the email column is BINARY-collated, so a mixed-case id_token claim would
  // otherwise miss an account that exists.
  const e = employeeByEmail(result.email.toLowerCase())
  if (!e) {
    return NextResponse.redirect(new URL('/admin/login?denied=google_noaccount', req.url), {
      status: 303,
    })
  }

  await startSession(e.id)
  touchLogin(e.id, 'google')
  return NextResponse.redirect(new URL('/admin/portal', req.url), { status: 303 })
}
