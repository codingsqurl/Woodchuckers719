// reviews.ts — curated real Google reviews, the single source for the /reviews
// page. Same spirit as rates.ts: one file KING edits, no API, no client JS, no
// third-party widget (the strict CSP + DESIGN.md's no-fake-review-widgets rule).
//
// WHY CURATED, NOT AUTO-SYNCED: Google's Places API caps at 5 Google-picked
// reviews and restricts caching; the Business Profile API pulls all of them but
// is gated behind a multi-week approval + OAuth. Pasting your real reviews here
// is instant, free, fully on-brand, and 100% real. Upgrade to an API later if
// the volume ever justifies it.
//
// HOW TO ADD A REVIEW: copy a real Google review below — the reviewer's name as
// Google shows it (first name + last initial), the star rating, the text
// verbatim, and the month it was left. Drop `draft: true` and it renders.

export type Review = {
  author: string // as shown on Google, e.g. "Marcus T."
  rating: number // 1–5 whole stars
  text: string // the review, verbatim — never paraphrased or invented
  date?: string // ISO 'YYYY-MM-DD' (only the month + year are shown)
  draft?: boolean // true = hidden (placeholder / not yet verified)
}

// Your public Google reviews link — the "See us on Google" target and where
// customers go to leave one. Get it from Google Business Profile → "Get more
// reviews" (looks like https://g.page/r/XXXXXXXX/review). Replace the YOUR_
// placeholder; until you do, the button is hidden (launch-safe).
export const GOOGLE_REVIEWS_URL = 'https://g.page/r/YOUR_GOOGLE_REVIEW_LINK'

// Paste real reviews here. The sample is draft:true so it never renders — swap
// it for the real thing (and delete `draft`).
const all: Review[] = [
  {
    author: 'Sample — replace me',
    rating: 5,
    text: 'Replace this with a real Google review, word for word. This entry is hidden (draft: true) so nothing fake ever ships.',
    date: '2026-01-01',
    draft: true,
  },
]

function isPlaceholder(url: string): boolean {
  return /YOUR_/.test(url)
}

// Live reviews only (drafts filtered), newest first when dated.
export function reviews(): Review[] {
  return all
    .filter((r) => !r.draft)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function hasReviews(): boolean {
  return reviews().length > 0
}

// The Google link, or null while it's still the placeholder (hide the button).
export function googleReviewsUrl(): string | null {
  return isPlaceholder(GOOGLE_REVIEWS_URL) ? null : GOOGLE_REVIEWS_URL
}

// statsFor aggregates any review list, e.g. { count: 12, avg: 4.9 }. avg to one
// decimal. Shared so the curated-only header and the merged (curated + approved
// on-site) header compute the average the same way.
export function statsFor(list: Review[]): { count: number; avg: number } {
  if (list.length === 0) return { count: 0, avg: 0 }
  const sum = list.reduce((s, r) => s + r.rating, 0)
  return { count: list.length, avg: Math.round((sum / list.length) * 10) / 10 }
}

// Aggregate for the header over the curated reviews.
export function reviewStats(): { count: number; avg: number } {
  return statsFor(reviews())
}
