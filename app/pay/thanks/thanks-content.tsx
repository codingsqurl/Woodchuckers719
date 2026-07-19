// Post-checkout landing (Stripe's success_url). Stripe emails the receipt; this
// is just a warm confirmation and a way back to the site.
import { type Locale, getDict, localePath } from '@/lib/i18n'

export function ThanksContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).pay
  return (
    <main id="main" className="pay-wrap">
      <section className="pay-card pay-thanks">
        <a className="pay-brand" href={localePath(locale, '/')}>
          Woodchuckers
        </a>
        <div className="pay-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="pay-heading">{t.thanksTitle}</h1>
        <p className="pay-sub">{t.thanksBody}</p>
        <a className="pay-submit pay-thanks-back" href={localePath(locale, '/')}>
          {t.thanksBack}
        </a>
      </section>
    </main>
  )
}
