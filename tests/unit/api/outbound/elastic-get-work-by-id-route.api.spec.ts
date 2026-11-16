import { beforeEach, describe, expect, test, vi } from 'vitest';

type ElasticRouteHandler = (event: unknown) => Promise<Record<string, unknown>>;
type ElasticRouteResult = {
  handle?: string;
  _id?: string;
  compound_record?: { _source?: { handle?: string } };
};

describe('Outbound API wrapper: /api/elastic/get_work_by_id/[id]', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('returns normalized backend response for fetched document', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getRouterParam: vi.fn().mockReturnValue('doc-1'),
    }));
    vi.doMock('ofetch', () => ({
      $fetch: vi.fn().mockResolvedValue({
        _index: 'idx',
        _id: 'doc-1',
        _source: {
          handle: 'h-1',
          'has_record': { 'has_primary_title': { 'has_name': 'Title' } },
        },
      }),
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
      getElasticsearchApiKey: () => 'abc',
    }));

    const handler = (await import('~/server/api/elastic/get_work_by_id/[id].get')).default as ElasticRouteHandler;
    const result = await handler({}) as ElasticRouteResult;

    expect(result.handle).toBe('h-1');
    expect(result._id).toBe('doc-1');
    expect(result.compound_record?._source?.handle).toBe('h-1');
  });

  test('returns error object when id parameter is missing', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getRouterParam: vi.fn().mockReturnValue(''),
    }));
    vi.doMock('ofetch', () => ({ $fetch: vi.fn() }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
      getElasticsearchApiKey: () => '',
    }));

    const handler = (await import('~/server/api/elastic/get_work_by_id/[id].get')).default as ElasticRouteHandler;
    const result = await handler({});

    expect(result).toEqual({ error: 'Missing ID parameter' });
  });

  test('maps a 404 from Elasticsearch to a fixed not-found error without the host', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getRouterParam: vi.fn().mockReturnValue('doc-1'),
    }));
    vi.doMock('ofetch', () => ({
      $fetch: vi.fn().mockRejectedValue(Object.assign(
        new Error('[GET] "http://10.254.1.11:9200/works/_doc/doc-1": 404 Not Found'),
        { statusCode: 404 },
      )),
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
      getElasticsearchApiKey: () => '',
    }));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const handler = (await import('~/server/api/elastic/get_work_by_id/[id].get')).default as ElasticRouteHandler;
    const result = await handler({});

    expect(result).toEqual({ error: 'Document not found' });
  });

  test('returns error object when external call throws', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getRouterParam: vi.fn().mockReturnValue('doc-1'),
    }));
    vi.doMock('ofetch', () => ({
      $fetch: vi.fn().mockRejectedValue(new Error('upstream fail')),
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
      getElasticsearchApiKey: () => '',
    }));

    vi.spyOn(console, 'error').mockImplementation(() => {});

    const handler = (await import('~/server/api/elastic/get_work_by_id/[id].get')).default as ElasticRouteHandler;
    const result = await handler({});

    expect(result).toEqual({ error: 'Elasticsearch request failed' });
  });
});
