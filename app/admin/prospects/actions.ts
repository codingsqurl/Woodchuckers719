'use server'

// Outbound-prospect mutations. Gated by requireAdminAction() exactly like the
// lead/employee actions — a lapsed session redirects to login, an authenticated
// non-admin gets notFound(). Flash/filter state rides on redirect query params.
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdminAction } from '@/lib/auth'
import {
  upsertProspect,
  setProspectStatus,
  setProspectNotes,
  setProspectFollowup,
} from '@/lib/prospects'

// backTo keeps the active status filter after an edit.
function backTo(formData: FormData): string {
  const f = (formData.get('filter')?.toString() ?? '').trim()
  return f ? `/admin/prospects?status=${encodeURIComponent(f)}` : '/admin/prospects'
}

// POST — add one prospect by hand (the bulk path is scripts/import-prospects).
// Upsert semantics: adding a company whose phone already exists enriches that
// row instead of erroring, so a hand entry can't create a duplicate.
export async function addProspectAction(formData: FormData) {
  await requireAdminAction()
  const company = (formData.get('company')?.toString() ?? '').trim()
  if (company === '') redirect('/admin/prospects?error=company_required')
  upsertProspect({
    company: company.slice(0, 200),
    phone: (formData.get('phone')?.toString() ?? '').slice(0, 40),
    email: (formData.get('email')?.toString() ?? '').slice(0, 254),
    website: (formData.get('website')?.toString() ?? '').slice(0, 300),
    town: (formData.get('town')?.toString() ?? '').slice(0, 80),
    source: (formData.get('source')?.toString() ?? 'manual').slice(0, 40),
    notes: (formData.get('notes')?.toString() ?? '').slice(0, 2000),
  })
  revalidatePath('/admin/prospects')
  redirect('/admin/prospects')
}

// POST — one row's outreach edit: status + notes + follow-up date, together.
// A single form per row (not three) so saving one field never discards another.
export async function updateProspectAction(formData: FormData) {
  await requireAdminAction()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) redirect(backTo(formData))

  const status = formData.get('status')?.toString() ?? ''
  const notes = (formData.get('notes')?.toString() ?? '').trim()
  const followup = formData.get('followup')?.toString() ?? ''

  setProspectStatus(id, status)
  setProspectNotes(id, notes)
  setProspectFollowup(id, followup)

  revalidatePath('/admin/prospects')
  redirect(backTo(formData))
}
