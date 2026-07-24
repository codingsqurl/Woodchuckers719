'use server'

// Server Action backing the public review form (progressive enhancement — works
// without JS). A submission lands as 'pending' in review_submissions and is
// invisible until an admin approves it, so this endpoint can never publish
// straight to the site. Mirrors submitContract: localized errors, input clamps,
// honeypot, per-IP throttle, and a best-effort owner notification via after().
import { after } from 'next/server'
import { createReviewSubmission } from '@/lib/review-submissions'
import { reviewRL, clientIP } from '@/lib/ratelimit'
import { sendMail, reviewNotifyHTML, mailerConfigured } from '@/lib/mail'
import { getDict, isLocale } from '@/lib/i18n'
import { appBaseURL } from '@/lib/env'

// Where the "new review pending" heads-up is emailed.
const notifyTo = 'woodchuckerstrees719@gmail.com'

// Every echoed-back field on a transient error, so a rejected submit refills.
export type ReviewValues = {
  author?: string
  town?: string
  body?: string
  rating?: string
}

export type ReviewState =
  | { status: 'idle' }
  | { status: 'error'; error: string; values: ReviewValues }
  | { status: 'sent'; author: string }

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const str = (k: string): string => (formData.get(k)?.toString() ?? '').trim()

  // Localize the visitor-facing errors to the page the form was on.
  const localeStr = formData.get('locale')?.toString() ?? 'en'
  const locale = isLocale(localeStr) ? localeStr : 'en'
  const t = getDict(locale).reviewForm

  // Clamp the free-text before it hits the DB or an email. A public form is a
  // spam surface — no reason to store oversized junk.
  const author = str('author').slice(0, 80)
  const town = str('town').slice(0, 80)
  const body = str('body').slice(0, 2000)
  const ratingRaw = str('rating')
  const rating = parseInt(ratingRaw, 10)
  const preserved: ReviewValues = { author, town, body, rating: ratingRaw }

  // Honeypot: a hidden "referral_code" field no human sees. Bots that fill every
  // input trip it; play dead (same thanks state) but save and email nothing.
  if (str('referral_code') !== '') {
    console.warn('review honeypot tripped, dropping submission')
    return { status: 'sent', author: author || 'there' }
  }

  // Spam throttle: 3/min/IP, its own budget (see lib/ratelimit.ts).
  if (!reviewRL.allow(await clientIP())) {
    return { status: 'error', error: t.errRate, values: preserved }
  }

  // A name and the review itself are required; the rating must be a whole 1–5
  // (the schema CHECK enforces it too, but reject early with a clear message).
  if (author === '' || body === '') {
    return { status: 'error', error: t.errMissing, values: preserved }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: 'error', error: t.errRating, values: preserved }
  }

  let id: number
  try {
    id = createReviewSubmission({
      author,
      rating,
      body,
      email: '', // this form doesn't collect email; column reserved for a future verified variant
      town,
      source: `review:${locale}`,
      verified: false,
    })
  } catch (err) {
    // Most likely the table doesn't exist yet (migration 0012 not applied). The
    // visitor sees a transient error; nothing is lost that a retry won't fix.
    console.error('createReviewSubmission:', err)
    return { status: 'error', error: t.errSave, values: preserved }
  }

  // Heads-up to the owner AFTER the response is sent — the review is already
  // saved as pending, mail is best-effort, and Resend can be slow (10s timeout).
  if (mailerConfigured()) {
    after(async () => {
      try {
        await sendMail(
          notifyTo,
          `New review pending — ${author} (${rating}★)`,
          reviewNotifyHTML({ author, rating, town, body, adminURL: `${appBaseURL()}/admin` }),
        )
      } catch (err) {
        console.error(`review notify failed (submission ${id}):`, err)
      }
    })
  }

  return { status: 'sent', author }
}
