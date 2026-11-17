import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type SearchRequest = [{ indexName: string; params: Record<string, unknown> }];

const fetchMock = vi.hoisted(() => vi.fn());
vi.mock('ofetch', () => ({ $fetch: fetchMock }));

const institutions = { 'Archive A': 2, 'Archive B': 2 };
const hitsByInstitution: Record<string, Array<Array<{ handle: string; '@timestamp': number }>>> = {
  'Archive A': [
    [{ handle: '21.11155/AAA', '@timestamp': Date.UTC(2026, 0, 1) }],
    [{ handle: '21.11155/SHARED', '@timestamp': Date.UTC(2026, 0, 2) }],
  ],
  'Archive B': [
    [{ handle: '21.11155/SHARED', '@timestamp': Date.UTC(2026, 0, 5) }],
  ],
};

function respond(nbWorks: number) {
  fetchMock.mockImplementation(async (_url: string, { body }: { body: SearchRequest }) => {
    const { params } = body[0];
    if (params.hitsPerPage === 0) {
      return { results: [{ nbWorks, facets: { has_issuer_name: institutions } }] };
    }
    const facetFilter = (params.facetFilters as string[][])[0]?.[0] ?? '';
    const pages = hitsByInstitution[facetFilter.replace('has_issuer_name:', '')] ?? [];
    return { results: [{ hits: pages[params.page as number] ?? [], nbPages: pages.length }] };
  });
}

async function loadCollector() {
  vi.resetModules();
  const stored = new Map<string, unknown>();
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: { elasticApiBase: '/rest/v1', searchApiPath: 'frontend/search', siteUrl: 'https://www.av-efi.net' },
  }));
  vi.stubGlobal('useStorage', () => ({
    getItem: async (key: string) => stored.get(key) ?? null,
    setItem: async (key: string, value: unknown) => { stored.set(key, value); },
  }));
  return import('~/server/utils/sitemapWorks');
}

describe('sitemap work URLs', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('pages through every institution and lists each work once with its latest change', async () => {
    respond(2);
    const { getSitemapWorkUrls } = await loadCollector();

    expect(await getSitemapWorkUrls()).toEqual([
      { loc: '/res/21.11155/AAA', lastmod: '2026-01-01T00:00:00.000Z' },
      { loc: '/res/21.11155/SHARED', lastmod: '2026-01-05T00:00:00.000Z' },
    ]);
    expect(fetchMock).toHaveBeenCalledWith('https://www.av-efi.net/rest/v1/frontend/search', expect.anything());
    const pageSizes = fetchMock.mock.calls.map(([, { body }]) => (body as SearchRequest)[0].params.hitsPerPage);
    expect(pageSizes.filter((size) => size !== 0).every((size) => size === 100)).toBe(true);
  });

  test('warns when fewer works were collected than the search API counts', async () => {
    respond(3);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getSitemapWorkUrls } = await loadCollector();

    await getSitemapWorkUrls();

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('collected 2 of 3 works'));
  });

  test('serves the stored list until the next rebuild and keeps it when a rebuild fails', async () => {
    respond(2);
    const { getSitemapWorkUrls, rebuildSitemapWorkUrls } = await loadCollector();
    const firstList = await getSitemapWorkUrls();
    const requestsForFirstList = fetchMock.mock.calls.length;

    expect(await getSitemapWorkUrls()).toEqual(firstList);
    expect(fetchMock).toHaveBeenCalledTimes(requestsForFirstList);

    fetchMock.mockRejectedValue(new Error('search API unavailable'));
    await expect(rebuildSitemapWorkUrls()).rejects.toThrow('search API unavailable');
    expect(await getSitemapWorkUrls()).toEqual(firstList);
  });
});
