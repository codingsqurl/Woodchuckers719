import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { LinksContent } from '../../links/links-content'

const t = getDict('es').links

export const metadata: Metadata = {
  title: t.metaTitle,
  robots: { index: false, follow: true },
  alternates: { canonical: '/es/links', languages: altLanguages('/links') },
}

export default function LinksPageEs() {
  return <LinksContent locale="es" />
}
