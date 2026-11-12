import { createError } from 'h3';
import type { ZodType } from 'zod';

/** Parses a request body against `schema` and answers 400 without echoing the input when it does not match. */
export function parseRequestBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
  }
  return result.data;
}
