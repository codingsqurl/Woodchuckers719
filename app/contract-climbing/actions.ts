'use server'

// Server Action backing the contract-climbing form (progressive enhancement —
// works without JS). The site's only intake form now. Reuses the `estimates`
// table with NO schema change: the lead is marked in `service`, the day rate is
// the flat $175–$350 range, and everything the requester typed lands in details.
import { createEstimate, type NewEstimate } from '@/lib/estimates'
import { estimateRL, clientIP } from '@/lib/ratelimit'
import { contractEmailHTML, sendMail, mailerConfigured } from '@/lib/mail'
import { getDict, isLocale } from '@/lib/i18n'
import { contractClimbing } from '@/lib/rates'

// leadsTo is where new requests are emailed.
const leadsTo = 'woodchuckerstrees719@gmail.com'

export type ContractValues = {
  name?: string
  phone?: string
  email?: string
  details?: string
}

export type ContractState =
  | { status: 'idle' }
  | { status: 'error'; error: string; values: ContractValues }
  | { status: 'sent'; name: string }

export async function submitContract(
  _prev: ContractState,
  formData: FormData,
): Promise<ContractState> {
  const str = (k: string): string => (formData.get(k)?.toString() ?? '').trim()

  // Localize the user-facing error strings to match the page the form was on.
  const localeStr = formData.get('locale')?.toString() ?? 'en'
  const tt = getDict(isLocale(localeStr) ? localeStr : 'en').contract

  const name = str('name')
  const email = str('email').toLowerCase()
  const phone = str('phone')
  const details = str('details')

  const preserved: ContractValues = { name, phone, email, details }

  // Spam throttle: 5/min/IP, shared with the (now redirected) estimate form.
  if (!estimateRL.allow(await clientIP())) {
    return { status: 'error', error: tt.errRate, values: preserved }
  }

  // name + at least one way to reach them.
  if (name === '' || (email === '' && phone === '')) {
    return { status: 'error', error: tt.errMissing, values: preserved }
  }

  const e: NewEstimate = {
    name,
    email,
    phone,
    address: '',
    service: 'Contract climbing',
    details,
    source: 'contract',
    removalInfo: '',
    estDays: 1,
    cleanup: false,
    debrisRemoval: false,
    estLow: contractClimbing.dayLow,
    estHigh: contractClimbing.dayHigh,
  }

  try {
    createEstimate(e)
  } catch (err) {
    console.error('createEstimate (contract):', err)
    return { status: 'error', error: tt.errSave, values: preserved }
  }

  // Notify the owner. Best-effort: the lead is already saved.
  if (mailerConfigured()) {
    try {
      await sendMail(
        leadsTo,
        `New contract climbing request — ${name}`,
        contractEmailHTML({
          name,
          phone,
          email,
          details,
          low: contractClimbing.dayLow,
          high: contractClimbing.dayHigh,
        }),
      )
    } catch (err) {
      console.error('contract email failed:', err)
    }
  }

  return { status: 'sent', name }
}
