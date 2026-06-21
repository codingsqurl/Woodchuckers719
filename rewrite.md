# rewrite.md — porting woodchuckers-site from Go to Next.js

You are the agent doing this rewrite. Read this whole file before you touch a
keystroke, then read `CLAUDE.md` and `PRODUCT.md`. This is a **behavior-preserving
port**, not a redesign. The Go app works and ships real leads. Your job is to land
the same product on a new stack without losing data, breaking a route, or bloating
the wire.

> **First, a gut check.** The current stack is Go stdlib `net/http`, `html/template`,
> raw SQL over SQLite, hand-rolled sessions. It is fast, small, and correct. A
> Next.js rewrite is a _lateral_ move on performance and a _backward_ move on
> simplicity. Do it only if the real goal is React/TS developer experience, a
> component model for the growing `/admin` app, or hiring. If the goal is "faster"
> or "simpler," stop and tell KING the rewrite won't get him that. Optimize for
> whatever the actual motive is — write it down before Phase 1.

---

## 0. Non-negotiables (read these twice)

These are acceptance criteria. A port that violates any of them is wrong, no matter
how clean the code looks.

1. **No data loss.** The live `woodchuckers.db` has real employees and real leads.
   The new app points at the **same file with the same schema**. Zero data
   migration. Existing bcrypt password hashes must keep logging in (bcrypt is
   cross-language; do not "upgrade" the hashing).
2. **No ORM.** No Prisma. Raw SQL, hand-written, you read exactly what hits the
   database. `better-sqlite3` with `.prepare()` statements. (Drizzle is tolerable
   _only_ if KING explicitly opts in, and only in its raw-SQL-you-can-read mode.)
3. **Server-rendered by default.** React Server Components for every page. Client
   JavaScript only where there is genuine interactivity (the estimate calculator
   and the per-tree builder — that's it). No SPA. No client-side data fetching
   waterfalls. The browser is a document viewer; keep it that way.
4. **Fast or it's broken.** Outdoor users on cell data in bright sun. Target
   Lighthouse mobile performance ≥ 95, near-zero blocking JS on the public pages.
   Two seconds is a lost job, not "needs optimization."
5. **Same routes, same behavior.** Every path in §3 responds the same way, including
   the security subtleties: admin routes **404 for non-admins** (never 403, never a
   redirect that reveals the route exists).
6. **Security posture preserved.** CSP, the rest of the headers, rate limiting,
   HttpOnly session cookie, the SSO state/nonce checks. See §6. Do not weaken any of
   it to make the framework happy.
7. **WCAG 2.1 AA, mobile-first.** Sun-readable contrast, large tap targets, phone
   and email always as plain tappable `tel:`/`mailto:` links, `prefers-reduced-motion`
   respected. See `PRODUCT.md`.

---

## 1. Decisions to lock BEFORE Phase 1

Get KING's call on each. Recommendations are bolded — they preserve the most of the
current system. Do not start coding until these are answered.

| #   | Decision        | Options                                                            | Recommendation                                                                                                                                                                        |
| --- | --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Database        | Keep SQLite file / move to Postgres / Turso (libSQL)               | **Keep the SQLite file.** Same `woodchuckers.db`, zero migration, single writer.                                                                                                      |
| D2  | DB driver / SQL | `better-sqlite3` raw SQL / Drizzle / Prisma                        | **`better-sqlite3`, raw prepared statements.** Prisma is banned (§0.2).                                                                                                               |
| D3  | Auth            | Port the hand-rolled session table / Auth.js (NextAuth)            | **Port it.** The session table + opaque token + bcrypt is ~150 lines and already correct. Auth.js hides the model KING wants to see.                                                  |
| D4  | Hosting         | Keep Fly.io single machine / Vercel                                | **Keep Fly.** Vercel's ephemeral, multi-instance serverless is incompatible with a file SQLite _and_ the in-memory rate limiter. Fly's single machine + volume is already configured. |
| D5  | Styling         | Keep `static/css/style.css` as global CSS / Tailwind / CSS Modules | **Keep the existing stylesheet** as `app/globals.css`. It already encodes the brand and ships one small file. Don't drag in Tailwind unless KING wants it.                            |
| D6  | Runtime         | Node everywhere / Edge                                             | **Node.js everywhere.** `better-sqlite3` is a native addon; it cannot run on Edge. Pin `export const runtime = 'nodejs'` and never reach for Edge middleware that touches the DB.     |

**Why D4 matters and is not negotiable lightly:** SQLite is single-writer on one
file. `fly.toml` already mandates exactly one machine for this reason. The in-memory
rate limiter (§6.4) also assumes one process. Choosing Vercel forces D1 → Postgres
and D6 → a distributed rate limiter. That's a different, bigger project. Flag it
loudly if KING leans Vercel.

---

## 2. Stack mapping

| Concern          | Current (Go)                                     | Target (Next.js)                                                    |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| Language         | Go 1.26                                          | TypeScript, Node 22 LTS                                             |
| HTTP / routing   | stdlib `net/http`, Go 1.22 method+path mux       | Next.js App Router                                                  |
| Rendering        | `html/template`, `ParseGlob("templates/*.html")` | React Server Components                                             |
| Mutations        | form POST handlers                               | **Server Actions** (progressive-enhancement forms, work without JS) |
| DB               | `modernc.org/sqlite` (pure Go)                   | `better-sqlite3` (native, synchronous) — **same `.db` file**        |
| SQL              | raw `db.QueryContext` / `ExecContext`            | raw `db.prepare(...).get()/all()/run()`                             |
| Passwords        | `golang.org/x/crypto/bcrypt`                     | `bcrypt` (native) — hashes are compatible                           |
| Sessions         | `sessions` table + opaque hex token + cookie     | same table, ported logic                                            |
| SSO              | `go-oidc` + `oauth2` (Google OIDC, GitHub OAuth) | `arctic` or `openid-client`, or hand-rolled `fetch` (see §7)        |
| Email            | Resend HTTP API via `mail.go`                    | Resend (`resend` npm SDK or the same raw `fetch`)                   |
| Security headers | `securityHeaders` middleware                     | `middleware.ts` and/or `next.config` `headers()`                    |
| Rate limiting    | in-memory fixed-window, per IP                   | same algorithm, module-level singleton (Node, single instance)      |
| Live reload      | `air`                                            | `next dev`                                                          |
| Deploy           | Fly.io + `Dockerfile` (Go)                       | Fly.io + new Node `Dockerfile`                                      |
| Errors           | `error.html`, themed 500/404                     | `app/error.tsx`, `app/not-found.tsx`                                |

---

## 3. Route map (the contract — match it exactly)

Source of truth: `main.go` lines 114-142. The mux uses Go 1.22 method+path patterns;
`GET /{$}` is the exact-root match, `GET /` is the catch-all 404.

### Public customer site

| Method | Path           | Handler today          | Becomes                  | Notes                                          |
| ------ | -------------- | ---------------------- | ------------------------ | ---------------------------------------------- |
| GET    | `/`            | `handleIndex`          | `app/page.tsx`           | needs `Areas` (areaList), `BaseURL`, `User`    |
| GET    | `/portfolio`   | `handlePortfolio`      | `app/portfolio/page.tsx` | the credibility engine — real job photos       |
| GET    | `/areas`       | `handleAreas`          | `app/areas/page.tsx`     | needs `Areas`                                  |
| GET    | `/links`       | `handleLinks`          | `app/links/page.tsx`     | link-in-bio, needs `bioLinks` (§4)             |
| GET    | `/estimate`    | `handleEstimateForm`   | `app/estimate/page.tsx`  | day-rate calculator + form (§5)                |
| POST   | `/estimate`    | `handleEstimateSubmit` | Server Action            | rate-limited 5/min/IP; validate, store, email  |
| GET    | `/robots.txt`  | `handleRobots`         | `app/robots.ts`          | `Disallow: /admin`, points at sitemap          |
| GET    | `/sitemap.xml` | `handleSitemap`        | `app/sitemap.ts`         | `/`, `/portfolio`, `/areas`, `/estimate`       |
| GET    | `/static/*`    | `http.FileServer`      | `public/*`               | move `static/` → `public/`; Next hashes assets |
| \*     | (unmatched)    | `handleNotFound`       | `app/not-found.tsx`      | themed 404 ("That branch doesn't exist")       |

### Staff app (all under `/admin`)

| Method | Path                           | Handler today          | Gate             | Notes                                               |
| ------ | ------------------------------ | ---------------------- | ---------------- | --------------------------------------------------- |
| GET    | `/admin/login`                 | `handleLoginForm`      | public           | login form + SSO buttons                            |
| POST   | `/admin/login`                 | `handleLogin`          | public           | rate-limited 10/min/IP; verify creds, start session |
| POST   | `/admin/logout`                | `handleLogout`         | any              | clear session row + cookie                          |
| GET    | `/admin/portal`                | `handlePortal`         | **requireAuth**  | redirect to `/admin/login` if signed out            |
| GET    | `/admin`                       | `handleAdmin`          | **requireAdmin** | dashboard: employees + last 50 estimates            |
| POST   | `/admin/employees`             | `handleCreateEmployee` | **requireAdmin** | create account from web form                        |
| POST   | `/admin/employees/{id}/active` | `handleToggleActive`   | **requireAdmin** | toggle active; can't disable self                   |
| POST   | `/admin/invite`                | `handleInvite`         | **requireAdmin** | create SSO-only account + email invite              |

### SSO (paths must match the registered OAuth redirect URIs — do not rename)

| Method | Path                    | Handler today          | Notes                                                |
| ------ | ----------------------- | ---------------------- | ---------------------------------------------------- |
| GET    | `/auth/google/login`    | `handleGoogleLogin`    | rate-limited 10/min/IP; sets state+nonce cookies     |
| GET    | `/auth/google/callback` | `handleGoogleCallback` | verify state, exchange, verify id_token, check nonce |
| GET    | `/auth/github/login`    | `handleGitHubLogin`    | rate-limited; sets state cookie                      |
| GET    | `/auth/github/callback` | `handleGitHubCallback` | verify state, exchange, read primary verified email  |

**Middleware chain today** (`main.go:147`), outer → inner:
`securityHeaders → recoverPanic → withUser → routes`. In Next: security headers go
in `middleware.ts`/`next.config`, panic recovery is `app/error.tsx`, and `withUser`
(resolve session cookie → current employee) becomes a **cached server helper**
called from layouts/pages/actions — **not** Edge middleware, because session lookup
hits `better-sqlite3` which is Node-only (§6.1).

---

## 4. Content data (port verbatim from these files)

These are static Go slices today; reproduce them as TS constants/modules. Do not
paraphrase the values.

- **Service areas** — `areas.go`. `serviceAreas` is the single source of truth (12
  towns) feeding `/areas`, the homepage `areaServed` JSON-LD, and the sitemap.
  `areaList()` builds keyless Google Maps search links (`?api=1&query=<name>, CO`).
- **Bio links** — `links.go`. `bioLinks` drives `/links`. Note the mechanics: a link
  has `Href` (and `External` opens a new tab); a button with `Copy` and no `Href`
  **copies to clipboard on tap** (Zelle/Apple Pay handles that can't be linked).
  Payment handles are public on purpose — **money goes wherever they point, so port
  the exact strings, don't invent placeholders that look real.**
- **Lead destination** — `handlers_estimate.go`: `leadsTo =
"woodchuckerstrees719@gmail.com"`. Estimate notifications go here.

---

## 5. The estimate calculator (sacred business math — get it exact)

This is the conversion surface and the only real client-side interactivity. Two
files today: `static/js/estimate.js` (live total + per-tree builder) and the server
side in `handlers_estimate.go`.

### Rates (from `estimate.js`)

```
DAY_LOW        = 175   // $ per day, low end
DAY_HIGH       = 350   // $ per day, high end
CLEANUP        = 100   // flat add-on: on-site cut & pile
DEBRIS_REMOVAL = 150   // flat add-on: organized full haul-off
```

### Live total (client component)

- `est_days` is a segmented toggle, value **1 or 2**.
- `debris` select: `"removal"` → +150, `"cleanup"` → +100, else 0.
- `low  = days * 175 + add`
- `high = days * 350 + add`
- Display `"$low – $high"`, pulse-animate on change (not first paint).
- **Snapshot:** write `low`/`high` into hidden `est_low`/`est_high` fields so the
  saved lead matches exactly what the customer saw. This is a trust feature — keep it.

### Per-tree builder (client component, from `initTrees()`)

- Repeatable "tree card" rows, add/remove, renumbered "Tree N", remove hidden when
  only one row remains.
- Each row submits parallel arrays: `tree_service`, `tree_species`, `tree_height`,
  `tree_condition`, `tree_near`, `tree_drop`. **Order matters** — the server zips
  them by index.

### Server submit (Server Action, from `handleEstimateSubmit`)

1. Trim/normalize: lowercase email; trim everything.
2. `summarizeTrees`: zip the per-tree arrays by index into
   - a `service` summary like `"3 trees (2 Remove, 1 Trim)"`, and
   - a `removal_info` detail like `"Tree 1: Remove, Oak, 40ft, ... | Tree 2: ..."`.
     Label map: `remove→Remove, trim→Trim, sectional→Sectional removal,
storm→Storm damage, unsure→Not sure`.
3. Clamp server-side (`atoiClamp`): `est_days` to `[1,2]`; `est_low`/`est_high` to
   `[0, 1_000_000]`. **Never trust the client numbers** — re-clamp.
4. Map `debris`: `"cleanup"` → `cleanup=1`, `"removal"` → `debris_removal=1`, else
   both 0. At most one is set.
5. **Validate:** `name` required AND at least one of `email`/`phone`. On failure,
   re-render the form **with the entered values preserved** and an inline error.
6. Insert via `createEstimate` (see §8 columns).
7. Best-effort email to `leadsTo` via Resend (`estimateEmailHTML`). The lead is
   already saved; an email failure must not fail the request.
8. Success: render the "sent" confirmation with the customer's name.

---

## 6. Security — preserve every line of this

### 6.1 Session auth (port `auth.go`)

- Cookie name `session`, value = random **256-bit hex** token (`crypto.randomBytes(32)`).
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, 7-day expiry, **`Secure` in
  production** (the Go code has this as a TODO — turn it ON now, the target is HTTPS).
- Server-side `sessions` table holds `token → employee_id → expires_at`. Look-ups
  require `expires_at > now`. Logout deletes the row.
- `withUser` equivalent: a cached per-request helper that reads the cookie, resolves
  the active employee, returns `null` if none. **Runs in Node (RSC/route handler),
  not Edge middleware** — it queries `better-sqlite3`.
- `requireAuth`: no user → redirect `303` to `/admin/login`.
- **`requireAdmin`: not a signed-in admin → return a plain 404.** Not 403, not a
  redirect. The admin surface must be indistinguishable from a route that doesn't
  exist. For Server Actions guarding admin mutations, this means `notFound()` —
  reproduce the same "deny by vanishing" behavior.

### 6.2 Passwords (port `store.go`)

- bcrypt (`DefaultCost`). **Existing hashes must verify** — use the standard `bcrypt`
  npm package, don't change cost on existing rows.
- **Blank hash = SSO-only account.** Password login can never succeed against a blank
  hash. Preserve this: `createEmployee` with empty password stores `""`, and the
  password compare must reject it rather than throw.
- New web-created passwords: min 8 chars (admin form rule). Blank is allowed and
  means SSO-only.

### 6.3 Security headers (port `security.go` `securityHeaders`)

Set on every response:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: same-origin
Strict-Transport-Security: max-age=31536000
Content-Security-Policy:
  default-src 'self';
  img-src 'self' data:;
  style-src 'self';
  frame-src https://www.google.com https://maps.google.com;
  form-action 'self';
  frame-ancestors 'none';
  base-uri 'self'
```

> **CSP GOTCHA — do not skip.** Next.js injects inline `<script>` for hydration and
> sometimes inline `<style>`. A strict `script-src 'self'` / `style-src 'self'`
> **will break hydration**. Two acceptable fixes:
>
> 1. **Nonce-based CSP** via `middleware.ts` (generate a per-request nonce, add
>    `'nonce-...'` to `script-src`, pass it to Next). This is the correct, strict
>    answer — do this.
> 2. If you keep public pages fully static/zero-JS (ideal for `/`, `/portfolio`,
>    `/areas`, `/links`), they need no script CSP relaxation at all; only the
>    estimate page ships JS. Prefer this _and_ nonce the estimate page.
>
> Do **not** "fix" CSP by adding blanket `'unsafe-inline'`. That throws away the
> protection. The `frame-src` google/maps allowance exists for embedded maps — keep it.

### 6.4 Rate limiting (port `security.go` `rateLimiter`)

- In-memory fixed-window, keyed by client IP. Limits: **login 10/min, estimate
  5/min, SSO login 10/min**. Over limit → `429` with `Retry-After: 60`.
- Module-level singleton (survives across requests in one Node process). **This is
  why D4 = single machine.** On serverless/multi-instance it silently stops working.
- `clientIP`: today it reads `RemoteAddr`. Behind Fly's proxy, parse a **trusted**
  `Fly-Client-IP` / `X-Forwarded-For` (right-most trusted hop). Don't blindly trust
  a spoofable left-most `X-Forwarded-For`.

### 6.5 SSO CSRF/replay (port `sso.go`)

- OAuth `state` cookie (`oauth_state`), 10-min, HttpOnly, SameSite=Lax. Callback
  rejects if query `state` ≠ cookie.
- Google adds a `nonce` cookie (`oauth_nonce`); the verified `id_token` nonce must
  match. Reject otherwise.
- **Pre-created accounts only:** SSO succeeds only if the verified email already maps
  to an **active** employee. Unknown email → themed "no account" denial (401), never
  auto-create.
- Google: require `email_verified`. GitHub: read `/user/emails`, take the **primary +
  verified** email, lowercased.

---

## 7. SSO implementation note

`sso.go` uses `go-oidc` (Google, full OIDC with id_token verification) and `oauth2`
(GitHub, plain OAuth2 + email API call). Both are **optional** — nil/disabled unless
the env vars are set, and the buttons hide / routes 404 when off. Preserve that.

In TS, pick one:

- **`arctic`** (small, typed OAuth2/OIDC helpers for Google + GitHub) — recommended.
- **`openid-client`** for Google OIDC + raw `fetch` for GitHub — closest to the Go
  structure.
- Hand-rolled `fetch` against the same endpoints — most faithful, most code.

Keep the redirect URIs **byte-identical** (`/auth/google/callback`,
`/auth/github/callback`) or the registered OAuth apps break. On success: create a
session, `touchLogin(id, "google"|"github")`, redirect to `/admin/portal`.

---

## 8. Database — schema is sacred, reuse it as-is

The schema lives in `db/migrations/0001…0006*.sql`. **Do not rewrite it.** Point the
new app at the existing `woodchuckers.db` (Fly: `/data/woodchuckers.db`,
`DATABASE_URL`). Consolidated shape:

- **`employees`** — `id, email UNIQUE, password_hash (bcrypt, ''=SSO-only),
full_name, role CHECK('employee'|'admin'), active 0/1, created_at,
last_login_at, last_login_via('password'|'google'|'github')`.
- **`sessions`** — `token PK, employee_id FK→employees ON DELETE CASCADE,
expires_at, created_at`. Index on `employee_id`.
- **`shifts`** — scheduled blocks (`employee_id, starts_at, ends_at, position,
notes`). **Defined but unused** — roadmap: scheduling. Keep the table; don't build
  UI for it yet.
- **`time_entries`** — clock in/out (`employee_id, shift_id?, clock_in, clock_out?`).
  Also **unused** — roadmap: timesheets. Keep the table.
- **`estimates`** — leads. Columns (after all ALTERs folded in):
  `id, name, email, phone, address, service, details, source, removal_info,
est_days, cleanup 0/1, debris_removal 0/1, est_low, est_high,
status CHECK('new'|'contacted'|'quoted'|'won'|'lost'|'archived') DEFAULT 'new',
created_at`. Indexes on `status`, `created_at`.
- **Conventions:** timestamps are **Unix epoch seconds (INTEGER)**; booleans are
  **0/1**; money is **whole US dollars (INTEGER)**. Match these in TS — store seconds,
  not millis; render with the same `Jan 2, 3:04 PM` style the admin views use.

### Migration runner

`migrate.go` runs pending `db/migrations/*.sql` in sorted order, tracked in a
`schema_migrations(version, applied_at)` table, and **baselines** a pre-existing DB
(tables present, no tracking rows) by recording all files as applied without
re-running them. **Reproduce this exactly** as a tiny TS runner so:

1. the live DB (already migrated) is left untouched, and
2. a fresh Fly volume builds its own schema on first boot.

Keep `db/migrations/*.sql` as the source of truth — reuse the _same files_. New
schema changes are still **new numbered files**, never edits to applied ones (per
`CLAUDE.md` — migrations are sacred, KING approves the SQL before it runs).

### Queries to port (from `store.go`)

`createEmployee`, `employeeByEmail` (active only), `employeeByID` (active only),
`listEmployees` (active first, then name), `touchLogin`, `setEmployeeActive`,
`isDuplicateEmail` (UNIQUE-violation check), `createEstimate`, `listEstimates(limit)`.
Plus the display helpers: `Employee.LastLogin()`, `Estimate.DebrisLabel()`,
`Estimate.Submitted()`, `Estimate.Contact()`.

---

## 9. SEO (port `handlers_seo.go` + the templates' head)

- **`app/robots.ts`** → `User-agent: *`, `Allow: /`, `Disallow: /admin`, plus
  `Sitemap: <BaseURL>/sitemap.xml`.
- **`app/sitemap.ts`** → `/`, `/portfolio`, `/areas`, `/estimate` (public only;
  `/links` and `/admin` excluded — confirm against current behavior).
- **Metadata:** use Next's Metadata API for titles/descriptions/canonical and OpenGraph.
  OG image is `static/img/og.jpg` → `public/img/og.jpg`. The homepage emits
  `areaServed` JSON-LD from `serviceAreas` — port it (LocalBusiness schema).
- `BaseURL` comes from `APP_BASE_URL` (defaults to `http://localhost:3000`) — used
  for absolute URLs in OG tags, sitemap, robots, and OAuth redirects.

---

## 10. Templates → components

| Template         | Route           | Component                             | Interactivity                         |
| ---------------- | --------------- | ------------------------------------- | ------------------------------------- |
| `index.html`     | `/`             | `app/page.tsx`                        | none (static/RSC)                     |
| `portfolio.html` | `/portfolio`    | `app/portfolio/page.tsx`              | none                                  |
| `areas.html`     | `/areas`        | `app/areas/page.tsx`                  | none                                  |
| `links.html`     | `/links`        | `app/links/page.tsx`                  | tap-to-copy buttons (tiny client bit) |
| `estimate.html`  | `/estimate`     | `app/estimate/page.tsx`               | **client:** calculator + tree builder |
| `login.html`     | `/admin/login`  | `app/admin/login/page.tsx`            | form (Server Action)                  |
| `portal.html`    | `/admin/portal` | `app/admin/portal/page.tsx`           | none                                  |
| `admin.html`     | `/admin`        | `app/admin/page.tsx`                  | forms (Server Actions)                |
| `error.html`     | —               | `app/error.tsx` + `app/not-found.tsx` | themed 500/404                        |

Shared chrome (header, nav, footer with the always-tappable phone/email) → a root
`app/layout.tsx`. Keep the themed-error copy: 404 is "That branch doesn't exist",
500 is "Something broke". `polish.js` (scroll-reveal honoring
`prefers-reduced-motion`) → port as a minimal client effect only if it earns its
bytes; static-first is better.

---

## 11. Phased plan (verify against the running Go app at each step)

KING runs the dev server — give him the command, read what he reports. Do **not**
start/stop/restart it yourself (`CLAUDE.md`). Build the Next app in a separate dir or
branch so the Go app keeps serving until cutover.

- **Phase 0 — Decisions.** Lock §1 with KING. Write the _real_ goal at the top.
- **Phase 1 — Scaffold.** Next.js + TS, `nodejs` runtime, global CSS from
  `style.css`, assets `static/` → `public/`, `better-sqlite3` pointed at the existing
  `woodchuckers.db`, port the migration runner (baseline check working).
- **Phase 2 — Public pages.** `/`, `/portfolio`, `/areas`, `/links` as RSC. Port
  `areas.go`/`links.go` data. JSON-LD on home. Pixel/content parity with templates.
- **Phase 3 — Estimate.** Form + client calculator + tree builder + Server Action
  submit + validation + clamp + Resend email + 5/min rate limit. Verify a lead lands
  in `estimates` with a correct snapshot.
- **Phase 4 — Auth.** Sessions table logic, bcrypt login (test an **existing**
  account logs in), cookie, `requireAuth`/`requireAdmin` (confirm admin 404s for
  non-admins), login/logout/portal.
- **Phase 5 — Admin.** Employees list, create, toggle-active (can't disable self),
  invite (+email), last-50 estimates view.
- **Phase 6 — SSO.** Google OIDC + GitHub OAuth, state/nonce, pre-created-only,
  identical redirect URIs.
- **Phase 7 — Hardening.** Security headers, nonce CSP, themed error/404, rate
  limiters, robots/sitemap/OG, `Secure` cookie on.
- **Phase 8 — Deploy.** New Node `Dockerfile`, Fly single machine + the **same**
  `/data` volume, env parity, smoke test every route in §3, confirm row counts in the
  live DB are unchanged. Update `README.md` status tracker.

---

## 12. Environment (parity with `.env.example` / `env.go`)

Same variables, same meanings:

- `APP_BASE_URL` — external base URL (OAuth redirects, email links, OG/sitemap).
- `DATABASE_URL` — path to the SQLite file (`/data/woodchuckers.db` on Fly).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google SSO; unset = disabled.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub SSO; unset = disabled.
- `RESEND_API_KEY` — email; unset = invites/leads create accounts/rows but send no
  email. `MAIL_FROM` overrides the sender.
- Secrets load from a gitignored `.env` in dev (`loadDotEnv`); Next reads `.env.local`.
  **Never commit secrets. OAuth client secrets and the session table are not toys.**

### CLI parity

`go run . createuser <email> "<name>" <employee|admin> <password>` seeds the first
admin (no public signup). Provide an equivalent script (e.g. `npm run createuser`)
hitting the same `createEmployee` logic, so KING can bootstrap accounts without the
web UI.

---

## 13. Definition of done

- [ ] Every route in §3 responds identically (status, redirects, the admin-404 trick).
- [ ] An existing employee logs in with their existing password (bcrypt intact).
- [ ] A new estimate writes a row with the correct snapshot and emails `leadsTo`.
- [ ] Admin pages/actions 404 for non-admins; `requireAuth` redirects signed-out users.
- [ ] CSP + headers present; hydration works under nonce CSP; no `'unsafe-inline'`.
- [ ] Rate limits enforced (login 10/min, estimate 5/min, SSO 10/min → 429).
- [ ] Google + GitHub SSO complete against pre-created accounts only.
- [ ] robots/sitemap/OG/JSON-LD match; public pages excluded `/admin`.
- [ ] Lighthouse mobile performance ≥ 95; near-zero JS on `/`, `/portfolio`,
      `/areas`. WCAG AA contrast + tap targets + tappable phone/email.
- [ ] Live `woodchuckers.db` row counts unchanged after cutover; no schema rewrite.
- [ ] No Prisma. No ORM hiding the SQL. Raw prepared statements only.
- [ ] `README.md` status tracker updated to reflect the new stack.

---

_Port the behavior, preserve the data, keep it fast, don't touch the schema. When in
doubt, open the Go file named in each section and match what it actually does — not
what you assume a "standard" Next.js app would do._
