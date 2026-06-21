import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { isAdmin } from '@/lib/employees'
import { logout } from '../actions'

export const metadata: Metadata = { title: 'Portal | Woodchuckers' }

export default async function PortalPage() {
  const user = await requireAuth()
  return (
    <>
      <header className="topbar">
        <span>Woodchuckers</span>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </header>
      <main>
        <h1>Welcome, {user.fullName}</h1>
        <p>Role: {user.role}</p>
        {isAdmin(user) ? (
          <p>
            <a href="/admin">Admin dashboard</a>
          </p>
        ) : null}
      </main>
    </>
  )
}
