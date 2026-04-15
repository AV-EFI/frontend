import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Outbound API wrapper: /api/elastic/get_work_by_id (python backend via ES client)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('returns hit list for array documentId input', async () => {
    const searchMock = vi.fn().mockResolvedValue({
      hits: {
        hits: [{ _id: 'a' }, { _id: 'b' }],
      },
    });
    const readBodyMock = vi.fn().mockResolvedValue({
      documentId: ['a', 'b'],
    });

    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      createElasticsearchClient: () => ({
        search: searchMock,
      }),
    }));

    vi.stubGlobal('defineEventHandler', (fn: any) => fn);
    vi.stubGlobal('readBody', readBodyMock);
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        ELASTIC_INDEX: 'works-index',
      },
    }));

    const handler = (await import('~/server/api/elastic/get_work_by_id.post')).default as (event: any) => Promise<any>;
    const result = await handler({});

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock.mock.calls[0][0]).toMatchObject({
      index: 'works-index',
      size: 50,
      query: { ids: { values: ['a', 'b'] } },
    });
    expect(result).toEqual([{ _id: 'a' }, { _id: 'b' }]);
  });

  test('returns null when backend client throws', async () => {
    const searchMock = vi.fn().mockRejectedValue(new Error('backend down'));
    const readBodyMock = vi.fn().mockResolvedValue({
      documentId: ['a'],
    });

    vi.doMock('~/server/utils/elasticsearchRuntime', () => ({
      createElasticsearchClient: () => ({
        search: searchMock,
      }),
    }));

    vi.stubGlobal('defineEventHandler', (fn: any) => fn);
    vi.stubGlobal('readBody', readBodyMock);
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        ELASTIC_INDEX: 'works-index',
      },
    }));

    const handler = (await import('~/server/api/elastic/get_work_by_id.post')).default as (event: any) => Promise<any>;
    const result = await handler({});

    expect(result).toBeNull();
  });
});
