'use server'

// Admin mutations (ports of handlers_admin.go) + logout. Each admin action
// re-checks requireAdmin() so a mutation is gated exactly like its page —
// non-admins get notFound() (deny by vanishing). Flash messages are passed
// back via redirect query params and rendered at the top of /admin.
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { endSession } from '@/lib/session'
import { createEmployee, isDuplicateEmail, setEmployeeActive } from '@/lib/employees'
import { sendMail, inviteEmailHTML, mailerConfigured } from '@/lib/mail'
import { appBaseURL } from '@/lib/env'

// POST /admin/logout — destroy session + clear cookie.
export async function logout() {
  await endSession()
  redirect('/admin/login')
}

// POST /admin/employees — create an account from the web form. Admin only.
export async function createEmployeeAction(formData: FormData) {
  await requireAdmin()
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
  await requireAdmin()
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
  const me = await requireAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) redirect('/admin')
  if (me.id === id) redirect('/admin?error=self')
  const active = formData.get('active')?.toString() === 'true'
  setEmployeeActive(id, active)
  revalidatePath('/admin')
  redirect('/admin')
}
