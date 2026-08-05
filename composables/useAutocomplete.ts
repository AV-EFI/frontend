import { ref } from 'vue';
import type { FacetAttribute } from 'searchkit';
import { config as skConfig } from '~/searchConfig_avefi';

type Suggestion = { text: string; type: string }

export function useAutocomplete() {
  const mainSuggestions = ref<Suggestion[]>([]);
  const facetSuggestions = ref<Record<string, string[]>>({});
  const showMain = ref(false);

  const facetAttrs: Array<{ attribute: string; field: string }> =
    (skConfig?.search_settings?.facet_attributes || [])
      .filter((f): f is Exclude<FacetAttribute, string> => typeof f === 'object')
      .map((f) => ({ attribute: f.attribute, field: f.field }));

  /** MAIN (query) suggestions across search_attributes */
  async function suggestMain(query: string) {
    try {
      const res = await $fetch(
        '/api/elastic/suggestions',
        { method: 'POST', body: { mode: 'query', query, size: 10 } }
      ) as { success: boolean; suggestions: Suggestion[] };
      mainSuggestions.value = (res?.success && res?.suggestions) ? res.suggestions : [];
    } catch {
      mainSuggestions.value = [];
    }
    showMain.value = true;
  }

  /** FACET suggestions for a given attribute key */
  async function suggestFacet(attr: string, query: string, size = 10) {
    const found = facetAttrs.find(f => f.attribute === attr);
    const field = found?.field || `${attr}.keyword`;
    try {
      const res = await $fetch(
        '/api/elastic/suggestions',
        { method: 'POST', body: { mode: 'facet', facetAttr: attr, field, query, size } }
      ) as { success: boolean; suggestions: Suggestion[] };
      const arr = (res?.success && res?.suggestions) ? res.suggestions.map((s: Suggestion) => s.text) : [];
      facetSuggestions.value[attr] = arr;
    } catch {
      facetSuggestions.value[attr] = [];
    }
  }

  return {
    // state
    mainSuggestions,
    facetSuggestions,
    showMain,
    // api
    suggestMain,
    suggestFacet
  };
}
