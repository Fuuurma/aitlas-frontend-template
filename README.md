# Aitlas Frontend Template

Production-ready Next.js 16 frontend template for Aitlas products.

## Stack

- **Next.js 16** — App Router, React Server Components
- **TypeScript** — Strict mode with full type safety
- **Bun** — Package manager and runtime
- **Tailwind v4** — CSS-first configuration
- **shadcn/ui** — 42 components installed
- **Better Auth** — Email/password authentication
- **Neon Postgres** — Serverless PostgreSQL
- **Drizzle ORM** — Type-safe database access

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Fill in your values in .env.local

# Push database schema
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
bun run dev        # Start dev server with Turbopack
bun run build      # Production build
bun run start      # Start production server
bun run lint       # Run ESLint
bun run type-check # TypeScript check

bun run db:generate # Generate Drizzle migration
bun run db:push     # Push schema to Neon
bun run db:studio   # Open Drizzle Studio
```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/    # Authenticated routes
│   │   ├── dashboard/  # Main dashboard
│   │   ├── chat/       # AI chat interface
│   │   ├── agents/     # Agent store
│   │   ├── credits/    # Credit management
│   │   └── settings/   # User settings & API keys
│   ├── sign-in/        # Login page
│   ├── sign-up/        # Registration page
│   ├── forgot-password/
│   └── reset-password/
├── components/
│   ├── ui/             # shadcn components
│   ├── dashboard-sidebar.tsx
│   └── chat-interface.tsx
├── lib/
│   ├── api.ts          # API client for backend
│   ├── auth-client.ts  # Better Auth client
│   └── utils.ts        # Utility functions
└── server/
    ├── auth.ts         # Better Auth config
    ├── get-session.ts  # Session helpers
    └── db/             # Database schema & client
```

## Authentication

This template uses Better Auth with email/password authentication:

- Sessions stored in Neon Postgres
- Shared with Phoenix backend via session token
- Protected routes use `requireSession()` server-side

## API Integration

The frontend communicates with the Phoenix backend:

```ts
import { apiFetchWithAuth, nexus } from "@/lib/api";

// User-authenticated request (uses session token)
const data = await apiFetchWithAuth("/api/user-endpoint");

// Nexus client convenience wrapper
await nexus.post("/endpoint", body, true); // true = with auth
```

## Environment Variables

Required in `.env.local`:

```bash
DATABASE_URL=            # Neon pooled connection
DATABASE_URL_UNPOOLED=   # Neon direct connection (migrations)
BETTER_AUTH_SECRET=      # 64-char hex secret
BETTER_AUTH_URL=         # http://localhost:3000
NEXT_PUBLIC_APP_URL=     # http://localhost:3000
FURMA_INTERNAL_SECRET=   # Service-to-service auth

# Optional (for Nexus integration)
NEXUS_API_URL=
NEXUS_API_KEY=
```

## Adding Components

```bash
bunx shadcn@latest add <component-name>
```

## License

Proprietary — All Aitlas products are closed source.