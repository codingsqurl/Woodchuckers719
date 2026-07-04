// ratelimit.ts — port of security.go's rateLimiter. In-memory fixed-window,
// keyed by client IP. Module-level singletons (cached on globalThis) survive
// across requests within one Node process — which is exactly why the deploy is
// a single Fly machine. On serverless / multi-instance this silently stops
// working; do not deploy that way.
import { headers } from 'next/headers'

type HitWindow = { count: number; reset: number } // reset = epoch ms

class RateLimiter {
  private hits = new Map<string, HitWindow>()
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  // allow records a hit for key and reports whether it is within the limit.
  allow(key: string): boolean {
    const now = Date.now()
    if (this.hits.size > 4096) this.pruneExpired(now)

    const w = this.hits.get(key)
    if (!w || now > w.reset) {
      this.hits.set(key, { count: 1, reset: now + this.windowMs })
      return true
    }
    if (w.count >= this.limit) return false
    w.count++
    return true
  }

  private pruneExpired(now: number): void {
    for (const [k, w] of this.hits) {
      if (now > w.reset) this.hits.delete(k)
    }
  }
}

const g = globalThis as unknown as {
  __loginRL?: RateLimiter
  __estimateRL?: RateLimiter
  __ssoRL?: RateLimiter
  __autoReplyRL?: RateLimiter
}

// Brute-force throttle on auth attempts; spam throttle on the estimate form.
export const loginRL: RateLimiter = (g.__loginRL ??= new RateLimiter(10, 60_000))
export const estimateRL: RateLimiter = (g.__estimateRL ??= new RateLimiter(5, 60_000))
export const ssoRL: RateLimiter = (g.__ssoRL ??= new RateLimiter(10, 60_000))
// Per-recipient cap on the lead auto-reply (keyed on the lowercased email, not
// IP) so the public form can't be turned into a mailer aimed at a third party.
export const autoReplyRL: RateLimiter = (g.__autoReplyRL ??= new RateLimiter(1, 3_600_000))

// clientIP resolves the caller's IP. Behind Fly's proxy, trust Fly-Client-IP,
// else the right-most (closest, trusted) hop of X-Forwarded-For — never the
// spoofable left-most entry. Falls back to a constant in local dev.
export async function clientIP(): Promise<string> {
  const h = await headers()
  const fly = h.get('fly-client-ip')
  if (fly) return fly.trim()
  const xff = h.get('x-forwarded-for')
  if (xff) {
    const parts = xff
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return '127.0.0.1'
}
