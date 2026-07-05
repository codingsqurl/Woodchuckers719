# HANDOFF — Woodchuckers site, next work

> **✅ RESOLVED 2026-07-04.** Task 1 done: all 4 stub posts have full EN+ES bodies,
> `draft: false`. Task 2 done: `app/estimate/{actions,estimate-content,estimate-form}`
> deleted (closes the uncapped-input security finding), `estimateEmailHTML` removed
> from `lib/mail.ts`, redirect pages kept. Tasks 3/4 were already done by the manager.
> Everything below is history.

## ⚙️ MANAGER COORDINATION — read this FIRST (added by the site-manager session)

A second agent (the **site manager**) is live on this *same uncommitted working tree*.
To keep us from clobbering each other, ownership is split. Respect it.

**Files the manager is holding — do NOT edit:**
- `app/globals.css` — manager added a `.call-verb` rule and **already completed Task 3**
  (`.cta-ghost-dark` now has a distinct brighter resting border). **Task 3 is DONE —
  skip it, and do not re-touch this file.**
- `app/blog/[slug]/post-content.tsx` — manager owns the body-render logic here.
  **Task 4 auto-resolves** once Task 1 lands. **Skip Task 4.**
- `README.md`, `lib/i18n.ts` — manager already updated these (blog status row;
  `ratesTitle` → "Day Rate Ballpark"). Don't revert or re-touch.

**Your lane — do these, in order:**
1. **Task 1 — finish the 4 blog posts in `lib/posts.ts`.** Post #1
   (`when-to-hire-a-contract-climber`) is DONE, EN + ES; it is the manager's reference
   copy. **Do not rewrite, reorder, or reformat post #1.** Read the file fresh, then
   only ADD `body` and flip `draft` on the 4 stub slugs.
2. **Task 2 — delete the dead homeowner estimate code.** Fully disjoint from every file
   the manager has touched. Safe.

**Working tree is UNCOMMITTED.** Do NOT `git checkout` / `reset` / `stash` — you'd wipe
the manager's in-flight edits. Commit only if the operator asks.

When Task 1 is done, report back before starting anything outside this lane.

### 🔎 LIVE BRIDGE STATUS (verified by a read-only audit of the shared tree)

A 4-way read-only audit just snapshotted this working tree. Ground truth:

- **No collision has occurred.** Every tracked change in the tree is manager (session A)
  work: the `.call-verb` responsive treatment across 6 CTA files + its `globals.css`
  media rule, the `.cta-ghost-dark` border (Task 3, done), `.post-body` styles, the blog
  body-render branch in `post-content.tsx`, and the README + `i18n` copy edits.
- **`lib/posts.ts` is safe to enter.** Its diff touches ONLY post #1
  (`when-to-hire-a-contract-climber`), which is the manager's finished reference copy.
  The 4 stub slugs are still `draft: true` and UNTOUCHED. `postsEN` = 5, `postsES` = 5.
  Session B: read the file fresh, then APPEND bodies to the 4 stubs only.
- **The 4 stubs to finish:** `sectional-removal-vs-felling`,
  `what-a-contract-climber-charges`, `crane-assist-vs-climb-and-rig`,
  `storm-damage-when-you-need-a-climber`. EN and ES track identically — no locale is ahead.
- **Baseline is green:** `npx tsc --noEmit` exits 0; guardrail scan (honesty, no fake
  reviews, solo-operator framing, no em-dash/colon/paren in shipped prose, no stray
  orange/white bg) found zero violations.
- **Nothing is staged or committed.** Do not run git checkout/reset/stash/commit.

Session B lane is clear. You are unblocked on Task 1.

**Security note for Task 2:** `app/estimate/actions.ts` (the `submitEstimate` Server
Action) is ALSO an open hardening finding — it trims but never length-caps its inputs
before writing to the DB + owner email, unlike the contract action. The manager did NOT
patch it, on purpose: your Task 2 already deletes it as dead code, which closes the
finding cleanly. So when you do Task 2, make sure the **action file** (and its bundled
action id) actually goes, not just the redirected page — otherwise the uncapped action
stays POST-invocable. Confirm `lib/estimates.ts` is still used by the admin dashboard
before deleting it (it is — keep it).

---

Prompt-ready task spec for the next AI. You have **no prior context** on this repo, so
read the guardrails first — they override any instinct you have about how a "tree
service marketing site" should look or read. Getting one of them wrong (claiming the
operator is insured, implying a crew, adding review widgets) is worse than doing
nothing.

Repo: `caonima` — the Next.js App Router port of a Go site. Public bilingual marketing
site (EN at root, ES mirrored under `/es`) for a **contract tree climber** in Colorado
Springs, plus a gated `/admin` staff app. Stack: Next.js RSC + Server Actions, raw
`better-sqlite3`, TypeScript, Node 22. Full detail in `CLAUDE.md`, `DESIGN.md`,
`README.md`, `PRODUCT.md`.

---

## HARD GUARDRAILS — read before touching anything

### Positioning (do not drift)
- This site sells **B2B contract climbing to other tree companies ONLY.** The operator
  is a climber hired *by* a tree company for the technical piece past their crew — not a
  homeowner tree service. Audience is tree-company owners, foremen, GC/property people.
  Never reframe toward homeowners shopping a yard tree.
- The old homeowner `/estimate` flow is retired: `/estimate` now `redirect()`s to
  `/contract-climbing`, which is the single intake. Keep it that way.

### Honesty (legal + brand — never violate)
- The operator is **NOT insured and NOT certified.** He is a second-year climber
  studying for the ISA cert, owns his climbing gear and some rigging. **Never** write
  "insured," "certified," "licensed," "20 years experience," or any credential/tenure
  claim, in copy, alt text, schema, or meta. The existing JSON-LD is deliberately
  honest-only — **no `Review` / `AggregateRating`** (there are no reviews to cite;
  faking them breaks Google's guidelines). Do not add them.
- **Solo operator, one-man phase.** Never imply a crew, team, or employees on the public
  site. "I climb the piece; *your* crew runs the ground" is the frame — the ground crew
  is the *client's*, not his.

### Design system (committed — don't "improve" it into slop)
- Read `DESIGN.md`. Two colors do all the work: **deep pine** (`#06160d` base) +
  **safety orange** (`#f2601c`), rationed hard. **One Signal Rule:** orange is only for
  conversion (call, estimate CTA, day rate, focus ring). If a second thing is orange,
  you diluted the signal.
- **No-White Rule:** public pages never use a white/near-white background. White is only
  inside form fields and the admin app.
- **No feature-soup.** This site deliberately rejects the cheap-local-SEO template: no
  badge soup, no review widgets, no cluttered hero, no icon-card grids. Restraint is the
  strategy. **Do not add features to "pack it out."** If a change adds a widget, stop.
- Committed **glass system** (fixed `background.jpg` backdrop + pine-tinted blurred
  bands) is intentional, not drift — don't flatten it to solid pine. Form fields stay
  opaque white on purpose.
- Headings are Big Shoulders (condensed, uppercase); body is Archivo. Don't swap fonts.

### Environment (operational — will break his setup)
- **Never touch the dev server.** Do not run `npm run dev`, `next dev/start/build`, kill
  `:3000`, or any process control. The operator owns the server; the Go original may
  also be on `:3000`. If something needs starting/restarting, **hand him the bare
  command** and let him run it.
- **Never `rm -rf .next` or run `next build` against the shared `.next`** while his dev
  server is up — it unstyles his live site. Verify with `npm run smoke` (data layer) and
  `npx tsc --noEmit` (types) instead. If you need a real build, do it in an isolated
  sibling dir; ask him first.
- **The database is sacred.** Points at the live `woodchuckers.db` (real leads). Dev uses
  a gitignored snapshot. No schema edits, no hand-writing rows. Migrations only as new
  numbered files in `db/migrations/`, and only with his say-so.
- File ops: `ls` before creating; never overwrite blindly; edit existing files in place,
  don't heredoc over them.

### Prose style for anything a human reads (copy, alt text, meta)
- Match the voice of the one finished blog post (see Task 1). Short declarative
  sentences. Practitioner tone, blunt, concrete. **No em-dashes, no colons, no
  parentheses** in shipped body prose — restructure into clean sentences. (This rule is
  for human-facing prose, not code or these task docs.)

---

## TASK 1 — Finish the blog (highest leverage) 🟢 primary

**Why:** The blog is the one genuinely half-built surface, and long-form proof-of-
expertise is exactly what convinces another company's foreman to hand over the rope.
This is the honest version of "make it fuller" — packed with *content*, not widgets.

**State** (`lib/posts.ts`):
- 5 posts × 2 locales (`postsEN`, `postsES`), same slugs so hreflang pairs.
- **`when-to-hire-a-contract-climber` is DONE** — `draft: false`, full `body: Section[]`,
  both EN + ES. **This is the reference for voice, length, and structure.** Read it first.
- The other **4 are `draft: true` stubs** (intro `excerpt` + `outline` only), EN *and*
  ES → **8 bodies to write.**

**The 4 remaining slugs (write in this order):**
1. `sectional-removal-vs-felling` — when you can drop it whole vs rope it down in sections
2. `what-a-contract-climber-charges` — day-rate pricing, what a day covers, per-job pieces
3. `crane-assist-vs-climb-and-rig` — picking the method for a takedown
4. `storm-damage-when-you-need-a-climber` — hangers, broken tops, loaded leaners

Each stub already has a 4-item `outline` — **write the body to that outline.** Turn each
outline item into one `Section` (`{ heading, paras: string[] }`), ~2 paragraphs each, so
finished posts mirror post #1's shape.

**How to complete a post:**
1. Add a `body: Section[]` with ~4 sections (one per outline item), ~2 short paras each.
2. Flip `draft: true` → `draft: false`.
3. Do the **matching ES post** (`postsES`, same slug) — a real translation in the same
   voice, not machine-literal. Same section count. Keep `draft` in sync with EN.
4. Keep the `excerpt`, `outline`, `metaTitle`, `metaDesc`, `imageAlt` that already exist
   unless they're wrong — they're already written and SEO-tuned.

**Content rules (on top of the global guardrails):**
- Practitioner voice, first-person singular ("I climb it"), talking *to* a tree-company
  owner/foreman as a peer. Never to a homeowner.
- No credential/insurance/tenure claims. No crew of his own. No fake specifics (no
  invented job counts, dollar figures beyond the site's real `$175–$350/day` range, or
  named clients).
- No em-dashes/colons/parentheses in the prose (match post #1).
- Don't touch `globals.css` — `.post-body` styling already exists and works.

**Verify:** `npx tsc --noEmit` passes; `npm run smoke` passes. Do **not** build against
the shared `.next`. Confirm both `postList('en')` and `postList('es')` still return 5.

**Ask the operator** to eyeball the technical calls (rigging, method choice, storm
hazards) before considering a post final — he's the climber; you're drafting his voice,
not asserting facts he can't back.

---

## TASK 2 — Delete the dead homeowner estimate code 🟡 cleanup

Now that `/estimate` just `redirect()`s, this code is unreachable:
- `app/estimate/estimate-content.tsx`
- `app/estimate/estimate-form.tsx`
- `app/estimate/actions.ts`
- `lib/estimates.ts` (confirm nothing else imports it first — `grep -rn "lib/estimates\|estimates'" app lib scripts`)

Keep `app/estimate/page.tsx` (the redirect) and the ES `app/es/estimate/page.tsx`.

**Before deleting:** grep for every importer of each file and confirm zero live
references outside the dead set. If `lib/estimates.ts` is still imported by a Server
Action or the admin dashboard, **do not delete it** — flag it instead. This is a
low-priority tidy; correctness first.

**Verify:** `npx tsc --noEmit` clean, `npm run smoke` clean.

---

## TASK 3 — Resolve the `cta-ghost-dark` no-op 🟡 nit

In `app/globals.css` (~lines 320-330), `.cta-ghost` and `.cta-ghost-dark` share one rule
with identical styles, so `cta-ghost-dark` renders no different from `cta-ghost`. It's
used on dark bands in `home-content.tsx` / `post-content.tsx`.

Pick one, don't do both:
- **(a)** If it's meant to differ on the darker glass bands, give it a real distinct
  treatment (e.g. a slightly stronger border alpha) — staying inside the One Signal Rule
  (no new orange, no white bg).
- **(b)** If not, drop the `cta-ghost-dark` class from the markup and the selector.

Ask the operator which he intended before changing markup. Cosmetic only.

---

## TASK 4 — Draft-post fallback rendering 🟢 auto-resolves

`app/blog/[slug]/post-content.tsx`: when a post has no `body`, the `outline` renders as
`<li><p>{h}</p></li>` inside `.svc-list`, which is styled for `<h3> + <p>` — so stub
outlines look slightly flat. **Completing Task 1 removes every `draft` stub and makes
this moot.** Only style the fallback if posts will stay stubbed long-term; otherwise skip.

---

## What NOT to do (explicit non-goals)

- ❌ Don't add reviews, testimonials, ratings, trust badges, counters, or "as seen in"
  strips. None exist because none are real.
- ❌ Don't add homeowner-facing copy, a per-tree estimate builder, or a booking calendar.
- ❌ Don't build out `/admin` scheduling/timesheets/hiring — one-man phase, tables exist
  but the UI is deliberately deferred.
- ❌ Don't restyle the site "to look more premium" — the pine/orange glass system is a
  committed owner decision. Small in-system fixes only.
- ❌ Don't run or restart the dev server, or build against the shared `.next`.

## Definition of done (per task)
- `npx tsc --noEmit` passes and `npm run smoke` passes.
- No new lint of the guardrails above (grep your own diff for "insured/certified/
  licensed", em-dashes, and any new orange or white backgrounds before you finish).
- Changes are one focused surface at a time — the operator works one step at a time and
  reviews between steps. Do not batch unrelated changes into one pass.
