# NAYXOR

**Trade the plan. Not the noise.**

A personal trading identity, public research & journal archive, and private trading headquarters — built with Next.js, PostgreSQL, Prisma, and Auth.js.

## Stack

- **App:** Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS 4
- **DB:** PostgreSQL + Prisma ORM
- **Auth:** Auth.js v5 — Google OAuth (owner-email allowlist) + credentials fallback
- **Motion:** motion (Framer Motion successor), `prefers-reduced-motion` aware
- **Charts:** Recharts (analytics), TradingView-ready watchlist
- **Fonts:** Space Grotesk + IBM Plex Mono (self-hosted via `next/font`)
- **Tests:** Vitest

## Setup

```bash
npm install
cp .env.example .env        # fill in values
npx prisma migrate dev      # create tables
npm run db:seed             # owner account + instruments + demo content
npm run dev                 # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Auth.js secret — `openssl rand -base64 32` |
| `AUTH_URL` | e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (metadata/OG) |
| `OWNER_EMAIL` | **The only email allowed to sign in** (Google + credentials) |
| `OWNER_PASSWORD` | Seed-only: initial credentials password |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |
| `XOOMAR economic calendar is keyless — no env var needed.

### Google sign-in (optional)

1. [console.cloud.google.com](https://console.cloud.google.com) → create a project → **APIs & Services → OAuth consent screen** (External, fill app name + your email).
2. **Credentials → Create → OAuth client ID → Web application**.
3. Authorized redirect URI: `{AUTH_URL}/api/auth/callback/google`.
4. Copy the client ID/secret into `.env`. The Google button appears on `/login` automatically.
5. Only `OWNER_EMAIL` can ever establish a session — enforced server-side in the `signIn` callback.

## Routes

| Public | Private (`/dashboard/*`, owner-only) |
|---|---|
| `/` homepage | `/dashboard` overview + session monitor |
| `/markets[/futures\|/forex\|/india]` | `/dashboard/journal[/new\|/id]` trade CRUD |
| `/journal[/slug]` case studies | `/dashboard/analytics` performance |
| `/outlook[/slug]` research | `/dashboard/calendar` activity heatmap |
| `/playbook` methodology | `/dashboard/playbook` setups & rules |
| `/about` identity | `/dashboard/watchlist` levels & bias |
| `/workspace` feature overview | `/dashboard/reviews` plan/checklists/reviews |
| | `/dashboard/economic` live release calendar + per-day private notes |
| `/login` owner sign-in | `/dashboard/content` CMS · `/dashboard/settings` |

## Privacy model

- Private data only lives behind `/dashboard` — route guard (`src/proxy.ts`) **plus** a per-request `requireUser()` check in the layout and every server action.
- Only the `OWNER_EMAIL` can sign in, ever (`src/auth.ts` `signIn` callback).
- Public journal entries are a separate `CaseStudy` entity — a trade never "leaks" into the public archive; publication is an explicit workflow (`toggleTradePublic`, CMS).
- Screenshots are stored under `storage/uploads` (gitignored) and served only to the authenticated owner via `/api/uploads`.
- No live market data is fabricated — watchlist/levels are manual; prices are never implied to be real-time.

## Calculations

P&L uses per-instrument `pointValue` (see `src/lib/calculations.ts`):

- `grossPnl = (exit − entry) × direction × positionSize × pointValue`
- `netPnl = grossPnl − fees` · `plannedRisk = |entry − stop| × size × pointValue` · `R = netPnl ÷ plannedRisk`
- Analytics formulas (win rate, expectancy, profit factor, drawdown) documented in `src/lib/analytics.ts` and covered by `src/**/*.test.ts`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run db:migrate` / `db:seed` / `db:studio` | Prisma workflows |

## Content management

The CMS (`/dashboard/content`) manages research articles, journal case studies, and public playbook entries — markdown with drafts, publish/unpublish, tags, SEO fields. Identity content (bio, timeline, socials, risk approach) is edited in `/dashboard/settings` and rendered on `/about`. Demo records are flagged `isDemo` and labeled publicly.

## Known limitations

- Local filesystem storage for screenshots — swap `src/app/api/uploads` for S3/object storage in production.
- Market data is manual-only by design (no licensed feed). Add a provider behind a service abstraction if needed.
- Rate limiting is in-memory — adequate for a single-owner deployment; use Redis for multi-instance.
