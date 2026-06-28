import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { BlogContent } from './blog-content'

const tb = getDict('en').blog

export const metadata: Metadata = {
  title: tb.metaTitle,
  description: tb.metaDesc,
  alternates: {
    canonical: '/blog',
    languages: altLanguages('/blog'),
    types: { 'application/rss+xml': '/blog/feed.xml' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: tb.ogTitle,
    description: tb.metaDesc,
    url: '/blog',
    images: [
      {
        url: '/img/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Woodchuckers field notes on contract tree climbing in Colorado Springs.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: tb.ogTitle, description: tb.metaDesc },
}

export default function BlogIndexPage() {
  return <BlogContent locale="en" />
}
