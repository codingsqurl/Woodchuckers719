// links.ts — port of links.go. Drives the /links link-in-bio page.
//
// A link with `href` renders as an anchor (external opens a new tab). A button
// with `copy` and no `href` copies that value to the clipboard on tap (for
// Zelle / Apple Pay handles that have no shareable URL).
//
// Payment handles are public on purpose (so customers can pay), but money goes
// wherever these point — the exact strings are ported verbatim from links.go,
// placeholders included. Do not invent real-looking values. Labels are localized;
// the hrefs / handles are not.
import { type Locale, getDict, localePath } from './i18n'

export type BioLink = {
  label: string // button title
  sub?: string // small line under the title (handle, hint, etc.)
  href?: string // if set, the button is a link
  external?: boolean // open in a new tab (off-site links)
  copy?: string // if set and href is empty, tapping copies this value
}

export function bioLinks(locale: Locale): BioLink[] {
  const t = getDict(locale).links
  return [
    { label: t.website, sub: t.websiteSub, href: localePath(locale, '/') },
    { label: t.estimate, sub: t.estimateSub, href: localePath(locale, '/estimate') },
    { label: t.callText, sub: '(719) 756-2597', href: 'tel:+17197562597' },
    {
      label: t.cashapp,
      sub: '$YOUR_CASHTAG',
      href: 'https://cash.app/$YOUR_CASHTAG',
      external: true,
    },
    { label: t.zelle, sub: t.tapCopy, copy: 'YOUR_ZELLE_PHONE_OR_EMAIL' },
    { label: t.applepay, sub: t.tapCopy, copy: 'YOUR_APPLEPAY_PHONE_OR_EMAIL' },
  ]
}
