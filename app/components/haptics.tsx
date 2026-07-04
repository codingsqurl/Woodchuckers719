'use client'

// One delegated listener for the whole app: a short haptic tap when a
// phone-call (tel:) or email (mailto:) button is pressed — and nothing else.
// The estimate/book CTAs and the lead form deliberately do NOT buzz.
//
// Feature-detected via buzz() (a no-op without the Vibration API, i.e. on iOS
// Safari — haptics only land on Android). Touch-only, fired on pointerdown so
// the tap is confirmed the instant it's pressed, before the dialer or mail app
// opens. Purely additive: the links work with or without JS. Renders nothing.
import { useEffect } from 'react'
import { buzz } from '@/lib/haptics'

export function Haptics() {
  useEffect(() => {
    // Don't even attach the listener where the Vibration API is absent.
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return // touch/pen only; a mouse has no motor
      const target = e.target as Element | null
      const btn = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]')
      if (btn) buzz(12)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return null
}
