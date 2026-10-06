import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useRoute } from 'vue-router';

/**
 * True when a filter is applied to the facet. The state lives in the URL
 * (`subjects[0]=...`, `numericRefinement[production_in_year][>=]=...`). ais-panel's
 * `hasRefinements` only says that the facet offers values, so it cannot mark active facets.
 */
export function useIsFacetRefined(attributeName: MaybeRefOrGetter<string>) {
  const route = useRoute();

  return computed(() => {
    const attribute = toValue(attributeName);
    if (!attribute) return false;

    return Object.entries(route.query).some(([key, value]) => {
      const targetsFacet = key === attribute
                || key.startsWith(`${attribute}[`)
                || key.includes(`[${attribute}]`);
      const hasValue = Array.isArray(value) ? value.length > 0 : value !== null && value !== '';
      return targetsFacet && hasValue;
    });
  });
}
