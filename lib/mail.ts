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

// sendMail posts one HTML email to Resend. Throws on a non-2xx response. `from`
// stays on the verified domain for DKIM/deliverability; `replyTo` (optional) is
// where a reply actually lands — a real monitored inbox — since the `from`
// address is send-only. Without it, replies to the auto-reply go nowhere.
export async function sendMail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('mail not configured')
  const from = process.env.MAIL_FROM || 'Woodchuckers <onboarding@resend.dev>'

  const payload: Record<string, unknown> = { from, to: [to], subject, html }
  if (replyTo) payload.reply_to = replyTo

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

// contractEmailHTML builds the owner notification for a new website lead from the
// contract form. Designed as a real HTML email: table layout + inline styles (the
// only thing Gmail/Apple Mail render reliably — no flexbox, grid, or <style>),
// brand pine + safety orange, and tap-to-call / tap-to-email buttons so the boss
// can respond straight from his phone. All user values are escaped.
export function contractEmailHTML(o: {
  name: string
  phone: string
  email: string
  details: string
  low: number
  high: number
}): string {
  const esc = escapeHtml
  const tel = o.phone.replace(/[^\d+]/g, '') // safe href: digits and + only
  const name = esc(o.name)

  // one label/value row; skipped entirely when the value is empty. `value` is
  // trusted HTML (links built below with escaped text), labels are static.
  const row = (label: string, value: string): string =>
    value === ''
      ? ''
      : `<tr>
          <td style="padding:7px 0;width:88px;vertical-align:top;color:#9fad9f;font:600 12px Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;">${label}</td>
          <td style="padding:7px 0;color:#ffffff;font:400 16px Arial,sans-serif;">${value}</td>
        </tr>`

  const phoneVal =
    o.phone === ''
      ? ''
      : `<a href="tel:${tel}" style="color:#ffffff;text-decoration:none;">${esc(o.phone)}</a>`
  const emailVal =
    o.email === ''
      ? ''
      : `<a href="mailto:${esc(o.email)}" style="color:#ffffff;text-decoration:none;">${esc(o.email)}</a>`

  const job =
    o.details === ''
      ? ''
      : `<tr><td colspan="2" style="padding-top:18px;">
          <div style="color:#9fad9f;font:600 12px Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;margin-bottom:7px;">The job</div>
          <div style="background:#06160d;border-left:3px solid #f2601c;border-radius:6px;padding:14px 16px;color:#eef2ec;font:400 15px/1.55 Arial,sans-serif;white-space:pre-wrap;">${esc(o.details)}</div>
        </td></tr>`

  const callBtn =
    o.phone === ''
      ? ''
      : `<td style="padding-right:10px;"><a href="tel:${tel}" style="display:inline-block;background:#f2601c;color:#0e1411;font:700 15px Arial,sans-serif;text-decoration:none;padding:13px 24px;border-radius:10px;">Call ${name}</a></td>`
  const emailBtn =
    o.email === ''
      ? ''
      : `<td><a href="mailto:${esc(o.email)}" style="display:inline-block;border:2px solid rgba(255,255,255,.4);color:#ffffff;font:700 15px Arial,sans-serif;text-decoration:none;padding:11px 22px;border-radius:10px;">Email ${name}</a></td>`

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#081410;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${name} filled out the contract form — tap to call or email.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#081410;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#0e2018;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;">
<tr><td style="background:#06160d;padding:22px 28px;border-bottom:3px solid #f2601c;">
<div style="color:#ffffff;font:800 18px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;">Woodchuckers</div>
<div style="color:#f2601c;font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-top:5px;">New website lead</div>
</td></tr>
<tr><td style="padding:28px;">
<div style="color:#c8d2c8;font:400 15px Arial,sans-serif;margin:0 0 4px;">Someone just filled out the contract form:</div>
<div style="color:#ffffff;font:800 26px Arial,sans-serif;margin:0 0 18px;">${name}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Phone', phoneVal)}${row('Email', emailVal)}${row('Day rate', `$${o.low}&ndash;$${o.high}/day`)}${job}
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>${callBtn}${emailBtn}</tr></table>
</td></tr>
<tr><td style="background:#06160d;padding:16px 28px;border-top:1px solid rgba(255,255,255,.08);">
<div style="color:#7fb89a;font:400 12px Arial,sans-serif;">Sent automatically from the Woodchuckers website.</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

// leadReply builds the auto-reply sent to the requester right after they submit
// the lead form (the owner gets contractEmailHTML; this is the customer's "got
// it" receipt). Bilingual: copy is keyed by the locale the form was on, so a
// Spanish lead gets a Spanish reply. Returns the subject + HTML together; the
// name is escaped, the call button points at the shop number (a constant).
const SHOP_TEL = '+17197562597'
const SHOP_PHONE = '(719) 756-2597'

export function leadReply(name: string, locale: string): { subject: string; html: string } {
  const es = locale === 'es'
  const esc = escapeHtml
  const safeName = esc(name)

  const t = es
    ? {
        subject: 'Gracias — Woodchuckers recibió su solicitud',
        pre: 'Me comunicaré para confirmar disponibilidad y una tarifa por día firme.',
        kicker: 'Solicitud recibida',
        hi: `Gracias, ${safeName}.`,
        body: 'Su solicitud está registrada. Me comunicaré pronto para confirmar disponibilidad y una tarifa por día firme.',
        sooner: '¿Lo necesita antes? Llame o escriba:',
        btn: 'Llamar',
        foot: 'Woodchuckers · Escalador por contrato · Colorado Springs',
        auto: 'Este es un mensaje automático. Puede responder a este correo.',
      }
    : {
        subject: 'Thanks — Woodchuckers got your request',
        pre: "I'll be in touch to confirm availability and a firm day rate.",
        kicker: 'Request received',
        hi: `Thanks, ${safeName}.`,
        body: "Your request is in. I'll reach out shortly to confirm availability and a firm day rate.",
        sooner: 'Need it sooner? Call or text:',
        btn: 'Call',
        foot: 'Woodchuckers · Contract tree climbing · Colorado Springs',
        auto: 'This is an automatic message. You can reply to this email.',
      }

  const html = `<!doctype html>
<html lang="${es ? 'es' : 'en'}">
<body style="margin:0;padding:0;background:#081410;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${t.pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#081410;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#0e2018;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;">
<tr><td style="background:#06160d;padding:22px 28px;border-bottom:3px solid #f2601c;">
<div style="color:#ffffff;font:800 18px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;">Woodchuckers</div>
<div style="color:#f2601c;font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-top:5px;">${t.kicker}</div>
</td></tr>
<tr><td style="padding:28px;">
<div style="color:#ffffff;font:800 24px Arial,sans-serif;margin:0 0 14px;">${t.hi}</div>
<div style="color:#c8d2c8;font:400 16px/1.6 Arial,sans-serif;margin:0 0 18px;">${t.body}</div>
<div style="color:#9fad9f;font:400 15px Arial,sans-serif;margin:0 0 8px;">${t.sooner}</div>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td><a href="tel:${SHOP_TEL}" style="display:inline-block;background:#f2601c;color:#0e1411;font:700 15px Arial,sans-serif;text-decoration:none;padding:13px 24px;border-radius:10px;">${t.btn} ${SHOP_PHONE}</a></td>
</tr></table>
</td></tr>
<tr><td style="background:#06160d;padding:16px 28px;border-top:1px solid rgba(255,255,255,.08);">
<div style="color:#7fb89a;font:400 12px Arial,sans-serif;">${t.foot}</div>
<div style="color:#566b5c;font:400 11px Arial,sans-serif;margin-top:6px;">${t.auto}</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

  return { subject: t.subject, html }
}

// inviteEmailHTML builds the body for a "sign in with Google" invite. The name
// is escaped; the login URL is trusted (we build it).
export function inviteEmailHTML(name: string, loginURL: string): string {
  return `<p>Hi ${escapeHtml(name)},</p>
<p>You've been added to the Woodchuckers crew portal.</p>
<p>Sign in with your Google account to get started:</p>
<p><a href="${loginURL}">${loginURL}</a></p>`
}
