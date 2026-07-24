'use server'

// Admin mutations (ports of handlers_admin.go) + logout. Each admin action
// re-checks requireAdminAction() so a mutation is gated like its page —
// authenticated non-admins get notFound() (deny by vanishing); a lapsed session
// redirects to login instead of dead-ending. Flash messages are passed back via
// redirect query params and rendered at the top of /admin.
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdminAction } from '@/lib/auth'
import { endSession } from '@/lib/session'
import { createEmployee, isDuplicateEmail, setEmployeeActive } from '@/lib/employees'
import { addRanking, deleteRanking } from '@/lib/rankings'
import { setEstimateStatus, setEstimateNotes } from '@/lib/estimates'
import { setReviewStatus } from '@/lib/review-submissions'
import { sendMail, inviteEmailHTML, mailerConfigured } from '@/lib/mail'
import { appBaseURL } from '@/lib/env'

// POST /admin/logout — destroy session + clear cookie.
export async function logout() {
  await endSession()
  redirect('/admin/login')
}

// POST /admin/employees — create an account from the web form. Admin only.
export async function createEmployeeAction(formData: FormData) {
  await requireAdminAction()
  const email = (formData.get('email')?.toString() ?? '').trim().toLowerCase()
  const fullName = (formData.get('full_name')?.toString() ?? '').trim()
  const role = formData.get('role')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  if (email === '' || fullName === '') redirect('/admin?error=emp_required')
  if (role !== 'employee' && role !== 'admin') redirect('/admin?error=emp_role')
  // Password is optional (blank = SSO-only), but if set it must be strong.
  if (password !== '' && password.length < 8) redirect('/admin?error=emp_pw')

  try {
    createEmployee(email, fullName, role, password)
  } catch (err) {
    if (isDuplicateEmail(err)) redirect('/admin?error=emp_dup')
    throw err
  }
  revalidatePath('/admin')
  redirect('/admin')
}

// POST /admin/invite — create an SSO-only account and email a sign-in link.
export async function inviteAction(formData: FormData) {
  await requireAdminAction()
  const email = (formData.get('email')?.toString() ?? '').trim().toLowerCase()
  const fullName = (formData.get('full_name')?.toString() ?? '').trim()
  if (email === '' || fullName === '') redirect('/admin?error=invite_required')

  // Blank password = SSO-only: the invitee signs in with Google, never a password.
  try {
    createEmployee(email, fullName, 'employee', '')
  } catch (err) {
    if (isDuplicateEmail(err)) redirect('/admin?error=invite_dup')
    throw err
  }
  revalidatePath('/admin')

  const q = encodeURIComponent(email)
  if (!mailerConfigured()) redirect(`/admin?notice=invite_added_noemail&email=${q}`)
  try {
    await sendMail(
      email,
      "You've been added to Woodchuckers",
      inviteEmailHTML(fullName, `${appBaseURL()}/admin/login`),
    )
  } catch (err) {
    console.error(`invite email to ${email} failed:`, err)
    redirect(`/admin?notice=invite_added_failed&email=${q}`)
  }
  redirect(`/admin?notice=invite_sent&email=${q}`)
}

// POST /admin/employees/{id}/active — toggle an account on/off. Admin only.
// Guards against an admin disabling their own account.
export async function toggleActiveAction(formData: FormData) {
  const me = await requireAdminAction()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) redirect('/admin')
  if (me.id === id) redirect('/admin?error=self')
  const active = formData.get('active')?.toString() === 'true'
  setEmployeeActive(id, active)
  revalidatePath('/admin')
  redirect('/admin')
}

// POST /admin/rankings — add one hand-entered SEO ranking observation. Admin only.
export async function addRankingAction(formData: FormData) {
  await requireAdminAction()
  const keyword = (formData.get('keyword')?.toString() ?? '').trim()
  const competitor = (formData.get('competitor')?.toString() ?? '').trim()
  const position = Number(formData.get('position'))
  const isSelf = formData.get('is_self')?.toString() === 'true'
  const note = (formData.get('note')?.toString() ?? '').trim()

  if (keyword === '' || competitor === '') redirect('/admin?error=rank_required')
  if (!Number.isInteger(position) || position < 1) redirect('/admin?error=rank_position')

  addRanking({ keyword, position, competitor, isSelf, note })
  revalidatePath('/admin')
  redirect('/admin')
}

// POST /admin/rankings/delete — remove one observation by id. Admin only.
export async function deleteRankingAction(formData: FormData) {
  await requireAdminAction()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) redirect('/admin')
  deleteRanking(id)
  revalidatePath('/admin')
  redirect('/admin')
}

// backTo keeps the active pipeline filter after a lead update.
function backTo(formData: FormData): string {
  const f = (formData.get('filter')?.toString() ?? '').trim()
  return f ? `/admin?status=${encodeURIComponent(f)}` : '/admin'
}

// POST /admin/leads/status — move a lead through the pipeline. Admin only.
export async function updateLeadStatusAction(formData: FormData) {
  await requireAdminAction()
  const id = Number(formData.get('id'))
  const status = formData.get('status')?.toString() ?? ''
  if (Number.isInteger(id)) setEstimateStatus(id, status)
  revalidatePath('/admin')
  redirect(backTo(formData))
}

// POST /admin/leads/notes — save the notes / follow-up text for a lead. Admin only.
export async function updateLeadNotesAction(formData: FormData) {
  await requireAdminAction()
  const id = Number(formData.get('id'))
  const notes = (formData.get('notes')?.toString() ?? '').trim()
  if (Number.isInteger(id)) setEstimateNotes(id, notes)
  revalidatePath('/admin')
  redirect(backTo(formData))
}

// POST /admin/reviews/moderate — approve or reject a customer review. Admin only.
// Revalidates the public /reviews pages too, so an approval shows up there right
// away (when REVIEWS_PUBLIC is on) without waiting for a cache TTL.
export async function moderateReviewAction(formData: FormData) {
  await requireAdminAction()
  const id = Number(formData.get('id'))
  const status = formData.get('status')?.toString() ?? ''
  if (Number.isInteger(id)) setReviewStatus(id, status)
  revalidatePath('/admin')
  revalidatePath('/reviews')
  revalidatePath('/es/reviews')
  redirect('/admin')
}
