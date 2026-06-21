// sso.ts — port of sso.go. Google (full OIDC with id_token verification) and
// GitHub (plain OAuth2 + email API). Both are OPTIONAL: disabled unless their
// env vars are set, in which case the buttons hide and the routes 404 in
// effect. Redirect URIs must stay byte-identical to the registered OAuth apps.
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { appBaseURL } from './env'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_ISSUER = 'https://accounts.google.com'
const GOOGLE_JWKS_URL = new URL('https://www.googleapis.com/oauth2/v3/certs')

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails'

export const OAUTH_STATE_COOKIE = 'oauth_state'
export const OAUTH_NONCE_COOKIE = 'oauth_nonce'

// SSOError carries an HTTP status the route handler should surface verbatim.
export class SSOError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export function googleEnabled(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

export function githubEnabled(): boolean {
  return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
}

function googleRedirectURI(): string {
  return `${appBaseURL()}/auth/google/callback`
}

function githubRedirectURI(): string {
  return `${appBaseURL()}/auth/github/callback`
}

// ── Google ──────────────────────────────────────────────────────────────────
export function googleAuthURL(state: string, nonce: string): string {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectURI(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
  })
  return `${GOOGLE_AUTH_URL}?${p.toString()}`
}

const g = globalThis as unknown as { __googleJWKS?: ReturnType<typeof createRemoteJWKSet> }
function googleJWKS() {
  return (g.__googleJWKS ??= createRemoteJWKSet(GOOGLE_JWKS_URL))
}

// googleExchangeAndVerify swaps the code for tokens, verifies the id_token
// signature/issuer/audience, checks the replay nonce, and returns the email
// claim plus whether Google marked it verified.
export async function googleExchangeAndVerify(
  code: string,
  expectedNonce: string,
): Promise<{ email: string; emailVerified: boolean }> {
  let res: Response
  try {
    res = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: googleRedirectURI(),
        grant_type: 'authorization_code',
      }),
    })
  } catch {
    throw new SSOError(502, 'SSO token exchange failed')
  }
  if (!res.ok) throw new SSOError(502, 'SSO token exchange failed')

  const tok = (await res.json()) as { id_token?: string }
  if (!tok.id_token) throw new SSOError(502, 'no id_token in SSO response')

  let payload
  try {
    ;({ payload } = await jwtVerify(tok.id_token, googleJWKS(), {
      issuer: GOOGLE_ISSUER,
      audience: process.env.GOOGLE_CLIENT_ID,
    }))
  } catch {
    throw new SSOError(502, 'could not verify SSO token')
  }

  // Replay protection: the id_token nonce must match the nonce cookie.
  if (payload.nonce !== expectedNonce) throw new SSOError(400, 'invalid SSO nonce')

  const email = typeof payload.email === 'string' ? payload.email : ''
  if (email === '') throw new SSOError(502, 'no email in SSO response')
  const emailVerified = payload.email_verified === true || payload.email_verified === 'true'
  return { email, emailVerified }
}

// ── GitHub ──────────────────────────────────────────────────────────────────
export function githubAuthURL(state: string): string {
  const p = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: githubRedirectURI(),
    scope: 'read:user user:email',
    state,
  })
  return `${GITHUB_AUTH_URL}?${p.toString()}`
}

export async function githubExchange(code: string): Promise<string> {
  let res: Response
  try {
    res = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
        redirect_uri: githubRedirectURI(),
      }),
    })
  } catch {
    throw new SSOError(502, 'SSO token exchange failed')
  }
  if (!res.ok) throw new SSOError(502, 'SSO token exchange failed')
  const j = (await res.json()) as { access_token?: string }
  if (!j.access_token) throw new SSOError(502, 'SSO token exchange failed')
  return j.access_token
}

// githubPrimaryEmail returns the user's primary, verified email (lowercased),
// or "" if none qualifies.
export async function githubPrimaryEmail(accessToken: string): Promise<string> {
  let res: Response
  try {
    res = await fetch(GITHUB_EMAILS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'woodchuckers',
      },
    })
  } catch {
    throw new SSOError(502, 'could not read GitHub email')
  }
  if (!res.ok) throw new SSOError(502, 'could not read GitHub email')
  const emails = (await res.json()) as { email: string; primary: boolean; verified: boolean }[]
  for (const e of emails) {
    if (e.primary && e.verified) return e.email.toLowerCase()
  }
  return ''
}
