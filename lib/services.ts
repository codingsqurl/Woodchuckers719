// services.ts — the B2B service pages (lead-gen rebuild). Each entry is one
// /services/[slug] page targeting its own keyword cluster, for tree companies
// and crews hiring KING as a contract day-climber. Bilingual: servicesEN at the
// root, servicesES under /es. Slugs are SHARED across locales so the URLs pair
// (/services/x ↔ /es/services/x) for hreflang and the sitemap.
//
// Honesty rails (see DESIGN.md + credentials notes): KING is owner-operated,
// second year climbing professionally, owns climbing gear plus some rigging,
// does NOT own a crane, and is NOT separately insured/certified. Copy never
// claims a crane, certification, or insurance. Crane work = climbing to the
// client's crane; insurance/liability copy is left as a TODO for KING to fill
// with his real arrangement.

import type { Locale } from './i18n'

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
    priceNote: 'A ballpark day rate, billed by the day. Most sectional removals are a day, some run two.',
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
    priceNote: 'A ballpark day rate, billed by the day. Most prunes are a single day.',
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
    priceNote: 'The same ballpark day rate. One urgent single piece can be per-job. Call or text and I get back the same day when I can.',
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
    priceNote: 'A ballpark day rate, billed by the day.',
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
    priceNote: 'A ballpark day rate, billed by the day. One day, sometimes two. A single tricky piece can be per-job.',
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

// Spanish mirror. Same shape, same slugs, same honesty rails (no crane, no
// insured/certified claim, second year, owns climbing gear + some rigging).
// Formal "usted", matching the rest of the site's Spanish.
const servicesES: Service[] = [
  {
    slug: 'technical-removals',
    metaTitle: 'Remociones Técnicas y por Secciones | Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Escalador por contrato para empresas de árboles en remociones técnicas y por secciones en Colorado Springs. Subo el fuste y lo bajo en piezas cuando no hay zona de caída. Tarifa por día. Se habla español.',
    ogTitle: 'Remociones Técnicas y por Secciones — Escalador por Contrato',
    serviceType: 'Remoción de árboles por secciones',
    eyebrow: 'Para empresas de árboles',
    heroTitle: ['Remociones', 'técnicas por', 'secciones.'],
    lede: 'La remoción sin zona de caída. La subo y la bajo en piezas, con cuerda y descenso controlado, para que su cuadrilla nunca fuerce una tala que no cabe.',
    whatTitle: 'Qué es',
    what: 'Cuando un árbol es demasiado grande, demasiado seco o está muy encajonado para talarlo, baja en secciones controladas. Subo el fuste, monto el aparejo y bajo cada pieza a su cuadrilla de tierra. Usted se queda con la madera, el acarreo y la limpieza.',
    whenTitle: 'Cuándo me llama',
    when: [
      'Sin zona de caída segura, con casa, cerca o líneas en medio',
      'Madera seca o hueca que no quiere someter a carga de golpe',
      'Un fuste más alto de lo que alcanza su canasta',
      'A su cuadrilla le falta el escalador ese día',
    ],
    priceNote:
      'Una tarifa aproximada por día, facturada por día. La mayoría de las remociones por secciones son de un día, algunas llevan dos.',
    faqs: [
      {
        q: '¿Trae usted el aparejo?',
        a: 'Traigo mi equipo de escalada y algo de aparejo. Para descensos pesados usamos sus poleas y su cuadrilla en tierra.',
      },
      {
        q: '¿Quién acarrea la madera?',
        a: 'Su cuadrilla. Yo subo y la bajo en piezas; el acarreo, el triturado y la limpieza quedan con usted.',
      },
    ],
    related: ['rigging-crane-assist', 'storm-hazard-work', 'contract-climbing-for-companies'],
    imageAlt:
      'Escalador por contrato con cuerda en un fuste alto, bajando una sección de pino a la cuadrilla de tierra en una remoción en Colorado Springs.',
  },
  {
    slug: 'large-tree-pruning',
    metaTitle: 'Poda de Árboles Grandes y de Copa | Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Escalador por contrato para trabajo de copa más allá de su canasta en Colorado Springs. Desramado de seco, aclareo y poda de despeje, escalado a mano en coníferas y árboles de hoja grande. Tarifa por día. Se habla español.',
    ogTitle: 'Poda de Árboles Grandes y de Copa — Escalador por Contrato',
    serviceType: 'Poda de árboles',
    eyebrow: 'Para empresas de árboles',
    heroTitle: ['Poda de', 'copa,', 'allá arriba.'],
    lede: 'El trabajo de copa más allá de su canasta. Subo a la copa y hago los cortes a mano, limpios y a especificación, en los árboles que su cuadrilla no alcanza desde el suelo.',
    whatTitle: 'Qué es',
    what: 'Desramado de seco, aclareo de copa, poda de despeje y reducción de peso en punta, arriba en la copa de coníferas y árboles de hoja grande. Escalado a mano, cortes correctos en el cuello de la rama, sin espolones en un árbol que se queda.',
    whenTitle: 'Cuándo me llama',
    when: [
      'Trabajo de copa por encima del alcance de la canasta',
      'Seco o despeje sobre una estructura',
      'Una poda que necesita escalador, no plataforma',
      'Sobrecarga cuando su propio escalador está ocupado',
    ],
    priceNote: 'Una tarifa aproximada por día, facturada por día. La mayoría de las podas son de un solo día.',
    faqs: [
      {
        q: '¿Con espolones o sin espolones?',
        a: 'Sin espolones en un árbol que se queda. Subo con cuerda y sobre las ramas para no herir el árbol en una poda.',
      },
      {
        q: '¿Hace usted la limpieza?',
        a: 'Su cuadrilla maneja el suelo y la limpieza. Yo hago los cortes arriba.',
      },
    ],
    related: ['technical-removals', 'storm-hazard-work', 'contract-climbing-for-companies'],
    imageAlt:
      'Escalador por contrato en lo alto de una copa frondosa haciendo un corte de poda a mano en un árbol grande en Colorado Springs.',
  },
  {
    slug: 'storm-hazard-work',
    metaTitle:
      'Daño por Tormenta y Árboles Peligrosos | Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Escalador por contrato para trabajo de tormenta y peligro en Colorado Springs. Puntas quebradas, ramas colgadas e inclinados bajados con control por un escalador dedicado. Tarifa por día, el mismo día cuando puedo. Se habla español.',
    ogTitle: 'Trabajo de Tormenta y Peligro — Escalador por Contrato',
    serviceType: 'Remoción de árboles peligrosos',
    eyebrow: 'Para empresas de árboles',
    heroTitle: ['Escaladas', 'de tormenta', 'y peligro.'],
    lede: 'Puntas quebradas, ramas colgadas e inclinados. Las escaladas inestables tras una tormenta en las que su cuadrilla quiere un escalador dedicado.',
    whatTitle: 'Qué es',
    what: 'Ramas colgadas, líderes partidos, horquetas abiertas e inclinados de tormenta asegurados desde arriba en el árbol. Leo la carga, monto el aparejo y bajo el peligro con control en vez de jalarlo desde el suelo.',
    whenTitle: 'Cuándo me llama',
    when: [
      'Ramas colgadas y puntas quebradas tras viento o nieve',
      'Un inclinado cargado sobre una estructura',
      'Daño de nieve pesada de primavera en la copa',
      'Un peligro que su cuadrilla no escala libre',
    ],
    priceNote:
      'La misma tarifa aproximada por día. Una sola pieza urgente puede ser por trabajo. Llame o escriba y le respondo el mismo día cuando puedo.',
    faqs: [
      {
        q: '¿Qué tan rápido puede venir?',
        a: 'Llame o escriba el trabajo. Para tormenta le respondo el mismo día cuando puedo y reservo la fecha más próxima que funcione.',
      },
      {
        q: '¿Hay tarifa de emergencia?',
        a: 'La misma tarifa aproximada por día. Una sola pieza urgente por sí sola se puede cotizar por trabajo.',
      },
    ],
    related: ['technical-removals', 'rigging-crane-assist', 'contract-climbing-for-companies'],
    imageAlt:
      'Escalador por contrato con cuerda en un árbol dañado por tormenta, bajando un líder quebrado lejos de una estructura en Colorado Springs.',
  },
  {
    slug: 'rigging-crane-assist',
    metaTitle: 'Aparejo y Apoyo con Grúa | Escalador por Contrato | Colorado Springs',
    metaDesc:
      'Escalador por contrato que monta aparejo sobre estructuras y se amarra en talas asistidas con grúa en Colorado Springs. Usted maneja la grúa y el suelo; yo soy el escalador que arma las cargas y hace los cortes. Tarifa por día. Se habla español.',
    ogTitle: 'Aparejo y Apoyo con Grúa — Escalador por Contrato',
    serviceType: 'Aparejo de árboles',
    eyebrow: 'Para empresas de árboles',
    heroTitle: ['Aparejo', 'y apoyo', 'con grúa.'],
    lede: 'El escalador al otro extremo de la línea. Monto el aparejo sobre la casa y me amarro a las cargas de su grúa para que la madera baje limpia.',
    whatTitle: 'Qué es',
    what: 'Remociones con aparejo sobre estructuras, cercas y líneas, y trabajo como el escalador en talas asistidas con grúa: coloco los estrobos, hago los cortes y guío las cargas. Usted trae la grúa y el operador y maneja el suelo; yo soy el que está en el árbol.',
    whenTitle: 'Cuándo me llama',
    when: [
      'Madera que hay que bajar sobre una estructura',
      'Una tala con grúa que necesita escalador para armar las cargas',
      'Aparejo apretado que su cuadrilla prefiere ceder',
      'Un segundo escalador con experiencia para un día grande',
    ],
    priceNote: 'Una tarifa aproximada por día, facturada por día.',
    faqs: [
      {
        q: '¿Tiene usted grúa?',
        a: 'No. Usted trae la grúa y el operador. Yo soy el escalador que arma las cargas, hace los cortes y monta el resto del aparejo.',
      },
      {
        q: '¿De quién es el equipo de aparejo?',
        a: 'Traigo mi equipo de escalada y algo de aparejo. Las poleas pesadas y los descensores suelen ser suyos.',
      },
    ],
    related: ['technical-removals', 'storm-hazard-work', 'contract-climbing-for-companies'],
    imageAlt:
      'Escalador por contrato amarrado sobre una casa, montando una línea de aparejo en una remoción junto a una cuadrilla de tierra en Colorado Springs.',
  },
  {
    slug: 'contract-climbing-for-companies',
    metaTitle:
      'Escalador de Árboles por Contrato por Día | Empresas de Árboles | Colorado Springs',
    metaDesc:
      'Reserve un escalador de árboles por contrato por día en Colorado Springs. Para empresas de árboles a las que les falta un escalador o enfrentan una escalada más allá de su cuadrilla. Traigo mi propio equipo; usted se queda con el cliente y el suelo. Se habla español.',
    ogTitle: 'Escalador de Árboles por Contrato, por Día',
    serviceType: 'Escalada de árboles por contrato',
    eyebrow: 'Para empresas de árboles',
    heroTitle: ['Un escalador', 'para su cuadrilla,', 'por día.'],
    lede: '¿Le falta un escalador o enfrenta una escalada más allá de su equipo? Resérveme por un día, a veces dos. Llego con mi equipo y subo la pieza que su cuadrilla no puede.',
    whatTitle: 'Qué es',
    what: 'Subcontrato con empresas de árboles y cuadrillas como el escalador: remociones, poda, trabajo de tormenta y aparejo, por una tarifa aproximada por día. Usted se queda con el cliente, la cuadrilla de tierra y la limpieza; yo pongo la escalada.',
    whenTitle: 'Cuándo me llama',
    when: [
      'Su escalador está ausente, ocupado, o no tiene uno',
      'Una tala más allá de la experiencia de su cuadrilla',
      'Una agenda saturada que necesita despejar',
      'Una pieza técnica única que no vale una contratación',
    ],
    priceNote:
      'Una tarifa aproximada por día, facturada por día. Un día, a veces dos. Una sola pieza difícil puede ser por trabajo.',
    faqs: [
      {
        q: '¿Cómo lo reservo?',
        a: 'Llame o escriba el trabajo: ubicación, tamaño y cuándo. Le devuelvo una tarifa por día, normalmente el mismo día.',
      },
      // TODO(king): mismo punto que en inglés — agregue aquí su arreglo real de
      // seguro / responsabilidad. NO afirme estar asegurado ni certificado.
      {
        q: '¿Qué estoy contratando?',
        a: 'Un escalador, dueño-operador, en su segundo año escalando profesionalmente, con mi propio equipo de escalada y aparejo. La persona que cotiza la escalada es la que está en la cuerda.',
      },
    ],
    related: [
      'technical-removals',
      'large-tree-pruning',
      'storm-hazard-work',
      'rigging-crane-assist',
    ],
    imageAlt:
      'Escalador por contrato llegando a un trabajo con una mochila de equipo de escalada y aparejo para escalar para una empresa de árboles en Colorado Springs.',
  },
]

const byLocale: Record<Locale, Service[]> = { en: servicesEN, es: servicesES }

export function serviceList(locale: Locale = 'en'): Service[] {
  return byLocale[locale]
}

export function serviceBySlug(slug: string, locale: Locale = 'en'): Service | undefined {
  return byLocale[locale].find((s) => s.slug === slug)
}
