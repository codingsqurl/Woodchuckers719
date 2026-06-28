import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PageHero,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
} from '../components/chrome'
import { LeadForm } from '../components/lead-form'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { serviceList } from '@/lib/services'

// ItemList of every service, locale-aware so EN and /es both emit it. URLs are
// locale-prefixed so the schema points at the right page in each language.
function servicesJsonLd(locale: Locale) {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Contract tree climbing services',
    itemListElement: serviceList(locale).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.ogTitle,
      url: `${base}${localePath(locale, `/services/${s.slug}`)}`,
    })),
  }
}

export function ServicesContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const ts = tc.services
  const services = serviceList(locale)
  const contractHref = localePath(locale, '/contract-climbing')
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(locale)) }}
      />
      <SiteHeader locale={locale} current="services" />
      <main id="main">
        <PageHero
          eyebrow={ts.eyebrow}
          title={ts.heroTitle}
          sub={ts.heroSub}
          cta={{ href: contractHref, label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />

        <LeadForm locale={locale} source="services" />

        <section className="band services">
          <div className="band-inner">
            <h2 className="section-title">{ts.listTitle}</h2>
            <ul className="svc-list two-col">
              {services.map((s) => (
                <li key={s.slug}>
                  <h3>
                    <a href={localePath(locale, `/services/${s.slug}`)}>{s.ogTitle}</a>
                  </h3>
                  <p>{s.lede}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

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
              <a className="serving-link" href={localePath(locale, '/areas')}>
                {tc.servingArea}
              </a>{' '}
              · {tc.seHabla}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/services" />
      <MobileCTA locale={locale} />
    </>
  )
}
