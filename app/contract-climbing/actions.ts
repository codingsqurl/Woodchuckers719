'use server'

// Server Action backing the contract-climbing form (progressive enhancement —
// works without JS). The site's only intake form now. Reuses the `estimates`
// table with NO schema change: the lead is marked in `service`, the day rate is
// the ballpark $175–$350 range, and everything the requester typed lands in details.
import { createEstimate, type NewEstimate } from '@/lib/estimates'
import { estimateRL, clientIP } from '@/lib/ratelimit'
import { contractEmailHTML, leadReply, sendMail, mailerConfigured } from '@/lib/mail'
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

  // Clamp every field before it hits the DB or an email. A Server Action body can
  // be ~1MB; no reason to store or send oversized junk.
  const name = str('name').slice(0, 200)
  const email = str('email').toLowerCase().slice(0, 254)
  const phone = str('phone').slice(0, 40)
  const details = str('details').slice(0, 5000)
  // Only auto-reply to a well-formed address — never let the form relay mail to
  // an arbitrary or garbage recipient.
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  // lead attribution: which page's form this came from (LeadForm sets it); the
  // contract page form sends none, so it falls back to 'contract'.
  const source = (str('source') || 'contract').slice(0, 60)

  const preserved: ContractValues = { name, phone, email, details }

  // Honeypot: a hidden "company" field no human sees (off-screen, aria-hidden,
  // tabindex -1, autocomplete off). Bots that autofill every input trip it. Play
  // dead — show the same thanks page so the bot thinks it worked — but save and
  // email nothing. Real submitters always leave this empty.
  if (str('company') !== '') {
    return { status: 'sent', name: name || 'there' }
  }

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
    source,
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
        `New website lead — ${name}`,
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

    // Auto-reply to the requester (best-effort, only if they left a valid email).
    // Localized to the page they were on. The lead is already saved; a failed
    // receipt never blocks the submission.
    if (validEmail) {
      try {
        const reply = leadReply(name, localeStr)
        await sendMail(email, reply.subject, reply.html)
      } catch (err) {
        console.error('lead auto-reply failed:', err)
      }
    }
  }

  return { status: 'sent', name }
}
