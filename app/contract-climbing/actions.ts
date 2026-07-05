'use server'

// Server Action backing the contract-climbing form (progressive enhancement —
// works without JS). The site's only intake form now. Reuses the `estimates`
// table with NO schema change: the lead is marked in `service`, the day rate is
// the ballpark $175–$350 range, and everything the requester typed lands in details.
import { after } from 'next/server'
import { createEstimate, type NewEstimate } from '@/lib/estimates'
import { estimateRL, autoReplyRL, clientIP } from '@/lib/ratelimit'
import { contractEmailHTML, leadReply, sendMail, mailerConfigured, mailFrom } from '@/lib/mail'
import { logEmail } from '@/lib/email-log'
import { getDict, isLocale } from '@/lib/i18n'
import { contractClimbing } from '@/lib/rates'
import { readLeadIdentity } from '@/lib/lead-identity'

// leadsTo is where new requests are emailed.
const leadsTo = 'woodchuckerstrees719@gmail.com'

// Every echoed-back field on a transient error. When the visitor is signed in,
// name + email come from the verified cookie and these fields aren't rendered,
// so the extra keys are simply unused — harmless.
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

  // Clamp the free-text fields before they hit the DB or an email. A Server
  // Action body can be ~1MB; no reason to store or send oversized junk. Name and
  // email are NOT read from the form — they come from the verified identity below.
  const phone = str('phone').slice(0, 40)
  const details = str('details').slice(0, 5000)
  // lead attribution: which page's form this came from (LeadForm sets it); the
  // contract page form sends none, so it falls back to 'contract'.
  const source = (str('source') || 'contract').slice(0, 60)

  // Identity is OPTIONAL. If the visitor verified with Google, trust the signed
  // cookie for name + email — a confirmed address, no typos. Otherwise fall back
  // to what they typed: the form works fine without signing in. `verified` also
  // says whether the name/email pair can skip the required-fields check below.
  const identity = await readLeadIdentity()
  const verified = identity !== null
  const name = (identity ? identity.name : str('name')).slice(0, 200)
  const email = (identity ? identity.email : str('email')).toLowerCase().slice(0, 254)
  // Only relay an auto-reply to a well-formed address — never let the form send
  // mail to garbage. Google-verified addresses always pass; typed ones are checked.
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const preserved: ContractValues = { name, phone, email, details }

  // Honeypot: a hidden "referral_code" field no human sees (off-screen,
  // aria-hidden, tabindex -1, autocomplete off). Deliberately NOT named
  // "company"/"organization" — those are real browser-autofill tokens Chrome
  // fills even with autocomplete=off, which would silently drop a legit B2B lead
  // whose profile has an org. Bots that fill every input still trip it. Play dead
  // (same thanks page) but save and email nothing; log a trace so it isn't silent.
  if (str('referral_code') !== '') {
    console.warn('lead honeypot tripped, dropping submission')
    return { status: 'sent', name: name || 'there' }
  }

  // Spam throttle: 5/min/IP, shared with the (now redirected) estimate form.
  if (!estimateRL.allow(await clientIP())) {
    return { status: 'error', error: tt.errRate, values: preserved }
  }

  // Need a name and at least one WORKING way to reach back. A non-empty but
  // malformed email (e.g. "bob@gmailcom" — passes the browser's type=email check)
  // with no phone is treated as no contact info, so the lead isn't saved as
  // permanently unreachable while the visitor is told it went through. Skipped
  // when verified — Google guarantees a real address.
  if (!verified && (name === '' || (!validEmail && phone === ''))) {
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

  let leadId: number
  try {
    leadId = createEstimate(e)
  } catch (err) {
    console.error('createEstimate (contract):', err)
    return { status: 'error', error: tt.errSave, values: preserved }
  }

  // Notify the owner + send the auto-reply AFTER the response is sent. The lead
  // is already saved, mail is best-effort, and Resend can be slow (each send has
  // a 10s timeout) — running it inline would hold the Server Action open up to
  // ~20s on a hung ESP and widen the double-submit window on the no-JS path.
  if (mailerConfigured()) {
    after(async () => {
      const ownerSubject = `New website lead — ${name}`
      try {
        const id = await sendMail(
          leadsTo,
          ownerSubject,
          contractEmailHTML({
            name,
            phone,
            email,
            details,
            low: contractClimbing.dayLow,
            high: contractClimbing.dayHigh,
          }),
          // Reply-To the customer (when they gave a valid email) so hitting reply
          // on the lead notification answers the lead directly.
          validEmail ? email : undefined,
        )
        logEmail({ estimateId: leadId, direction: 'out', from: mailFrom(), to: leadsTo, subject: ownerSubject, status: 'sent', providerId: id })
      } catch (err) {
        console.error('contract email failed:', err)
        logEmail({ estimateId: leadId, direction: 'out', from: mailFrom(), to: leadsTo, subject: ownerSubject, status: 'failed' })
      }

      // Auto-reply receipt to the requester, localized to their page. Only to a
      // valid address, and throttled to one per recipient per hour so the public
      // form can't be used to mail-bomb a third party (the IP limit alone lets 5
      // sends/min to any typed address). The lead is saved regardless.
      if (validEmail && autoReplyRL.allow(email)) {
        const reply = leadReply(name, localeStr)
        try {
          // Reply-To the owner's monitored inbox so a customer reply lands there
          // directly, not on the send-only from-address (no forwarding needed).
          const id = await sendMail(email, reply.subject, reply.html, leadsTo)
          logEmail({ estimateId: leadId, direction: 'out', from: mailFrom(), to: email, subject: reply.subject, status: 'sent', providerId: id })
        } catch (err) {
          console.error('lead auto-reply failed:', err)
          logEmail({ estimateId: leadId, direction: 'out', from: mailFrom(), to: email, subject: reply.subject, status: 'failed' })
        }
      }
    })
  }

  return { status: 'sent', name }
}
