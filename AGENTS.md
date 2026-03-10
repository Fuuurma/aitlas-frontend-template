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

## Commands

### Development & Build
```bash
bun run dev        # Start dev server with Turbopack (localhost:3000)
bun run build      # Production build
bun run start      # Start production server
bun run lint       # Run ESLint
bun run type-check # TypeScript type check
```

### Database
```bash
bun run db:generate  # Generate migration from schema
bun run db:push      # Push schema changes to Neon
bun run db:migrate   # Run migrations
bun run db:studio    # Open Drizzle Studio (inspect data)
bun run db:drop      # Drop last migration
```

### Adding Components
```bash
bunx shadcn@latest add <component-name>
```

## Key Files
- `src/env.ts` — type-safe env vars (validated at boot)
- `src/server/db/schema.ts` — Drizzle schema (users, sessions, credits, api_keys)
- `src/server/auth.ts` — Better Auth config
- `src/lib/auth-client.ts` — Auth hooks for client
- `src/lib/api.ts` — Typed fetch wrapper for Nexus/Actions
- `src/lib/utils.ts` — Utility functions (cn, formatDate, formatCredits)
- `src/proxy.ts` — Route protection (Next.js 16 proxy convention)
- `src/app/globals.css` — Tailwind v4 theme with dark mode

## Auth Pages (Pre-built)
- `/sign-in` — Email/password sign in with callback URL support
- `/sign-up` — Email/password registration with validation
- `/forgot-password` — Password reset request form
- `/reset-password` — Password reset form (token from email)
- All pages use shadcn/ui Card, Input, Button, Label components
- Protected by `PUBLIC_ROUTES` in `src/proxy.ts`

## Dashboard Pages (Authenticated)
All dashboard routes require authentication. Unauthorized users redirect to `/sign-in`.

| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard with quick actions |
| `/chat` | AI chat interface for agent conversations |
| `/agents` | Agent store — browse and use AI agents |
| `/credits` | Credit balance and purchase options |
| `/settings` | User profile and BYOK API key management |

### Dashboard Layout
- Sidebar navigation with user info
- Responsive design (sidebar collapses on mobile)
- Uses `SidebarProvider`, `SidebarInset` from shadcn/ui

## API Integration

### Architecture
- Frontend (this template) uses Better Auth for authentication
- Sessions are stored in Neon Postgres (`sessions` table)
- Backend (Phoenix/Elixir) validates sessions via `Authorization: Bearer <token>`
- Both services share the same Neon database

### API Client (`src/lib/api.ts`)
```ts
// Internal/service-to-service (uses X-Furma-Internal header)
import { apiFetchInternal } from "@/lib/api";
const data = await apiFetchInternal("/internal/endpoint");

// User-authenticated (uses session token from cookie)
import { apiFetchWithAuth } from "@/lib/api";
const data = await apiFetchWithAuth("/api/user-endpoint");

// Nexus client (convenience wrapper)
import { nexus } from "@/lib/api";
await nexus.post("/endpoint", body, true); // true = with auth
await nexus.get("/endpoint", params, false); // false = internal
```

### Session Token Flow
1. User signs in via Better Auth (`/api/auth/[...all]`)
2. Better Auth creates session in `sessions` table with unique `token`
3. Token stored in cookie: `better-auth.session_token`
4. API calls include `Authorization: Bearer <token>` header
5. Backend validates token against `sessions` table

## Code Style Guidelines

### File Organization
- Add `// src/path/to/file.ts` comment at the top of each file
- Use kebab-case for filenames: `use-mobile.tsx`, `auth-client.ts`
- Place server code in `src/server/`, client code in `src/lib/` or `src/components/`

### Import Order
```ts
// 1. Third-party imports
import { betterAuth } from "better-auth";
import * as React from "react";

// 2. Internal imports with @/ alias
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Formatting
- 2-space indentation
- No trailing whitespace
- Omit semicolons (optional but preferred in this codebase)
- Use single quotes for strings
- Max line length: soft limit ~100 chars

### Naming Conventions
- `PascalCase` for components, types, interfaces: `Button`, `ThemeProvider`
- `camelCase` for functions, variables: `useSession`, `formatDate`
- `SCREAMING_SNAKE_CASE` for constants: `PUBLIC_ROUTES`, `MOBILE_BREAKPOINT`
- Prefix hooks with `use`: `useIsMobile`, `useSession`

### Type Safety
- Always annotate function parameters and return types
- Infer types from schema: `typeof users.$inferSelect`
- Export types used across modules: `export type Session = ...`
- Use `React.ComponentProps` for component prop extensions
- `noUncheckedIndexedAccess` enabled — always handle undefined from array/object access

### Server vs Client Boundaries
```ts
// Server actions
"use server";

// Client components (hooks, event handlers)
"use client";

// Server-only files
import "server-only";
```

### Component Patterns
- Use `React.forwardRef` for refs in shadcn components
- Use `cva` (class-variance-authority) for variant styling
- Combine `clsx` + `tailwind-merge` via `cn()` utility
- Export variant props type for consumers

### API Routes
- Return `NextResponse.json()` for responses
- Include error status codes: `{ status: 503 }`
- Use try/catch for database operations
- Handle errors gracefully with proper HTTP status

### Comments
- Use `//` for single-line comments
- Use `// ─── Title ──` for section dividers
- Avoid excessive comments — let code be self-documenting
- Document complex logic only

### Database Access
- Always import `db` from `@/server/db`
- Use `sql` template literal for raw queries
- Define relations in `src/server/db/schema.ts`
- Use cascade deletes for user data cleanup

### Auth Patterns
- Server: `getSession()` returns session or null
- Server: `requireSession()` throws if unauthorized
- Client: `useSession()` hook for components
- Protect routes via `src/proxy.ts` `PUBLIC_ROUTES` array

### Tailwind v4 Dark Mode
- Dark mode uses `@custom-variant dark (&:is(.dark *))`
- Dark theme colors defined in `.dark` class outside `@theme` block
- ThemeProvider applies `.dark` class to `<html>` element

## Environment Variables
- `.env.local` — local secrets (gitignored)
- `.env.example` — template (committed)
- Add to `src/env.ts` with Zod validation

## Neon Database
- Use `DATABASE_URL_UNPOOLED` for migrations
- Use `DATABASE_URL` (pooled) for runtime

## Nexus API Integration
- Use `nexus.post()` and `nexus.get()` from `@/lib/api` for type-safe calls
- Requires `NEXUS_API_URL` and `NEXUS_API_KEY` env vars