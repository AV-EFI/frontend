import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

describe('Outbound API: /api/elastic/msearch – production guard', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock('@searchkit/api', () => ({ default: vi.fn() }));
    vi.doMock('~/searchConfig_avefi', () => ({ config: {} }));
    vi.stubGlobal('defineEventHandler', <T>(fn: T) => fn);
    vi.stubGlobal('readBody', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test('is not served in production builds', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const handler = (await import('~/server/api/elastic/msearch.post')).default as (event: unknown) => Promise<unknown>;

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 });
  });
});
