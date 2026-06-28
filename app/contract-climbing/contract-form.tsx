'use client'

// The contract page's only form: a short B2B job-intake wired to submitContract
// via useActionState (works without JS). Kept deliberately small — name, a way to
// reach back, and a free-text "what's the job" — so it can't be overlooked and
// nobody bails on a wall of dropdowns. Day rate is a flat $175–$350 range.
// Bilingual: visible strings come from the dictionary.
import { useActionState } from 'react'
import { submitContract, type ContractState } from './actions'
import { PHONE_DISPLAY, PHONE_HREF } from '../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { contractClimbing } from '@/lib/rates'

const money = (n: number) => '$' + n.toLocaleString('en-US')
const INITIAL: ContractState = { status: 'idle' }

export function ContractForm({ locale }: { locale: Locale }) {
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
    <>
      {/* booking band — day rate + the intake form, on glass like every other band */}
      <section className="band services">
        <div className="band-inner">
          <h2 className="section-title">{t.ratesTitle}</h2>
          <p className="rate-figure">
            <span className="rate-amount">
              {money(contractClimbing.dayLow)} – {money(contractClimbing.dayHigh)}
            </span>
            <span className="rate-unit">{t.rateUnit}</span>
          </p>
          <p className="included">{t.included}</p>

          <form className="estimate-form contract-form" id="job" action={formAction}>
            {state.status === 'error' ? <p className="error form-error">{state.error}</p> : null}

            <input type="hidden" name="locale" value={locale} readOnly />

            {/* honeypot: off-screen, hidden from AT and tab order; bots fill it,
                humans never see it. Checked server-side in submitContract. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <h3 className="form-title">{t.formTitle}</h3>

            <div className="row2">
              <div className="field">
                <label htmlFor="name">{t.fName}</label>
                <input type="text" id="name" name="name" defaultValue={v.name ?? ''} required />
              </div>
              <div className="field">
                <label htmlFor="phone">{t.fPhone}</label>
                <input type="tel" id="phone" name="phone" defaultValue={v.phone ?? ''} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">{t.fEmail}</label>
              <input type="email" id="email" name="email" defaultValue={v.email ?? ''} />
            </div>

            <div className="field">
              <label htmlFor="details">{t.detailsLabel}</label>
              <textarea
                id="details"
                name="details"
                defaultValue={v.details ?? ''}
                placeholder={t.detailsPh}
              />
            </div>

            <p className="note note-tight">{t.requiredNote}</p>
            <p className="note">{t.seHablaNote}</p>
            <button type="submit" disabled={isPending}>
              {isPending ? t.submitting : t.submit}
            </button>
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
