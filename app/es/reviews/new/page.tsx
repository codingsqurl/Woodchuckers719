import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { NewReviewContent } from '../../../reviews/new/new-review-content'

const t = getDict('es').reviewForm

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.lead,
  alternates: { canonical: '/es/reviews/new', languages: altLanguages('/reviews/new') },
  robots: { index: false, follow: true },
}

export default function NewReviewPageEs() {
  return <NewReviewContent locale="es" />
}
