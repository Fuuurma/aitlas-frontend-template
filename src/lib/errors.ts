// src/lib/errors.ts
/**
 * Error handling utilities for Aitlas products.
 * Consistent error types and handling patterns.
 */

// ─── Error Types ──────────────────────────────────────────────────

/**
 * Base application error with code and metadata.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Authentication required error.
 */
export class AuthError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTH_REQUIRED", 401);
    this.name = "AuthError";
  }
}

/**
 * Permission denied error.
 */
export class PermissionError extends AppError {
  constructor(message: string = "Permission denied") {
    super(message, "PERMISSION_DENIED", 403);
    this.name = "PermissionError";
  }
}

/**
 * Resource not found error.
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

/**
 * Validation error.
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message, "VALIDATION_ERROR", 400, { errors });
    this.name = "ValidationError";
  }
}

/**
 * Rate limit error.
 */
export class RateLimitError extends AppError {
  constructor(retryAfter: number = 60) {
    super("Rate limit exceeded", "RATE_LIMIT", 429, { retryAfter });
    this.name = "RateLimitError";
  }
}

/**
 * Insufficient credits error.
 */
export class InsufficientCreditsError extends AppError {
  constructor(required: number, available: number) {
    super(
      `Insufficient credits. Required: ${required}, Available: ${available}`,
      "INSUFFICIENT_CREDITS",
      402,
      { required, available }
    );
    this.name = "InsufficientCreditsError";
  }
}

// ─── Error Parsing ─────────────────────────────────────────────────

/**
 * Parse API error response into AppError.
 */
export function parseApiError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Fetch error
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return new AppError("Network error. Please check your connection.", "NETWORK_ERROR", 0);
  }

  // Response object
  if (error instanceof Response) {
    return new AppError(
      `HTTP ${error.status}: ${error.statusText}`,
      "HTTP_ERROR",
      error.status
    );
  }

  // Error with response
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response: Response }).response;
    return new AppError(
      `HTTP ${response.status}: ${response.statusText}`,
      "HTTP_ERROR",
      response.status
    );
  }

  // Standard Error
  if (error instanceof Error) {
    return new AppError(error.message, "ERROR", 500);
  }

  // Unknown
  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
}

/**
 * Get user-friendly error message.
 */
export function getErrorMessage(error: unknown): string {
  const appError = parseApiError(error);

  // Map codes to user-friendly messages
  const messages: Record<string, string> = {
    AUTH_REQUIRED: "Please sign in to continue.",
    PERMISSION_DENIED: "You don't have permission to do that.",
    NOT_FOUND: "That doesn't exist or has been removed.",
    VALIDATION_ERROR: "Please check your input and try again.",
    RATE_LIMIT: "Too many requests. Please wait a moment.",
    INSUFFICIENT_CREDITS: "You don't have enough credits for this action.",
    NETWORK_ERROR: "Connection issue. Please try again.",
  };

  return messages[appError.code] ?? appError.message;
}

// ─── Error Handling Patterns ───────────────────────────────────────

/**
 * Wrap an async function with error handling.
 */
export function withErrorHandling<T>(
  fn: () => Promise<T>,
  onError?: (error: AppError) => void
): Promise<T | null> {
  return fn().catch((error) => {
    const appError = parseApiError(error);
    onError?.(appError);
    return null;
  });
}

/**
 * Retry a function with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delay = delayMs * Math.pow(backoff, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}