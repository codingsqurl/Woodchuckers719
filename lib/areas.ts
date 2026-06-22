// areas.ts — port of areas.go. serviceAreas is the single source of truth for
// the towns served; it feeds /areas, the per-town pages at /areas/[slug], the
// homepage areaServed JSON-LD, and the sitemap. EDIT THIS LIST — remove anywhere
// you don't go, add anywhere you do, and the town pages + sitemap follow.
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
  slug: string
  mapsURL: string
}

// URL-safe slug: "Security-Widefield" -> "security-widefield",
// "Cimarron Hills" -> "cimarron-hills".
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// areaList builds the served areas with their slug and a keyless Google Maps
// search link, matching areas.go's url.Values encoding ("?api=1&query=<name>, CO").
export function areaList(): Area[] {
  return serviceAreas.map((name) => {
    const q = new URLSearchParams()
    q.set('api', '1')
    q.set('query', `${name}, CO`)
    return { name, slug: slugify(name), mapsURL: `https://www.google.com/maps/search/?${q.toString()}` }
  })
}

// ── Per-town landing-page content ───────────────────────────────────────────
// TODO(king): the intro/localNote below are PLACEHOLDER copy — true and readable,
// but templated. Replace each town's `localNote` with real local detail (the
// trees you see there, common hazards, neighborhoods) before leaning on these
// pages for SEO. Near-duplicate town pages read as the "cheap local-SEO template"
// the brand rejects; a few true sentences per town is what makes them legit.

export type TownPage = Area & {
  intro: string
  localNote: string
  placeholder: boolean // flip to false per town once the copy is real
}

type Loc = 'en' | 'es'

// Rotating true Front Range angles so the placeholder pages aren't byte-identical.
const LOCAL_ANGLES: Record<Loc, string[]> = {
  en: [
    'Front Range ponderosa and pinyon pine grow tall and heavy here, and they rarely fall where you want them to.',
    'Heavy spring snow and summer storms leave hung-up limbs and leaners that need to come down before they come down on their own.',
    'Fire-mitigation pruning and deadwood clearing matter on these lots, especially close to the house and the property line.',
    'Big trees tight against the roof, the fence, or the power lines are exactly the technical climbs this work is built for.',
  ],
  es: [
    'Los pinos ponderosa y piñoneros del Front Range crecen altos y pesados, y rara vez caen donde uno quisiera.',
    'La nieve fuerte de primavera y las tormentas de verano dejan ramas atoradas e inclinadas que hay que bajar antes de que caigan solas.',
    'La poda para mitigación de incendios y la limpieza de ramas secas importan en estos terrenos, sobre todo cerca de la casa y del lindero.',
    'Los árboles grandes pegados al techo, la cerca o los cables son justo las escaladas técnicas para las que está hecho este trabajo.',
  ],
}

function buildTown(name: string, index: number, locale: Loc): TownPage {
  const base = areaList()[index]
  const angle = LOCAL_ANGLES[locale][index % LOCAL_ANGLES[locale].length]
  const intro =
    locale === 'es'
      ? `Woodchuckers es un escalador de árboles entrenado, dueño y operador, que atiende ${name}, Colorado. Remociones, podas y derribos técnicos, con cuerda y aparejo, bajados a mano. La persona que cotiza su árbol es la que sube a él.`
      : `Woodchuckers is a trained, owner-operated tree climber serving ${name}, Colorado. Removals, trimming, and technical take-downs, roped and rigged and lowered by hand. The person who quotes your tree is the one who climbs it.`
  const localNote =
    locale === 'es'
      ? `${angle} Lo que sea que necesiten sus árboles en ${name}, yo lo escalo, lo aparejo y lo bajo en piezas controladas, cuidadoso con su propiedad y honesto con usted sobre el costo.`
      : `${angle} Whatever your trees in ${name} need, I climb it, rig it, and bring it down in controlled pieces, careful with your property and straight with you about the cost.`
  return { ...base, intro, localNote, placeholder: true }
}

export function townList(): TownPage[] {
  return serviceAreas.map((name, i) => buildTown(name, i, 'en'))
}

export function townBySlug(slug: string, locale: Loc = 'en'): TownPage | undefined {
  const i = serviceAreas.findIndex((name) => slugify(name) === slug)
  return i === -1 ? undefined : buildTown(serviceAreas[i], i, locale)
}
