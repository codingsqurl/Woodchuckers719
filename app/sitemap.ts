import type { MetadataRoute } from 'next'
import { appBaseURL } from '@/lib/env'
import { serviceAreas, slugify } from '@/lib/areas'
import { serviceList } from '@/lib/services'
import { postList } from '@/lib/posts'
import { locales, localePath } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

// Every public, indexable page in both languages (EN at root, ES under /es),
// each carrying hreflang alternates so Google pairs the translations. /links and
// /admin are excluded. Priorities reflect conversion value; ES trails EN slightly.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = appBaseURL()
  const lastModified = new Date()

  const corePaths = [
    { path: '/', priority: 1.0 },
    { path: '/contract-climbing', priority: 0.9 },
    { path: '/services', priority: 0.8 },
    { path: '/portfolio', priority: 0.8 },
    { path: '/areas', priority: 0.8 },
    { path: '/blog', priority: 0.6 },
  ]
  const townPaths = serviceAreas.map((name) => ({
    path: `/areas/${slugify(name)}`,
    priority: 0.7,
  }))
  // Slugs are shared across locales, so one list drives both languages.
  const servicePaths = serviceList().map((s) => ({
    path: `/services/${s.slug}`,
    priority: 0.7,
  }))
  const postPaths = postList().map((p) => ({
    path: `/blog/${p.slug}`,
    priority: 0.5,
  }))

  return [...corePaths, ...townPaths, ...servicePaths, ...postPaths].flatMap(
    ({ path, priority }) => {
      const languages = {
        en: `${base}${localePath('en', path)}`,
        es: `${base}${localePath('es', path)}`,
      }
      return locales.map((loc) => ({
        url: `${base}${localePath(loc, path)}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: loc === 'en' ? priority : Math.max(0.5, priority - 0.1),
        alternates: { languages },
      }))
    },
  )
}
