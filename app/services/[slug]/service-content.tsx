import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PageHero,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
} from '../../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { areaList } from '@/lib/areas'
import { type Service, serviceBySlug } from '@/lib/services'

// Service + FAQ structured data for one service page. Service is provided by the
// home LocalBusiness (@id ref keeps NAP single-sourced), served across the
// coverage list, to a BusinessAudience (tree companies). Honest day-rate Offer,
// no fake ratings.
function serviceJsonLd(locale: Locale, s: Service) {
  const base = appBaseURL()
  const url = `${base}${localePath(locale, `/services/${s.slug}`)}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        serviceType: s.serviceType,
        name: s.ogTitle,
        description: s.metaDesc,
        url,
        provider: {
          '@type': 'LocalBusiness',
          '@id': `${base}/#business`,
          name: 'Woodchuckers Tree Service',
          telephone: '+1-719-756-2597',
          email: EMAIL,
          url: `${base}/`,
        },
        areaServed: areaList().map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
        audience: { '@type': 'BusinessAudience', name: 'Tree companies and crews' },
        offers: {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'USD',
            minPrice: 175,
            maxPrice: 350,
            unitText: 'DAY',
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: s.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

export function ServiceContent({ locale, service }: { locale: Locale; service: Service }) {
  const tc = getDict(locale)
  const contractHref = localePath(locale, '/contract-climbing')
  const related = service.related
    .map((slug) => serviceBySlug(slug))
    .filter((s): s is Service => Boolean(s))

  return (
    <>
      {/* Service + FAQ schema — a data block, exempt from script-src CSP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(locale, service)) }}
      />

      <SiteHeader locale={locale} current="services" />

      <main id="main">
        {/* Above the fold: 3-line hero, day-rate CTA, and the click-to-call ghost. */}
        <PageHero
          eyebrow={service.eyebrow}
          title={service.heroTitle}
          sub={service.lede}
          cta={{ href: contractHref, label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />

        <section className="band services">
          <div className="band-inner">
            <h2 className="section-title">{service.whatTitle}</h2>
            <p className="band-lead">{service.what}</p>
          </div>
        </section>

        <section className="band hazard">
          <div className="band-inner">
            <h2 className="section-title">{service.whenTitle}</h2>
            <ul className="svc-list">
              {service.when.map((w) => (
                <li key={w}>
                  <p>{w}</p>
                </li>
              ))}
            </ul>
            <p className="rate-figure">
              <span className="rate-amount">$175–$350</span>
              <span className="rate-unit">per day</span>
            </p>
            <p className="included">{service.priceNote}</p>
            <div className="hero-actions">
              <a className="cta cta-primary" href={contractHref}>
                {tc.freeEstimate}
              </a>
              <a className="cta cta-ghost cta-ghost-dark" href={PHONE_HREF}>
                {tc.callLabel} {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        <section className="band faq">
          <div className="band-inner">
            <h2 className="section-title">{tc.home.faqTitle}</h2>
            <div className="faq-list">
              {service.faqs.map((f, i) => (
                <details key={f.q} className="faq-item" open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="band services">
            <div className="band-inner">
              <h2 className="section-title">{tc.services.moreTitle}</h2>
              <div className="area-grid">
                {related.map((r) => (
                  <a key={r.slug} href={localePath(locale, `/services/${r.slug}`)}>
                    {r.ogTitle}
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{tc.home.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-cta">
              <a className="cta cta-primary" href={contractHref}>
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

      <SiteFooter locale={locale} path={`/services/${service.slug}`} />
      <MobileCTA locale={locale} />
    </>
  )
}
