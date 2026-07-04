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
  nav: { home: 'Home', work: 'My Work', areas: 'Areas', services: 'Services', estimate: 'Hire me' },
  navLabel: 'Primary',
  skip: 'Skip to content',
  callLabel: 'Call',
  freeEstimate: 'Get a day rate',
  bookDay: 'Book a day',
  footPro: 'Climber for hire',
  proLink: 'Run a tree company? I climb contract →',
  seHabla: SE_HABLA,
  langName: { en: 'English', es: 'Español' },
  switchTo: 'Ver en español',
  servingArea: 'Serving the Colorado Springs area',
  saveContact: 'Save my number',
  callOrText: 'Call or text about the climb, no obligation.',

  services: {
    moreTitle: 'More services',
    perDay: 'per day',
    metaTitle: 'Contract Tree Climbing Services | Woodchuckers | Colorado Springs',
    metaDesc:
      'What a tree company can book me for by the day in Colorado Springs: technical removals, canopy pruning, storm and hazard work, rigging and crane assist, and contract climbing for crews. Se habla español.',
    ogTitle: 'Contract Tree Climbing Services',
    eyebrow: 'For tree companies',
    heroTitle: ['What you', 'can book', 'by the day.'],
    heroSub:
      'I climb for tree companies and crews across the Front Range. Pick the work, get a day rate, keep your customer and your ground crew.',
    listTitle: 'Services',
  },

  blog: {
    metaTitle: 'Field Notes | Contract Tree Climbing | Woodchuckers | Colorado Springs',
    metaDesc:
      'Field notes on contract tree climbing: when to hire a climber, sectional removals, day rates, crane assist, and storm work. Plain answers for tree companies in Colorado Springs.',
    ogTitle: 'Field Notes — Contract Tree Climbing',
    crumb: 'Field notes',
    eyebrow: 'Field notes',
    indexTitle: 'Before you hire a climber',
    indexLead:
      'Plain answers to what tree companies and crews ask before bringing in a contract climber. Day rates, methods, and when to make the call.',
    covers: 'What this covers',
    draftNote:
      'Full write-up in progress. Need the answer for a real job now? Call or text and I will talk it through.',
  },

  // home
  home: {
    metaTitle: 'Woodchuckers | Contract Tree Climber, Booked by the Day | Colorado Springs',
    metaDesc:
      'A contract tree climber that tree companies book by the day in Colorado Springs. I bring my own gear, climb the piece past your crew, and bring it down. One day, sometimes two. Se habla español.',
    heroEyebrow: 'Colorado Springs · Climber by the day',
    heroTitle: ['Gear on my back,', 'up the tree,', 'down it comes.'],
    heroSub:
      'A contract climber that tree companies book by the day. You bring the crew and the chipper; I bring my gear and climb the piece your team can’t reach. One day, sometimes two.',
    ctaEstimate: 'Get a day rate',
    trust: ['Booked by the day', 'You run the ground', 'All my own gear', 'Se habla español'],
    servicesTitle: 'The trees I climb',
    services: [
      { title: 'Sectional takedowns', body: 'Big removals brought down in pieces, roped and lowered, when there’s no room to fell it.' },
      { title: 'Storm-damaged leaders', body: 'Broken tops, hung limbs, and leaners, made safe up in the canopy.' },
      { title: 'Rigging over structures', body: 'Limbs and wood lowered over the house, the fence, or the lines, off your crew’s plate.' },
      { title: 'The climb nobody wants', body: 'The technical piece past your team. I climb it, you run the ground.' },
    ],
    seeWork: 'See the work',
    allServices: 'All services',
    hazardTitle: 'A climb past your crew?',
    hazardLead:
      'When a removal is bigger or higher than your team can rig safely, call me in. I show up with my gear, make the climb, and bring it down. You keep the job, the ground crew, and the cleanup.',
    aboutTitle: 'Just the climber',
    aboutLead:
      'No truck, no crew, no upsell. I show up with a backpack of climbing and rigging gear, climb the tree, and get it down. Second year climbing, owner-operated. The guy who quotes the climb is the one on the rope.',
    contactTitle: 'Book a climber for the day',
    // fast text-the-job quote (SMS deep link)
    smsBody: 'Hi, here’s the climb:',
    smsCta: 'text me the climb →',
    smsNote: 'Got a job? Send it.',
    smsButton: 'Text the job',
    // how it works
    stepsTitle: 'How it works',
    steps: [
      { n: '1', title: 'Send the climb', body: 'Call or text the job. Location, size, when. You get a day rate back, usually same day.' },
      { n: '2', title: 'I show up with my gear', body: 'A backpack of climbing and rigging gear. No truck or crew needed from me.' },
      { n: '3', title: 'I climb, it comes down', body: 'I take the technical piece and bring it down. Your crew runs the ground and the cleanup.' },
    ],
    // objection FAQ
    faqTitle: 'Straight answers',
    faqs: [
      { q: 'How do you charge?', a: 'A flat day rate, $175–$350 depending on the climb. Most climbs are a day, some run two. One tricky piece? I can do it per-job.' },
      { q: 'What do you bring?', a: 'Everything I climb with. Saddle, ropes, and rigging gear, on my back. You bring the chipper and ground crew.' },
      { q: 'What about the ground and cleanup?', a: 'That’s your crew. I climb and bring the tree down; hauling, chipping, and cleanup stay with you.' },
      { q: 'What I Climb', a: 'Sectional takedowns, storm-damaged leaders, and rigging over structures. The piece past your team.' },
      { q: 'Who shows up?', a: 'One climber, second year climbing professionally, owner-operated. The guy who quotes the climb is the one on the rope.' },
    ],
  },

  // portfolio
  work: {
    metaTitle: 'My Work | Woodchuckers Contract Tree Climber | Colorado Springs',
    metaDesc:
      'Real contract climbing in Colorado Springs. Sectional takedowns, storm leaders, and rigging done by hand for tree companies. No stock photos. Se habla español.',
    eyebrow: 'My Work',
    heroTitle: ['Real climbs.', 'Real results.', 'No stock photos.'],
    title: 'Real climbs, real results',
    lead: 'No stock photos, no fluff. That’s me up in the tree on every job, roped in. The technical climb your crew hands off.',
    cap1: 'Roped into the canopy, working the climb.',
    cap2: 'Big pines brought down piece by piece.',
    cap3: 'Rigging a limb down clear of the power lines.',
    videoTitle: 'Watch a climb',
    videoCap: 'Real rope work, no edits.',
    doTitle: 'What I climb',
    doLead:
      'I’m a contract climber for tree companies. You bring the crew and the chipper; I bring my gear, take the technical piece, and bring it down. The ground, haul, and cleanup stay with your team.',
    list: [
      { title: 'Sectional takedowns', body: 'Big removals brought down in pieces, roped and lowered, when there’s no room to fell it.' },
      { title: 'Storm-damaged leaders', body: 'Hung-up limbs, broken tops, and leaners made safe up in the canopy before they do more damage.' },
      { title: 'Rigging over structures', body: 'Tight lots, fence lines, and limbs over the house or the lines, climbed and rigged down by hand.' },
      { title: 'The climb past your crew', body: 'The technical piece your team can’t reach or doesn’t want. I climb it; you run the ground.' },
      { title: 'A climber for the day', body: 'Short-handed or stacked up? Bring me in by the day to keep your crew moving.' },
    ],
    contactTitle: 'Like what you see?',
  },

  // areas
  areas: {
    metaTitle: 'Coverage Area | Woodchuckers Contract Tree Climber | Colorado Springs',
    metaDesc:
      'Where Woodchuckers climbs contract. Colorado Springs and the El Paso County towns. Tree companies: I’ll travel for the right climb. Se habla español.',
    eyebrow: 'Coverage',
    heroTitle: ['Front Range crews,', 'town by town,', 'I travel to climb.'],
    title: 'Where I climb',
    lead: 'A contract climber for tree companies across Colorado Springs and El Paso County. Got a job outside it? Ask. I’ll travel for the right climb.',
    townsTitle: 'Towns I cover',
    expansionTag: 'Coming September 2027',
    expansionBody:
      'The Great Expansion Project. Bringing Woodchuckers contract climbing beyond Colorado. Washington, Oregon, and California next.',
    contactTitle: 'Crew in the area? Let’s talk.',
  },

  // per-town page
  town: {
    serviceArea: 'Coverage',
    titleFor: (name: string) => `Contract tree climber in ${name}, Colorado`,
    metaTitleFor: (name: string) => `Contract Tree Climber in ${name}, CO | Woodchuckers`,
    metaDescFor: (name: string) =>
      `Contract tree climber for hire by tree companies in ${name}, Colorado. I bring my own gear, climb the piece past your crew, and bring it down. Day rate. Se habla español.`,
    doInTitle: (name: string) => `Trees I climb in ${name}`,
    localTitle: 'An extra climber, on call',
    mapTitleFor: (name: string) => `Map of the ${name}, CO area`,
    contactTitleFor: (name: string) => `Crew in ${name}? Let’s talk.`,
    servingFor: (name: string) => `Contract climbing in ${name} and the Colorado Springs area`,
    core: [
      { title: 'Sectional takedowns', body: 'Big removals brought down in pieces, roped and lowered, when there’s no room to fell it.' },
      { title: 'Storm-damaged leaders', body: 'Broken tops, hung limbs, and leaners, made safe up in the canopy.' },
      { title: 'Rigging over structures', body: 'Limbs and wood lowered over the house, the fence, or the lines, off your crew’s plate.' },
      { title: 'The climb nobody wants', body: 'The technical piece past your team. I climb it, you run the ground.' },
    ],
    breadcrumbAreas: 'Coverage',
  },

  // estimate
  estimate: {
    metaTitle: 'Day Rate for Tree Companies | Woodchuckers Contract Climber | Colorado Springs',
    metaDesc:
      'Get a day rate for a contract climb in Colorado Springs. Tree companies: I bring my own gear and climb the piece past your crew. Se habla español.',
    headTitle: 'Get a day rate',
    headIntro:
      'I’m a contract tree climber for tree companies. I bring my own climbing and rigging gear, climb the piece your crew can’t reach, and bring it down. You run the ground.',
    headNote1: 'I price by the day:',
    headNotePrice: '$175–$350 a day',
    headNote2: '. Most climbs run a single day. Your crew keeps the ground, the haul, and the cleanup.',
    headNoteCleanup: '$100',
    headNote3: '. Heads up. I don’t haul debris off-site, so removal is on you or your hauler.',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    calcLenLabel: 'Estimated job length',
    day1: '1 day',
    day2: '2 days',
    calcHint: 'Most climbs run a single day.',
    debrisLabel: 'Debris',
    debrisNone: 'Leave it on site (no charge)',
    debrisCleanup: 'On-site cleanup, cut & pile (+$100)',
    debrisRemoval: 'Full debris removal, hauled off (+$150)',
    calcSub: 'Ballpark only. Firm number once I see the job.',
    fName: 'Your name *',
    fPhone: 'Phone',
    fEmail: 'Email',
    fAddress: 'Job site',
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
    detailsLabel: 'What’s the climb?',
    detailsPh: 'The job, the site, your crew, access, power lines, the deadline. Whatever I should know.',
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
    metaTitle: 'Contract Tree Climber, Booked by the Day | Woodchuckers | Colorado Springs',
    metaDesc:
      'A contract tree climber tree companies book by the day in Colorado Springs. I bring my own gear, climb the piece past your crew, and bring it down. One day, sometimes two. Se habla español.',
    kicker: 'Colorado Springs',
    headTitle: 'I climb the tree your crew won’t',
    heroTitle: ['I climb', 'the tree', 'your crew won’t.'],
    headLede:
      'Book a climber by the day, or two. The section your crew can’t reach, the removal past your team. I climb it, rope it, and bring it down clean. You run the ground.',
    bookLine: 'Call or text for a day rate:',
    ratesTitle: 'Ballpark day rate',
    rateUnit: 'per day',
    rateNote: 'A ballpark, not a fixed quote — every job is different. Call or text and I’ll give you a real number.',
    included: 'Your crew runs the ground, I do the climbing. The removal past your team, the rigging over the house, the section nobody wants. A contract climber with my own gear.',
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
    detailsPh: 'The job, the site, your crew, access, power lines, crane, the deadline. Whatever I should know.',
    requiredNote: '* Your name, plus a phone or email so I can reach you.',
    submit: 'Send the job',
    submitting: 'Sending…',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    // optional Google sign-in, shown above the name/email fields
    verifyPrompt: 'Have a Google account? Verify in one tap so I know it is really you. Totally optional.',
    verifyBtn: 'Verify with Google',
    signInUnverified: 'Google could not verify that email, so just fill in your details below.',
    signedInAs: (name: string, email: string) => `Signed in as ${name} · ${email}`,
    switchAcct: 'Not you? Switch account',
    thanksTitle: (name: string) => `Got it, ${name}.`,
    thanksBody: 'I’ll confirm availability and a firm number. Need it sooner? Call or text',
    errRate: 'Too many requests, slow down. Try again in a minute.',
    errMissing: 'Please give your name and a phone or email.',
    errSave: 'Something broke saving your request. Call or text instead and I’ll get you sorted.',
  },

  // link-in-bio page
  links: {
    metaTitle: 'Woodchuckers | Links',
    tagline: 'Contract Tree Climber · Colorado Springs',
    heroTitle: ['Every way', 'to reach', 'Woodchuckers.'],
    website: 'Visit the website',
    websiteSub: 'woodchuckertrees.com',
    estimate: 'Get a day rate',
    estimateSub: 'For tree companies',
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
  nav: { home: 'Inicio', work: 'Mi Trabajo', areas: 'Zonas', services: 'Servicios', estimate: 'Contráteme' },
  navLabel: 'Principal',
  skip: 'Saltar al contenido',
  callLabel: 'Llamar',
  freeEstimate: 'Ver tarifa por día',
  bookDay: 'Reservar un día',
  footPro: 'Escalador por contrato',
  proLink: '¿Tiene empresa de árboles? Escalo por contrato →',
  seHabla: SE_HABLA,
  langName: { en: 'English', es: 'Español' },
  switchTo: 'View in English',
  servingArea: 'Sirviendo el área de Colorado Springs',
  saveContact: 'Guardar mi número',
  callOrText: 'Llame o escriba sobre la escalada, sin compromiso.',

  services: {
    moreTitle: 'Más servicios',
    perDay: 'por día',
    metaTitle: 'Servicios de Escalada de Árboles por Contrato | Woodchuckers | Colorado Springs',
    metaDesc:
      'Lo que una empresa de árboles puede reservar conmigo por día en Colorado Springs: remociones técnicas, poda de copa, trabajo de tormenta y peligro, aparejo y apoyo con grúa, y escalada por contrato para cuadrillas. Se habla español.',
    ogTitle: 'Servicios de Escalada de Árboles por Contrato',
    eyebrow: 'Para empresas de árboles',
    heroTitle: ['Lo que puede', 'reservar', 'por día.'],
    heroSub:
      'Escalo para empresas de árboles y cuadrillas por todo el Front Range. Elija el trabajo, reciba una tarifa por día, conserve a su cliente y su cuadrilla de tierra.',
    listTitle: 'Servicios',
  },

  blog: {
    metaTitle: 'Notas de Campo | Escalada de Árboles por Contrato | Woodchuckers | Colorado Springs',
    metaDesc:
      'Notas de campo sobre escalada de árboles por contrato: cuándo contratar un escalador, remociones por secciones, tarifas por día, apoyo con grúa y trabajo de tormenta. Respuestas claras para empresas de árboles en Colorado Springs.',
    ogTitle: 'Notas de Campo — Escalada de Árboles por Contrato',
    crumb: 'Notas de campo',
    eyebrow: 'Notas de campo',
    indexTitle: 'Antes de contratar un escalador',
    indexLead:
      'Respuestas claras a lo que las empresas de árboles y cuadrillas preguntan antes de traer un escalador por contrato. Tarifas por día, métodos y cuándo tomar la decisión.',
    covers: 'Qué cubre',
    draftNote:
      'Artículo completo en preparación. ¿Necesita la respuesta para un trabajo real ahora? Llame o escriba y lo hablamos.',
  },

  home: {
    metaTitle: 'Woodchuckers | Escalador de Árboles por Contrato, por Día | Colorado Springs',
    metaDesc:
      'Un escalador de árboles por contrato que las empresas contratan por día en Colorado Springs. Traigo mi propio equipo, escalo la pieza que su cuadrilla no alcanza y la bajo. Un día, a veces dos. Se habla español.',
    heroEyebrow: 'Colorado Springs · Escalador por día',
    heroTitle: ['Equipo a la espalda,', 'subo al árbol,', 'y lo bajo.'],
    heroSub:
      'Un escalador por contrato que las empresas de árboles contratan por día. Usted pone la cuadrilla y la astilladora; yo traigo mi equipo y escalo la pieza que su equipo no alcanza. Un día, a veces dos.',
    ctaEstimate: 'Ver tarifa por día',
    trust: ['Contratado por día', 'Usted maneja el suelo', 'Todo mi propio equipo', 'Se habla español'],
    servicesTitle: 'Los árboles que escalo',
    services: [
      { title: 'Remociones por secciones', body: 'Remociones grandes bajadas en piezas, con cuerda, cuando no hay espacio para tumbarlo.' },
      { title: 'Líderes dañados por tormenta', body: 'Copas rotas, ramas atoradas e inclinados, asegurados arriba en la copa.' },
      { title: 'Aparejo sobre estructuras', body: 'Ramas y madera bajadas sobre la casa, la cerca o los cables, fuera del plato de su cuadrilla.' },
      { title: 'La escalada que nadie quiere', body: 'La pieza técnica más allá de su equipo. Yo la escalo, usted maneja el suelo.' },
    ],
    seeWork: 'Vea el trabajo',
    allServices: 'Todos los servicios',
    hazardTitle: '¿Una escalada más allá de su cuadrilla?',
    hazardLead:
      'Cuando una remoción es más grande o más alta de lo que su equipo puede aparejar con seguridad, llámeme. Llego con mi equipo, la escalo y la bajo. Usted se queda con el trabajo, la cuadrilla de suelo y la limpieza.',
    aboutTitle: 'Solo el escalador',
    aboutLead:
      'Sin camión, sin cuadrilla, sin venta adicional. Llego con una mochila de equipo de escalada y aparejo, escalo el árbol y lo bajo. Segundo año escalando, dueño y operador. Quien cotiza la escalada es quien está en la cuerda.',
    contactTitle: 'Reserve un escalador por el día',
    smsBody: 'Hola, esta es la escalada:',
    smsCta: 'envíeme la escalada →',
    smsNote: '¿Tiene un trabajo? Envíelo.',
    smsButton: 'Enviar el trabajo',
    stepsTitle: 'Cómo funciona',
    steps: [
      { n: '1', title: 'Envíe la escalada', body: 'Llame o escriba el trabajo. Ubicación, tamaño, cuándo. Le devuelvo una tarifa por día, normalmente el mismo día.' },
      { n: '2', title: 'Llego con mi equipo', body: 'Una mochila de equipo de escalada y aparejo. No necesito camión ni cuadrilla.' },
      { n: '3', title: 'Escalo y lo bajo', body: 'Tomo la pieza técnica y la bajo. Su cuadrilla maneja el suelo y la limpieza.' },
    ],
    faqTitle: 'Respuestas claras',
    faqs: [
      { q: '¿Cómo cobra?', a: 'Una tarifa fija por día, $175–$350 según la escalada. La mayoría son de un día, algunas de dos. ¿Una sola pieza difícil? Puede ser por trabajo.' },
      { q: '¿Qué trae?', a: 'Todo con lo que escalo. Arnés, cuerdas y equipo de aparejo, a la espalda. Usted trae la astilladora y la cuadrilla de suelo.' },
      { q: '¿Y el suelo y la limpieza?', a: 'Eso es su cuadrilla. Yo escalo y bajo el árbol; el acarreo, el astillado y la limpieza quedan con usted.' },
      { q: 'Lo que escalo', a: 'Remociones por secciones, líderes dañados por tormenta y aparejo sobre estructuras. La pieza más allá de su equipo.' },
      { q: '¿Quién llega?', a: 'Un escalador, segundo año escalando profesionalmente, dueño y operador. Quien cotiza la escalada es quien está en la cuerda.' },
    ],
  },

  work: {
    metaTitle: 'Mi Trabajo | Woodchuckers Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Escalada por contrato real en Colorado Springs. Remociones por secciones, líderes por tormenta y aparejo a mano para empresas de árboles. Sin fotos de archivo. Se habla español.',
    eyebrow: 'Mi Trabajo',
    heroTitle: ['Escaladas reales.', 'Resultados reales.', 'Sin fotos de archivo.'],
    title: 'Escaladas reales, resultados reales',
    lead: 'Sin fotos de archivo y sin relleno. Ese soy yo arriba del árbol en cada trabajo, con la cuerda. La escalada técnica que su cuadrilla delega.',
    cap1: 'Con cuerda en la copa, en plena escalada.',
    cap2: 'Pinos grandes bajados pieza por pieza.',
    cap3: 'Bajando una rama lejos de los cables eléctricos.',
    videoTitle: 'Vea una escalada',
    videoCap: 'Trabajo real con cuerda, sin ediciones.',
    doTitle: 'Lo que escalo',
    doLead:
      'Soy escalador por contrato para empresas de árboles. Usted pone la cuadrilla y la astilladora; yo traigo mi equipo, tomo la pieza técnica y la bajo. El suelo, el acarreo y la limpieza quedan con su equipo.',
    list: [
      { title: 'Remociones por secciones', body: 'Remociones grandes bajadas en piezas, con cuerda, cuando no hay espacio para tumbarlo.' },
      { title: 'Líderes dañados por tormenta', body: 'Ramas atoradas, copas rotas e inclinados, asegurados arriba en la copa antes de que causen más daño.' },
      { title: 'Aparejo sobre estructuras', body: 'Terrenos estrechos, cercas y ramas sobre la casa o los cables, escalado y bajado a mano.' },
      { title: 'La escalada más allá de su cuadrilla', body: 'La pieza técnica que su equipo no alcanza o no quiere. Yo la escalo; usted maneja el suelo.' },
      { title: 'Un escalador por el día', body: '¿Con poco personal o saturados? Llámeme por el día para mantener su cuadrilla avanzando.' },
    ],
    contactTitle: '¿Le gusta lo que ve?',
  },

  areas: {
    metaTitle: 'Zona de Cobertura | Woodchuckers Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Dónde escala por contrato Woodchuckers. Colorado Springs y los pueblos del condado de El Paso. Empresas de árboles: viajo por la escalada correcta. Se habla español.',
    eyebrow: 'Cobertura',
    heroTitle: ['Cuadrillas del Front Range,', 'pueblo por pueblo,', 'viajo a escalar.'],
    title: 'Dónde escalo',
    lead: 'Un escalador por contrato para empresas de árboles en Colorado Springs y el condado de El Paso. ¿Un trabajo fuera de la zona? Pregunte. Viajo por la escalada correcta.',
    townsTitle: 'Pueblos que cubro',
    expansionTag: 'Llega en septiembre de 2027',
    expansionBody:
      'El Gran Proyecto de Expansión. Llevando la escalada por contrato de Woodchuckers más allá de Colorado. Washington, Oregón y California.',
    contactTitle: '¿Cuadrilla en la zona? Hablemos.',
  },

  town: {
    serviceArea: 'Cobertura',
    titleFor: (name: string) => `Escalador de árboles por contrato en ${name}, Colorado`,
    metaTitleFor: (name: string) => `Escalador de Árboles por Contrato en ${name}, CO | Woodchuckers`,
    metaDescFor: (name: string) =>
      `Escalador de árboles por contrato para empresas en ${name}, Colorado. Traigo mi propio equipo, escalo la pieza que su cuadrilla no alcanza y la bajo. Tarifa por día. Se habla español.`,
    doInTitle: (name: string) => `Árboles que escalo en ${name}`,
    localTitle: 'Un escalador extra, disponible',
    mapTitleFor: (name: string) => `Mapa de la zona de ${name}, CO`,
    contactTitleFor: (name: string) => `¿Cuadrilla en ${name}? Hablemos.`,
    servingFor: (name: string) => `Escalada por contrato en ${name} y el área de Colorado Springs`,
    core: [
      { title: 'Remociones por secciones', body: 'Remociones grandes bajadas en piezas, con cuerda, cuando no hay espacio para tumbarlo.' },
      { title: 'Líderes dañados por tormenta', body: 'Copas rotas, ramas atoradas e inclinados, asegurados arriba en la copa.' },
      { title: 'Aparejo sobre estructuras', body: 'Ramas y madera bajadas sobre la casa, la cerca o los cables, fuera del plato de su cuadrilla.' },
      { title: 'La escalada que nadie quiere', body: 'La pieza técnica más allá de su equipo. Yo la escalo, usted maneja el suelo.' },
    ],
    breadcrumbAreas: 'Cobertura',
  },

  estimate: {
    metaTitle: 'Tarifa por Día para Empresas de Árboles | Woodchuckers Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Vea la tarifa por día de una escalada por contrato en Colorado Springs. Empresas de árboles: traigo mi propio equipo y escalo la pieza que su cuadrilla no alcanza. Se habla español.',
    headTitle: 'Ver la tarifa por día',
    headIntro:
      'Soy escalador de árboles por contrato para empresas. Traigo mi propio equipo de escalada y aparejo, escalo la pieza que su cuadrilla no alcanza y la bajo. Usted maneja el suelo.',
    headNote1: 'Cobro por día:',
    headNotePrice: '$175 a $350 por día',
    headNote2: '. La mayoría de las escaladas son de un día. Su cuadrilla se queda con el suelo, el acarreo y la limpieza.',
    headNoteCleanup: '$100',
    headNote3: '. Aviso. No me llevo los restos del sitio, así que el retiro es cosa suya o de su transportista.',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    calcLenLabel: 'Duración estimada del trabajo',
    day1: '1 día',
    day2: '2 días',
    calcHint: 'La mayoría de las escaladas son de un día.',
    debrisLabel: 'Restos',
    debrisNone: 'Dejarlos en el sitio (sin cargo)',
    debrisCleanup: 'Limpieza en sitio, cortar y amontonar (+$100)',
    debrisRemoval: 'Retiro completo de restos, llevados fuera (+$150)',
    calcSub: 'Solo aproximado. Número firme cuando vea el trabajo.',
    fName: 'Su nombre *',
    fPhone: 'Teléfono',
    fEmail: 'Correo',
    fAddress: 'Sitio del trabajo',
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
    detailsLabel: '¿Cuál es la escalada?',
    detailsPh: 'El trabajo, el sitio, su cuadrilla, acceso, líneas eléctricas, la fecha límite. Lo que deba saber.',
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
    metaTitle: 'Escalador de Árboles por Contrato, por Día | Woodchuckers | Colorado Springs',
    metaDesc:
      'Un escalador de árboles por contrato que las empresas contratan por día en Colorado Springs. Traigo mi propio equipo y escalo la pieza que su cuadrilla no alcanza. Un día, a veces dos. Se habla español.',
    kicker: 'Colorado Springs',
    headTitle: 'Escalo el árbol que su cuadrilla no quiere',
    heroTitle: ['Escalo el árbol', 'que su cuadrilla', 'no quiere.'],
    headLede:
      'Contrate un escalador por día, o dos. La sección que su cuadrilla no alcanza, la remoción más allá de su equipo. Lo escalo, lo aparejo y lo bajo limpio. Usted maneja el suelo.',
    bookLine: 'Llame o escriba para una tarifa por día:',
    ratesTitle: 'Tarifa aproximada por día',
    rateUnit: 'por día',
    rateNote: 'Un aproximado, no un precio fijo — cada trabajo es distinto. Llame o escriba y le doy un número real.',
    included:
      'Su cuadrilla maneja el suelo, yo me encargo de la escalada. La remoción que su equipo no alcanza, el aparejo sobre la casa, la sección que nadie quiere. Escalador por contrato con mi propio equipo.',
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
    detailsPh: 'El trabajo, el sitio, su cuadrilla, acceso, líneas eléctricas, grúa, la fecha límite. Lo que deba saber.',
    requiredNote: '* Su nombre, más un teléfono o correo para poder contactarlo.',
    submit: 'Enviar el trabajo',
    submitting: 'Enviando…',
    seHablaNote: 'Se habla español. Llame o escriba con cualquier pregunta.',
    // inicio de sesión con Google opcional, mostrado sobre los campos de nombre/correo
    verifyPrompt: '¿Tiene cuenta de Google? Verifique en un toque para saber que es usted. Es opcional.',
    verifyBtn: 'Verificar con Google',
    signInUnverified: 'Google no pudo verificar ese correo, así que complete sus datos abajo.',
    signedInAs: (name: string, email: string) => `Sesión iniciada como ${name} · ${email}`,
    switchAcct: '¿No es usted? Cambiar de cuenta',
    thanksTitle: (name: string) => `Listo, ${name}.`,
    thanksBody: 'Confirmaré disponibilidad y un número firme. ¿Lo necesita antes? Llame o escriba',
    errRate: 'Demasiadas solicitudes, despacio. Intente de nuevo en un minuto.',
    errMissing: 'Por favor dé su nombre y un teléfono o correo.',
    errSave: 'Algo falló al guardar su solicitud. Llame o escriba y lo resuelvo.',
  },

  links: {
    metaTitle: 'Woodchuckers | Enlaces',
    tagline: 'Escalador de Árboles por Contrato · Colorado Springs',
    heroTitle: ['Todas las formas', 'de contactar a', 'Woodchuckers.'],
    website: 'Visitar el sitio web',
    websiteSub: 'woodchuckertrees.com',
    estimate: 'Ver la tarifa por día',
    estimateSub: 'Para empresas de árboles',
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
