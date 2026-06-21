import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@/lib/auth'
import { googleEnabled, githubEnabled } from '@/lib/sso'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Log in | Woodchuckers' }

// SSO callbacks redirect here with ?denied=<code> on a refused sign-in.
const DENIED: Record<string, string> = {
  google_unverified: 'Your Google email is not verified.',
  google_noaccount: 'No Woodchuckers account exists for that Google email.',
  github_noemail: 'Your GitHub account has no verified primary email.',
  github_noaccount: 'No Woodchuckers account exists for that GitHub email.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>
}) {
  if (await currentUser()) redirect('/admin/portal')
  const sp = await searchParams
  const initialError = (sp.denied && DENIED[sp.denied]) || ''
  return <LoginForm initialError={initialError} google={googleEnabled()} github={githubEnabled()} />
}
