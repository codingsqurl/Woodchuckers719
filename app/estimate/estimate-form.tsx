'use client'

// The estimate page's interactivity: the live day-rate calculator, wired to the
// submitEstimate Server Action via useActionState so it still works with JS
// disabled. Simplified — the old per-tree builder (six dropdowns per tree) was
// cut for a single "what do you need" select plus a free-text description; the
// per-tree specifics come on the call ("final number after I see the tree").
// Bilingual: visible strings come from the dictionary; submitted option VALUES
// stay English so the owner's leads read in English.
import { useActionState, useState } from 'react'
import { submitEstimate, type EstimateState } from './actions'
import { PHONE_DISPLAY, PHONE_HREF } from '../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { fullJob } from '@/lib/rates'

const money = (n: number) => '$' + n.toLocaleString('en-US')

// English option VALUES — submitted regardless of the visitor's language.
const EN = getDict('en').estimate
const SERVICE_KEYS = ['remove', 'trim', 'sectional', 'storm', 'unsure'] as const

const INITIAL: EstimateState = { status: 'idle' }

export function EstimateForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).estimate
  const [state, formAction, isPending] = useActionState(submitEstimate, INITIAL)

  // calculator state
  const [days, setDays] = useState(1)
  const [debris, setDebris] = useState('none')
  const [bumpKey, setBumpKey] = useState(0)

  const add = debris === 'removal' ? fullJob.debrisRemoval : debris === 'cleanup' ? fullJob.cleanup : 0
  const low = days * fullJob.dayLow + add
  const high = days * fullJob.dayHigh + add
  const pulse = () => setBumpKey((k) => k + 1)

  if (state.status === 'sent') {
    return (
      <section className="thanks">
        <h1>{t.thanksTitle(state.name)}</h1>
        <p>
          {t.thanksBody} <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
        </p>
      </section>
    )
  }

  const values = state.status === 'error' ? state.values : {}

  return (
    <>
      <section className="estimate-head">
        <h1>{t.headTitle}</h1>
        <p>{t.headIntro}</p>
        <p className="note">
          {t.headNote1} <strong>{t.headNotePrice}</strong>
          {t.headNote2} <strong>{t.headNoteCleanup}</strong>
          {t.headNote3}
        </p>
        <p className="note">{t.seHablaNote}</p>
      </section>

      {/* live ballpark calculator (client-side) */}
      <div className="calc">
        <div className="calc-row">
          <label>{t.calcLenLabel}</label>
          <div className="seg" id="est-days-seg">
            <label className="seg-opt">
              <input
                type="radio"
                name="est_days"
                value="1"
                form="estimate-form"
                checked={days === 1}
                onChange={() => {
                  setDays(1)
                  pulse()
                }}
              />
              <span>{t.day1}</span>
            </label>
            <label className="seg-opt">
              <input
                type="radio"
                name="est_days"
                value="2"
                form="estimate-form"
                checked={days === 2}
                onChange={() => {
                  setDays(2)
                  pulse()
                }}
              />
              <span>{t.day2}</span>
            </label>
          </div>
          <p className="calc-hint">{t.calcHint}</p>
        </div>
        <div className="calc-row">
          <label htmlFor="debris">{t.debrisLabel}</label>
          <select
            id="debris"
            name="debris"
            form="estimate-form"
            value={debris}
            onChange={(e) => {
              setDebris(e.target.value)
              pulse()
            }}
          >
            <option value="none">{t.debrisNone}</option>
            <option value="cleanup">{t.debrisCleanup}</option>
            <option value="removal">{t.debrisRemoval}</option>
          </select>
        </div>
        <div className="calc-result">
          <div className={'amount' + (bumpKey > 0 ? ' bump' : '')} id="amount" key={bumpKey}>
            {money(low)} – {money(high)}
          </div>
          <div className="sub">{t.calcSub}</div>
        </div>
      </div>

      <form className="estimate-form" id="estimate-form" action={formAction}>
        {state.status === 'error' ? <p className="error form-error">{state.error}</p> : null}

        {/* locale + calculator snapshot, kept in sync with the live total */}
        <input type="hidden" name="locale" value={locale} readOnly />
        <input type="hidden" id="est_low" name="est_low" value={low} readOnly />
        <input type="hidden" id="est_high" name="est_high" value={high} readOnly />

        <div className="row2">
          <div className="field">
            <label htmlFor="name">{t.fName}</label>
            <input type="text" id="name" name="name" defaultValue={values.name ?? ''} required />
          </div>
          <div className="field">
            <label htmlFor="phone">{t.fPhone}</label>
            <input type="tel" id="phone" name="phone" defaultValue={values.phone ?? ''} />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="email">{t.fEmail}</label>
            <input type="email" id="email" name="email" defaultValue={values.email ?? ''} />
          </div>
          <div className="field">
            <label htmlFor="address">{t.fAddress}</label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={values.address ?? ''}
              placeholder={t.fAddressPh}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="service">{t.tWhat}</label>
          <select id="service" name="service" defaultValue={values.service ?? ''}>
            <option value="">{t.tHeightPick}</option>
            {SERVICE_KEYS.map((k) => (
              <option key={k} value={EN.tWhatOpts[k]}>
                {t.tWhatOpts[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="details">{t.detailsLabel}</label>
          <textarea id="details" name="details" defaultValue={values.details ?? ''} placeholder={t.detailsPh} />
        </div>

        <div className="field">
          <label htmlFor="source">{t.sourceLabel}</label>
          <select id="source" name="source" defaultValue={values.source ?? ''}>
            <option value="">{t.sourcePick}</option>
            <option value="google">{t.sourceOpts.google}</option>
            <option value="facebook">{t.sourceOpts.facebook}</option>
            <option value="nextdoor">{t.sourceOpts.nextdoor}</option>
            <option value="instagram">{t.sourceOpts.instagram}</option>
            <option value="tiktok">{t.sourceOpts.tiktok}</option>
            <option value="yelp">{t.sourceOpts.yelp}</option>
            <option value="referral">{t.sourceOpts.referral}</option>
            <option value="truck">{t.sourceOpts.truck}</option>
            <option value="other">{t.sourceOpts.other}</option>
          </select>
        </div>

        <p className="note note-tight">{t.requiredNote}</p>
        <button type="submit" disabled={isPending}>
          {isPending ? t.submitting : t.submit}
        </button>
      </form>
    </>
  )
}
