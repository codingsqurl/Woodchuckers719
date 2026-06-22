import { SiteHeader, SiteFooter, MobileCTA } from '../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { EstimateForm } from './estimate-form'

export function EstimateContent({ locale }: { locale: Locale }) {
  const d = getDict(locale)
  return (
    <>
      <SiteHeader locale={locale} current="estimate" />
      <main id="main">
        <EstimateForm locale={locale} />
        <p className="pro-link-row">
          <a className="pro-link" href={localePath(locale, '/contract-climbing')}>
            {d.proLink}
          </a>
        </p>
      </main>
      <SiteFooter locale={locale} path="/estimate" />
      <MobileCTA locale={locale} />
    </>
  )
}
