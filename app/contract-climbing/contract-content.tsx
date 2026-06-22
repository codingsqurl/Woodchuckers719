import { SiteHeader, SiteFooter, MobileCTA, PHONE_DISPLAY, PHONE_HREF } from '../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { ContractForm } from './contract-form'

// The contract-climbing page (B2B): a tree company books the climber for a
// section. Same pine chrome as the rest of the public site; peer-register copy,
// day-rate tiers, quals, and a short job-intake form. The MobileCTA swaps its
// second button to scroll to the form (#job) instead of the homeowner estimate.
export function ContractContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).contract
  return (
    <>
      <SiteHeader locale={locale} path="/contract-climbing" />
      <main id="main">
        <section className="contract-head">
          <p className="eyebrow">{t.kicker}</p>
          <h1>{t.headTitle}</h1>
          <p className="lede">{t.headLede}</p>
          <p className="book-line">
            {t.bookLine}{' '}
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
          </p>
        </section>
        <ContractForm locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      <MobileCTA locale={locale} variant="contract" />
    </>
  )
}
