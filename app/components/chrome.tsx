// Shared site chrome (header, call button, footer) for the public pages.
// Server components — no client JS.
import type { ReactNode } from 'react'

// (719)&nbsp;756&#8209;2597 — nbsp + non-breaking hyphen, like the templates.
export const PHONE_DISPLAY = '(719) 756‑2597'
export const PHONE_HREF = 'tel:+17197562597'
export const EMAIL = 'woodchuckerstrees719@gmail.com'

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

type NavLink = { href: string; label: string }

// SiteHeader renders the sticky topbar. `links` are the nav items shown for the
// current page (each page omits its own link, matching the templates).
export function SiteHeader({ links }: { links: NavLink[] }) {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        Woodchuckers
      </a>
      <nav className="topnav">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <CallButton />
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <span>© Woodchuckers</span>
    </footer>
  )
}

export function Main({ children, id }: { children: ReactNode; id?: string }) {
  return <main id={id}>{children}</main>
}
