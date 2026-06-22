'use client'

// Tap-to-copy for payment handles that have no shareable URL (Zelle, Apple Pay).
// Port of links.js: degrades to an inert button if clipboard is unavailable.
import { useState } from 'react'
import type { BioLink } from '@/lib/links'
import { type Locale, getDict } from '@/lib/i18n'

function CopyButton({ link, copied }: { link: BioLink; copied: (v: string) => string }) {
  const [sub, setSub] = useState(link.sub ?? '')
  return (
    <button
      type="button"
      className="link-btn"
      onClick={() => {
        const val = link.copy ?? ''
        if (!navigator.clipboard || !val) return
        navigator.clipboard.writeText(val).then(() => {
          const prev = link.sub ?? ''
          setSub(copied(val))
          setTimeout(() => setSub(prev), 1600)
        })
      }}
    >
      <span className="link-label">{link.label}</span>
      <span className="link-sub">{sub}</span>
    </button>
  )
}

export function LinkList({ links, locale }: { links: BioLink[]; locale: Locale }) {
  const copied = getDict(locale).links.copied
  return (
    <div className="link-list">
      {links.map((l) =>
        l.href ? (
          <a
            key={l.label}
            className="link-btn"
            href={l.href}
            {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
          >
            <span className="link-label">{l.label}</span>
            {l.sub ? <span className="link-sub">{l.sub}</span> : null}
          </a>
        ) : (
          <CopyButton key={l.label} link={l} copied={copied} />
        ),
      )}
    </div>
  )
}
