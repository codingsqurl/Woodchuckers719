# Woodchuckers — Marketing & SEO Plan

Last updated 2026-06-21.

## The honest strategy (read this first)

You are one trained climber in Colorado Springs. The brand wins because it feels
like one person, not a franchise. "Nationwide" cannot mean "advertise tree
removal in Florida next week" — you cannot climb a tree in Florida, and a lead
you cannot serve becomes a bad review and a refund. Worse, chasing national
keywords dilutes the local ranking that actually pays the bills.

So growth is **phased**, and SEO follows operational capacity, never the other
way around:

- **Phase 1 — Own Colorado (now → 2027).** Become the obvious choice in Colorado
  Springs and every El Paso County town you serve. This is where the revenue is
  and where "reach many people in many places" is real today.
- **Phase 2 — Regional (2027, WA / OR / CA).** The Great Expansion already on the
  /areas page. Each new market gets the same local engine, but only after there
  is a climber or crew who can actually show up. The /admin app exists to manage
  exactly those people.
- **Phase 3 — National (2027+).** "Nationwide" only works when the model scales
  past one body: a vetted climber network, licensing, or a franchise. That is a
  business-model decision, not a marketing campaign, and it collides head-on with
  the "one person" brand. Flagged here so it is a deliberate choice later, not a
  drift.

Everything below is ordered by leverage, not by what is fun to build.

---

## Phase 1 — Own Colorado

### 1. Google Business Profile (do this first — biggest single lever)

For a local service business, the Google Business Profile (the map pack + the
panel on the right of search) outranks everything on the website combined. This
is off-site and only you can do it.

- Claim and fully complete the profile: categories (primary "Tree service",
  secondary "Arborist service" / "Emergency tree removal"), service area set to
  the 12 towns, hours, phone, the same wording as the site.
- Add the real job photos (the same ones in My Work, plus more from every job).
  Photos drive map-pack clicks.
- Turn on messaging and keep the response time fast.
- **NAP consistency:** the business Name, Address or service area, and Phone must
  be byte-for-byte identical everywhere (site, GBP, Facebook, Nextdoor, Yelp).
  Inconsistency is a silent ranking killer. The site phone is already one
  constant in `app/components/chrome.tsx` — match it exactly off-site.

### 2. The review engine (second biggest lever)

Review count and freshness are top-three local ranking signals and the single
biggest trust driver for a stressed homeowner choosing between two climbers.

- Ask every happy customer for a Google review the day the job is done, with a
  direct link (GBP gives you a short review URL).
- Goal: a steady drip, not a burst. Five real reviews a month beats fifty fake
  ones, and beats zero by a mile.
- Reply to every review, good or bad. The reply is public and shows you are a
  real person who stands behind the work.
- Once there are real reviews, the site can show them and carry AggregateRating
  schema (see the punch list). Never fabricate reviews or rating schema — Google
  penalizes it and it betrays the whole brand.

Sample review request, ready to send:

> Thanks again for trusting me with your trees. If the work met the bar would you
> mind leaving a quick Google review at the link below. It is the main way folks
> around here find me. [your GBP review link]

### 3. Per-town landing pages (the on-site #1 lever)

Right now `/areas` lists 12 towns as outbound Google Maps links. That is twelve
local searches you are invisible for. The fix is a real, indexable page per town,
each targeting the way people actually search: "tree removal Monument CO", "tree
trimming Black Forest", "storm damage tree service Falcon".

- One dynamic route, `/areas/[slug]`, generated from the existing `serviceAreas`
  list in `lib/areas.ts` — that list stays the single source of truth.
- Each page is genuinely useful and genuinely different: the local tree reality
  (Front Range ponderosa, fire-mitigation pruning, post-storm leaners), what you
  do there, the same restrained pine design, a clear call and estimate CTA.
- **This is the line that matters:** done well these are legitimate local pages
  Google rewards. Done as keyword-stuffed near-duplicates they are doorway pages
  Google penalizes — and they would read as the exact "cheap local-SEO template"
  the brand exists to reject. Each town needs a few sentences of real, distinct
  local content. You know these towns; I do not. The plan is for me to build the
  structure, schema, internal linking, and sitemap wiring, and for the per-town
  specifics to be real, not invented.
- Wire each town page into the sitemap automatically and add `BreadcrumbList` +
  per-town `LocalBusiness`/`Service` schema.

This is the recommended next build. See "Recommended next build" at the bottom.

### 4. On-site SEO hardening

Tracked as a punch list below. The safe, no-fabrication wins are done this pass
(sitemap). The rest (FAQ schema, Service schema, sameAs, Search Console) are
sequenced there.

### 5. FAQ + content

A short, honest FAQ wins "People also ask" results and featured snippets, and it
answers the exact objections a homeowner has before calling. Every answer is
grounded in facts the site already states, never invented:

- How much does tree removal cost in Colorado Springs (day rate 175 to 350,
  most single-tree jobs one day, cleanup flat 100, full debris removal 150).
- Do you haul the debris away (no off-site hauling unless you opt into removal).
- Do I need a permit (point to the city/HOA reality without guessing specifics).
- Are you insured, owner-operated, how fast for storm work.

Ships as a visible FAQ section plus `FAQPage` schema so it can win rich results.

### 6. Citations and directories

Consistent listings on the directories that feed local search and that homeowners
trust: Google Business Profile, Bing Places, Apple Business Connect, Facebook,
Nextdoor, Yelp, Angi, and the local Colorado Springs / El Paso County listings.
Same NAP everywhere. Quality and consistency over quantity.

### 7. Social

The /links page already points at the social profiles. Keep them pointed back at
the site and at the estimate form, post real job photos and short before/after
clips (the proof, again), and make sure every profile links to the site so they
pass authority and carry `sameAs` in the schema.

---

## Phase 2 — Regional expansion (2027, WA / OR / CA)

SEO follows crews. For each new metro:

- Stand up a climber or crew that can actually serve it (the constraint, not the
  marketing).
- Spin up a Google Business Profile per service location with its own reviews.
- Add that region's towns to `serviceAreas`; the town-page engine and sitemap
  generate the local pages automatically.
- Localize content to that region's trees and hazards (Pacific Northwest conifers
  and wind, California fire mitigation) — same restraint, real specifics.

## Phase 3 — National (2027+)

Only viable with a model that scales past one person. The three honest options:

- **Climber network / marketplace:** vetted independent climbers, you own the
  brand, booking, and trust layer. Keeps the "real climber" feel, hardest to run.
- **Licensing:** other owner-operators run under the brand and system.
- **Franchise:** most scalable, furthest from "one person," highest brand risk.

Each one forces the brand question the current site deliberately avoids. Decide it
on purpose. Do not let national ad spend decide it for you.

---

## SEO audit — prioritized punch list

| Priority | Item | Where | Impact | Status |
|---|---|---|---|---|
| P0 | Google Business Profile, complete + photos | off-site (you) | Highest local lever | Pending — you |
| P0 | Review generation + replies | off-site (you) | Top-3 local signal + trust | Pending — you |
| P0 | Google Search Console + analytics | off-site + 1 verify tag | Can't measure reach without it | Pending |
| P0 | Per-town landing pages `/areas/[slug]` | `lib/areas.ts`, new route | On-site #1 organic lever | Planned build |
| P1 | Sitemap: lastmod, changefreq, priority, town pages | `app/sitemap.ts` | Crawl quality | **Done this pass** |
| P1 | FAQ section + `FAQPage` schema | new section/page | Rich results, snippets | Planned |
| P1 | `sameAs` (socials) on LocalBusiness schema | `app/page.tsx` | Entity confidence | Planned |
| P1 | `BreadcrumbList` + `Service` schema | pages | Rich results | Planned (with town pages) |
| P2 | Per-page OG images (vs shared og.jpg) | metadata | Share CTR | Backlog |
| P2 | Citations / NAP across directories | off-site (you) | Local authority | Pending — you |
| P2 | Reviews on-site + AggregateRating schema | after real reviews exist | Trust + rich stars | Blocked on P0 reviews |

P0 is where the money is, and most of P0 is off-site work only you can do.

---

## Sample copy (clean, ready to publish)

Google Business Profile description:

> Woodchuckers is a trained owner operated tree climber serving Colorado Springs
> and the surrounding El Paso County towns. Removals, trimming, and technical
> take downs, roped and rigged and lowered by hand. The person who quotes your
> tree is the one who climbs it. Free estimates, fast on storm damage, careful
> with your property.

Meta description pattern for a town page:

> Tree removal and trimming in TOWN, Colorado. Owner operated climber, roped and
> rigged by hand, careful around the house and power lines. Free estimates.

---

## What changed in code this pass

- `app/sitemap.ts` hardened: real `lastModified`, `changeFrequency`, and
  `priority` per page, and a clear hook so the per-town pages join the sitemap the
  moment they exist.

Nothing else was generated, because the high-impact remaining work either belongs
to you off-site (GBP, reviews, citations) or needs real per-town local content I
should not invent.

## Recommended next build

**Per-town landing pages.** I build the `/areas/[slug]` route, breadcrumb +
local-business schema, internal links from `/areas`, and the sitemap wiring. You
give me three or four true sentences per town (or approve a draft), so they are
real local pages, not doorway spam. Say the word and I will scaffold it.
