// src/lib/validation.ts
/**
 * Input validation utilities using Zod.
 * Provides schema validation for forms, API inputs, and data.
 *
 * @example
 * // Define schema
 * const UserSchema = z.object({
 *   name: z.string().min(2).max(100),
 *   email: z.string().email(),
 *   age: z.number().min(18).optional()
 * });
 *
 * // Validate
 * const result = validate(data, UserSchema);
 * if (!result.success) { handleErrors(result.errors); }
 */

import { z } from "zod";

// ─── Types ────────────────────────────────────────────────────────

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

// ─── Core Functions ────────────────────────────────────────────────

/**
 * Validate data against a Zod schema.
 */
export function validate<T>(
  data: unknown,
  schema: z.ZodType<T>
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "_root";
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return { success: false, errors };
}

/**
 * Validate and throw on error.
 */
export function validateOrThrow<T>(data: unknown, schema: z.ZodType<T>): T {
  return schema.parse(data);
}

/**
 * Partial validation (only validate provided fields).
 */
export function validatePartial<T>(
  data: Record<string, unknown>,
  schema: z.ZodObject<any>
): ValidationResult<Partial<T>> {
  const partialSchema = schema.partial();
  return validate(data, partialSchema);
}

// ─── Common Schemas ────────────────────────────────────────────────

export const CommonSchemas = {
  // User
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  name: z.string().min(1, "Name is required").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),

  // IDs
  cuid: z.string().startsWith("c", "Invalid ID format"),
  uuid: z.string().uuid("Invalid UUID"),

  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  // Dates
  date: z.coerce.date(),
  dateString: z.string().datetime(),

  // URLs
  url: z.string().url("Invalid URL"),

  // Search
  searchQuery: z.string().min(1).max(200),

  // Credits
  credits: z.number().int().min(0),
  creditAmount: z.number().int().min(1).max(1_000_000),
};

// ─── Pre-built Schemas ─────────────────────────────────────────────

export const Schemas = {
  // Auth
  signIn: z.object({
    email: CommonSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),

  signUp: z.object({
    name: CommonSchemas.name,
    email: CommonSchemas.email,
    password: CommonSchemas.password,
  }),

  // Pagination
  pagination: z.object({
    page: CommonSchemas.page,
    limit: CommonSchemas.limit,
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),

  // User update
  userUpdate: z.object({
    name: CommonSchemas.name.optional(),
    email: CommonSchemas.email.optional(),
    image: z.string().url().optional(),
  }),

  // API Key
  apiKeyCreate: z.object({
    name: z.string().min(1).max(50),
    provider: z.enum(["openai", "anthropic", "google", "openrouter"]),
    key: z.string().min(1),
  }),

  // Search
  search: z.object({
    query: CommonSchemas.searchQuery,
    page: CommonSchemas.page,
    limit: CommonSchemas.limit,
  }),
};

// ─── Form Helpers ──────────────────────────────────────────────────

/**
 * Convert Zod errors to React Hook Form format.
 */
export function toFormErrors(
  errors: Record<string, string[]>
): Record<string, { type: string; message: string }> {
  const result: Record<string, { type: string; message: string }> = {};

  for (const [field, messages] of Object.entries(errors)) {
    result[field] = {
      type: "validation",
      message: messages[0],
    };
  }

  return result;
}

/**
 * Create a resolver for react-hook-form.
 */
export function zodResolver<T extends z.ZodType<any>>(
  schema: T
): (data: any) => Promise<{ values: any; errors: any }> {
  return async (data) => {
    const result = validate(data, schema);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    return {
      values: {},
      errors: toFormErrors(result.errors),
    };
  };
}

// ─── API Validation Helper ─────────────────────────────────────────

/**
 * Validate API request body.
 * Returns validated data or throws ValidationError.
 */
export function validateRequestBody<T>(
  body: unknown,
  schema: z.ZodType<T>
): T {
  const result = validate(body, schema);

  if (!result.success) {
    throw new ValidationError("Validation failed", result.errors);
  }

  return result.data;
}