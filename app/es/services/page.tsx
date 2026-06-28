import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { ServicesContent } from '@/app/services/services-content'

const ts = getDict('es').services

export const metadata: Metadata = {
  title: ts.metaTitle,
  description: ts.metaDesc,
  alternates: { canonical: '/es/services', languages: altLanguages('/services') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: ts.ogTitle,
    description: ts.metaDesc,
    url: '/es/services',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function ServicesPageEs() {
  return <ServicesContent locale="es" />
}
