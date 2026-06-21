import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes } from 'node:crypto'
import { googleEnabled, googleAuthURL, OAUTH_STATE_COOKIE, OAUTH_NONCE_COOKIE } from '@/lib/sso'
import { setFlowCookie } from '@/lib/session'
import { ssoRL, clientIP } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const token = () => randomBytes(32).toString('hex')

// GET /auth/google/login — start the OAuth flow (sets state + nonce cookies).
export async function GET(_req: NextRequest) {
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
  await setFlowCookie(OAUTH_STATE_COOKIE, state)
  await setFlowCookie(OAUTH_NONCE_COOKIE, nonce)
  return NextResponse.redirect(googleAuthURL(state, nonce), { status: 303 })
}
