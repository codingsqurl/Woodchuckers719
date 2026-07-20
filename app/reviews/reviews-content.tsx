import { SiteHeader, SiteFooter, MobileCTA, PageHero } from '../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { reviews, reviewStats, googleReviewsUrl } from '@/lib/reviews'

// Five stars, filled up to `n`. Pure SVG, no client JS. Filled stars carry the
// rationed safety orange (a proof signal); empty stars sit faint over the pine.
function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`star${i <= n ? ' is-on' : ''}`} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </span>
  )
}

// "January 2026" from an ISO date, in the page's language. Parsed as UTC so the
// day never drifts across timezones (we only show month + year anyway).
function monthYear(iso: string, locale: Locale): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// The /reviews page: curated real Google reviews as a ruled list (never a card
// grid — see DESIGN.md), with an aggregate rating and a link out to the real
// Google profile. Wears the standard inner-page chrome so it reads as native.
export function ReviewsContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.reviews
  const list = reviews()
  const stats = reviewStats()
  const gurl = googleReviewsUrl()

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <PageHero
          eyebrow={t.eyebrow}
          title={t.heroTitle}
          cta={{ href: localePath(locale, '/contract-climbing'), label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />
        <section className="band services">
          <div className="band-inner">
            {list.length > 0 ? (
              <>
                <div className="reviews-agg">
                  <Stars n={Math.round(stats.avg)} label={t.starsAlt(Math.round(stats.avg))} />
                  <span className="reviews-agg-num">{stats.avg.toFixed(1)}</span>
                  <span className="reviews-agg-count">
                    {t.count(stats.count)} {t.onGoogle}
                  </span>
                </div>
                <p className="band-lead">{t.lead}</p>
                <ul className="review-list">
                  {list.map((r, i) => (
                    <li key={i} className="review">
                      <Stars n={r.rating} label={t.starsAlt(r.rating)} />
                      <blockquote className="review-text">{r.text}</blockquote>
                      <p className="review-meta">
                        <span className="review-author">{r.author}</span>
                        {r.date ? <span className="review-date">{monthYear(r.date, locale)}</span> : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="band-lead">{t.empty}</p>
            )}
            {gurl ? (
              <div className="reviews-cta">
                <a className="cta cta-primary" href={gurl} target="_blank" rel="noopener noreferrer">
                  {t.googleCta}
                </a>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/reviews" />
      <MobileCTA locale={locale} />
    </>
  )
}
