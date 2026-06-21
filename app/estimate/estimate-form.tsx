'use client'

// The estimate page's interactivity: the live day-rate calculator and the
// per-tree builder (port of estimate.js), wired to the submitEstimate Server
// Action via useActionState so it still works with JS disabled.
import { useActionState, useRef, useState } from 'react'
import { submitEstimate, type EstimateState } from './actions'
import { PHONE_DISPLAY, PHONE_HREF } from '../components/chrome'

// ── RATES (from estimate.js) ──────────────────────────────────────────────
const DAY_LOW = 175
const DAY_HIGH = 350
const CLEANUP = 100
const DEBRIS_REMOVAL = 150

const money = (n: number) => '$' + n.toLocaleString('en-US')

const SPECIES = [
  'Ponderosa pine',
  'Pinyon pine',
  'Blue spruce',
  'Aspen',
  'Cottonwood',
  'Oak',
  'Juniper',
  'Elm',
  'Maple',
  'Ash',
  'Locust',
  'Other',
]

function TreeCard({ n, showRemove, onRemove }: { n: number; showRemove: boolean; onRemove: () => void }) {
  return (
    <div className="tree-card">
      <div className="tree-head">
        <span className="tree-num">Tree {n}</span>
        <button
          type="button"
          className={'tree-remove' + (showRemove ? '' : ' is-hidden')}
          aria-label="Remove this tree"
          onClick={onRemove}
        >
          ×
        </button>
      </div>
      <div className="row2">
        <div className="field">
          <label>What for?</label>
          <select name="tree_service" aria-label="What for" defaultValue="remove">
            <option value="remove">Remove it</option>
            <option value="trim">Trim / prune</option>
            <option value="sectional">Technical / sectional removal</option>
            <option value="storm">Storm damage</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>
        <div className="field">
          <label>Species</label>
          <select name="tree_species" aria-label="Species" defaultValue="">
            <option value="">Not sure</option>
            {SPECIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row2">
        <div className="field">
          <label>Height</label>
          <select name="tree_height" aria-label="Height" defaultValue="">
            <option value="">Pick one</option>
            <option value="Under 30 ft">Under 30 ft</option>
            <option value="30–60 ft">30–60 ft</option>
            <option value="60+ ft">60+ ft</option>
          </select>
        </div>
        <div className="field">
          <label>Dead or alive?</label>
          <select name="tree_condition" aria-label="Dead or alive" defaultValue="">
            <option value="">Pick one</option>
            <option value="Alive">Alive and healthy</option>
            <option value="Dead/hazard">Dead or hazardous</option>
          </select>
        </div>
      </div>
      <div className="row2">
        <div className="field">
          <label>Near house, fence, or lines?</label>
          <select name="tree_near" aria-label="Near structures or lines" defaultValue="">
            <option value="">Pick one</option>
            <option value="Open">Open, away from structures</option>
            <option value="Close to structures/lines">Close to house, fence, or lines</option>
          </select>
        </div>
        <div className="field">
          <label>Drop zone</label>
          <select name="tree_drop" aria-label="Drop zone" defaultValue="">
            <option value="">Pick one</option>
            <option value="Clear">Clear, open</option>
            <option value="Some obstacles">Some obstacles</option>
            <option value="Tight">Tight, lots of obstacles</option>
          </select>
        </div>
      </div>
    </div>
  )
}

const INITIAL: EstimateState = { status: 'idle' }

export function EstimateForm() {
  const [state, formAction, isPending] = useActionState(submitEstimate, INITIAL)

  // calculator state
  const [days, setDays] = useState(1)
  const [debris, setDebris] = useState('none')
  const [bumpKey, setBumpKey] = useState(0)

  // per-tree builder state — stable ids so uncontrolled selects keep their value
  const nextId = useRef(1)
  const [treeIds, setTreeIds] = useState<number[]>([0])

  const add = debris === 'removal' ? DEBRIS_REMOVAL : debris === 'cleanup' ? CLEANUP : 0
  const low = days * DAY_LOW + add
  const high = days * DAY_HIGH + add
  const pulse = () => setBumpKey((k) => k + 1)

  if (state.status === 'sent') {
    return (
      <section className="thanks reveal">
        <h1>Got it, {state.name}. Thanks!</h1>
        <p>
          Your request is in. I&rsquo;ll reach out to lock in the details and a firm number. Need it
          sooner? Call or text <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
        </p>
      </section>
    )
  }

  const values = state.status === 'error' ? state.values : {}

  return (
    <>
      <section className="estimate-head reveal">
        <h1>Free estimate</h1>
        <p>
          I&rsquo;m a professional tree climber. I bring my climbing and rigging gear and get your
          tree down or trimmed, safely and as fast as the job allows. I work efficiently so
          you&rsquo;re not paying for wasted time.
        </p>
        <p className="note">
          I price by the day: <strong>$175–$350 a day</strong>. Most single-tree jobs are one day.
          Optional on-site cleanup (I cut it down and pile the wood and brush) is a flat{' '}
          <strong>$100</strong>. Heads up. I don&rsquo;t haul debris off-site, so removal is on you
          or your hauler.
        </p>
      </section>

      {/* live ballpark calculator (client-side) */}
      <div className="calc reveal">
        <div className="calc-row">
          <label>Estimated job length</label>
          <div className="seg" id="est-days-seg">
            <label className="seg-opt">
              <input
                type="radio"
                name="est_days"
                value="1"
                form="estimate-form"
                checked={days === 1}
                onChange={() => {
                  setDays(1)
                  pulse()
                }}
              />
              <span>1 day</span>
            </label>
            <label className="seg-opt">
              <input
                type="radio"
                name="est_days"
                value="2"
                form="estimate-form"
                checked={days === 2}
                onChange={() => {
                  setDays(2)
                  pulse()
                }}
              />
              <span>2 days</span>
            </label>
          </div>
          <p className="calc-hint">Most single-tree jobs are one day.</p>
        </div>
        <div className="calc-row">
          <label htmlFor="debris">Debris</label>
          <select
            id="debris"
            name="debris"
            form="estimate-form"
            value={debris}
            onChange={(e) => {
              setDebris(e.target.value)
              pulse()
            }}
          >
            <option value="none">Leave it on site (no charge)</option>
            <option value="cleanup">On-site cleanup, cut &amp; pile (+$100)</option>
            <option value="removal">Full debris removal, hauled off (+$150)</option>
          </select>
        </div>
        <div className="calc-result">
          <div className={'amount' + (bumpKey > 0 ? ' bump' : '')} id="amount" key={bumpKey}>
            {money(low)} – {money(high)}
          </div>
          <div className="sub">Ballpark only. Final number after I see the tree.</div>
        </div>
      </div>

      <form className="estimate-form reveal" id="estimate-form" action={formAction}>
        {state.status === 'error' ? <p className="error form-error">{state.error}</p> : null}

        {/* calculator snapshot, kept in sync with the live total */}
        <input type="hidden" id="est_low" name="est_low" value={low} readOnly />
        <input type="hidden" id="est_high" name="est_high" value={high} readOnly />

        <div className="row2">
          <div className="field">
            <label htmlFor="name">Your name *</label>
            <input type="text" id="name" name="name" defaultValue={values.name ?? ''} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" defaultValue={values.phone ?? ''} />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" defaultValue={values.email ?? ''} />
          </div>
          <div className="field">
            <label htmlFor="address">Service address</label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={values.address ?? ''}
              placeholder="Street, city"
            />
          </div>
        </div>

        <div className="trees-block">
          <div className="trees-head">
            <h3>Your trees</h3>
            <button
              type="button"
              id="add-tree"
              className="tree-add"
              onClick={() => setTreeIds((ids) => [...ids, nextId.current++])}
            >
              + Add a tree
            </button>
          </div>
          <p className="note">
            Add a row for each tree. Mixed jobs are fine, for example remove a dead one and trim a
            live one.
          </p>
          <div id="trees">
            {treeIds.map((id, i) => (
              <TreeCard
                key={id}
                n={i + 1}
                showRemove={treeIds.length > 1}
                onRemove={() => setTreeIds((ids) => (ids.length > 1 ? ids.filter((x) => x !== id) : ids))}
              />
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="details">Tell me about the trees</label>
          <textarea
            id="details"
            name="details"
            defaultValue={values.details ?? ''}
            placeholder="How many trees, roughly how tall, near the house or power lines, anything I should know."
          />
        </div>

        <div className="field">
          <label htmlFor="source">How&rsquo;d you hear about me?</label>
          <select id="source" name="source" defaultValue={values.source ?? ''}>
            <option value="">Pick one (optional)</option>
            <option value="google">Google search</option>
            <option value="facebook">Facebook</option>
            <option value="nextdoor">Nextdoor</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="yelp">Yelp</option>
            <option value="referral">Friend or neighbor</option>
            <option value="truck">Saw the truck / a sign</option>
            <option value="other">Somewhere else</option>
          </select>
        </div>

        <p className="note note-tight">* Name plus a phone or email so I can reach you.</p>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Sending…' : 'Send my request'}
        </button>
      </form>
    </>
  )
}
