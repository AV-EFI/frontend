import { defineEventHandler, createError } from 'h3';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

const DEFAULT_TOP_ISSUERS_INDEX = '21.11155-denormalised-work';

interface IssuersAggBucket {
  key: string;
  doc_count: number;
  handle_count?: { value: number };
  issuer_ids?: { buckets?: Array<{ key: string }> };
}

interface IssuersAggregationsResponse {
  manifestations?: {
    issuers_by_name?: {
      buckets?: IssuersAggBucket[];
    };
  };
}

function buildBackendAlignedTopIssuersQuery(size = 20) {
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

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const index =
    process.env.ELASTIC_TOP_ISSUERS_INDEX ||
    process.env.ELASTIC_GWDG_INDEX ||
    config.public.ELASTIC_INDEX ||
    DEFAULT_TOP_ISSUERS_INDEX;
  const client = createElasticsearchClient();

  try {
    const response = await client.search({
      index,
      ...buildBackendAlignedTopIssuersQuery(20),
    });

    const aggregations = response.aggregations as IssuersAggregationsResponse | undefined;
    const nameBuckets = aggregations?.manifestations?.issuers_by_name?.buckets || [];
    const issuers = nameBuckets.map((bucket) => ({
      name: bucket.key,
      id: bucket.issuer_ids?.buckets?.[0]?.key || null,
      doc_count: bucket.handle_count?.value ?? bucket.doc_count,
    }));

    return {
      success: true,
      issuers,
    };
  } catch (error) {
    console.error('Error fetching issuer aggregations:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to fetch issuer data',
    });
  }
});
