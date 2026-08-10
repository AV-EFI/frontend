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
  $i18n: Composer;
  $t: Composer['t'];
  $rt: Composer['rt'];
  $n: Composer['n'];
  $d: Composer['d'];
  $tm: Composer['tm'];
  $te: Composer['te'];
}

type ToastMethod = (message: unknown, options?: Record<string, unknown>) => unknown;
type ToastLike = ToastMethod & {
  success?: ToastMethod;
  info?: ToastMethod;
  error?: ToastMethod;
  warn?: ToastMethod;
  loading?: ToastMethod;
  promise?: (...args: unknown[]) => unknown;
  remove?: (...args: unknown[]) => unknown;
  update?: (...args: unknown[]) => unknown;
  clearAllToasts?: () => unknown;
};

type AddToComparison = (filmId: string, filmTitle?: string, listType?: string) => void;
type ToggleComparisonDrawerState = (type: string) => void;
type ToggleFacetDrawerState = () => void;
type ApiFetchHookContext = {
  options: {
    headers?: Headers | Record<string, string>;
  };
  response: {
    status: number;
  };
};
type ApiFetchOptions = Record<string, unknown> & {
  onRequest?: (context: Pick<ApiFetchHookContext, 'options'>) => void;
  onResponse?: (context: Pick<ApiFetchHookContext, 'response'>) => void;
  onResponseError?: (context: Pick<ApiFetchHookContext, 'response'>) => void | Promise<unknown>;
};
type ApiFetch = {
  <T = unknown>(request: string, options?: ApiFetchOptions): Promise<T>;
  create(defaults: ApiFetchOptions): ApiFetch;
};

declare module '#app' {
  interface NuxtApp extends I18nGlobalProperties {
    $loadFormKit: () => Promise<void> | undefined;
    $loadInstantSearch: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
    $toast: ToastLike;
    $loadToast: () => Promise<ToastLike>;
    $addToComparison: AddToComparison;
    $toggleComparisonDrawerState: ToggleComparisonDrawerState;
    $toggleFacetDrawerState: ToggleFacetDrawerState;
    $apiFetch: ApiFetch;
    $apiFetchLocal: ApiFetch;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties extends I18nGlobalProperties {
    $loadFormKit: () => Promise<void> | undefined;
    $loadInstantSearch: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
    $toast: ToastLike;
    $loadToast: () => Promise<ToastLike>;
    $addToComparison: AddToComparison;
    $toggleComparisonDrawerState: ToggleComparisonDrawerState;
    $toggleFacetDrawerState: ToggleFacetDrawerState;
    $apiFetch: ApiFetch;
    $apiFetchLocal: ApiFetch;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends I18nGlobalProperties {
    $loadFormKit: () => Promise<void> | undefined;
    $loadInstantSearch: () => Promise<void> | undefined;
    $formKitState: Ref<FormKitLoaderState>;
    $toast: ToastLike;
    $loadToast: () => Promise<ToastLike>;
    $addToComparison: AddToComparison;
    $toggleComparisonDrawerState: ToggleComparisonDrawerState;
    $toggleFacetDrawerState: ToggleFacetDrawerState;
    $apiFetch: ApiFetch;
    $apiFetchLocal: ApiFetch;
  }
}

declare module 'nitropack/types' {
  interface NitroApp {
    logger: {
      error: (entry: unknown, message?: string) => void;
      warn: (entry: unknown, message?: string) => void;
      info?: (entry: unknown, message?: string) => void;
    };
  }
}

declare global {
  type Maybe<T> = T | null | undefined;
  var $fetch: ApiFetch;
}

export {};
