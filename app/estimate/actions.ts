'use server'

// Server Action backing the estimate form (progressive enhancement — works
// without JS). Port of handleEstimateSubmit: rate limit, trim/normalize,
// summarize trees, clamp the client numbers, validate, store, best-effort email.
import { atoiClamp, createEstimate, type NewEstimate, type Estimate } from '@/lib/estimates'
import { estimateRL, clientIP } from '@/lib/ratelimit'
import { estimateEmailHTML, sendMail, mailerConfigured } from '@/lib/mail'
import { getDict, isLocale } from '@/lib/i18n'

// leadsTo is where new estimate requests are emailed.
const leadsTo = 'woodchuckerstrees719@gmail.com'

export type EstimateValues = {
  name?: string
  email?: string
  phone?: string
  address?: string
  service?: string
  details?: string
  source?: string
}

export type EstimateState =
  | { status: 'idle' }
  | { status: 'error'; error: string; values: EstimateValues }
  | { status: 'sent'; name: string }

export async function submitEstimate(
  _prev: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  const str = (k: string): string => (formData.get(k)?.toString() ?? '').trim()

  // Localize the user-facing error strings to match the page the form was on.
  const localeStr = formData.get('locale')?.toString() ?? 'en'
  const tt = getDict(isLocale(localeStr) ? localeStr : 'en').estimate

  const name = str('name')
  const email = str('email').toLowerCase()
  const phone = str('phone')
  const address = str('address')
  const details = str('details')
  const source = str('source')
  const service = str('service')
  const debris = formData.get('debris')?.toString() ?? ''

  const e: NewEstimate = {
    name,
    email,
    phone,
    address,
    service,
    details,
    source,
    removalInfo: '',
    // Never trust the client numbers — re-clamp server-side.
    estDays: atoiClamp(formData.get('est_days')?.toString() ?? '', 1, 2),
    cleanup: debris === 'cleanup',
    debrisRemoval: debris === 'removal',
    estLow: atoiClamp(formData.get('est_low')?.toString() ?? '', 0, 1_000_000),
    estHigh: atoiClamp(formData.get('est_high')?.toString() ?? '', 0, 1_000_000),
  }

  const preserved: EstimateValues = { name, email, phone, address, service, details, source }

  // Spam throttle: 5/min/IP. App Router can't make a page route return a raw
  // 429, so over-limit surfaces as the same inline message (the SSO GET routes
  // keep the literal 429). The lead is never saved when throttled.
  if (!estimateRL.allow(await clientIP())) {
    return { status: 'error', error: tt.errRate, values: preserved }
  }

  // name + at least one way to reach them.
  if (name === '' || (email === '' && phone === '')) {
    return {
      status: 'error',
      error: tt.errMissing,
      values: preserved,
    }
  }

  try {
    createEstimate(e)
  } catch (err) {
    console.error('createEstimate:', err)
    return {
      status: 'error',
      error: tt.errSave,
      values: preserved,
    }
  }

  // Notify the owner. Best-effort: the lead is already saved.
  if (mailerConfigured()) {
    const full: Estimate = { ...e, id: 0, status: 'new', createdAt: 0 }
    try {
      await sendMail(leadsTo, `New estimate request — ${name}`, estimateEmailHTML(full))
    } catch (err) {
      console.error('estimate email failed:', err)
    }
  }

  return { status: 'sent', name }
}
