import { createHash, timingSafeEqual } from 'node:crypto';
import { createError, getRequestHeader } from 'h3';
import type { H3Event } from 'h3';

const digest = (value: string) => createHash('sha256').update(value).digest();

/**
 * Guards maintenance routes that are called by scripts or cron jobs instead of signed-in users.
 * The caller sends `NUXT_SECRET` as `Authorization: Bearer <secret>`. Without a configured secret
 * the route behaves as if it did not exist.
 */
export function requireSecretToken(event: H3Event): void {
  // Read at runtime: the CI build strips secrets from .env, so runtimeConfig would not contain it.
  const expected = process.env.NUXT_SECRET;
  if (!expected) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const header = getRequestHeader(event, 'authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';

  // Digests have a fixed length, so the comparison neither throws nor leaks the secret length.
  if (!timingSafeEqual(digest(provided), digest(expected))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
}
