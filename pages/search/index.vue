<template>
    <div class="container mx-auto p-2">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                ['Home', '/'],
                [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`],
            ]"
        />

        <keep-alive>
            <SearchSection
                v-if="searchClient"
                :search-client="searchClient"
            />
            <div v-else class="text-center py-4">
                <span class="loading loading-spinner loading-lg text-primary" />
            </div>
        </keep-alive>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Client from '@searchkit/instantsearch-client';
import { config as searchkitConfig } from '~/searchConfig_avefi';
import { useCurrentUrlState } from '~/composables/useCurrentUrlState';

definePageMeta({ auth: false });

const runtime = useRuntimeConfig();
const route = useRoute();
const { t } = useI18n();
const { currentUrlState } = useCurrentUrlState();

/**
 * Search client (client-only) — keep SSR stable but avoid running client instantiation on server.
 */
const searchClient = process.client
    ? Client({
        config: searchkitConfig as any,
        url: `${runtime.public.AVEFI_ELASTIC_API}/${runtime.public.AVEFI_SEARCH}`,
    })
    : null;

/**
 * ---- Canonical / Indexing rules for /search ----
 *
 * Goal:
 * - Prevent Google from clustering/merging parameter pages incorrectly.
 * - Allow indexing only for “clean” URLs based on whitelisted params.
 * - Keep canonical stable (order + encoding) so duplicates collapse correctly.
 */

// Base site url (prefer nuxt site config if available via runtime, fallback to prod)
const siteUrl = computed(() => {
    return (runtime.public.siteUrl || runtime.public.origin || process.env.SITE_URL || 'https://www.av-efi.net').replace(/\/$/, '');
});

const baseSearchUrl = computed(() => `${siteUrl.value}/search`);

// Build whitelist of allowed query params from Searchkit facets + "query"
const allowedParams = computed(() => {
    const set = new Set<string>();
    set.add('query');

    const facets = (searchkitConfig as any)?.search_settings?.facet_attributes ?? [];
    for (const f of facets) {
        if (f?.attribute && typeof f.attribute === 'string') set.add(f.attribute);
    }

    // Optional: allow these if you later add them (kept safe)
    // set.add('page'); set.add('sort');

    return set;
});

// Helper: normalize query object into stable URLSearchParams (sorted keys, sorted values)
function normalizeQueryToParams(q: Record<string, unknown>, allow: Set<string>) {
    const params = new URLSearchParams();

    // Only keep allowed keys; ignore Nuxt internal keys; normalize arrays and scalar
    const keys = Object.keys(q)
        .filter((k) => allow.has(k))
        .sort((a, b) => a.localeCompare(b));

    for (const key of keys) {
        const raw = q[key];

        // Skip empty-ish values
        if (raw === undefined || raw === null) continue;
        if (typeof raw === 'string' && raw.trim() === '') continue;

        // Nuxt route.query can be: string | string[]
        const values = Array.isArray(raw) ? raw : [raw];

        const normalizedValues = values
            .flatMap((v) => (v === null || v === undefined ? [] : [String(v)]))
            .map((v) => v.trim())
            .filter((v) => v.length > 0)
            .sort((a, b) => a.localeCompare(b));

        for (const v of normalizedValues) {
            params.append(key, v);
        }
    }

    return params;
}

const hasOnlyAllowedParams = computed(() => {
    const q = route.query as Record<string, unknown>;
    const allow = allowedParams.value;

    for (const key of Object.keys(q)) {
        if (!allow.has(key)) return false;
    }
    return true;
});

const normalizedParams = computed(() =>
    normalizeQueryToParams(route.query as Record<string, unknown>, allowedParams.value)
);

const hasIndexableParams = computed(() => {
    if (!hasOnlyAllowedParams.value) return false;

    // If there are no params at all => indexable base search page
    if (normalizedParams.value.toString().length === 0) return true;

    // If there ARE params, still indexable (because they’re whitelisted)
    return true;
});

const canonicalUrl = computed(() => {
    if (!hasOnlyAllowedParams.value) return baseSearchUrl.value;

    const qs = normalizedParams.value.toString();
    return qs ? `${baseSearchUrl.value}?${qs}` : baseSearchUrl.value;
});

const robotsDirective = computed(() => {
    return hasIndexableParams.value ? 'index,follow' : 'noindex,follow';
});

/**
 * ---- SEO Meta ----
 */
const searchQuery = computed(() => {
    const raw = (route.query?.query ?? null) as string | string[] | null;
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ? String(raw) : null;
});

const title = computed(() =>
    searchQuery.value
        ? t('seo.search.titleWithQuery', { query: searchQuery.value })
        : t('seo.search.title')
);

const description = computed(() =>
    searchQuery.value
        ? t('seo.search.descriptionWithQuery', { query: searchQuery.value })
        : t('seo.search.description')
);

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl.value,
});

// Canonical + robots + og:url consistency
useHead({
    link: [
        { rel: 'canonical', href: canonicalUrl.value },
    ],
    meta: [
        { name: 'robots', content: robotsDirective.value },
        { property: 'og:url', content: canonicalUrl.value },
    ],
});

/**
 * ---- Schema.org (recommended) ----
 * Patch: add WebSite SearchAction (potentialAction) so Google understands your site search.
 */
import { useSchemaOrg, defineWebSite, defineWebPage, defineBreadcrumb } from '#imports';

useSchemaOrg(() => [
    defineWebSite({
        '@id': `${siteUrl.value}#website`, // ✅ no "/#"
        url: siteUrl.value,
        name: 'AVefi',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseSearchUrl.value}?query={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }),

    defineWebPage({
        '@type': ['WebPage', 'SearchResultsPage'],
        '@id': `${canonicalUrl.value}#webpage`,
        url: canonicalUrl.value,
        name: title.value,
        description: description.value,
        inLanguage: 'de-DE',
        isPartOf: { '@id': `${siteUrl.value}#website` }, // ✅ no "/#"
    }),

    defineBreadcrumb({
        '@id': `${canonicalUrl.value}#breadcrumb`,
        itemListElement: [
            { name: t('home.breadcrumbs'), item: `${siteUrl.value}/`, position: 1 },
            { name: t('filmresearch'), item: baseSearchUrl.value, position: 2 },
        ],
    }),
]);

</script>

<style>
.ais-SearchBox-form,
.ais-SearchBox-input,
.ais-SortBy-select {
  background-color: transparent !important;
}

.ais-SearchBox-input:focus {
  border-color: var(--primary);
}

.ais-Pagination-item--selected {
  background-color: var(--primary);
  color: white;
}
</style>