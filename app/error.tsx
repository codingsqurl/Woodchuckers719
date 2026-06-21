'use client'

import { ErrorScreen } from './components/error-screen'

// Themed 500 — the panic-recovery equivalent (recoverPanic in main.go).
export default function Error() {
  return (
    <ErrorScreen
      code={500}
      title="Something broke"
      message="Something went wrong on my end. Try again in a moment, or call and I'll sort it out."
    />
  )
}
