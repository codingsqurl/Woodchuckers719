import { headers } from 'next/headers'
import { ErrorScreen } from './components/error-screen'

// Themed 404 — the catch-all (and the admin "deny by vanishing" notFound()).
// Locale comes from the requested path that middleware stamps on x-pathname.
export default async function NotFound() {
  const h = await headers()
  const p = h.get('x-pathname') ?? ''
  const locale = p === '/es' || p.startsWith('/es/') ? 'es' : 'en'
  return <ErrorScreen code={404} locale={locale} />
}
