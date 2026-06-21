import { NextResponse, type NextRequest } from 'next/server'

// Security headers for every response (port of securityHeaders) plus a
// per-request CSP nonce so Next can hydrate without 'unsafe-inline'. The nonce
// is exposed to the app on a request header; Next reads the request CSP header
// to nonce its own scripts. We also stamp x-pathname so the single root layout
// can pick the right <body> theme class per route.
//
// This middleware never touches the database — session lookup stays in Node
// (RSC / route handlers), per the better-sqlite3-is-Node-only constraint.
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV !== 'production'

  // strict-dynamic trusts the nonced bootstrap and the chunks it loads. In dev,
  // Next's react-refresh needs eval; production stays strict (no unsafe-eval).
  const scriptSrc = `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`

  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    scriptSrc,
    'frame-src https://www.google.com https://maps.google.com',
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  // Next extracts the nonce from this request header and applies it to its scripts.
  requestHeaders.set('content-security-policy', csp)

  const res = NextResponse.next({ request: { headers: requestHeaders } })
  res.headers.set('Content-Security-Policy', csp)
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'same-origin')
  res.headers.set('Strict-Transport-Security', 'max-age=31536000')
  return res
}

export const config = {
  // Run on everything except Next's build assets and the favicon.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
