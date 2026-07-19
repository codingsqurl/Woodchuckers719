import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { PayContent } from '../../pay/pay-content'

const t = getDict('es').pay

export const metadata: Metadata = {
  title: t.metaTitle,
  robots: { index: false, follow: true },
  alternates: { canonical: '/es/pay', languages: altLanguages('/pay') },
}

export default async function PayPageEs({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <PayContent locale="es" error={error} />
}
