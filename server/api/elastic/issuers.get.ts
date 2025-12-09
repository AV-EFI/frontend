/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler } from 'h3';
import { Client } from '@elastic/elasticsearch';

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const index = config.public.ELASTIC_INDEX;
    
    // Initialize the ElasticSearch client
    const client = new Client({
        node: config.public.ELASTIC_HOST_PUBLIC || 'http://localhost:9200',
    });

    try {
        // Perform aggregation query to get top issuers from nested manifestations
        const response = await client.search({
            index,
            body: {
                size: 0,
                aggs: {
                    manifestations_nested: {
                        nested: {
                            path: 'manifestations'
                        },
                        aggs: {
                            issuers_by_name: {
                                terms: {
                                    field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
                                    size: 20,
                                    order: {
                                        _count: 'desc'
                                    }
                                },
                                aggs: {
                                    issuer_ids: {
                                        terms: {
                                            field: 'manifestations.has_record.described_by.has_issuer_id.keyword',
                                            size: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Extract issuers with names and IDs from nested aggregation
        const nameBuckets = response.aggregations?.manifestations_nested?.issuers_by_name?.buckets || [];
        
        const issuers = nameBuckets.map((bucket: any) => ({
            name: bucket.key,
            id: bucket.issuer_ids?.buckets?.[0]?.key || null,
            doc_count: bucket.doc_count
        }));
        
        // Return the aggregation results
        return {
            success: true,
            issuers
        };
    } catch (error: any) {
        console.error('Error fetching issuer aggregations:', error);
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to fetch issuer data',
        });
    }
});
