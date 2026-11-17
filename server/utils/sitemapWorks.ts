import { $fetch } from 'ofetch';

/*
 * Collects one sitemap URL per work from the public search API.
 *
 * The search API returns at most 10,000 hits per query and 100 hits per page, so the works are
 * collected per institution (each one stays below 10,000) and deduplicated, because a work can be
 * held by several institutions. Collecting all works takes about a minute, so the result is cached
 * for a day and refreshed in the background while the previous list is still served.
 */

type SearchHit = { handle?: string; '@timestamp'?: number };

type SearchResult = {
  hits?: SearchHit[];
  nbPages?: number;
  nbWorks?: number;
  facets?: { has_issuer_name?: Record<string, number> };
};

export type SitemapWorkUrl = { loc: string; lastmod?: string };

const DEFAULT_SEARCH_PATH = 'frontend/search';
const DEFAULT_INDEX = '21.11155-denormalised-work';
const MAX_HITS_PER_PAGE = 100;
const MAX_INSTITUTIONS = 100;
const CACHE_MAX_AGE_SECONDS = 24 * 60 * 60;

function joinUrl(base: string, pathPart: string) {
  return `${base.replace(/\/+$/, '')}/${pathPart.replace(/^\/+/, '')}`;
}

// A relative API base is resolved against the public site URL, because there is no request to take
// the origin from when the list is built at server start.
function resolveSearchUrl() {
  const config = useRuntimeConfig();
  const apiBase = String(config.public.elasticApiBase || '/rest/v1');
  const absoluteApiBase = apiBase.startsWith('http') ? apiBase : joinUrl(String(config.public.siteUrl), apiBase);
  return joinUrl(absoluteApiBase, String(config.public.searchApiPath || DEFAULT_SEARCH_PATH));
}

async function search(searchUrl: string, indexName: string, params: Record<string, unknown>) {
  const response = await $fetch<{ results?: SearchResult[] }>(searchUrl, {
    method: 'POST',
    body: [{ indexName, params: { query: '', ...params } }],
    retry: 2,
    retryDelay: 1000,
  });
  return response.results?.[0] ?? {};
}

async function collectWorkUrls(): Promise<SitemapWorkUrl[]> {
  const searchUrl = resolveSearchUrl();
  const indexName = String(useRuntimeConfig().public.ELASTIC_INDEX || DEFAULT_INDEX);

  const overview = await search(searchUrl, indexName, {
    hitsPerPage: 0,
    facets: ['has_issuer_name'],
    maxValuesPerFacet: MAX_INSTITUTIONS,
  });

  const lastModifiedByHandle = new Map<string, number>();
  for (const institution of Object.keys(overview.facets?.has_issuer_name ?? {})) {
    for (let page = 0; ; page++) {
      const result = await search(searchUrl, indexName, {
        hitsPerPage: MAX_HITS_PER_PAGE,
        page,
        facetFilters: [[`has_issuer_name:${institution}`]],
      });
      for (const hit of result.hits ?? []) {
        if (!hit.handle) continue;
        lastModifiedByHandle.set(hit.handle, Math.max(lastModifiedByHandle.get(hit.handle) ?? 0, hit['@timestamp'] ?? 0));
      }
      if (!result.hits?.length || page + 1 >= (result.nbPages ?? 0)) break;
    }
  }

  if (overview.nbWorks !== undefined && lastModifiedByHandle.size < overview.nbWorks) {
    console.warn(
      `[sitemap] collected ${lastModifiedByHandle.size} of ${overview.nbWorks} works. An institution may exceed `
      + 'the 10,000 hits limit of the search API, or a work has no institution.',
    );
  }

  return [...lastModifiedByHandle].map(([handle, timestamp]) => ({
    loc: `/res/${handle}`,
    ...(timestamp ? { lastmod: new Date(timestamp).toISOString() } : {}),
  }));
}

export const getSitemapWorkUrls = defineCachedFunction(collectWorkUrls, {
  name: 'sitemap-work-urls',
  getKey: () => 'all',
  maxAge: CACHE_MAX_AGE_SECONDS,
  swr: true,
});
