// stripe.ts — thin wrapper over the Stripe SDK, same "configured?" shape as
// mail.ts. When STRIPE_SECRET_KEY is unset, payments are "not configured": the
// /pay form still renders, but the checkout route fails closed (redirects back
// with an error flag) instead of 500ing. Set the key as a Fly secret to go live:
//   fly secrets set STRIPE_SECRET_KEY=sk_live_...   (-a woodchuckers-springs)
import Stripe from 'stripe'

let client: Stripe | null = null

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

// Lazily constructed so a missing key never throws at import time (mirrors the
// SSO/mail guards). Returns null when unconfigured; callers must handle it.
export function getStripe(): Stripe | null {
  if (!stripeConfigured()) return null
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  return client
}

// Amount guardrails, in whole US dollars. Min $1 keeps out zero/typo charges;
// max mirrors Stripe's default 10,000.00 ceiling on customer-chosen amounts.
export const PAY_MIN_USD = 1
export const PAY_MAX_USD = 10000
