import { useNuxtApp, useState } from '#app';
import { computed } from 'vue';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

const stateKey = 'formkit-loader-state';
let fallbackInstallPromise: Promise<void> | null = null;
let ensureReadyPromise: Promise<void> | null = null;

const fallbackInstallFormKit = async (nuxtApp: ReturnType<typeof useNuxtApp>) => {
  if (!fallbackInstallPromise) {
    fallbackInstallPromise = (async () => {
      const [{ plugin, defaultConfig }, configModule] = await Promise.all([
        import('@formkit/vue'),
        import('~/formkit.config'),
      ]);

      const resolvedConfig = configModule.default ?? configModule;
      nuxtApp.vueApp.use(plugin, defaultConfig(resolvedConfig));
    })().catch((error) => {
      fallbackInstallPromise = null;
      throw error;
    });
  }

  return fallbackInstallPromise;
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

    if (ensureReadyPromise) {
      await ensureReadyPromise;
      return;
    }

    ensureReadyPromise = (async () => {
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
        ensureReadyPromise = null;
      }
    })();

    await ensureReadyPromise;
  };

  return {
    ensureFormKitReady,
    isFormKitReady: computed(() => state.value.ready),
    isFormKitLoading: computed(() => state.value.loading),
    formKitError: computed(() => state.value.error),
  };
};
