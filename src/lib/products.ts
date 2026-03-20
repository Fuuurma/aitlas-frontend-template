// src/lib/products.ts
/**
 * Aitlas product configuration.
 * Shared across all frontend products for unified navigation.
 *
 * Products:
 * - Nova (localhost:3000) - AI Chat & Agent Dashboard
 * - Agents Store (localhost:3001) - Browse & Hire AI Agents
 * - Actions (localhost:3002) - AI Tools & Workflows
 *
 * Active Actions (individual services):
 * - f.code (localhost:3773) - Code assistant
 * - f.improve (localhost:3200) - Code improvement
 * - f.library (localhost:3300) - Knowledge management
 * - f.research (localhost:3400) - Research assistant
 */

import {
  Zap,
  Bot,
  Store,
  Wrench,
  Search,
  Globe,
  Shield,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: typeof Zap;
  url: string;
  devUrl: string;
  ports: {
    web: number;
    server?: number;
  };
  items?: NavigationItem[];
}

export interface NavigationItem {
  title: string;
  url: string;
  icon?: typeof Zap;
  badge?: string;
}

// ─── Product Registry ─────────────────────────────────────────────

export const PRODUCTS: Record<string, Product> = {
  nova: {
    id: "nova",
    name: "Nova",
    description: "AI Chat & Agent Dashboard",
    icon: Zap,
    url: "https://nova.aitlas.xyz",
    devUrl: "http://localhost:3000",
    ports: { web: 3000 },
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Zap },
      { title: "Build", url: "/build", icon: Bot },
      { title: "Chat", url: "/chat", icon: MessageSquare },
      { title: "Agents", url: "/agents", icon: Bot },
      { title: "Credits", url: "/credits", icon: TrendingUp },
    ],
  },

  "agents-store": {
    id: "agents-store",
    name: "Agents Store",
    description: "Browse & Hire AI Agents",
    icon: Store,
    url: "https://store.aitlas.xyz",
    devUrl: "http://localhost:3001",
    ports: { web: 3001 },
    items: [
      { title: "Store", url: "/store", icon: Store },
      { title: "My Agents", url: "/my-agents", icon: Bot },
      { title: "Creators", url: "/creators", icon: Zap },
      { title: "Categories", url: "/categories", icon: Wrench },
    ],
  },
};

// ─── Active Actions ──────────────────────────────────────────────

export const ACTIONS: NavigationItem[] = [
  {
    title: "f.code",
    url: "http://localhost:3773",
    icon: Wrench,
    badge: "Internal",
  },
  {
    title: "f.improve",
    url: "http://localhost:3200",
    icon: Zap,
  },
  {
    title: "f.library",
    url: "http://localhost:3300",
    icon: Bot,
  },
  {
    title: "f.research",
    url: "http://localhost:3400",
    icon: Search,
  },
  {
    title: "f.scrape",
    url: "http://localhost:3500",
    icon: Globe,
  },
  {
    title: "f.support",
    url: "http://localhost:3600",
    icon: MessageSquare,
  },
  {
    title: "f.finance",
    url: "http://localhost:3700",
    icon: TrendingUp,
  },
  {
    title: "f.guard",
    url: "http://localhost:3800",
    icon: Shield,
  },
  {
    title: "f.deploy",
    url: "http://localhost:3900",
    icon: Wrench,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────

/**
 * Get product by ID.
 */
export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id];
}

/**
 * Get all products as array.
 */
export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}

/**
 * Get URL for product (dev or prod based on NODE_ENV).
 */
export function getProductUrl(product: Product, path?: string): string {
  const baseUrl =
    process.env.NODE_ENV === "development" ? product.devUrl : product.url;
  return path ? `${baseUrl}${path}` : baseUrl;
}

/**
 * Get action URL (actions are always on localhost in dev).
 */
export function getActionUrl(action: NavigationItem): string {
  return action.url;
}

/**
 * Check if we're in development mode.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Get all products except current.
 */
export function getOtherProducts(currentId: string): Product[] {
  return getAllProducts().filter((p) => p.id !== currentId);
}