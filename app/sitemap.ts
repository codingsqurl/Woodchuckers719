import type { MetadataRoute } from 'next'
import { appBaseURL } from '@/lib/env'

export const dynamic = 'force-dynamic'

// The public, indexable pages (port of handleSitemap). /links and /admin excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = appBaseURL()
  return [
    { url: `${base}/` },
    { url: `${base}/portfolio` },
    { url: `${base}/areas` },
    { url: `${base}/estimate` },
  ]
}
