import { ErrorScreen } from './components/error-screen'

// Themed 404 — the catch-all (and the admin "deny by vanishing" notFound()).
export default function NotFound() {
  return (
    <ErrorScreen
      code={404}
      title="That branch doesn't exist"
      message="The page you were after isn't here. Head back home, or call and I'll point you the right way."
    />
  )
}
