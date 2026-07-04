import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // Self-contained server output for the Fly Docker image.
  output: 'standalone',
  // Pin the trace root to this project (a parent dir also has a lockfile).
  outputFileTracingRoot: path.resolve(),
  // better-sqlite3 is a native addon — never bundle it, load it from node_modules.
  serverExternalPackages: ['better-sqlite3'],
  // No ESLint config shipped; don't block production builds on it.
  eslint: { ignoreDuringBuilds: true },
  // The homeowner /estimate flow is retired into the single /contract-climbing
  // intake. Permanent (308) routing-layer redirect consolidates SEO and runs
  // before the route, superseding the old 307 redirect() still in page.tsx.
  async redirects() {
    return [
      { source: '/estimate', destination: '/contract-climbing', permanent: true },
      { source: '/es/estimate', destination: '/es/contract-climbing', permanent: true },
    ]
  },
  // Cache the static media (the fixed sitewide backdrop, the video poster, the
  // proof photos, the climb video) so repeat visits and every page's background
  // don't re-fetch. Filenames are NOT content-hashed, so deliberately not
  // `immutable`: max-age keeps them a day, then stale-while-revalidate serves
  // them instantly while revalidating, so a swapped image still updates.
  async headers() {
    const cache = 'public, max-age=86400, stale-while-revalidate=604800'
    // nosniff too: the middleware matcher skips /img and /video, so these static
    // responses would otherwise ship with no MIME-sniffing protection.
    const nosniff = { key: 'X-Content-Type-Options', value: 'nosniff' }
    return [
      { source: '/img/:path*', headers: [{ key: 'Cache-Control', value: cache }, nosniff] },
      { source: '/video/:path*', headers: [{ key: 'Cache-Control', value: cache }, nosniff] },
    ]
  },
}

export default nextConfig
