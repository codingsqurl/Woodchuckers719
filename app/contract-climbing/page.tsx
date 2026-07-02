import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { ContractContent } from './contract-content'

const t = getDict('en').contract

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/contract-climbing', languages: altLanguages('/contract-climbing') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: 'Contract Tree Climber for Hire | Woodchuckers',
    description:
      'Contract tree climber for hire in Colorado Springs. Sectional takedowns, storm work, and rigging for tree companies. Own gear.',
    url: '/contract-climbing',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function ContractPage({
  searchParams,
}: {
  searchParams: Promise<{ signin?: string }>
}) {
  const { signin } = await searchParams
  return <ContractContent locale="en" signin={signin} />
}
