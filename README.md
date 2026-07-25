# StockLuhh

Smart household inventory tracker — low-stock alerts, expiry reminders, a shopping list, travel packing kits, and spending analytics. Built with Next.js (App Router), Drizzle ORM, and Neon Postgres, deployed on Vercel.

## Stack

- **Next.js 16** (App Router, Route Handlers for the API)
- **Drizzle ORM** + **Neon** serverless Postgres
- **TanStack Query** for client-side data fetching/caching
- Tailwind CSS + shadcn/ui primitives, neumorphic design system

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Neon database**

   - Sign up at [neon.tech](https://neon.tech) and create a project.
   - Copy the **pooled connection string** from the dashboard.

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Paste your Neon connection string into `.env.local` as `DATABASE_URL`.

4. **Push the schema to your database**

   ```bash
   npm run db:push
   ```

5. **(Optional) Seed sample data**

   ```bash
   npm run db:seed
   ```

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | Lint the codebase |
| `npm run db:push` | Push the Drizzle schema to your database (no migration files) |
| `npm run db:generate` | Generate versioned SQL migration files instead |
| `npm run db:studio` | Open Drizzle Studio to browse your data |
| `npm run db:seed` | Seed sample inventory/wishlist/travel-kit data |

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new) — it auto-detects Next.js, no config needed.
3. Add the `DATABASE_URL` environment variable in the Vercel project settings (same value as `.env.local`).
4. Deploy. Run `npm run db:push` once (locally, pointed at the same `DATABASE_URL`) before first deploy so the production database has the schema.

## Project structure

```
app/                    # Next.js App Router — pages + API route handlers
  api/                  #   REST endpoints (items, wishlist, travel-kits)
  (pages)/              #   Dashboard, Inventory, Shopping, Expiry, Wishlist, Travel, Analytics
components/             # UI components (shadcn primitives, dashboard/inventory widgets, layout shell)
hooks/                  # useInventory (React Query + fetch), PWA/preference hooks
lib/
  db/                   # Drizzle schema, db client, seed script
  formatters.ts, smart-suggestions.ts, smart-substitutions.ts, ...
types/                  # Shared TypeScript types
```

## Known gaps (carried over from the Next.js migration)

- **No real offline support yet.** The previous Vite build used `vite-plugin-pwa` for a service worker with offline caching; that hasn't been rebuilt on Next.js. The app is still installable (see `app/manifest.ts`), just not offline-capable yet. `@ducanh2912/next-pwa` is the usual path if you want to add this back.
- **Undo is best-effort.** `undoLastAction` reverses the last add/update/delete by re-calling the API (a restored deleted item gets a new id). Fine for accidental clicks, not a true history/versioning system.
- **No auth / multi-user yet.** Everyone who can reach the deployed URL shares one inventory. Household sharing and per-user accounts are natural next steps once this is deployed.
