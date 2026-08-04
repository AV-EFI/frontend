import { inject } from 'vue';
import type { UiState } from 'instantsearch.js';
import { SEARCH_REFINEMENT_COORDINATOR_KEY } from '~/composables/searchRefinementCoordinator';
import { clickableFacetConfig } from '~/config/clickableFacetConfig';

type NumericRange = { min: number; max: number };
// Only the slice of InstantSearch's instance this composable actually calls.
type InstantSearchInstance = { setUiState?: (fn: (prevState: UiState) => UiState) => void };

function normalizedValue(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeRoutePath(path: unknown): string {
  const raw = String(path || '').trim().replace(/^\/+|\/+$/g, '');
  return `/${raw || 'search'}`;
}

function numericRangeFromValue(value: unknown): NumericRange | null {
  const years = String(value ?? '')
    .match(/\b\d{4}\b/g)
    ?.map(year => Number(year))
    .filter(year => Number.isFinite(year));
  if (!years?.length) return null;
  return { min: Math.min(...years), max: Math.max(...years) };
}

/** Read facet values from the URL — supports IS's indexed format (attr[0]=v) and plain repeated keys (attr=v). */
function readIndexedValues(query: Record<string, unknown>, attribute: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  let i = 0;
  while (true) {
    const key = `${attribute}[${i}]`;
    if (!(key in query)) break;
    const v = normalizedValue(query[key]);
    if (v && !seen.has(v)) { seen.add(v); result.push(v); }
    i++;
  }

  if (result.length === 0) {
    const raw = query[attribute];
    for (const rv of (Array.isArray(raw) ? raw : raw != null ? [raw] : [])) {
      const v = normalizedValue(rv);
      if (v && !seen.has(v)) { seen.add(v); result.push(v); }
    }
  }

  return result;
}

function queryFromSearchParams(params: URLSearchParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  params.forEach((value, key) => {
    const current = query[key];
    if (Array.isArray(current)) {
      current.push(value);
    } else if (current !== undefined) {
      query[key] = [current, value];
    } else {
      query[key] = value;
    }
  });

  return query;
}

function liveQuery(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  return queryFromSearchParams(new URLSearchParams(window.location.search));
}

function isSearchControlParam(key: string): boolean {
  return (
    key === 'query' ||
    key === 'page' ||
    key === 'numericRefinement' ||
    key.startsWith('numericRefinement[') ||
    key.startsWith('range_')
  );
}

function addRefinementValue(target: Record<string, string[]>, attribute: string, value: unknown): void {
  const values = Array.isArray(value) ? value : value !== undefined && value !== null ? [value] : [];

  for (const item of values) {
    const normalized = normalizedValue(item);
    if (!normalized) continue;
    if (!target[attribute]) target[attribute] = [];
    if (!target[attribute].includes(normalized)) target[attribute].push(normalized);
  }
}

function refinementListFromQuery(query: Record<string, unknown>): Record<string, string[]> {
  const refinementList: Record<string, string[]> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (isSearchControlParam(key)) return;

    const indexedMatch = key.match(/^(.+)\[\d+\]$/);
    addRefinementValue(refinementList, indexedMatch ? indexedMatch[1] : key, value);
  });

  return refinementList;
}

function searchTextFromQuery(query: Record<string, unknown>): string {
  const raw = Array.isArray(query.query) ? query.query[0] : query.query;
  return normalizedValue(raw);
}

function dispatchSearchQuerySync(query: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('avefi:search-query-sync', {
    detail: { query },
  }));
}

/** Write facet values in IS's indexed format (attr[0]=v, attr[1]=v, …). */
function writeIndexedValues(query: Record<string, unknown>, attribute: string, values: string[]): void {
  delete query[attribute];
  for (const key of Object.keys(query)) {
    if (key.startsWith(`${attribute}[`)) delete query[key];
  }
  values.forEach((v, i) => { query[`${attribute}[${i}]`] = v; });
}

function toggleValues(current: string[], value: string): string[] {
  return current.includes(value) ? current.filter(v => v !== value) : [...current, value];
}

export function useSearchFacetToggle() {
  const route = useRoute();
  const router = useRouter();
  const runtime = useRuntimeConfig();
  const instantSearchInstance = inject<InstantSearchInstance | null>('$_ais_instantSearchInstance', null);
  const refinementCoordinator = inject(SEARCH_REFINEMENT_COORDINATOR_KEY, null);

  function numericQueryKey(attribute: string, operator: string): string {
    return `numericRefinement[${attribute}][${operator}]`;
  }

  function isNumericRangeActive(attribute: string, value: unknown): boolean {
    const config = clickableFacetConfig[attribute];
    if (config?.type !== 'numericRange') return false;
    const range = numericRangeFromValue(value);
    if (!range) return false;
    const currentMin = normalizedValue(route.query?.[numericQueryKey(config.attribute, config.minOperator)]);
    const currentMax = normalizedValue(route.query?.[numericQueryKey(config.attribute, config.maxOperator)]);
    return currentMin === String(range.min) && currentMax === String(range.max);
  }

  /** Resolve the real IS index name from the live prevState passed by IS's setUiState callback. */
  function resolveIndexName(prevState: Record<string, unknown>): string {
    const keys = Object.keys(prevState);
    if (keys.length > 0) return keys[0];
    return String(runtime.public?.ELASTIC_INDEX || '');
  }

  function facetToggleLocation(attribute: string, value: unknown) {
    const normalized = normalizedValue(value);
    const searchPath = normalizeRoutePath(runtime.public?.SEARCH_URL || 'search');
    const currentPath = normalizeRoutePath(route.path);
    const nextQuery: Record<string, unknown> = { ...route.query };
    delete nextQuery.page;

    if (!attribute || !normalized) {
      return { path: currentPath === searchPath ? route.path : searchPath, query: nextQuery };
    }

    const config = clickableFacetConfig[attribute];
    if (config?.type === 'numericRange') {
      const range = numericRangeFromValue(normalized);
      const minKey = numericQueryKey(config.attribute, config.minOperator);
      const maxKey = numericQueryKey(config.attribute, config.maxOperator);
      delete nextQuery[minKey];
      delete nextQuery[maxKey];
      delete nextQuery[`range_${config.attribute}`];
      if (range && !isNumericRangeActive(attribute, normalized)) {
        nextQuery[minKey] = String(range.min);
        nextQuery[maxKey] = String(range.max);
      }
      return { path: currentPath === searchPath ? route.path : searchPath, query: nextQuery };
    }

    const existingValues = readIndexedValues(nextQuery as Record<string, unknown>, attribute);
    writeIndexedValues(nextQuery, attribute, toggleValues(existingValues, normalized));
    return { path: currentPath === searchPath ? route.path : searchPath, query: nextQuery };
  }

  function getFacetToggleHref(attribute: string, value: unknown): string {
    return router.resolve(facetToggleLocation(attribute, value)).href;
  }

  function isFacetValueActive(attribute: string, value: unknown): boolean {
    if (clickableFacetConfig[attribute]?.type === 'numericRange') {
      return isNumericRangeActive(attribute, value);
    }
    const normalized = normalizedValue(value);
    if (!attribute || !normalized) return false;
    return readIndexedValues(route.query as Record<string, unknown>, attribute).includes(normalized);
  }

  async function toggleFacetValue(attribute: string, value: unknown) {
    const normalized = normalizedValue(value);
    if (!attribute || !normalized) return;

    const config = clickableFacetConfig[attribute];

    if (config?.type === 'numericRange') {
      // Read live URL directly — route.query can be stale when IS updates the URL
      // via window.history.pushState before router.replace propagates to Vue Router.
      const range = numericRangeFromValue(normalized);
      const minKey = numericQueryKey(config.attribute, config.minOperator);
      const maxKey = numericQueryKey(config.attribute, config.maxOperator);
      const params = new URLSearchParams(window.location.search);
      const currentMin = params.get(minKey) ?? '';
      const currentMax = params.get(maxKey) ?? '';
      const alreadyActive = Boolean(
        range &&
                currentMin === String(range.min) &&
                currentMax === String(range.max),
      );
      params.delete(minKey);
      params.delete(maxKey);
      params.delete(`range_${config.attribute}`);
      params.delete('page');
      if (range && !alreadyActive) {
        params.set(minKey, String(range.min));
        params.set(maxKey, String(range.max));
      }
      const searchPath = normalizeRoutePath(runtime.public?.SEARCH_URL || 'search');
      const currentPath = normalizeRoutePath(window.location.pathname);
      const targetPath = currentPath === searchPath ? window.location.pathname : searchPath;
      const qs = params.toString();
      window.location.assign(`${targetPath}${qs ? `?${qs}` : ''}`);
      return;
    }

    const updateInstantSearch = () => {
      if (!instantSearchInstance?.setUiState) return false;

      instantSearchInstance.setUiState((prevState: UiState) => {
        const indexName = resolveIndexName(prevState);
        const indexState = prevState[indexName] || {};
        const currentQuery = liveQuery();
        const refinementList = refinementListFromQuery(currentQuery);
        const query = searchTextFromQuery(currentQuery);

        const existing = readIndexedValues(currentQuery, attribute);
        const next = toggleValues(existing, normalized);

        if (next.length) {
          refinementList[attribute] = next;
        } else {
          delete refinementList[attribute];
        }

        return {
          ...prevState,
          [indexName]: {
            ...indexState,
            query: query || undefined,
            page: 1,
            refinementList,
          },
        };
      });
      return true;
    };

    const operation = () => {
      if (updateInstantSearch()) return;
      window.location.assign(router.resolve(facetToggleLocation(attribute, normalized)).href);
    };

    refinementCoordinator
      ? refinementCoordinator.runRefinementAction('result-facet-toggle', operation)
      : operation();
  }

  /** Start a completely fresh search with only this single facet — clears all existing filters. */
  function startNewSearchViaIS(attribute: string, value: unknown): boolean {
    const normalized = normalizedValue(value);
    if (!attribute || !normalized) return false;

    const config = clickableFacetConfig[attribute];

    // numericRange (production year) is driven by VueSlider + route.query, not setUiState.
    // Return false so the caller uses window.location.assign for a clean full-page reload.
    if (config?.type === 'numericRange') return false;

    if (!instantSearchInstance?.setUiState) return false;

    instantSearchInstance.setUiState((prevState: UiState) => {
      const indexName = resolveIndexName(prevState);
      return {
        ...prevState,
        [indexName]: {
          query: undefined,
          refinementList: { [attribute]: [normalized] },
        },
      };
    });

    dispatchSearchQuerySync('');
    return true;
  }

  function getNewSearchLocation(attribute: string, value: unknown) {
    const normalized = normalizedValue(value);
    const searchPath = normalizeRoutePath(runtime.public?.SEARCH_URL || 'search');
    const config = clickableFacetConfig[attribute];

    if (config?.type === 'numericRange') {
      const range = numericRangeFromValue(normalized);
      if (!range) return { path: searchPath, query: {} };
      return {
        path: searchPath,
        query: {
          [numericQueryKey(config.attribute, config.minOperator)]: String(range.min),
          [numericQueryKey(config.attribute, config.maxOperator)]: String(range.max),
        },
      };
    }

    const query: Record<string, string> = {};
    if (normalized) query[`${attribute}[0]`] = normalized;
    return { path: searchPath, query };
  }

  return {
    getFacetToggleHref,
    isFacetValueActive,
    toggleFacetValue,
    startNewSearchViaIS,
    getNewSearchLocation,
  };
}
