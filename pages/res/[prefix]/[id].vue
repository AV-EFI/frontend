<template>
    <div>
        <NuxtLayout name="partial-layout-1-center" padding-class="p-0">
            <template #navigation>
                <GlobalBreadcrumbsComp :breadcrumbs="breadcrumbs" />
            </template>

            <template #title>
                <NuxtLayout name="partial-grid-2-1" left-class="dark:bg-primary-600 rounded-t-xl py-4">
                    <template #left>
                        <div class="col-span-full px-4">
                            <GlobalClipboardComp
                                :display-text="dataJson?.compound_record?._source?.handle"
                                :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${dataJson?.compound_record?._source?.handle}`"
                                class="mb-2 text-xs lg:text-sm text-base-content/90"
                            />
                            <div class="flex flex-row">
                                <h1
                                    class="text-lg font-bold xl:text-2xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
                                    :alt="dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name"
                                >
                                    {{ dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name }}
                                </h1>
                                <MicroBadgeCategoryComp
                                    :category="dataJson?.compound_record?._source?.has_record?.category"
                                    :dense="false"
                                    class="ml-4 my-auto"
                                />
                            </div>
                        </div>
                    </template>

                    <template #right>
                        <GlobalActionContextComp
                            class="col-start-11 row-start-1 justify-self-end"
                            :id="dataJson?.compound_record?._source?.handle"
                            :item="dataJson?.compound_record?._source"
                            comp-size="xl"
                        />
                    </template>
                </NuxtLayout>
            </template>

            <template #actions>
                <MicroBadgeCategoryComp
                    class="col-span-3 mt-2 divider-primary"
                    :class="!dataJson?.compound_record?._source?.has_record?.type ? 'hidden' : ''"
                    :category="dataJson?.compound_record?._source?.has_record?.type"
                />
            </template>

            <template #cardBody>
                <div class="px-4 pb-4">
                    <div v-if="pending" class="text-center py-4">
                        <span class="loading loading-spinner loading-lg text-primary" />
                    </div>

                    <div v-else-if="error" class="text-center text-red-500 py-8">
                        {{ $t('errorLoadingData') }}: {{ error }}
                    </div>

                    <div v-else>
                        <ViewsWorkViewCompAVefi
                            v-if="dataJson && (resourceType === 'workVariant' || resourceType === 'compilation' || resourceType === 'manifestationOrItem')"
                            v-model="dataJson"
                            :handle="dataJson.handle"
                        />
                        <ViewsCompilationViewCompAVefi
                            v-else-if="dataJson && resourceType === 'compilationManifestation'"
                            v-model="dataJson"
                            :handle="dataJson.handle"
                        />
                        <div v-else-if="dataJson && resourceType !== 'workVariant'" class="text-center text-gray-500">
                            {{ $t('resourceTypeNotSupported') }}: {{ resourceType }}
                        </div>
                        <div v-else class="text-center text-gray-500">
                            {{ $t('noDataAvailable') }}
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>

        <div class="collapse">
            <input type="checkbox" />
            <div class="collapse-title font-medium">Raw data</div>
            <div class="collapse-content">
                <pre>{{ dataJson }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentUrlState } from '~/composables/useCurrentUrlState.js';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAsyncData, useRuntimeConfig } from 'nuxt/app';

definePageMeta({ auth: false });

const route = useRoute();
const { currentUrlState } = useCurrentUrlState();
const config = useRuntimeConfig();
const { t } = useI18n();

const prefix = computed(() => String(route.params.prefix ?? ''));
const id = computed(() => String(route.params.id ?? ''));

/** ---------------------------
 * Fetch resource
 * -------------------------- */
const { data: result, error, pending } = await useAsyncData(
    () => `resource-${prefix.value}-${id.value}`,
    async () => {
        let fullId = id.value;

        // Append prefix only when no dot present (as in your existing logic)
        if (prefix.value && !fullId.includes('.')) {
            fullId = `${prefix.value}/${fullId}`;
        }

        const url = `${config.public.PUBLIC_AVEFI_ELASTIC_API}/${config.public.AVEFI_GET_WORK}/${fullId}`;
        const resourceData = await $fetch(url);

        // Determine resource type (your existing logic)
        let resourceType = 'workVariant';
        if (resourceData?.compound_record?.resource_type) {
            resourceType = resourceData.compound_record.resource_type;
        } else if (resourceData?.handle !== resourceData?.compound_record?._source?.handle) {
            if (
                resourceData?.compound_record?._source?.manifestations?.length > 0 ||
                resourceData?.compound_record?._source?.items?.length > 0
            ) {
                resourceType = 'manifestationOrItem';
            }
        } else {
            if (resourceData?.compound_record?._source?.parts && resourceData?.compound_record?._source?.has_record?.type === 'Serial') {
                resourceType = 'compilation';
            } else if (resourceData?.compound_record?._source?.has_record?.is_manifestation_of?.length > 1) {
                resourceType = 'compilationManifestation';
            }
        }

        return {
            data: resourceData,
            resourceType,
            requestedHandle: fullId,
        };
    }
);

/** ---------------------------
 * Computed accessors
 * -------------------------- */
const dataJson = computed(() => result.value?.data);
const resourceType = computed(() => result.value?.resourceType ?? 'workVariant');

// Work record (compound_record._source)
const record = computed(() => dataJson.value?.compound_record?._source);

// Base site URL (prefer nuxt site/origin if present)
const siteUrl = computed(() => {
    const u =
        (config.public.siteUrl as string | undefined) ||
        (config.public.origin as string | undefined) ||
        'https://www.av-efi.net';
    return String(u).replace(/\/+$/, '');
});

// ✅ Canonical is ALWAYS /res/<prefix>/<id>
const canonical = computed(() => `${siteUrl.value}/res/${prefix.value}/${id.value}`);

/** ---------------------------
 * Helpers (robust)
 * -------------------------- */
function asArray<T>(v: unknown): T[] {
    return Array.isArray(v) ? (v as T[]) : [];
}

function normalizeText(v: unknown): string | null {
    if (typeof v === 'string') return v.trim() || null;
    if (typeof v === 'number') return String(v);
    return null;
}

function uniqStrings(values: (string | undefined | null)[]) {
    return Array.from(new Set(values.map((v) => (typeof v === 'string' ? v : null)).filter(Boolean))) as string[];
}

function isHttpUrl(v: unknown): v is string {
    return typeof v === 'string' && /^https?:\/\//i.test(v);
}

// Title + description (fallbacks)
const primaryTitle = computed(() => normalizeText(record.value?.has_record?.has_primary_title?.has_name) || '');
const title = computed(() =>
    primaryTitle.value
        ? t('seo.resource.title', { title: primaryTitle.value })
        : t('seo.resource.title', { title: 'Filmwerk' })
);

const description = computed(() =>
    normalizeText(record.value?.has_record?.abstract) ||
    normalizeText(asArray<any>(record.value?.has_record?.has_note)?.[0]) ||
    t('seo.resource.description')
);

// Keywords (keep short)
const schemaKeywords = computed(() => {
    const subjects = asArray<any>(record.value?.has_record?.has_subject).map((s) => normalizeText(s?.has_name)).filter(Boolean) as string[];
    const genres = asArray<any>(record.value?.has_record?.has_genre).map((g) => normalizeText(g?.has_name)).filter(Boolean) as string[];
    const directors = asArray<any>(record.value?.directors_or_editors).map((d) => normalizeText(d)).filter(Boolean) as string[];
    const topSubjects = asArray<any>(record.value?.subjects).map((s) => normalizeText(s)).filter(Boolean) as string[];
    return Array.from(new Set([...genres, ...subjects, ...topSubjects, ...directors])).slice(0, 20);
});

// sameAs: ONLY real URLs
const schemaSameAs = computed(() => {
    const out: string[] = [];
    const url = record.value?.url;
    if (isHttpUrl(url)) out.push(url);

    // record.has_record.same_as is typically {id, category} -> include only if id is URL
    const sameAsObjs = asArray<any>(record.value?.has_record?.same_as);
    for (const s of sameAsObjs) {
        const sid = s?.id;
        if (isHttpUrl(sid)) out.push(sid);
    }
    return uniqStrings(out);
});

/** ---------------------------
 * SEO meta + canonical link
 * -------------------------- */
useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: '/img/avefi-og-image.png',
    ogUrl: canonical.value,
    keywords: computed(() => uniqStrings([
        'AVefi',
        'Filmmetadaten',
        'audiovisuelle Bestände',
        'Persistent Identifier',
        'efi',
        'Linked Open Data',
        'FAIR',
        ...schemaKeywords.value,
    ]).join(', ')),
});

useHead({
    link: [{ rel: 'canonical', href: canonical.value }],
});

/** ---------------------------
 * Schema.org graph:
 * DataCatalog -> Dataset -> Movie (+ WebPage)
 * with SearchAction for /search
 * -------------------------- */
/** ---------------------------
 * Schema.org graph:
 * WebPage + DataCatalog + Dataset + Movie + Breadcrumb
 * (Dataset texts via i18n, no unresolved keys)
 * -------------------------- */
import { useSchemaOrg, defineBreadcrumb } from '#imports';

// Stable node ids
const websiteId = computed(() => `${siteUrl.value}/#website`);
const identityId = computed(() => `${siteUrl.value}/#organization`);
const catalogId = computed(() => `${siteUrl.value}/#catalog`);
const datasetId = computed(() => `${siteUrl.value}/#dataset`);
const webpageId = computed(() => `${canonical.value}#webpage`);

// ✅ i18n-backed dataset texts (no raw keys in JSON-LD)
const datasetName = computed(() => t('home.seo.datasetTitle'));
const datasetDescription = computed(() => t('home.seo.datasetDescription'));

useSchemaOrg(() => {
    const graph: any[] = [];

    // Shared org reference
    const orgRef = {
        '@type': 'Organization',
        '@id': identityId.value,
        name: 'AVefi',
        url: siteUrl.value,
    };

    // --- WebPage (detail page) ---
    graph.push({
        '@id': webpageId.value,
        '@type': 'WebPage',
        url: canonical.value,
        name: title.value,
        description: description.value,
        inLanguage: ['de-DE', 'en-US'],
        isPartOf: { '@id': websiteId.value },
        primaryImageOfPage: { '@id': `${siteUrl.value}/#logo` },
        mainEntity: { '@id': canonical.value },
        potentialAction: [
            {
                '@type': 'ReadAction',
                target: [canonical.value],
            },
        ],
    });

    // --- DataCatalog (portal) ---
    graph.push({
        '@id': catalogId.value,
        '@type': 'DataCatalog',
        name: 'AVefi – Film Metadata Catalog',
        url: siteUrl.value,
        inLanguage: ['de-DE', 'en-US'],
        publisher: orgRef,
        dataset: { '@id': datasetId.value },
        potentialAction: {
            '@type': 'SearchAction',
            target: [
                {
                    '@type': 'EntryPoint',
                    urlTemplate: `${siteUrl.value}/search?query={search_term_string}`,
                },
            ],
            'query-input': 'required name=search_term_string',
        },
    });

    // --- Dataset (Dataset Search signal) ---
    graph.push({
        '@id': datasetId.value,
        '@type': 'Dataset',
        name: datasetName.value,
        description: datasetDescription.value,
        url: siteUrl.value,
        inLanguage: ['de-DE', 'en-US'],
        isAccessibleForFree: true,
        includedInDataCatalog: { '@id': catalogId.value },

        publisher: orgRef,
        creator: orgRef,
        license: 'https://creativecommons.org/publicdomain/zero/1.0/',

        keywords: uniqStrings([
            'AVefi',
            'film metadata',
            'audiovisual archives',
            'persistent identifiers',
            'linked open data',
            ...schemaKeywords.value,
        ]),
        sameAs: uniqStrings([
            'https://github.com/AV-EFI',
            'https://www.zotero.org/groups/5125890/avefi',
        ]),
        potentialAction: {
            '@type': 'SearchAction',
            target: [
                {
                    '@type': 'EntryPoint',
                    urlTemplate: `${siteUrl.value}/search?query={search_term_string}`,
                },
            ],
            'query-input': 'required name=search_term_string',
        },
    });

    // --- Movie (this record) ---
    const handle = normalizeText(record.value?.handle) || `${prefix.value}/${id.value}`;

    graph.push({
        '@id': canonical.value,
        '@type': 'Movie',
        url: canonical.value,
        name: primaryTitle.value || title.value,
        description: description.value,
        inLanguage: ['de-DE', 'en-US'],
        mainEntityOfPage: { '@id': webpageId.value },
        identifier: [
            {
                '@type': 'PropertyValue',
                propertyID: 'Handle',
                value: handle,
            },
        ],
        isPartOf: { '@id': datasetId.value },
        includedInDataCatalog: { '@id': catalogId.value },
        provider: orgRef,
        keywords: schemaKeywords.value.length ? schemaKeywords.value : undefined,
        sameAs: schemaSameAs.value.length ? schemaSameAs.value : undefined,
    });

    // --- Breadcrumbs ---
    graph.push(
        defineBreadcrumb({
            '@id': `${canonical.value}#breadcrumb`,
            itemListElement: [
                { name: t('home.breadcrumbs'), item: `${siteUrl.value}/`, position: 1 },
                { name: t('filmresearch'), item: `${siteUrl.value}/search`, position: 2 },
                { name: primaryTitle.value || title.value, item: canonical.value, position: 3 },
            ],
        })
    );

    return graph;
});

/** ---------------------------
 * Breadcrumbs for template
 * -------------------------- */
const breadcrumbs = computed(() => [
    ['Home', '/'],
    [t('filmresearch'), `/${config.public.SEARCH_URL}${currentUrlState.value}`],
    [t('detailview'), `/res/${prefix.value}/${id.value}`],
]);
</script>

<style scoped>
legend,
label {
  color: var(--primary-600) !important;
}

a.external-link {
  color: var(--primary-400) !important;
}

a.external-link:before {
  font-family: "Font Awesome 5 Free";
  content: url('https://api.iconify.design/fa-regular:share-square.svg');
  display: inline-block;
  padding-right: 3px;
  vertical-align: middle;
  font-weight: 400;
  color: var(--primary-400) !important;
}

.dark legend,
.dark label {
  color: var(--primary-300) !important;
}

.dark a.external-link {
  color: var(--primary-200) !important;
}

.dark a.external-link:before {
  color: var(--primary-200) !important;
}
</style>