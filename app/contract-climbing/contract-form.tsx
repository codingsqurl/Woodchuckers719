'use client'

// The contract page's interactivity: the day-rate tier picker (pre-fills the
// hidden `tier` field) plus the B2B job-intake form, wired to the submitContract
// Server Action via useActionState so it still works with JS disabled. Bilingual:
// visible strings come from the dictionary; submitted option VALUES stay English
// (pulled from the English dict) so the owner's leads read in English.
import { useActionState, useState } from 'react'
import { submitContract, type ContractState } from './actions'
import { PHONE_DISPLAY, PHONE_HREF } from '../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'
import { contractClimbing } from '@/lib/rates'

const money = (n: number) => '$' + n.toLocaleString('en-US')

// English option VALUES — submitted regardless of the visitor's language.
const EN = getDict('en').contract
const CLIMB_KEYS = ['sectional', 'takedown', 'storm', 'rigging', 'other'] as const
const SIZE_KEYS = ['small', 'mid', 'big'] as const
const GROUND_KEYS = ['crew', 'climberOnly', 'unsure'] as const

const INITIAL: ContractState = { status: 'idle' }
type Tier = 'half' | 'full' | ''

export function ContractForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).contract
  const [state, formAction, isPending] = useActionState(submitContract, INITIAL)
  const [tier, setTier] = useState<Tier>('full')

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

  const v = state.status === 'error' ? state.values : {}

  return (
    <>
      {/* day-rate tiers — gear-stamp panels, pre-fill the request */}
      <section className="rates" aria-labelledby="rates-title">
        <h2 id="rates-title">{t.ratesTitle}</h2>
        <div className="tier-grid" role="radiogroup" aria-label={t.ratesTitle}>
          <button
            type="button"
            role="radio"
            aria-checked={tier === 'half'}
            className={'tier' + (tier === 'half' ? ' is-on' : '')}
            onClick={() => setTier('half')}
          >
            <span className="tier-name">{t.tierHalf}</span>
            <span className="tier-price">{money(contractClimbing.halfDay)}</span>
            <span className="tier-note">{t.tierHalfNote}</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={tier === 'full'}
            className={'tier' + (tier === 'full' ? ' is-on' : '')}
            onClick={() => setTier('full')}
          >
            <span className="tier-name">{t.tierFull}</span>
            <span className="tier-price">{money(contractClimbing.fullDay)}</span>
            <span className="tier-note">{t.tierFullNote}</span>
          </button>
        </div>
        <p className="included">{t.included}</p>
      </section>

      {/* quals — ruled list, peer credibility */}
      <section className="quals" aria-labelledby="quals-title">
        <h2 id="quals-title">{t.qualsTitle}</h2>
        <ul className="qual-list">
          {t.quals.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </section>

      <form className="estimate-form contract-form" id="job" action={formAction}>
        {state.status === 'error' ? <p className="error form-error">{state.error}</p> : null}

        <input type="hidden" name="locale" value={locale} readOnly />
        <input type="hidden" name="tier" value={tier} readOnly />

        <h3 className="form-title">{t.formTitle}</h3>

        <div className="row2">
          <div className="field">
            <label htmlFor="company">{t.fCompany}</label>
            <input type="text" id="company" name="company" defaultValue={v.company ?? ''} required />
          </div>
          <div className="field">
            <label htmlFor="contact">{t.fContact}</label>
            <input type="text" id="contact" name="contact" defaultValue={v.contact ?? ''} required />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="phone">{t.fPhone}</label>
            <input type="tel" id="phone" name="phone" defaultValue={v.phone ?? ''} />
          </div>
          <div className="field">
            <label htmlFor="email">{t.fEmail}</label>
            <input type="email" id="email" name="email" defaultValue={v.email ?? ''} />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="location">{t.fLocation}</label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={v.location ?? ''}
              placeholder={t.fLocationPh}
            />
          </div>
          <div className="field">
            <label htmlFor="climb">{t.fClimb}</label>
            <select id="climb" name="climb" defaultValue={v.climb ?? ''}>
              <option value="">{t.climbPick}</option>
              {CLIMB_KEYS.map((k) => (
                <option key={k} value={EN.climbOpts[k]}>
                  {t.climbOpts[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="size">{t.fSize}</label>
            <select id="size" name="size" defaultValue={v.size ?? ''}>
              <option value="">{t.sizePick}</option>
              {SIZE_KEYS.map((k) => (
                <option key={k} value={EN.sizeOpts[k]}>
                  {t.sizeOpts[k]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="when">{t.fWhen}</label>
            <input
              type="text"
              id="when"
              name="when"
              defaultValue={v.when ?? ''}
              placeholder={t.fWhenPh}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="ground">{t.fGround}</label>
          <select id="ground" name="ground" defaultValue={v.ground ?? ''}>
            <option value="">{t.groundPick}</option>
            {GROUND_KEYS.map((k) => (
              <option key={k} value={EN.groundOpts[k]}>
                {t.groundOpts[k]}
              </option>
            ))}
          </select>
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
    </>
  )
}
