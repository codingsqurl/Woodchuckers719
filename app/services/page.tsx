import type { Metadata } from 'next'
import {
  SiteHeader,
  SiteFooter,
  MobileCTA,
  PageHero,
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
} from '../components/chrome'
import { LeadForm } from '../components/lead-form'
import { getDict, localePath } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { serviceList } from '@/lib/services'

const META_TITLE = 'Contract Tree Climbing Services | Woodchuckers | Colorado Springs'
const META_DESC =
  'What a tree company can book me for by the day in Colorado Springs: technical removals, canopy pruning, storm and hazard work, rigging and crane assist, and contract climbing for crews. Se habla español.'

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: { canonical: '/services' },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    locale: 'en_US',
    title: 'Contract Tree Climbing Services',
    description: META_DESC,
    url: '/services',
    images: [
      {
        url: '/img/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Woodchuckers contract tree climber, the services a tree company can book by the day in Colorado Springs.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: 'Contract Tree Climbing Services', description: META_DESC },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

function servicesJsonLd() {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Contract tree climbing services',
    itemListElement: serviceList().map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.ogTitle,
      url: `${base}/services/${s.slug}`,
    })),
  }
}

export default function ServicesIndexPage() {
  const tc = getDict('en')
  const services = serviceList()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd()) }}
      />
      <SiteHeader locale="en" current="services" />
      <main id="main">
        <PageHero
          eyebrow="For tree companies"
          title={['What you', 'can book', 'by the day.']}
          sub="I climb for tree companies and crews across the Front Range. Pick the work, get a day rate, keep your customer and your ground crew."
          cta={{ href: localePath('en', '/contract-climbing'), label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />

        <LeadForm locale="en" source="services" />

        <section className="band services">
          <div className="band-inner">
            <h2 className="section-title">Services</h2>
            <ul className="svc-list two-col">
              {services.map((s) => (
                <li key={s.slug}>
                  <h3>
                    <a href={localePath('en', `/services/${s.slug}`)}>{s.ogTitle}</a>
                  </h3>
                  <p>{s.lede}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band contact" id="contact">
          <div className="contact-inner">
            <h2 className="section-title">{tc.home.contactTitle}</h2>
            <p className="contact-sub">{tc.callOrText}</p>
            <p className="contact-cta">
              <a className="cta cta-primary" href={localePath('en', '/contract-climbing')}>
                {tc.freeEstimate}
              </a>
            </p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">
              <a className="serving-link" href={localePath('en', '/areas')}>
                {tc.servingArea}
              </a>{' '}
              · {tc.seHabla}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale="en" path="/services" />
      <MobileCTA locale="en" />
    </>
  )
}
