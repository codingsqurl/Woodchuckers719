// GET /healthz — liveness for the CRM's health poller (and any uptime
// checker). Touches the database so "up" means the whole stack answers,
// not just the process. Plain text, never cached.
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    db.prepare('SELECT 1').get()
    return new Response('ok', { headers: { 'content-type': 'text/plain' } })
  } catch {
    return new Response('unhealthy', { status: 500, headers: { 'content-type': 'text/plain' } })
  }
}
