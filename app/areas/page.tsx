import type { Metadata } from 'next'
import { SiteHeader, SiteFooter, PHONE_DISPLAY, PHONE_HREF, EMAIL } from '../components/chrome'
import { areaList } from '@/lib/areas'

export const metadata: Metadata = {
  title: 'Service Areas | Woodchuckers Tree Climber | Colorado Springs',
  description:
    'Towns served by Woodchuckers, a professional tree climber based in Colorado Springs: Monument, Black Forest, Falcon, Fountain, Manitou Springs, Woodland Park and more. Tap your town for the map.',
  alternates: { canonical: '/areas' },
  openGraph: {
    type: 'website',
    siteName: 'Woodchuckers',
    title: 'Service Areas | Woodchuckers Tree Climber',
    description:
      'Professional tree climbing across Colorado Springs and El Paso County. See every town served.',
    url: '/areas',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  other: { 'geo.region': 'US-CO', 'geo.placename': 'Colorado Springs' },
}

export default function AreasPage() {
  const areas = areaList()
  return (
    <>
      <SiteHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/portfolio', label: 'My Work' },
          { href: '/estimate', label: 'Estimate' },
        ]}
      />
      <main>
        <section className="estimate-head reveal">
          <p className="eyebrow">Service Areas</p>
          <h1>Where I work</h1>
          <p>
            A professional tree climber working across Colorado Springs and the surrounding El Paso
            County communities.
          </p>
        </section>

        <section className="areas">
          <div className="map-embed reveal">
            <iframe
              src="https://maps.google.com/maps?q=Colorado+Springs,+CO&z=10&output=embed"
              title="Map of the Colorado Springs tree service area"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <h2 className="section-title reveal">Towns I serve</h2>
          <div className="area-grid reveal">
            {areas.map((a) => (
              <a key={a.name} href={a.mapsURL} target="_blank" rel="noopener">
                {a.name}
              </a>
            ))}
          </div>

          <aside className="area-note reveal">
            <p className="area-note-tag">Coming September 2027</p>
            <p>
              The Great Expansion Project. I am taking Woodchuckers beyond Colorado to also serve
              Washington, Oregon, and California.
            </p>
          </aside>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner reveal">
            <h2>In my area? Let&rsquo;s talk.</h2>
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
