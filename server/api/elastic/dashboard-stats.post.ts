/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, getRequestURL } from 'h3';

const DEFAULT_INDEX = '21.11155-denormalised-work';
const DEFAULT_SEARCH_PATH = 'frontend/search';

function joinUrl(base: string, pathPart: string): string {
  return `${base.replace(/\/+$/, '')}/${pathPart.replace(/^\/+/, '')}`;
}

function resolveBackendBase(config: any, origin: string): string {
  const configured =
    process.env.TOP_ISSUERS_BACKEND_BASE
    || config.public?.PUBLIC_AVEFI_ELASTIC_API
    || config.public?.AVEFI_ELASTIC_API
    || process.env.PUBLIC_AVEFI_ELASTIC_API
    || process.env.AVEFI_ELASTIC_API
    || '/rest/v1';

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

function parseSearchResult(response: any) {
  return (
    response?.results?.[0]
    || response?.responses?.[0]
    || response?.[0]
    || null
  );
}

function errorStatus(error: any): number | null {
  return error?.response?.status || error?.status || error?.statusCode || null;
}

async function searchBackend(searchUrl: string, indexName: string, params: Record<string, unknown>) {
  const payload = searchPayload(indexName, params);

  try {
    const response = await $fetch<any>(searchUrl, {
      method: 'POST',
      body: payload,
    });

    return parseSearchResult(response);
  } catch (firstError: any) {
    if (errorStatus(firstError) !== 422) {
      throw firstError;
    }

    const response = await $fetch<any>(searchUrl, {
      method: 'POST',
      body: { requests: payload },
    });

    return parseSearchResult(response);
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const origin = getRequestURL(event).origin;
  const backendBase = resolveBackendBase(config, origin);
  const searchPath =
    config.public?.AVEFI_ELASTIC_API_SEARCH_ENDPOINT
    || config.public?.AVEFI_SEARCH
    || process.env.AVEFI_ELASTIC_API_SEARCH_ENDPOINT
    || process.env.AVEFI_SEARCH
    || DEFAULT_SEARCH_PATH;
  const searchUrl = joinUrl(backendBase, searchPath);
  const indexName = config.public?.ELASTIC_INDEX || process.env.ELASTIC_INDEX || DEFAULT_INDEX;

  const result = await searchBackend(searchUrl, indexName, {
    hitsPerPage: 0,
    facets: ['has_issuer_name'],
  });

  return {
    success: true,
    counts: {
      works: Number(result?.nbWorks ?? result?.nbHits ?? 0),
      manifestations: Number(result?.nbManifestations ?? 0),
      items: Number(result?.nbItems ?? 0),
    },
    updatedAt: new Date().toISOString(),
  };
});
