import { SiteHeader, SiteFooter, MobileCTA, PageHero } from '../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { ContractForm } from './contract-form'

// The contract-climbing page: the site's single intake. Serves both homeowners
// (removals, storm work) and tree companies booking a contract climber. Same pine
// chrome as the rest of the public site; flat day-rate range, quals, and a short
// job-intake form. The MobileCTA swaps its second button to scroll to the form (#job).
export function ContractContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.contract
  return (
    <>
      <SiteHeader locale={locale} path="/contract-climbing" current="estimate" />
      <main id="main">
        <PageHero
          eyebrow={t.kicker}
          title={t.heroTitle}
          sub={t.headLede}
          cta={{ href: '#job', label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />
        <ContractForm locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      <MobileCTA locale={locale} variant="contract" />
    </>
  )
}
