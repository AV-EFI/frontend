<script setup lang="ts">
// All imports below are auto-imported by Nuxt
const { locale, t: $t } = useI18n();

useSchemaOrg([
    defineWebSite({
        url: process.env.SITE_URL || 'https://www.av-efi.net',
        name: 'AVefi',
        publisher: {
            '@id': `${process.env.SITE_URL || 'https://www.av-efi.net'}#identity`,
        },
        // ✅ Replace serviceOperator with provider (schema-valid relation)            
        provider: {
            '@type': 'Organization',
            name: 'Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen (GWDG)',
            alternateName: 'GWDG',
            url: 'https://www.gwdg.de',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Burckhardtweg 4',
                addressLocality: 'Göttingen',
                postalCode: '37077',
                addressCountry: 'DE',
            },
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                telephone: '+49 551 39-30001',
                email: 'support@gwdg.de',
            },
        },
    }),
]);

useSeoMeta({
    titleTemplate: '%s | AVefi',
    ogSiteName: `AVefi - ${$t('avefiClaim')}`,
    ogUrl: process.env.SITE_URL || 'https://www.av-efi.net',
    twitterCard: 'summary_large_image',
    publisher: `${process.env.SITE_URL || 'https://www.av-efi.net'}#identity`,
    keywords: [
        'AVefi',
        'Filmdatenbank',
        'Filmrecherche',
        'Filmdaten',
        'Filmdaten Recherche',
        'Filmmetadaten',
        'Filmwerke Datenbank',
        'Filmarchive',
        'Filmarchive Deutschland',
        'Filmarchiv Recherche',
        'Filmarchiv Datenbank',
        'Filmarchiv Bestände',
        'audiovisuelle Archive',
        'audiovisuelle Sammlungen',
        'audiovisuelle Bestände',
        'audiovisuelle Metadaten',
        'audiovisuelle Forschungsdaten',
        'audiovisuelle Forschungsinfrastruktur',
        'Forschungsdaten Film',
        'Filmwissenschaft',
        'Filmforschung',
        'Medienwissenschaft',
        'Digital Humanities',
        'Filmdatenmodell',
        'Werk Manifestation Exemplar',
        'Normdaten',
        'GND Film',
        'VIAF Film',
        'EIDR Film',
        'Persistent Identifier',
        'PID',
        'Linked Open Data',
        'Linked Open Data Film',
        'FAIR Data'
    ].join(', ')
});

// Optimize critical resource loading - preload fonts to prevent FOUT
useHead({
    link: [
        // Preload critical fonts (Inter is used for body text)
        { rel: 'canonical', href: process.env.SITE_URL || 'https://www.av-efi.net' },
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