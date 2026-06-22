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

export function PortfolioContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.work

  return (
    <>
      <SiteHeader locale={locale} current="work" />
      <main id="main">
        <PageHero
          eyebrow={t.eyebrow}
          title={t.heroTitle}
          sub={t.lead}
          cta={{ href: localePath(locale, '/contract-climbing'), label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />

        {/* proof first — the photos carry the credibility */}
        <section className="band services">
          <div className="band-inner">
            <div className="gallery">
              <figure className="shot">
                <img
                  src="/img/layingback.jpg"
                  width={900}
                  height={1199}
                  loading="lazy"
                  decoding="async"
                  alt="Climber roped into a leafy cottonwood, running a chainsaw mid-canopy for a controlled trim"
                />
                <figcaption>{t.cap1}</figcaption>
              </figure>
              <figure className="shot">
                <img
                  src="/img/uphigh.jpg"
                  width={900}
                  height={1199}
                  loading="lazy"
                  decoding="async"
                  alt="Towering pines rising over a Colorado Springs home, a climber barely visible in the crown, rigged and lowered by hand"
                />
                <figcaption>{t.cap2}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* what I do — ruled list, two columns on wide screens */}
        <section className="band hazard">
          <div className="band-inner">
            <h2 className="section-title">{t.doTitle}</h2>
            <p className="band-lead">{t.doLead}</p>
            <ul className="svc-list two-col">
              {t.list.map((w) => (
                <li key={w.title}>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </li>
              ))}
            </ul>
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
      <SiteFooter locale={locale} path="/portfolio" />
      <MobileCTA locale={locale} />
    </>
  )
}
