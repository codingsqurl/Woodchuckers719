import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { PortfolioContent } from '../../portfolio/portfolio-content'

const t = getDict('es').work

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/es/portfolio', languages: altLanguages('/portfolio') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: 'Mi Trabajo | Woodchuckers Servicio de Árboles',
    description: 'Escaladas reales, resultados reales. Remoción y poda de árboles en Colorado Springs.',
    url: '/es/portfolio',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function PortfolioPageEs() {
  return <PortfolioContent locale="es" />
}
