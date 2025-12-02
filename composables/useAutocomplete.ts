import { ref } from 'vue';
import { config as skConfig } from '~/searchConfig_avefi';

type Suggestion = { text: string; type: string }

export function useAutocomplete() {
    const mainSuggestions = ref<Suggestion[]>([]);
    const facetSuggestions = ref<Record<string, string[]>>({});
    const showMain = ref(false);

    const searchAttrs: Array<{ field: string; weight?: number }> =
    skConfig?.search_settings?.search_attributes || [];
    const facetAttrs: Array<{ attribute: string; field: string }> =
    (skConfig?.search_settings?.facet_attributes || []).map((f: any) => ({ attribute: f.attribute, field: f.field }));

    /** MAIN (query) suggestions across search_attributes */
    async function suggestMain(query: string) {
        try {
            const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>(
                '/api/elastic/suggestions',
                { method: 'POST', body: { mode: 'query', query, size: 10 } }
            );
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
            const res = await $fetch<{ success: boolean; suggestions: { text: string; type: string }[] }>(
                '/api/elastic/suggestions',
                { method: 'POST', body: { mode: 'facet', facetAttr: attr, field, query, size } }
            );
            const arr = (res?.success && res?.suggestions) ? res.suggestions.map(s => s.text) : [];
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
