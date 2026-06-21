import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteHeader, SiteFooter, PHONE_DISPLAY, PHONE_HREF, EMAIL } from '../components/chrome'

export const metadata: Metadata = {
  title: 'My Work | Woodchuckers Tree Service | Colorado Springs',
  description:
    'Real tree work in Colorado Springs. Climbing, rigging, and removals done by hand. No stock photos, no subcontractors. See the job photos.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    title: 'My Work | Woodchuckers Tree Service',
    description: 'Real climbs, real results. Tree removal and trimming in Colorado Springs.',
    url: '/portfolio',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="feature-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/areas', label: 'Areas' },
          { href: '/estimate', label: 'Estimate' },
        ]}
      />
      <main>
        <section className="proof">
          <p className="eyebrow">My Work</p>
          <h1 className="section-title reveal">Real climbs, real results</h1>
          <p className="proof-lead reveal">
            No subcontractors and no stock photos. That&rsquo;s me up in the tree on every job, roped
            in and doing it right.
          </p>
          <div className="proof-grid">
            <figure className="shot reveal">
              <img
                src="/img/layingback.jpg"
                alt="Climber roped into a hardwood, trimming the canopy"
                loading="lazy"
              />
              <figcaption>Roped into the canopy for a controlled trim.</figcaption>
            </figure>
            <figure className="shot reveal">
              <img
                src="/img/powerline.jpg"
                alt="Climber rigging high in a conifer near limbs"
                loading="lazy"
              />
              <figcaption>Technical removal, rigged and lowered by hand.</figcaption>
            </figure>
            <figure className="shot reveal">
              <img
                src="/img/uphigh.jpg"
                alt="Tall pines towering over a residential home"
                loading="lazy"
              />
              <figcaption>Big residential pines, handled with care.</figcaption>
            </figure>
          </div>
        </section>

        <section className="services">
          <h2 className="section-title reveal">What I do</h2>
          <p className="proof-lead reveal">
            I&rsquo;m a professional tree climber. I bring my climbing and rigging gear and get the
            tree down or trimmed. I don&rsquo;t haul debris off-site, so you keep the wood or your
            hauler takes it.
          </p>
          <div className="features">
            <div className="feature reveal">
              <FeatureIcon>
                <path d="M12 2 8 8h2L6 13h12l-4-5h2z" />
                <path d="M12 13v8" />
              </FeatureIcon>
              <h3>Tree removal</h3>
              <p>
                Hazardous, dead, or just in the way. Taken down piece by piece, roped and lowered
                right up against the house when it has to be.
              </p>
            </div>
            <div className="feature reveal">
              <FeatureIcon>
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </FeatureIcon>
              <h3>Trimming &amp; pruning</h3>
              <p>
                Clear deadwood, shape the canopy, raise limbs off your roof, and keep branches clear
                of the power lines.
              </p>
            </div>
            <div className="feature reveal">
              <FeatureIcon>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </FeatureIcon>
              <h3>Technical &amp; sectional removals</h3>
              <p>
                Tight backyards, fence lines, and over structures where a bucket truck can&rsquo;t
                reach. Climbed and rigged down by hand.
              </p>
            </div>
            <div className="feature reveal">
              <FeatureIcon>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </FeatureIcon>
              <h3>Storm-damaged trees</h3>
              <p>
                Hung-up limbs, broken tops, and leaners made safe and brought down before they do
                more damage.
              </p>
            </div>
            <div className="feature reveal">
              <FeatureIcon>
                <circle cx="12" cy="5" r="3" />
                <line x1="12" y1="22" x2="12" y2="8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </FeatureIcon>
              <h3>Contract climbing</h3>
              <p>
                Running a crew and need a climber? Bring me in for the technical climb and rigging
                while your team works the ground.
              </p>
            </div>
            <div className="feature reveal">
              <FeatureIcon>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </FeatureIcon>
              <h3>Optional on-site cleanup</h3>
              <p>
                For a flat $100 I&rsquo;ll cut it down and pile the wood and brush in one spot.
                Hauling it away is on you or your hauler.
              </p>
            </div>
            <div className="feature reveal">
              <FeatureIcon>
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </FeatureIcon>
              <h3>Full debris removal</h3>
              <p>
                Want it gone completely? For a flat $150 I can organize full debris removal and have
                the wood and brush hauled off your property.
              </p>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner reveal">
            <h2>Like what you see?</h2>
            <p>Call or text to talk through your trees, no obligation.</p>
            <p className="contact-lines">
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="muted">Serving the Colorado Springs area</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
