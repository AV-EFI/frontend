import { defineCachedEventHandler, getRequestURL } from '#imports';
import { createError, getRequestHeader } from 'h3';
import topIssuersData from '~/data/top-issuers.json';

interface Issuer {
  name: string;
  id: string | null;
  doc_count: number;
  category_counts: {
    'avefi:WorkVariant': number;
    'avefi:Manifestation': number;
    'avefi:Item': number;
  };
}

const DEFAULT_INDEX = '21.11155-denormalised-work';
const DEFAULT_SEARCH_PATH = 'frontend/search';

function joinUrl(base: string, pathPart: string) {
  return `${base.replace(/\/+$/, '')}/${pathPart.replace(/^\/+/, '')}`;
}

function resolveBackendBase(config: any, origin: string) {
  const configured =
    process.env.TOP_ISSUERS_BACKEND_BASE ||
    config.public?.PUBLIC_AVEFI_ELASTIC_API ||
    config.public?.AVEFI_ELASTIC_API ||
    process.env.PUBLIC_AVEFI_ELASTIC_API ||
    process.env.AVEFI_ELASTIC_API ||
    '/rest/v1';

  return configured.startsWith('http') ? configured : joinUrl(origin, configured);
}

function searchPayload(indexName: string, params: Record<string, unknown>) {
  return [
    {
      indexName,
      params: {
        query: '',
        page: 0,
        ...params,
      },
    },
  ];
}

async function searchBackend(searchUrl: string, indexName: string, params: Record<string, unknown>) {
  const response = await $fetch<any>(searchUrl, {
    method: 'POST',
    body: searchPayload(indexName, params),
  });

  return response?.results?.[0];
}

function extractIssuerId(result: any, issuerName: string): string | null {
  for (const hit of result?.hits || []) {
    for (const manifestation of hit?.manifestations || []) {
      const describedBy = manifestation?.has_record?.described_by;
      if (describedBy?.has_issuer_name === issuerName && describedBy?.has_issuer_id) {
        return describedBy.has_issuer_id;
      }
    }
  }

  return null;
}

function isRefreshRequested(event: any): boolean {
  const refresh = getRequestURL(event).searchParams.get('refresh')?.toLowerCase();
  return refresh === '1' || refresh === 'true' || refresh === 'yes';
}

function hasValidRefreshToken(event: any): boolean {
  const configuredToken = process.env.TOP_ISSUERS_REFRESH_TOKEN || '';
  if (!configuredToken) {
    return false;
  }

  const providedToken =
    getRequestHeader(event, 'x-top-issuers-refresh-token') ||
    getRequestHeader(event, 'x-refresh-token') ||
    '';

  return providedToken === configuredToken;
}

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (isRefreshRequested(event) && !hasValidRefreshToken(event)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  // In local dev, use live backend data by default.
  // Set TOP_ISSUERS_USE_STATIC=true to force deterministic generated data.
  const useStaticInDev = process.env.TOP_ISSUERS_USE_STATIC === 'true';
  if (process.dev && useStaticInDev) {
    return topIssuersData;
  }

  const origin = getRequestURL(event).origin;
  const backendBase = resolveBackendBase(config, origin);
  const searchPath =
    config.public?.AVEFI_ELASTIC_API_SEARCH_ENDPOINT ||
    config.public?.AVEFI_SEARCH ||
    process.env.AVEFI_ELASTIC_API_SEARCH_ENDPOINT ||
    process.env.AVEFI_SEARCH ||
    DEFAULT_SEARCH_PATH;
  const searchUrl = joinUrl(backendBase, searchPath);
  const indexName = config.public?.ELASTIC_INDEX || process.env.ELASTIC_INDEX || DEFAULT_INDEX;
  const issuerLimit = Number(process.env.TOP_ISSUERS_LIMIT || 10);

  try {
    const facetResult = await searchBackend(searchUrl, indexName, {
      hitsPerPage: 0,
      facets: ['has_issuer_name'],
    });

    const issuerNames = Object.entries(facetResult?.facets?.has_issuer_name || {})
      .sort(([, left], [, right]) => Number(right) - Number(left))
      .slice(0, issuerLimit)
      .map(([name]) => name);

    const issuers: Issuer[] = [];

    for (const issuerName of issuerNames) {
      const result = await searchBackend(searchUrl, indexName, {
        hitsPerPage: 5,
        facetFilters: [[`has_issuer_name:${issuerName}`]],
      });
      const manifestationCount = result?.nbManifestations ?? 0;

      issuers.push({
        name: issuerName,
        id: extractIssuerId(result, issuerName),
        doc_count: manifestationCount,
        category_counts: {
          'avefi:WorkVariant': result?.nbWorks ?? 0,
          'avefi:Manifestation': manifestationCount,
          'avefi:Item': result?.nbItems ?? 0,
        },
      });
    }

    return {
      generated_at: new Date().toISOString(),
      issuers,
    };
  } catch (error) {
    console.error('[top-issuers] search backend query failed', error);
    return topIssuersData;
  }
}, {
  // Cache for one day by default.
  // Override via TOP_ISSUERS_CACHE_MAX_AGE_SECONDS (e.g. 300, 3600, 86400).
  maxAge: Number(process.env.TOP_ISSUERS_CACHE_MAX_AGE_SECONDS || 86400),
  // Manual bypass: /api/top-issuers?refresh=1
  // (or refresh=true / yes) forces a fresh backend fetch only with
  // header x-top-issuers-refresh-token (or x-refresh-token) matching
  // TOP_ISSUERS_REFRESH_TOKEN.
  getKey: (event) => {
    const shouldRefresh = isRefreshRequested(event) && hasValidRefreshToken(event);
    return shouldRefresh ? `top-issuers-refresh-${Date.now()}` : 'top-issuers';
  },
  // When cache expires, block and fetch fresh backend values before responding.
  swr: false,
});
