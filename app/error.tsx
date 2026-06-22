'use client'

import { ErrorScreen } from './components/error-screen'

// Themed 500 — the panic-recovery equivalent (recoverPanic in main.go). Locale
// from the URL: /es and /es/* are Spanish (guard against /estimate etc.).
export default function Error() {
  const p = typeof window !== 'undefined' ? window.location.pathname : ''
  const locale = p === '/es' || p.startsWith('/es/') ? 'es' : 'en'
  return <ErrorScreen code={500} locale={locale} />
}
