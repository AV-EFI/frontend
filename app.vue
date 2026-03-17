<script setup lang="ts">
// All imports below are auto-imported by Nuxt
const { locale, t: $t } = useI18n();
const siteUrl = useSiteUrl();

const schemaWebSiteId = computed(() => `${siteUrl.value}/#website`);
const schemaIdentityId = computed(() => `${siteUrl.value}/#organization`);
const schemaId = (node: 'catalog' | 'dataset' | 'project' | 'logo') => `${siteUrl.value}/#${node}`;
const searchActionUrlTemplate = computed(() => `${siteUrl.value}/search?query={search_term_string}`);

useSchemaOrg([
    // --- Logo ---
    {
        '@id': schemaId('logo'),
        '@type': 'ImageObject',
        url: `${siteUrl.value}/img/avefi-og-image.png`,
        contentUrl: `${siteUrl.value}/img/avefi-og-image.png`,
    },

    // --- Organization (explicit, because defaults: false) ---
    {
        '@id': schemaIdentityId.value,
        '@type': 'Organization',
        name: 'AVefi',
        alternateName: ['AV efi', 'AV-efi', 'AVEFI', 'av efi'],
        url: siteUrl.value,
        logo: { '@id': schemaId('logo') },
        description:
            'AVefi enables the discovery of film works, manifestations, and items across multiple film archives with linked authority data, persistent identifiers, and structured metadata for research and archival practice.',
        foundingDate: '2023-11-01',
        sameAs: [
            'https://github.com/AV-EFI',
            'https://www.zotero.org/groups/5125890/avefi',
        ],
        member: [
            {
                '@type': 'Organization',
                name: 'TIB – Leibniz Information Centre for Science and Technology',
                url: 'https://www.tib.eu',
            },
            {
                '@type': 'Organization',
                name: 'Stiftung Deutsche Kinemathek – Museum für Film und Fernsehen',
                alternateName: 'Deutsche Kinemathek',
                url: 'https://www.deutsche-kinemathek.de/',
            },
            {
                '@type': 'Organization',
                name: 'Filmmuseum Düsseldorf',
                url: 'https://www.duesseldorf.de/filmmuseum',
            },
            {
                '@type': 'Organization',
                name: 'Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen',
                alternateName: 'GWDG',
                url: 'https://www.gwdg.de',
            },
        ],
    },

    // --- WebSite (global) ---
    defineWebSite({
        '@id': schemaWebSiteId.value,
        url: siteUrl.value,
        name: 'AVefi',
        alternateName: ['AV efi', 'AV-efi', 'AVEFI', 'av efi'],
        inLanguage: ['de-DE', 'en-US'],
        image: { '@id': schemaId('logo') },
        publisher: { '@id': schemaIdentityId.value },

        potentialAction: {
            '@type': 'SearchAction',
            target: [
                {
                    '@type': 'EntryPoint',
                    urlTemplate: searchActionUrlTemplate.value,
                },
            ],
            'query-input': 'required name=search_term_string',
        },

        provider: {
            '@type': 'Organization',
            name: 'Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen',
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

    // --- DataCatalog (global) ---
    {
        '@id': schemaId('catalog'),
        '@type': 'DataCatalog',
        name: 'AVefi – Film Metadata Catalog',
        url: siteUrl.value,
        inLanguage: ['de-DE', 'en-US'],
        publisher: { '@id': schemaIdentityId.value },
        dataset: { '@id': schemaId('dataset') },
    },

    // --- Dataset (global) ---
    {
        '@id': schemaId('dataset'),
        '@type': 'Dataset',
        name: $t('home.seo.datasetTitle'),
        description: $t('home.seo.datasetDescription'),
        url: siteUrl.value,
        inLanguage: ['de-DE', 'en-US'],
        isAccessibleForFree: true,
        includedInDataCatalog: { '@id': schemaId('catalog') },
        publisher: { '@id': schemaIdentityId.value },
        sameAs: [
            'https://github.com/AV-EFI',
            'https://www.zotero.org/groups/5125890/avefi',
        ],
        keywords: [
            'film metadata',
            'audiovisual archives',
            'persistent identifiers',
            'linked open data',
            'authority data',
            'film research',
            'FAIR data',
        ],
    },

    // --- ResearchProject (global) ---
    {
        '@id': schemaId('project'),
        '@type': 'ResearchProject',
        name: $t('home.seo.projectTitle'),
        alternateName: 'AVefi',
        description: $t('home.seo.projectDescription'),
        url: siteUrl.value,
        inLanguage: ['de-DE', 'en-US'],
        publisher: { '@id': schemaIdentityId.value },
        hasPart: [
            { '@id': schemaId('catalog') },
            { '@id': schemaId('dataset') },
        ],
        funding: {
            '@type': 'Grant',
            name: $t('home.seo.projectFundingTitle'),
            funder: {
                '@type': 'Organization',
                name: 'Deutsche Forschungsgemeinschaft',
                url: 'https://www.dfg.de',
            },
        },
    },
]);

useSeoMeta({
    titleTemplate: '%s | AVefi',
    ogSiteName: `AVefi - ${$t('avefiClaim')}`,
    ogUrl: siteUrl.value,
    twitterCard: 'summary_large_image',
    publisher: schemaIdentityId.value,
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
        'FAIR Data',
    ].join(', '),
});

useHead({
    link: [
        { rel: 'canonical', href: siteUrl.value },
        { rel: 'preload', href: '/fonts/Inter.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/BreeSerif-Regular.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
    ],
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