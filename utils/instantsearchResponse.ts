type InstantSearchRequest = {
  params?: Record<string, unknown>;
};

type InstantSearchResult = {
  hits: unknown[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
};

type InstantSearchResponse = {
  results: InstantSearchResult[];
  __avefiFallback?: boolean;
  [key: string]: unknown;
};

function buildEmptyResult(request: InstantSearchRequest): InstantSearchResult {
  const params = request?.params ?? {};
  const hitsPerPage = Number(params.hitsPerPage ?? 20);
  const page = Number(params.page ?? 0);
  const query = typeof params.query === 'string' ? params.query : '';

  return {
    hits: [],
    nbHits: 0,
    page: Number.isFinite(page) ? page : 0,
    nbPages: 0,
    hitsPerPage: Number.isFinite(hitsPerPage) && hitsPerPage > 0 ? hitsPerPage : 20,
    processingTimeMS: 0,
    exhaustiveNbHits: false,
    query,
    params: '',
  };
}

export function normalizeInstantSearchResponse(
  raw: unknown,
  requests: InstantSearchRequest[],
): InstantSearchResponse {
  const safeRequests = Array.isArray(requests) ? requests : [];
  const fallback = {
    results: safeRequests.map((req) => buildEmptyResult(req)),
    __avefiFallback: true,
  };

  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as any).results)) {
    return fallback;
  }

  const rawResponse = raw as Record<string, unknown> & { results: unknown[] };

  return {
    ...rawResponse,
    __avefiFallback: false,
    results: safeRequests.map((req, idx) => {
      const current = rawResponse.results[idx];
      if (!current || typeof current !== 'object') {
        return buildEmptyResult(req);
      }

      const currentObj = current as Record<string, unknown>;
      return {
        ...buildEmptyResult(req),
        ...currentObj,
        hits: Array.isArray(currentObj.hits) ? currentObj.hits : [],
      };
    }),
  };
}
