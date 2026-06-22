import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { townList, townBySlug } from '@/lib/areas'
import { getDict, altLanguages } from '@/lib/i18n'
import { TownContent } from './town-content'

// One static page per served town, generated from serviceAreas. Unknown slugs 404.
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
  const town = townBySlug(slug, 'en')
  if (!town) return {}
  const d = getDict('en').town
  const title = d.metaTitleFor(town.name)
  const description = d.metaDescFor(town.name)
  return {
    title,
    description,
    alternates: {
      canonical: `/areas/${town.slug}`,
      languages: altLanguages(`/areas/${town.slug}`),
    },
    openGraph: {
      type: 'website',
      siteName: 'Woodchuckers',
      locale: 'en_US',
      alternateLocale: ['es_US'],
      title,
      description,
      url: `/areas/${town.slug}`,
      images: ['/img/og.jpg'],
    },
    twitter: { card: 'summary_large_image' },
    other: { 'geo.region': 'US-CO', 'geo.placename': town.name },
  }
}

export default async function TownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const town = townBySlug(slug, 'en')
  if (!town) notFound()
  return <TownContent locale="en" town={town} />
}
