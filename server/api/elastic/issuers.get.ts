/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler } from 'h3';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const index = config.public.ELASTIC_INDEX;
  const client = createElasticsearchClient();

  try {
    const response = await client.search({
      index,
      body: {
        size: 0,
        aggs: {
          manifestations_nested: {
            nested: {
              path: 'manifestations',
            },
            aggs: {
              issuers_by_name: {
                terms: {
                  field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
                  size: 20,
                  order: {
                    _count: 'desc',
                  },
                },
                aggs: {
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
      },
    });

    const nameBuckets = response.aggregations?.manifestations_nested?.issuers_by_name?.buckets || [];
    const issuers = nameBuckets.map((bucket: any) => ({
      name: bucket.key,
      id: bucket.issuer_ids?.buckets?.[0]?.key || null,
      doc_count: bucket.doc_count,
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
