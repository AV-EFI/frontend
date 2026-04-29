/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler } from 'h3';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

const DEFAULT_TOP_ISSUERS_INDEX = '21.11155-denormalised-work';

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
      body: buildBackendAlignedTopIssuersQuery(20),
    });

    const nameBuckets = response.aggregations?.manifestations?.issuers_by_name?.buckets || [];
    const issuers = nameBuckets.map((bucket: any) => ({
      name: bucket.key,
      id: bucket.issuer_ids?.buckets?.[0]?.key || null,
      doc_count: bucket.handle_count?.value ?? bucket.doc_count,
    }));

    return {
      success: true,
      issuers,
    };
  } catch (error: any) {
    console.error('Error fetching issuer aggregations:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch issuer data',
    });
  }
});
