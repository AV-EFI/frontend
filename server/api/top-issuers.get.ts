import { defineCachedEventHandler } from '#imports';
import topIssuersData from '~/data/top-issuers.json';

interface Issuer {
  name: string;
  id: string | null;
  doc_count: number;
}

const DEFAULT_TOP_ISSUERS_INDEX = '21.11155-denormalised-work';

interface EsBucket {
  key: string;
  doc_count: number;
  handle_count?: {
    value?: number;
  };
  issuer_ids?: {
    buckets?: Array<{ key: string }>;
  };
}

interface EsResponse {
  aggregations?: {
    manifestations?: {
      issuers_by_name?: {
        buckets?: EsBucket[];
      };
    };
  };
}

function buildBackendAlignedTopIssuersQuery(size = 10) {
  return {
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query: '',
              fields: [
                'has_record.has_primary_title.has_name^2',
                'has_record.has_alternative_title.has_name^1',
                'parents.has_record.has_primary_title.has_name^1.5',
                'directors_or_editors^2.5',
                'subjects^1',
                'years^1',
                'production^1',
              ],
              zero_terms_query: 'all',
              type: 'phrase',
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
    size: 0,
    aggs: {
      manifestations: {
        nested: {
          path: 'manifestations',
        },
        aggs: {
          issuers_by_name: {
            terms: {
              field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
              size,
              order: {
                handle_count: 'desc',
              },
            },
            aggs: {
              handle_count: {
                cardinality: {
                  field: 'manifestations.handle.keyword',
                },
              },
              issuer_ids: {
                terms: {
                  field: 'manifestations.has_record.described_by.has_issuer_id.keyword',
                  size: 1,
                },
              },
            },
          },
        },
      },
    },
  };
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig();

  const host = config.ELASTIC_HOST_INTERNAL || config.ELASTIC_HOST_PUBLIC;
  const index =
    process.env.ELASTIC_TOP_ISSUERS_INDEX ||
    process.env.ELASTIC_GWDG_INDEX ||
    config.public.ELASTIC_INDEX ||
    DEFAULT_TOP_ISSUERS_INDEX;
  const apiKey = config.ELASTIC_APIKEY;

  if (!host || !index) {
    return topIssuersData;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `ApiKey ${apiKey}`;
  }

  try {
    const response = await $fetch<EsResponse>(`${host}/${index}/_search`, {
      method: 'POST',
      headers,
      body: buildBackendAlignedTopIssuersQuery(10),
    });

    const buckets = response.aggregations?.manifestations?.issuers_by_name?.buckets || [];

    return {
      generated_at: new Date().toISOString(),
      issuers: buckets.map((bucket) => ({
        name: bucket.key,
        id: bucket.issuer_ids?.buckets?.[0]?.key || null,
        doc_count: bucket.handle_count?.value ?? bucket.doc_count,
      })),
    };
  } catch (error) {
    console.error('[top-issuers] elastic query failed', error);
    return topIssuersData;
  }
}, {
  maxAge: 60 * 15,
  swr: true,
});
