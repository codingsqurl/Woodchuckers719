// /contact.vcf — a downloadable vCard so a foreman can save the number in one
// tap (iOS opens "Add Contact", Android downloads the card). Static contact
// constants; the site URL comes from env. No JS on the page, just a link.
import { appBaseURL } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const url = appBaseURL()
  // vCard 3.0, CRLF line endings (the spec, and what phones expect).
  const card = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:;Woodchuckers;;;',
    'FN:Woodchuckers Tree Climbing',
    'ORG:Woodchuckers',
    'TITLE:Contract Tree Climber',
    'TEL;TYPE=CELL,VOICE:+17197562597',
    'EMAIL;TYPE=INTERNET:woodchuckerstrees719@gmail.com',
    `URL:${url}`,
    'ADR;TYPE=WORK:;;;Colorado Springs;CO;;USA',
    'NOTE:Contract tree climbing for tree companies. Se habla espanol.',
    'END:VCARD',
    '',
  ].join('\r\n')

  return new Response(card, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="woodchuckers.vcf"',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
