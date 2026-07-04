// Shared site chrome (skip link, scroll-rope, header, language toggle, call
// button, footer, mobile conversion bar) for every public page. Server
// components — no client JS. Every link is locale-aware: English at root,
// Spanish under /es, wired through localePath().
import type { ReactNode } from 'react'
import { type Locale, getDict, localePath } from '@/lib/i18n'

// (719)&nbsp;756&#8209;2597 — nbsp + non-breaking hyphen, like the templates.
export const PHONE_DISPLAY = '(719) 756‑2597'
export const PHONE_HREF = 'tel:+17197562597'
export const SMS_NUMBER = '+17197562597'
export const EMAIL = 'woodchuckerstrees719@gmail.com'

// smsHref builds a pre-filled text-message deep link. `?&body=` is the form that
// fires the compose sheet with the body pre-filled on both iOS and Android.
export const smsHref = (body: string): string =>
  `sms:${SMS_NUMBER}?&body=${encodeURIComponent(body)}`

export function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.1 2.2z" />
    </svg>
  )
}

export function CallButton() {
  return (
    <a className="call-btn" href={PHONE_HREF}>
      <PhoneIcon size={16} />
      <span>{PHONE_DISPLAY}</span>
    </a>
  )
}

// Plain link to the same page in the other language (no JS). `path` is the clean
// logical path with no locale prefix (e.g. "/", "/areas/monument").
export function LangToggle({ locale, path }: { locale: Locale; path: string }) {
  const t = getDict(locale)
  const other: Locale = locale === 'en' ? 'es' : 'en'
  return (
    <a
      className="lang-toggle"
      href={localePath(other, path)}
      aria-label={t.switchTo}
      lang={other}
      hrefLang={other}
    >
      {t.langName[other]}
    </a>
  )
}

const NAV = [
  { key: 'home', path: '/', label: (d: ReturnType<typeof getDict>) => d.nav.home },
  { key: 'work', path: '/portfolio', label: (d: ReturnType<typeof getDict>) => d.nav.work },
  { key: 'areas', path: '/areas', label: (d: ReturnType<typeof getDict>) => d.nav.areas },
  { key: 'services', path: '/services', label: (d: ReturnType<typeof getDict>) => d.nav.services },
  { key: 'estimate', path: '/contract-climbing', label: (d: ReturnType<typeof getDict>) => d.nav.estimate },
] as const

// SiteHeader: skip link, scroll-rope, sticky topbar. `current` is the nav key to
// omit (the page you're on). The language toggle lives in the footer now.
export function SiteHeader({
  locale,
  current,
}: {
  locale: Locale
  current?: 'home' | 'work' | 'areas' | 'services' | 'estimate'
}) {
  const d = getDict(locale)
  return (
    <>
      <a className="skip-link" href="#main">
        {d.skip}
      </a>
      <div className="scroll-rope" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href={localePath(locale, '/')}>
          Woodchuckers
        </a>
        <nav className="topnav" aria-label={d.navLabel}>
          {NAV.filter((n) => n.key !== current).map((n) => (
            <a key={n.key} href={localePath(locale, n.path)}>
              {n.label(d)}
            </a>
          ))}
        </nav>
        <CallButton />
      </header>
    </>
  )
}

// PageHero: the shared cinematic hero (glass panel + rising title lines) for every
// inner page, mirroring the home hero so the whole site reads as one piece. `title`
// is three rising lines, the third in safety orange; `sub` is optional. `cta` is the
// primary action (estimate, or an in-page #job anchor); the call button is the ghost.
export function PageHero({
  eyebrow,
  title,
  sub,
  cta,
  callLabel,
}: {
  eyebrow: string
  title: string[]
  sub?: string
  cta: { href: string; label: string }
  callLabel: string
}) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="hero-title">
          <span className="line">
            <span>{title[0]}</span>
          </span>
          <span className="line">
            <span>{title[1]}</span>
          </span>
          <span className="line accent">
            <span>{title[2]}</span>
          </span>
        </h1>
        {sub ? <p className="hero-sub">{sub}</p> : null}
        <div className="hero-actions">
          <a className="cta cta-primary" href={cta.href}>
            {cta.label}
          </a>
          <a className="cta cta-ghost" href={PHONE_HREF}>
            {callLabel} {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  )
}

// SiteFooter: brand line, contract link, Spanish welcome, and the language toggle
// (moved here from the header). `path` is the clean logical path for the toggle.
export function SiteFooter({ locale, path }: { locale: Locale; path: string }) {
  const d = getDict(locale)
  return (
    <footer className="foot">
      <span>© Woodchuckers</span>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href={localePath(locale, '/')}>
        {d.nav.home}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href={localePath(locale, '/portfolio')}>
        {d.nav.work}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href={localePath(locale, '/areas')}>
        {d.nav.areas}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href={localePath(locale, '/services')}>
        {d.nav.services}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href={localePath(locale, '/blog')}>
        {d.blog.crumb}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href={localePath(locale, '/contract-climbing')}>
        {d.footPro}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <span lang="es">{d.seHabla}</span>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <a className="foot-link" href="/contact.vcf" download="woodchuckers.vcf">
        {d.saveContact}
      </a>
      <span className="foot-sep" aria-hidden="true">
        ·
      </span>
      <LangToggle locale={locale} path={path} />
    </footer>
  )
}

// Sticky conversion bar — phones only (CSS hides it ≥46rem). `variant` swaps the
// second button: the marketing pages push the day rate; the contract page
// scrolls to its job form.
export function MobileCTA({
  locale,
  variant = 'site',
}: {
  locale: Locale
  variant?: 'site' | 'contract'
}) {
  const d = getDict(locale)
  const cta =
    variant === 'contract'
      ? { href: '#job', label: d.bookDay }
      : { href: localePath(locale, '/contract-climbing'), label: d.freeEstimate }
  return (
    <div className="mobile-cta">
      <a className="mcta mcta-call" href={PHONE_HREF}>
        <PhoneIcon size={18} />
        {d.callLabel}
      </a>
      <a className="mcta mcta-est" href={cta.href}>
        {cta.label}
      </a>
    </div>
  )
}

export function Main({ children, id = 'main' }: { children: ReactNode; id?: string }) {
  return <main id={id}>{children}</main>
}
