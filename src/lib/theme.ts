// src/lib/theme.ts
/**
 * Shared theme configuration for Aitlas products.
 *
 * All products use the same:
 * - Color palette
 * - Typography
 * - Spacing
 * - Dark mode support
 *
 * CSS Variables are defined in src/app/globals.css
 */

export const AITLAS_THEME = {
  // Colors match globals.css
  colors: {
    primary: "hsl(262 83% 58%)", // Purple
    secondary: "hsl(240 5% 26%)",
    accent: "hsl(262 83% 58%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 3%)",
    muted: "hsl(240 5% 96%)",
    border: "hsl(240 6% 90%)",
  },

  // Dark mode colors
  dark: {
    background: "hsl(240 10% 3%)",
    foreground: "hsl(0 0% 98%)",
    muted: "hsl(240 4% 16%)",
    border: "hsl(240 4% 16%)",
  },

  // Typography
  fonts: {
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },

  // Spacing scale (matches Tailwind)
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  // Border radius
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
} as const;

// ─── Product Brand Colors ────────────────────────────────────────

export const PRODUCT_COLORS: Record<string, { primary: string; accent: string }> = {
  nova: {
    primary: "hsl(262 83% 58%)", // Purple
    accent: "hsl(280 83% 58%)",
  },
  "agents-store": {
    primary: "hsl(142 76% 36%)", // Green
    accent: "hsl(160 76% 36%)",
  },
  actions: {
    primary: "hsl(24 95% 53%)", // Orange
    accent: "hsl(34 95% 53%)",
  },
};

// ─── CSS Variable Helpers ────────────────────────────────────────

/**
 * Get CSS variable for a color.
 */
export function cssVar(name: string, alpha?: number): string {
  const base = `var(--${name})`;
  if (alpha !== undefined) {
    return `hsl(from ${base} h s l / ${alpha})`;
  }
  return base;
}

/**
 * Apply product-specific theme colors.
 * Call this in a layout or _app.tsx to customize per-product.
 */
export function applyProductTheme(productId: string): void {
  if (typeof window === "undefined") return;

  const colors = PRODUCT_COLORS[productId];
  if (!colors) return;

  const root = document.documentElement;
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--accent", colors.accent);
}