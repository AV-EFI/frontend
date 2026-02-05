import { createError } from 'h3';

export interface ElasticsearchRequestOptions {
    path: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    timeoutMs?: number;
    requestId?: string;
}

const DEFAULT_TIMEOUT_MS = 8000;

export async function elasticsearchRequest<T>(options: ElasticsearchRequestOptions): Promise<T> {
    const runtimeConfig = useRuntimeConfig();
    const baseCandidates = [
        runtimeConfig.private?.ELASTIC_HOST_INTERNAL,
        runtimeConfig.public?.ELASTIC_HOST_INTERNAL,
        runtimeConfig.private?.ELASTIC_HOST_PUBLIC,
        runtimeConfig.public?.ELASTIC_HOST_PUBLIC,
    ]
        .map((candidate) => (typeof candidate === 'string' ? candidate.trim() : ''))
        .filter((candidate): candidate is string => candidate.length > 0);

    if (baseCandidates.length === 0) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Elasticsearch base URL is not configured',
        });
    }

    const apiKey = runtimeConfig.private?.ELASTIC_APIKEY ?? runtimeConfig.public?.ELASTIC_APIKEY;

    let lastError: Error | null = null;

    for (const baseUrl of baseCandidates) {
        const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const url = new URL(options.path.replace(/^\/+/u, ''), normalizedBase);

        if (options.query) {
            Object.entries(options.query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, String(value));
                }
            });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

        try {
            const headers = new Headers({
                'content-type': 'application/json',
                accept: 'application/json',
            });

            if (apiKey) {
                headers.set('authorization', `ApiKey ${apiKey}`);
            }

            if (options.requestId) {
                headers.set('x-request-id', options.requestId);
            }

            const response = await fetch(url, {
                method: options.method ?? 'POST',
                headers,
                body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
                signal: controller.signal,
            });

            const text = await response.text();
            if (!response.ok) {
                lastError = createError({
                    statusCode: response.status,
                    statusMessage: 'Elasticsearch request failed',
                    data: {
                        requestId: options.requestId,
                        baseUrl,
                        body: text,
                    },
                });
                continue;
            }

            if (!text) {
                return {} as T;
            }

            return JSON.parse(text) as T;
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                lastError = createError({
                    statusCode: 504,
                    statusMessage: 'Elasticsearch request timed out',
                    data: {
                        requestId: options.requestId,
                        baseUrl,
                    },
                });
            } else {
                lastError = createError({
                    statusCode: 502,
                    statusMessage: 'Elasticsearch request failed',
                    data: {
                        requestId: options.requestId,
                        baseUrl,
                        error: (error as Error).message,
                    },
                });
            }
            continue;
        } finally {
            clearTimeout(timeout);
        }
    }

    if (lastError) {
        throw lastError;
    }

    throw createError({
        statusCode: 502,
        statusMessage: 'Elasticsearch request failed for all base URLs',
        data: {
            requestId: options.requestId,
        },
    });
}
