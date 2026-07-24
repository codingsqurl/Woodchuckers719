import { SiteHeader, SiteFooter, MobileCTA } from '../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { reviews, statsFor, googleReviewsUrl } from '@/lib/reviews'
import { approvedReviews } from '@/lib/review-submissions'

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
  // Curated Google reviews (lib/reviews.ts) + approved on-site submissions
  // (empty unless REVIEWS_PUBLIC is on), newest first. The aggregate counts both.
  const curated = reviews()
  const onsite = approvedReviews()
  const list = [...curated, ...onsite].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  const stats = statsFor(list)
  const gurl = googleReviewsUrl()
  // "on Google" is only accurate when every shown review is a curated Google one;
  // drop the suffix once an on-site review is mixed in (honest labelling).
  const allGoogle = onsite.length === 0
  const newHref = localePath(locale, '/reviews/new')

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        {/* Hero removed per request — page opens straight into the reviews.
            H1 kept sr-only so the page keeps its heading for SEO. */}
        <h1 className="sr-only">{t.heroTitle.join(' ')}</h1>
        <section className="band services">
          <div className="band-inner">
            {list.length > 0 ? (
              <>
                <div className="reviews-agg">
                  <Stars n={Math.round(stats.avg)} label={t.starsAlt(Math.round(stats.avg))} />
                  <span className="reviews-agg-num">{stats.avg.toFixed(1)}</span>
                  <span className="reviews-agg-count">
                    {t.count(stats.count)}
                    {allGoogle ? ` ${t.onGoogle}` : ''}
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
            <div className="reviews-cta">
              {/* Primary: the on-site review form. Secondary (when the Google
                  link is configured): leave one on Google instead. */}
              <a className="cta cta-primary" href={newHref}>
                {t.leaveCta}
              </a>
              {gurl ? (
                <a
                  className="cta cta-ghost cta-ghost-dark"
                  href={gurl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.googleCta}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/reviews" />
      <MobileCTA locale={locale} />
    </>
  )
}
