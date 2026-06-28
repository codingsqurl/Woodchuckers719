// /es/blog/feed.xml — Spanish RSS 2.0 for the Field Notes hub, mirror of the EN
// /blog/feed.xml. Built from postList('es'), same slugs, ES links and copy.
import { postList } from '@/lib/posts'
import { appBaseURL } from '@/lib/env'
import { localePath } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const base = appBaseURL()
  const self = `${base}/es/blog/feed.xml`
  const buildDate = new Date().toUTCString()

  const items = postList('es')
    .map((p) => {
      const url = `${base}${localePath('es', `/blog/${p.slug}`)}`
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Woodchuckers — Notas de Campo</title>
    <link>${xml(`${base}${localePath('es', '/blog')}`)}</link>
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml"/>
    <description>Notas de campo sobre escalada de árboles por contrato en Colorado Springs.</description>
    <language>es-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
