import { SiteHeader, SiteFooter, MobileCTA, PHONE_DISPLAY, PHONE_HREF, EMAIL } from './components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { areaList } from '@/lib/areas'

function localBusinessJsonLd() {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Woodchuckers Tree Service',
    description:
      'Professional tree climber in Colorado Springs: removals, trimming, and technical climbing, roped and rigged by hand. Owner-operated. Se habla español.',
    url: `${base}/`,
    image: `${base}/img/background.jpg`,
    telephone: '+1-719-756-2597',
    email: EMAIL,
    areaServed: areaList().map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Colorado Springs',
      addressRegion: 'CO',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.8339, longitude: -104.8214 },
    priceRange: '$175–$350/day',
  }
}

export function HomeContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.home
  const estimateHref = localePath(locale, '/contract-climbing')
  const workHref = localePath(locale, '/portfolio')

  return (
    <>
      {/* LocalBusiness schema — a data block, exempt from script-src CSP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
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
              {t.services.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ul>
            <a className="cta cta-primary" href={workHref}>
              {t.seeWork}
            </a>
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

        {/* ───── final CTA ───── */}
        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{t.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
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

      <SiteFooter locale={locale} path="/" />
      <MobileCTA locale={locale} />
    </>
  )
}
