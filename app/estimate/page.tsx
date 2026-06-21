import type { Metadata } from 'next'
import { SiteHeader, SiteFooter } from '../components/chrome'
import { EstimateForm } from './estimate-form'

export const metadata: Metadata = {
  title: 'Free Estimate | Woodchuckers Tree Service | Colorado Springs',
  description:
    "Get a free tree-work estimate in Colorado Springs. Day-rate pricing ($175–$350/day), fast and safe. Tell me about your trees and I'll get back to you.",
  alternates: { canonical: '/estimate' },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    title: 'Free Estimate | Woodchuckers Tree Service',
    description: 'Day-rate tree work in Colorado Springs. Get a free ballpark and request an estimate.',
    url: '/estimate',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function EstimatePage() {
  return (
    <>
      <SiteHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/areas', label: 'Areas' },
          { href: '/portfolio', label: 'My Work' },
        ]}
      />
      <main>
        <EstimateForm />
      </main>
      <SiteFooter />
    </>
  )
}
