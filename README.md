# Woodchuckers

Internal site + employee web app for Woodchuckers — a professional tree climber
in Colorado Springs. Public marketing site (home, portfolio, service areas,
links, contract climbing) plus a gated `/admin` staff app (login, portal, dashboard).

This is the **Next.js port** of the original Go server — a behavior-preserving
rewrite onto React Server Components + TypeScript, pointed at the **same SQLite
database** with the **same schema**. No data migration, no ORM.

---

## 📍 Where we are right now

| Area               | Status     | Notes                                                                |
| ------------------ | ---------- | ------------------------------------------------------------------- |
| HTTP server        | ✅ Done     | Next.js App Router (Node runtime), `:3000`                          |
| Database           | ✅ Done     | SQLite via `better-sqlite3`, same `woodchuckers.db`                 |
| Migrations         | ✅ Done     | reused `db/migrations/*.sql`, baseline runner on first boot         |
| Public pages       | ✅ Done     | `/`, `/portfolio`, `/areas`, `/links`, `/contract-climbing` — RSC   |
| Services pages     | ✅ Done     | `/services` + 7 B2B service pages, keyword clusters, schema         |
| Content hub (blog) | 🟡 Stubs   | `/blog` + 7 search-intent posts — intros real, bodies `draft: true` |
| Intake / lead form | ✅ Done     | `/contract-climbing` form + per-page lead-capture w/ attribution    |
| CRM pipeline       | ✅ Done     | admin lead pipeline: editable status, notes, stage filter, Source   |
| Login / logout     | ✅ Done     | bcrypt + server-side sessions + HttpOnly cookie                     |
| Admin dashboard    | ✅ Done     | employees + estimates, create/invite/toggle + SEO rank tracker      |
| SSO                | ✅ Done     | Google OIDC + GitHub OAuth, pre-created accounts only               |
| PWA                | ✅ Done     | installable staff PWA (`manifest.ts`)                              |
| Security           | ✅ Done     | headers, nonce CSP, rate limits, `Secure` cookie in prod           |
| SEO                | ✅ Done     | robots, sitemap, OG, LocalBusiness JSON-LD, internal link mesh      |
| Bilingual (ES)     | 🟡 Partial | `/es` covers core + areas; `/services` + `/blog` still EN-only      |
| Deploy             | ⬜ Ready    | Node `Dockerfile` + `fly.toml` (single machine + volume)            |
| Scheduling / hours | ⬜ Future   | `shifts` / `time_entries` tables exist, no UI yet (one-man phase)   |

## Stack

| Layer       | Choice                                                        |
| ----------- | ------------------------------------------------------------ |
| Language    | TypeScript, Node 22 LTS                                       |
| Framework   | Next.js App Router — React Server Components, Server Actions  |
| Database    | SQLite via `better-sqlite3` (native, synchronous) — raw SQL  |
| Auth        | bcrypt (`bcryptjs`) + server-side sessions, opaque cookie    |
| SSO         | hand-rolled OAuth + `jose` (Google id_token verification)    |
| Email       | Resend HTTP API (raw `fetch`)                                |
| Styling     | the original `style.css`, kept as `app/globals.css`          |
| Deploy      | Fly.io single machine + `/data` volume (Docker)              |

No ORM. No Prisma. Raw prepared statements you can read in `lib/`.

## Layout

```
app/                      # routes (RSC pages, Server Actions, route handlers)
  page.tsx                #  /  (home)
  portfolio|areas|links/  #  public pages
  estimate/               #  form + client calculator + submit action
  admin/                  #  login, portal, dashboard + mutation actions
  auth/{google,github}/   #  SSO login + callback route handlers
  robots.ts sitemap.ts    #  SEO
  error.tsx not-found.tsx #  themed 500 / 404
lib/                      # db, migrate, employees, estimates, session, auth,
                          #   ratelimit, mail, sso, areas, links, format, env
db/migrations/            # the SAME numbered SQL files (schema is sacred)
middleware.ts             # security headers + per-request nonce CSP
scripts/                  # createuser (CLI parity), smoke (verification)
public/img/               # site images (moved from static/img)
```

## Running (local dev)

```sh
npm install
npm run dev          # http://localhost:3000  (KING runs this)
```

`.env.local` points `DATABASE_URL` at `woodchuckers.dev.db` — a gitignored
snapshot — so the live DB is never touched in dev. Copy `.env.example` to
`.env.local` and fill in SSO / Resend keys to enable those features.

Seed an account (no public signup), CLI parity with `go run . createuser`:

```sh
npm run createuser <email> "<full name>" <employee|admin> <password>
# blank password ("") = SSO-only account
```

Verify the data layer without a browser (bcrypt, snapshot, helpers):

```sh
npm run smoke
```

## Environment

Same variables, same meanings as the Go app (`.env.example`):
`APP_BASE_URL`, `DATABASE_URL`, `GOOGLE_CLIENT_ID/SECRET`,
`GITHUB_CLIENT_ID/SECRET`, `RESEND_API_KEY`, `MAIL_FROM`. SSO/email are disabled
(buttons hidden, routes 404, no mail) unless their vars are set. **Never commit
secrets — `.env*.local` is gitignored.**

## Deploy (Fly.io)

One machine only — SQLite is single-writer and the rate limiter is in-process.
`fly.toml` mandates it. The container baselines a fresh `/data` volume on first
boot and leaves an already-migrated DB untouched.

```sh
fly deploy            # KING runs this at cutover
```

## Notes on fidelity (intentional deviations)

- **Fonts:** the live Go site's CSP (`style-src 'self'`) already blocks the
  Google Fonts link, so it renders in `system-ui`. This port preserves that
  exactly (no external font load). To actually ship Big Shoulders Display,
  self-host it and add a style nonce.
- **Rate-limit status:** the SSO GET routes return a real `429`. The estimate
  and login forms are Server Actions (a page route can't also be a raw POST
  handler in the App Router), so an over-limit hit there shows the same "too
  many requests" message inline instead of a 429 body. Same throttle, same
  limits (login 10/min, estimate 5/min, SSO 10/min).
- **Admin 404:** non-admins get the themed 404 (Go used a bare 404). Both are
  `404` and look identical to any public 404 — which better serves the
  "indistinguishable from a route that doesn't exist" goal.
- `requireAuth` redirect is a 307 (Next default) rather than Go's 303; for a GET
  it lands at `/admin/login` the same way.
```
