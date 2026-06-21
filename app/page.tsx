import type { Metadata, Viewport } from 'next'
import { appBaseURL } from '@/lib/env'
import { areaList } from '@/lib/areas'
import { CallButton, PHONE_DISPLAY, PHONE_HREF, EMAIL, PhoneIcon } from './components/chrome'

export const viewport: Viewport = { themeColor: '#06160d' }

export const metadata: Metadata = {
  title: 'Woodchuckers | Professional Tree Climber | Colorado Springs',
  description:
    'Professional tree climber serving Colorado Springs. Removals, trimming, and technical take-downs, roped, rigged, and lowered by hand. Trained, owner-operated. Free estimates.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    title: 'Woodchuckers | Professional Tree Climber, Colorado Springs',
    description:
      'Tree removal, trimming, and technical climbing in Colorado Springs. Owner-operated, fast, and safe. Free estimates.',
    url: '/',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

function localBusinessJsonLd() {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Woodchuckers Tree Service',
    description:
      'Professional tree climber in Colorado Springs: removals, trimming, and technical climbing, roped and rigged by hand. Owner-operated.',
    url: `${base}/`,
    image: `${base}/img/background.jpg`,
    telephone: '+1-719-756-2597',
    email: EMAIL,
    areaServed: areaList().map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Colorado Springs',
      addressRegion: 'CO',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.8339, longitude: -104.8214 },
    priceRange: '$175–$350/day',
  }
}

export default function HomePage() {
  return (
    <>
      {/* LocalBusiness schema — a data block, exempt from script-src CSP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="scroll-rope" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="/">
          Woodchuckers
        </a>
        <nav className="topnav">
          <a href="/portfolio">My Work</a>
          <a href="/areas">Areas</a>
          <a href="/estimate">Estimate</a>
        </nav>
        <CallButton />
      </header>

      <main id="main">
        {/* ───── cinematic ascent hero ───── */}
        <section className="hero" id="top">
          <img
            className="hero-photo"
            src="/img/powerline.jpg"
            width={900}
            height={1199}
            alt="Woodchuckers climber roped into the crown of a ponderosa pine, chainsaw clipped to his harness, deep blue Colorado sky behind him"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-inner">
            <p className="eyebrow">Colorado Springs · Owner-operated</p>
            <h1 className="hero-title">
              <span className="line">
                <span>Trees too big</span>
              </span>
              <span className="line">
                <span>to handle?</span>
              </span>
              <span className="line accent">
                <span>I climb them.</span>
              </span>
            </h1>
            <p className="hero-sub">
              A trained climber for removals, trimming, and technical take-downs, roped, rigged, and
              lowered by hand. The person who quotes your tree is the one up in it.
            </p>
            <div className="hero-actions">
              <a className="cta cta-primary" href="/estimate">
                Get a free estimate
              </a>
              <a className="cta cta-ghost" href={PHONE_HREF}>
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* ───── trust markers ───── */}
        <section className="trust" id="trust">
          <ul className="trust-list">
            <li>Free estimates</li>
            <li>Owner-operated</li>
            <li>Roped &amp; rigged</li>
            <li>Colorado Springs &amp; nearby</li>
          </ul>
        </section>

        {/* ───── what I take on ───── */}
        <section className="band services">
          <div className="band-inner split">
            <figure className="split-media reveal">
              <img
                src="/img/layingback.jpg"
                width={900}
                height={1199}
                loading="lazy"
                decoding="async"
                alt="Woodchuckers climber suspended in a leafy cottonwood, running a chainsaw mid-canopy on a clear day"
              />
            </figure>
            <div className="split-copy reveal">
              <h2 className="section-title">What I take on</h2>
              <ul className="svc-list">
                <li>
                  <h3>Removals</h3>
                  <p>
                    Whole trees taken down in pieces, roped and lowered, no damage to what&rsquo;s
                    underneath.
                  </p>
                </li>
                <li>
                  <h3>Trimming &amp; pruning</h3>
                  <p>
                    Clearance, deadwood, and shape, cut for the tree&rsquo;s health, not just the
                    look.
                  </p>
                </li>
                <li>
                  <h3>Technical take-downs</h3>
                  <p>Tight spots near the house, fence, or power lines, rigged down by hand.</p>
                </li>
                <li>
                  <h3>Storm &amp; hazard work</h3>
                  <p>
                    Broken limbs and leaners made safe, fast, before they come down on their own.
                  </p>
                </li>
              </ul>
              <a className="cta cta-primary" href="/portfolio">
                See the work
              </a>
            </div>
          </div>
        </section>

        {/* ───── hazard framing ───── */}
        <section className="band hazard">
          <div className="band-inner split reverse">
            <div className="split-copy reveal">
              <h2 className="section-title">Big trees, close to the house?</h2>
              <p className="band-lead">
                Front Range pines get tall and heavy, and they don&rsquo;t fall where you&rsquo;d
                want them to. If there&rsquo;s a dead one over the roof or a leaner by the deck,
                that&rsquo;s exactly the job I&rsquo;m built for, climbed and taken down in
                controlled pieces instead of dropped.
              </p>
              <div className="hero-actions">
                <a className="cta cta-primary" href="/estimate">
                  Get a free estimate
                </a>
                <a className="cta cta-ghost cta-ghost-dark" href={PHONE_HREF}>
                  Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <figure className="split-media reveal">
              <img
                src="/img/uphigh.jpg"
                width={900}
                height={1199}
                loading="lazy"
                decoding="async"
                alt="Towering ponderosa pines rising directly over a Colorado Springs home, a climber barely visible high in the canopy"
              />
            </figure>
          </div>
        </section>

        {/* ───── one climber ───── */}
        <section className="band about">
          <div className="about-inner reveal">
            <h2 className="section-title">One climber, start to finish</h2>
            <p className="band-lead">
              Years in the trees and trained on rope and rigging. No subcontractors, no rotating
              crews. The person who quotes your job is the same one climbing it, careful with your
              property, fast on the clock, and straight with you about what it actually needs.
            </p>
          </div>
        </section>

        {/* ───── final CTA ───── */}
        <section className="band contact" id="contact">
          <div className="contact-inner reveal">
            <h2 className="section-title">Free estimates, straight answers</h2>
            <p className="contact-sub">Call or text to talk through your trees, no obligation.</p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">Serving the Colorado Springs area</p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>© Woodchuckers</span>
      </footer>

      {/* mobile-only sticky conversion bar */}
      <div className="mobile-cta">
        <a className="mcta mcta-call" href={PHONE_HREF}>
          <PhoneIcon size={18} />
          Call
        </a>
        <a className="mcta mcta-est" href="/estimate">
          Free estimate
        </a>
      </div>
    </>
  )
}
