import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { PortfolioContent } from './portfolio-content'

const t = getDict('en').work

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
  alternates: { canonical: '/portfolio', languages: altLanguages('/portfolio') },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    title: 'My Work | Woodchuckers Tree Service',
    description: 'Real climbs, real results. Tree removal and trimming in Colorado Springs.',
    url: '/portfolio',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function PortfolioPage() {
  return <PortfolioContent locale="en" />
}
