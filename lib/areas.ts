// areas.ts — port of areas.go. serviceAreas is the single source of truth for
// the towns served; it feeds /areas, the homepage areaServed JSON-LD, and the
// sitemap. EDIT THIS LIST — remove anywhere you don't go, add anywhere you do.
export const serviceAreas: string[] = [
  'Colorado Springs',
  'Monument',
  'Black Forest',
  'Falcon',
  'Peyton',
  'Fountain',
  'Security-Widefield',
  'Cimarron Hills',
  'Manitou Springs',
  'Woodland Park',
  'Palmer Lake',
  'Gleneagle',
]

export type Area = {
  name: string
  mapsURL: string
}

// areaList builds the served areas with keyless Google Maps search links,
// matching areas.go's url.Values encoding ("?api=1&query=<name>, CO").
export function areaList(): Area[] {
  return serviceAreas.map((name) => {
    const q = new URLSearchParams()
    q.set('api', '1')
    q.set('query', `${name}, CO`)
    return { name, mapsURL: `https://www.google.com/maps/search/?${q.toString()}` }
  })
}
