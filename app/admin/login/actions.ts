'use server'

// Port of handleLogin: verify credentials, start a session, set the cookie.
// Rate-limited 10/min/IP (login bucket). On success it redirects to the portal;
// on any failure it re-renders the form with a generic error.
import { redirect } from 'next/navigation'
import { employeeByEmail, checkPassword, touchLogin } from '@/lib/employees'
import { startSession } from '@/lib/session'
import { loginRL, clientIP } from '@/lib/ratelimit'

export type LoginState = { error: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!loginRL.allow(await clientIP())) {
    return { error: 'Too many attempts. Wait a minute and try again.' }
  }

  const email = (formData.get('email')?.toString() ?? '').trim().toLowerCase()
  const password = formData.get('password')?.toString() ?? ''

  const e = employeeByEmail(email)
  if (!e || !checkPassword(e, password)) {
    return { error: 'Invalid email or password.' }
  }

  await startSession(e.id)
  touchLogin(e.id, 'password')
  redirect('/admin/portal')
}
