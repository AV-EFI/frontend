import { inject } from 'vue';
import { SEARCH_REFINEMENT_COORDINATOR_KEY } from '~/composables/searchRefinementCoordinator';
import { clickableFacetConfig } from '~/config/clickableFacetConfig';

type RouteQueryValue = string | string[] | null | undefined;
type NumericRange = { min: number; max: number };

function normalizedValue(value: unknown): string {
    return String(value ?? '').trim();
}

function queryValues(value: RouteQueryValue): string[] {
    const rawValues = Array.isArray(value) ? value : [value];
    const seen = new Set<string>();
    const values: string[] = [];

    for (const raw of rawValues) {
        const normalized = normalizedValue(raw);
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        values.push(normalized);
    }

    return values;
}

function toggleQueryValue(current: RouteQueryValue, value: string): string[] {
    const values = queryValues(current);
    const exists = values.includes(value);
    return exists ? values.filter(item => item !== value) : [...values, value];
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
        const currentRefinementList = { ...(currentIndexState as any).refinementList };
        const nextValues = toggleQueryValue(
            (currentRefinementList?.[attribute] as RouteQueryValue) ?? (route.query?.[attribute] as RouteQueryValue),
            normalized
        );

        if (nextValues.length) {
            nextQuery[attribute] = nextValues;
        } else {
            delete nextQuery[attribute];
        }

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
        return queryValues(route.query?.[attribute] as RouteQueryValue).includes(normalized);
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
        const nextValues = toggleQueryValue(
            (currentRefinementList?.[attribute] as RouteQueryValue) ?? (route.query?.[attribute] as RouteQueryValue),
            normalized
        );

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

        const updateRoute = async () => {
            await router.push(facetToggleLocation(attribute, normalized));
        };

        const operation = () => {
            if (updateInstantSearch()) return;
            void updateRoute();
        };

        if (refinementCoordinator) {
            refinementCoordinator.runRefinementAction('result-facet-toggle', operation);
        } else {
            operation();
        }
    }

    return {
        getFacetToggleHref,
        isFacetValueActive,
        toggleFacetValue,
    };
}
