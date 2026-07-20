'use client'

// The amount form. Preset chips are progressive enhancement: they just write the
// custom amount field, which is what actually POSTs. With JS off you still get a
// working amount box + submit that native-posts to /api/checkout. No client fetch,
// no Stripe.js — the route does the Checkout Session server-side and 303-redirects.
import { useState } from 'react'
import { type Locale, getDict } from '@/lib/i18n'

const PRESETS = [250, 350, 500] as const
const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function PayForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).pay
  const [amount, setAmount] = useState('')

  return (
    <form className="pay-form" method="post" action="/api/checkout">
      <input type="hidden" name="locale" value={locale} />

      <fieldset className="pay-presets">
        <legend className="pay-field-label">{t.presetLabel}</legend>
        <div className="pay-chips">
          {PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              className={`pay-chip${amount === String(n) ? ' is-active' : ''}`}
              aria-pressed={amount === String(n)}
              onClick={() => setAmount(String(n))}
            >
              {usd(n)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="pay-field">
        <span className="pay-field-label">{t.amountLabel}</span>
        <span className="pay-amount-wrap">
          <span className="pay-amount-sign" aria-hidden="true">$</span>
          <input
            className="pay-input pay-amount"
            name="amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          />
        </span>
      </label>

      <label className="pay-field">
        <span className="pay-field-label">{t.nameLabel}</span>
        <input
          className="pay-input"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          placeholder={t.namePlaceholder}
        />
      </label>

      <label className="pay-field">
        <span className="pay-field-label">{t.noteLabel}</span>
        <input
          className="pay-input"
          name="note"
          type="text"
          maxLength={140}
          placeholder={t.notePlaceholder}
        />
      </label>

      <button type="submit" className="pay-submit">{t.submit}</button>
      <p className="pay-secure">{t.secure}</p>
    </form>
  )
}
