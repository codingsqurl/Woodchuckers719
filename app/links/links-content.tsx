import { SiteHeader, SiteFooter, PageHero } from '../components/chrome'
import { type Locale, getDict, localePath } from '@/lib/i18n'
import { bioLinks } from '@/lib/links'
import { LinkList } from './link-list'

// The link-in-bio page, now wearing the same site chrome and cinematic hero as the
// rest of the public site. The narrow tap-target column (LinkList + QR) sits in a
// glass band under the hero, so it reads as one piece with home/portfolio/areas.
export function LinksContent({ locale }: { locale: Locale }) {
  const tc = getDict(locale)
  const t = tc.links
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <PageHero
          eyebrow={t.tagline}
          title={t.heroTitle}
          cta={{ href: localePath(locale, '/contract-climbing'), label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />
        <section className="band services">
          <div className="band-inner">
            <div className="link-stack">
              <LinkList links={bioLinks(locale)} locale={locale} />
              <div className="link-qr">
                <img
                  src="/img/qr-links.png"
                  alt={t.qrAlt}
                  width={140}
                  height={140}
                  loading="lazy"
                />
                <p className="link-sub">{t.scanToShare}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} path="/links" />
    </>
  )
}
