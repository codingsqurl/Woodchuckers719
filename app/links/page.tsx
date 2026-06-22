import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { LinksContent } from './links-content'

const t = getDict('en').links

export const metadata: Metadata = {
  title: t.metaTitle,
  robots: { index: false, follow: true },
  alternates: { canonical: '/links', languages: altLanguages('/links') },
}

export default function LinksPage() {
  return <LinksContent locale="en" />
}
