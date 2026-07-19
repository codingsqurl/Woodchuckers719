// Shared /pay body for both locales. A focused, single-purpose checkout card on
// the sitewide pine backdrop — deliberately no topbar/footer nav so the only
// action is "enter amount → pay". The brand wordmark is the one way back home.
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { PayForm } from './pay-form'

type ErrKey = 'amount' | 'unconfigured' | 'canceled' | 'stripe'
const ERR_KEYS: ErrKey[] = ['amount', 'unconfigured', 'canceled', 'stripe']

export function PayContent({ locale, error }: { locale: Locale; error?: string }) {
  const t = getDict(locale).pay
  const errKey = ERR_KEYS.find((k) => k === error)
  return (
    <main id="main" className="pay-wrap">
      <section className="pay-card">
        <a className="pay-brand" href={localePath(locale, '/')}>
          Woodchuckers
        </a>
        <p className="pay-eyebrow">{t.eyebrow}</p>
        <h1 className="pay-heading">{t.heading}</h1>
        <p className="pay-sub">{t.sub}</p>
        {errKey ? (
          <p className="pay-error" role="alert">
            {t.err[errKey]}
          </p>
        ) : null}
        <PayForm locale={locale} />
        <a className="pay-back" href={localePath(locale, '/links')}>
          ← {t.back}
        </a>
      </section>
    </main>
  )
}
