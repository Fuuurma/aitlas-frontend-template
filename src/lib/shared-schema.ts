// src/lib/shared-schema.ts
/**
 * Shared schema imports from @aitlas/schema
 *
 * This file re-exports types from the shared schema package.
 * Use these types for type-safe API calls and data validation.
 *
 * SETUP:
 * 1. Ensure @aitlas/schema is built: `cd ../aitlas-schema && bun run build`
 * 2. Or install from npm: `bun add @aitlas/schema` (when published)
 *
 * For Drizzle ORM imports, use:
 *   import { users, sessions, ... } from "@aitlas/schema/drizzle"
 *
 * For local development, the package is linked via file:../aitlas-schema
 */

// ─── Conditional Imports ───────────────────────────────────────
// These will work once @aitlas/schema is built

// For now, export placeholder types that can be replaced
// when @aitlas/schema is properly set up

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description?: string | null;
  category: string;
  role: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export type AgentRole = "assistant" | "worker" | "orchestrator" | "specialist";
export type AgentStatus = "draft" | "published" | "archived";

export interface Task {
  id: string;
  userId: string;
  agentSlug: string;
  goal: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  iteration: number;
  toolCallsMade: number;
  tokensUsed: number;
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  balance: number;
  reason: string;
  referenceId?: string | null;
  createdAt: Date;
}

export type CreditReason = 
  | "purchase"
  | "usage"
  | "refund"
  | "bonus"
  | "subscription";

export interface McpTool {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpServer {
  id: string;
  name: string;
  url: string;
  transport: "stdio" | "http" | "websocket";
}

export type McpConnection = {
  id: string;
  serverId: string;
  status: "connected" | "disconnected" | "error";
};

export interface Memory {
  id: string;
  userId: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEpisode {
  id: string;
  memoryId: string;
  content: string;
  embedding?: number[] | null;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  provider: string;
  hint?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ApiKeyProvider = "openai" | "anthropic" | "google" | "openrouter";

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: "active" | "cancelled" | "expired";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export type PlanTier = "free" | "pro" | "enterprise";

// ─── Helper: Get Drizzle Schema ────────────────────────────────
/**
 * Import Drizzle schema directly for database operations:
 *
 * ```ts
 * // When @aitlas/schema is set up:
 * import { users, sessions } from "@aitlas/schema/drizzle";
 * import { db } from "@/server/db";
 *
 * const user = await db.select().from(users).where(eq(users.id, userId));
 * ```
 *
 * For now, use local schema from "@/server/db/schema"
 */
export { users, sessions, accounts, verifications, creditLedger, apiKeys } from "@/server/db/schema";