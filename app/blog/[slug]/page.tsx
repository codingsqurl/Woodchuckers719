import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader, SiteFooter, MobileCTA, PHONE_DISPLAY, PHONE_HREF, EMAIL } from '../../components/chrome'
import { LeadForm } from '../../components/lead-form'
import { getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { postList, postBySlug, type Post } from '@/lib/posts'

export function generateStaticParams() {
  return postList().map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = postBySlug(slug)
  if (!p) return {}
  return {
    title: p.metaTitle,
    description: p.metaDesc,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      type: 'article',
      siteName: 'Woodchuckers',
      locale: 'en_US',
      title: p.ogTitle,
      description: p.metaDesc,
      url: `/blog/${p.slug}`,
      images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: p.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: p.ogTitle, description: p.metaDesc },
  }
}

function articleJsonLd(p: Post) {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.metaDesc,
    mainEntityOfPage: `${base}/blog/${p.slug}`,
    author: { '@type': 'Organization', name: 'Woodchuckers Tree Service', '@id': `${base}/#business` },
    publisher: { '@type': 'Organization', name: 'Woodchuckers Tree Service', '@id': `${base}/#business` },
    about: 'Contract tree climbing',
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = postBySlug(slug)
  if (!p) notFound()
  const tc = getDict('en')
  const contractHref = localePath('en', '/contract-climbing')
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(p)) }}
      />
      <SiteHeader locale="en" />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={localePath('en', '/')}>{tc.nav.home}</a>
        <span className="sep" aria-hidden="true">
          ›
        </span>
        <a href="/blog">Field notes</a>
        <span className="sep" aria-hidden="true">
          ›
        </span>
        <span aria-current="page">{p.ogTitle}</span>
      </nav>

      <main id="main">
        <article className="band services">
          <div className="band-inner">
            <h1 className="section-title">{p.title}</h1>
            <p className="band-lead">{p.excerpt}</p>

            <h2 className="form-title">What this covers</h2>
            <ul className="svc-list">
              {p.outline.map((h) => (
                <li key={h}>
                  <p>{h}</p>
                </li>
              ))}
            </ul>

            {p.draft ? (
              <p className="muted">
                Full write-up in progress. Need the answer for a real job now? Call or text and
                I will talk it through.
              </p>
            ) : null}

            <div className="hero-actions">
              <a className="cta cta-primary" href={contractHref}>
                {tc.freeEstimate}
              </a>
              <a className="cta cta-ghost cta-ghost-dark" href={PHONE_HREF}>
                {tc.callLabel} {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </article>

        <LeadForm locale="en" source={`blog:${p.slug}`} />

        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{tc.home.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">
              <a className="serving-link" href={localePath('en', '/areas')}>
                {tc.servingArea}
              </a>{' '}
              · {tc.seHabla}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale="en" path={`/blog/${p.slug}`} />
      <MobileCTA locale="en" />
    </>
  )
}
