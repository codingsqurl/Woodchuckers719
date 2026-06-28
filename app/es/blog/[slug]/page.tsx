import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { altLanguages } from '@/lib/i18n'
import { postList, postBySlug } from '@/lib/posts'
import { PostContent } from '@/app/blog/[slug]/post-content'

export function generateStaticParams() {
  return postList('es').map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = postBySlug(slug, 'es')
  if (!p) return {}
  return {
    title: p.metaTitle,
    description: p.metaDesc,
    alternates: {
      canonical: `/es/blog/${p.slug}`,
      languages: altLanguages(`/blog/${p.slug}`),
    },
    openGraph: {
      type: 'article',
      siteName: 'Woodchuckers',
      locale: 'es_US',
      alternateLocale: ['en_US'],
      title: p.ogTitle,
      description: p.metaDesc,
      url: `/es/blog/${p.slug}`,
      images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: p.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: p.ogTitle, description: p.metaDesc },
  }
}

export default async function PostPageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = postBySlug(slug, 'es')
  if (!p) notFound()
  return <PostContent locale="es" post={p} />
}
