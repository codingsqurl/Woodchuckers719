import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { AreasContent } from './areas-content'

const t = getDict('en').areas

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/areas', languages: altLanguages('/areas') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: 'Where Woodchuckers Climbs Contract | Colorado Springs',
    description:
      'Contract tree climbing for tree companies across Colorado Springs and El Paso County. I bring my own gear and climb the piece past your crew.',
    url: '/areas',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function AreasPage() {
  return <AreasContent locale="en" />
}
