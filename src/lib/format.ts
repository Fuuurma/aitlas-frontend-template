// src/lib/format.ts
/**
 * Formatting utilities for Aitlas products.
 * Consistent formatting across all actions and services.
 */

// ─── Credits ─────────────────────────────────────────────────────

/**
 * Format credit amount with appropriate suffix.
 * 1,000 → "1K", 1,500,000 → "1.5M"
 */
export function formatCredits(credits: number): string {
  if (credits >= 1_000_000) {
    return `${(credits / 1_000_000).toFixed(1)}M`;
  }
  if (credits >= 1_000) {
    return `${(credits / 1_000).toFixed(1)}K`;
  }
  return credits.toString();
}

/**
 * Format credit cost with sign.
 * -100 → "-100 credits", 50 → "+50 credits"
 */
export function formatCreditChange(amount: number): string {
  const sign = amount >= 0 ? "+" : "";
  return `${sign}${amount} credits`;
}

// ─── Currency ────────────────────────────────────────────────────

/**
 * Format currency amount.
 * 12.99 → "$12.99", 1000 → "$1,000.00"
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// ─── Dates ────────────────────────────────────────────────────────

/**
 * Format relative time.
 * "just now", "5m ago", "2h ago", "Mar 15", "Mar 15, 2024"
 */
export function formatRelativeTime(date: Date | number | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return then.toLocaleDateString("en-US", { weekday: "short" });

  const currentYear = now.getFullYear();
  const thenYear = then.getFullYear();

  if (thenYear === currentYear) {
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date for display.
 * "Mar 15, 2024" or custom format
 */
export function formatDate(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

/**
 * Format time for display.
 * "3:30 PM"
 */
export function formatTime(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format datetime for display.
 * "Mar 15, 2024 at 3:30 PM"
 */
export function formatDateTime(date: Date | number | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// ─── Numbers ──────────────────────────────────────────────────────

/**
 * Format number with commas.
 * 1000000 → "1,000,000"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Format percentage.
 * 0.156 → "15.6%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format bytes to human readable.
 * 1024 → "1 KB", 1536 → "1.5 KB"
 */
export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

// ─── Strings ──────────────────────────────────────────────────────

/**
 * Truncate string with ellipsis.
 * "Hello World" → "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter.
 * "hello" → "Hello"
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to Title Case.
 * "credit_ledger" → "Credit Ledger"
 */
export function snakeToTitle(str: string): string {
  return str
    .split("_")
    .map(capitalize)
    .join(" ");
}

/**
 * Generate initials from name.
 * "John Doe" → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

// ─── Validation ────────────────────────────────────────────────────

/**
 * Check if email is valid.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if URL is valid.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}