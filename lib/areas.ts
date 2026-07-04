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
// Real, hand-written local detail lives in TOWN_DETAIL, keyed by slug (EN + ES).
// A town in serviceAreas WITHOUT an entry falls back to a rotating templated
// angle (placeholder: true) so a newly-added town still renders something true
// until its real copy is written. Near-duplicate town pages read as the "cheap
// local-SEO template" the brand rejects; the real detail is what makes each page
// legit. To write up a new town: add its slug to TOWN_DETAIL and it flips real.

export type TownPage = Area & {
  intro: string
  localNote: string
  placeholder: boolean // false once real local detail exists in TOWN_DETAIL
}

type Loc = 'en' | 'es'

// The real localNote per town — the trees, terrain, and hazards that actually
// define the climbing there, ending on the B2B hand-off. Keep every claim true;
// never imply insurance, certification, or a track record of jobs done there.
const TOWN_DETAIL: Record<string, Record<Loc, string>> = {
  'colorado-springs': {
    en: 'The older neighborhoods carry the biggest wood in the county, tall Siberian elm and cottonwood grown up over houses, alleys, and power lines since the fifties. Those are the removals that stack up when a company already has a full schedule. Send me the climb and I bring the piece down over the tight stuff while your crew runs the ground.',
    es: 'Los barrios más viejos tienen la madera más grande del condado, olmos siberianos y álamos altos crecidos sobre casas, callejones y líneas eléctricas desde los años cincuenta. Esas son las remociones que se acumulan cuando una empresa ya tiene la agenda llena. Mándeme la escalada y yo bajo la pieza sobre lo apretado mientras su cuadrilla maneja el suelo.',
  },
  monument: {
    en: 'Up on the higher ground north of the city, homes sit tucked into stands of ponderosa on treed acreage. Heavy spring snow loads the crowns and snaps tops and leaders that end up hanging over the rooflines. When one has to come down in pieces off a big pine, I climb it and rig it down while your team keeps the ground and the haul.',
    es: 'En la tierra alta al norte de la ciudad, las casas se meten entre bosques de ponderosa en terrenos arbolados. La nieve pesada de primavera carga las copas y quiebra puntas y líderes que quedan colgando sobre los techos. Cuando uno tiene que bajar en secciones de un pino grande, lo escalo y lo bajo aparejado mientras su equipo se queda con el suelo y el acarreo.',
  },
  'black-forest': {
    en: 'The 2013 fire left a forest of standing dead and fire weakened ponderosa still coming down around the rebuilt homes. Tall, brittle, and close to structures is exactly the work a crew wants a dedicated climber on. I climb the spar and lower it in controlled pieces so nothing gets shock loaded near the house.',
    es: 'El incendio de 2013 dejó un bosque de ponderosa muerta en pie y debilitada por el fuego que todavía hay que bajar alrededor de las casas reconstruidas. Alto, quebradizo y pegado a las estructuras es justo el trabajo en el que una cuadrilla quiere un escalador dedicado. Escalo el fuste y lo bajo en piezas controladas para que nada reciba carga de golpe cerca de la casa.',
  },
  fountain: {
    en: 'Down along Fountain Creek the big plains cottonwoods grow fast and go brittle, dropping heavy deadwood over yards and fences. It is soft, unpredictable wood that does not like being felled whole near a structure. I climb them and bring the limbs and the spar down on rope while your crew clears and chips.',
    es: 'A lo largo de Fountain Creek los grandes álamos de llanura crecen rápido y se vuelven quebradizos, soltando ramas muertas pesadas sobre patios y cercas. Es madera blanda e impredecible a la que no le conviene ser tumbada entera cerca de una estructura. Los escalo y bajo las ramas y el fuste con cuerda mientras su cuadrilla despeja y tritura.',
  },
  'cimarron-hills': {
    en: 'The established east side streets are lined with aging silver maple and ash grown up over homes, fences, and the lines between tight lots. As that canopy gets old it sheds big limbs and whole leaders in a storm. Hand me the climb and I rig the weight down clear of the house while your team runs the ground.',
    es: 'Las calles establecidas del lado este están llenas de arces plateados y fresnos viejos crecidos sobre casas, cercas y las líneas entre terrenos apretados. Al envejecer, esa copa suelta ramas grandes y líderes enteros en una tormenta. Páseme la escalada y yo bajo el peso aparejado lejos de la casa mientras su equipo maneja el suelo.',
  },
  'manitou-springs': {
    en: 'Manitou sits on steep ground at the foot of Pikes Peak, narrow historic lots where big trees lean over old houses with almost no room to work. A bucket truck cannot reach most of it. That is climbing and rigging start to finish, and I bring the piece down over the roofline by hand while your crew handles the tight ground.',
    es: 'Manitou está en terreno empinado al pie de Pikes Peak, terrenos históricos angostos donde árboles grandes se inclinan sobre casas viejas casi sin espacio para trabajar. Un camión con canasta no alcanza casi nada. Eso es escalada y aparejo de principio a fin, y bajo la pieza sobre el techo a mano mientras su cuadrilla maneja el suelo apretado.',
  },
  'woodland-park': {
    en: 'At eight thousand feet Woodland Park is thick with tall ponderosa, Douglas fir, and aspen standing right over cabins and homes. Deep snow country means loaded crowns and broken tops through the winter. When a conifer has to come down in a tight forest lot, I climb it and lower it in sections while your team runs the ground below.',
    es: 'A ocho mil pies Woodland Park está espeso de ponderosa alta, abeto Douglas y álamo temblón parados justo sobre cabañas y casas. La nieve profunda deja copas cargadas y puntas quebradas durante el invierno. Cuando una conífera tiene que bajar en un terreno boscoso apretado, la escalo y la bajo en secciones mientras su equipo maneja el suelo abajo.',
  },
  'palmer-lake': {
    en: 'Palmer Lake climbs up into the foothills against the Rampart Range, ponderosa rooted on steep wooded lots above the town. Slope and access are the whole problem, the trees stand where no truck is getting to them. I climb off the trunk and rig each piece down the grade while your crew works the bottom.',
    es: 'Palmer Lake sube hacia las estribaciones contra la Rampart Range, ponderosa arraigada en terrenos boscosos empinados por encima del pueblo. La pendiente y el acceso son todo el problema, los árboles están donde ningún camión va a llegar. Escalo desde el tronco y bajo cada pieza por la ladera mientras su cuadrilla trabaja abajo.',
  },
  gleneagle: {
    en: 'Gleneagle is dense wooded residential on the Monument ridge, mature ponderosa grown up tight between the houses and straight over the rooftops. There is rarely a clean drop, every piece has to be roped and lowered. Send me the climb and I bring the crown down over the house while your team keeps the ground and the cleanup.',
    es: 'Gleneagle es residencial boscoso denso sobre la loma de Monument, ponderosa madura crecida apretada entre las casas y directo sobre los techos. Rara vez hay una caída limpia, cada pieza hay que amarrarla y bajarla. Mándeme la escalada y yo bajo la copa sobre la casa mientras su equipo se queda con el suelo y la limpieza.',
  },
}

// Rotating true Front Range angles — the stopgap for any town not yet written up
// in TOWN_DETAIL, so the page still reads honestly rather than blank.
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
  const intro =
    locale === 'es'
      ? `Woodchuckers es un escalador de árboles por contrato, dueño y operador, para empresas en ${name}, Colorado. Traigo mi propio equipo de escalada y aparejo, escalo la pieza que su cuadrilla no alcanza y la bajo. Usted maneja el suelo.`
      : `Woodchuckers is an owner-operated contract tree climber for hire by tree companies in ${name}, Colorado. I bring my own climbing and rigging gear, climb the piece past your crew, and bring it down. You run the ground.`

  const detail = TOWN_DETAIL[base.slug]
  if (detail) {
    return { ...base, intro, localNote: detail[locale], placeholder: false }
  }

  const angle = LOCAL_ANGLES[locale][index % LOCAL_ANGLES[locale].length]
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
