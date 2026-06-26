import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { serviceList, serviceBySlug } from '@/lib/services'
import { altLanguages } from '@/lib/i18n'
import { ServiceContent } from './service-content'

// One static page per service, generated from the service list. Unknown slugs 404.
export function generateStaticParams() {
  return serviceList().map((s) => ({ slug: s.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const s = serviceBySlug(slug)
  if (!s) return {}
  return {
    title: s.metaTitle,
    description: s.metaDesc,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: {
      type: 'website',
      siteName: 'Woodchuckers',
      locale: 'en_US',
      title: s.ogTitle,
      description: s.metaDesc,
      url: `/services/${s.slug}`,
      images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: s.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: s.ogTitle, description: s.metaDesc },
    other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = serviceBySlug(slug)
  if (!s) notFound()
  return <ServiceContent locale="en" service={s} />
}
