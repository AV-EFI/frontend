import { defineEventHandler, getQuery, setResponseStatus } from 'h3';
import { z } from 'zod';
import { elasticsearchRequest } from '~/server/utils/elasticsearchClient';
import { getPocIndexCandidates } from '~/server/utils/pocIndices';
import { extractGraphSliceFromWorkDoc, type PocWorkDocument } from '~/utils/poc/graphSlice';

interface ElasticsearchSearchResponse<TDocument> {
    took?: number;
    hits?: {
        hits?: Array<{
            _id?: string;
            _source?: TDocument | null;
        } | null>;
    };
}

const querySchema = z.object({
    handle: z.string({ required_error: 'Handle is required' }).trim().min(1),
});

export default defineEventHandler(async (event) => {
    const requestId = crypto.randomUUID();
    const startedAt = performance.now();

    const rawQuery = getQuery(event);
    const parsedQuery = querySchema.safeParse(rawQuery);

    if (!parsedQuery.success) {
        setResponseStatus(event, 400);
        return {
            error: 'Handle query parameter is required',
        };
    }

    const { handle } = parsedQuery.data;
    const runtimeConfig = useRuntimeConfig();
    const indexCandidates = getPocIndexCandidates(runtimeConfig);

    if (indexCandidates.length === 0) {
        setResponseStatus(event, 500);
        return {
            error: 'Work index is not configured',
        };
    }

    try {
        const attemptErrors: Array<{ index: string; stage: 'keyword' | 'plain'; statusCode?: number; message: string }> = [];

        let resolvedHit: { _id?: string; _source?: PocWorkDocument | null } | null = null;
        let tookMs = Math.round(performance.now() - startedAt);
        let resolvedIndex = '';

        for (const candidate of indexCandidates) {
            const keywordQuery = {
                size: 1,
                query: {
                    term: {
                        'handle.keyword': handle,
                    },
                },
            };

            try {
                const keywordResponse = await elasticsearchRequest<ElasticsearchSearchResponse<PocWorkDocument>>({
                    path: `${candidate}/_search`,
                    body: keywordQuery,
                    requestId,
                });

                const hit = keywordResponse.hits?.hits?.find((item) => !!item && !!item._source) ?? null;
                if (hit) {
                    resolvedHit = hit;
                    tookMs = typeof keywordResponse.took === 'number'
                        ? keywordResponse.took
                        : tookMs;
                    resolvedIndex = candidate;
                    break;
                }
            } catch (err) {
                const errorObject = err as { statusCode?: number; status?: number; message?: string };
                const statusCode = errorObject.statusCode ?? errorObject.status;
                attemptErrors.push({
                    index: candidate,
                    stage: 'keyword',
                    statusCode,
                    message: errorObject.message ?? 'Unknown error',
                });

                if (statusCode !== 404 && statusCode !== 400) {
                    throw err;
                }
            }

            if (!resolvedHit) {
                const fallbackQuery = {
                    size: 1,
                    query: {
                        term: {
                            handle,
                        },
                    },
                };

                try {
                    const fallbackResponse = await elasticsearchRequest<ElasticsearchSearchResponse<PocWorkDocument>>({
                        path: `${candidate}/_search`,
                        body: fallbackQuery,
                        requestId,
                    });

                    const hit = fallbackResponse.hits?.hits?.find((item) => !!item && !!item._source) ?? null;
                    if (hit) {
                        resolvedHit = hit;
                        tookMs = typeof fallbackResponse.took === 'number'
                            ? fallbackResponse.took
                            : tookMs;
                        resolvedIndex = candidate;
                        break;
                    }
                } catch (err) {
                    const errorObject = err as { statusCode?: number; status?: number; message?: string };
                    const statusCode = errorObject.statusCode ?? errorObject.status;
                    attemptErrors.push({
                        index: candidate,
                        stage: 'plain',
                        statusCode,
                        message: errorObject.message ?? 'Unknown error',
                    });

                    if (statusCode !== 404 && statusCode !== 400) {
                        throw err;
                    }
                }
            }
        }

        if (!resolvedHit || !resolvedHit._source) {
            setResponseStatus(event, 404);
            console.warn('[poc/works/by-handle] not found', { requestId, handle, attempts: attemptErrors });
            return {
                error: 'Work not found',
            };
        }

        const workDoc: PocWorkDocument = {
            ...resolvedHit._source,
            _id: resolvedHit._id ?? resolvedHit._source._id,
        };

        const graphSlice = extractGraphSliceFromWorkDoc(workDoc);

        console.info('[poc/works/by-handle]', {
            requestId,
            handle,
            tookMs,
            index: resolvedIndex,
            nodes: graphSlice.nodes.length,
        });

        return {
            workDoc,
            graphSlice,
            tookMs,
        };
    } catch (error) {
        console.error('[poc/works/by-handle] error', {
            requestId,
            handle,
            error,
        });
        setResponseStatus(event, 502);
        return {
            error: 'Failed to retrieve work',
        };
    }
});
