import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { z } from 'zod';
import { elasticsearchRequest } from '~/server/utils/elasticsearchClient';
import { getPocIndexCandidates } from '~/server/utils/pocIndices';

interface WorkSearchSource {
    handle?: string;
    category?: string | null;
    has_record?: {
        category?: string | null;
        has_primary_title?: {
            has_name?: string;
        } | null;
        has_alternative_title?: Array<{
            has_name?: string;
        } | null> | null;
        described_by?: {
            has_issuer_name?: string;
        } | null;
    } | null;
}

interface ElasticsearchSearchResponse<TDocument> {
    took?: number;
    hits?: {
        hits?: Array<{
            _id?: string;
            _source?: TDocument | null;
        } | null>;
    };
}

const bodySchema = z.object({
    q: z.string({ required_error: 'Query is required' }).trim().optional(),
    size: z.number().int().min(1).max(25).optional(),
});

export default defineEventHandler(async (event) => {
    const requestId = crypto.randomUUID();
    const startedAt = performance.now();

    const rawBody = await readBody(event);
    const parsedBody = bodySchema.safeParse(rawBody);

    if (!parsedBody.success) {
        setResponseStatus(event, 400);
        return {
            hits: [],
            tookMs: 0,
            error: 'Invalid request body',
        };
    }

    const { q, size } = parsedBody.data;

    if (!q || q.length === 0) {
        return {
            hits: [],
            tookMs: Math.round(performance.now() - startedAt),
        };
    }

    const runtimeConfig = useRuntimeConfig();
    const indexCandidates = getPocIndexCandidates(runtimeConfig);

    if (indexCandidates.length === 0) {
        setResponseStatus(event, 500);
        return {
            hits: [],
            tookMs: Math.round(performance.now() - startedAt),
            error: 'Search index is not configured',
        };
    }

    try {
        const queryBody = {
            size: size ?? 10,
            query: {
                multi_match: {
                    query: q,
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
            _source: [
                'handle',
                'category',
                'has_record.category',
                'has_record.has_primary_title.has_name',
                'has_record.has_alternative_title.has_name',
                'has_record.described_by.has_issuer_name',
            ],
        };

        let esResponse: ElasticsearchSearchResponse<WorkSearchSource> | null = null;
        let resolvedIndex = '';
        const attemptErrors: Array<{ index: string; statusCode?: number; message: string }> = [];

        for (const candidate of indexCandidates) {
            try {
                esResponse = await elasticsearchRequest<ElasticsearchSearchResponse<WorkSearchSource>>({
                    path: `${candidate}/_search`,
                    body: queryBody,
                    requestId,
                });
                resolvedIndex = candidate;
                break;
            } catch (err) {
                const errorObject = err as { statusCode?: number; status?: number; message?: string };
                const statusCode = errorObject.statusCode ?? errorObject.status;
                attemptErrors.push({
                    index: candidate,
                    statusCode,
                    message: errorObject.message ?? 'Unknown error',
                });

                if (statusCode === 404 || statusCode === 400) {
                    continue;
                }

                throw err;
            }
        }

        if (!esResponse) {
            console.error('[poc/works/search] all index attempts failed', {
                requestId,
                attempts: attemptErrors,
            });
            setResponseStatus(event, 502);
            return {
                hits: [],
                tookMs: Math.round(performance.now() - startedAt),
                error: 'Search index not reachable',
            };
        }

        const hits = esResponse.hits?.hits ?? [];
        const determineLevel = (source: WorkSearchSource): string | undefined => {
            const rawCategory = source.has_record?.category ?? source.category;
            if (typeof rawCategory === 'string' && rawCategory.trim().length > 0) {
                return rawCategory.trim();
            }

            return 'avefi:WorkVariant';
        };

        const mappedHits = hits
            .filter((hit): hit is NonNullable<typeof hit> => !!hit)
            .map((hit) => {
                const source = hit._source ?? {};
                const primaryTitle = source.has_record?.has_primary_title?.has_name?.trim();
                const alternativeTitle = source.has_record?.has_alternative_title?.[0]?.has_name?.trim();

                return {
                    handle: source.handle ?? hit._id ?? '',
                    title: primaryTitle || alternativeTitle || source.handle || hit._id || undefined,
                    issuer: source.has_record?.described_by?.has_issuer_name ?? undefined,
                    level: determineLevel(source),
                };
            })
            .filter((hit) => hit.handle.length > 0)
            .slice(0, size ?? 10);

        const tookMs = typeof esResponse.took === 'number'
            ? esResponse.took
            : Math.round(performance.now() - startedAt);

        console.info('[poc/works/search]', {
            requestId,
            index: resolvedIndex,
            query: q,
            resultCount: mappedHits.length,
            tookMs,
        });

        return {
            hits: mappedHits,
            tookMs,
        };
    } catch (error) {
        console.error('[poc/works/search] error', {
            requestId,
            error,
        });
        setResponseStatus(event, 502);
        return {
            hits: [],
            tookMs: Math.round(performance.now() - startedAt),
            error: 'Search request failed',
        };
    }
});
