// env.ts — small config helpers, ported from env.go / main.go appBaseURL.
// Next loads .env.local automatically (the Go app hand-rolled loadDotEnv).

// appBaseURL is the externally-reachable base URL, used to build links in
// emails, OAuth redirects, OG tags, robots, and the sitemap.
export function appBaseURL(): string {
  return process.env.APP_BASE_URL || 'http://localhost:3000'
}

// sessionSecret is the HS256 signing key for the stateless staff-session JWT.
// REQUIRED for staff login: with it unset, no session token can be minted or
// verified, so /admin sign-in fails closed. Generate with openssl rand -hex 32.
export function sessionSecret(): string {
  return process.env.SESSION_SECRET || ''
}
