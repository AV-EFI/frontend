import { defineNuxtPlugin, useState } from '#app';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

// A Nuxt server process handles many concurrent requests on the same
// module instance, so a plain module-level `let` here would leak one
// request's install promise (and the `nuxtApp` closed over inside it)
// into another concurrent request. Keying the promise off the per-request
// `nuxtApp` instance keeps it scoped correctly for both SSR and client.
const installPromises = new WeakMap<object, Promise<void>>();

const stateKey = 'formkit-loader-state';

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

    let installPromise = installPromises.get(nuxtApp);
    if (!installPromise) {
      formKitState.value.loading = true;
      installPromise = (async () => {
        const [{ plugin, defaultConfig }, configModule] = await Promise.all([
          import('@formkit/vue'),
          import('~/formkit.config'),
        ]);

        const configExport = configModule.default ?? configModule;
        const resolvedConfig = typeof configExport === 'function' ? configExport() : configExport;
        nuxtApp.vueApp.use(plugin, defaultConfig(resolvedConfig));
        formKitState.value.ready = true;
      })()
        .catch((error) => {
          formKitState.value.error = error as Error;
          installPromises.delete(nuxtApp);
          throw error;
        })
        .finally(() => {
          formKitState.value.loading = false;
        });
      installPromises.set(nuxtApp, installPromise);
    }

    // eslint-disable-next-line consistent-return
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
