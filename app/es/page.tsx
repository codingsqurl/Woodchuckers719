import type { Metadata, Viewport } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { HomeContent } from '../home-content'

const t = getDict('es').home

export const viewport: Viewport = { themeColor: '#06160d' }

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/es', languages: altLanguages('/') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: 'Woodchuckers | Escalador de Árboles por Contrato, Colorado Springs',
    description:
      'Escalador de árboles por contrato en Colorado Springs. Empresas y cuadrillas: traigo mi propio equipo, escalo la pieza que su equipo no alcanza y la bajo. Se habla español.',
    url: '/es',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function HomePageEs() {
  return <HomeContent locale="es" />
}
