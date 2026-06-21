import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { listEmployees, lastLogin } from '@/lib/employees'
import { listEstimates, debrisLabel, submitted, contact } from '@/lib/estimates'
import { logout, createEmployeeAction, inviteAction, toggleActiveAction } from './actions'

export const metadata: Metadata = { title: 'Admin | Woodchuckers' }

const ERRORS: Record<string, string> = {
  self: "You can't disable your own account.",
  emp_required: 'Email and name are required.',
  emp_role: 'Role must be employee or admin.',
  emp_pw: 'Password must be at least 8 characters (or left blank for SSO-only).',
  emp_dup: 'An account with that email already exists.',
  invite_required: 'Invite needs a name and email.',
  invite_dup: 'An account with that email already exists.',
}

function noticeFor(notice: string, email: string): string {
  switch (notice) {
    case 'invite_sent':
      return `Invite sent to ${email}.`
    case 'invite_added_noemail':
      return `${email} was added, but no invite email was sent (email not configured).`
    case 'invite_added_failed':
      return `${email} was added, but the invite email failed to send.`
    default:
      return ''
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; email?: string }>
}) {
  const user = await requireAdmin()
  const sp = await searchParams
  const error = (sp.error && ERRORS[sp.error]) || ''
  const notice = sp.notice ? noticeFor(sp.notice, sp.email ?? '') : ''

  const employees = listEmployees()
  const estimates = listEstimates(50)

  return (
    <>
      <header className="topbar">
        <span>Woodchuckers · Admin</span>
        <nav>
          <a href="/admin/portal">Portal</a>
          <form action={logout}>
            <button type="submit">Log out</button>
          </form>
        </nav>
      </header>

      <main>
        {error ? <p className="error">{error}</p> : null}
        {notice ? <p className="notice">{notice}</p> : null}

        <h1>Estimate requests</h1>
        {estimates.length > 0 ? (
          <table className="grid">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Need</th>
                <th>Source</th>
                <th>Days</th>
                <th>Debris</th>
                <th>Ballpark</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((e) => (
                <tr key={e.id}>
                  <td>{submitted(e)}</td>
                  <td title={e.details || undefined}>{e.name}</td>
                  <td>{contact(e)}</td>
                  <td>
                    {e.service}
                    {e.removalInfo ? (
                      <>
                        <br />
                        <span className="muted">{e.removalInfo}</span>
                      </>
                    ) : null}
                  </td>
                  <td>{e.source}</td>
                  <td>{e.estDays}</td>
                  <td>{debrisLabel(e)}</td>
                  <td>
                    ${e.estLow}–${e.estHigh}
                  </td>
                  <td>{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No estimate requests yet.</p>
        )}

        <h1>Employees</h1>
        <table className="grid">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className={emp.active ? '' : 'inactive'}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>{emp.active ? 'Active' : 'Disabled'}</td>
                <td>{lastLogin(emp)}</td>
                <td>
                  {emp.id === user.id ? (
                    <span className="muted">you</span>
                  ) : (
                    <form action={toggleActiveAction}>
                      <input type="hidden" name="id" value={emp.id} />
                      <input type="hidden" name="active" value={emp.active ? 'false' : 'true'} />
                      <button type="submit">{emp.active ? 'Disable' : 'Enable'}</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Invite employee</h2>
        <p className="muted">
          Creates a Google sign-in account and emails them a link. No password.
        </p>
        <form action={inviteAction} className="stack">
          <label>
            Full name
            <input type="text" name="full_name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <button type="submit">Send invite</button>
        </form>

        <h2>Add employee</h2>
        <form action={createEmployeeAction} className="stack">
          <label>
            Full name
            <input type="text" name="full_name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Role
            <select name="role">
              <option value="employee">employee</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <label>
            Password <span className="muted">(leave blank for SSO-only)</span>
            <input type="password" name="password" minLength={8} />
          </label>
          <button type="submit">Create account</button>
        </form>
      </main>
    </>
  )
}
