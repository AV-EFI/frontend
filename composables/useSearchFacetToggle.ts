import { inject } from 'vue';
import { SEARCH_REFINEMENT_COORDINATOR_KEY } from '~/composables/searchRefinementCoordinator';
import { clickableFacetConfig } from '~/config/clickableFacetConfig';

type RouteQueryValue = string | string[] | null | undefined;
type NumericRange = { min: number; max: number };

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

    return {
        min: Math.min(...years),
        max: Math.max(...years),
    };
}

/** Read facet values from URL query using the indexed format (attribute[0], attribute[1], …).
 *  Falls back to reading a plain repeated key (attribute=v1&attribute=v2) for compatibility. */
function readIndexedValues(query: Record<string, unknown>, attribute: string): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    // Indexed format: attribute[0]=v, attribute[1]=v, …
    let i = 0;
    while (true) {
        const key = `${attribute}[${i}]`;
        if (!(key in query)) break;
        const v = normalizedValue(query[key]);
        if (v && !seen.has(v)) { seen.add(v); result.push(v); }
        i++;
    }

    // Plain repeated-key fallback: attribute=v
    if (result.length === 0) {
        const raw = query[attribute];
        const rawValues = Array.isArray(raw) ? raw : (raw != null ? [raw] : []);
        for (const rv of rawValues) {
            const v = normalizedValue(rv);
            if (v && !seen.has(v)) { seen.add(v); result.push(v); }
        }
    }

    return result;
}

/** Write facet values into a query object using the indexed format (attribute[0], attribute[1], …).
 *  Removes any pre-existing plain or indexed keys for the same attribute first. */
function writeIndexedValues(query: Record<string, unknown>, attribute: string, values: string[]): void {
    // Remove plain key
    delete query[attribute];
    // Remove old indexed keys
    for (const key of Object.keys(query)) {
        if (key.startsWith(`${attribute}[`)) delete query[key];
    }
    // Write new indexed keys
    values.forEach((v, idx) => { query[`${attribute}[${idx}]`] = v; });
}

function toggleValues(current: string[], value: string): string[] {
    return current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
}

export function useSearchFacetToggle() {
    const route = useRoute();
    const router = useRouter();
    const runtime = useRuntimeConfig();
    const instantSearchInstance = inject<any>('$_ais_instantSearchInstance', null);
    const refinementCoordinator = inject(SEARCH_REFINEMENT_COORDINATOR_KEY, null);

    function numericQueryKey(attribute: string, operator: string): string {
        return `numericRefinement[${attribute}][${operator}]`;
    }

    function queryNumericValue(attribute: string, operator: string): string {
        return normalizedValue(route.query?.[numericQueryKey(attribute, operator)] as RouteQueryValue);
    }

    function isNumericRangeActive(attribute: string, value: unknown): boolean {
        const config = clickableFacetConfig[attribute];
        if (config?.type !== 'numericRange') return false;

        const range = numericRangeFromValue(value);
        if (!range) return false;

        const currentMin = queryNumericValue(config.attribute, config.minOperator);
        const currentMax = queryNumericValue(config.attribute, config.maxOperator);
        return currentMin === String(range.min) && currentMax === String(range.max);
    }

    function facetToggleLocation(attribute: string, value: unknown) {
        const normalized = normalizedValue(value);
        const searchPath = normalizeRoutePath(runtime.public?.SEARCH_URL || 'search');
        const currentPath = normalizeRoutePath(route.path);
        const nextQuery: Record<string, unknown> = { ...route.query };
        delete nextQuery.page;

        if (!attribute || !normalized) {
            return {
                path: currentPath === searchPath ? route.path : searchPath,
                query: nextQuery,
            };
        }

        const config = clickableFacetConfig[attribute];
        if (config?.type === 'numericRange') {
            const range = numericRangeFromValue(normalized);
            const minKey = numericQueryKey(config.attribute, config.minOperator);
            const maxKey = numericQueryKey(config.attribute, config.maxOperator);
            const active = isNumericRangeActive(attribute, normalized);

            delete nextQuery[minKey];
            delete nextQuery[maxKey];
            delete nextQuery[`range_${config.attribute}`];

            if (range && !active) {
                nextQuery[minKey] = String(range.min);
                nextQuery[maxKey] = String(range.max);
            }

            return {
                path: currentPath === searchPath ? route.path : searchPath,
                query: nextQuery,
            };
        }

        const indexName = String(runtime.public?.ELASTIC_INDEX || '');
        const currentIndexState = indexName
            ? { ...(instantSearchInstance?.uiState?.[indexName] || {}) }
            : {};
        const currentRefinementList = (currentIndexState as any).refinementList as Record<string, string[]> | undefined;

        // Prefer InstantSearch's in-memory state; fall back to indexed URL params
        const existingValues: string[] = currentRefinementList?.[attribute]
            ?? readIndexedValues(nextQuery as Record<string, unknown>, attribute);

        const nextValues = toggleValues(existingValues, normalized);
        writeIndexedValues(nextQuery, attribute, nextValues);

        return {
            path: currentPath === searchPath ? route.path : searchPath,
            query: nextQuery,
        };
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

        const indexName = String(runtime.public?.ELASTIC_INDEX || '');
        const currentIndexState = indexName
            ? { ...(instantSearchInstance?.uiState?.[indexName] || {}) }
            : {};
        const config = clickableFacetConfig[attribute];

        if (config?.type === 'numericRange') {
            const range = numericRangeFromValue(normalized);

            const updateInstantSearch = () => {
                if (!instantSearchInstance?.setUiState || !indexName || !range) return false;

                const currentNumericRefinements = { ...(currentIndexState as any).numericRefinements };
                const nextNumericRefinements = { ...currentNumericRefinements };
                const active = isNumericRangeActive(attribute, normalized);

                if (active) {
                    delete nextNumericRefinements[config.attribute];
                } else {
                    nextNumericRefinements[config.attribute] = {
                        [config.minOperator]: range.min,
                        [config.maxOperator]: range.max,
                    };
                }

                instantSearchInstance.setUiState({
                    ...(instantSearchInstance.uiState || {}),
                    [indexName]: {
                        ...currentIndexState,
                        page: 1,
                        numericRefinements: nextNumericRefinements,
                    },
                });
                return true;
            };

            const operation = () => {
                if (updateInstantSearch()) return;
                void router.push(facetToggleLocation(attribute, normalized));
            };

            if (refinementCoordinator) {
                refinementCoordinator.runRefinementAction('result-facet-toggle', operation);
            } else {
                operation();
            }
            return;
        }

        const currentRefinementList = { ...(currentIndexState as any).refinementList };
        const existingValues: string[] = currentRefinementList?.[attribute]
            ?? readIndexedValues(route.query as Record<string, unknown>, attribute);
        const nextValues = toggleValues(existingValues, normalized);

        const nextRefinementList = { ...currentRefinementList };
        if (nextValues.length) {
            nextRefinementList[attribute] = nextValues;
        } else {
            delete nextRefinementList[attribute];
        }

        const updateInstantSearch = () => {
            if (!instantSearchInstance?.setUiState || !indexName) return false;

            instantSearchInstance.setUiState({
                ...(instantSearchInstance.uiState || {}),
                [indexName]: {
                    ...currentIndexState,
                    page: 1,
                    refinementList: nextRefinementList,
                },
            });
            return true;
        };

        const operation = () => {
            if (updateInstantSearch()) return;
            void router.push(facetToggleLocation(attribute, normalized));
        };

        if (refinementCoordinator) {
            refinementCoordinator.runRefinementAction('result-facet-toggle', operation);
        } else {
            operation();
        }
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
        getNewSearchLocation,
    };
}
