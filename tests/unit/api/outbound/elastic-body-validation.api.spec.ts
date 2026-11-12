import { beforeEach, describe, expect, test, vi } from 'vitest';

type Handler = (event: unknown) => Promise<unknown>;

const searchMock = vi.fn();
const countMock = vi.fn();
const handleInstantSearchRequestsMock = vi.fn();
const readBodyMock = vi.fn();

async function loadRoute(path: string): Promise<Handler> {
  // statscount imports these two from h3 instead of using the auto-imported globals.
  vi.doMock('h3', async (importOriginal) => ({
    ...(await importOriginal<typeof import('h3')>()),
    defineEventHandler: <T>(fn: T) => fn,
    readBody: readBodyMock,
  }));
  vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
    createElasticsearchClient: () => ({ search: searchMock, count: countMock }),
  }));
  vi.doMock('@searchkit/api', () => ({
    default: () => ({ searchkit: { handleInstantSearchRequests: handleInstantSearchRequestsMock } }),
  }));
  vi.doMock('@/searchConfig_avefi', () => ({ config: {} }));
  vi.stubGlobal('defineEventHandler', <T>(fn: T) => fn);
  vi.stubGlobal('readBody', readBodyMock);
  vi.stubGlobal('getAuthSession', vi.fn().mockResolvedValue({ user: { institution: 'DE-X' } }));
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { ELASTIC_INDEX: 'works', ELASTIC_INDEX_DETAIL: 'detail' } }));
  return (await import(path)).default as Handler;
}

async function expectRejected(handler: Handler, body: unknown) {
  readBodyMock.mockResolvedValue(body);
  await expect(handler({})).rejects.toMatchObject({ statusCode: 400, statusMessage: 'Invalid request body' });
}

describe('Elastic routes validate the request body', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    searchMock.mockResolvedValue({ hits: { hits: [] } });
    countMock.mockResolvedValue({ count: 3 });
    handleInstantSearchRequestsMock.mockResolvedValue({ results: [] });
  });

  describe('POST /api/elastic/get_work_by_id', () => {
    test.each([
      ['missing documentId', {}],
      ['number', { documentId: 5 }],
      ['object', { documentId: { $ne: null } }],
      ['empty list', { documentId: [] }],
      ['list with non-strings', { documentId: ['a', 1] }],
      ['more than 50 ids', { documentId: Array.from({ length: 51 }, (_, i) => `id-${i}`) }],
      ['body is not an object', null],
    ])('rejects %s without querying Elasticsearch', async (_name, body) => {
      const handler = await loadRoute('~/server/api/elastic/get_work_by_id.post');
      await expectRejected(handler, body);
      expect(searchMock).not.toHaveBeenCalled();
    });

    test('accepts a single id and a list of ids', async () => {
      const handler = await loadRoute('~/server/api/elastic/get_work_by_id.post');
      readBodyMock.mockResolvedValue({ documentId: 'a' });
      await handler({});
      readBodyMock.mockResolvedValue({ documentId: ['a', 'b'] });
      await handler({});
      expect(searchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('POST /api/elastic/get_work_by_is_part_of', () => {
    test.each([
      ['missing documentId', {}],
      ['object that changes the match query', { documentId: { query: 'x', operator: 'or' } }],
      ['empty string', { documentId: '' }],
      ['list', { documentId: ['a'] }],
    ])('rejects %s without querying Elasticsearch', async (_name, body) => {
      const handler = await loadRoute('~/server/api/elastic/get_work_by_is_part_of.post');
      await expectRejected(handler, body);
      expect(searchMock).not.toHaveBeenCalled();
    });

    test('accepts a record id', async () => {
      const handler = await loadRoute('~/server/api/elastic/get_work_by_is_part_of.post');
      readBodyMock.mockResolvedValue({ documentId: 'https://w3id.org/av-efi/film/abc' });
      await handler({});
      expect(searchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/elastic/statscount', () => {
    test.each([
      ['missing query', {}],
      ['missing cat', { query: { term: 'DE-X' } }],
      ['term with spaces and quotes', { query: { term: 'DE-X" or 1=1', cat: 'Work' } }],
      ['term that is too long', { query: { term: 'D'.repeat(101), cat: 'Work' } }],
      ['cat that is not a word', { query: { term: 'DE-X', cat: 'Work Item' } }],
      ['non-string term', { query: { term: { a: 1 }, cat: 'Work' } }],
    ])('rejects %s without counting', async (_name, body) => {
      const handler = await loadRoute('~/server/api/elastic/statscount.post');
      await expectRejected(handler, body);
      expect(countMock).not.toHaveBeenCalled();
    });

    test('counts for a valid institution and category', async () => {
      const handler = await loadRoute('~/server/api/elastic/statscount.post');
      readBodyMock.mockResolvedValue({ query: { term: 'DE-1234', cat: 'Work' } });
      await expect(handler({})).resolves.toEqual({ success: true, data: 3 });
    });

    test('does not return the Elasticsearch error message to the client', async () => {
      countMock.mockRejectedValue(new Error('connect ECONNREFUSED 10.0.0.5:9200'));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const handler = await loadRoute('~/server/api/elastic/statscount.post');
      readBodyMock.mockResolvedValue({ query: { term: 'DE-1234', cat: 'Work' } });
      const result = await handler({}) as { success: boolean; message: string };
      expect(result.success).toBe(false);
      expect(result.message).not.toContain('10.0.0.5');
    });
  });

  describe('POST /api/elastic/msearch_inst', () => {
    test.each([
      ['an object instead of a list', { indexName: 'works' }],
      ['an empty list', []],
      ['requests without indexName', [{ params: {} }]],
      ['more than 20 requests', Array.from({ length: 21 }, () => ({ indexName: 'works' }))],
      ['a string', 'works'],
    ])('rejects %s without searching', async (_name, body) => {
      const handler = await loadRoute('~/server/api/elastic/msearch_inst.post');
      await expectRejected(handler, body);
      expect(handleInstantSearchRequestsMock).not.toHaveBeenCalled();
    });

    test('passes valid InstantSearch requests to Searchkit', async () => {
      const handler = await loadRoute('~/server/api/elastic/msearch_inst.post');
      const body = [{ indexName: 'works', params: { query: 'berlin', hitsPerPage: 20 } }];
      readBodyMock.mockResolvedValue(body);
      await handler({});
      expect(handleInstantSearchRequestsMock).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });
});
