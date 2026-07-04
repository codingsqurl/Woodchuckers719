import { SiteHeader, SiteFooter, MobileCTA, PHONE_DISPLAY, PHONE_HREF, EMAIL } from '../components/chrome'
import { LeadForm } from '../components/lead-form'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { postList } from '@/lib/posts'

function blogJsonLd(locale: Locale) {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Woodchuckers Field Notes',
    url: `${base}${localePath(locale, '/blog')}`,
    publisher: { '@type': 'Organization', name: 'Woodchuckers Tree Service', '@id': `${base}/#business` },
    blogPost: postList(locale).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${base}${localePath(locale, `/blog/${p.slug}`)}`,
      description: p.metaDesc,
    })),
  }
}

export function BlogContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const tb = tc.blog
  const posts = postList(locale)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(locale)) }}
      />
      <SiteHeader locale={locale} />
      <main id="main">
        <section className="band services">
          <div className="band-inner">
            <p className="eyebrow">{tb.eyebrow}</p>
            <h1 className="section-title">{tb.indexTitle}</h1>
            <p className="band-lead">{tb.indexLead}</p>
            <ul className="svc-list">
              {posts.map((p) => (
                <li key={p.slug}>
                  <h2>
                    <a href={localePath(locale, `/blog/${p.slug}`)}>{p.title}</a>
                  </h2>
                  <p>{p.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LeadForm locale={locale} source="blog" />

        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{tc.home.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-cta">
              <a className="cta cta-primary" href={localePath(locale, '/contract-climbing')}>
                {tc.freeEstimate}
              </a>
            </p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">
              <a className="serving-link" href={localePath(locale, '/areas')}>
                {tc.servingArea}
              </a>{' '}
              · <span lang="es">{tc.seHabla}</span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/blog" />
      <MobileCTA locale={locale} />
    </>
  )
}
