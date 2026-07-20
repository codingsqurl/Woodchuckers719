import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { ReviewsContent } from './reviews-content'

const t = getDict('en').reviews

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.lead,
  alternates: { canonical: '/reviews', languages: altLanguages('/reviews') },
}

export default function ReviewsPage() {
  return <ReviewsContent locale="en" />
}
