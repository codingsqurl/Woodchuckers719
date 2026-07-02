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
    title: 'Escalador de Árboles por Contrato | Woodchuckers',
    description:
      'Escalador de árboles por contrato en Colorado Springs. Remociones por secciones, daño por tormenta y aparejo para empresas de árboles. Equipo propio.',
    url: '/es/contract-climbing',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function ContractPageEs({
  searchParams,
}: {
  searchParams: Promise<{ signin?: string }>
}) {
  const { signin } = await searchParams
  return <ContractContent locale="es" signin={signin} />
}
