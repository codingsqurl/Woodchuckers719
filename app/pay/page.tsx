import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { PayContent } from './pay-content'

const t = getDict('en').pay

export const metadata: Metadata = {
  title: t.metaTitle,
  robots: { index: false, follow: true },
  alternates: { canonical: '/pay', languages: altLanguages('/pay') },
}

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <PayContent locale="en" error={error} />
}
