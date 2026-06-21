import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes } from 'node:crypto'
import { githubEnabled, githubAuthURL, OAUTH_STATE_COOKIE } from '@/lib/sso'
import { setFlowCookie } from '@/lib/session'
import { ssoRL, clientIP } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const token = () => randomBytes(32).toString('hex')

// GET /auth/github/login — start the OAuth flow (sets the state cookie).
export async function GET(_req: NextRequest) {
  if (!githubEnabled()) {
    return new NextResponse('GitHub sign-in is not configured', { status: 404 })
  }
  if (!ssoRL.allow(await clientIP())) {
    return new NextResponse('too many requests, slow down', {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }
  const state = token()
  await setFlowCookie(OAUTH_STATE_COOKIE, state)
  return NextResponse.redirect(githubAuthURL(state), { status: 303 })
}
