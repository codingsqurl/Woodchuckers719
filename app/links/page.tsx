import type { Metadata } from 'next'
import { bioLinks } from '@/lib/links'
import { LinkList } from './link-list'

export const metadata: Metadata = {
  title: 'Woodchuckers — Links',
  robots: { index: false, follow: true },
}

export default function LinksPage() {
  return (
    <main>
      <section className="link-page">
        <div className="link-avatar">
          <img src="/img/favicon.svg" alt="Woodchuckers" />
        </div>
        <h1 className="link-name">Woodchuckers</h1>
        <p className="link-tagline">Professional Tree Climber · Colorado Springs</p>

        <LinkList links={bioLinks} />

        <div className="link-qr">
          <img
            src="/img/qr-links.png"
            alt="QR code to this page"
            width={140}
            height={140}
            loading="lazy"
          />
          <p className="link-sub">Scan to share</p>
        </div>
      </section>
    </main>
  )
}
