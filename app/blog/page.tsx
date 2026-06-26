import type { Metadata } from 'next'
import { SiteHeader, SiteFooter, MobileCTA, PHONE_DISPLAY, PHONE_HREF, EMAIL } from '../components/chrome'
import { LeadForm } from '../components/lead-form'
import { getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { postList } from '@/lib/posts'

const META_DESC =
  'Field notes on contract tree climbing: when to hire a climber, sectional removals, day rates, crane assist, and storm work. Plain answers for tree companies in Colorado Springs.'

export const metadata: Metadata = {
  title: 'Field Notes | Contract Tree Climbing | Woodchuckers | Colorado Springs',
  description: META_DESC,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    title: 'Field Notes — Contract Tree Climbing',
    description: META_DESC,
    url: '/blog',
    images: [
      {
        url: '/img/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Woodchuckers field notes on contract tree climbing in Colorado Springs.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: 'Field Notes — Contract Tree Climbing', description: META_DESC },
}

function blogJsonLd() {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Woodchuckers Field Notes',
    url: `${base}/blog`,
    publisher: { '@type': 'Organization', name: 'Woodchuckers Tree Service', '@id': `${base}/#business` },
    blogPost: postList().map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${base}/blog/${p.slug}`,
      description: p.metaDesc,
    })),
  }
}

export default function BlogIndexPage() {
  const tc = getDict('en')
  const posts = postList()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd()) }}
      />
      <SiteHeader locale="en" />
      <main id="main">
        <section className="band services">
          <div className="band-inner">
            <p className="eyebrow">Field notes</p>
            <h1 className="section-title">Before you hire a climber</h1>
            <p className="band-lead">
              Plain answers to what tree companies and crews ask before bringing in a contract
              climber. Day rates, methods, and when to make the call.
            </p>
            <ul className="svc-list">
              {posts.map((p) => (
                <li key={p.slug}>
                  <h2>
                    <a href={localePath('en', `/blog/${p.slug}`)}>{p.title}</a>
                  </h2>
                  <p>{p.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LeadForm locale="en" />

        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{tc.home.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-cta">
              <a className="cta cta-primary" href={localePath('en', '/contract-climbing')}>
                {tc.freeEstimate}
              </a>
            </p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">
              {tc.servingArea} · {tc.seHabla}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale="en" path="/blog" />
      <MobileCTA locale="en" />
    </>
  )
}
