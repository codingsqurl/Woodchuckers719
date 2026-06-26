import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { AreasContent } from '../../areas/areas-content'

const t = getDict('es').areas

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/es/areas', languages: altLanguages('/areas') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: 'Dónde Escala por Contrato Woodchuckers | Colorado Springs',
    description:
      'Escalada por contrato para empresas de árboles en Colorado Springs y el condado de El Paso. Traigo mi propio equipo y escalo la pieza que su cuadrilla no alcanza.',
    url: '/es/areas',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function AreasPageEs() {
  return <AreasContent locale="es" />
}
