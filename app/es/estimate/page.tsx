import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { EstimateContent } from '../../estimate/estimate-content'

const t = getDict('es').estimate

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/es/estimate', languages: altLanguages('/estimate') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: 'Presupuesto Gratis | Woodchuckers Servicio de Árboles',
    description: 'Trabajo de árboles por día en Colorado Springs. Reciba un aproximado gratis y solicite un presupuesto.',
    url: '/es/estimate',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function EstimatePageEs() {
  return <EstimateContent locale="es" />
}
