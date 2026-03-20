// src/lib/logger.ts
/**
 * Structured logging for frontend applications.
 * Integrates with observability platforms (Datadog, Sentry, LogRocket).
 *
 * @example
 * logger.info("User signed in", { userId: user.id });
 * logger.error("API request failed", { error: err.message, endpoint });
 * logger.warn("Rate limit approaching", { remaining: 10 });
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

class Logger {
  private context: Record<string, unknown> = {};
  private userId: string | undefined;
  private sessionId: string | undefined;

  setUserId(userId: string | undefined) {
    this.userId = userId;
  }

  setSessionId(sessionId: string | undefined) {
    this.sessionId = sessionId;
  }

  setContext(context: Record<string, unknown>) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log("error", message, context);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...context },
      userId: this.userId,
      sessionId: this.sessionId,
    };

    // In development, log to console with formatting
    if (process.env.NODE_ENV === "development") {
      const styles = {
        debug: "color: gray",
        info: "color: blue",
        warn: "color: orange",
        error: "color: red",
      };

      console.log(
        `%c[${level.toUpperCase()}] ${message}`,
        styles[level],
        entry.context
      );
      return;
    }

    // In production, send to observability platform
    if (level === "error") {
      // Send to error tracking (Sentry, Datadog, etc.)
      this.sendToErrorTracker(entry);
    }

    // Always log to console in production (for logs collection)
    console.log(JSON.stringify(entry));
  }

  private sendToErrorTracker(entry: LogEntry) {
    // Integration point for Sentry, Datadog, etc.
    // Example: Sentry.captureException(new Error(entry.message), { extra: entry.context });

    // For now, just log
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(entry.message, {
        level: entry.level,
        extra: entry.context,
        user: entry.userId ? { id: entry.userId } : undefined,
      });
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Convenience methods
export const log = {
  debug: (message: string, context?: Record<string, unknown>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, unknown>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, unknown>) => logger.warn(message, context),
  error: (message: string, context?: Record<string, unknown>) => logger.error(message, context),
};