'use client'

// Client half of LeadForm. Identity is decided server-side (the wrapper in
// lead-form.tsx). The form always shows: when a verified identity exists, name +
// email come from the signed cookie and only phone + job are left to fill; when
// not, the visitor types name + email and an optional "verify with Google" link
// sits above the fields. submitContract trusts the cookie over any posted
// name/email whenever an identity is present.
import { useActionState } from 'react'
import { submitContract, type ContractState } from '../contract-climbing/actions'
import { PHONE_DISPLAY, PHONE_HREF } from './chrome'
import { VerifyButton, SignedInBanner } from './lead-gate'
import { type Locale, getDict } from '@/lib/i18n'
import type { LeadIdentity } from '@/lib/lead-identity'

const INITIAL: ContractState = { status: 'idle' }

export function LeadFormClient({
  locale,
  heading,
  source = 'website',
  identity,
  loginHref,
}: {
  locale: Locale
  heading?: string
  source?: string
  identity: LeadIdentity | null
  loginHref: string
}) {
  const t = getDict(locale).contract
  const [state, formAction, isPending] = useActionState(submitContract, INITIAL)
  const v = state.status === 'error' ? state.values : {}

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

  return (
    <section className="band services">
      <div className="band-inner">
        <form className="estimate-form contract-form" id="quote" action={formAction}>
          {state.status === 'error' ? (
            <p className="error form-error" role="alert">
              {state.error}
            </p>
          ) : null}
          <input type="hidden" name="locale" value={locale} readOnly />
          <input type="hidden" name="source" value={source} readOnly />
          {/* honeypot: off-screen, hidden from AT and tab order; bots fill it,
              humans never see it. Checked server-side in submitContract. NOT
              named "company" — that's a real autofill token Chrome fills for a
              B2B visitor even with autocomplete=off, which would drop the lead. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="lead-referral-code">Referral code</label>
            <input
              type="text"
              id="lead-referral-code"
              name="referral_code"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>
          <h2 className="form-title">{heading ?? t.formTitle}</h2>

          {identity ? (
            <SignedInBanner
              label={t.signedInAs(identity.name, identity.email)}
              switchLabel={t.switchAcct}
              href={loginHref}
            />
          ) : (
            <>
              <div className="row2">
                <div className="field">
                  <label htmlFor="lead-name">{t.fName}</label>
                  <input
                    type="text"
                    id="lead-name"
                    name="name"
                    autoComplete="name"
                    maxLength={200}
                    defaultValue={v.name ?? ''}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="lead-email">{t.fEmail}</label>
                  <input
                    type="email"
                    id="lead-email"
                    name="email"
                    autoComplete="email"
                    maxLength={254}
                    defaultValue={v.email ?? ''}
                  />
                </div>
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="lead-phone">{t.fPhone}</label>
            <input
              type="tel"
              id="lead-phone"
              name="phone"
              autoComplete="tel"
              maxLength={40}
              defaultValue={v.phone ?? ''}
            />
          </div>
          <div className="field">
            <label htmlFor="lead-details">{t.detailsLabel}</label>
            <textarea
              id="lead-details"
              name="details"
              maxLength={5000}
              defaultValue={v.details ?? ''}
              placeholder={t.detailsPh}
            />
          </div>
          {identity ? null : <p className="note note-tight">{t.requiredNote}</p>}
          {identity ? null : <p className="note verify-hint">{t.verifyPrompt}</p>}
          <div className="form-actions">
            <button type="submit" disabled={isPending}>
              {isPending ? t.submitting : t.submit}
            </button>
            {identity ? null : <VerifyButton label={t.verifyBtn} href={loginHref} />}
          </div>
        </form>
      </div>
    </section>
  )
}
