// /blog/feed.xml — RSS 2.0 for the Field Notes content hub. Built from the same
// postList() the blog pages render, so the feed never drifts from the site. No
// dependency: raw string + XML escaping. English-only for now, matching the blog.
import { postList } from '@/lib/posts'
import { appBaseURL } from '@/lib/env'

export const dynamic = 'force-dynamic'

// XML escape for text nodes (RSS items are wrapped in CDATA where they hold
// prose, but titles/links go through this).
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
  const self = `${base}/blog/feed.xml`
  const buildDate = new Date().toUTCString()

  const items = postList()
    .map((p) => {
      const url = `${base}/blog/${p.slug}`
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
    <title>Woodchuckers — Field Notes</title>
    <link>${xml(`${base}/blog`)}</link>
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml"/>
    <description>Field notes on contract tree climbing in Colorado Springs.</description>
    <language>en-US</language>
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
