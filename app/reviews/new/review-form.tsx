'use client'

// The public review form: name, a 1–5 star rating, and the review text, wired to
// submitReview via useActionState so it works without JS. Nothing here is public
// on submit — the review lands as 'pending' and an admin approves it. Mirrors the
// contract form's shape (honeypot, error/sent states, localized copy).
//
// The rating is a real radio group (keyboard-operable, submits without JS). The
// inputs are rendered high-to-low and flipped back to 1→5 with row-reverse in
// CSS, so `input:checked ~ label` can fill every star up to the chosen one —
// the standard no-JS star pattern. Default is 5; the reviewer can change it.
import { Fragment } from 'react'
import { useActionState } from 'react'
import { submitReview, type ReviewState } from './actions'
import { PHONE_DISPLAY, PHONE_HREF } from '../../components/chrome'
import { type Locale, getDict } from '@/lib/i18n'

const INITIAL: ReviewState = { status: 'idle' }
const STAR_PATH = 'M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z'

export function ReviewForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).reviewForm
  const [state, formAction, isPending] = useActionState(submitReview, INITIAL)
  const v = state.status === 'error' ? state.values : {}
  // No default star: `required` forces a conscious pick, and an empty initial
  // state keeps the hover-fill unambiguous. A rejected submit restores the pick.
  const chosen = v.rating ?? ''

  if (state.status === 'sent') {
    return (
      <section className="band services">
        <div className="band-inner">
          <div className="thanks">
            <h2 className="section-title">{t.thanksTitle(state.author)}</h2>
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
        <h2 className="section-title">{t.formTitle}</h2>
        <p className="band-lead">{t.lead}</p>

        <form className="estimate-form review-form" action={formAction}>
          {state.status === 'error' ? (
            <p className="error form-error" role="alert">
              {state.error}
            </p>
          ) : null}

          <input type="hidden" name="locale" value={locale} readOnly />

          {/* honeypot: off-screen, hidden from AT + tab order; bots fill it,
              humans never see it. Checked server-side in submitReview. */}
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

          <div className="field">
            <label htmlFor="author">{t.fName}</label>
            <input
              type="text"
              id="author"
              name="author"
              autoComplete="name"
              maxLength={80}
              defaultValue={v.author ?? ''}
              required
            />
          </div>

          {/* star rating — a radio group; rendered 5→1, flipped to 1→5 in CSS */}
          <fieldset className="star-rating">
            <legend>{t.fRating}</legend>
            {/* input + label are flat siblings (no per-item wrapper) so the CSS
                `input:checked ~ label` fill can reach every lower star. */}
            <div className="star-picker">
              {[5, 4, 3, 2, 1].map((n) => (
                <Fragment key={n}>
                  <input
                    type="radio"
                    id={`rating-${n}`}
                    name="rating"
                    value={n}
                    defaultChecked={String(n) === chosen}
                    required
                  />
                  <label htmlFor={`rating-${n}`} aria-label={t.starsAria(n)}>
                    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  </label>
                </Fragment>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="town">{t.fTown}</label>
            <input
              type="text"
              id="town"
              name="town"
              autoComplete="address-level2"
              maxLength={80}
              defaultValue={v.town ?? ''}
              placeholder={t.townPh}
            />
          </div>

          <div className="field">
            <label htmlFor="body">{t.fReview}</label>
            <textarea
              id="body"
              name="body"
              maxLength={2000}
              defaultValue={v.body ?? ''}
              placeholder={t.reviewPh}
              required
            />
          </div>

          <p className="note note-tight">{t.moderationNote}</p>
          <div className="form-actions">
            <button type="submit" disabled={isPending}>
              {isPending ? t.submitting : t.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
