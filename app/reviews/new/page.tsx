import type { Metadata } from 'next'
import { getDict, altLanguages } from '@/lib/i18n'
import { NewReviewContent } from './new-review-content'

const t = getDict('en').reviewForm

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.lead,
  alternates: { canonical: '/reviews/new', languages: altLanguages('/reviews/new') },
  // A submission form has no standalone SEO value and shouldn't compete with
  // /reviews in the index — let it be crawled but keep it out of results.
  robots: { index: false, follow: true },
}

export default function NewReviewPage() {
  return <NewReviewContent locale="en" />
}
