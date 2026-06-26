// services.ts — the B2B service pages (lead-gen rebuild). Each entry is one
// /services/[slug] page targeting its own keyword cluster, for tree companies
// and crews hiring KING as a contract day-climber. English first; the /es
// mirror is a follow-up chunk (TODO(i18n): add Spanish service content).
//
// Honesty rails (see DESIGN.md + credentials notes): KING is owner-operated,
// second year climbing professionally, owns climbing gear plus some rigging,
// does NOT own a crane, and is NOT separately insured/certified. Copy never
// claims a crane, certification, or insurance. Crane work = climbing to the
// client's crane; insurance/liability copy is left as a TODO for KING to fill
// with his real arrangement.

export type ServiceFaq = { q: string; a: string }

export type Service = {
  slug: string
  // SEO
  metaTitle: string
  metaDesc: string
  ogTitle: string
  // schema
  serviceType: string
  // hero (three rising lines, last one accent — mirrors the site hero system)
  eyebrow: string
  heroTitle: [string, string, string]
  lede: string
  // body
  whatTitle: string
  what: string
  whenTitle: string
  when: string[]
  priceNote: string
  faqs: ServiceFaq[]
  // related service slugs (internal-link mesh)
  related: string[]
  // share-image alt (descriptive, part of the voice)
  imageAlt: string
}

const servicesEN: Service[] = [
  {
    slug: 'technical-removals',
    metaTitle: 'Technical & Sectional Tree Removals | Contract Climber | Colorado Springs',
    metaDesc:
      'A contract climber for tree companies on technical and sectional removals in Colorado Springs. I climb the spar and rig it down in pieces when there is no drop zone. Day rate. Se habla español.',
    ogTitle: 'Technical & Sectional Removals — Contract Climber',
    serviceType: 'Sectional tree removal',
    eyebrow: 'For tree companies',
    heroTitle: ['Technical', 'sectional', 'removals.'],
    lede: 'The removal with no drop zone. I climb it and bring it down in pieces, roped and lowered, so your crew never forces a fell that will not fit.',
    whatTitle: 'What it is',
    what: 'When a tree is too big, too dead, or too boxed-in to fell, it comes down in controlled sections. I climb the spar, set the rigging, and lower each piece to your ground crew. You keep the wood, the haul, and the cleanup.',
    whenTitle: 'When you call me in',
    when: [
      'No safe drop zone, with a house, fence, or lines in the way',
      'Dead or hollow wood you do not want to shock-load',
      'A spar taller than your bucket can reach',
      'Your crew is short the climber for the day',
    ],
    priceNote: 'Flat day rate, $175 to $350 depending on the climb. Most sectional removals are a day, some run two.',
    faqs: [
      { q: 'Do you bring the rigging?', a: 'I bring my climbing gear and some rigging. For heavy lowering we run your blocks and your crew on the ground.' },
      { q: 'Who hauls the wood?', a: 'Your crew. I climb and bring it down in pieces; the haul, chipping, and cleanup stay with you.' },
    ],
    related: ['rigging-crane-assist', 'storm-hazard-work', 'contract-climbing-for-companies'],
    imageAlt: 'Contract climber roped into a tall spar, rigging a section of a pine down to the ground crew on a Colorado Springs removal.',
  },
  {
    slug: 'large-tree-pruning',
    metaTitle: 'Large-Tree & Canopy Pruning | Contract Climber | Colorado Springs',
    metaDesc:
      'A contract climber for crown work past your bucket in Colorado Springs. Deadwooding, thinning, and clearance pruning hand-climbed to spec on big conifers and hardwoods. Day rate. Se habla español.',
    ogTitle: 'Large-Tree & Canopy Pruning — Contract Climber',
    serviceType: 'Tree pruning',
    eyebrow: 'For tree companies',
    heroTitle: ['Canopy', 'pruning,', 'up high.'],
    lede: 'The crown work past your bucket. I climb the canopy and make the cuts by hand, clean and to spec, on the trees your crew cannot reach from the ground.',
    whatTitle: 'What it is',
    what: 'Deadwooding, crown thinning, clearance pruning, and end-weight reduction up in the canopy of big conifers and hardwoods. Hand-climbed, proper cuts at the collar, no spikes on a tree that is staying.',
    whenTitle: 'When you call me in',
    when: [
      'Crown work above bucket reach',
      'Deadwood or clearance over a structure',
      'A prune that needs a climber, not a lift',
      'Overflow when your own climber is booked',
    ],
    priceNote: 'Flat day rate, $175 to $350 depending on the climb. Most prunes are a single day.',
    faqs: [
      { q: 'Spikes or no spikes?', a: 'No spikes on a tree that is staying. I climb on rope and limbs so the tree is not wounded for a prune.' },
      { q: 'Do you do the cleanup?', a: 'Your crew runs the ground and the cleanup. I make the cuts up top.' },
    ],
    related: ['technical-removals', 'storm-hazard-work', 'contract-climbing-for-companies'],
    imageAlt: 'Contract climber high in a leafy canopy making a hand pruning cut on a large tree in Colorado Springs.',
  },
  {
    slug: 'storm-hazard-work',
    metaTitle: 'Storm Damage & Hazard Tree Climbing | Contract Climber | Colorado Springs',
    metaDesc:
      'A contract climber for storm and hazard work in Colorado Springs. Broken tops, hung limbs, and leaners brought down in control by a dedicated climber. Day rate, same-day when I can. Se habla español.',
    ogTitle: 'Storm & Hazard Tree Work — Contract Climber',
    serviceType: 'Hazard tree removal',
    eyebrow: 'For tree companies',
    heroTitle: ['Storm', 'and hazard', 'climbs.'],
    lede: 'Broken tops, hung limbs, and leaners. The unstable climbs after a storm that your crew wants a dedicated climber on.',
    whatTitle: 'What it is',
    what: 'Hung-up limbs, snapped leaders, split crotches, and storm-leaners made safe from up in the tree. I read the load, set the rigging, and bring the hazard down in control instead of pulling it from the ground.',
    whenTitle: 'When you call me in',
    when: [
      'Hangers and broken tops after a wind or snow event',
      'A leaner loaded over a structure',
      'Spring heavy-snow damage in the canopy',
      'A hazard your crew will not free-climb',
    ],
    priceNote: 'Same flat day rate, $175 to $350. One urgent single piece can be per-job. Call or text and I get back the same day when I can.',
    faqs: [
      { q: 'How fast can you come?', a: 'Call or text the job. For storm work I get back to you the same day when I can and book the soonest day that works.' },
      { q: 'Is there an emergency rate?', a: 'Same flat day rate. One urgent piece on its own can be quoted per-job.' },
    ],
    related: ['technical-removals', 'rigging-crane-assist', 'contract-climbing-for-companies'],
    imageAlt: 'Contract climber roped into a storm-damaged tree, rigging a broken leader down clear of a structure in Colorado Springs.',
  },
  {
    slug: 'rigging-crane-assist',
    metaTitle: 'Rigging & Crane-Assist Climbing | Contract Climber | Colorado Springs',
    metaDesc:
      'A contract climber who rigs over structures and ties in on crane-assisted takedowns in Colorado Springs. You run the crane and the ground; I am the climber setting picks and making the cuts. Day rate. Se habla español.',
    ogTitle: 'Rigging & Crane-Assist Climbing — Contract Climber',
    serviceType: 'Tree rigging',
    eyebrow: 'For tree companies',
    heroTitle: ['Rigging', 'and crane', 'assist.'],
    lede: 'The climber on the other end of the line. I set the rigging over the house and tie in to your crane picks so the wood comes down clean.',
    whatTitle: 'What it is',
    what: 'Rigging removals over structures, fences, and lines, and working as the climber on crane-assisted takedowns: setting chokers, making the cuts, and guiding picks. You bring the crane and the operator and run the ground; I am the one in the tree.',
    whenTitle: 'When you call me in',
    when: [
      'Wood that has to be lowered over a structure',
      'A crane takedown that needs a climber to set the picks',
      'Tight rigging your crew would rather hand off',
      'A second skilled climber for a big day',
    ],
    priceNote: 'Flat day rate, $175 to $350 depending on the climb.',
    faqs: [
      { q: 'Do you have a crane?', a: 'No. You bring the crane and operator. I am the climber who sets the picks, makes the cuts, and rigs the rest.' },
      { q: 'Whose rigging gear?', a: 'I bring my climbing gear and some rigging. Heavy blocks and lowering devices are usually yours.' },
    ],
    related: ['technical-removals', 'storm-hazard-work', 'contract-climbing-for-companies'],
    imageAlt: 'Contract climber roped in over a house, setting a rigging line on a removal alongside a ground crew in Colorado Springs.',
  },
  {
    slug: 'contract-climbing-for-companies',
    metaTitle: 'Contract Tree Climber for Hire by the Day | Tree Companies | Colorado Springs',
    metaDesc:
      'Book a contract tree climber by the day in Colorado Springs. For tree companies short a climber or facing a climb past their crew. I bring my own gear; you keep the customer and the ground. Se habla español.',
    ogTitle: 'Contract Tree Climber for Hire, by the Day',
    serviceType: 'Contract tree climbing',
    eyebrow: 'For tree companies',
    heroTitle: ['A climber', 'for your crew,', 'by the day.'],
    lede: 'Short a climber, or staring down a climb past your team? Book me for a day, sometimes two. I show up with my gear and climb the piece your crew cannot.',
    whatTitle: 'What it is',
    what: 'I subcontract to tree companies and crews as the climber: removals, pruning, storm work, and rigging, for a flat day rate. You keep the customer, the ground crew, and the cleanup; I bring the climbing.',
    whenTitle: 'When you call me in',
    when: [
      'Your climber is out, booked, or you do not have one',
      'A takedown past your crew’s experience',
      'A stacked schedule you need cleared',
      'A one-off technical piece that is not worth a hire',
    ],
    priceNote: 'Flat day rate, $175 to $350 depending on the climb. One day, sometimes two. A single tricky piece can be per-job.',
    faqs: [
      { q: 'How do I book you?', a: 'Call or text the job: location, size, and when. You get a day rate back, usually the same day.' },
      // TODO(king): add your real insurance / liability arrangement for subcontract
      // work here. Do NOT claim insured or certified — fill in what is actually true.
      { q: 'What am I getting?', a: 'One climber, owner-operated, second year climbing professionally, with my own climbing and rigging gear. The person who quotes the climb is the one on the rope.' },
    ],
    related: ['technical-removals', 'large-tree-pruning', 'storm-hazard-work', 'rigging-crane-assist'],
    imageAlt: 'Contract climber arriving on a job with a pack of climbing and rigging gear to climb for a tree company in Colorado Springs.',
  },
]

export function serviceList(): Service[] {
  return servicesEN
}

export function serviceBySlug(slug: string): Service | undefined {
  return servicesEN.find((s) => s.slug === slug)
}
