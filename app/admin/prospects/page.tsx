import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import {
  listProspects,
  prospectCounts,
  PROSPECT_STATUSES,
  contactedAt,
  followupDate,
} from '@/lib/prospects'
import { logout } from '../actions'
import { addProspectAction, updateProspectAction } from './actions'

export const metadata: Metadata = { title: 'Prospects | Woodchuckers' }

const ADD_ERRORS: Record<string, string> = {
  company_required: 'A prospect needs a company name.',
}

// Human labels for the funnel statuses (the stored values are snake_case).
const STATUS_LABEL: Record<string, string> = {
  new: 'new',
  queued: 'queued',
  contacted: 'contacted',
  interested: 'interested',
  not_interested: 'not interested',
  won: 'won',
  bad: 'bad',
}

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>
}) {
  await requireAdmin()
  const sp = await searchParams
  const statusFilter =
    sp.status && (PROSPECT_STATUSES as readonly string[]).includes(sp.status) ? sp.status : ''
  const error = (sp.error && ADD_ERRORS[sp.error]) || ''

  const counts = prospectCounts()
  const prospects = listProspects(500, statusFilter || undefined)
  const toCall = counts.new + counts.queued

  return (
    <>
      <header className="topbar">
        <span>Woodchuckers · Prospects</span>
        <nav>
          <a href="/admin">Leads</a>
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

        <h1>Prospects</h1>
        <p className="muted">
          The outbound call list — Front Range tree companies to reach. Tap a number to
          call, then set what happened and a follow-up date.
        </p>

        <ul className="funnel">
          <li>
            <strong>{counts.total}</strong> total
          </li>
          <li>
            <strong>{toCall}</strong> to call
          </li>
          <li>
            <strong>{counts.contacted}</strong> contacted
          </li>
          <li>
            <strong>{counts.interested}</strong> interested
          </li>
          <li>
            <strong>{counts.won}</strong> won
          </li>
        </ul>

        <p className="lead-filter">
          <a href="/admin/prospects" className={statusFilter === '' ? 'active' : ''}>
            All
          </a>
          {PROSPECT_STATUSES.map((s) => (
            <a
              key={s}
              href={`/admin/prospects?status=${s}`}
              className={statusFilter === s ? 'active' : ''}
            >
              {STATUS_LABEL[s]}
            </a>
          ))}
        </p>

        {prospects.length > 0 ? (
          <div className="table-scroll">
            <table className="grid">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Last contact</th>
                  <th>Outreach</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.company}
                      {p.website ? (
                        <>
                          <br />
                          <a
                            className="muted"
                            href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {p.website.replace(/^https?:\/\//, '')}
                          </a>
                        </>
                      ) : null}
                      {p.town ? (
                        <>
                          <br />
                          <span className="muted">{p.town}</span>
                        </>
                      ) : null}
                    </td>
                    <td>
                      {p.phoneKey ? (
                        <a className="prospect-tel" href={`tel:+1${p.phoneKey}`}>
                          {p.phone || p.phoneKey}
                        </a>
                      ) : (
                        p.phone || '—'
                      )}
                      {p.email ? (
                        <>
                          <br />
                          <a className="muted" href={`mailto:${p.email}`}>
                            {p.email}
                          </a>
                        </>
                      ) : null}
                    </td>
                    <td>
                      {p.source || '—'}
                      {p.license ? (
                        <>
                          <br />
                          <span className="muted">lic {p.license}</span>
                        </>
                      ) : null}
                    </td>
                    <td>{contactedAt(p)}</td>
                    <td>
                      <form action={updateProspectAction} className="inline-form prospect-edit">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="filter" value={statusFilter} />
                        <select name="status" defaultValue={p.status} aria-label="Prospect status">
                          {PROSPECT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                        <input
                          type="date"
                          name="followup"
                          defaultValue={followupDate(p)}
                          aria-label="Follow-up date"
                        />
                        <input
                          type="text"
                          name="notes"
                          defaultValue={p.notes}
                          placeholder="note / who I spoke to"
                          aria-label="Prospect notes"
                          maxLength={2000}
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
            {statusFilter
              ? `No prospects in “${STATUS_LABEL[statusFilter] ?? statusFilter}”.`
              : 'No prospects yet. Add one below, or bulk-import with npm run import:prospects.'}
          </p>
        )}

        <h2>Add a prospect</h2>
        <form action={addProspectAction} className="stack">
          <label>
            Company
            <input type="text" name="company" required maxLength={200} placeholder="Acme Tree Co" />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" maxLength={40} placeholder="(719) 555-1212" />
          </label>
          <label>
            Town
            <input type="text" name="town" maxLength={80} placeholder="Monument" />
          </label>
          <label>
            Website <span className="muted">(optional)</span>
            <input type="text" name="website" maxLength={300} placeholder="acmetree.com" />
          </label>
          <label>
            Email <span className="muted">(optional)</span>
            <input type="email" name="email" maxLength={254} />
          </label>
          <label>
            Notes <span className="muted">(optional)</span>
            <input type="text" name="notes" maxLength={2000} />
          </label>
          <button type="submit">Add prospect</button>
        </form>
      </main>
    </>
  )
}
