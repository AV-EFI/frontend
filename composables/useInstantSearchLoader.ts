export const useInstantSearchLoader = () => {
    const isInstantSearchReady = useState<boolean>('instant-search-ready', () => false);
    const instantSearchError = useState<Error | null>('instant-search-error', () => null);
    const nuxtApp = useNuxtApp();

    const ensureInstantSearchReady = async () => {
        if (import.meta.server || isInstantSearchReady.value) {
            return;
        }

        try {
            await nuxtApp.$loadInstantSearch?.();
            isInstantSearchReady.value = true;
        }
        catch (error) {
            instantSearchError.value = error as Error;
            console.error('Failed to initialize InstantSearch', error);
            throw error;
        }
    };

    return {
        isInstantSearchReady,
        instantSearchError,
        ensureInstantSearchReady,
    };
};