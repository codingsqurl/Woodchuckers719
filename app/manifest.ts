import type { MetadataRoute } from 'next'

// Installable web app manifest. Next serves this at /manifest.webmanifest and
// auto-injects the <link rel="manifest"> sitewide. The intent is the staff app:
// start at the portal (the canonical authenticated landing — it bounces to the
// login when the 7-day session has lapsed, so the installed icon never opens a
// dead 404 the way bare /admin would under deny-by-vanishing). scope stays '/'
// so SSO callbacks under /auth don't kick the standalone window out to Safari.
// No service worker on purpose: a leads dashboard wants live data, not a cache.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Woodchuckers Staff',
    short_name: 'Woodchuckers',
    description: 'Woodchuckers staff portal for estimate requests and crew.',
    start_url: '/admin/portal',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#14532d',
    icons: [
      { src: '/img/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
