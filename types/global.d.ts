import type { Ref } from 'vue';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

declare module '#app' {
  interface NuxtApp {
    $loadFormKit: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $loadFormKit: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
  }
}

declare global {
  type Maybe<T> = T | null | undefined;
}

export {};