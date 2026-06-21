import './globals.css'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { appBaseURL } from '@/lib/env'

export const metadata: Metadata = {
  metadataBase: new URL(appBaseURL()),
  icons: {
    icon: [{ url: '/img/favicon.svg', type: 'image/svg+xml' }],
    apple: '/img/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#14532d',
}

// The single root layout owns <html>/<body>. The body class drives the whole
// theme (body.site / body.site.home / plain admin), so it's derived per request
// from the path that middleware.ts stamps onto the x-pathname header.
function bodyClass(pathname: string): string {
  if (pathname === '/') return 'site home'
  if (pathname.startsWith('/admin')) return '' // admin/auth: plain constrained layout
  return 'site' // marketing, links, and themed 404/500
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? ''
  return (
    <html lang="en">
      <body className={bodyClass(pathname)}>{children}</body>
    </html>
  )
}
