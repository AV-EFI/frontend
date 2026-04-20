import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type CmsHandler = (event: unknown) => Promise<unknown>;

describe('Outbound API proxy: /api/cms/getcmscontent', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('rejects invalid content type before outbound request', async () => {
    vi.doMock('h3', () => ({
      createError: (payload: unknown) => payload,
    }));
    vi.doMock('axios', () => ({
      default: { get: vi.fn() },
    }));
    vi.stubGlobal('defineEventHandler', <T>(fn: T) => fn);
    vi.stubGlobal('getQuery', () => ({ contenttype: '../bad' }));

    const handler = (await import('~/server/api/cms/getcmscontent.get')).default as CmsHandler;
    await expect(handler({})).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Invalid content type',
    });
  });

  test('rejects invalid locale before outbound request', async () => {
    vi.doMock('h3', () => ({
      createError: (payload: unknown) => payload,
    }));
    vi.doMock('axios', () => ({
      default: { get: vi.fn() },
    }));
    vi.stubGlobal('defineEventHandler', <T>(fn: T) => fn);
    vi.stubGlobal('getQuery', () => ({ contenttype: 'pages', locale: 'de;DROP TABLE' }));

    const handler = (await import('~/server/api/cms/getcmscontent.get')).default as CmsHandler;
    await expect(handler({})).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Invalid locale',
    });
  });

  test('proxies to external cms and returns response data shape', async () => {
    process.env.STRAPI_URL = 'https://cms.example.org';
    process.env.STRAPI_TOKEN = 'secret-token';

    const axiosGetMock = vi.fn().mockResolvedValue({
      data: { data: [{ id: 1, attributes: { title: 'Entry' } }] },
    });

    vi.doMock('h3', () => ({
      createError: (payload: unknown) => payload,
    }));
    vi.doMock('axios', () => ({
      default: { get: axiosGetMock },
    }));
    vi.stubGlobal('defineEventHandler', <T>(fn: T) => fn);
    vi.stubGlobal('getQuery', () => ({ contenttype: 'articles', locale: 'de', id: '42' }));

    const handler = (await import('~/server/api/cms/getcmscontent.get')).default as CmsHandler;
    const result = await handler({});

    expect(result).toEqual({ data: [{ id: 1, attributes: { title: 'Entry' } }] });
    expect(axiosGetMock).toHaveBeenCalledWith('https://cms.example.org/api/articles?locale=de', {
      params: { id: '42' },
      headers: {
        Authorization: 'Bearer secret-token',
      },
    });
  });
});
