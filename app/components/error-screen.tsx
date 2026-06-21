// Themed error/404 screen (port of error.html). Pure presentational — usable
// from both the server not-found.tsx and the client error.tsx boundary.
import { SiteHeader, SiteFooter, PHONE_DISPLAY, PHONE_HREF } from './chrome'

export function ErrorScreen({
  code,
  title,
  message,
}: {
  code: number
  title: string
  message: string
}) {
  return (
    <>
      <SiteHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/portfolio', label: 'My Work' },
          { href: '/areas', label: 'Areas' },
          { href: '/estimate', label: 'Estimate' },
        ]}
      />
      <main>
        <section className="thanks">
          <p className="eyebrow error-code">{code}</p>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className="hero-actions error-actions">
            <a className="cta" href="/">
              Back home
            </a>
            <a className="cta cta-ghost" href={PHONE_HREF}>
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
