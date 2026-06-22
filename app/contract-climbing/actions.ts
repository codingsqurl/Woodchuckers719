'use server'

// Server Action backing the contract-climbing form (progressive enhancement —
// works without JS). Mirrors submitEstimate: rate limit, trim/normalize,
// validate, store, best-effort email. v1 reuses the `estimates` table with NO
// schema change — the lead is marked unmistakably in `service` and the B2B
// specifics are packed into removal_info. A future `kind` column can split
// homeowner vs contract leads in the admin inbox.
import { createEstimate, type NewEstimate } from '@/lib/estimates'
import { estimateRL, clientIP } from '@/lib/ratelimit'
import { contractEmailHTML, sendMail, mailerConfigured } from '@/lib/mail'
import { getDict, isLocale } from '@/lib/i18n'
import { contractClimbing } from '@/lib/rates'

// leadsTo is where new requests are emailed (same inbox as homeowner estimates).
const leadsTo = 'woodchuckerstrees719@gmail.com'

export type ContractValues = {
  company?: string
  contact?: string
  phone?: string
  email?: string
  location?: string
  climb?: string
  size?: string
  when?: string
  ground?: string
  details?: string
  tier?: string
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

  const company = str('company')
  const contact = str('contact')
  const email = str('email').toLowerCase()
  const phone = str('phone')
  const location = str('location')
  const climb = str('climb')
  const size = str('size')
  const when = str('when')
  const ground = str('ground')
  const details = str('details')
  const tier = str('tier')

  // Resolve the picked tier to a flat day rate server-side — never trust the client.
  const tierPrice =
    tier === 'full' ? contractClimbing.fullDay : tier === 'half' ? contractClimbing.halfDay : 0
  const tierLabel = tier === 'full' ? 'Full day' : tier === 'half' ? 'Half day' : 'Day rate TBD'

  const preserved: ContractValues = {
    company,
    contact,
    phone,
    email,
    location,
    climb,
    size,
    when,
    ground,
    details,
    tier,
  }

  // Spam throttle: 5/min/IP, shared with the homeowner estimate form.
  if (!estimateRL.allow(await clientIP())) {
    return { status: 'error', error: tt.errRate, values: preserved }
  }

  // company + a name + at least one way to reach them.
  if (company === '' || contact === '' || (email === '' && phone === '')) {
    return { status: 'error', error: tt.errMissing, values: preserved }
  }

  // Pack the B2B specifics into one summary string stored in removal_info.
  const summary = [
    company && `Company: ${company}`,
    climb && `Climb: ${climb}`,
    size && `Size: ${size}`,
    when && `When: ${when}`,
    ground && `Ground: ${ground}`,
  ]
    .filter(Boolean)
    .join(' | ')

  const e: NewEstimate = {
    name: contact,
    email,
    phone,
    address: location,
    service: `Contract climbing — ${tierLabel}`,
    details,
    source: 'contract',
    removalInfo: summary,
    estDays: 1,
    cleanup: false,
    debrisRemoval: false,
    estLow: tierPrice,
    estHigh: tierPrice,
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
        `New contract climbing request — ${company || contact}`,
        contractEmailHTML({
          company,
          contact,
          phone,
          email,
          location,
          tier: tierLabel,
          climb,
          size,
          when,
          ground,
          details,
          price: tierPrice,
        }),
      )
    } catch (err) {
      console.error('contract email failed:', err)
    }
  }

  return { status: 'sent', name: contact }
}
