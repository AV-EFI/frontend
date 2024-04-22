import type { UseFetchOptions } from 'nuxt/app';

export function useApiFetch<T>(
    url: string | (() => string),
    options: UseFetchOptions<T> = {},
    source?: string
) {
    return useFetch(
        url,
        {
            ...options,
            $fetch: useNuxtApp().$apiFetch,
        }
    );
}

export function useApiFetchLocal<T>(
    url: string | (() => string),
    options: UseFetchOptions<T> = {},
    source?: string
) {
    return useFetch(
        url,
        {
            ...options,
            $fetch: useNuxtApp().$apiFetchLocal,
        }
    );
}