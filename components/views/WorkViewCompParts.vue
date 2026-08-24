<template>
    <section
        v-if="Array.isArray(parts) && parts.length"
        class="w-full"
        role="region"
        :aria-label="$t('parts')"
    >
        <div class="my-2">
            <h2 class="inline-flex items-center gap-2 text-xl font-bold">
                <Icon :name="workLevelIcon" class="icon-inline" aria-hidden="true" />
                {{ type == 'parts' ? $t('parts') : $t('workVariants') }}
            </h2>
        </div>
        <div
            v-for="part in parts"
            :key="part?.handle || part?.url || Math.random()"
            class="card bg-white border-base-200 border-2 shadow-md rounded-xl dark:bg-gray-900 w-full hover:shadow-xl mb-4 text-neutral-900 dark:text-white"
            role="region"
            :aria-label="`${$t('title')}: ${get(part,'has_record.has_primary_title.has_name') || part?.handle || $t('untitledPart')}`"
        >
            <!-- Header -->
            <header class="card-body p-4 pb-2">
                <div class="flex flex-col md:flex-row justify-between">
                    <div class="w-4/5 md:w-4/5">
                        <!-- PID / handle copy -->
                        <GlobalClipboardComp
                            v-if="part?.handle"
                            class="text-regular flex flex-row items-center whitespace-break-spaces text-xs dark:text-gray-300"
                            :display-text="`${part.handle}`"
                            :copy-text="`${runtime.public.AVEFI_COPY_PID_URL}${part.handle}`"
                        />

                        <!-- Title + category -->
                        <h2
                            :id="`part-title-${part?.handle ?? idxFallback()}`"
                            class="card-title text-lg font-semibold"
                        >
                            <NuxtLink
                                v-if="part?.handle"
                                :to="`/res/${part.handle}`"
                                class="link dark:link-white no-underline hover:underline"
                                :aria-label="$t('detailviewlink')"
                                :title="$t('detailviewlink')"
                                target="_blank"
                            >
                                {{ get(part,'has_record.has_primary_title.has_name') || part?.handle || $t('title') }}
                            </NuxtLink>
                            <MicroBadgeCategoryComp
                                :category="part?.has_record?.category || 'avefi:WorkVariantPart'"
                                :dense="false"
                                class="ml-2"
                            />
                        </h2>

                        <!-- Alternative titles (if any) -->
                        <h3 v-if="Array.isArray(part.has_record?.has_alternative_title)">
                            <ul>
                                <li
                                    v-for="alt in (part.has_record?.has_alternative_title || [])"
                                    :key="alt?.id || alt?.has_name"
                                >
                                    {{ alt?.has_name }} <span v-if="alt?.type">({{ $t(alt.type) }})</span>
                                </li>
                            </ul>
                        </h3>
                    </div>

                    <!-- Right actions -->
                    <div class="w-full md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto">
                        <NuxtLink
                            v-if="part?.handle"
                            :to="`/res/${part.handle}`"
                            class="btn btn-circle btn-outline btn-md mr-2"
                            :aria-label="$t('detailviewlink')"
                            :title="$t('detailviewlink')"
                            target="_blank"
                        >
                            <Icon name="tabler:eye" class="text-2xl" aria-hidden="true" />
                        </NuxtLink>

                        <a
                            v-else-if="part?.url"
                            :href="part.url"
                            class="btn btn-circle btn-outline btn-md mr-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="$t('open')"
                            :title="$t('open')"
                        >
                            <Icon name="tabler:external-link" class="text-2xl" aria-hidden="true" />
                        </a>

                        <GlobalActionContextComp v-if="part" :item="part" />
                    </div>
                </div>
                <SearchGenericIconList
                    :data="part"
                    level="work"
                    class="mt-2"
                />
            </header>

            <!-- Optional highlight snippets (if your parts carry _highlightResult too) -->
            <Transition name="fade" mode="out-in">
                <div
                    v-if="showHighlight && getHighlightSnippets(part).length > 0"
                    class="my-2 ml-3 text-sm highlight-snippets"
                >
                    <span>✨ <strong>{{ $t('lookWhatWeFound') }}</strong></span>
                    <ul>
                        <SearchHighlightMatchComp
                            v-for="(entry, i) in getHighlightSnippets(part)"
                            :key="i + entry.value"
                            :value="entry.value"
                            :field="entry.key"
                        />
                    </ul>
                </div>
            </Transition>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping';

const { t: $t } = useI18n();
const runtime = useRuntimeConfig();
const workLevelIcon = getFacetIcon('work');

type NameObj = { has_name?: string };
type AltTitle = NameObj & { id?: string | number; type?: string };
type LocatedIn = { has_name?: string };
type Event = { located_in?: LocatedIn[] };
type DescribedBy = { has_issuer_name?: string };

export type Part = {
    handle?: string;
    url?: string;
    '@timestamp'?: string;
    category?: string;
    years?: string[]; // label(s) like "1958–1961"
    creators?: string[];
    directors_or_editors?: string[];
    has_record?: {
        category?: string;
        has_primary_title?: NameObj;
        has_alternative_title?: AltTitle[];
        has_event?: Event[];
        has_form?: string[];
        described_by?: DescribedBy[];
    };
    _highlightResult?: unknown;
    [k: string]: unknown;
};

withDefaults(defineProps<{
    parts: Part[];
    showAdminStats?: boolean;
    type?: string;
}>(), {
    type: 'parts',
});

const showHighlight = ref(true);

// ---- helpers mirroring your WorkViewComp patterns ----
function get(obj: unknown, path: string): unknown {
    if (!obj || !path) return undefined;
    return path.split('.').reduce<unknown>((o, p) => {
        const rec = o as Record<string, unknown> | null | undefined;
        return rec && rec[p] != null ? rec[p] : undefined;
    }, obj);
}

// optional highlights (same logic style you use)
function getValueByPath(obj: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((o, p) => {
        const rec = o as Record<string, unknown> | null | undefined;
        return rec && rec[p] ? rec[p] : null;
    }, obj);
}
function getHighlightSnippets(item: Part) {
    const result: Array<{key: string; value: string}> = [];
    const highlights = item?._highlightResult || {};
    const fieldsToInclude: Record<string,string> = {
        title: 'has_record.has_primary_title.has_name',
        AlternativeTitle: 'has_record.has_alternative_title.has_name',
        production: 'production',
        creators: 'creators',
        directors_or_editors: 'directors_or_editors',
        has_form: 'has_record.has_form',
        genre: 'has_record.has_genre.has_name',
        subject: 'subjects',
    };
    for (const [labelKey, path] of Object.entries(fieldsToInclude)) {
        const entry = getValueByPath(highlights, path);
        const entries = Array.isArray(entry) ? entry : [entry];
        for (const e of entries) {
            if (e?.matchLevel !== 'none' && Array.isArray(e?.matchedWords) && e.matchedWords.length > 0 && typeof e.value === 'string') {
                result.push({ key: labelKey, value: e.value });
            }
        }
    }
    return result;
}

// simple unique fallback for missing handle
function idxFallback() {
    return Math.random().toString(36).slice(2);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
