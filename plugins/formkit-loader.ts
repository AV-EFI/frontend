import { defineNuxtPlugin, useState } from '#app';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

const stateKey = 'formkit-loader-state';
let installPromise: Promise<void> | null = null;

export default defineNuxtPlugin(async (nuxtApp) => {
    const formKitState = useState<FormKitLoaderState>(stateKey, () => ({
        ready: false,
        loading: false,
        error: null,
    }));

    if (import.meta.client) {
        formKitState.value.ready = false;
        formKitState.value.loading = false;
        formKitState.value.error = null;
    }

    const loadFormKit = async () => {
        if (formKitState.value.ready) {
            return;
        }

        if (!installPromise) {
            formKitState.value.loading = true;
            installPromise = (async () => {
                const [{ plugin, defaultConfig }, configModule] = await Promise.all([
                    import('@formkit/vue'),
                    import('~/formkit.config'),
                ]);

                const resolvedConfig = configModule.default ?? configModule;
                nuxtApp.vueApp.use(plugin, defaultConfig(resolvedConfig));
                formKitState.value.ready = true;
            })()
                .catch((error) => {
                    formKitState.value.error = error as Error;
                    throw error;
                })
                .finally(() => {
                    formKitState.value.loading = false;
                });
        }

        return installPromise;
    };

    if (import.meta.server) {
        await loadFormKit();
    }

    return {
        provide: {
            loadFormKit,
            formKitState,
        },
    };
});
