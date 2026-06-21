// env.ts — small config helpers, ported from env.go / main.go appBaseURL.
// Next loads .env.local automatically (the Go app hand-rolled loadDotEnv).

// appBaseURL is the externally-reachable base URL, used to build links in
// emails, OAuth redirects, OG tags, robots, and the sitemap.
export function appBaseURL(): string {
  return process.env.APP_BASE_URL || 'http://localhost:3000'
}
