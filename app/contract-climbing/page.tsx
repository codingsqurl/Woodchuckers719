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
    title: 'Tree Removal & Contract Climbing | Woodchuckers',
    description:
      'Professional tree climber in Colorado Springs — removals, storm work, rigging-heavy takedowns for homeowners and tree companies. Insured, own gear.',
    url: '/contract-climbing',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function ContractPage() {
  return <ContractContent locale="en" />
}
