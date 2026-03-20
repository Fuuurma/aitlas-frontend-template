// src/lib/async.ts
/**
 * Async utilities for handling promises, delays, and concurrency.
 *
 * @example
 * // Delay execution
 * await delay(1000);
 *
 * // Timeout a promise
 * const result = await withTimeout(fetchData(), 5000);
 *
 * // Run tasks in parallel with limit
 * const results = await parallel(tasks, { concurrency: 5 });
 *
 * // Retry with backoff
 * const data = await retry(() => fetchData(), { maxAttempts: 3 });
 */

// ─── Delay ────────────────────────────────────────────────────────

/**
 * Delay execution for specified milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Delay with random jitter (for retries).
 */
export function delayWithJitter(
  ms: number,
  jitterPercent: number = 0.1
): Promise<void> {
  const jitter = ms * jitterPercent * Math.random();
  return delay(ms + jitter);
}

// ─── Timeout ───────────────────────────────────────────────────────

export class TimeoutError extends Error {
  constructor(message: string = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Wrap a promise with a timeout.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(message));
    }, ms);
  });

  try {
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

// ─── Retry ─────────────────────────────────────────────────────────

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: number;
  maxDelay?: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Retry a function with exponential backoff.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 2,
    maxDelay = 30000,
    shouldRetry = () => true,
    onRetry,
  } = options;

  let lastError: unknown;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      onRetry?.(error, attempt);
      await delayWithJitter(currentDelay);
      currentDelay = Math.min(currentDelay * backoff, maxDelay);
    }
  }

  throw lastError;
}

// ─── Parallel Execution ────────────────────────────────────────────

export interface ParallelOptions {
  concurrency?: number;
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Run tasks in parallel with concurrency limit.
 */
export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  options: ParallelOptions = {}
): Promise<T[]> {
  const { concurrency = 10, onProgress } = options;
  const results: T[] = [];
  let completed = 0;

  const executeTask = async (task: () => Promise<T>, index: number) => {
    results[index] = await task();
    completed++;
    onProgress?.(completed, tasks.length);
  };

  // Split into batches
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    await Promise.all(batch.map((task, j) => executeTask(task, i + j)));
  }

  return results;
}

/**
 * Run tasks one at a time (sequential).
 */
export async function sequential<T>(
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}

// ─── Promise Utilities ─────────────────────────────────────────────

/**
 * Create a deferred promise (with external resolve/reject).
 */
export function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Wrap a promise to never throw (returns [error, result]).
 */
export async function safe<T>(
  promise: Promise<T>
): Promise<[error: unknown, result: T | null]> {
  try {
    return [null, await promise];
  } catch (error) {
    return [error, null];
  }
}

/**
 * Type guard for resolved promises.
 */
export function isSettled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

/**
 * Wait for all promises to settle, collect results.
 */
export async function settleAll<T>(
  promises: Promise<T>[]
): Promise<{
  fulfilled: T[];
  rejected: unknown[];
}> {
  const results = await Promise.allSettled(promises);

  const fulfilled = results
    .filter(isSettled)
    .map((r) => r.value);

  const rejected = results
    .filter((r) => r.status === "rejected")
    .map((r) => (r as PromiseRejectedResult).reason);

  return { fulfilled, rejected };
}

// ─── Rate Limiting for Async ───────────────────────────────────────

/**
 * Create a rate-limited function.
 */
export function rateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxCalls: number,
  windowMs: number
): T {
  const timestamps: number[] = [];

  return (async (...args: Parameters<T>) => {
    const now = Date.now();

    // Remove expired timestamps
    while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }

    // Check limit
    if (timestamps.length >= maxCalls) {
      const waitTime = timestamps[0] + windowMs - now;
      await delay(waitTime);
    }

    timestamps.push(Date.now());
    return fn(...args);
  }) as T;
}

// ─── Memoization ────────────────────────────────────────────────────

/**
 * Memoize an async function with TTL.
 */
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: { ttlMs?: number; key?: (...args: Parameters<T>) => string } = {}
): T {
  const cache = new Map<string, { value: any; expires: number }>();
  const { ttlMs = 60000, key = (...args) => JSON.stringify(args) } = options;

  return (async (...args: Parameters<T>) => {
    const k = key(...args);
    const cached = cache.get(k);

    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }

    const value = await fn(...args);
    cache.set(k, { value, expires: Date.now() + ttlMs });

    return value;
  }) as T;
}