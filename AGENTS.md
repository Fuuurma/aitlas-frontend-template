# AGENTS.md — aitlas-frontend-template

## Stack
- Next.js 16 App Router + TypeScript strict mode
- Bun as package manager + runtime
- Tailwind v4 (CSS-first config, no `tailwind.config.ts`)
- shadcn/ui — 42 components installed
- Better Auth — email/password + session management
- Neon Postgres via `@neondatabase/serverless`
- Drizzle ORM — schema + migrations
- t3-env — type-safe environment variables

## Key Files
- `src/env.ts` — type-safe env vars (validated at boot)
- `src/server/db/schema.ts` — Drizzle schema (users, sessions, credits, api_keys)
- `src/server/auth.ts` — Better Auth config
- `src/lib/auth-client.ts` — Auth hooks for client
- `src/middleware.ts` — Route protection
- `src/app/globals.css` — Tailwind v4 theme

## Database Commands
```bash
# Generate migration from schema
bunx drizzle-kit generate

# Push to Neon
bunx drizzle-kit push

# Open Drizzle Studio
bunx drizzle-kit studio
```

## Conventions

### Server vs Client
- `"use server"` → server actions
- `"use client"` → hooks, event handlers
- `import "server-only"` → server-only files

### DB Access
- Always use `db` from `@/server/db`
- Schema types: `typeof users.$inferSelect`

### Auth
- Server: `getSession()` / `requireSession()` from `@/server/get-session`
- Client: `useSession()` from `@/lib/auth-client`

### Adding Components
```bash
bunx shadcn@latest add <component-name>
```

## Environment Variables
- `.env.local` — local secrets (gitignored)
- `.env.example` — template (committed)

## Neon Database
- Use `DATABASE_URL_UNPOOLED` for migrations
- Use `DATABASE_URL` (pooled) for runtime