import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { z } from 'zod';
import { elasticsearchRequest } from '~/server/utils/elasticsearchClient';
import { getPocIndexCandidates } from '~/server/utils/pocIndices';

interface TermsBucket {
    key: string;
    doc_count: number;
}

interface NestedAggregationResponse {
    aggregations?: {
        events?: {
            activities?: {
                agents?: {
                    buckets?: TermsBucket[];
                };
            };
        };
        agentNames?: {
            buckets?: TermsBucket[];
        };
    };
}

const bodySchema = z.object({
    q: z.string().trim().optional(),
});

export default defineEventHandler(async (event) => {
    const requestId = crypto.randomUUID();
    const startedAt = performance.now();

    const runtimeConfig = useRuntimeConfig();
    const indexCandidates = getPocIndexCandidates(runtimeConfig);

    if (indexCandidates.length === 0) {
        setResponseStatus(event, 500);
        return {
            buckets: [],
            error: 'Index not configured',
        };
    }

    const rawBody = await readBody(event);
    const parsedBody = bodySchema.safeParse(rawBody);

    if (!parsedBody.success) {
        setResponseStatus(event, 400);
        return {
            buckets: [],
            error: 'Invalid request body',
        };
    }

    const queryText = parsedBody.data.q?.trim();

    if (!queryText) {
        return {
            buckets: [],
            tookMs: Math.round(performance.now() - startedAt),
        };
    }

    const baseQuery = {
        query: {
            multi_match: {
                query: queryText,
                fields: [
                    'has_record.has_primary_title.has_name',
                    'has_record.has_alternative_title.has_name',
                    'subjects',
                    'directors_or_editors',
                    'castmembers',
                    'production',
                ],
            },
        },
        size: 0,
    };

    const nestedAggBody = {
        ...baseQuery,
        aggs: {
            events: {
                nested: {
                    path: 'has_record.has_event',
                },
                aggs: {
                    activities: {
                        nested: {
                            path: 'has_record.has_event.has_activity',
                        },
                        aggs: {
                            agents: {
                                terms: {
                                    field: 'has_record.has_event.has_activity.has_agent.has_name.keyword',
                                    size: 10,
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    const fallbackAggBody = {
        ...baseQuery,
        aggs: {
            agentNames: {
                terms: {
                    field: 'has_record.has_event.has_activity.has_agent.has_name.keyword',
                    size: 10,
                },
            },
        },
    };

    const extractBuckets = (response: NestedAggregationResponse): TermsBucket[] => {
        const nestedBuckets = response.aggregations?.events?.activities?.agents?.buckets;
        if (Array.isArray(nestedBuckets) && nestedBuckets.length > 0) {
            return nestedBuckets.filter((bucket) => typeof bucket?.key === 'string' && typeof bucket?.doc_count === 'number');
        }

        const fallbackBuckets = response.aggregations?.agentNames?.buckets;
        if (Array.isArray(fallbackBuckets) && fallbackBuckets.length > 0) {
            return fallbackBuckets.filter((bucket) => typeof bucket?.key === 'string' && typeof bucket?.doc_count === 'number');
        }

        return [];
    };

    try {
        let response: NestedAggregationResponse | null = null;

        let resolvedIndex = '';
        const attemptErrors: Array<{ index: string; variant: 'nested' | 'fallback'; statusCode?: number; message: string }> = [];

        for (const candidate of indexCandidates) {
            try {
                response = await elasticsearchRequest<NestedAggregationResponse>({
                    path: `${candidate}/_search`,
                    body: nestedAggBody,
                    requestId,
                });
                resolvedIndex = candidate;
                break;
            } catch (nestedError) {
                const nestedObject = nestedError as { statusCode?: number; status?: number; message?: string };
                const statusCode = nestedObject.statusCode ?? nestedObject.status;
                attemptErrors.push({
                    index: candidate,
                    variant: 'nested',
                    statusCode,
                    message: nestedObject.message ?? 'Unknown error',
                });

                if (statusCode !== 404 && statusCode !== 400) {
                    console.warn('[poc/facets/agents] nested aggregation failed, aborting', {
                        requestId,
                        index: candidate,
                        error: nestedError,
                    });
                    throw nestedError;
                }
            }

            try {
                response = await elasticsearchRequest<NestedAggregationResponse>({
                    path: `${candidate}/_search`,
                    body: fallbackAggBody,
                    requestId,
                });
                resolvedIndex = candidate;
                break;
            } catch (fallbackError) {
                const fallbackObject = fallbackError as { statusCode?: number; status?: number; message?: string };
                const statusCode = fallbackObject.statusCode ?? fallbackObject.status;
                attemptErrors.push({
                    index: candidate,
                    variant: 'fallback',
                    statusCode,
                    message: fallbackObject.message ?? 'Unknown error',
                });

                if (statusCode !== 404 && statusCode !== 400) {
                    console.warn('[poc/facets/agents] fallback aggregation failed, aborting', {
                        requestId,
                        index: candidate,
                        error: fallbackError,
                    });
                    throw fallbackError;
                }
            }
        }

        if (!response) {
            console.error('[poc/facets/agents] all index attempts failed', {
                requestId,
                query: queryText,
                attempts: attemptErrors,
            });
            setResponseStatus(event, 502);
            return {
                buckets: [],
                error: 'Facet request failed',
            };
        }

        const buckets = extractBuckets(response ?? {});

        console.info('[poc/facets/agents]', {
            requestId,
            query: queryText,
            bucketCount: buckets.length,
            index: resolvedIndex,
            tookMs: Math.round(performance.now() - startedAt),
        });

        return {
            buckets,
        };
    } catch (error) {
        console.error('[poc/facets/agents] error', {
            requestId,
            query: queryText,
            error,
        });
        setResponseStatus(event, 502);
        return {
            buckets: [],
            error: 'Facet request failed',
        };
    }
});
