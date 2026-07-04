# Prospecting — self-listed discovery

The pass that catches what CDA misses. CDA's Ornamental license only finds
companies that **spray**; the removal- and climbing-only shops never show up
there. This pass finds them through their own public listings, then feeds the
same importer, deduping onto your CDA rows automatically.

Run **CDA first** (it's your storable seed), then work this pass town by town.

---

## The one rule

**Only companies that list themselves.** A tree company's Google Business
Profile, its own website, its Yelp/Angi/Nextdoor business page — those exist so
people will contact them. That's fair game for outreach.

**Do not keep Google's own data.** Don't store a Google `place_id`, star rating,
review text, or anything pulled from the Places API — that violates Google's
terms. Get the **phone and name from the company's own website or listing**, and
store that. If Google is just how you *found* them, fine; the data you keep comes
from the company itself.

(This is the opposite of CDA, where the government record is the storable source.
And it's why the ISA directory is out entirely — its terms forbid using it to
contact the listed pros for commercial purposes. Skip it.)

---

## The search grid

Your live coverage, from `lib/areas.ts`. Work one town at a time:

```
Colorado Springs · Monument · Black Forest · Fountain · Cimarron Hills
Manitou Springs · Woodland Park · Palmer Lake · Gleneagle
```

For each town, run these searches (Google Maps is the fastest enumerator):

- `tree service <town> CO`
- `tree removal <town> CO`
- `tree company <town> CO`
- `arborist <town> CO`
- `tree trimming <town> CO`

Also worth a pass: Yelp "Tree Services" filtered to the town, Angi/Thumbtack pro
lists, and Nextdoor business recommendations. Same rule — the listing is the
company's own, so the phone on it is fair to keep.

When you outgrow the nine towns, the expansion corridors are already staged in
`lib/expansion-areas.ts` (I-25 north, Denver metro, US-24 west). Not before —
finish the home turf first.

---

## What to capture

One CSV per town. These headers drop straight into the importer:

```
Business Name,Phone,Town,Website,Notes
Summit Tree & Landscape,(719) 555-3300,Monument,summittree.example,does removals; bucket only; ISA cert on site
Bighorn Tree Care,(719) 555-9042,Colorado Springs,bighorntree.example,storm work; hiring groundmen not a climber
```

- **Phone** — from the company's own site or listing, not the Places API.
- **Notes** — this is where you prioritize. Jot the signal (below). If they
  advertise ISA certification on their own site, note it here; that's the
  legitimate way to capture the credential.

Import it:

```sh
npm run import:prospects monument.csv --source google
```

Dedup is automatic: a company already on your CDA list matches by phone (or by
name if the CDA row had no phone) and merges into one row — this pass fills the
phone onto the phone-less CDA rows. No duplicates.

---

## Who's a prospect

**Good** — the ones who hand off the climb:

- Established outfit with a **ground crew** but a thin bench up top.
- Does **removals** and **storm work**, not just trimming.
- Small-to-mid local companies, owner-run.
- Bucket-truck-only shops — when the bucket can't reach, they need a climber.

**Skip:**

- National franchises (Davey, SavATree, TruGreen) — they staff their own climbers.
- Pure lawn / spray / landscaping companies — no removals, wrong buyer.
- Solo operators with no crew — no ground team to run, not a buyer.
- Consulting arborists — they write reports, they don't run the physical job.
- City forestry / utility line-clearance — not your customer.

**Signals to note** (they tell you who calls first):

- Website lists removals but shows no climbing photos → they sub the climb.
- "Storm damage" or "emergency" service → they hit hazard climbs they'd hand off.
- Job posts for groundmen but not climbers → short exactly where you fit.
- Bucket truck in every photo, no rope work → limited by reach.

---

## Batch it

Do **one town, ~10 to 20 companies, then stop and call them.** Import the town,
work the list in `/admin/prospects` (tap to call, set status, set a follow-up),
then move to the next town. Don't build a 400-row list and stall — a list you
haven't called is worth nothing.

---

## The opener

Written the way you'd say it on the phone. Clean, no pitch-voice.

> Hi, this is King with Woodchuckers. I'm a contract tree climber and I work by
> the day for other tree companies around Colorado Springs. If you ever catch a
> removal your crew can't reach or you're short a climber, I bring my own gear,
> climb the piece, and bring it down while your team runs the ground. Figured I'd
> put myself on your radar so you've got a climber on call. What kind of work
> tends to get tricky up top for you?

A text to send after, once the site is the thing they check:

> Hi, King with Woodchuckers, the contract climber. Day rate runs 175 to 350.
> Here's my work if you want a look. Call or text when you catch a climb your crew
> wants handed off.

Then log what happened in `/admin/prospects` and set the follow-up date. Work the
follow-ups first each session — they sort to the top of the list.
