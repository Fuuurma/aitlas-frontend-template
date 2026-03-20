// src/lib/feature-flags.ts
/**
 * Feature flag system for gradual rollouts and A/B testing.
 * Integrates with LaunchDarkly, PostHog, or simple environment-based flags.
 *
 * @example
 * if (isFeatureEnabled("new-dashboard")) {
 *   renderNewDashboard();
 * } else {
 *   renderLegacyDashboard();
 * }
 *
 * // With variants
 * const variant = getFeatureVariant("pricing-test");
 * showPricing(variant); // "control" | "discount" | "premium"
 */

// ─── Types ────────────────────────────────────────────────────────

export type FeatureFlag = string;
export type FeatureVariant = string;

interface FeatureConfig {
  enabled: boolean;
  variant?: FeatureVariant;
  rollout?: number; // 0-100 percentage
  userId?: string;
}

// ─── Configuration ─────────────────────────────────────────────────

/**
 * Feature flags configuration.
 * In production, this would come from a feature flag service.
 */
const FEATURES: Record<FeatureFlag, FeatureConfig> = {
  // Example flags
  "new-dashboard": { enabled: false, rollout: 10 },
  "dark-mode-default": { enabled: true },
  "chat-streaming": { enabled: true },
  "pricing-test": { enabled: true, variant: "control" },
  "beta-features": { enabled: false },
};

// ─── Core Functions ────────────────────────────────────────────────

/**
 * Check if a feature is enabled.
 */
export function isFeatureEnabled(
  flag: FeatureFlag,
  userId?: string
): boolean {
  const config = FEATURES[flag];

  if (!config) {
    return false;
  }

  if (!config.enabled) {
    return false;
  }

  // Check rollout percentage
  if (config.rollout !== undefined && userId) {
    const hash = hashUserId(userId, flag);
    return hash < config.rollout;
  }

  return true;
}

/**
 * Get feature variant for A/B testing.
 */
export function getFeatureVariant(
  flag: FeatureFlag,
  userId?: string
): FeatureVariant | null {
  const config = FEATURES[flag];

  if (!config?.enabled) {
    return null;
  }

  // If variant is set, use it
  if (config.variant) {
    return config.variant;
  }

  // Otherwise, determine variant from user ID
  if (userId) {
    const hash = hashUserId(userId, flag);
    if (hash < 33) return "control";
    if (hash < 66) return "variant-a";
    return "variant-b";
  }

  return "control";
}

/**
 * Check if user is in a specific variant.
 */
export function isInVariant(
  flag: FeatureFlag,
  variant: FeatureVariant,
  userId?: string
): boolean {
  return getFeatureVariant(flag, userId) === variant;
}

/**
 * Get all enabled features for a user.
 */
export function getEnabledFeatures(userId?: string): FeatureFlag[] {
  return Object.keys(FEATURES).filter((flag) =>
    isFeatureEnabled(flag, userId)
  );
}

// ─── Utilities ────────────────────────────────────────────────────

/**
 * Hash user ID to a percentage (0-100).
 * Uses a simple but consistent hash function.
 */
function hashUserId(userId: string, flag: FeatureFlag): number {
  const str = `${userId}:${flag}`;
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to 0-100 range
  return Math.abs(hash) % 100;
}

// ─── React Hook ───────────────────────────────────────────────────

import { useState, useEffect } from "react";

/**
 * React hook for feature flags.
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flag));

  useEffect(() => {
    setEnabled(isFeatureEnabled(flag));
  }, [flag]);

  return enabled;
}

/**
 * React hook for feature variants.
 */
export function useFeatureVariant(
  flag: FeatureFlag
): FeatureVariant | null {
  const [variant, setVariant] = useState<FeatureVariant | null>(() =>
    getFeatureVariant(flag)
  );

  useEffect(() => {
    setVariant(getFeatureVariant(flag));
  }, [flag]);

  return variant;
}

/**
 * React hook for multiple feature flags.
 */
export function useFeatureFlags(flags: FeatureFlag[]): Record<FeatureFlag, boolean> {
  const [features, setFeatures] = useState<Record<FeatureFlag, boolean>>(() =>
    Object.fromEntries(flags.map((f) => [f, isFeatureEnabled(f)]))
  );

  useEffect(() => {
    setFeatures(
      Object.fromEntries(flags.map((f) => [f, isFeatureEnabled(f)]))
    );
  }, [flags.join(",")]);

  return features;
}