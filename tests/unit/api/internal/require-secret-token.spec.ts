import type { H3Event } from 'h3';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { requireSecretToken } from '~/server/utils/requireSecretToken';

const eventWith = (authorization?: string) =>
  ({ node: { req: { headers: authorization ? { authorization } : {} } } }) as unknown as H3Event;

describe('requireSecretToken', () => {
  beforeEach(() => {
    vi.stubEnv('NUXT_SECRET', 'correct-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('accepts the configured secret as bearer token', () => {
    expect(() => requireSecretToken(eventWith('Bearer correct-secret'))).not.toThrow();
  });

  test.each([undefined, 'Bearer ', 'Bearer wrong-secret', 'Bearer correct-secret-and-more', 'correct-secret'])(
    'rejects %j with 401',
    (authorization) => {
      expect(() => requireSecretToken(eventWith(authorization))).toThrowError(expect.objectContaining({ statusCode: 401 }));
    },
  );

  test('behaves like a missing route when no secret is configured', () => {
    vi.stubEnv('NUXT_SECRET', '');
    expect(() => requireSecretToken(eventWith('Bearer '))).toThrowError(expect.objectContaining({ statusCode: 404 }));
  });
});
