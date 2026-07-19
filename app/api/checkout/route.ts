// /api/checkout — turns the /pay form into a Stripe Checkout Session for the
// exact dollar amount the customer entered, then redirects the browser to the
// hosted card page. Native form POST (no JSON), so it works even with JS off:
// the preset chips are progressive enhancement over a plain amount field.
//
// Launch-safe: with STRIPE_SECRET_KEY unset the route fails closed — it bounces
// back to /pay?error=unconfigured instead of throwing — so the page ships before
// the key does. Set the key (fly secrets set STRIPE_SECRET_KEY=…) to go live.
import { NextResponse } from 'next/server'
import { appBaseURL } from '@/lib/env'
import { getStripe, PAY_MIN_USD, PAY_MAX_USD } from '@/lib/stripe'
import { localePath, type Locale } from '@/lib/i18n'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Absolute URL on our own origin — Stripe requires absolute success/cancel URLs,
// and a 303 redirect response needs one too.
function abs(path: string): string {
  return new URL(path, appBaseURL()).toString()
}

function backToPay(locale: Locale, error?: string): NextResponse {
  const q = error ? `?error=${error}` : ''
  return NextResponse.redirect(abs(localePath(locale, '/pay') + q), 303)
}

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData()
  const locale: Locale = form.get('locale') === 'es' ? 'es' : 'en'

  // Dollars → cents. Reject NaN, sub-min, and over-ceiling; round to whole cents
  // so "150.005" can't sneak a fractional cent past Stripe.
  const raw = String(form.get('amount') ?? '').replace(/[^0-9.]/g, '')
  const dollars = Number.parseFloat(raw)
  if (!Number.isFinite(dollars) || dollars < PAY_MIN_USD || dollars > PAY_MAX_USD) {
    return backToPay(locale, 'amount')
  }
  const cents = Math.round(dollars * 100)

  const name = String(form.get('name') ?? '').trim().slice(0, 120)
  const note = String(form.get('note') ?? '').trim().slice(0, 140)

  const stripe = getStripe()
  if (!stripe) return backToPay(locale, 'unconfigured')

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: cents,
            product_data: { name: note || 'Tree service payment' },
          },
        },
      ],
      // What the customer typed, so the payment reconciles to a job in the
      // Stripe dashboard. name also prefills their receipt.
      metadata: { customer_name: name, note },
      payment_intent_data: { description: note || 'Tree service payment' },
      success_url: abs(localePath(locale, '/pay/thanks')),
      cancel_url: abs(localePath(locale, '/pay') + '?error=canceled'),
    })
    if (!session.url) return backToPay(locale, 'stripe')
    return NextResponse.redirect(session.url, 303)
  } catch {
    // Never leak Stripe internals to the customer; just bounce back cleanly.
    return backToPay(locale, 'stripe')
  }
}
