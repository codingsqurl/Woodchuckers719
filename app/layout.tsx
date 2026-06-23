import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Archivo, Big_Shoulders } from 'next/font/google'
import { headers } from 'next/headers'
import { appBaseURL } from '@/lib/env'

// Self-hosted brand faces (next/font downloads + serves them from /_next, so
// they load under the strict CSP that blocked the old Google Fonts <link>).
// Archivo = grotesque body; Big Shoulders Display = condensed industrial signage.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
})
const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-bsd',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(appBaseURL()),
  icons: {
    icon: [{ url: '/img/favicon.svg', type: 'image/svg+xml' }],
    apple: '/img/apple-touch-icon.png',
  },
  // Sitewide OG/Twitter image default (1200×630). Pages that set their own
  // openGraph.images override this; pages that don't (e.g. /links) inherit it.
  openGraph: {
    images: [
      {
        url: '/img/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Woodchuckers — contract tree climber, Colorado Springs',
      },
    ],
  },
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
        {/* One fixed atmospheric backdrop behind every public page; the glass
            bands and panels float over it. Omitted on the plain admin layout. */}
        {isSite ? (
          <>
            <div className="site-backdrop" aria-hidden="true" />
            <div className="site-backdrop-scrim" aria-hidden="true" />
          </>
        ) : null}
        {children}
      </body>
    </html>
  )
}
