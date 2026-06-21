'use client'

// Tap-to-copy for payment handles that have no shareable URL (Zelle, Apple Pay).
// Port of links.js: degrades to an inert button if clipboard is unavailable.
import { useState } from 'react'
import type { BioLink } from '@/lib/links'

function CopyButton({ link }: { link: BioLink }) {
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
          setSub(`Copied ${val}`)
          setTimeout(() => setSub(prev), 1600)
        })
      }}
    >
      <span className="link-label">{link.label}</span>
      <span className="link-sub">{sub}</span>
    </button>
  )
}

export function LinkList({ links }: { links: BioLink[] }) {
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
          <CopyButton key={l.label} link={l} />
        ),
      )}
    </div>
  )
}
