// posts.ts — the content hub (lead-gen rebuild, chunk 3). Each entry is one
// /blog/[slug] stub: a real, indexable, SEO-complete page with an intro and an
// outline, targeting a search question someone asks before hiring a contract
// climber. `draft: true` marks it a stub (outline, not the full article) so the
// UI can label it honestly and KING can flesh each one out later.
//
// Audience is B2B-leaning, per the site: tree-company owners, crew foremen,
// property/GC people who need climbing work, not homeowners shopping a yard tree.

export type Post = {
  slug: string
  metaTitle: string
  metaDesc: string
  ogTitle: string
  title: string
  // intro paragraph (real copy, shippable today)
  excerpt: string
  // h2 outline the full article will cover (gives the stub real structure)
  outline: string[]
  // ISO date string is passed in from a build-time constant, not generated here
  // (scripts can't call Date.now()); for a stub we just mark it draft.
  draft: boolean
  imageAlt: string
}

const postsEN: Post[] = [
  {
    slug: 'when-to-hire-a-contract-climber',
    metaTitle: 'When to Hire a Contract Tree Climber | Woodchuckers | Colorado Springs',
    metaDesc:
      'When it pays a tree company to bring in a contract climber for a day instead of forcing a climb. Drop zones, deadwood, overflow, and crew safety. Colorado Springs.',
    ogTitle: 'When to Hire a Contract Tree Climber',
    title: 'When to hire a contract climber instead of forcing the climb',
    excerpt:
      'Most crews can fell a tree in the open. The call gets harder when there is no drop zone, the wood is dead, or the climber on staff is already booked. Bringing in a contract climber for a day is often cheaper and safer than forcing a removal that does not fit.',
    outline: [
      'No safe drop zone: when a fell is off the table',
      'Dead or hollow wood you should not shock-load',
      'Overflow: covering a stacked schedule without a hire',
      'The math: a day rate vs the risk of a bad fell',
    ],
    draft: true,
    imageAlt: 'A large tree boxed in by a house and power lines, the kind of removal a contract climber takes in sections.',
  },
  {
    slug: 'sectional-removal-vs-felling',
    metaTitle: 'Sectional Removal vs Felling a Tree | Woodchuckers | Colorado Springs',
    metaDesc:
      'When you can drop a tree whole and when it has to come down in sections, roped and lowered. How a contract climber rigs a takedown with no room to fell. Colorado Springs.',
    ogTitle: 'Sectional Removal vs Felling',
    title: 'Sectional removal vs felling: when you cannot just drop it',
    excerpt:
      'Felling is fastest when the drop zone is clear. Over a house, a fence, or lines, the tree has to come down in controlled sections, roped and lowered piece by piece. Here is how a climber decides, and what the ground crew runs.',
    outline: [
      'Reading the drop zone and the lean',
      'Rigging basics: blocks, lowering, and the ground crew',
      'When a crane changes the plan',
      'What the climber does vs what your crew does',
    ],
    draft: true,
    imageAlt: 'A climber rigging a section of trunk to lower it over a roof on a sectional tree removal.',
  },
  {
    slug: 'what-a-contract-climber-charges',
    metaTitle: 'What a Contract Tree Climber Charges | Day Rates | Colorado Springs',
    metaDesc:
      'How contract tree climbers price work: flat day rates, what a day covers, and when a single piece is per-job. Plain numbers for tree companies. Colorado Springs.',
    ogTitle: 'What a Contract Climber Charges',
    title: 'What a contract climber charges, and what a day actually covers',
    excerpt:
      'Most contract climbing is priced by the day, not the tree. A flat day rate keeps the math simple for the company hiring: you know the number before the climber leaves the ground. Here is what a day covers and when a one-off piece is quoted per-job.',
    outline: [
      'Why day rates beat per-tree pricing for contract work',
      'What one day covers, and when it runs two',
      'Per-job pricing for a single technical piece',
      'What is not included: ground, haul, and cleanup',
    ],
    draft: true,
    imageAlt: 'A contract climber geared up at the base of a tree, ready to start a day-rate climb.',
  },
  {
    slug: 'crane-assist-vs-climb-and-rig',
    metaTitle: 'Crane Assist vs Climb and Rig | Tree Takedowns | Colorado Springs',
    metaDesc:
      'When a takedown calls for a crane and when a climber rigging it down is the right move. How a contract climber works either way. Colorado Springs tree companies.',
    ogTitle: 'Crane Assist vs Climb and Rig',
    title: 'Crane assist vs climb-and-rig: picking the method for a takedown',
    excerpt:
      'A crane speeds up big picks and keeps weight off the spar, but it is not always the call. Sometimes a climber rigging the tree down piece by piece is faster and cheaper. The climber works either way; here is how the method gets chosen.',
    outline: [
      'Where a crane earns its cost',
      'When climb-and-rig is the faster, cheaper call',
      'The climber on a crane job: setting picks and cuts',
      'Access and setup: what to check before the day',
    ],
    draft: true,
    imageAlt: 'A crane lifting a section of tree while a climber sets the next pick on a takedown.',
  },
  {
    slug: 'storm-damage-when-you-need-a-climber',
    metaTitle: 'Storm Damage: When You Need a Dedicated Climber | Colorado Springs',
    metaDesc:
      'Hangers, broken tops, and leaners after a storm are the climbs a crew wants a dedicated climber on. When to call one in and how fast. Colorado Springs.',
    ogTitle: 'Storm Damage: When You Need a Climber',
    title: 'Storm damage: the hazards your crew wants a dedicated climber on',
    excerpt:
      'After a wind or heavy-snow event the dangerous work is up in the tree: hung limbs, snapped leaders, and loaded leaners. These are the climbs where a crew is glad to hand the rope to a dedicated climber. Here is how to spot them and when to call.',
    outline: [
      'Reading a loaded leaner before you touch it',
      'Hangers and broken tops: bringing them down in control',
      'Why ground-pulling a hazard goes wrong',
      'Getting a climber out fast after a storm',
    ],
    draft: true,
    imageAlt: 'A storm-snapped tree leader hung over a structure, a hazard for a dedicated climber.',
  },
]

export function postList(): Post[] {
  return postsEN
}

export function postBySlug(slug: string): Post | undefined {
  return postsEN.find((p) => p.slug === slug)
}
