import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Outbound API wrapper: /api/elastic/suggestions', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('query mode returns normalized suggestion shape from external ES response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      aggregations: {
        agg__has_record__has_primary_title__has_name: {
          buckets: [
            { key: 'Berlin', doc_count: 10 },
            { key: 'Berlin', doc_count: 8 },
          ],
        },
      },
    });
    const readBodyMock = vi.fn().mockResolvedValue({
      mode: 'query',
      query: 'Ber',
      size: 5,
    });

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      readBody: readBodyMock,
    }));
    vi.doMock('ofetch', () => ({
      $fetch: fetchMock,
    }));
    vi.doMock('~/searchConfig_avefi', () => ({
      config: {
        search_settings: {
          search_attributes: [{ field: 'has_record.has_primary_title.has_name' }],
        },
      },
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { ELASTIC_INDEX: 'works-index' },
    }));

    const handler = (await import('~/server/api/elastic/suggestions.post')).default as (event: any) => Promise<any>;
    const result = await handler({});

    expect(result.success).toBe(true);
    expect(result.suggestions).toEqual([{ text: 'Berlin', type: 'title', count: 10 }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/works-index/_search');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
  });

  test('returns success=false empty suggestions when external endpoint config is missing', async () => {
    const readBodyMock = vi.fn().mockResolvedValue({
      mode: 'query',
      query: 'Berlin',
    });

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      readBody: readBodyMock,
    }));
    vi.doMock('ofetch', () => ({
      $fetch: vi.fn(),
    }));
    vi.doMock('~/searchConfig_avefi', () => ({
      config: {
        search_settings: {
          search_attributes: [{ field: 'has_record.has_primary_title.has_name' }],
        },
      },
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => '',
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { ELASTIC_INDEX: '' },
    }));

    const handler = (await import('~/server/api/elastic/suggestions.post')).default as (event: any) => Promise<any>;
    const result = await handler({});

    expect(result).toEqual({ success: false, suggestions: [] });
  });

  test('facet mode returns empty when unknown facet key is requested', async () => {
    const readBodyMock = vi.fn().mockResolvedValue({
      mode: 'facet',
      facetAttr: 'does_not_exist',
      query: '',
      size: 10,
    });

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      readBody: readBodyMock,
    }));
    vi.doMock('ofetch', () => ({
      $fetch: vi.fn(),
    }));
    vi.doMock('~/searchConfig_avefi', () => ({
      config: { search_settings: { search_attributes: [] } },
    }));
    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      getElasticsearchNode: () => 'http://elastic.local',
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { ELASTIC_INDEX: 'works-index' },
    }));

    const handler = (await import('~/server/api/elastic/suggestions.post')).default as (event: any) => Promise<any>;
    const result = await handler({});

    expect(result).toEqual({ success: true, suggestions: [] });
  });
});
