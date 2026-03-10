# aitlas-ui-template — Build Guide
**Stack:** Next.js 16 · Bun · Tailwind v4 · shadcn/ui · Better Auth · Neon Postgres  
**Status:** Canonical V1 | Supersedes all prior versions

> This is the base template for: Nova (zones), Agents Store FE, all Actions FE.  
> Follow this guide exactly. Do not deviate. Every section is tested.

---

## What You Get Out of the Box

- ✅ Next.js 16 App Router + TypeScript strict mode
- ✅ Bun as package manager + runtime
- ✅ Tailwind v4 (CSS-first config, no `tailwind.config.ts`)
- ✅ shadcn/ui — all components installed
- ✅ Better Auth — email/password + session management
- ✅ Neon Postgres — connected via `@neondatabase/serverless`
- ✅ Drizzle ORM — schema + migrations + studio
- ✅ t3-env — type-safe environment variables
- ✅ `next/font` — Geist font pre-loaded
- ✅ Health check route (`/api/health`)
- ✅ Auth routes (`/api/auth/[...all]`)
- ✅ Dark mode via `next-themes`
- ✅ `.env.local` template ready to fill

---

## Prerequisites

```bash
# Bun (install if not present)
curl -fsSL https://bun.sh/install | bash

# Verify
bun --version   # ≥ 1.1.x
node --version  # ≥ 22.x (Next.js 16 requirement)
```

---

## Step 1 — Scaffold the Project

```bash
bunx create-next-app@latest aitlas-ui-template \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-bun

cd aitlas-ui-template
```

When prompted:
- Use App Router: **Yes**
- Customize default import alias: **Yes → `@/*`**

---

## Step 2 — Install Core Dependencies

```bash
# Database
bun add @neondatabase/serverless drizzle-orm
bun add -d drizzle-kit

# Auth
bun add better-auth

# Environment validation
bun add @t3-oss/env-nextjs zod

# Utilities
bun add server-only clsx tailwind-merge class-variance-authority

# UI extras
bun add next-themes lucide-react
bun add @radix-ui/react-icons

# Date handling
bun add date-fns

# Type-safe fetch
bun add @tanstack/react-query
```

---

## Step 3 — Tailwind v4 Setup

Tailwind v4 is **CSS-first** — no `tailwind.config.ts`. Remove the scaffolded one if it exists.

```bash
# Remove old config (create-next-app may have added v3)
rm -f tailwind.config.ts tailwind.config.js postcss.config.js postcss.config.mjs

# Install Tailwind v4
bun add tailwindcss@next @tailwindcss/postcss@next
```

Create `postcss.config.mjs`:

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Replace `src/app/globals.css` entirely:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: oklch(0.98 0 0);
  --color-foreground: oklch(0.09 0 0);
  --color-card: oklch(0.98 0 0);
  --color-card-foreground: oklch(0.09 0 0);
  --color-popover: oklch(0.98 0 0);
  --color-popover-foreground: oklch(0.09 0 0);
  --color-primary: oklch(0.09 0 0);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-secondary: oklch(0.96 0 0);
  --color-secondary-foreground: oklch(0.09 0 0);
  --color-muted: oklch(0.96 0 0);
  --color-muted-foreground: oklch(0.45 0 0);
  --color-accent: oklch(0.96 0 0);
  --color-accent-foreground: oklch(0.09 0 0);
  --color-destructive: oklch(0.57 0.22 27.53);
  --color-destructive-foreground: oklch(0.98 0 0);
  --color-border: oklch(0.92 0 0);
  --color-input: oklch(0.92 0 0);
  --color-ring: oklch(0.09 0 0);
  --radius: 0.5rem;

  /* Dark mode overrides */
  &.dark {
    --color-background: oklch(0.09 0 0);
    --color-foreground: oklch(0.98 0 0);
    --color-card: oklch(0.09 0 0);
    --color-card-foreground: oklch(0.98 0 0);
    --color-popover: oklch(0.09 0 0);
    --color-popover-foreground: oklch(0.98 0 0);
    --color-primary: oklch(0.98 0 0);
    --color-primary-foreground: oklch(0.09 0 0);
    --color-secondary: oklch(0.16 0 0);
    --color-secondary-foreground: oklch(0.98 0 0);
    --color-muted: oklch(0.16 0 0);
    --color-muted-foreground: oklch(0.64 0 0);
    --color-accent: oklch(0.16 0 0);
    --color-accent-foreground: oklch(0.98 0 0);
    --color-destructive: oklch(0.39 0.14 25.77);
    --color-destructive-foreground: oklch(0.98 0 0);
    --color-border: oklch(0.16 0 0);
    --color-input: oklch(0.16 0 0);
    --color-ring: oklch(0.83 0 0);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

---

## Step 4 — Install shadcn/ui

```bash
# Initialize shadcn for Tailwind v4
bunx shadcn@latest init
```

When prompted, select:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**

Then install all components at once:

```bash
bunx shadcn@latest add --all
```

This installs every component into `src/components/ui/`. Takes ~60 seconds.

Verify `components.json` looks like:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## Step 5 — Fonts

Replace the font setup in `src/app/layout.tsx`:

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aitlas",
  description: "Sovereign AI. Your keys. Your agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Install Geist:

```bash
bun add geist
```

Create `src/components/theme-provider.tsx`:

```tsx
// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

## Step 6 — Environment Variables

Create `.env.local`:

```bash
# ─── Database (Neon) ───────────────────────────────────────────
# Get from: console.neon.tech → your project → Connection string
# Use POOLED URL for runtime, DIRECT for migrations
DATABASE_URL="postgresql://username:password@ep-xxx.eu-west-2.aws.neon.tech/aitlas?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://username:password@ep-xxx.eu-west-2.aws.neon.tech/aitlas?sslmode=require"

# ─── Auth (Better Auth) ────────────────────────────────────────
# Generate: openssl rand -hex 32
BETTER_AUTH_SECRET="your-64-char-hex-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# ─── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# ─── Internal service auth ─────────────────────────────────────
FURMA_INTERNAL_SECRET="your-internal-secret-here"

# ─── Nexus (only needed for products that call Nexus) ──────────
# NEXUS_API_URL="http://localhost:4000"
# NEXUS_API_KEY="your-nexus-key"
```

Create `.env.example` (committed to git — no real secrets):

```bash
DATABASE_URL=""
DATABASE_URL_UNPOOLED=""
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
FURMA_INTERNAL_SECRET=""
# NEXUS_API_URL=""
# NEXUS_API_KEY=""
```

Add `.env.local` to `.gitignore` (should already be there, verify).

---

## Step 7 — Type-Safe Environment (t3-env)

Create `src/env.ts`:

```ts
// src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_URL_UNPOOLED: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    FURMA_INTERNAL_SECRET: z.string().min(16),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXUS_API_URL: z.string().url().optional(),
    NEXUS_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    FURMA_INTERNAL_SECRET: process.env.FURMA_INTERNAL_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NEXUS_API_URL: process.env.NEXUS_API_URL,
    NEXUS_API_KEY: process.env.NEXUS_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

---

## Step 8 — Database (Drizzle + Neon)

### 8a. Drizzle config

Create `drizzle.config.ts` at project root:

```ts
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
} satisfies Config;
```

### 8b. DB client

Create `src/server/db/index.ts`:

```ts
// src/server/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "@/env";

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
export type DB = typeof db;
```

### 8c. Base schema

Create `src/server/db/schema.ts`:

```ts
// src/server/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

// ─── Users ────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Sessions (Better Auth) ───────────────────────────────────
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ─── Accounts (OAuth / credentials) ──────────────────────────
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Verification tokens ──────────────────────────────────────
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Credit ledger (append-only) ─────────────────────────────
export const creditLedger = pgTable("credit_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),       // positive = credit, negative = debit
  balance: integer("balance").notNull(),     // snapshot after this entry
  reason: text("reason").notNull(),          // "task_complete" | "purchase" | "refund" etc.
  referenceId: text("reference_id"),         // task_id, stripe_payment_id, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── API keys (BYOK, encrypted) ──────────────────────────────
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),      // "openai" | "anthropic" | "gemini"
  encryptedKey: text("encrypted_key").notNull(),
  iv: text("iv").notNull(),                  // AES-256-GCM initialization vector
  hint: text("hint"),                        // last 4 chars, for display only
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 8d. Run migration

```bash
# Generate migration from schema
bunx drizzle-kit generate

# Push to Neon (dev)
bunx drizzle-kit push

# Verify in Drizzle Studio
bunx drizzle-kit studio
```

---

## Step 9 — Better Auth

### 9a. Auth server config

Create `src/server/auth.ts`:

```ts
// src/server/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,     // set true in production
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,                    // 5 minutes client cache
    },
    expiresIn: 60 * 60 * 24 * 7,        // 7 days
    updateAge: 60 * 60 * 24,            // refresh if older than 1 day
  },

  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
    "https://*.aitlas.xyz",
    "https://*.f.xyz",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

### 9b. Auth API route

Create `src/app/api/auth/[...all]/route.ts`:

```ts
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 9c. Auth client

Create `src/lib/auth-client.ts`:

```ts
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;
```

### 9d. Auth middleware

Create `src/middleware.ts`:

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "better-auth/next-js";
import { auth } from "@/server/auth";

const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/api/health",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 9e. Server helper — get session

Create `src/server/get-session.ts`:

```ts
// src/server/get-session.ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { cache } from "react";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const requireSession = cache(async () => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
});
```

---

## Step 10 — Utilities

Create `src/lib/utils.ts`:

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCredits(credits: number) {
  return credits.toLocaleString();
}
```

Create `src/lib/api.ts` — typed fetch wrapper for calling Nexus/Actions:

```ts
// src/lib/api.ts
import "server-only";
import { env } from "@/env";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Furma-Internal": env.FURMA_INTERNAL_SECRET,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error ${response.status}: ${error}`);
  }

  return response.json() as Promise<T>;
}

// Nexus client (only in services that connect to Nexus)
export const nexus = {
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(env.NEXUS_API_URL!, path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: env.NEXUS_API_KEY ? { Authorization: `Bearer ${env.NEXUS_API_KEY}` } : {},
    }),
  get: <T>(path: string, params?: Record<string, string>) =>
    apiFetch<T>(env.NEXUS_API_URL!, path, { params }),
};
```

---

## Step 11 — Health Check Route

Create `src/app/api/health/route.ts`:

```ts
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", db: "disconnected" },
      { status: 503 }
    );
  }
}
```

---

## Step 12 — Next.js Config

Replace `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from "next";
import "./src/env"; // validate env at build time

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  experimental: {
    typedRoutes: true,
  },

  // Silence noisy server logs in dev
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
```

---

## Step 13 — TypeScript Config

Replace `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Step 14 — Package Scripts

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:drop": "drizzle-kit drop"
  }
}
```

---

## Step 15 — AGENTS.md

Create `AGENTS.md` at project root (AI coding assistant context):

```markdown
# AGENTS.md — aitlas-ui-template

## Stack
- Next.js 16, App Router, TypeScript strict mode
- Bun (package manager and runtime)
- Tailwind v4 (CSS-first, no tailwind.config.ts)
- shadcn/ui (all components in src/components/ui/)
- Better Auth (email/password, sessions in Neon Postgres)
- Drizzle ORM + Neon Postgres (@neondatabase/serverless)
- t3-env for type-safe environment variables

## Key Files
- `src/env.ts` — all environment variables (import from here, never from process.env)
- `src/server/db/index.ts` — database client
- `src/server/db/schema.ts` — Drizzle schema (add new tables here)
- `src/server/auth.ts` — Better Auth server config
- `src/lib/auth-client.ts` — Better Auth client (use in components)
- `src/server/get-session.ts` — server-side session helpers
- `src/lib/utils.ts` — cn() and shared utilities
- `src/lib/api.ts` — typed fetch wrapper for Nexus/Actions

## Conventions
- Server components are default. Add "use client" only when necessary.
- All DB queries must include userId filter — no cross-tenant access
- Use `requireSession()` in server actions and API routes
- Never read from `process.env` directly — always import from `@/env`
- All mutations: use Drizzle transactions
- Credit deductions: append to credit_ledger, never UPDATE a balance column
- Encrypted fields (api_keys): never log, never assign to named variable

## Adding a new page
1. Create `src/app/(your-route)/page.tsx`
2. Server component by default
3. Call `requireSession()` if auth required
4. Fetch data inline (no useEffect for initial data)

## Adding a new API route
1. Create `src/app/api/(your-route)/route.ts`
2. Validate session first
3. Validate input with Zod
4. Wrap DB mutations in transactions

## Adding a DB table
1. Add to `src/server/db/schema.ts`
2. Run `bun db:generate` then `bun db:push`
```

---

## Step 16 — Final Structure

Verify your file tree looks like:

```
aitlas-ui-template/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts
│   │   │   └── health/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/           ← shadcn components
│   │   └── theme-provider.tsx
│   ├── hooks/            ← shadcn hooks
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── auth-client.ts
│   │   └── api.ts
│   ├── server/
│   │   ├── auth.ts
│   │   ├── get-session.ts
│   │   └── db/
│   │       ├── index.ts
│   │       └── schema.ts
│   ├── middleware.ts
│   └── env.ts
├── drizzle/              ← generated migrations
├── AGENTS.md
├── AGENTS.md
├── .env.local
├── .env.example
├── components.json
├── drizzle.config.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## Step 17 — First Run

```bash
# Verify env is valid
bun run type-check

# Push schema to Neon
bun db:push

# Start dev server
bun dev
```

Open `http://localhost:3000/api/health` — should return:

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-03-10T..."
}
```

---

## Common Issues

**`Cannot find module 'geist/font/sans'`**
```bash
bun add geist
```

**Tailwind styles not applying**
Ensure `postcss.config.mjs` uses `@tailwindcss/postcss` (not the old `tailwindcss` plugin).

**Better Auth session not persisting**
Check `BETTER_AUTH_URL` matches exactly where the app runs (including port).

**Drizzle push fails**
Use `DATABASE_URL_UNPOOLED` in `drizzle.config.ts` — pooled connections time out on schema operations.

**shadcn component missing**
```bash
bunx shadcn@latest add <component-name>
# or reinstall all
bunx shadcn@latest add --all
```

---

## Neon Setup Reference

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create project: `aitlas-production` | Region: `eu-west-2`
3. Create database: `aitlas` (or per-product: `nexus`, `agents`, etc.)
4. Copy connection strings:
   - **Pooled** (has `?pgbouncer=true`) → `DATABASE_URL`
   - **Direct** (no pooler suffix) → `DATABASE_URL_UNPOOLED`
5. Enable pgvector extension (for products using vector memory):
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

---

*Template maintained by Herb (AI CTO). Do not modify this template directly — fork it per product.*
