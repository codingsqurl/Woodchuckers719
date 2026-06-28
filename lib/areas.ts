// areas.ts — port of areas.go. serviceAreas is the single source of truth for
// the towns served; it feeds /areas, the per-town pages at /areas/[slug], the
// homepage areaServed JSON-LD, and the sitemap. EDIT THIS LIST — remove anywhere
// you don't go, add anywhere you do, and the town pages + sitemap follow.
export const serviceAreas: string[] = [
  'Colorado Springs',
  'Monument',
  'Black Forest',
  'Fountain',
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
// but templated, now aimed at the tree companies you're prospecting in each city.
// Replace each town's `localNote` with real local detail (the crews there, the
// trees, common hazards) before leaning on these pages for SEO. Near-duplicate
// town pages read as the "cheap local-SEO template" the brand rejects; a few true
// sentences per town is what makes them legit.

export type TownPage = Area & {
  intro: string
  localNote: string
  placeholder: boolean // flip to false per town once the copy is real
}

type Loc = 'en' | 'es'

// Rotating true Front Range angles so the placeholder pages aren't byte-identical.
const LOCAL_ANGLES: Record<Loc, string[]> = {
  en: [
    'Front Range ponderosa and pinyon grow tall and heavy. The kind of removal that’s safer climbed and rigged than felled.',
    'Heavy spring snow and summer storms leave hung-up limbs and leaners that a crew often wants a dedicated climber for.',
    'Tight lots against structures, fences, and power lines are exactly the technical climbs to hand off.',
    'When the wood is big and the drop zone is small, a climber on the rope beats forcing the fell.',
  ],
  es: [
    'Los pinos ponderosa y piñoneros del Front Range crecen altos y pesados. El tipo de remoción más segura escalada y aparejada que tumbada.',
    'La nieve fuerte de primavera y las tormentas de verano dejan ramas atoradas e inclinadas para las que una cuadrilla suele querer un escalador dedicado.',
    'Los terrenos estrechos contra estructuras, cercas y cables son justo las escaladas técnicas para delegar.',
    'Cuando la madera es grande y la zona de caída es pequeña, un escalador en la cuerda gana a forzar la tala.',
  ],
}

function buildTown(name: string, index: number, locale: Loc): TownPage {
  const base = areaList()[index]
  const angle = LOCAL_ANGLES[locale][index % LOCAL_ANGLES[locale].length]
  const intro =
    locale === 'es'
      ? `Woodchuckers es un escalador de árboles por contrato, dueño y operador, para empresas en ${name}, Colorado. Traigo mi propio equipo de escalada y aparejo, escalo la pieza que su cuadrilla no alcanza y la bajo. Usted maneja el suelo.`
      : `Woodchuckers is an owner-operated contract tree climber for hire by tree companies in ${name}, Colorado. I bring my own climbing and rigging gear, climb the piece past your crew, and bring it down. You run the ground.`
  const localNote =
    locale === 'es'
      ? `${angle} Sea cual sea la escalada en ${name}, llego con mi equipo y bajo la pieza técnica. Su cuadrilla se queda con el suelo, el acarreo y la limpieza.`
      : `${angle} Whatever the climb in ${name}, I show up with my gear and bring the technical piece down. Your crew keeps the ground, the haul, and the cleanup.`
  return { ...base, intro, localNote, placeholder: true }
}

export function townList(): TownPage[] {
  return serviceAreas.map((name, i) => buildTown(name, i, 'en'))
}

export function townBySlug(slug: string, locale: Loc = 'en'): TownPage | undefined {
  const i = serviceAreas.findIndex((name) => slugify(name) === slug)
  return i === -1 ? undefined : buildTown(serviceAreas[i], i, locale)
}
