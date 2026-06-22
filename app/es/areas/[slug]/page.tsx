import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { townList, townBySlug } from '@/lib/areas'
import { getDict, altLanguages } from '@/lib/i18n'
import { TownContent } from '../../../areas/[slug]/town-content'

export function generateStaticParams() {
  return townList().map((t) => ({ slug: t.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const town = townBySlug(slug, 'es')
  if (!town) return {}
  const d = getDict('es').town
  const title = d.metaTitleFor(town.name)
  const description = d.metaDescFor(town.name)
  return {
    title,
    description,
    alternates: {
      canonical: `/es/areas/${town.slug}`,
      languages: altLanguages(`/areas/${town.slug}`),
    },
    openGraph: {
      type: 'website',
      siteName: 'Woodchuckers',
      locale: 'es_US',
      alternateLocale: ['en_US'],
      title,
      description,
      url: `/es/areas/${town.slug}`,
      images: ['/img/og.jpg'],
    },
    twitter: { card: 'summary_large_image' },
    other: { 'geo.region': 'US-CO', 'geo.placename': town.name },
  }
}

export default async function TownPageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const town = townBySlug(slug, 'es')
  if (!town) notFound()
  return <TownContent locale="es" town={town} />
}
