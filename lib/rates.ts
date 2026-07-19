// rates.ts — the single home for Woodchuckers pricing. Two SEPARATE price
// lists that must never get mixed on the estimate page:
//
//   fullJob          Homeowner-facing. Day rate + flat debris add-ons. This is
//                    what the public estimate calculator quotes.
//   contractClimbing B2B. Another company books the climber for a section of
//                    their job; flat day-rate tiers, their groundwork, their
//                    haul-off. Priced on a different model on purpose.
//
// Whole US dollars (INTEGER), same money convention as the rest of the app.
// These are CODE CONSTANTS, not DB rows — the estimates table only stores
// submitted leads. Edit the numbers here; nothing else needs to change. No
// server-only imports, so this is safe to pull into client components too.

// ── Full job (homeowner) ──────────────────────────────────────────────────
export const fullJob = {
  dayLow: 250, // per-day floor
  dayHigh: 500, // per-day ceiling
  cleanup: 100, // on-site cut & pile, flat add-on
  debrisRemoval: 150, // organized full haul-off, flat add-on
} as const

// ── Contract climbing (per-section, B2B) ──────────────────────────────────
// Flat climber day-rate tiers: you + your gear on their job, they run the
// ground and haul. PLACEHOLDER NUMBERS — set these to your real rates.
export const contractClimbing = {
  dayLow: 250, // per-day floor
  dayHigh: 500, // per-day ceiling
} as const
