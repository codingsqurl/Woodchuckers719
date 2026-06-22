// preview-email.ts — render the lead-notification email to a static HTML file so
// the template can be eyeballed in a browser without a Resend key or a live send.
// Writes lead-email-preview.html (gitignored). Run: npm run preview:email
//
// `import './load-env'` MUST come first: importing lib/mail pulls the db layer,
// which opens DATABASE_URL (the dev snapshot) — without env it would default to
// the live filename. We only read; nothing here writes a row or sends mail.
import './load-env'
import { writeFileSync } from 'node:fs'
import { contractEmailHTML } from '../lib/mail'

const html = contractEmailHTML({
  name: 'Marcus — Summit Tree Co.',
  phone: '(719) 555-0182',
  email: 'marcus@summittree.example',
  details:
    "70 ft dead ponderosa leaning over the client's roof in Black Forest — past what my groundie and I can rig safely. Need a climber for the takedown Thursday or Friday. We run the ground and haul.",
  low: 175,
  high: 350,
})

const out = 'lead-email-preview.html'
writeFileSync(out, html)
console.log(`wrote ${out} (${html.length} bytes) — open it in a browser`)
