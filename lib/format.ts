// format.ts — display helpers ported from store.go's methods. Timestamps are
// Unix epoch SECONDS (INTEGER), matching the DB convention.

// Renders "Jan 2, 3:04 PM" — the same layout Go's time.Format used in the
// admin views. Uses the server's local timezone, like time.Unix(...).Format.
const STAMP = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

export function formatStamp(unixSeconds: number): string {
  return STAMP.format(new Date(unixSeconds * 1000))
}
