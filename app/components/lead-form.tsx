// LeadForm — the compact quote-request form embedded on the lead-gen pages
// (services, blog). Server wrapper: it reads the verified lead identity from the
// signed cookie (a per-request, server-only check) and hands it to the client
// half. Until the visitor signs in with Google, the client renders the gate
// instead of the fields. Reading the cookie makes the host page dynamic — fine,
// the form is per-request anyway.
//
// Still the SAME endpoint as the contract page: LeadFormClient submits via
// submitContract, so every lead lands in the `estimates` table + the notify
// email. Swap to an external CRM/webhook in app/contract-climbing/actions.ts.
import { headers } from 'next/headers'
import { readLeadIdentity } from '@/lib/lead-identity'
import { LeadFormClient } from './lead-form-client'
import { type Locale } from '@/lib/i18n'

export async function LeadForm({
  locale,
  heading,
  source = 'website',
}: {
  locale: Locale
  heading?: string
  source?: string
}) {
  const identity = await readLeadIdentity()
  const path = (await headers()).get('x-pathname') || '/contract-climbing'
  const loginHref = `/auth/lead/google/login?return=${encodeURIComponent(path)}`

  return (
    <LeadFormClient
      locale={locale}
      heading={heading}
      source={source}
      identity={identity}
      loginHref={loginHref}
    />
  )
}
