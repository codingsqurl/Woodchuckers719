import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { EstimateContent } from './estimate-content'

const t = getDict('en').estimate

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/estimate', languages: altLanguages('/estimate') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: 'Free Estimate | Woodchuckers Tree Service',
    description: 'Day-rate tree work in Colorado Springs. Get a free ballpark and request an estimate.',
    url: '/estimate',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function EstimatePage() {
  return <EstimateContent locale="en" />
}
