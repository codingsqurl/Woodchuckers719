---
name: Woodchuckers
description: Rugged owner-operated tree climber — deep pine and safety orange, industrial signage type.
colors:
  pine-deep: "#06160d"
  pine: "#0b2a1a"
  pine-mid: "#14492c"
  pine-bright: "#1d6b41"
  safety-orange: "#f2601c"
  safety-orange-deep: "#d44e10"
  ink: "#0e1411"
  on-pine: "#eef2ec"
  on-pine-soft: "#c8d2c8"
  on-pine-mute: "#bec7be"
  paper: "#ffffff"
  admin-body: "#3b4453"
  admin-muted: "#6b7280"
  hairline: "#e5e7eb"
typography:
  display:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 10.5vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 7vw, 3rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "0.02em"
  title:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.02rem, 3.6vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  sm: "8px"
  md: "11px"
  lg: "14px"
  xl: "16px"
  pill: "999px"
spacing:
  sm: "0.7rem"
  md: "1.1rem"
  lg: "1.6rem"
  band: "clamp(3rem, 9vw, 5.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.safety-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.9rem 1.6rem"
    height: "3.3rem"
  button-primary-hover:
    backgroundColor: "{colors.safety-orange-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.9rem 1.6rem"
    height: "3.3rem"
  call-button:
    backgroundColor: "{colors.safety-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  town-chip:
    backgroundColor: "{colors.pine}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.1rem"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 0.7rem"
---

# Design System: Woodchuckers

## 1. Overview

**Creative North Star: "The Climber's Gear"**

The whole system is pulled off the climber's body. The deep pine of the canopy he
works in, and the one screaming color you can always find against it: safety
orange, the rope, the harness webbing, the chainsaw shroud. That is the entire
palette and the entire idea. A trained owner-operator who quotes the job and
climbs it himself does not need five review widgets and a stock photo of a smiling
call center. He needs to look like he knows exactly what he is doing, and the
design earns that read through clarity and restraint, not gloss.

The surface is committed: deep pine carries 90%+ of every public screen, and the
single accent is rationed hard. Type is industrial signage (condensed, uppercase,
set tight) the way a real sign on a real truck is set, paired with a plain
grotesque for body copy that stays legible for an outdoor user on cell data in
bright Colorado sun. Photographs are the proof, never decoration; one decisive
shot beats five. The page reads fast, loads instant, and never shouts with motion.

This system explicitly rejects three things, straight from the brand brief. The
**cheap local-SEO template** (badge soup, cluttered hero, keyword-stuffed copy,
fake review widgets). The **corporate franchise** look (impersonal green-corporate
chain, stock photos, call-center vibe). And **flashy / over-designed** pages
(heavy scroll animation, loud gradients, anything slow or hard to read on a phone
in the sun). Restraint reads as competence here, and that is the point.

**Key Characteristics:**
- Two colors do all the work: deep pine and safety orange. Everything else is text-on-pine.
- Industrial signage display type, condensed and uppercase, against a plain grotesque body.
- Tonal layering, not shadows, for depth. Photos float; surfaces sit flat.
- One photo per page, used exactly once site-wide. Proof beats adjectives.
- Mobile-first, sun-readable, instant. Two seconds is a lost job.

## 2. Colors

A committed two-color system: the forest the work happens in, and the one signal color you can always spot in it.

### Primary
- **Safety Orange** (#f2601c): The single signal color, rationed hard. It marks the things a stressed homeowner is hunting for — the call button, the primary CTA, the live estimate total, every section accent heading, the scroll-rope, focus rings, text selection. It is never decoration; if it is orange, it is the most important thing in view.
- **Safety Orange Deep** (#d44e10): The pressed/hover state for every orange surface. Only appears on interaction.

### Neutral
- **Pine Deep** (#06160d): The body background of the entire public site, the footer, and the alternating dark bands. The base everything sits on.
- **Pine** (#0b2a1a): One tonal step up. The "raised" surface: trust strip, the alternating mid band, the estimate calculator panel, town chips, link buttons. Layering, not borders, separates planes.
- **Pine Mid** (#14492c): Hover fill for chips and buttons-on-pine, and the scrollbar thumb.
- **Pine Bright** (#1d6b41): The lightest pine, reserved for accents in the green family where orange would be too loud.
- **On Pine** (#eef2ec): Primary text on pine. Bumped toward white for sun readability; clears AA comfortably on Pine Deep.
- **On Pine Soft** (#c8d2c8): Secondary text — leads, captions, field labels, body copy in bands.
- **On Pine Mute** (#bec7be): Tertiary only — hints, footer, fine print. Never primary reading copy. Lightened from #9fad9f so fine print still clears AA 4.5:1 over the lightest glass band.
- **Ink** (#0e1411): Near-black text, used on orange surfaces and inside white form fields.
- **Paper** (#ffffff): White, used only inside form fields and the constrained admin app. The public site never goes white.
- **Hairline** (#e5e7eb): 1px dividers in light contexts (admin tables, form-field borders). On pine, dividers are `rgba(255,255,255,0.1)` instead.

### Named Rules
**The One Signal Rule.** Safety orange is the only saturated color in the system, and it is reserved for what converts: call, estimate, the live total, focus. If a second thing on screen is orange that should not be, the page has diluted its own signal. Pine carries the brand; orange carries the action.

**The No-White Rule.** Public pages never use a white or near-white background. White exists only inside form fields and the internal admin app. "Warmth" and brand feeling come from the pine and the orange, never from a tinted off-white body.

## 3. Typography

**Display Font:** Big Shoulders Display (with Archivo, system-ui fallback)
**Body Font:** Archivo (with system-ui, -apple-system fallback)

**Character:** A real-signage pairing. Big Shoulders is condensed industrial display type — the lettering on a work truck, a trail marker, a stenciled crate — set uppercase and tight so headlines read like signage, not like a magazine. Archivo is a plain, slightly grotesque sans that stays flatly legible at small sizes on a phone in sun. The contrast axis is condensed-display vs. neutral-grotesque, not two lookalike sans serifs.

### Hierarchy
- **Display** (800, clamp 2.4rem→4.75rem, line-height 0.9): The home hero headline only. Set in three rising lines with the last line in safety orange. Uppercase, tracked tight.
- **Headline** (800, clamp 2rem→3rem, line-height 0.98, uppercase): Section titles across every page. Left-aligned by default; centered only in the About and final-CTA bands.
- **Title** (700, 1.18rem, uppercase): The brand wordmark, ruled work-list item headings (in orange), calculator/form sub-heads. Signage type at small size.
- **Body** (400, clamp 1.02rem→1.15rem, line-height 1.65): Leads and paragraph copy in On Pine Soft. Capped at ~38rem measure (within the 65–75ch guidance) so lines never run long.
- **Label** (700, 0.74rem, letter-spacing 0.18em, uppercase): The eyebrow / kicker and the area-note tag, in safety orange. One per surface, as a page label — never stacked above every section.

### Named Rules
**The Signage Rule.** Every heading is condensed display type, uppercase, set with `text-wrap: balance`. Body is always Archivo, never the display face. The two never trade jobs.

**The One Eyebrow Rule.** The tracked uppercase label appears at most once per page, as the page's own kicker. It is forbidden as a per-section scaffold above every heading.

## 4. Elevation

This is a tonal-layering system, not a shadow system. Depth on the public site comes from stepping the pine ramp — Pine Deep base, Pine one step up for raised surfaces — and from `1px rgba(255,255,255,0.1)` hairlines, never from stacked drop shadows on flat panels. Shadows are reserved for two jobs only: lifting real photographs off the page, and the orange glow under the primary CTA so the convert button reads as physically closer.

### Shadow Vocabulary
- **Photo lift** (`box-shadow: 0 18px 40px rgba(0,0,0,0.5)` to `0 26px 52px rgba(0,0,0,0.55)`): Under gallery shots and split-media images. Makes the proof photos float above the pine.
- **CTA glow** (`box-shadow: 0 12px 26px rgba(242,96,28,0.3)`, hover `0 16px 32px rgba(242,96,28,0.38)`): A colored glow under the primary orange button only. The action element, lifted.
- **Sticky bar** (`backdrop-filter: blur(12px)` + 1px top hairline): The mobile conversion bar, because it overlays scrolling content. (No longer the only blur — the sitewide glass system added more; see The Glass Rule.)

### Named Rules
**The Flat-Surface Rule.** Bands, chips, cards, and panels are flat — separated by tone and hairlines. Drop shadows belong to photographs and the primary CTA, nowhere else. If a flat panel has a shadow, delete it.

**The Glass Rule.** Superseding the original no-glass stance (a deliberate owner decision in the sitewide glass redesign): the public site is now a committed glass system. One fixed atmospheric backdrop (`background.jpg`, misty pine) sits behind every page, and the content bands are pine-tinted translucent panels with `backdrop-filter` blur floating over it. The discipline that remains: glass is the SYSTEM, not decoration sprinkled at random. Pine tint (rgba pine 0.5–0.66) carries the brand color through the translucency so the site never washes out; form fields stay opaque white for legibility; reduced-transparency and low-power users fall back to solid pine. Mind the cost — `backdrop-filter` repaints per band on scroll; this is the heaviest path in the system and was accepted with eyes open.

## 5. Components

### Buttons
- **Shape:** Soft rectangle (11px radius), min-height 3.3rem for a thumb-sized tap target.
- **Primary:** Safety orange fill, ink text, the CTA glow shadow. Padding `0.9rem 1.6rem`. The convert action.
- **Hover / Focus:** Darkens to Safety Orange Deep and lifts `translateY(-2px)` with a stronger glow. Focus-visible draws a 2px orange outline, offset 2px. Reduced-motion drops the lift.
- **Ghost:** Transparent with a `2px rgba(255,255,255,0.45)` border, white text. Hover fills `rgba(255,255,255,0.1)` and brightens the border to white. The secondary "call" action beside a primary.
- **Call pill:** A fully-rounded (999px) orange pill in the header with an inline phone glyph — the always-visible call affordance.

### Chips (town grid)
- **Style:** Pine fill, `rgba(255,255,255,0.1)` border, white label, with a trailing orange `›`. 8px radius.
- **State:** Hover fills Pine Mid and the border goes orange; active nudges down 1px. Each is a link to a town map.

### Cards / Containers
- **Corner Style:** 14px (calculator), 16px (split media, map embed).
- **Background:** Pine for raised panels (calculator, link buttons); the bands themselves alternate Pine Deep / Pine.
- **Shadow Strategy:** Flat (see Elevation). Only photos and the map embed carry shadow.
- **Border:** `1px rgba(255,255,255,0.1)` hairline where a panel needs definition.
- **Internal Padding:** 2rem for the calculator/panels; bands use the `band` spacing token vertically.

### Inputs / Fields
- **Style:** White fill, ink text, 1px Hairline border, 8px radius. White-on-pine is deliberate: form fields must read as crisp and high-contrast for an outdoor user.
- **Focus:** 2px safety-orange outline, offset 2px (the global focus-visible ring).
- **Segmented toggle:** The job-length control — pine segments with hairline dividers; the checked segment fills safety orange with ink text.

### Navigation
- **Style:** Sticky topbar in Pine Deep with a bottom hairline. Brand wordmark in signage type, nav links in `#cfe0d3` brightening to white on hover, orange call pill at the right.
- **Mobile:** A fixed bottom conversion bar (phones only, hidden ≥46rem) with a ghost "Call" and a solid orange "Free estimate" — the call and the estimate always one thumb-tap away.

### Signature Component: The Scroll-Rope
A 3px safety-orange line fixed to the left edge that fills top-to-bottom as you scroll, via pure CSS `animation-timeline: scroll()` — no JavaScript. It reads as a climbing rope paying out as you descend the page. Hidden entirely under reduced-motion.

## 6. Do's and Don'ts

### Do:
- **Do** carry the whole public site on Pine Deep (#06160d) with Pine (#0b2a1a) for raised surfaces. Layer with tone and 1px white hairlines.
- **Do** ration safety orange (#f2601c) to conversion and accent only — call, estimate, live total, focus, one section accent.
- **Do** set every heading in Big Shoulders, uppercase, with `text-wrap: balance`; keep body in Archivo with `text-wrap: pretty`.
- **Do** keep the proof photos unique — each job shot appears exactly once, in the portfolio gallery. The single exception is `background.jpg`, the shared atmospheric backdrop fixed behind every page; it is environment, not a proof photo, so it is deliberately repeated sitewide.
- **Do** keep body text at On Pine (#eef2ec) or On Pine Soft (#c8d2c8) for sun-readable AA contrast; reserve On Pine Mute for fine print.
- **Do** keep form fields white with ink text for crisp outdoor legibility.

### Don't:
- **Don't** add one-off decorative glass outside the system. Glass is now the committed sitewide material (one fixed backdrop + pine-tinted blurred bands), but that's a system, not a license for random frosted cards. Keep form fields opaque white.
- **Don't** build identical card grids (icon + heading + text repeated endlessly). Use ruled full-width lists (`.svc-list`) instead.
- **Don't** ship the **cheap local-SEO template**: badge soup, cluttered hero, keyword-stuffed copy, fake review widgets.
- **Don't** drift into the **corporate franchise** look — impersonal green-corporate chain, stock photos, call-center vibe. This is one person; it should feel like one person.
- **Don't** go **flashy / over-designed**: heavy scroll animation, loud gradients, anything slow or hard to read on a phone in bright sun.
- **Don't** put a white or near-white background on any public page, and don't tint a neutral to fake warmth. Pine and orange carry the brand.
- **Don't** stack a tracked uppercase eyebrow above every section, and don't add drop shadows to flat panels.
