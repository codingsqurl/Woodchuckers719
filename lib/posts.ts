// posts.ts — the content hub (lead-gen rebuild, chunk 3). Each entry is one
// /blog/[slug] stub: a real, indexable, SEO-complete page with an intro and an
// outline, targeting a search question someone asks before hiring a contract
// climber. `draft: true` marks it a stub (outline, not the full article) so the
// UI can label it honestly and KING can flesh each one out later.
//
// Audience is B2B-leaning, per the site: tree-company owners, crew foremen,
// property/GC people who need climbing work, not homeowners shopping a yard tree.

import type { Locale } from './i18n'

// One section of a finished article: a subhead plus its paragraphs.
export type Section = { heading: string; paras: string[] }

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
  // The finished article. When present (and draft:false) the page renders these
  // sections instead of the outline. Absent on the stubs still being written.
  body?: Section[]
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
    body: [
      {
        heading: 'No safe place for it to land',
        paras: [
          'A tree in the open is a fell. The saw work is quick and the risk is low. That changes the moment there is nowhere clear for the trunk to land. A house on one side, a fence and a shed on the other, power lines over the only lean. A straight fell now puts thousands of dollars of the customer’s property in the fall path.',
          'That is the point to climb it instead. Roped in, the tree comes down in pieces small enough to control, lowered to a spot your ground crew picks. Nothing swings wider than the rope allows. When the drop zone is the problem, a climber for the day is not an upgrade. It is the only safe way down.',
        ],
      },
      {
        heading: 'Dead and hollow wood',
        paras: [
          'Green wood bends and holds a hinge. Dead and hollow wood does neither. A standing dead ponderosa or a trunk gone punky in the middle can shatter when the hinge loads, and it can fail early and drop the top where nobody planned. Felling that is a gamble even in the open.',
          'A climber reads the wood on the way up and rigs each piece so it is never shock loaded. Small cuts, controlled lowers, no big hinge betting on rotten fiber. If your crew is looking at standing dead or a hollow butt near anything that matters, that is a climb to hand off, not a fell to force.',
        ],
      },
      {
        heading: 'Short a climber, not short a job',
        paras: [
          'Sometimes the tree is a clean climb and the only problem is you are out of climbers. Your one guy is booked across town, or you are between hires, and the customer wants it down this week. Turn the job away and it goes to a competitor. Send a groundman up a rope he is not ready for and someone goes home hurt.',
          'A climber for the day covers the gap without carrying a full climber on payroll for a season you cannot promise. You keep the customer, keep the schedule, and keep your ground crew doing what they do best. When the climb is fine and the bench is thin, that is the cheapest way to say yes to the work.',
        ],
      },
      {
        heading: 'The math on a bad fell',
        paras: [
          'The day rate is the easy number to see. The number that matters is the one you avoid. A trunk through a roof, a limb across a fence, a broken truck window, a claim, a day lost to cleanup and apologies. One bad fell can cost more than a month of day rates.',
          'Set the flat rate against that. You know the cost before anyone leaves the ground, your crew runs the job it already knows, and the technical piece comes down on rope instead of on a gamble. For the jobs that do not fit a clean fell, the day rate is not the expense. The bad fell is.',
        ],
      },
    ],
    draft: false,
    imageAlt: 'A large tree boxed in by a house and power lines, the kind of removal a contract climber brings down in sections.',
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

// Spanish mirror. Same slugs as postsEN so the URLs pair for hreflang. Still
// `draft: true` stubs — intro + outline translated, full bodies later.
const postsES: Post[] = [
  {
    slug: 'when-to-hire-a-contract-climber',
    metaTitle:
      'Cuándo Contratar un Escalador de Árboles por Contrato | Woodchuckers | Colorado Springs',
    metaDesc:
      'Cuándo le conviene a una empresa de árboles traer un escalador por contrato por un día en vez de forzar una escalada. Zonas de caída, madera seca, sobrecarga y seguridad de la cuadrilla. Colorado Springs.',
    ogTitle: 'Cuándo Contratar un Escalador por Contrato',
    title: 'Cuándo contratar un escalador por contrato en vez de forzar la escalada',
    excerpt:
      'La mayoría de las cuadrillas puede talar un árbol en lo abierto. La decisión se complica cuando no hay zona de caída, la madera está seca, o el escalador de planta ya está reservado. Traer un escalador por contrato por un día suele ser más barato y más seguro que forzar una remoción que no cabe.',
    outline: [
      'Sin zona de caída segura: cuándo la tala queda descartada',
      'Madera seca o hueca que no debe someter a carga de golpe',
      'Sobrecarga: cubrir una agenda saturada sin contratar',
      'La cuenta: una tarifa por día vs el riesgo de una mala tala',
    ],
    body: [
      {
        heading: 'Sin lugar seguro donde caer',
        paras: [
          'Un árbol en lo abierto es una tala. El trabajo de motosierra es rápido y el riesgo es bajo. Eso cambia en el momento en que no hay dónde caer el tronco despejado. Una casa de un lado, una cerca y un cobertizo del otro, líneas eléctricas sobre la única inclinación. Una tala directa ahora pone miles de dólares de la propiedad del cliente en la ruta de caída.',
          'Ese es el momento de escalarlo en su lugar. Con cuerda, el árbol baja en piezas lo bastante pequeñas para controlar, descendidas a un punto que elige su cuadrilla de tierra. Nada se balancea más de lo que la cuerda permite. Cuando la zona de caída es el problema, un escalador por el día no es un lujo. Es la única forma segura de bajarlo.',
        ],
      },
      {
        heading: 'Madera muerta y hueca',
        paras: [
          'La madera verde se dobla y sostiene una bisagra. La madera muerta y hueca no hace ninguna de las dos. Una ponderosa muerta en pie o un tronco podrido por dentro puede reventar cuando carga la bisagra, y puede fallar antes de tiempo y soltar la punta donde nadie lo planeó. Talar eso es una apuesta incluso en lo abierto.',
          'Un escalador lee la madera al subir y apareja cada pieza para que nunca reciba carga de golpe. Cortes pequeños, descensos controlados, ninguna bisagra grande apostando a fibra podrida. Si su cuadrilla tiene enfrente madera muerta en pie o una base hueca cerca de algo que importa, esa es una escalada para delegar, no una tala para forzar.',
        ],
      },
      {
        heading: 'Falta un escalador, no falta trabajo',
        paras: [
          'A veces el árbol es una escalada limpia y el único problema es que se quedó sin escaladores. Su único hombre está reservado al otro lado del pueblo, o está entre contrataciones, y el cliente lo quiere abajo esta semana. Rechace el trabajo y se va a un competidor. Suba a un hombre de tierra a una cuerda para la que no está listo y alguien se lastima.',
          'Un escalador por el día cubre el hueco sin cargar un escalador completo en la nómina por una temporada que no puede prometer. Usted conserva al cliente, conserva la agenda y mantiene a su cuadrilla de tierra en lo que mejor hace. Cuando la escalada está bien y el banco está corto, esa es la forma más barata de decir sí al trabajo.',
        ],
      },
      {
        heading: 'La cuenta de una mala tala',
        paras: [
          'La tarifa por día es el número fácil de ver. El número que importa es el que evita. Un tronco a través de un techo, una rama sobre una cerca, la ventana de una troca rota, un reclamo, un día perdido en limpieza y disculpas. Una mala tala puede costar más que un mes de tarifas por día.',
          'Ponga la tarifa plana contra eso. Usted sabe el costo antes de que nadie deje el suelo, su cuadrilla hace el trabajo que ya conoce, y la pieza técnica baja con cuerda en vez de a la suerte. Para los trabajos que no caben en una tala limpia, la tarifa por día no es el gasto. La mala tala lo es.',
        ],
      },
    ],
    draft: false,
    imageAlt:
      'Un árbol grande encajonado entre una casa y líneas eléctricas, el tipo de remoción que un escalador por contrato baja en secciones.',
  },
  {
    slug: 'sectional-removal-vs-felling',
    metaTitle: 'Remoción por Secciones vs Talar un Árbol | Woodchuckers | Colorado Springs',
    metaDesc:
      'Cuándo se puede tumbar un árbol entero y cuándo tiene que bajar en secciones, con cuerda y descenso. Cómo un escalador por contrato apareja una tala sin espacio para tumbar. Colorado Springs.',
    ogTitle: 'Remoción por Secciones vs Tala',
    title: 'Remoción por secciones vs tala: cuándo no se puede solo tumbar',
    excerpt:
      'Talar es lo más rápido cuando la zona de caída está despejada. Sobre una casa, una cerca o líneas, el árbol tiene que bajar en secciones controladas, con cuerda y descenso pieza por pieza. Así decide un escalador, y esto es lo que maneja la cuadrilla de tierra.',
    outline: [
      'Leer la zona de caída y la inclinación',
      'Bases del aparejo: poleas, descenso y la cuadrilla de tierra',
      'Cuándo una grúa cambia el plan',
      'Qué hace el escalador vs qué hace su cuadrilla',
    ],
    draft: true,
    imageAlt:
      'Un escalador aparejando una sección de tronco para bajarla sobre un techo en una remoción por secciones.',
  },
  {
    slug: 'what-a-contract-climber-charges',
    metaTitle:
      'Cuánto Cobra un Escalador de Árboles por Contrato | Tarifas por Día | Colorado Springs',
    metaDesc:
      'Cómo cotizan los escaladores de árboles por contrato: tarifas planas por día, qué cubre un día, y cuándo una sola pieza es por trabajo. Números claros para empresas de árboles. Colorado Springs.',
    ogTitle: 'Cuánto Cobra un Escalador por Contrato',
    title: 'Cuánto cobra un escalador por contrato, y qué cubre un día',
    excerpt:
      'La mayoría de la escalada por contrato se cotiza por día, no por árbol. Una tarifa plana por día mantiene la cuenta simple para la empresa que contrata: usted sabe el número antes de que el escalador deje el suelo. Esto es lo que cubre un día y cuándo una pieza única se cotiza por trabajo.',
    outline: [
      'Por qué las tarifas por día le ganan al precio por árbol en trabajo por contrato',
      'Qué cubre un día, y cuándo llega a dos',
      'Precio por trabajo para una sola pieza técnica',
      'Qué no se incluye: suelo, acarreo y limpieza',
    ],
    draft: true,
    imageAlt:
      'Un escalador por contrato equipado al pie de un árbol, listo para empezar una escalada por día.',
  },
  {
    slug: 'crane-assist-vs-climb-and-rig',
    metaTitle: 'Apoyo con Grúa vs Escalar y Aparejar | Talas de Árboles | Colorado Springs',
    metaDesc:
      'Cuándo una tala pide grúa y cuándo un escalador bajándola es la decisión correcta. Cómo trabaja un escalador por contrato de cualquier forma. Empresas de árboles de Colorado Springs.',
    ogTitle: 'Apoyo con Grúa vs Escalar y Aparejar',
    title: 'Apoyo con grúa vs escalar y aparejar: elegir el método para una tala',
    excerpt:
      'Una grúa acelera las cargas grandes y mantiene el peso fuera del fuste, pero no siempre es la decisión. A veces un escalador bajando el árbol pieza por pieza es más rápido y barato. El escalador trabaja de cualquier forma; así se elige el método.',
    outline: [
      'Dónde una grúa justifica su costo',
      'Cuándo escalar y aparejar es lo más rápido y barato',
      'El escalador en un trabajo con grúa: armar cargas y cortes',
      'Acceso y montaje: qué revisar antes del día',
    ],
    draft: true,
    imageAlt:
      'Una grúa levantando una sección de árbol mientras un escalador arma la siguiente carga en una tala.',
  },
  {
    slug: 'storm-damage-when-you-need-a-climber',
    metaTitle: 'Daño por Tormenta: Cuándo Necesita un Escalador Dedicado | Colorado Springs',
    metaDesc:
      'Ramas colgadas, puntas quebradas e inclinados tras una tormenta son las escaladas en las que una cuadrilla quiere un escalador dedicado. Cuándo llamarlo y qué tan rápido. Colorado Springs.',
    ogTitle: 'Daño por Tormenta: Cuándo Necesita un Escalador',
    title: 'Daño por tormenta: los peligros en los que su cuadrilla quiere un escalador dedicado',
    excerpt:
      'Tras un evento de viento o nieve pesada, el trabajo peligroso está arriba en el árbol: ramas colgadas, líderes quebrados e inclinados cargados. Estas son las escaladas en las que una cuadrilla agradece ceder la cuerda a un escalador dedicado. Así se identifican y cuándo llamar.',
    outline: [
      'Leer un inclinado cargado antes de tocarlo',
      'Ramas colgadas y puntas quebradas: bajarlas con control',
      'Por qué jalar un peligro desde el suelo sale mal',
      'Sacar un escalador rápido tras una tormenta',
    ],
    draft: true,
    imageAlt:
      'Un líder de árbol quebrado por tormenta colgado sobre una estructura, un peligro para un escalador dedicado.',
  },
]

const postsByLocale: Record<Locale, Post[]> = { en: postsEN, es: postsES }

export function postList(locale: Locale = 'en'): Post[] {
  return postsByLocale[locale]
}

export function postBySlug(slug: string, locale: Locale = 'en'): Post | undefined {
  return postsByLocale[locale].find((p) => p.slug === slug)
}
