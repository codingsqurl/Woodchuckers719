import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { ServicesContent } from './services-content'

const ts = getDict('en').services

export const metadata: Metadata = {
  title: ts.metaTitle,
  description: ts.metaDesc,
  alternates: { canonical: '/services', languages: altLanguages('/services') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: ts.ogTitle,
    description: ts.metaDesc,
    url: '/services',
    images: [
      {
        url: '/img/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Woodchuckers contract tree climber, the services a tree company can book by the day in Colorado Springs.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: ts.ogTitle, description: ts.metaDesc },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function ServicesIndexPage() {
  return <ServicesContent locale="en" />
}
