import { NextResponse, type NextRequest } from 'next/server'
import {
  githubEnabled,
  githubExchange,
  githubPrimaryEmail,
  SSOError,
  OAUTH_STATE_COOKIE,
} from '@/lib/sso'
import { readFlowCookie, clearFlowCookie, startSession } from '@/lib/session'
import { employeeByEmail, touchLogin } from '@/lib/employees'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /auth/github/callback — verify state, exchange code, read the user's
// primary verified email, and start a session for a matching employee.
export async function GET(req: NextRequest) {
  if (!githubEnabled()) {
    return new NextResponse('GitHub sign-in is not configured', { status: 404 })
  }
  const url = new URL(req.url)

  const stateCookie = await readFlowCookie(OAUTH_STATE_COOKIE)
  if (!stateCookie || url.searchParams.get('state') !== stateCookie) {
    return new NextResponse('invalid SSO state', { status: 400 })
  }
  await clearFlowCookie(OAUTH_STATE_COOKIE)

  let email: string
  try {
    const accessToken = await githubExchange(url.searchParams.get('code') ?? '')
    email = await githubPrimaryEmail(accessToken)
  } catch (err) {
    if (err instanceof SSOError) return new NextResponse(err.message, { status: err.status })
    return new NextResponse('SSO sign-in failed', { status: 502 })
  }

  if (email === '') {
    return NextResponse.redirect(new URL('/admin/login?denied=github_noemail', req.url), {
      status: 303,
    })
  }

  const e = employeeByEmail(email)
  if (!e) {
    return NextResponse.redirect(new URL('/admin/login?denied=github_noaccount', req.url), {
      status: 303,
    })
  }

  await startSession(e.id)
  touchLogin(e.id, 'github')
  return NextResponse.redirect(new URL('/admin/portal', req.url), { status: 303 })
}
