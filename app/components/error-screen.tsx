// Themed error/404 screen (port of error.html). Pure presentational — usable
// from both the server not-found.tsx and the client error.tsx boundary. Locale
// is resolved by the caller (from the request path on the server, from
// window.location on the client); copy comes from the dictionary by code.
import { SiteHeader, SiteFooter, MobileCTA, PHONE_DISPLAY, PHONE_HREF } from './chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'

export function ErrorScreen({ code, locale }: { code: number; locale: Locale }) {
  const d = getDict(locale)
  const title = code === 404 ? d.errpage.notFoundTitle : d.errpage.errorTitle
  const message = code === 404 ? d.errpage.notFoundMsg : d.errpage.errorMsg
  // Wrapped in .error-shell so this renders correctly even on an /admin path,
  // where the body has no `.site` class (and thus no backdrop): the shell paints
  // the solid pine ground so the white text stays readable. On public (body.site)
  // pages the shell is transparent and the real backdrop shows through.
  return (
    <div className="error-shell">
      <SiteHeader locale={locale} />
      <main id="main">
        <section className="thanks">
          <p className="eyebrow error-code">{code}</p>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className="hero-actions error-actions">
            <a className="cta cta-primary" href={localePath(locale, '/')}>
              {d.errpage.backHome}
            </a>
            <a className="cta cta-ghost" href={PHONE_HREF}>
              {d.callLabel} {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/" />
      <MobileCTA locale={locale} />
    </div>
  )
}
