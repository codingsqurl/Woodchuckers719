import { redirect } from 'next/navigation'

// The homeowner estimate flow folded into the single contract-climbing intake.
// /estimate now redirects there; the old form code stays in the tree but unused.
export default function EstimatePage() {
  redirect('/contract-climbing')
}
