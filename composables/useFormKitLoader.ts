import { useNuxtApp, useState } from '#app';
import { computed } from 'vue';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

const stateKey = 'formkit-loader-state';

// Scoped per-nuxtApp (see plugins/formkit-loader.ts for why a module-level
// `let` is unsafe here: it would leak across concurrent SSR requests).
const fallbackInstallPromises = new WeakMap<object, Promise<void>>();
const ensureReadyPromises = new WeakMap<object, Promise<void>>();

const fallbackInstallFormKit = async (nuxtApp: ReturnType<typeof useNuxtApp>) => {
  let promise = fallbackInstallPromises.get(nuxtApp);
  if (!promise) {
    promise = (async () => {
      const [{ plugin, defaultConfig }, configModule] = await Promise.all([
        import('@formkit/vue'),
        import('~/formkit.config'),
      ]);

      const configExport = configModule.default ?? configModule;
      const resolvedConfig = typeof configExport === 'function' ? configExport() : configExport;
      nuxtApp.vueApp.use(plugin, defaultConfig(resolvedConfig));
    })().catch((error) => {
      fallbackInstallPromises.delete(nuxtApp);
      throw error;
    });
    fallbackInstallPromises.set(nuxtApp, promise);
  }

  return promise;
};

export const useFormKitLoader = () => {
  const nuxtApp = useNuxtApp();
  const state = useState<FormKitLoaderState>(stateKey, () => ({
    ready: false,
    loading: false,
    error: null,
  }));

  const ensureFormKitReady = async () => {
    if (state.value.ready) {
      return;
    }

    const existing = ensureReadyPromises.get(nuxtApp);
    if (existing) {
      await existing;
      return;
    }

    const promise = (async () => {
      state.value.loading = true;
      state.value.error = null;

      try {
        if (nuxtApp.$loadFormKit) {
          await nuxtApp.$loadFormKit();
        } else {
          await fallbackInstallFormKit(nuxtApp);
        }

        state.value.ready = true;
      } catch (error) {
        state.value.error = error as Error;
        throw error;
      } finally {
        state.value.loading = false;
        ensureReadyPromises.delete(nuxtApp);
      }
    })();
    ensureReadyPromises.set(nuxtApp, promise);

    await promise;
  };

  return {
    ensureFormKitReady,
    isFormKitReady: computed(() => state.value.ready),
    isFormKitLoading: computed(() => state.value.loading),
    formKitError: computed(() => state.value.error),
  };
};
