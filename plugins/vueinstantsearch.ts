let installPromise: Promise<void> | null = null;
let isInstalled = false;

export default defineNuxtPlugin((nuxtApp) => {
    const loadInstantSearch = async () => {
        if (import.meta.server) {
            return;
        }

        if (isInstalled) {
            return;
        }

        if (!installPromise) {
            installPromise = import('vue-instantsearch/vue3/es')
                .then(({default: InstantSearch}) => {
                    nuxtApp.vueApp.use(InstantSearch);
                    isInstalled = true;
                })
                .catch((error) => {
                    installPromise = null;
                    throw error;
                });
        }

        return installPromise;
    };

    return {
        provide: {
            loadInstantSearch,
        },
    };
});
