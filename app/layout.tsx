import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Archivo, Big_Shoulders } from 'next/font/google'
import { headers } from 'next/headers'
import { appBaseURL } from '@/lib/env'
import { Haptics } from './components/haptics'

// Self-hosted brand faces (next/font downloads + serves them from /_next, so
// they load under the strict CSP that blocked the old Google Fonts <link>).
// Archivo = grotesque body; Big Shoulders Display = condensed industrial signage.
const archivo = Archivo({
  subsets: ['latin'],
  // 400 (body default), 600 (labels), 700 (bold). 500 was declared but never
  // used anywhere in the CSS — dropping it saves a font file on every page.
  weight: ['400', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
})
const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  // 900 was declared but never used in the CSS (headings run 700/800) — drop it.
  weight: ['600', '700', '800'],
  variable: '--font-bsd',
  display: 'swap',
  // next/font has no size-adjust metrics for "Big Shoulders", so it skips the
  // auto-generated fallback and warns. We declare the system fallback ourselves
  // and turn the metric-override off — silences the warning, no visual change
  // (display:swap + the system-ui stack in globals.css already cover the swap).
  adjustFontFallback: false,
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(appBaseURL()),
  icons: {
    icon: [{ url: '/img/favicon.svg', type: 'image/svg+xml' }],
    apple: '/img/apple-touch-icon.png',
  },
  // Added to the iPhone home screen, the staff app launches standalone (no
  // Safari chrome). These three tags are what iOS reads; the manifest covers
  // Android. title is the home-screen label; 'default' keeps a normal status
  // bar so content never slides under the notch.
  appleWebApp: {
    capable: true,
    title: 'Woodchuckers',
    statusBarStyle: 'default',
  },
  // Sitewide OG/Twitter image default (1200×630). Pages that set their own
  // openGraph.images override this; pages that don't (e.g. /links) inherit it.
  openGraph: {
    images: [
      {
        url: '/img/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Woodchuckers contract tree climber, Colorado Springs',
      },
    ],
  },
  // Sitewide Twitter card default; pages inherit it unless they set their own.
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#14532d',
}

// The single root layout owns <html>/<body>. The body class drives the whole
// theme (body.site / body.site.home / plain admin), so it's derived per request
// from the path that middleware.ts stamps onto the x-pathname header. The same
// path tells us the locale: Spanish lives under /es, English at the root.
function localeOf(pathname: string): 'en' | 'es' {
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en'
}

function bodyClass(pathname: string): string {
  // strip the /es prefix so the theme rules match for both languages
  const p = pathname === '/es' ? '/' : pathname.startsWith('/es/') ? pathname.slice(3) : pathname
  if (p === '/') return 'site home'
  if (p.startsWith('/admin')) return '' // admin/auth: plain constrained layout
  return 'site' // marketing, links, and themed 404/500
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? ''
  const cls = bodyClass(pathname)
  const isSite = cls.startsWith('site')
  return (
    <html lang={localeOf(pathname)} className={`${archivo.variable} ${bigShoulders.variable}`}>
      <body className={cls}>
        {/* Fixed misty-pine backdrop behind every public page; the glass bands
            scroll over it. Each hero paints its own treetotree photo on top
            (isolation + ::before), so the hero stays its own shot. Omitted on the
            plain admin layout. */}
        {isSite ? (
          <>
            <div className="site-backdrop" aria-hidden="true" />
            <div className="site-backdrop-scrim" aria-hidden="true" />
          </>
        ) : null}
        {children}
        {/* Delegated haptic tap on call/email buttons only; no-ops without the
            Vibration API (iOS). Client island that renders nothing. */}
        <Haptics />
      </body>
    </html>
  )
}
