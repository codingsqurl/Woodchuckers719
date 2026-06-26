'use client'

// LeadForm — the compact quote-request form embedded on the lead-gen pages
// (services, blog). It reuses submitContract, the SAME server action behind the
// /contract-climbing intake, so every lead lands in the `estimates` table and the
// notification email. THIS IS THE REAL ENDPOINT: a server action writing to the
// app's own SQLite DB, no third-party lead service. (If you ever swap to an
// external CRM/webhook, that change goes in app/contract-climbing/actions.ts —
// the single submission handler for the whole site.)
import { useActionState } from 'react'
import { submitContract, type ContractState } from '../contract-climbing/actions'
import { PHONE_DISPLAY, PHONE_HREF } from './chrome'
import { type Locale, getDict } from '@/lib/i18n'

const INITIAL: ContractState = { status: 'idle' }

export function LeadForm({
  locale,
  heading,
  source = 'website',
}: {
  locale: Locale
  heading?: string
  source?: string
}) {
  const t = getDict(locale).contract
  const [state, formAction, isPending] = useActionState(submitContract, INITIAL)

  if (state.status === 'sent') {
    return (
      <section className="band services">
        <div className="band-inner">
          <div className="thanks">
            <h2 className="section-title">{t.thanksTitle(state.name)}</h2>
            <p>
              {t.thanksBody} <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const v = state.status === 'error' ? state.values : {}

  return (
    <section className="band services">
      <div className="band-inner">
        <form className="estimate-form contract-form" id="quote" action={formAction}>
          {state.status === 'error' ? <p className="error form-error">{state.error}</p> : null}
          <input type="hidden" name="locale" value={locale} readOnly />
          <input type="hidden" name="source" value={source} readOnly />
          <h2 className="form-title">{heading ?? t.formTitle}</h2>
          <div className="row2">
            <div className="field">
              <label htmlFor="lead-name">{t.fName}</label>
              <input type="text" id="lead-name" name="name" defaultValue={v.name ?? ''} required />
            </div>
            <div className="field">
              <label htmlFor="lead-phone">{t.fPhone}</label>
              <input type="tel" id="lead-phone" name="phone" defaultValue={v.phone ?? ''} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="lead-email">{t.fEmail}</label>
            <input type="email" id="lead-email" name="email" defaultValue={v.email ?? ''} />
          </div>
          <div className="field">
            <label htmlFor="lead-details">{t.detailsLabel}</label>
            <textarea
              id="lead-details"
              name="details"
              defaultValue={v.details ?? ''}
              placeholder={t.detailsPh}
            />
          </div>
          <p className="note note-tight">{t.requiredNote}</p>
          <button type="submit" disabled={isPending}>
            {isPending ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </section>
  )
}
