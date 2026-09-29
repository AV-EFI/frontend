import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.hoisted(() => vi.fn());
vi.mock('ofetch', () => ({ $fetch: fetchMock }));
vi.mock('h3', async (importOriginal) => ({ ...await importOriginal<typeof import('h3')>(), setHeader: vi.fn() }));

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); fetchMock.mockReset(); });

async function handler(enabled: unknown, feedUrl = 'https://projects.tib.eu/av-efi/rss.xml') {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { newsEnabled: enabled }, newsFeedUrl: feedUrl }));
  vi.stubGlobal('defineCachedFunction', (fn: unknown) => fn);
  return (await import('~/server/api/news.get')).default;
}

function makeEvent(query: Record<string, string> = {}) {
  return { path: `/api/news?${new URLSearchParams(query).toString()}` } as unknown as Parameters<Awaited<ReturnType<typeof handler>>>[0];
}

describe('news API', () => {
  it('returns 404 without contacting the feed when disabled', async () => {
    const run = await handler('false');
    await expect(run(makeEvent())).rejects.toMatchObject({ statusCode: 404 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns parsed news when enabled, fetching the configured feed URL', async () => {
    fetchMock.mockResolvedValue('<rss><channel /></rss>');
    const run = await handler(true, 'https://example.test/rss.xml');
    expect(await run(makeEvent())).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('https://example.test/rss.xml', expect.objectContaining({ timeout: 10000, retry: 0 }));
  });

  it('maps upstream failures to 502', async () => {
    fetchMock.mockRejectedValue(new Error('timeout'));
    const run = await handler(true);
    await expect(run(makeEvent())).rejects.toMatchObject({ statusCode: 502 });
  });

  it('limits results when a positive limit is requested', async () => {
    fetchMock.mockResolvedValue('<rss><channel><item><title>A</title><link>https://projects.tib.eu/av-efi/a</link></item><item><title>B</title><link>https://projects.tib.eu/av-efi/b</link></item></channel></rss>');
    const run = await handler(true);
    const result = await run(makeEvent({ limit: '1' })) as unknown[];
    expect(result).toHaveLength(1);
  });

  it('ignores non-positive or non-numeric limits', async () => {
    fetchMock.mockResolvedValue('<rss><channel><item><title>A</title><link>https://projects.tib.eu/av-efi/a</link></item></channel></rss>');
    const run = await handler(true);
    const result = await run(makeEvent({ limit: '0' })) as unknown[];
    expect(result).toHaveLength(1);
  });
});
