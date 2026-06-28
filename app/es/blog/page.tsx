import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { BlogContent } from '@/app/blog/blog-content'

const tb = getDict('es').blog

export const metadata: Metadata = {
  title: tb.metaTitle,
  description: tb.metaDesc,
  alternates: {
    canonical: '/es/blog',
    languages: altLanguages('/blog'),
    types: { 'application/rss+xml': '/blog/feed.xml' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: tb.ogTitle,
    description: tb.metaDesc,
    url: '/es/blog',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function BlogIndexPageEs() {
  return <BlogContent locale="es" />
}
