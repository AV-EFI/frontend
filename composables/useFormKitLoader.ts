import { useNuxtApp, useState } from '#app';
import { computed } from 'vue';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

const stateKey = 'formkit-loader-state';

export const useFormKitLoader = () => {
    const nuxtApp = useNuxtApp();
    const state = useState<FormKitLoaderState>(stateKey, () => ({
        ready: false,
        loading: false,
        error: null,
    }));

    const ensureFormKitReady = async () => {
        await nuxtApp.$loadFormKit?.();
    };

    return {
        ensureFormKitReady,
        isFormKitReady: computed(() => state.value.ready),
        isFormKitLoading: computed(() => state.value.loading),
        formKitError: computed(() => state.value.error),
    };
};
