// expansion-areas.ts — STAGED for the Great Expansion. NOT live.
//
// Nothing imports this file, so none of these cities render on the site, appear
// in the sitemap, or generate town pages yet. It's the prepped target list for
// when Woodchuckers expands contract climbing north and west of Colorado Springs.
//
// To take a region live: copy its cities into `serviceAreas` in areas.ts. The
// per-town pages (/areas/[slug]), the /areas grid, and the sitemap all generate
// off that one list — the page design already exists, so activation is just the
// data move. Add real local detail per town (see the TODO in areas.ts) before
// leaning on them for SEO.
//
// To preview a region locally without shipping it: temporarily spread one of
// these arrays into `serviceAreas`, check the pages, then revert before commit.
//
// Three corridors out from Colorado Springs:
//   1. I-25 north — Castle Rock and everything between here and Denver.
//   2. Denver metro — the Front Range cities.
//   3. US-24 west — up toward Lake George and the mountain towns between.

// 1. I-25 north: Colorado Springs → Castle Rock → south Denver metro.
export const expansionI25Corridor: string[] = [
  'Larkspur',
  'Castle Rock',
  'Castle Pines',
  'Sedalia',
  'Lone Tree',
  'Highlands Ranch',
  'Parker',
  'Centennial',
]

// 2. Denver metro.
export const expansionDenverMetro: string[] = [
  'Denver',
  'Aurora',
  'Lakewood',
  'Littleton',
  'Englewood',
  'Greenwood Village',
  'Wheat Ridge',
  'Arvada',
  'Westminster',
  'Thornton',
  'Northglenn',
  'Commerce City',
  'Brighton',
  'Golden',
  'Broomfield',
]

// 3. US-24 west: Colorado Springs → Woodland Park → up to Lake George.
export const expansionUS24Corridor: string[] = [
  'Cascade',
  'Chipita Park',
  'Green Mountain Falls',
  'Divide',
  'Florissant',
  'Lake George',
  'Cripple Creek',
  'Victor',
]

// Every staged city, in travel order out from Colorado Springs.
export const expansionAreas: string[] = [
  ...expansionI25Corridor,
  ...expansionDenverMetro,
  ...expansionUS24Corridor,
]
