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
    title: 'Service Areas | Woodchuckers Tree Climber',
    description:
      'Professional tree climbing across Colorado Springs and El Paso County. See every town served.',
    url: '/areas',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function AreasPage() {
  return <AreasContent locale="en" />
}
