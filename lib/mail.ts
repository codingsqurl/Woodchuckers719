// mail.ts — port of mail.go. Transactional email through the Resend HTTP API
// via raw fetch (the Go code used the same raw HTTP call). When RESEND_API_KEY
// is unset, email is "not configured": invites/leads still create rows but no
// mail goes out.
import { debrisLabel, type Estimate } from './estimates'

// escapeHtml mirrors Go's template.HTMLEscapeString exactly.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&#34;')
}

export function mailerConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

// sendMail posts one HTML email to Resend. Throws on a non-2xx response.
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('mail not configured')
  const from = process.env.MAIL_FROM || 'Woodchuckers <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
    signal: AbortSignal.timeout(10_000),
  })
  if (res.status >= 300) {
    const body = await res.text()
    throw new Error(`resend ${res.status}: ${body}`)
  }
}

// estimateEmailHTML builds the owner notification for a new estimate request.
export function estimateEmailHTML(e: Estimate): string {
  const row = (label: string, val: string): string =>
    val === '' ? '' : `<p><strong>${label}:</strong> ${escapeHtml(val)}</p>`
  const details =
    e.details !== '' ? `<p><strong>Details:</strong><br>${escapeHtml(e.details)}</p>` : ''

  return `<h2>New estimate request</h2>
${row('Name', e.name)}${row('Phone', e.phone)}${row('Email', e.email)}${row('Address', e.address)}${row('Trees', e.service)}${row('Details', e.removalInfo)}${row('Heard via', e.source)}<p><strong>Debris:</strong> ${debrisLabel(e)}</p>
<p><strong>Estimated:</strong> ${e.estDays} day(s), ballpark $${e.estLow}–$${e.estHigh}</p>
${details}`
}

// contractEmailHTML builds the owner notification for a contract climbing
// request (the B2B path — a tree company booking the climber for a section).
export function contractEmailHTML(o: {
  company: string
  contact: string
  phone: string
  email: string
  location: string
  tier: string
  climb: string
  size: string
  when: string
  ground: string
  details: string
  price: number
}): string {
  const row = (label: string, val: string): string =>
    val === '' ? '' : `<p><strong>${label}:</strong> ${escapeHtml(val)}</p>`
  const notes = o.details !== '' ? `<p><strong>Notes:</strong><br>${escapeHtml(o.details)}</p>` : ''
  const rate = o.price > 0 ? `$${o.price}` : 'TBD'

  return `<h2>New contract climbing request</h2>
${row('Company', o.company)}${row('Contact', o.contact)}${row('Phone', o.phone)}${row('Email', o.email)}${row('Job location', o.location)}${row('Booking', o.tier)}${row('Climb', o.climb)}${row('Size', o.size)}${row('When', o.when)}${row('Ground support', o.ground)}<p><strong>Day rate:</strong> ${rate}</p>
${notes}`
}

// inviteEmailHTML builds the body for a "sign in with Google" invite. The name
// is escaped; the login URL is trusted (we build it).
export function inviteEmailHTML(name: string, loginURL: string): string {
  return `<p>Hi ${escapeHtml(name)},</p>
<p>You've been added to the Woodchuckers crew portal.</p>
<p>Sign in with your Google account to get started:</p>
<p><a href="${loginURL}">${loginURL}</a></p>`
}
