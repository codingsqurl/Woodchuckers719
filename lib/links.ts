// links.ts — port of links.go. Drives the /links link-in-bio page.
//
// A link with `href` renders as an anchor (external opens a new tab). A button
// with `copy` and no `href` copies that value to the clipboard on tap (for
// Zelle / Apple Pay handles that have no shareable URL).
//
// Payment handles are public on purpose (so customers can pay), but money goes
// wherever these point — the exact strings are ported verbatim from links.go,
// placeholders included. Do not invent real-looking values.
export type BioLink = {
  label: string // button title
  sub?: string // small line under the title (handle, hint, etc.)
  href?: string // if set, the button is a link
  external?: boolean // open in a new tab (off-site links)
  copy?: string // if set and href is empty, tapping copies this value
}

export const bioLinks: BioLink[] = [
  { label: 'Visit the website', sub: 'woodchuckertrees.com', href: '/' },
  { label: 'Get a free estimate', sub: 'Fast day-rate quote', href: '/estimate' },
  { label: 'Call or text', sub: '(719) 756-2597', href: 'tel:+17197562597' },
  {
    label: 'Pay with CashApp',
    sub: '$YOUR_CASHTAG',
    href: 'https://cash.app/$YOUR_CASHTAG',
    external: true,
  },
  { label: 'Pay with Zelle', sub: 'tap to copy', copy: 'YOUR_ZELLE_PHONE_OR_EMAIL' },
  { label: 'Pay with Apple Pay', sub: 'tap to copy', copy: 'YOUR_APPLEPAY_PHONE_OR_EMAIL' },
]
