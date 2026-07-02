import { headers } from 'next/headers'
import { SiteHeader, SiteFooter, MobileCTA, PageHero } from '../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'
import { areaList } from '@/lib/areas'
import { readLeadIdentity } from '@/lib/lead-identity'
import { ContractForm } from './contract-form'

// Service structured data for the money page: contract tree climbing offered to a
// business audience (tree companies), provided by the home LocalBusiness, day-rate
// offer, served across the coverage list. Honest only — no fake ratings.
function contractJsonLd() {
  const base = appBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Contract tree climbing',
    name: 'Contract tree climber for hire',
    description:
      'A contract climber for tree companies and crews in Colorado Springs. Sectional takedowns, storm-damaged leaders, and rigging over structures. Own gear; your crew runs the ground.',
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${base}/#business`,
      name: 'Woodchuckers Tree Service',
      telephone: '+1-719-756-2597',
      url: `${base}/`,
    },
    areaServed: areaList().map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
    audience: { '@type': 'BusinessAudience', name: 'Tree companies and crews' },
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        minPrice: 175,
        maxPrice: 350,
        unitText: 'DAY',
      },
    },
  }
}

// The contract-climbing page: the site's single intake. B2B only — a tree company
// or crew hiring a climber for the piece past their team. Same pine chrome as the
// rest of the public site; flat day-rate range, quals, and a short job-intake form.
// The MobileCTA swaps its second button to scroll to the form (#job).
export async function ContractContent({
  locale,
  signin,
}: {
  locale: Locale
  signin?: string
}) {
  const tc = getDict(locale)
  const t = tc.contract
  const identity = await readLeadIdentity()
  const path = (await headers()).get('x-pathname') || '/contract-climbing'
  const loginHref = `/auth/lead/google/login?return=${encodeURIComponent(path)}`
  return (
    <>
      {/* Service schema — a data block, exempt from script-src CSP. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contractJsonLd()) }}
      />
      <SiteHeader locale={locale} current="estimate" />
      <main id="main">
        <PageHero
          eyebrow={t.kicker}
          title={t.heroTitle}
          sub={t.headLede}
          cta={{ href: '#job', label: tc.freeEstimate }}
          callLabel={tc.callLabel}
        />
        <ContractForm
          locale={locale}
          identity={identity}
          loginHref={loginHref}
          unverified={signin === 'unverified'}
        />
      </main>
      <SiteFooter locale={locale} path="/contract-climbing" />
      <MobileCTA locale={locale} variant="contract" />
    </>
  )
}
