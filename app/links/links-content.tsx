import { type Locale, getDict } from '@/lib/i18n'
import { bioLinks } from '@/lib/links'
import { LinkList } from './link-list'
import { LangToggle } from '../components/chrome'

// The link-in-bio, stripped to its job: one full-bleed brand photo (treetotree,
// the climber mid-transfer) as the entire page, with the link buttons the only
// content floating on top. No topbar, no hero, no footer, no QR — a focused
// single screen the way a bio link should be. The photo + scrim are fixed
// elements (mirrors the sitewide backdrop pattern) since /links opts out of the
// `body.site` glass system; see bodyClass() in app/layout.tsx.
export function LinksContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).links
  return (
    <>
      <div className="bio-bg" aria-hidden="true" />
      <div className="bio-scrim" aria-hidden="true" />
      <main id="main" className="bio-wrap">
        <div className="bio-inner">
          <header className="bio-head">
            <h1 className="bio-brand">Woodchuckers</h1>
            <p className="bio-tagline">{t.tagline}</p>
          </header>
          <LinkList links={bioLinks(locale)} locale={locale} />
          <LangToggle locale={locale} path="/links" />
        </div>
      </main>
    </>
  )
}
