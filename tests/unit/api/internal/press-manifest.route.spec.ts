import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Internal API: /press/manifest.json', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('returns parsed manifest JSON and sets content-type', async () => {
    const setHeaderMock = vi.fn();
    const readFileMock = vi.fn().mockResolvedValue('{"lastUpdated":"2026-01-01"}');

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      setHeader: setHeaderMock,
      createError: (payload: any) => payload,
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: readFileMock,
      },
    }));
    vi.stubGlobal('defineEventHandler', (fn: any) => fn);

    const handler = (await import('~/server/routes/press/manifest.json')).default as (event: any) => Promise<any>;
    const result = await handler({});

    expect(result).toEqual({ lastUpdated: '2026-01-01' });
    expect(setHeaderMock).toHaveBeenCalledWith({}, 'Content-Type', 'application/json');
    expect(readFileMock).toHaveBeenCalledTimes(1);
  });

  test('throws 500 error contract when manifest read fails', async () => {
    const readFileMock = vi.fn().mockRejectedValue(new Error('read failed'));

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      setHeader: vi.fn(),
      createError: (payload: any) => payload,
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: readFileMock,
      },
    }));
    vi.stubGlobal('defineEventHandler', (fn: any) => fn);

    const handler = (await import('~/server/routes/press/manifest.json')).default as (event: any) => Promise<any>;
    await expect(handler({})).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Unable to read press manifest.',
    });
  });
});
