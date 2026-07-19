'use client'

// The contract page's only form: a short B2B job-intake wired to submitContract
// via useActionState (works without JS). Google sign-in is OPTIONAL — a verified
// visitor gets name/email from the signed cookie (just phone + the job left to
// fill); everyone else types name/email plainly, with an optional "verify with
// Google" link above the fields. Day rate is a flat $250–$500 range. Bilingual.
import { useActionState } from 'react'
import { submitContract, type ContractState } from './actions'
import { PHONE_DISPLAY, PHONE_HREF } from '../components/chrome'
import { VerifyButton, SignedInBanner } from '../components/lead-gate'
import { type Locale, getDict } from '@/lib/i18n'
import { contractClimbing } from '@/lib/rates'
import type { LeadIdentity } from '@/lib/lead-identity'

const money = (n: number) => '$' + n.toLocaleString('en-US')
const INITIAL: ContractState = { status: 'idle' }

export function ContractForm({
  locale,
  identity,
  loginHref,
  unverified = false,
}: {
  locale: Locale
  identity: LeadIdentity | null
  loginHref: string
  // true when Google bounced the visitor back with an unverified email
  // (callback redirects to ?signin=unverified) — show why the gate's still up.
  unverified?: boolean
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
    <>
      {/* booking band — day rate + the intake, on glass like every other band */}
      <section className="band services">
        <div className="band-inner">
          <h2 className="section-title">{t.ratesTitle}</h2>
          <p className="rate-figure">
            <span className="rate-amount">
              {money(contractClimbing.dayLow)} – {money(contractClimbing.dayHigh)}
            </span>
            <span className="rate-unit">{t.rateUnit}</span>
          </p>
          <p className="note note-tight">{t.rateNote}</p>
          <p className="included">{t.included}</p>

          <form className="estimate-form contract-form" id="job" action={formAction}>
            {state.status === 'error' ? (
              <p className="error form-error" role="alert">
                {state.error}
              </p>
            ) : null}

            <input type="hidden" name="locale" value={locale} readOnly />

            {/* honeypot: off-screen, hidden from AT and tab order; bots fill it,
                humans never see it. Checked server-side in submitContract. NOT
                named "company" — that's a real autofill token Chrome fills for a
                B2B visitor even with autocomplete=off, which would drop the lead. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="referral-code">Referral code</label>
              <input
                type="text"
                id="referral-code"
                name="referral_code"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <h3 className="form-title">{t.formTitle}</h3>

            {identity ? (
              <SignedInBanner
                label={t.signedInAs(identity.name, identity.email)}
                switchLabel={t.switchAcct}
                href={loginHref}
              />
            ) : (
              <>
                {unverified ? <p className="note signin-note">{t.signInUnverified}</p> : null}
                <div className="row2">
                  <div className="field">
                    <label htmlFor="name">{t.fName}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      maxLength={200}
                      defaultValue={v.name ?? ''}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">{t.fEmail}</label>
                    <input
                      type="email"
                      id="email"
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
              <label htmlFor="phone">{t.fPhone}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                maxLength={40}
                defaultValue={v.phone ?? ''}
              />
            </div>

            <div className="field">
              <label htmlFor="details">{t.detailsLabel}</label>
              <textarea
                id="details"
                name="details"
                maxLength={5000}
                defaultValue={v.details ?? ''}
                placeholder={t.detailsPh}
              />
            </div>

            {identity ? null : <p className="note note-tight">{t.requiredNote}</p>}
            <p className="note" lang="es">
              {t.seHablaNote}
            </p>
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

      {/* quals — why me, after the form */}
      <section className="band hazard">
        <div className="band-inner">
          <h2 className="section-title">{t.qualsTitle}</h2>
          <ul className="qual-list">
            {t.quals.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
