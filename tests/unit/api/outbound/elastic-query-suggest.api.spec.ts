import { beforeEach, describe, expect, test, vi } from 'vitest';

type QuerySuggestHandler = (event: unknown) => Promise<{ success: boolean; suggestions: unknown[] }>;

describe('Outbound API wrapper: /api/elastic/query_suggest', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('returns filtered, deduped suggestions from external ES response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      aggregations: {
        'agg__has_record__has_primary_title__has_name': {
          buckets: [
            { key: 'Berlin', 'doc_count': 10 },
            { key: 'Metropolis', 'doc_count': 8 },
          ],
        },
      },
    });

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ query: 'ber', size: 10 }),
    }));
    vi.doMock('ofetch', () => ({ $fetch: fetchMock }));
    vi.doMock('~/searchConfig_avefi', () => ({
      config: {
        'search_settings': {
          'search_attributes': [{ field: 'has_record.has_primary_title.has_name' }],
        },
      },
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { ELASTIC_INDEX: 'works-index' },
    }));

    const handler = (await import('~/server/api/elastic/query_suggest.post')).default as QuerySuggestHandler;
    const result = await handler({});

    expect(result.success).toBe(true);
    expect(result.suggestions).toEqual([{ text: 'Berlin', type: 'title' }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('returns success=false when external call fails', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ query: 'ber' }),
    }));
    vi.doMock('ofetch', () => ({
      $fetch: vi.fn().mockRejectedValue(new Error('upstream down')),
    }));
    vi.doMock('~/searchConfig_avefi', () => ({
      config: {
        'search_settings': {
          'search_attributes': [{ field: 'has_record.has_primary_title.has_name' }],
        },
      },
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { ELASTIC_INDEX: 'works-index' },
    }));

    const handler = (await import('~/server/api/elastic/query_suggest.post')).default as QuerySuggestHandler;
    const result = await handler({});

    expect(result).toEqual({ success: false, suggestions: [] });
  });
});
