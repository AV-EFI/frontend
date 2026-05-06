<template>
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
        <article
            v-for="(work, workIndex) in datasets"
            :key="work?.handle ?? work?.objectID ?? `work-${workIndex}`"
            class="h-full rounded-xl border border-base-300/80 bg-white dark:bg-gray-800 dark:border-gray-700 p-3 shadow-sm hover:shadow-md transition-shadow text-neutral-900 dark:text-white flex flex-col"
            role="region"
            :aria-labelledby="`compact-work-title-${work?.handle ?? workIndex}`"
        >
            <div class="mb-1.5 min-w-0">
                <GlobalClipboardComp
                    class="text-[11px] text-base-content/75 min-w-0"
                    :display-text="work?.handle ?? ''"
                    :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${work?.handle ?? ''}`"
                    tabindex="0"
                    role="button"
                    :aria-label="`${$t('copyToClipboard')}: ${work?.handle ?? ''}`"
                />
            </div>

            <div class="flex items-start justify-between gap-2 mb-2">
                <h2 :id="`compact-work-title-${work?.handle ?? workIndex}`" class="font-semibold text-sm leading-5 min-w-0 text-left">
                    <NuxtLink
                        v-if="work?.handle"
                        :to="`/res/${work.handle}`"
                        class="link link-hover dark:link-white text-left inline-block"
                        :aria-label="titleFor(work) || work?.handle || $t('title')"
                        target="_blank"
                    >
                        {{ titleFor(work) || work?.handle || $t('title') }}
                    </NuxtLink>
                    <span v-else>
                        {{ titleFor(work) || work?.handle || $t('title') }}
                    </span>
                </h2>

                <NuxtLink
                    v-if="work?.handle"
                    :to="`/res/${work.handle}`"
                    class="btn btn-circle btn-outline btn-xs shrink-0"
                    :aria-label="`${$t('detailviewlink')}: ${titleFor(work) || work?.handle}`"
                    :title="$t('detailviewlink')"
                    target="_blank"
                >
                    <Icon name="tabler:eye" class="text-base" aria-hidden="true" />
                </NuxtLink>
            </div>

            <div class="mb-2 flex items-center gap-2 min-w-0">
                <MicroBadgeCategoryComp :category="work?.category || 'avefi:WorkVariant'" :dense="false" />
            </div>

            <div class="space-y-1 text-xs text-base-content/85 min-h-18">
                <div v-if="placesFor(work)" class="flex items-start gap-1.5">
                    <Icon name="tabler:map-pin" class="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span class="line-clamp-2">{{ placesFor(work) }}</span>
                </div>
                <div v-if="yearsFor(work)" class="flex items-start gap-1.5">
                    <Icon name="tabler:calendar" class="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{{ yearsFor(work) }}</span>
                </div>
                <div v-if="creatorsFor(work)" class="flex items-start gap-1.5">
                    <Icon name="tabler:users" class="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span class="line-clamp-2">{{ creatorsFor(work) }}</span>
                </div>
            </div>

            <div class="mt-auto pt-2 border-t border-base-200 dark:border-gray-700 min-h-10 flex items-center">
                <div
                    v-if="itemPreviewIconEntries(work).length"
                    class="flex items-center gap-1.5 overflow-x-auto w-full"
                    :title="$t('itemLevelInfoAvailableHelp')"
                >
                    <span class="text-[10px] uppercase tracking-wide text-base-content/60 shrink-0">
                        {{ $t('itemLevelInfoShort') }}
                    </span>
                    <span
                        v-for="entry in itemPreviewIconEntries(work)"
                        :key="entry.key"
                        :class="[
                            'inline-flex items-center justify-center rounded px-1 py-1 shrink-0 border transition-colors',
                            isFacetActive(entry)
                                ? 'border-primary/70 bg-primary/15 ring-1 ring-primary/35'
                                : 'border-base-300/70 bg-base-100/70',
                        ]"
                        :title="entry.label"
                        :aria-label="entry.label"
                    >
                        <Icon
                            :name="entry.icon"
                            :class="[
                                'w-3.5 h-3.5',
                                isFacetActive(entry) ? 'text-primary-content dark:text-primary' : 'text-primary',
                            ]"
                            aria-hidden="true"
                        />
                    </span>
                </div>

                <div v-else-if="allWorkItems(work).length" class="w-full">
                    <span class="badge badge-userinfo badge-sm dark:text-black" :title="$t('allItemsEmptyTooltip')">
                        <Icon name="tabler:alert-circle" class="w-3 h-3 mr-1" aria-hidden="true" />
                        {{ $t('allItemsEmpty') }}
                    </span>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping';

const props = defineProps({
    datasets: {
        type: Array as PropType<Array<any>>,
        required: true,
    },
    currentRefinements: {
        type: Array,
        required: false,
        default: () => [],
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { t: $t } = useI18n();

function titleFor(work: any): string {
    return work?.has_record?.has_primary_title?.has_name || '';
}

function yearsFor(work: any): string {
    const years = work?.years;
    if (Array.isArray(years) && years.length) {
        return years.join(', ');
    }

    const range = work?.production_in_year;
    if (range && typeof range === 'object') {
        const from = range.gte ?? range.gt ?? '';
        const to = range.lte ?? range.lt ?? '';
        return [from, to].filter(Boolean).join(' - ');
    }

    return '';
}

function creatorsFor(work: any): string {
    const creators = Array.isArray(work?.creators) ? work.creators : [];
    if (creators.length) {
        return creators.map((c: any) => String(c)).filter(Boolean).join(', ');
    }

    const directors = Array.isArray(work?.directors_or_editors) ? work.directors_or_editors : [];
    return directors.length ? directors.map((d: any) => String(d)).filter(Boolean).join(', ') : '';
}

function placesFor(work: any): string {
    const places = new Set<string>();

    const events = Array.isArray(work?.has_record?.has_event)
        ? work.has_record.has_event
        : [];

    for (const event of events) {
        const locations = Array.isArray(event?.located_in)
            ? event.located_in
            : (event?.located_in ? [event.located_in] : []);

        for (const location of locations) {
            const rawNames = location?.has_name;

            if (Array.isArray(rawNames)) {
                for (const candidate of rawNames) {
                    if (typeof candidate === 'string' && candidate.trim()) {
                        places.add(candidate.trim());
                    }
                }
                continue;
            }

            if (typeof rawNames === 'string' && rawNames.trim()) {
                places.add(rawNames.trim());
            }
        }
    }

    return Array.from(places).join(', ');
}

function hasNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

function hasNonEmptyArray(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0;
}

function normalizeFacetKey(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.trim().toLowerCase();
}

const activeFacetKeys = computed(() => {
    const keys = new Set<string>();
    const refinements = Array.isArray(props.currentRefinements) ? props.currentRefinements : [];

    for (const refinement of refinements) {
        const rawLabel = (refinement as any)?.label;
        const normalized = normalizeFacetKey(rawLabel);
        if (!normalized) continue;

        keys.add(normalized);

        const lastSegment = normalized.split('.').pop();
        if (lastSegment) {
            keys.add(lastSegment);
        }
    }

    return keys;
});

function isFacetActive(entry: { facetKeys?: string[] }): boolean {
    if (!entry?.facetKeys?.length) return false;
    return entry.facetKeys.some((key) => activeFacetKeys.value.has(normalizeFacetKey(key)));
}

function allWorkItems(work: any): any[] {
    const rows: any[] = [];

    const manifestations = Array.isArray(work?.manifestations) ? work.manifestations : [];
    for (const manifestation of manifestations) {
        const items = Array.isArray(manifestation?.items) ? manifestation.items : [];
        for (const item of items) {
            rows.push(item);
        }
    }

    const topLevelItems = Array.isArray(work?.items) ? work.items : [];
    for (const item of topLevelItems) {
        rows.push(item);
    }

    return rows;
}

function itemPreviewIconEntries(work: any) {
    const items = allWorkItems(work);
    if (!items.length) return [];

    const flags = {
        has_access_status: false,
        has_format_type: false,
        item_element_type: false,
        in_language_code: false,
        has_sound_type: false,
        has_colour_type: false,
        has_duration_has_value: false,
        has_extent_has_value: false,
        has_frame_rate: false,
        has_webresource: false,
    };

    for (const item of items) {
        const record = item?.has_record || {};

        if (hasNonEmptyString(record?.has_access_status)) flags.has_access_status = true;
        if (Array.isArray(record?.has_format) && record.has_format.some((f: any) => hasNonEmptyString(f?.type))) flags.has_format_type = true;
        if (hasNonEmptyString(record?.element_type)) flags.item_element_type = true;
        if (Array.isArray(record?.in_language) && record.in_language.some((lang: any) => hasNonEmptyString(lang?.code))) flags.in_language_code = true;
        if (hasNonEmptyString(record?.has_sound_type)) flags.has_sound_type = true;
        if (hasNonEmptyString(record?.has_colour_type)) flags.has_colour_type = true;
        if (typeof item?.duration_in_minutes === 'number' || hasNonEmptyString(record?.has_duration?.has_value)) flags.has_duration_has_value = true;
        if (hasNonEmptyString(record?.has_extent?.has_value)) flags.has_extent_has_value = true;
        if (hasNonEmptyString(record?.has_frame_rate)) flags.has_frame_rate = true;
        if (hasNonEmptyString(record?.has_webresource) || hasNonEmptyArray(record?.has_webresource)) flags.has_webresource = true;
    }

    const ordered = [
        { key: 'has_access_status', iconKey: 'has_access_status', label: $t('tooltip.accessStatus'), facetKeys: ['has_access_status'] },
        { key: 'has_format_type', iconKey: 'has_format_type', label: $t('tooltip.format'), facetKeys: ['has_format_type'] },
        { key: 'item_element_type', iconKey: 'item_element_type', label: $t('tooltip.elementType'), facetKeys: ['item_element_type'] },
        { key: 'in_language_code', iconKey: 'in_language_code', label: $t('in_language'), facetKeys: ['in_language_code'] },
        { key: 'has_sound_type', iconKey: 'has_sound_type', label: $t('has_sound_type'), facetKeys: ['has_sound_type'] },
        { key: 'has_colour_type', iconKey: 'has_colour_type', label: $t('has_colour_type'), facetKeys: ['has_colour_type'] },
        { key: 'has_duration_has_value', iconKey: 'has_duration_has_value', label: $t('has_duration'), facetKeys: ['has_duration_has_value'] },
        { key: 'has_extent_has_value', iconKey: 'has_extent_has_value', label: $t('avefi:Extent'), facetKeys: ['has_extent_has_value'] },
        { key: 'has_frame_rate', iconKey: 'items.has_record.has_frame_rate', label: $t('has_frame_rate'), facetKeys: ['has_frame_rate'] },
        { key: 'has_webresource', iconKey: 'items.has_record.has_webresource', label: $t('webresource'), facetKeys: ['has_webresource'] },
    ];

    return ordered
        .filter((entry) => flags[entry.key as keyof typeof flags])
        .map((entry) => ({
            key: entry.key,
            icon: getFacetIcon(entry.iconKey, 'tabler-info-circle'),
            label: entry.label,
            facetKeys: entry.facetKeys,
        }));
}
</script>
