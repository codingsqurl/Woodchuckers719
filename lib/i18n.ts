// i18n.ts — lightweight, dependency-free bilingual support (EN at root, ES at /es).
// English is the default and lives at clean URLs (/, /areas, /areas/[slug], ...).
// Spanish mirrors under /es with hreflang linking the pair, so Spanish searchers
// find the Spanish pages directly. The owner's leads stay in English: form option
// VALUES submitted to the server are never translated, only their visible labels.

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x)
}

// Map a clean logical path ("/", "/areas/monument") to its URL for a locale.
export function localePath(locale: Locale, path: string): string {
  if (locale === 'en') return path
  return path === '/' ? '/es' : `/es${path}`
}

// hreflang alternates for a page at a clean logical path. Relative URLs resolve
// against metadataBase. x-default points at English.
export function altLanguages(path: string): Record<string, string> {
  return {
    en: localePath('en', path),
    es: localePath('es', path),
    'x-default': localePath('en', path),
  }
}

// The Spanish welcome line, shown in many places per the brand ask.
export const SE_HABLA = 'Se habla español'

// ── Dictionary ──────────────────────────────────────────────────────────────
// `en` defines the shape; `es` must match it (typed below), so a missing Spanish
// string is a compile error, not a silent English fallback.

const en = {
  // chrome
  nav: { home: 'Home', work: 'My Work', areas: 'Areas', estimate: 'Estimate' },
  skip: 'Skip to content',
  callLabel: 'Call',
  freeEstimate: 'Free estimate',
  bookDay: 'Book a day',
  footPro: 'Climber for hire',
  proLink: 'Run a tree company? I climb contract →',
  seHabla: SE_HABLA,
  langName: { en: 'English', es: 'Español' },
  switchTo: 'Ver en español',
  servingArea: 'Serving the Colorado Springs area',
  callOrText: 'Call or text to talk through your trees, no obligation.',

  // home
  home: {
    metaTitle: 'Woodchuckers | Professional Tree Climber | Colorado Springs',
    metaDesc:
      'Professional tree climber serving Colorado Springs. Removals, trimming, and technical take-downs, roped, rigged, and lowered by hand. Trained, owner-operated. Free estimates. Se habla español.',
    heroEyebrow: 'Colorado Springs · Owner-operated',
    heroTitle: ['Trees too big', 'to handle?', 'I climb them.'],
    heroSub:
      'A trained climber for removals, trimming, and technical take-downs, roped, rigged, and lowered by hand. The person who quotes your tree is the one up in it. Se habla español.',
    ctaEstimate: 'Get a free estimate',
    trust: ['Free estimates', 'Owner-operated', 'Roped & rigged', 'Se habla español'],
    servicesTitle: 'What I take on',
    services: [
      { title: 'Removals', body: 'Whole trees taken down in pieces, roped and lowered, no damage to what’s underneath.' },
      { title: 'Trimming & pruning', body: 'Clearance, deadwood, and shape, cut for the tree’s health, not just the look.' },
      { title: 'Technical take-downs', body: 'Tight spots near the house, fence, or power lines, rigged down by hand.' },
      { title: 'Storm & hazard work', body: 'Broken limbs and leaners made safe, fast, before they come down on their own.' },
    ],
    seeWork: 'See the work',
    hazardTitle: 'Big trees, close to the house?',
    hazardLead:
      'Front Range pines get tall and heavy, and they don’t fall where you’d want them to. If there’s a dead one over the roof or a leaner by the deck, that’s exactly the job I’m built for, climbed and taken down in controlled pieces instead of dropped.',
    aboutTitle: 'One climber, start to finish',
    aboutLead:
      'Years in the trees and trained on rope and rigging. No subcontractors, no rotating crews. The person who quotes your job is the same one climbing it, careful with your property, fast on the clock, and straight with you about what it actually needs.',
    contactTitle: 'Free estimates, straight answers',
  },

  // portfolio
  work: {
    metaTitle: 'My Work | Woodchuckers Tree Service | Colorado Springs',
    metaDesc:
      'Real tree work in Colorado Springs. Climbing, rigging, and removals done by hand. No stock photos, no subcontractors. Se habla español.',
    eyebrow: 'My Work',
    heroTitle: ['Real climbs.', 'Real results.', 'No stock photos.'],
    title: 'Real climbs, real results',
    lead: 'No subcontractors and no stock photos. That’s me up in the tree on every job, roped in and doing it right.',
    cap1: 'Roped into the canopy for a controlled trim.',
    cap2: 'Big residential pines, taken down piece by piece.',
    doTitle: 'What I do',
    doLead:
      'I’m a professional tree climber. I bring my climbing and rigging gear and get the tree down or trimmed. I don’t haul debris off-site, so you keep the wood or your hauler takes it.',
    list: [
      { title: 'Tree removal', body: 'Hazardous, dead, or just in the way. Taken down piece by piece, roped and lowered right up against the house when it has to be.' },
      { title: 'Trimming & pruning', body: 'Clear deadwood, shape the canopy, raise limbs off your roof, and keep branches clear of the power lines.' },
      { title: 'Technical & sectional removals', body: 'Tight backyards, fence lines, and over structures where a bucket truck can’t reach. Climbed and rigged down by hand.' },
      { title: 'Storm-damaged trees', body: 'Hung-up limbs, broken tops, and leaners made safe and brought down before they do more damage.' },
      { title: 'Contract climbing', body: 'Running a crew and need a climber? Bring me in for the technical climb and rigging while your team works the ground.' },
      { title: 'On-site cleanup', body: 'For a flat $100 I’ll cut it down and pile the wood and brush in one spot. Hauling it away is on you or your hauler.' },
      { title: 'Full debris removal', body: 'Want it gone completely? For a flat $150 I can organize full debris removal and have the wood and brush hauled off your property.' },
    ],
    contactTitle: 'Like what you see?',
  },

  // areas
  areas: {
    metaTitle: 'Service Areas | Woodchuckers Tree Climber | Colorado Springs',
    metaDesc:
      'Towns served by Woodchuckers, a professional tree climber based in Colorado Springs. Tap your town for details. Se habla español.',
    eyebrow: 'Service Areas',
    heroTitle: ['Front Range trees,', 'town by town,', 'climbed by hand.'],
    title: 'Where I work',
    lead: 'A professional tree climber working across Colorado Springs and the surrounding El Paso County communities.',
    townsTitle: 'Towns I serve',
    expansionTag: 'Coming September 2027',
    expansionBody:
      'The Great Expansion Project. I am taking Woodchuckers beyond Colorado to also serve Washington, Oregon, and California.',
    contactTitle: 'In my area? Let’s talk.',
  },

  // per-town page
  town: {
    serviceArea: 'Service Area',
    titleFor: (name: string) => `Tree service in ${name}, Colorado`,
    metaTitleFor: (name: string) => `Tree Service in ${name}, CO | Woodchuckers`,
    metaDescFor: (name: string) =>
      `Tree removal and trimming in ${name}, Colorado. Owner operated climber, roped and rigged by hand, careful around the house and power lines. Free estimates. Se habla español.`,
    doInTitle: (name: string) => `What I do in ${name}`,
    localTitle: 'Local trees, handled local',
    mapTitleFor: (name: string) => `Map of the ${name}, CO tree service area`,
    contactTitleFor: (name: string) => `In ${name}? Let’s talk.`,
    servingFor: (name: string) => `Serving ${name} and the Colorado Springs area`,
    core: [
      { title: 'Removals', body: 'Whole trees taken down in pieces, roped and lowered, no damage to what’s underneath.' },
      { title: 'Trimming & pruning', body: 'Clearance, deadwood, and shape, cut for the tree’s health, not just the look.' },
      { title: 'Technical take-downs', body: 'Tight spots near the house, fence, or power lines, rigged down by hand.' },
      { title: 'Storm & hazard work', body: 'Broken limbs and leaners made safe, fast, before they come down on their own.' },
    ],
    breadcrumbAreas: 'Service Areas',
  },

  // estimate
  estimate: {
    metaTitle: 'Free Estimate | Woodchuckers Tree Service | Colorado Springs',
    metaDesc:
      'Get a free tree-work estimate in Colorado Springs. Day-rate pricing, fast and safe. Se habla español.',
    headTitle: 'Free estimate',
    headIntro:
      'I’m a professional tree climber. I bring my climbing and rigging gear and get your tree down or trimmed, safely and as fast as the job allows. I work efficiently so you’re not paying for wasted time.',
    headNote1: 'I price by the day:',
    headNotePrice: '$175–$350 a day',
    headNote2: '. Most single-tree jobs are one day. Optional on-site cleanup (I cut it down and pile the wood and brush) is a flat',
    headNoteCleanup: '$100',
    headNote3: '. Heads up. I don’t haul debris off-site, so removal is on you or your hauler.',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    calcLenLabel: 'Estimated job length',
    day1: '1 day',
    day2: '2 days',
    calcHint: 'Most single-tree jobs are one day.',
    debrisLabel: 'Debris',
    debrisNone: 'Leave it on site (no charge)',
    debrisCleanup: 'On-site cleanup, cut & pile (+$100)',
    debrisRemoval: 'Full debris removal, hauled off (+$150)',
    calcSub: 'Ballpark only. Final number after I see the tree.',
    fName: 'Your name *',
    fPhone: 'Phone',
    fEmail: 'Email',
    fAddress: 'Service address',
    fAddressPh: 'Street, city',
    treesTitle: 'Your trees',
    addTree: '+ Add a tree',
    treesNote: 'Add a row for each tree. Mixed jobs are fine, for example remove a dead one and trim a live one.',
    treeN: (n: number) => `Tree ${n}`,
    removeTree: 'Remove this tree',
    tWhat: 'What for?',
    tWhatOpts: { remove: 'Remove it', trim: 'Trim / prune', sectional: 'Technical / sectional removal', storm: 'Storm damage', unsure: 'Not sure yet' },
    tSpecies: 'Species',
    tSpeciesNotSure: 'Not sure',
    tHeight: 'Height',
    tHeightPick: 'Pick one',
    tHeightU30: 'Under 30 ft',
    tHeight3060: '30–60 ft',
    tHeight60: '60+ ft',
    tCond: 'Dead or alive?',
    tCondPick: 'Pick one',
    tCondAlive: 'Alive and healthy',
    tCondDead: 'Dead or hazardous',
    tNear: 'Near house, fence, or lines?',
    tNearPick: 'Pick one',
    tNearOpen: 'Open, away from structures',
    tNearClose: 'Close to house, fence, or lines',
    tDrop: 'Drop zone',
    tDropPick: 'Pick one',
    tDropClear: 'Clear, open',
    tDropSome: 'Some obstacles',
    tDropTight: 'Tight, lots of obstacles',
    detailsLabel: 'Tell me about the trees',
    detailsPh: 'How many trees, roughly how tall, near the house or power lines, anything I should know.',
    sourceLabel: 'How’d you hear about me?',
    sourcePick: 'Pick one (optional)',
    sourceOpts: { google: 'Google search', facebook: 'Facebook', nextdoor: 'Nextdoor', instagram: 'Instagram', tiktok: 'TikTok', yelp: 'Yelp', referral: 'Friend or neighbor', truck: 'Saw the truck / a sign', other: 'Somewhere else' },
    requiredNote: '* Name plus a phone or email so I can reach you.',
    submit: 'Send my request',
    submitting: 'Sending…',
    species: ['Ponderosa pine', 'Pinyon pine', 'Blue spruce', 'Aspen', 'Cottonwood', 'Oak', 'Juniper', 'Elm', 'Maple', 'Ash', 'Locust', 'Other'],
    thanksTitle: (name: string) => `Got it, ${name}. Thanks!`,
    thanksBody: 'Your request is in. I’ll reach out to lock in the details and a firm number. Need it sooner? Call or text',
    errRate: 'Too many requests, slow down. Try again in a minute.',
    errMissing: 'Please give your name and at least a phone number or email.',
    errSave: 'Something broke saving your request. Call or text instead and I’ll get you sorted.',
  },

  // contract climbing (B2B — climber for hire)
  contract: {
    metaTitle: 'Tree Removal & Contract Climbing | Woodchuckers | Colorado Springs',
    metaDesc:
      'Professional tree climber in Colorado Springs — removals, storm work, and rigging-heavy takedowns for homeowners and tree companies. Own gear, free estimate.',
    kicker: 'Colorado Springs',
    headTitle: 'I take down the tree nobody else will',
    heroTitle: ['I take down', 'the tree', 'nobody else will.'],
    headLede:
      'A dead pine over your house, or a section your crew can’t reach — I climb it, rope it, and bring it down clean. Homeowners and tree companies both.',
    bookLine: 'Call or text for a free estimate:',
    ratesTitle: 'Day rate',
    rateUnit: 'per day',
    included: 'Your crew runs the ground, I take the climb — the removal past your team, the rigging over the house, the section nobody wants. A contract climber with my own gear.',
    qualsTitle: 'What you’re getting',
    quals: [
      'Second year climbing professionally',
      'Owner-operated, no subcontractors',
      'My own climbing gear, plus some rigging gear',
      'Removals, sectional takedowns, storm damage, rigging over structures',
    ],
    formTitle: 'Short a climber? Send me the job.',
    fName: 'Your name *',
    fPhone: 'Phone',
    fEmail: 'Email',
    detailsLabel: 'What’s the climb?',
    detailsPh: 'The job, the site, your crew, access, power lines, crane, the deadline — whatever I should know.',
    requiredNote: '* Your name, plus a phone or email so I can reach you.',
    submit: 'Send the job',
    submitting: 'Sending…',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    thanksTitle: (name: string) => `Got it, ${name}.`,
    thanksBody: 'I’ll confirm availability and a firm number. Need it sooner? Call or text',
    errRate: 'Too many requests, slow down. Try again in a minute.',
    errMissing: 'Please give your name and a phone or email.',
    errSave: 'Something broke saving your request. Call or text instead and I’ll get you sorted.',
  },

  // link-in-bio page
  links: {
    metaTitle: 'Woodchuckers — Links',
    tagline: 'Professional Tree Climber · Colorado Springs',
    heroTitle: ['Every way', 'to reach', 'Woodchuckers.'],
    website: 'Visit the website',
    websiteSub: 'woodchuckertrees.com',
    estimate: 'Get a free estimate',
    estimateSub: 'Fast day-rate quote',
    callText: 'Call or text',
    cashapp: 'Pay with CashApp',
    zelle: 'Pay with Zelle',
    applepay: 'Pay with Apple Pay',
    tapCopy: 'tap to copy',
    copied: (val: string) => `Copied ${val}`,
    scanToShare: 'Scan to share',
    qrAlt: 'QR code to this page',
  },

  // themed 404 / 500
  errpage: {
    notFoundTitle: "That branch doesn't exist",
    notFoundMsg:
      "The page you were after isn't here. Head back home, or call and I'll point you the right way.",
    errorTitle: 'Something broke',
    errorMsg: "Something went wrong on my end. Try again in a moment, or call and I'll sort it out.",
    backHome: 'Back home',
  },
}

type Dict = typeof en

const es: Dict = {
  nav: { home: 'Inicio', work: 'Mi Trabajo', areas: 'Zonas', estimate: 'Presupuesto' },
  skip: 'Saltar al contenido',
  callLabel: 'Llamar',
  freeEstimate: 'Presupuesto gratis',
  bookDay: 'Reservar un día',
  footPro: 'Escalador por contrato',
  proLink: '¿Tiene empresa de árboles? Escalo por contrato →',
  seHabla: SE_HABLA,
  langName: { en: 'English', es: 'Español' },
  switchTo: 'View in English',
  servingArea: 'Sirviendo el área de Colorado Springs',
  callOrText: 'Llame o escriba para hablar de sus árboles, sin compromiso.',

  home: {
    metaTitle: 'Woodchuckers | Escalador Profesional de Árboles | Colorado Springs',
    metaDesc:
      'Escalador profesional de árboles en Colorado Springs. Remociones, podas y derribos técnicos, con cuerda y aparejo, bajados a mano. Entrenado, dueño y operador. Presupuestos gratis. Se habla español.',
    heroEyebrow: 'Colorado Springs · Dueño y operador',
    heroTitle: ['¿Árboles demasiado', 'grandes para usted?', 'Yo los escalo.'],
    heroSub:
      'Un escalador entrenado para remociones, podas y derribos técnicos, con cuerda y aparejo, bajados a mano. La persona que cotiza su árbol es la que sube a él. Se habla español.',
    ctaEstimate: 'Reciba un presupuesto gratis',
    trust: ['Presupuestos gratis', 'Dueño y operador', 'Con cuerda y aparejo', 'Se habla español'],
    servicesTitle: 'Lo que hago',
    services: [
      { title: 'Remociones', body: 'Árboles completos bajados en piezas, con cuerda y sin dañar lo que está debajo.' },
      { title: 'Poda y mantenimiento', body: 'Despeje, ramas secas y forma, cortado por la salud del árbol, no solo por la apariencia.' },
      { title: 'Derribos técnicos', body: 'Lugares estrechos cerca de la casa, la cerca o los cables, bajados a mano con aparejo.' },
      { title: 'Daños por tormenta', body: 'Ramas rotas e inclinadas, aseguradas rápido antes de que caigan solas.' },
    ],
    seeWork: 'Vea el trabajo',
    hazardTitle: '¿Árboles grandes cerca de la casa?',
    hazardLead:
      'Los pinos del Front Range crecen altos y pesados, y no caen donde uno quisiera. Si hay uno seco sobre el techo o inclinado junto al porche, ese es justo el trabajo para el que estoy hecho, escalado y bajado en piezas controladas en vez de tumbado.',
    aboutTitle: 'Un escalador, de principio a fin',
    aboutLead:
      'Años en los árboles y entrenado en cuerda y aparejo. Sin subcontratistas, sin cuadrillas rotativas. La persona que cotiza su trabajo es la misma que lo escala, cuidadoso con su propiedad, rápido en el reloj y honesto sobre lo que de verdad necesita.',
    contactTitle: 'Presupuestos gratis, respuestas claras',
  },

  work: {
    metaTitle: 'Mi Trabajo | Woodchuckers Servicio de Árboles | Colorado Springs',
    metaDesc:
      'Trabajo real de árboles en Colorado Springs. Escalada, aparejo y remociones hechos a mano. Sin fotos de archivo, sin subcontratistas. Se habla español.',
    eyebrow: 'Mi Trabajo',
    heroTitle: ['Escaladas reales.', 'Resultados reales.', 'Sin fotos de archivo.'],
    title: 'Escaladas reales, resultados reales',
    lead: 'Sin subcontratistas y sin fotos de archivo. Ese soy yo arriba del árbol en cada trabajo, con la cuerda y haciéndolo bien.',
    cap1: 'Con cuerda en la copa para una poda controlada.',
    cap2: 'Pinos grandes de casa, bajados pieza por pieza.',
    doTitle: 'Lo que hago',
    doLead:
      'Soy escalador profesional de árboles. Traigo mi equipo de escalada y aparejo y bajo o podo el árbol. No me llevo los restos del sitio, así que usted se queda la madera o su transportista la recoge.',
    list: [
      { title: 'Remoción de árboles', body: 'Peligrosos, secos o simplemente en el camino. Bajados pieza por pieza, con cuerda, pegados a la casa cuando hace falta.' },
      { title: 'Poda y mantenimiento', body: 'Limpiar ramas secas, dar forma a la copa, levantar ramas del techo y despejar de los cables.' },
      { title: 'Remociones técnicas y por secciones', body: 'Patios estrechos, cercas y sobre estructuras donde un camión grúa no llega. Escalado y bajado a mano con aparejo.' },
      { title: 'Árboles dañados por tormenta', body: 'Ramas atoradas, copas rotas e inclinados, asegurados y bajados antes de que causen más daño.' },
      { title: 'Escalada por contrato', body: '¿Tiene una cuadrilla y necesita un escalador? Llámeme para la escalada técnica y el aparejo mientras su equipo trabaja en el suelo.' },
      { title: 'Limpieza en sitio', body: 'Por $100 fijos lo corto y amontono la madera y la maleza en un solo lugar. Llevárselo es cosa suya o de su transportista.' },
      { title: 'Retiro completo de restos', body: '¿Lo quiere fuera por completo? Por $150 fijos organizo el retiro completo y hago que se lleven la madera y la maleza de su propiedad.' },
    ],
    contactTitle: '¿Le gusta lo que ve?',
  },

  areas: {
    metaTitle: 'Zonas de Servicio | Woodchuckers Escalador de Árboles | Colorado Springs',
    metaDesc:
      'Pueblos que atiende Woodchuckers, escalador profesional de árboles en Colorado Springs. Toque su pueblo para más detalles. Se habla español.',
    eyebrow: 'Zonas de Servicio',
    heroTitle: ['Árboles del Front Range,', 'pueblo por pueblo,', 'escalados a mano.'],
    title: 'Dónde trabajo',
    lead: 'Un escalador profesional de árboles que trabaja en Colorado Springs y las comunidades vecinas del condado de El Paso.',
    townsTitle: 'Pueblos que atiendo',
    expansionTag: 'Llega en septiembre de 2027',
    expansionBody:
      'El Gran Proyecto de Expansión. Estoy llevando Woodchuckers más allá de Colorado para atender también Washington, Oregón y California.',
    contactTitle: '¿En mi zona? Hablemos.',
  },

  town: {
    serviceArea: 'Zona de Servicio',
    titleFor: (name: string) => `Servicio de árboles en ${name}, Colorado`,
    metaTitleFor: (name: string) => `Servicio de Árboles en ${name}, CO | Woodchuckers`,
    metaDescFor: (name: string) =>
      `Remoción y poda de árboles en ${name}, Colorado. Escalador dueño y operador, con cuerda y aparejo a mano, cuidadoso cerca de la casa y los cables. Presupuestos gratis. Se habla español.`,
    doInTitle: (name: string) => `Lo que hago en ${name}`,
    localTitle: 'Árboles locales, atendidos local',
    mapTitleFor: (name: string) => `Mapa de la zona de servicio de ${name}, CO`,
    contactTitleFor: (name: string) => `¿En ${name}? Hablemos.`,
    servingFor: (name: string) => `Sirviendo ${name} y el área de Colorado Springs`,
    core: [
      { title: 'Remociones', body: 'Árboles completos bajados en piezas, con cuerda y sin dañar lo que está debajo.' },
      { title: 'Poda y mantenimiento', body: 'Despeje, ramas secas y forma, cortado por la salud del árbol, no solo por la apariencia.' },
      { title: 'Derribos técnicos', body: 'Lugares estrechos cerca de la casa, la cerca o los cables, bajados a mano con aparejo.' },
      { title: 'Daños por tormenta', body: 'Ramas rotas e inclinadas, aseguradas rápido antes de que caigan solas.' },
    ],
    breadcrumbAreas: 'Zonas de Servicio',
  },

  estimate: {
    metaTitle: 'Presupuesto Gratis | Woodchuckers Servicio de Árboles | Colorado Springs',
    metaDesc:
      'Reciba un presupuesto gratis de trabajo de árboles en Colorado Springs. Precio por día, rápido y seguro. Se habla español.',
    headTitle: 'Presupuesto gratis',
    headIntro:
      'Soy escalador profesional de árboles. Traigo mi equipo de escalada y aparejo y bajo o podo su árbol, de forma segura y tan rápido como permita el trabajo. Trabajo con eficiencia para que no pague por tiempo perdido.',
    headNote1: 'Cobro por día:',
    headNotePrice: '$175 a $350 por día',
    headNote2: '. La mayoría de los trabajos de un árbol son de un día. La limpieza opcional en sitio (lo corto y amontono la madera y la maleza) es un fijo de',
    headNoteCleanup: '$100',
    headNote3: '. Aviso. No me llevo los restos del sitio, así que el retiro es cosa suya o de su transportista.',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    calcLenLabel: 'Duración estimada del trabajo',
    day1: '1 día',
    day2: '2 días',
    calcHint: 'La mayoría de los trabajos de un árbol son de un día.',
    debrisLabel: 'Restos',
    debrisNone: 'Dejarlos en el sitio (sin cargo)',
    debrisCleanup: 'Limpieza en sitio, cortar y amontonar (+$100)',
    debrisRemoval: 'Retiro completo de restos, llevados fuera (+$150)',
    calcSub: 'Solo aproximado. El número final después de ver el árbol.',
    fName: 'Su nombre *',
    fPhone: 'Teléfono',
    fEmail: 'Correo',
    fAddress: 'Dirección del servicio',
    fAddressPh: 'Calle, ciudad',
    treesTitle: 'Sus árboles',
    addTree: '+ Agregar un árbol',
    treesNote: 'Agregue una fila por cada árbol. Los trabajos mixtos están bien, por ejemplo remover uno seco y podar uno vivo.',
    treeN: (n: number) => `Árbol ${n}`,
    removeTree: 'Quitar este árbol',
    tWhat: '¿Para qué?',
    tWhatOpts: { remove: 'Removerlo', trim: 'Podar', sectional: 'Remoción técnica / por secciones', storm: 'Daño por tormenta', unsure: 'Aún no estoy seguro' },
    tSpecies: 'Especie',
    tSpeciesNotSure: 'No estoy seguro',
    tHeight: 'Altura',
    tHeightPick: 'Elija una',
    tHeightU30: 'Menos de 30 pies',
    tHeight3060: '30 a 60 pies',
    tHeight60: 'Más de 60 pies',
    tCond: '¿Vivo o seco?',
    tCondPick: 'Elija una',
    tCondAlive: 'Vivo y sano',
    tCondDead: 'Seco o peligroso',
    tNear: '¿Cerca de la casa, la cerca o cables?',
    tNearPick: 'Elija una',
    tNearOpen: 'Abierto, lejos de estructuras',
    tNearClose: 'Cerca de la casa, la cerca o cables',
    tDrop: 'Zona de caída',
    tDropPick: 'Elija una',
    tDropClear: 'Despejada, abierta',
    tDropSome: 'Algunos obstáculos',
    tDropTight: 'Estrecha, muchos obstáculos',
    detailsLabel: 'Cuénteme de los árboles',
    detailsPh: 'Cuántos árboles, qué tan altos más o menos, cerca de la casa o de los cables, cualquier cosa que deba saber.',
    sourceLabel: '¿Cómo supo de mí?',
    sourcePick: 'Elija una (opcional)',
    sourceOpts: { google: 'Búsqueda en Google', facebook: 'Facebook', nextdoor: 'Nextdoor', instagram: 'Instagram', tiktok: 'TikTok', yelp: 'Yelp', referral: 'Amigo o vecino', truck: 'Vi la camioneta / un letrero', other: 'En otro lugar' },
    requiredNote: '* Nombre más un teléfono o correo para poder contactarlo.',
    submit: 'Enviar mi solicitud',
    submitting: 'Enviando…',
    species: ['Pino ponderosa', 'Pino piñonero', 'Abeto azul', 'Álamo temblón', 'Álamo', 'Roble', 'Enebro', 'Olmo', 'Arce', 'Fresno', 'Acacia', 'Otro'],
    thanksTitle: (name: string) => `Listo, ${name}. ¡Gracias!`,
    thanksBody: 'Su solicitud está registrada. Me comunicaré para afinar los detalles y un número firme. ¿Lo necesita antes? Llame o escriba',
    errRate: 'Demasiadas solicitudes, despacio. Intente de nuevo en un minuto.',
    errMissing: 'Por favor dé su nombre y al menos un teléfono o correo.',
    errSave: 'Algo falló al guardar su solicitud. Llame o escriba y lo resuelvo.',
  },

  contract: {
    metaTitle: 'Remoción de Árboles y Escalada por Contrato | Woodchuckers | Colorado Springs',
    metaDesc:
      'Escalador profesional de árboles en Colorado Springs — remociones, daño por tormenta y desmontes con aparejo para dueños de casa y empresas. Equipo propio, presupuesto gratis.',
    kicker: 'Colorado Springs',
    headTitle: 'Bajo el árbol que nadie más quiere',
    heroTitle: ['Bajo el árbol', 'que nadie', 'más quiere.'],
    headLede:
      'Un pino muerto sobre su casa, o una sección que su cuadrilla no alcanza — lo escalo, lo aparejo y lo bajo limpio. Dueños de casa y empresas, por igual.',
    bookLine: 'Llame o escriba para un presupuesto gratis:',
    ratesTitle: 'Tarifa por día',
    rateUnit: 'por día',
    included:
      'Su cuadrilla maneja el suelo, yo me encargo de la escalada — la remoción que su equipo no alcanza, el aparejo sobre la casa, la sección que nadie quiere. Escalador por contrato con mi propio equipo.',
    qualsTitle: 'Lo que recibe',
    quals: [
      'Segundo año escalando profesionalmente',
      'Dueño y operador, sin subcontratistas',
      'Equipo de escalada propio y algo de equipo de aparejo',
      'Tala y remoción, secciones, daño por tormenta, aparejo sobre estructuras',
    ],
    formTitle: '¿Le falta un escalador? Envíeme el trabajo.',
    fName: 'Su nombre *',
    fPhone: 'Teléfono',
    fEmail: 'Correo',
    detailsLabel: '¿Cuál es la escalada?',
    detailsPh: 'El trabajo, el sitio, su cuadrilla, acceso, líneas eléctricas, grúa, la fecha límite — lo que deba saber.',
    requiredNote: '* Su nombre, más un teléfono o correo para poder contactarlo.',
    submit: 'Enviar el trabajo',
    submitting: 'Enviando…',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    thanksTitle: (name: string) => `Listo, ${name}.`,
    thanksBody: 'Confirmaré disponibilidad y un número firme. ¿Lo necesita antes? Llame o escriba',
    errRate: 'Demasiadas solicitudes, despacio. Intente de nuevo en un minuto.',
    errMissing: 'Por favor dé su nombre y un teléfono o correo.',
    errSave: 'Algo falló al guardar su solicitud. Llame o escriba y lo resuelvo.',
  },

  links: {
    metaTitle: 'Woodchuckers — Enlaces',
    tagline: 'Escalador Profesional de Árboles · Colorado Springs',
    heroTitle: ['Todas las formas', 'de contactar a', 'Woodchuckers.'],
    website: 'Visitar el sitio web',
    websiteSub: 'woodchuckertrees.com',
    estimate: 'Reciba un presupuesto gratis',
    estimateSub: 'Cotización rápida por día',
    callText: 'Llame o escriba',
    cashapp: 'Pagar con CashApp',
    zelle: 'Pagar con Zelle',
    applepay: 'Pagar con Apple Pay',
    tapCopy: 'toque para copiar',
    copied: (val: string) => `Copiado ${val}`,
    scanToShare: 'Escanee para compartir',
    qrAlt: 'Código QR de esta página',
  },

  errpage: {
    notFoundTitle: 'Esa rama no existe',
    notFoundMsg:
      'La página que buscaba no está aquí. Vuelva al inicio, o llame y le indico el camino.',
    errorTitle: 'Algo falló',
    errorMsg: 'Algo salió mal de mi lado. Intente de nuevo en un momento, o llame y lo resuelvo.',
    backHome: 'Volver al inicio',
  },
}

const messages: Record<Locale, Dict> = { en, es }

export function getDict(locale: Locale): Dict {
  return messages[locale]
}
