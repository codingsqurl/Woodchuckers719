import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { serviceList, serviceBySlug } from '@/lib/services'
import { altLanguages } from '@/lib/i18n'
import { ServiceContent } from '@/app/services/[slug]/service-content'

// Slugs are shared with EN, so the same list drives both locales' static params.
export function generateStaticParams() {
  return serviceList('es').map((s) => ({ slug: s.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const s = serviceBySlug(slug, 'es')
  if (!s) return {}
  return {
    title: s.metaTitle,
    description: s.metaDesc,
    alternates: {
      canonical: `/es/services/${s.slug}`,
      languages: altLanguages(`/services/${s.slug}`),
    },
    openGraph: {
      type: 'website',
      siteName: 'Woodchuckers',
      locale: 'es_US',
      alternateLocale: ['en_US'],
      title: s.ogTitle,
      description: s.metaDesc,
      url: `/es/services/${s.slug}`,
      images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: s.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: s.ogTitle, description: s.metaDesc },
    other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
  }
}

export default async function ServicePageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = serviceBySlug(slug, 'es')
  if (!s) notFound()
  return <ServiceContent locale="es" service={s} />
}
