import { describe, expect, test } from 'vitest';
import { normalizeInstantSearchResponse } from '~/utils/instantsearchResponse';

describe('normalizeInstantSearchResponse', () => {
  test('returns safe empty results when upstream response is null', () => {
    const requests = [
      { params: { query: 'metropolis', page: 2, hitsPerPage: 30 } },
      { params: { query: 'nosferatu' } },
    ];

    const result = normalizeInstantSearchResponse(null, requests);

    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toMatchObject({
      hits: [],
      query: 'metropolis',
      page: 2,
      hitsPerPage: 30,
      nbHits: 0,
      nbPages: 0,
    });
    expect(result.results[1]).toMatchObject({
      hits: [],
      query: 'nosferatu',
      page: 0,
      hitsPerPage: 20,
      nbHits: 0,
      nbPages: 0,
    });
  });

  test('preserves valid response fields and repairs invalid hits arrays', () => {
    const requests = [{ params: { query: 'm', page: 1, hitsPerPage: 5 } }];
    const upstream = {
      results: [
        {
          hits: undefined,
          nbHits: 42,
          nbPages: 9,
          page: 1,
          hitsPerPage: 5,
          query: 'm',
        },
      ],
    };

    const result = normalizeInstantSearchResponse(upstream, requests);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].hits).toEqual([]);
    expect(result.results[0]).toMatchObject({
      nbHits: 42,
      nbPages: 9,
      page: 1,
      hitsPerPage: 5,
      query: 'm',
    });
  });

  test('pads missing results entries with empty defaults for each request', () => {
    const requests = [
      { params: { query: 'a' } },
      { params: { query: 'b' } },
    ];
    const upstream = {
      results: [
        {
          hits: [{ objectID: '1' }],
          nbHits: 1,
          nbPages: 1,
          page: 0,
          hitsPerPage: 20,
          query: 'a',
        },
      ],
    };

    const result = normalizeInstantSearchResponse(upstream, requests);

    expect(result.results).toHaveLength(2);
    expect(result.results[0].hits).toHaveLength(1);
    expect(result.results[1].hits).toEqual([]);
    expect(result.results[1].query).toBe('b');
  });
});
