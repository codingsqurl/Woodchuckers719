// haptics.ts — one place for the Vibration API feature-detect. Calling this is a
// no-op wherever `navigator.vibrate` is missing, which notably includes iOS
// Safari (Apple has never shipped the Vibration API), so haptics only fire on
// Android. Purely additive polish: nothing depends on it firing. No server-only
// imports, so it's safe to pull into client components.
export function buzz(pattern: number | number[] = 10): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern)
    } catch {
      // some engines throw if called outside a user gesture — ignore, it's polish
    }
  }
}
