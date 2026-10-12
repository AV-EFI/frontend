import type { H3Event } from 'h3';
import { describe, expect, test } from 'vitest';
import { getClientIp } from '~/server/utils/clientIp';
import { consumeRateLimit } from '~/server/utils/rateLimit';

const eventWith = (headers: Record<string, string | string[]>, remoteAddress?: string) =>
  ({ node: { req: { headers, socket: { remoteAddress } } } }) as unknown as H3Event;

describe('getClientIp', () => {
  test('uses the last forwarded entry added by the trusted proxy', () => {
    expect(getClientIp(eventWith({ 'x-forwarded-for': '198.51.100.7, 203.0.113.42' }, '127.0.0.1'))).toBe('203.0.113.42');
  });

  test('falls back to the socket address', () => {
    expect(getClientIp(eventWith({}, '::ffff:10.0.0.5'))).toBe('::ffff:10.0.0.5');
  });

  test('rejects values that are not IP literals', () => {
    expect(getClientIp(eventWith({ 'x-forwarded-for': '<script>alert(1)</script>' }, '127.0.0.1'))).toBe('unknown');
    expect(getClientIp(eventWith({}, undefined))).toBe('unknown');
  });
});

describe('consumeRateLimit', () => {
  test('allows up to the limit, then reports the wait time', () => {
    const key = 'test:limit';
    expect(consumeRateLimit(key, 2, 60_000, 1_000)).toBe(0);
    expect(consumeRateLimit(key, 2, 60_000, 2_000)).toBe(0);
    expect(consumeRateLimit(key, 2, 60_000, 3_000)).toBe(58);
  });

  test('releases the key once the window has passed', () => {
    const key = 'test:window';
    consumeRateLimit(key, 1, 1_000, 0);
    expect(consumeRateLimit(key, 1, 1_000, 500)).toBeGreaterThan(0);
    expect(consumeRateLimit(key, 1, 1_000, 1_000)).toBe(0);
  });

  test('tracks keys independently', () => {
    consumeRateLimit('test:a', 1, 60_000, 0);
    expect(consumeRateLimit('test:b', 1, 60_000, 0)).toBe(0);
  });
});
