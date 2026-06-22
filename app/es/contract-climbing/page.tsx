import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { ContractContent } from '../../contract-climbing/contract-content'

const t = getDict('es').contract

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/es/contract-climbing', languages: altLanguages('/contract-climbing') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    title: 'Remoción de Árboles y Escalada por Contrato | Woodchuckers',
    description:
      'Escalador profesional de árboles en Colorado Springs — remociones, daño por tormenta y desmontes con aparejo para dueños de casa y empresas. Equipo propio.',
    url: '/es/contract-climbing',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function ContractPageEs() {
  return <ContractContent locale="es" />
}
