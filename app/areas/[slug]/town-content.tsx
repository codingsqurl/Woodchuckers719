import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
} from '../../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { areaList, type TownPage } from '@/lib/areas'

function townJsonLd(locale: Locale, town: TownPage) {
  const base = appBaseURL()
  const url = `${base}${localePath(locale, `/areas/${town.slug}`)}`
  const areasUrl = `${base}${localePath(locale, '/areas')}`
  const homeUrl = `${base}${localePath(locale, '/')}`
  const d = getDict(locale).town
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${base}/#business`,
        name: 'Woodchuckers Tree Service',
        description: `Contract tree climber for hire by tree companies in ${town.name}, CO: sectional takedowns, storm work, and rigging. Own gear, owner-operated. Se habla español.`,
        url,
        telephone: '+1-719-756-2597',
        email: EMAIL,
        areaServed: { '@type': 'City', name: `${town.name}, CO` },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Colorado Springs',
          addressRegion: 'CO',
          addressCountry: 'US',
        },
        ...(town.lat != null && town.lng != null
          ? { geo: { '@type': 'GeoCoordinates', latitude: town.lat, longitude: town.lng } }
          : {}),
        priceRange: '$250–$500/day',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: getDict(locale).nav.home, item: homeUrl },
          { '@type': 'ListItem', position: 2, name: d.breadcrumbAreas, item: areasUrl },
          { '@type': 'ListItem', position: 3, name: town.name, item: url },
        ],
      },
    ],
  }
}

export function TownContent({ locale, town }: { locale: Locale; town: TownPage }) {
  const tc = getDict(locale)
  const t = tc.town
  // Query by town NAME (not lat/lng) so Google draws the place boundary outline,
  // matching the main /areas map. A coordinate query (q=lat,lng) only drops a pin
  // with no outline, and the outline is what reads as "we cover this whole town".
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(`${town.name}, CO`)}&z=11&output=embed`

  return (
    <>
      {/* LocalBusiness + breadcrumb schema — a data block, exempt from script-src CSP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(townJsonLd(locale, town)) }}
      />

      <SiteHeader locale={locale} />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={localePath(locale, '/')}>{tc.nav.home}</a>
        <span className="sep" aria-hidden="true">
          ›
        </span>
        <a href={localePath(locale, '/areas')}>{t.breadcrumbAreas}</a>
        <span className="sep" aria-hidden="true">
          ›
        </span>
        <span aria-current="page">{town.name}</span>
      </nav>

      <main id="main">
        {/* Banner removed per request — page opens straight into the town intro.
            H1 kept sr-only so the page keeps its heading for SEO. */}
        <h1 className="sr-only">{t.titleFor(town.name)}</h1>
        {/* intro */}
        <section className="band services">
          <div className="band-inner">
            <p className="band-lead">{town.intro}</p>
          </div>
        </section>

        {/* what I do here */}
        <section className="band hazard">
          <div className="band-inner">
            <h2 className="section-title">{t.doInTitle(town.name)}</h2>
            <ul className="svc-list two-col">
              {t.core.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* local note */}
        <section className="band about">
          <div className="about-inner">
            <h2 className="section-title">{t.localTitle}</h2>
            <p className="band-lead">{town.localNote}</p>
          </div>
        </section>

        {/* map */}
        <section className="band services">
          <div className="band-inner">
            <div className="map-embed">
              <iframe
                src={mapSrc}
                title={t.mapTitleFor(town.name)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* coverage cluster: link the sibling towns + the proof page so every
            town threads into the hierarchy, not just up to /areas */}
        <section className="band services">
          <div className="band-inner">
            <h2 className="section-title">{tc.areas.townsTitle}</h2>
            <div className="area-grid">
              {areaList()
                .filter((a) => a.slug !== town.slug)
                .map((a) => (
                  <a key={a.slug} href={localePath(locale, `/areas/${a.slug}`)}>
                    {a.name}
                  </a>
                ))}
            </div>
            <p className="contact-cta">
              <a className="cta cta-primary" href={localePath(locale, '/portfolio')}>
                {tc.home.seeWork}
              </a>
            </p>
          </div>
        </section>

        {/* contact */}
        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{t.contactTitleFor(town.name)}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">
              <a className="serving-link" href={localePath(locale, '/areas')}>
                {t.servingFor(town.name)}
              </a>{' '}
              · <span lang="es">{tc.seHabla}</span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path={`/areas/${town.slug}`} />
      <MobileCTA locale={locale} />
    </>
  )
}
