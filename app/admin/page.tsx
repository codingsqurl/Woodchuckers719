import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { listEmployees, lastLogin } from '@/lib/employees'
import { listEstimates, submitted, contact, LEAD_STATUSES } from '@/lib/estimates'
import { emailsForEstimate } from '@/lib/email-log'
import { formatStamp } from '@/lib/format'
import { listRankings, groupByKeyword, checked } from '@/lib/rankings'
import { listReviewSubmissions, reviewsPublic } from '@/lib/review-submissions'
import {
  logout,
  createEmployeeAction,
  inviteAction,
  toggleActiveAction,
  addRankingAction,
  deleteRankingAction,
  updateLeadStatusAction,
  updateLeadNotesAction,
  moderateReviewAction,
} from './actions'

// LeadEmails shows the send/receive history for one lead (email_log, migration
// 0011). A server component — reads synchronously; renders nothing until there's
// history (and stays empty-safe before 0011 applies, via emailsForEstimate).
function LeadEmails({ estimateId }: { estimateId: number }) {
  const emails = emailsForEstimate(estimateId)
  if (emails.length === 0) return null
  return (
    <details className="lead-details">
      <summary>Emails ({emails.length})</summary>
      <ul className="email-log">
        {emails.map((m) => (
          <li key={m.id}>
            <span className="muted">{formatStamp(m.createdAt)}</span>{' '}
            {m.direction === 'out' ? `sent to ${m.to}` : `from ${m.from}`}: {m.subject}
            {m.status === 'failed' ? ' [failed]' : m.status === 'received' ? ' [reply]' : ''}
          </li>
        ))}
      </ul>
    </details>
  )
}

export const metadata: Metadata = { title: 'Admin | Woodchuckers' }

const ERRORS: Record<string, string> = {
  self: "You can't disable your own account.",
  emp_required: 'Email and name are required.',
  emp_role: 'Role must be employee or admin.',
  emp_pw: 'Password must be at least 8 characters (or left blank for SSO-only).',
  emp_dup: 'An account with that email already exists.',
  invite_required: 'Invite needs a name and email.',
  invite_dup: 'An account with that email already exists.',
  rank_required: 'A ranking needs a keyword and who ranks there.',
  rank_position: 'Position must be a whole number, 1 or higher.',
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
  searchParams: Promise<{ error?: string; notice?: string; email?: string; status?: string }>
}) {
  const user = await requireAdmin()
  const sp = await searchParams
  const error = (sp.error && ERRORS[sp.error]) || ''
  const notice = sp.notice ? noticeFor(sp.notice, sp.email ?? '') : ''

  const statusFilter =
    sp.status && (LEAD_STATUSES as readonly string[]).includes(sp.status) ? sp.status : ''
  const employees = listEmployees()
  const estimates = listEstimates(50, statusFilter || undefined)
  const rankings = groupByKeyword(listRankings())
  const pendingReviews = listReviewSubmissions(50, 'pending')
  const reviewsArePublic = reviewsPublic()

  return (
    <>
      <header className="topbar">
        <span>Woodchuckers · Admin</span>
        <nav>
          <a href="/admin/prospects">Prospects</a>
          <a href="/admin/portal">Portal</a>
          <form action={logout}>
            <button type="submit">Log out</button>
          </form>
        </nav>
      </header>

      <main>
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="notice" role="status">
            {notice}
          </p>
        ) : null}

        <h1>Leads</h1>
        <p className="lead-filter">
          <a href="/admin" className={statusFilter === '' ? 'active' : ''}>
            All
          </a>
          {LEAD_STATUSES.map((s) => (
            <a key={s} href={`/admin?status=${s}`} className={statusFilter === s ? 'active' : ''}>
              {s}
            </a>
          ))}
        </p>
        {estimates.length > 0 ? (
          <div className="table-scroll">
          <table className="grid">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Need</th>
                <th>Source</th>
                <th>Ballpark</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((e) => (
                <tr key={e.id}>
                  <td>{submitted(e)}</td>
                  <td>{e.name}</td>
                  <td>{contact(e)}</td>
                  <td>
                    {e.service}
                    {e.removalInfo ? (
                      <>
                        <br />
                        <span className="muted">{e.removalInfo}</span>
                      </>
                    ) : null}
                    {e.details ? (
                      <details className="lead-details">
                        <summary>Job details</summary>
                        <p>{e.details}</p>
                      </details>
                    ) : null}
                    <LeadEmails estimateId={e.id} />
                  </td>
                  <td>{e.source || '—'}</td>
                  <td>
                    ${e.estLow}–${e.estHigh}
                  </td>
                  <td>
                    <form action={updateLeadStatusAction} className="inline-form">
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="filter" value={statusFilter} />
                      <select name="status" defaultValue={e.status} aria-label="Lead status">
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button type="submit">Set</button>
                    </form>
                  </td>
                  <td>
                    <form action={updateLeadNotesAction} className="inline-form">
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="filter" value={statusFilter} />
                      <input
                        type="text"
                        name="notes"
                        defaultValue={e.notes}
                        placeholder="note / follow-up"
                        aria-label="Lead notes"
                      />
                      <button type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p className="muted">
            {statusFilter ? `No leads in “${statusFilter}”.` : 'No leads yet.'}
          </p>
        )}

        <h2>Reviews</h2>
        <p className="muted">
          Customer-submitted reviews awaiting approval.{' '}
          {reviewsArePublic
            ? 'REVIEWS_PUBLIC is ON — approving publishes to /reviews right away.'
            : 'REVIEWS_PUBLIC is OFF — approving just clears the queue; nothing shows publicly until you turn it on (or paste the review into lib/reviews.ts).'}
        </p>
        {pendingReviews.length > 0 ? (
          <div className="table-scroll">
            <table className="grid">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Town</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((r) => (
                  <tr key={r.id}>
                    <td>{formatStamp(r.createdAt)}</td>
                    <td>{r.author}</td>
                    <td aria-label={`${r.rating} out of 5 stars`}>
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                    </td>
                    <td>{r.body}</td>
                    <td>{r.town || '—'}</td>
                    <td className="review-mod">
                      <form action={moderateReviewAction} className="inline-form">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button type="submit">Approve</button>
                      </form>
                      <form action={moderateReviewAction} className="inline-form">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button type="submit">Reject</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No reviews waiting.</p>
        )}

        <h2>Search rankings</h2>
        <p className="muted">
          Who ranks above us, by keyword. Type what you see on a Google search. No
          auto-tracking. Tick &ldquo;this is us&rdquo; on your own listing.
        </p>
        {rankings.length > 0 ? (
          rankings.map((g) => (
            <div className="table-scroll" key={g.keyword}>
            <table className="grid">
              <thead>
                <tr>
                  <th colSpan={4}>{g.keyword}</th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>Who</th>
                  <th>Checked</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.position}</td>
                    <td>
                      {r.isSelf ? <strong>{r.competitor} (us)</strong> : r.competitor}
                      {r.note ? (
                        <>
                          <br />
                          <span className="muted">{r.note}</span>
                        </>
                      ) : null}
                    </td>
                    <td>{checked(r)}</td>
                    <td>
                      <form action={deleteRankingAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ))
        ) : (
          <p className="muted">No rankings tracked yet.</p>
        )}

        <h3>Add a ranking</h3>
        <form action={addRankingAction} className="stack">
          <label>
            Keyword
            <input
              type="text"
              name="keyword"
              required
              placeholder="contract tree climber colorado springs"
            />
          </label>
          <label>
            Position
            <input type="number" name="position" min={1} required />
          </label>
          <label>
            Who ranks here
            <input type="text" name="competitor" required placeholder="competitor.com" />
          </label>
          <label>
            <input type="checkbox" name="is_self" value="true" /> This is us
          </label>
          <label>
            Note <span className="muted">(optional)</span>
            <input type="text" name="note" placeholder="map pack, ad, etc." />
          </label>
          <button type="submit">Add ranking</button>
        </form>

        <h2>Employees</h2>
        <div className="table-scroll">
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
        </div>

        <h3>Invite employee</h3>
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

        <h3>Add employee</h3>
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
