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
                <picture>
                  <source srcSet="/img/layingback.avif" type="image/avif" />
                  <source srcSet="/img/layingback.webp" type="image/webp" />
                  <img
                    src="/img/layingback.jpg"
                    width={900}
                    height={1199}
                    loading="lazy"
                    decoding="async"
                    alt="Climber roped into a leafy cottonwood, running a chainsaw mid-canopy for a controlled trim"
                  />
                </picture>
                <figcaption>{t.cap1}</figcaption>
              </figure>
              <figure className="shot">
                <picture>
                  <source srcSet="/img/uphigh.avif" type="image/avif" />
                  <source srcSet="/img/uphigh.webp" type="image/webp" />
                  <img
                    src="/img/uphigh.jpg"
                    width={900}
                    height={1199}
                    loading="lazy"
                    decoding="async"
                    alt="Towering pines rising over a Colorado Springs home, a climber barely visible in the crown, rigged and lowered by hand"
                  />
                </picture>
                <figcaption>{t.cap2}</figcaption>
              </figure>
              <figure className="shot">
                <picture>
                  <source srcSet="/img/powerline.avif" type="image/avif" />
                  <source srcSet="/img/powerline.webp" type="image/webp" />
                  <img
                    src="/img/powerline.jpg"
                    width={900}
                    height={1199}
                    loading="lazy"
                    decoding="async"
                    alt="Climber roped high in a pine above power lines, rigging a limb down by hand on a Colorado Springs job"
                  />
                </picture>
                <figcaption>{t.cap3}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* a 20-second clip of real rope work — click to play; nothing loads
            until then (poster only), so it never costs an outdoor user cell data */}
        <section className="band hazard">
          <div className="band-inner">
            <h2 className="section-title">{t.videoTitle}</h2>
            <figure className="proof-video">
              <video
                controls
                playsInline
                preload="none"
                poster="/img/climb-poster.jpg"
                width={360}
                height={480}
              >
                <source src="/video/climb.mp4" type="video/mp4" />
              </video>
              <figcaption>{t.videoCap}</figcaption>
            </figure>
            <figure className="proof-video">
              <video
                controls
                playsInline
                preload="none"
                poster="/img/treetotree-poster.jpg"
                width={480}
                height={672}
              >
                <source src="/video/treetotree.mp4" type="video/mp4" />
              </video>
              <figcaption>{t.videoCap2}</figcaption>
            </figure>
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
              <a className="serving-link" href={localePath(locale, '/areas')}>{tc.servingArea}</a> · <span lang="es">{tc.seHabla}</span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/portfolio" />
      <MobileCTA locale={locale} />
    </>
  )
}
