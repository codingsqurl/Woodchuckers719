import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PageHero,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
} from '../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { areaList } from '@/lib/areas'

export function AreasContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.areas
  const areas = areaList()

  return (
    <>
      <SiteHeader locale={locale} current="areas" />
      <main id="main">
        <PageHero
          eyebrow={t.eyebrow}
          title={t.heroTitle}
          sub={t.lead}
          cta={{ href: localePath(locale, '/contract-climbing'), label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />

        <section className="band services">
          <div className="band-inner">
            <div className="map-embed">
              <iframe
                src="https://maps.google.com/maps?q=Colorado+Springs,+CO&z=10&output=embed"
                title="Map of the Colorado Springs tree service area"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <h2 className="section-title">{t.townsTitle}</h2>
            <div className="area-grid">
              {areas.map((a) => (
                <a key={a.name} href={localePath(locale, `/areas/${a.slug}`)}>
                  {a.name}
                </a>
              ))}
            </div>

            <aside className="area-note">
              <p className="area-note-tag">{t.expansionTag}</p>
              <p>{t.expansionBody}</p>
            </aside>
          </div>
        </section>

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
      <SiteFooter locale={locale} path="/areas" />
      <MobileCTA locale={locale} />
    </>
  )
}
