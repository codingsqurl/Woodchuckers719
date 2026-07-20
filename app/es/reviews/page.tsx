import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { ReviewsContent } from '../../reviews/reviews-content'

const t = getDict('es').reviews

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.lead,
  alternates: { canonical: '/es/reviews', languages: altLanguages('/reviews') },
}

export default function ReviewsPageEs() {
  return <ReviewsContent locale="es" />
}
