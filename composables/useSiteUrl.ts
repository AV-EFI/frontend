export function useSiteUrl() {
    const runtime = useRuntimeConfig();

    return computed(() => {
        const origin =
            (runtime.public.siteUrl as string | undefined) ||
            (runtime.public.origin as string | undefined) ||
            'https://www.av-efi.net';

        return origin.replace(/\/$/, '');
    });
}