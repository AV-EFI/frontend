import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.hoisted(() => vi.fn());
vi.mock('ofetch', () => ({ $fetch: fetchMock }));
vi.mock('h3', async (importOriginal) => ({ ...await importOriginal<typeof import('h3')>(), setHeader: vi.fn() }));

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); fetchMock.mockReset(); });

async function handler(enabled: unknown) {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { newsEnabled: enabled } }));
  vi.stubGlobal('defineCachedFunction', (fn: unknown) => fn);
  return (await import('~/server/api/news.get')).default;
}

describe('news API', () => {
  it('returns 404 without contacting the feed when disabled', async () => {
    const run = await handler('false');
    await expect(run({} as Parameters<typeof run>[0])).rejects.toMatchObject({ statusCode: 404 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns parsed news when enabled', async () => {
    fetchMock.mockResolvedValue('<rss><channel /></rss>');
    const run = await handler(true);
    expect(await run({} as Parameters<typeof run>[0])).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('https://projects.tib.eu/av-efi/rss.xml', expect.objectContaining({ timeout: 10000, retry: 0 }));
  });

  it('maps upstream failures to 502', async () => {
    fetchMock.mockRejectedValue(new Error('timeout'));
    const run = await handler(true);
    await expect(run({} as Parameters<typeof run>[0])).rejects.toMatchObject({ statusCode: 502 });
  });
});
