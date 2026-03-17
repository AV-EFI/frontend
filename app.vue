<script setup lang="ts">
// All imports below are auto-imported by Nuxt
const { locale, t: $t } = useI18n();

// Optimize critical resource loading - preload fonts to prevent FOUT
useHead({
    link: [
        // Preload critical fonts (Inter is used for body text)
        { rel: 'preload', href: '/fonts/Inter.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/BreeSerif-Regular.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
    ],
    // Use media="print" trick to load non-critical CSS without blocking
    style: [],
});

const auth = useAuth();

onBeforeUnmount(() => {
    auth.stopSessionPolling();
});

const {
    cookiesEnabledIds
} = useCookieControl();

const showCookieControl = ref(false);

const scheduleCookieControlMount = () => {
    if (!import.meta.client) return;
    const idle = (window as typeof window & {
        requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    }).requestIdleCallback;

    if (typeof idle === 'function') {
        idle(() => {
            showCookieControl.value = true;
        }, { timeout: 1200 });
    } else {
        window.setTimeout(() => {
            showCookieControl.value = true;
        }, 400);
    }
};

// example: react to a cookie being accepted
watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        if (
            !previous?.includes('google-analytics') &&
            current?.includes('google-analytics')
        ) {
            // cookie with id `google-analytics` got added
            // Only reload on client side
            if (import.meta.client) {
                window.location.reload();
            }
        }
    },
    { deep: true },
);

onMounted(() => {
    auth.startSessionPolling();
    scheduleCookieControlMount();
});

const colorModeCookie = useCookie<'avefi_light' | 'avefi_dark' | 'dark'>('avefi-color-mode', {
    default: () => 'avefi_light',
});

const normalizedTheme = computed(() =>
    colorModeCookie.value === 'avefi_dark' || colorModeCookie.value === 'dark'
        ? 'avefi_dark'
        : 'avefi_light'
);

useHead(() => ({
    htmlAttrs: {
        'data-theme': normalizedTheme.value,
        class: normalizedTheme.value === 'avefi_dark' ? 'dark' : '',
    },
    meta: [
        { name: 'robots', content: 'noindex, nofollow, noarchive' },
        { name: 'googlebot', content: 'noindex, nofollow, noarchive' },
    ],
}));

</script>

<template>
    <div id="app" v-cloak class="">
        <GlobalLoadingScreen />
        <NuxtLoadingIndicator />
        <NuxtLayout class="layouts">
            <div
                class="mt-2 max-lg:w-screen grow mx-auto dark:text-white dark:border-gray-700 xl:border-base-200 xl:border-l-2 xl:border-r-2 px-0 lg:px-2 xl:px-4">
                <NuxtPage />
            </div>
            <ClientOnly>
                <Suspense>
                    <template #default>
                        <LazyCookieControl v-if="showCookieControl" :locale="locale">
                            <template #bar>
                                <h2>Cookies 🍪</h2>
                                <p>{{ $t('cookiesDescription') }}</p>
                                <GlobalLanguageSwitch />
                                <NuxtLink to="https://datenschutz.gwdg.de/services/av-efi" target="_blank" class="dark:text-white link">
                                    {{ $t('dataprotection') }}
                                </NuxtLink>
                                |
                                <NuxtLink to="/imprint" class="dark:text-white link">
                                    {{ $t('imprint') }}
                                </NuxtLink>
                            </template>
                            <template #modal>
                                <h3>{{ $t('dataprotection') }}</h3>
                                <p>{{ $t('cookiesModalDescription') }}</p>
                            </template>

                            <template #cookie="{ cookie }">
                                <h3 v-text="cookie.name[locale]" />
                                <span v-html="cookie.description[locale]" />

                                <div v-if="cookie.targetCookieIds">
                                    <b>Cookie ids: </b>
                                    <span v-text="cookie?.targetCookieIds?.join(', ')" />
                                </div>
                            </template>
                        </LazyCookieControl>
                    </template>
                    <template #fallback>
                        <div class="sr-only" role="status" aria-live="polite">
                            {{ $t('loadingCookies') || 'Loading cookie preferences…' }}
                        </div>
                    </template>
                </Suspense>
                <GlobalAuthProvider />
            </ClientOnly>
        </NuxtLayout>
    </div>
</template>

<style>
[v-cloak] {
  display: none !important;
}
</style>
