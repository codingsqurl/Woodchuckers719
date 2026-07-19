import type { Metadata } from 'next'
import { getDict } from '@/lib/i18n'
import { ThanksContent } from '../../../pay/thanks/thanks-content'

const t = getDict('es').pay

export const metadata: Metadata = {
  title: t.thanksTitle,
  robots: { index: false, follow: false },
}

export default function PayThanksPageEs() {
  return <ThanksContent locale="es" />
}
