import type { MetadataRoute } from 'next'
import { appBaseURL } from '@/lib/env'

export const dynamic = 'force-dynamic'

// Let crawlers index the public site, keep them out of /admin (port of handleRobots).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: `${appBaseURL()}/sitemap.xml`,
  }
}
