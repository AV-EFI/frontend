import type { Ref } from 'vue';
import type { Composer } from 'vue-i18n';

interface FormKitLoaderState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

// @nuxtjs/i18n only declares these as `declare global { var $t }`, which template
// type-checking doesn't pick up. Nuxt's template context is driven off NuxtApp's
// $-prefixed properties, not ComponentCustomProperties alone, so both are needed.
interface I18nGlobalProperties {
  $t: Composer['t'];
  $rt: Composer['rt'];
  $n: Composer['n'];
  $d: Composer['d'];
  $tm: Composer['tm'];
  $te: Composer['te'];
}

declare module '#app' {
  interface NuxtApp extends I18nGlobalProperties {
    $loadFormKit: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties extends I18nGlobalProperties {
    $loadFormKit: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
  }
}

declare global {
  type Maybe<T> = T | null | undefined;
}

export {};