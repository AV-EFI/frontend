// plugins/myPiniaPlugin.ts
// plugins/myPiniaPlugin.ts
import type { PiniaPluginContext } from 'pinia';

function SearchPlugin({ store }: PiniaPluginContext) {

    const searchResultsStore = useSearchResultsStore();
    const searchParamsStore = useSearchParamsStore();

    store.$subscribe((mutation) => {
        // react to store changes
        if (mutation.storeId === 'searchParamsStore') {
            searchResultsStore.updateResults(searchParamsStore.$state.formData);
        }
    });

    // Note this has to be typed if you are using TS
    return { creationTime: new Date() };
}

export default defineNuxtPlugin(({ $pinia }: any) => {
    $pinia.use(SearchPlugin);
});