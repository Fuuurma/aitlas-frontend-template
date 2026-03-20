// src/lib/rate-limit.ts
/**
 * Client-side rate limiting utilities.
 * Prevents abuse and manages request throttling.
 *
 * @example
 * // Simple rate limit (5 requests per minute)
 * const limiter = new RateLimiter(5, 60000);
 * if (limiter.tryAcquire()) { makeRequest(); }
 *
 * // Sliding window rate limiter
 * const apiLimiter = createRateLimiter({ max: 100, windowMs: 60000 });
 * await apiLimiter.execute(() => fetch('/api/data'));
 */

export interface RateLimitConfig {
  max: number;
  windowMs: number;
  key?: string;
}

export class RateLimiter {
  protected timestamps: number[] = [];
  private readonly max: number;
  private readonly windowMs: number;

  constructor(max: number, windowMs: number) {
    this.max = max;
    this.windowMs = windowMs;
  }

  /**
   * Try to acquire a slot. Returns true if allowed.
   */
  tryAcquire(): boolean {
    const now = Date.now();

    // Remove expired timestamps
    this.timestamps = this.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );

    // Check if we're at the limit
    if (this.timestamps.length >= this.max) {
      return false;
    }

    // Record this request
    this.timestamps.push(now);
    return true;
  }

  /**
   * Get remaining slots in current window.
   */
  getRemaining(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );
    return Math.max(0, this.max - this.timestamps.length);
  }

  /**
   * Get time until next slot is available (ms).
   */
  getWaitTime(): number {
    if (this.getRemaining() > 0) {
      return 0;
    }

    const oldest = this.timestamps[0];
    if (!oldest) {
      return 0;
    }

    return Math.max(0, this.windowMs - (Date.now() - oldest));
  }

  /**
   * Reset the rate limiter.
   */
  reset(): void {
    this.timestamps = [];
  }
}

/**
 * Persistent rate limiter using localStorage.
 * Survives page reloads.
 */
export class PersistentRateLimiter extends RateLimiter {
  private readonly key: string;

  constructor(max: number, windowMs: number, key: string) {
    super(max, windowMs);
    this.key = `rate_limit_${key}`;
    this.load();
  }

  private load() {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(this.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.timestamps = parsed.filter(
          (ts: number) => Date.now() - ts < this["windowMs"]
        );
      }
    } catch {
      // Ignore parse errors
    }
  }

  private save() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.key, JSON.stringify(this.timestamps));
    } catch {
      // Storage full or blocked
    }
  }

  tryAcquire(): boolean {
    const result = super.tryAcquire();
    this.save();
    return result;
  }

  reset(): void {
    super.reset();
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.key);
    }
  }
}

/**
 * Create a rate limiter with execute helper.
 */
export function createRateLimiter(config: RateLimitConfig) {
  const limiter = config.key
    ? new PersistentRateLimiter(config.max, config.windowMs, config.key)
    : new RateLimiter(config.max, config.windowMs);

  return {
    limiter,

    /**
     * Execute a function with rate limiting.
     * Throws if rate limited.
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
      if (!limiter.tryAcquire()) {
        const waitTime = limiter.getWaitTime();
        throw new Error(
          `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)}s.`
        );
      }
      return fn();
    },

    /**
     * Execute with automatic retry after rate limit.
     */
    async executeWithRetry<T>(
      fn: () => Promise<T>,
      maxRetries: number = 3
    ): Promise<T> {
      let retries = 0;

      while (retries < maxRetries) {
        if (limiter.tryAcquire()) {
          return fn();
        }

        const waitTime = limiter.getWaitTime();
        await new Promise((r) => setTimeout(r, waitTime));
        retries++;
      }

      throw new Error("Rate limit exceeded after retries");
    },

    getRemaining: () => limiter.getRemaining(),
    getWaitTime: () => limiter.getWaitTime(),
    reset: () => limiter.reset(),
  };
}

// ─── Pre-configured limiters ─────────────────────────────────────

export const apiRateLimiter = createRateLimiter({
  max: 100,
  windowMs: 60000, // 100 req/min
  key: "api",
});

export const searchRateLimiter = createRateLimiter({
  max: 20,
  windowMs: 60000, // 20 searches/min
  key: "search",
});

export const chatRateLimiter = createRateLimiter({
  max: 30,
  windowMs: 60000, // 30 messages/min
  key: "chat",
});