import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
} from '../../components/chrome'
import { LeadForm } from '../../components/lead-form'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { type Post } from '@/lib/posts'

function articleJsonLd(locale: Locale, p: Post) {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.metaDesc,
    mainEntityOfPage: `${base}${localePath(locale, `/blog/${p.slug}`)}`,
    author: { '@type': 'Organization', name: 'Woodchuckers Tree Service', '@id': `${base}/#business` },
    publisher: { '@type': 'Organization', name: 'Woodchuckers Tree Service', '@id': `${base}/#business` },
    about: 'Contract tree climbing',
    inLanguage: locale === 'es' ? 'es-US' : 'en-US',
  }
}

export function PostContent({ locale, post: p }: { locale: Locale; post: Post }) {
  const tc = getDict(locale)
  const contractHref = localePath(locale, '/contract-climbing')
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(locale, p)) }}
      />
      <SiteHeader locale={locale} />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={localePath(locale, '/')}>{tc.nav.home}</a>
        <span className="sep" aria-hidden="true">
          ›
        </span>
        <a href={localePath(locale, '/blog')}>{tc.blog.crumb}</a>
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

            {p.body && p.body.length > 0 ? (
              <div className="post-body">
                {p.body.map((s) => (
                  <section key={s.heading}>
                    <h2>{s.heading}</h2>
                    {s.paras.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </section>
                ))}
              </div>
            ) : (
              <>
                <h2 className="form-title">{tc.blog.covers}</h2>
                <ul className="svc-list">
                  {p.outline.map((h) => (
                    <li key={h}>
                      <p>{h}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {p.draft ? <p className="muted">{tc.blog.draftNote}</p> : null}

            <div className="hero-actions">
              <a className="cta cta-primary" href={contractHref}>
                {tc.freeEstimate}
              </a>
              <a className="cta cta-ghost cta-ghost-dark" href={PHONE_HREF}>
                <span className="call-verb">{tc.callLabel} </span>
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </article>

        <LeadForm locale={locale} source={`blog:${p.slug}`} />

        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{tc.home.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
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
      <SiteFooter locale={locale} path={`/blog/${p.slug}`} />
      <MobileCTA locale={locale} />
    </>
  )
}
