import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
  smsHref,
} from './components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { areaList } from '@/lib/areas'

// Home structured data: the LocalBusiness (B2B contract climbing) plus a FAQPage
// built from the visible FAQ band, in one @graph. Honest only — no Review /
// AggregateRating (no reviews to cite; faking them violates Google's guidelines).
function homeJsonLd(locale: Locale) {
  const base = appBaseURL()
  const t = getDict(locale).home
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${base}/#business`,
        name: 'Woodchuckers Tree Service',
        description:
          'Contract tree climber for hire by tree companies in Colorado Springs: sectional takedowns, storm-damaged leaders, and rigging over structures. Own gear, owner-operated. Se habla español.',
        url: `${base}/`,
        image: `${base}/img/og.jpg`,
        telephone: '+1-719-756-2597',
        email: EMAIL,
        priceRange: '$175–$350/day',
        knowsLanguage: ['en', 'es'],
        areaServed: areaList().map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Colorado Springs',
          addressRegion: 'CO',
          addressCountry: 'US',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 38.8339, longitude: -104.8214 },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-719-756-2597',
          contactType: 'sales',
          areaServed: 'US-CO',
          availableLanguage: ['English', 'Spanish'],
        },
        makesOffer: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Contract tree climbing',
            serviceType: 'Contract tree climbing for tree companies',
            description:
              'A climber for hire by tree companies. Sectional takedowns, storm-damaged leaders, and rigging over structures. I bring my own gear and climb the piece past your crew; your team runs the ground.',
          },
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
        '@id': `${base}${localePath(locale, '/')}#faq`,
        mainEntity: t.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

// The home "what I take on" cards deep-link, in order, onto the /services pages
// so the homepage threads into the service hub. English only — the /es service
// mirror is a later chunk, so Spanish keeps plain cards (no broken links).
const HOME_SERVICE_SLUGS = [
  'technical-removals',
  'storm-hazard-work',
  'rigging-crane-assist',
  'contract-climbing-for-companies',
]

export function HomeContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.home
  const estimateHref = localePath(locale, '/contract-climbing')
  const workHref = localePath(locale, '/portfolio')
  const sms = smsHref(t.smsBody)

  return (
    <>
      {/* LocalBusiness schema — a data block, exempt from script-src CSP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(locale)) }}
      />

      <SiteHeader locale={locale} current="home" />

      <main id="main">
        {/* ───── cinematic ascent hero ───── */}
        <section className="hero" id="top">
          <div className="hero-inner">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1 className="hero-title">
              <span className="line">
                <span>{t.heroTitle[0]}</span>
              </span>
              <span className="line">
                <span>{t.heroTitle[1]}</span>
              </span>
              <span className="line accent">
                <span>{t.heroTitle[2]}</span>
              </span>
            </h1>
            <p className="hero-sub">{t.heroSub}</p>
            <div className="hero-actions">
              <a className="cta cta-primary" href={estimateHref}>
                {t.ctaEstimate}
              </a>
              <a className="cta cta-ghost" href={PHONE_HREF}>
                {tc.callLabel} {PHONE_DISPLAY}
              </a>
            </div>
            <p className="sms-note">
              {t.smsNote} <a href={sms}>{t.smsCta}</a>
            </p>
          </div>
        </section>

        {/* ───── trust markers ───── */}
        <section className="trust" id="trust">
          <ul className="trust-list">
            {t.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ───── what I take on ───── */}
        <section className="band services">
          <div className="band-inner">
            <h2 className="section-title">{t.servicesTitle}</h2>
            <ul className="svc-list two-col">
              {t.services.map((s, i) => {
                const slug = HOME_SERVICE_SLUGS[i]
                return (
                  <li key={s.title}>
                    <h3>
                      {locale === 'en' && slug ? (
                        <a href={localePath(locale, `/services/${slug}`)}>{s.title}</a>
                      ) : (
                        s.title
                      )}
                    </h3>
                    <p>{s.body}</p>
                  </li>
                )
              })}
            </ul>
            <div className="hero-actions">
              {locale === 'en' ? (
                <>
                  <a className="cta cta-primary" href={localePath(locale, '/services')}>
                    All services
                  </a>
                  <a className="cta cta-ghost cta-ghost-dark" href={workHref}>
                    {t.seeWork}
                  </a>
                </>
              ) : (
                <a className="cta cta-primary" href={workHref}>
                  {t.seeWork}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ───── how it works ───── */}
        <section className="band steps">
          <div className="band-inner">
            <h2 className="section-title">{t.stepsTitle}</h2>
            <ol className="step-list">
              {t.steps.map((s) => (
                <li key={s.n}>
                  <span className="step-num" aria-hidden="true">
                    {s.n}
                  </span>
                  <div className="step-body">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───── hazard framing ───── */}
        <section className="band hazard">
          <div className="band-inner">
            <h2 className="section-title">{t.hazardTitle}</h2>
            <p className="band-lead">{t.hazardLead}</p>
            <div className="hero-actions">
              <a className="cta cta-primary" href={estimateHref}>
                {t.ctaEstimate}
              </a>
              <a className="cta cta-ghost cta-ghost-dark" href={PHONE_HREF}>
                {tc.callLabel} {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* ───── one climber ───── */}
        <section className="band about">
          <div className="about-inner">
            <h2 className="section-title">{t.aboutTitle}</h2>
            <p className="band-lead">{t.aboutLead}</p>
          </div>
        </section>

        {/* ───── objection FAQ ───── */}
        <section className="band faq">
          <div className="band-inner">
            <h2 className="section-title">{t.faqTitle}</h2>
            <div className="faq-list">
              {t.faqs.map((f, i) => (
                <details key={f.q} className="faq-item" open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───── final CTA ───── */}
        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{t.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-cta">
              <a className="cta cta-primary" href={sms}>
                {t.smsButton}
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
              · {tc.seHabla}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} path="/" />
      <MobileCTA locale={locale} />
    </>
  )
}
