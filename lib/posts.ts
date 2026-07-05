// posts.ts — the content hub (lead-gen rebuild, chunk 3). Each entry is one
// /blog/[slug] page: real, indexable, SEO-complete, targeting a search question
// someone asks before hiring a contract climber. All five posts ship full
// bodies now; `draft: true` still marks any future stub (outline, no body) so
// the UI can label it honestly until it is fleshed out.
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
    body: [
      {
        heading: 'Reading the tree before the first cut',
        paras: [
          'Every removal decision starts from the ground, before a saw comes out. The lean tells you where the tree wants to go. The weight in the canopy tells you how hard it wants to go there. Wind can push a top past its hinge, and a chinook day can turn a marginal fell into a bad one. The last piece is the drop zone, the actual space the customer is giving you to work with. Add those four up and the tree either fits in the clear ground you have or it does not.',
          'When the numbers do not add up, sectional is the answer. If the lean points at the garage and there is no room to pull it over, or the only open lane is shorter than the tree is tall, forcing the fell means betting the customer’s property on a hinge. A climber takes the same reading and works backward from it. Pieces sized to the space, brought down in the order the tree allows. The read decides the method, and the method decides who you need on site.',
        ],
      },
      {
        heading: 'How rigging brings it down',
        paras: [
          'Sectional removal means the tree comes apart from the top down. The climber sets a block in the tree, an anchored pulley the lowering line runs through, and ties off each piece before cutting it. When the piece comes free it loads the rope instead of falling. The block turns the trunk itself into the lifting frame, so wood that has been standing for decades does the holding while its own top comes off a piece at a time.',
          'The other half of the system is on the ground. Your crew runs the lowering line, usually through a friction device at the base, and controls how fast each piece comes down. Let it run and the piece lands soft in the spot you picked. Lock it off too hard and the whole tree takes a shock load. A good rope man matters as much as a good climber here, which is why a climber for the day works so well. He brings the saw and the rigging skill aloft, and your people already know how to run a rope.',
        ],
      },
      {
        heading: 'When the crane comes in',
        paras: [
          'Rigging works because the spar can take the load. Every piece lowered on a block pulls down on the trunk, and a heavy pick can double its own weight in force when the rope catches it. Most trees handle that fine. Some do not. A dead ponderosa with a hollow butt, a trunk split by storm damage, or wood so big that no reasonable piece is light enough to catch on rope. When the spar cannot be trusted or the pieces cannot be made small enough, rigging off the tree stops being an option.',
          'A crane changes the physics. The piece is held from above before it is ever cut, so the tree never takes the load and nothing has to swing. The climber still goes up, sets the choker, and makes the cut, but the weight rides the crane to the ground instead of the rope to the drop zone. Cranes cost real money and need room to set up, so they are not the default. When the wood is too heavy or the spar too far gone, though, the crane is the plan, and the climber is still the one making it work aloft.',
        ],
      },
      {
        heading: 'One man aloft, your crew below',
        paras: [
          'The arrangement is simple. One contract climber handles everything that happens off the ground. He climbs the tree, reads the wood, sets the blocks, ties the pieces, and makes the cuts. That is the technical slice of the job, the part that takes years on rope to do safely, and it is the only part the day rate covers. He shows up with his own saddle, ropes, and rigging, works the tree top down, and comes back to earth when the spar is on the ground.',
          'Everything else stays with your crew. They run the lowering line, drag brush to the chipper, buck the trunk wood, and haul it off. They load the truck, rake the lawn, and talk to the customer, because it is still your job and your name on it. Nothing about the sectional plan changes who owns the work. It just puts a specialist on the one task your crew cannot cover that day. The climb and the rigging come off your plate, and the rest of the removal runs exactly the way it always has.',
        ],
      },
    ],
    draft: false,
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
    body: [
      {
        heading: 'One flat number instead of a tree count',
        paras: [
          'Per tree pricing sounds fair until two people count the same yard differently. A double stem might be one tree or two. A half dead cottonwood tangled into its neighbor might be one removal or three. The quote turns into a debate about what a tree even is, and that debate tends to happen after the crew is on site and the clock is running. For contract climbing work, that kind of pricing invites friction between the climber and the company that hired him.',
          'A flat day rate cuts all of that out. The number is set before the climber leaves the ground, so the owner can price the whole job with the climbing line already fixed. No haggling at the base of the trunk, no surprise on the invoice, no argument over whether the codominant maple counted twice. Bid the customer however you like. The climbing cost underneath your bid stays one known number, and the current ballpark is listed on the contract climbing page.',
        ],
      },
      {
        heading: 'One day on rope, and when it takes two',
        paras: [
          'A day covers the climbing itself. The climber goes up, rigs what needs rigging, and cuts everything down to pieces the ground crew can move and chip. That is the whole scope, and it runs across as many trees as fit between morning and dark. Three easy removals and a trim, or one big takedown that eats the whole day, either way the rate is the same and the climber keeps cutting until the day is done or the list is.',
          'Some jobs stretch to a second day, and the reasons are predictable. Access is slow, a backyard with one narrow gate and a long carry to the rigging point. The wood is oversized, ponderosa trunk sections too heavy to lower fast. Or the rigging has to run extra conservative because the tree stands over a roof, a line, or a glass sunroom, and every piece comes down small and slow. When one of those shows up in the bid walk, plan for two days up front instead of arguing about the overage later.',
        ],
      },
      {
        heading: 'One nasty piece, one quote',
        paras: [
          'Not every job needs a full day of climbing. Sometimes the crew can handle the whole removal except one piece, a broken top hanging over a roof after a heavy spring snow, a leader cracked over the service drop, one limb nobody on the ground can reach safely. The rest of the tree is work your crew already owns. Paying a full day rate for forty minutes of rope work does not sit right with anyone.',
          'That single technical piece can be quoted per job instead. Send a photo, describe the target under it, and get a number for just that cut and lower. The climber shows up, deals with the one piece the job is stuck on, and hands the tree back to your crew. It keeps small jobs small and saves the day rate for the days that actually need one. No wasted hours on either side of the invoice.',
        ],
      },
      {
        heading: 'The ground work stays yours',
        paras: [
          'The day rate buys a climber, not a full service removal. Groundwork, chipping, haul off, stump grinding, raking the lawn back to clean, all of that stays with the hiring company and its crew. One man comes to the job with a saddle, ropes, and saws. Everything below the rope is yours, the same way it would be if the climber were on your own payroll that day. There is no second truck and no second crew showing up behind him.',
          'That split is what makes the arrangement work. Your crew already runs a chipper, a truck, and a drag line better than any outsider could on unfamiliar equipment. The climber stays in the tree where the specialty is, and the ground moves at the pace your foreman sets. Price your jobs with that in mind. The day rate covers what happens on rope, and everything that hits the ground after that is the part of the job your company was already built to do.',
        ],
      },
    ],
    draft: false,
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
    body: [
      {
        heading: 'When the crane pays its way',
        paras: [
          'Some takedowns are built for a boom. Big wood hanging over a roof, a spar too rotten to trust with a rigging load, a backyard giant where every limb would need a controlled lower. A crane changes the arithmetic on those. Each pick flies out whole and lands in the staging area instead of coming down piece by piece on rope. Hours of rigging turn into minutes of boom time, and the wood never swings over the target at all.',
          'A dead ponderosa leaning over a garage is the clearest case. Rigging off a spar means trusting the spar, and dead or hollow wood gives nothing to trust. With a crane the load goes to the boom, not the tree, so the climber never asks rotten fiber to take a shock load. When the wood is heavy, the targets are close, or the spar cannot carry a rigging load, the crane is worth every hour of its rental.',
        ],
      },
      {
        heading: 'When rope is the cheaper answer',
        paras: [
          'A crane only helps if it can reach the tree. A narrow drive, a soft septic field, a backyard behind two fences, and the boom stays on the truck. Plenty of takedowns also just do not have enough wood in them. A moderate trunk with a workable drop zone comes apart on rope in a morning, and the crane would spend longer setting up than the climb takes. When mobilization costs more than the hours it saves, climb and rig wins on the math alone.',
          'For those jobs a climber for the day is the whole answer. He brings the rigging, your crew runs the ropes and feeds the chipper, and the tree comes down at a flat day rate you knew before the truck left the yard. No crane schedule to wait on, no operator to book, no second mobilization if the weather turns. If the wood is moderate and the access is tight, rope is not the fallback. It is the faster, cheaper method.',
        ],
      },
      {
        heading: 'The crane does not replace the climber',
        paras: [
          'A crane on site does not put the climber out of work. Somebody still has to go up. Every pick starts with a strap set at the right point on the wood, a balance judgment, and a cut placed so the piece lifts clean instead of rolling or splitting out. The climber makes that call from inside the canopy, pick after pick, and he stays tied to the tree, not to the crane hook, whatever the old stories say about riding the ball.',
          'The conversation with the operator matters as much as the saw work. The climber calls out the estimated weight of each pick before the cut so the operator knows what the boom is about to take. Guess heavy and the lift stalls. Guess light and the boom takes a jolt it was not set for. A climber with hours under a boom reads wood weight well and keeps every pick inside what the setup can handle. That judgment aloft is what your crew is renting for the day, crane or no crane.',
        ],
      },
      {
        heading: 'Walk the site before the crane rolls',
        paras: [
          'The worst crane day is the one where the machine shows up and cannot work. Walk the site first. Check the setup room within reach of the tree. Check the footing under the outriggers, because solid ground beats a soft lawn over a buried tank or a fresh utility trench. Check for overhead lines in the swing path between the tree and the landing zone. Any one of those can kill the plan after the mobilization is already booked.',
          'Then plan the picks and the yard. A rough weight on the biggest pieces tells you whether the quoted crane can make the reach, because capacity falls fast as the boom stretches out. Decide where the trucks and the chipper stage so each pick lands near the work instead of across the property. A contract climber who has worked under a boom can walk that site with you and flag the problems while they are still cheap to fix. The crane day runs on what got checked before it.',
        ],
      },
    ],
    draft: false,
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
    body: [
      {
        heading: 'Read the leaner before the saw comes out',
        paras: [
          'A chinook wind or a heavy wet spring snow leaves trees leaning where they never grew. A leaner resting on a neighbor tree or a roof is not standing on its roots anymore. It is a loaded spring. The trunk, the limbs holding it up, and the wood it rests on are all carrying force in directions nobody can see from the driveway. Cut the wrong fiber and that force releases all at once, toward the saw and the man holding it.',
          'The read comes first. Which way the load wants to move, what is holding it, what lets go when the first cut opens. A climber who works storm wood makes that read from a rope in a sound tree next door, not from under the lean. Each cut is planned so the wood shifts away from him and away from whatever it is resting on. If your crew is standing around a leaner debating where to start, that debate is the sign the job belongs to a climber.',
        ],
      },
      {
        heading: 'Snapped tops and hung limbs',
        paras: [
          'The wind snaps a leader and the top does not always come down. It hangs in the canopy, caught on a few small branches, over the driveway or the service drop or the spot where your groundman stacks brush. A hung limb can sit there for a week or let go the next time the breeze moves it. Nobody can tell which from the ground. Every hour it stays up there, it is a load with no rigging on it over a work area.',
          'A climber puts the rigging on before anything moves. He gets above or beside the hanger, ties it off to a sound point, and only then makes the cut that frees it. The piece swings onto the rope instead of falling, and the ground crew lowers it to a clear spot at whatever speed they choose. A snapped top comes down the same way, cut into lengths the rope can hold. Controlled from the first cut to the ground, not dropped and hoped for.',
        ],
      },
      {
        heading: 'The trouble with pulling from the ground',
        paras: [
          'Pulling a hanger down with a throwline or a truck feels like the safe play because nobody leaves the ground. The problem is that a pull is a guess. Nobody knows what is actually holding the piece, so nobody knows what direction it takes when it lets go. It can roll off its catch and fall somewhere else entirely. It can whip back along the line toward the man pulling it. It can shake the whole broken top loose and bring that down too.',
          'Rigged work removes the guess. The piece is tied before it is free, so the release point and the landing spot are chosen, not discovered. That is the whole difference. A pull spends its control before the wood moves and has none left after. A rope set from above keeps control through the entire ride down. When the hanger is over a roof, a line, or a spot your crew has to keep working under, guessing is the expensive option.',
        ],
      },
      {
        heading: 'When every crew in town is buried',
        paras: [
          'After a big blow the phone does not stop. Every tree company in town is slammed at the same time, and the jobs that pile up are exactly the ones with hazards aloft. Your crew can move brush and buck downed trunks all day, but each hung limb and loaded leaner stalls the schedule until someone qualified goes up. If your climber is the bottleneck, storm week is when it shows.',
          'A contract climber for the day breaks that bottleneck. He shows up, ropes in on the hazard climbs, and your crew runs the ground work it already knows while the technical pieces come down on rigging. One flat day rate, no new hire, no sending a groundman up under pressure. The dangerous jobs come off the board while the rest of the schedule keeps moving. When storm work stacks up, the fastest way through it is a climber who slots into the crew you already have.',
        ],
      },
    ],
    draft: false,
    imageAlt: 'A storm-snapped tree leader hung over a structure, a hazard for a dedicated climber.',
  },
]

// Spanish mirror. Same slugs as postsEN so the URLs pair for hreflang. Full
// bodies shipped for all five posts, mirrored section by section from EN.
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
    body: [
      {
        heading: 'Leer el árbol antes del primer corte',
        paras: [
          'Cada remoción se decide desde el suelo, antes de que salga una motosierra. La inclinación le dice hacia dónde quiere irse el árbol. El peso de la copa le dice con cuánta fuerza quiere irse. El viento puede empujar la punta más allá de la bisagra, y un día de viento chinook puede convertir una tala apretada en una mala tala. La última pieza es la zona de caída, el espacio real que el cliente le está dando para trabajar. Sume esos cuatro factores y el árbol cabe en el terreno despejado que tiene o no cabe.',
          'Cuando la cuenta no sale, la respuesta es por secciones. Si la inclinación apunta a la cochera y no hay espacio para jalarlo hacia el otro lado, o el único carril abierto es más corto que la altura del árbol, forzar la tala es apostar la propiedad del cliente a una bisagra. Un escalador toma la misma lectura y trabaja al revés desde ella. Piezas del tamaño del espacio disponible, bajadas en el orden que el árbol permite. La lectura decide el método, y el método decide a quién necesita en la obra.',
        ],
      },
      {
        heading: 'Cómo funciona el aparejo',
        paras: [
          'La remoción por secciones significa que el árbol se desarma de arriba hacia abajo. El escalador instala una polea anclada en el árbol, por la que corre la línea de descenso, y amarra cada pieza antes de cortarla. Cuando la pieza se suelta, carga la cuerda en lugar de caer. La polea convierte al propio tronco en la estructura de carga, de modo que la madera que lleva décadas parada sostiene el peso mientras su propia copa baja pieza por pieza.',
          'La otra mitad del sistema está en el suelo. Su cuadrilla corre la línea de descenso, normalmente por un dispositivo de fricción en la base, y controla la velocidad con que baja cada pieza. Déjela correr y la pieza aterriza suave en el punto que usted eligió. Frénela en seco y todo el árbol recibe carga de golpe. Un buen hombre de cuerda importa tanto como un buen escalador, y por eso funciona tan bien un escalador por el día. Él sube con la motosierra y la habilidad de aparejar, y su gente ya sabe correr una cuerda.',
        ],
      },
      {
        heading: 'Cuándo entra la grúa',
        paras: [
          'El aparejo funciona porque el tronco aguanta la carga. Cada pieza descendida por la polea jala el tronco hacia abajo, y una pieza pesada puede duplicar su propio peso en fuerza cuando la cuerda la atrapa. La mayoría de los árboles lo aguantan sin problema. Algunos no. Una ponderosa muerta con la base hueca, un tronco rajado por una tormenta, o madera tan gruesa que ninguna pieza razonable queda lo bastante ligera para bajarla con cuerda. Cuando no se puede confiar en el tronco o las piezas no se pueden hacer lo bastante chicas, aparejar desde el árbol deja de ser opción.',
          'Una grúa cambia la física. La pieza queda sostenida desde arriba antes del corte, así que el árbol nunca recibe la carga y nada tiene que balancearse. El escalador sube igual, coloca el estrobo y hace el corte, pero el peso viaja por la grúa hasta el suelo en lugar de por la cuerda hasta la zona de caída. Las grúas cuestan y necesitan espacio para armarse, así que no son la opción por defecto. Pero cuando la madera pesa demasiado o el tronco ya no sirve, la grúa es el plan, y el escalador sigue siendo quien lo hace funcionar allá arriba.',
        ],
      },
      {
        heading: 'Un hombre arriba, su cuadrilla abajo',
        paras: [
          'El arreglo es simple. Un escalador por contrato se encarga de todo lo que pasa fuera del suelo. Sube el árbol, lee la madera, instala las poleas, amarra las piezas y hace los cortes. Esa es la parte técnica del trabajo, la que toma años de cuerda para hacerse con seguridad, y es lo único que cubre la tarifa por día. Llega con su propia silla, sus cuerdas y su aparejo, trabaja el árbol de arriba hacia abajo, y vuelve al suelo cuando el tronco ya está abajo.',
          'Todo lo demás queda con su cuadrilla. Ellos corren la línea de descenso, arrastran la rama al triturador, trozan la madera del tronco y la acarrean. Cargan la troca, rastrillan el pasto y hablan con el cliente, porque el trabajo sigue siendo suyo y lleva su nombre. Nada del plan por secciones cambia quién es dueño del trabajo. Solo pone a un especialista en la única tarea que su cuadrilla no puede cubrir ese día. La escalada y el aparejo salen de su lista, y el resto de la remoción corre exactamente como siempre.',
        ],
      },
    ],
    draft: false,
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
    body: [
      {
        heading: 'Un solo número plano en vez de contar árboles',
        paras: [
          'El precio por árbol suena justo hasta que dos personas cuentan el mismo patio de forma distinta. Un tronco doble puede ser un árbol o dos. Un álamo medio muerto enredado en su vecino puede ser un derribo o tres. La cotización se convierte en un debate sobre qué cuenta como árbol, y ese debate suele darse cuando la cuadrilla ya está en el sitio y el reloj corre. Para el trabajo de escalada por contrato, ese tipo de precio invita fricción entre el escalador y la compañía que lo contrató.',
          'Una tarifa por día plana corta todo eso. El número queda fijo antes de que el escalador deje el suelo, así el dueño puede cotizar el trabajo completo con la línea de escalada ya cerrada. Sin regateos al pie del tronco, sin sorpresas en la factura, sin discutir si el arce de doble líder contó dos veces. Cotice a su cliente como usted quiera. El costo de escalada debajo de su oferta se queda en un solo número conocido, y la página de escalada por contrato muestra el rango actual.',
        ],
      },
      {
        heading: 'Un día en cuerda, y cuándo se vuelve dos',
        paras: [
          'Un día cubre la escalada en sí. El escalador sube, apareja lo que necesita aparejo y corta todo hasta dejar piezas que la cuadrilla de tierra puede mover y astillar. Ese es todo el alcance, y corre por tantos árboles como quepan entre la mañana y la tarde. Tres derribos fáciles y una poda, o un solo árbol grande que se come el día entero, de cualquier forma la tarifa es la misma y el escalador sigue cortando hasta que se acaba el día o se acaba la lista.',
          'Algunos trabajos se estiran a un segundo día, y las razones son predecibles. El acceso es lento, un patio trasero con una sola puerta angosta y un acarreo largo hasta el punto de aparejo. La madera es demasiado grande, secciones de tronco de ponderosa muy pesadas para bajar rápido. O el aparejo tiene que correr muy conservador porque el árbol está sobre un techo, una línea eléctrica o un ventanal, y cada pieza baja pequeña y despacio. Cuando algo de eso aparece al caminar el trabajo, planee dos días desde el principio en vez de pelear el excedente después.',
        ],
      },
      {
        heading: 'Una pieza fea, una cotización',
        paras: [
          'No todo trabajo necesita un día completo de escalada. A veces la cuadrilla puede con todo el derribo menos una pieza, una punta quebrada colgando sobre un techo después de una nevada pesada de primavera, un líder rajado sobre la acometida, una rama que nadie puede alcanzar seguro desde el suelo. El resto del árbol es trabajo que su cuadrilla ya domina. Pagar una tarifa por día completa por cuarenta minutos de trabajo en cuerda no le cuadra a nadie.',
          'Esa sola pieza técnica se puede cotizar por trabajo. Mande una foto, describa lo que hay debajo, y reciba un número por ese corte y descenso nada más. El escalador llega, resuelve la pieza que tiene atorado el trabajo, y le regresa el árbol a su cuadrilla. Así los trabajos chicos se quedan chicos y la tarifa por día se guarda para los días que de verdad la necesitan. Sin horas desperdiciadas de ningún lado de la factura.',
        ],
      },
      {
        heading: 'El trabajo de tierra sigue siendo suyo',
        paras: [
          'La tarifa por día compra un escalador, no un servicio completo de derribo. El trabajo de tierra, el astillado, el acarreo, el destoconado, dejar el pasto limpio, todo eso queda con la compañía que contrata y su cuadrilla. Un solo hombre llega al trabajo con silla, cuerdas y motosierras. Todo lo que queda debajo de la cuerda es suyo, igual que si el escalador estuviera en su propia nómina ese día. No hay una segunda troca ni una segunda cuadrilla llegando detrás de él.',
          'Esa división es lo que hace que el arreglo funcione. Su cuadrilla ya maneja la astilladora, la troca y el arrastre mejor que cualquier persona de fuera en equipo ajeno. El escalador se queda en el árbol, donde está la especialidad, y la tierra se mueve al paso que marca su capataz. Cotice sus trabajos con eso en mente. La tarifa por día cubre lo que pasa en la cuerda, y todo lo que toca el suelo después es la parte del trabajo para la que su compañía ya estaba hecha.',
        ],
      },
    ],
    draft: false,
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
    body: [
      {
        heading: 'Cuando la grúa se paga sola',
        paras: [
          'Hay talas hechas para una pluma. Madera gruesa colgando sobre un techo, un tronco demasiado podrido para confiarle una carga de aparejo, un gigante de patio donde cada rama pediría un descenso con cuerda. La grúa cambia la cuenta en esos trabajos. Cada carga sale volando entera y aterriza en la zona de acopio en vez de bajar pieza por pieza con cuerda. Horas de aparejar se vuelven minutos de pluma, y la madera nunca se balancea sobre el objetivo.',
          'Una ponderosa muerta inclinada sobre una cochera es el caso más claro. Aparejar desde un tronco significa confiar en ese tronco, y la madera muerta o hueca no da nada en qué confiar. Con grúa el peso lo toma la pluma, no el árbol, así que el escalador nunca le pide a fibra podrida que aguante una carga de golpe. Cuando la madera es pesada, los objetivos están cerca o el tronco no soporta un aparejo, la grúa vale cada hora de su renta.',
        ],
      },
      {
        heading: 'Cuando la cuerda sale más barata',
        paras: [
          'Una grúa solo sirve si puede llegar al árbol. Una entrada angosta, un campo séptico blando, un patio trasero detrás de dos cercas, y la pluma se queda en el camión. Muchas talas tampoco tienen suficiente madera para justificarla. Un tronco mediano con una zona de caída decente se desarma con cuerda en una mañana, y la grúa tardaría más en montarse de lo que dura la escalada. Cuando movilizarla cuesta más que las horas que ahorra, escalar y aparejar gana por pura cuenta.',
          'Para esos trabajos, un escalador por contrato es la respuesta completa. Él trae el aparejo, su cuadrilla maneja las cuerdas y alimenta la chipeadora, y el árbol baja por una tarifa por día que usted conocía antes de que la troca saliera del patio. Sin agenda de grúa que esperar, sin operador que reservar, sin segunda movilización si el clima se voltea. Si la madera es mediana y el acceso está apretado, la cuerda no es el plan de respaldo. Es el método más rápido y más barato.',
        ],
      },
      {
        heading: 'La grúa no sustituye al escalador',
        paras: [
          'Tener grúa en el sitio no deja al escalador sin trabajo. Alguien tiene que subir de todos modos. Cada carga empieza con una eslinga puesta en el punto correcto de la madera, un juicio de balance y un corte colocado para que la pieza se levante limpia en vez de rodar o rajarse. El escalador toma esa decisión desde adentro de la copa, carga tras carga, y se mantiene amarrado al árbol, no al gancho de la grúa, digan lo que digan las viejas historias de subirse a la bola.',
          'La comunicación con el operador pesa tanto como el trabajo de motosierra. El escalador canta el peso estimado de cada carga antes del corte para que el operador sepa lo que la pluma va a recibir. Calcule de más y el levante se atora. Calcule de menos y la pluma recibe un golpe para el que no estaba puesta. Un escalador con horas bajo pluma lee bien el peso de la madera y mantiene cada carga dentro de lo que aguanta el montaje. Ese juicio en las alturas es lo que su cuadrilla está rentando por el día, con grúa o sin ella.',
        ],
      },
      {
        heading: 'Camine el sitio antes de que llegue la grúa',
        paras: [
          'El peor día de grúa es cuando la máquina llega y no puede trabajar. Camine el sitio primero. Revise el espacio de montaje al alcance del árbol. Revise el piso bajo los estabilizadores, porque el terreno firme le gana a un pasto blando sobre un tanque enterrado o una zanja fresca. Revise las líneas eléctricas en la ruta de giro entre el árbol y la zona de descarga. Cualquiera de esas cosas puede matar el plan cuando la movilización ya está apartada.',
          'Después planee las cargas y el patio. Un peso aproximado de las piezas más grandes le dice si la grúa cotizada alcanza, porque la capacidad cae rápido conforme la pluma se estira. Decida dónde se acomodan los camiones y la chipeadora para que cada carga aterrice cerca del trabajo y no al otro lado de la propiedad. Un escalador por contrato que ya ha trabajado bajo pluma puede caminar ese sitio con usted y señalar los problemas cuando todavía salen baratos. El día de grúa corre sobre lo que se revisó antes.',
        ],
      },
    ],
    draft: false,
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
    body: [
      {
        heading: 'Leer el inclinado antes de sacar la motosierra',
        paras: [
          'Un viento chinook o una nevada pesada de primavera deja árboles recargados donde nunca crecieron. Un inclinado descansando sobre otro árbol o sobre un techo ya no se sostiene de sus raíces. Es un resorte cargado. El tronco, las ramas que lo detienen y la madera donde descansa cargan fuerza en direcciones que nadie ve desde la banqueta. Corte la fibra equivocada y esa fuerza se suelta de golpe, hacia la motosierra y hacia el hombre que la trae.',
          'Primero viene la lectura. Hacia dónde quiere moverse la carga, qué la está deteniendo, qué se suelta cuando abre el primer corte. Un escalador que trabaja madera de tormenta hace esa lectura desde una cuerda en un árbol sano de al lado, no debajo de la inclinación. Cada corte se planea para que la madera se mueva lejos de él y lejos de lo que tiene debajo. Si su cuadrilla está parada alrededor de un inclinado discutiendo por dónde empezar, esa discusión es la señal de que el trabajo es para un escalador.',
        ],
      },
      {
        heading: 'Puntas quebradas y ramas colgadas',
        paras: [
          'El viento quiebra una punta y no siempre cae. Se queda colgada en la copa, atorada en unas cuantas ramas, sobre la entrada, sobre la acometida eléctrica o sobre el punto donde su hombre de tierra apila la rama. Una rama colgada puede aguantar una semana o soltarse con la siguiente brisa. Desde el suelo nadie sabe cuál de las dos. Cada hora que sigue allá arriba es una carga sin aparejo encima de una zona de trabajo.',
          'Un escalador pone el aparejo antes de que nada se mueva. Se coloca arriba o a un lado de la rama colgada, la amarra a un punto sano y solo entonces hace el corte que la libera. La pieza se columpia sobre la cuerda en vez de caer, y la cuadrilla de tierra la baja a un punto despejado a la velocidad que elija. Una punta quebrada baja igual, cortada en tramos que la cuerda aguanta. Con control desde el primer corte hasta el suelo, no soltada a ver dónde cae.',
        ],
      },
      {
        heading: 'El problema de jalar desde el suelo',
        paras: [
          'Jalar una rama colgada con una línea o con la troca parece la jugada segura porque nadie deja el suelo. El problema es que un jalón es una adivinanza. Nadie sabe qué está deteniendo la pieza en realidad, así que nadie sabe qué dirección toma cuando se suelta. Puede rodar de donde está atorada y caer en otro lado por completo. Puede regresarse como látigo por la línea hacia el hombre que jala. Puede sacudir toda la punta quebrada y tirarla también.',
          'El trabajo aparejado quita la adivinanza. La pieza está amarrada antes de estar libre, así que el punto donde se suelta y la zona de caída se eligen, no se descubren. Esa es toda la diferencia. Un jalón gasta su control antes de que la madera se mueva y no le queda nada después. Una cuerda puesta desde arriba mantiene el control durante toda la bajada. Cuando la rama cuelga sobre un techo, una línea eléctrica o un punto donde su cuadrilla tiene que seguir trabajando, adivinar es la opción cara.',
        ],
      },
      {
        heading: 'Cuando todas las cuadrillas andan saturadas',
        paras: [
          'Después de un ventarrón el teléfono no para. Todas las compañías de árboles del pueblo están saturadas al mismo tiempo, y los trabajos que se amontonan son justo los que traen peligros en altura. Su cuadrilla puede mover rama y trozar troncos caídos todo el día, pero cada rama colgada y cada inclinado cargado detiene la agenda hasta que alguien calificado sube. Si su escalador es el cuello de botella, la semana de tormenta es cuando se nota.',
          'Un escalador por contrato por el día rompe ese cuello de botella. Llega, se amarra en las escaladas de peligro, y su cuadrilla corre el trabajo de tierra que ya conoce mientras las piezas técnicas bajan con aparejo. Una tarifa por día plana, sin contratación nueva, sin subir a un hombre de tierra bajo presión. Los trabajos peligrosos salen de la pizarra mientras el resto de la agenda sigue avanzando. Cuando el trabajo de tormenta se amontona, la salida más rápida es un escalador que entra a la cuadrilla que usted ya tiene.',
        ],
      },
    ],
    draft: false,
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
