import type { Metadata, Viewport } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { HomeContent } from './home-content'

const t = getDict('en').home

export const viewport: Viewport = { themeColor: '#06160d' }

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/', languages: altLanguages('/') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: 'Woodchuckers | Professional Tree Climber, Colorado Springs',
    description:
      'Tree removal, trimming, and technical climbing in Colorado Springs. Owner-operated, fast, and safe. Free estimates. Se habla español.',
    url: '/',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function HomePage() {
  return <HomeContent locale="en" />
}
