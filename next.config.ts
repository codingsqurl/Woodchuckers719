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
}

export default nextConfig
