import { type Locale, getDict } from '@/lib/i18n'
import { bioLinks } from '@/lib/links'
import { LinkList } from './link-list'
import { LangToggle } from '../components/chrome'

export function LinksContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).links
  return (
    <main id="main">
      <section className="link-page">
        <div className="link-avatar">
          <img src="/img/favicon.svg" alt="Woodchuckers" />
        </div>
        <h1 className="link-name">Woodchuckers</h1>
        <p className="link-tagline">{t.tagline}</p>

        <LinkList links={bioLinks(locale)} locale={locale} />

        <div className="link-qr">
          <img src="/img/qr-links.png" alt={t.qrAlt} width={140} height={140} loading="lazy" />
          <p className="link-sub">{t.scanToShare}</p>
        </div>

        <p className="link-lang">
          <LangToggle locale={locale} path="/links" />
        </p>
      </section>
    </main>
  )
}
