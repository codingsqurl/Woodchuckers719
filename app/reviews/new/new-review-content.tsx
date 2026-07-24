import { SiteHeader, SiteFooter, MobileCTA } from '../../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { ReviewForm } from './review-form'

// /reviews/new — the "leave a review" page. Standard inner-page chrome so it
// reads as native; the H1 is sr-only (the form's own section title carries the
// visible heading), matching the /reviews page's opens-straight-into-content shape.
export function NewReviewContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).reviewForm
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <h1 className="sr-only">{t.pageTitle}</h1>
        <ReviewForm locale={locale} />
      </main>
      <SiteFooter locale={locale} path="/reviews/new" />
      <MobileCTA locale={locale} />
    </>
  )
}
