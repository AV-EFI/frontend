<template>
    <div class="flex flex-row lg:flex-row justify-between lg:items-center">
        <div v-if="type === 'searchresult'" :class="['flex justify-center flex-col w-4/5']">
            <h4 class="col-span-full text-xs text-gray-700 dark:text-gray-300">
                {{ manifestation?.handle }}
            </h4>
            <h4 :id="headingId || undefined" class="col-span-full font-semibold text-gray-900 dark:text-white my-1">
                {{ manifestation?.has_record?.described_by?.has_issuer_name }}
            </h4>

            <div class="col-span-full text-sm 2xl:text-md text-gray-700 dark:text-neutral-200 flex flex-row">
                <span v-if="manifestation?.has_record?.has_event?.has_date" class="flex flex-row justify-start items-center"
                      :aria-label="$t('productionyear') + ': ' + manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ')">
                    {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
                </span>

                <span v-if="manifestation?.has_record?.has_colour_type" class="flex flex-row items-center"
                      :aria-label="$t('has_colour') + ': ' + $t(manifestation.has_record?.has_colour_type)">
                    <template v-if="manifestation.has_record?.has_event?.has_date">
                        <span class="flex flex-row items-center">&nbsp;&nbsp;</span>
                    </template>
                    <Icon name="tabler:paint" class="w-4 h-4 mr-1 inline-block" aria-hidden="true" />
                    {{ $t(manifestation.has_record?.has_colour_type) }}
                </span>

                <span v-if="manifestation?.has_record?.in_language" class="flex flex-row items-center"
                      :aria-label="$t('in_language_code') + ': ' + manifestation.has_record?.in_language?.map(language => `${$t(language?.code || '')}`).join(', ')">
                    <template v-if="manifestation.has_record?.has_event?.has_date || manifestation.has_record?.has_colour_type">
                        <span class="flex flex-row items-center">&nbsp;&nbsp;</span>
                    </template>
                    <Icon name="tabler:language" class="w-4 h-4 mr-1 inline-block" aria-hidden="true" />
                    {{ manifestation.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
                </span>
            </div>

            <div class="flex flex-row mt-1">
                <div v-if="allItemsEmpty" class="badge bg-warning-300 dark:text-black z-10" role="note"
                     :aria-label="$t('emptyItemsLong')">
                    <Icon class="text-lg" name="mi:document-empty" aria-hidden="true" />
                    &nbsp;{{ $t('emptyItemsShort') }}
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col justify-center w-full">
            <h4 class="col-span-full text-xs text-gray-700 dark:text-gray-300">
                {{ manifestation?.handle }}
                <MicroBadgeCategoryComp :category="manifestation?.has_record?.category || 'avefi:Manifestation'"
                                        class="ml-2 inline-block" />
            </h4>
            <h4 :id="headingId || undefined" class="col-span-full font-semibold text-gray-900 dark:text-white my-1 xl:text-sm">
                {{ manifestation?.has_record?.described_by?.has_issuer_name }}
            </h4>

            <!-- NORMALIZED ROW: SearchGenericIconList + item count share SAME baseline -->
            <div
                class="col-span-full flex flex-row items-center flex-wrap gap-x-4 gap-y-1 text-[0.8rem] leading-4 text-gray-700 dark:text-neutral-200">
                <!-- Search icons -->
                <SearchGenericIconList :data="manifestation" level="manifestation" class="inline-flex items-center" />

                <!-- Item count (icon + text treated as ONE baseline unit) -->
                <span
                    v-if="manifestation.items?.length > 0"
                    class="inline-grid grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-x-1.5 min-w-0 rounded-md border border-base-300/60 bg-base-100/70 px-2 py-1 shadow-sm shadow-base-300/10 whitespace-nowrap leading-4"
                >
                    <Icon name="tabler:hierarchy" class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span class="inline-flex items-center whitespace-nowrap leading-4">
                        {{ `${manifestation.items.length} ${manifestation.items.length === 1 ?
                            $t('item') :
                            $t('items')}` }}
                    </span>
                </span>
            </div>

            <div
                v-if="!allItemsEmpty && itemPreviewIconEntries(manifestation).length"
                class="col-span-full mt-1 flex flex-row flex-wrap items-center gap-2"
            >
                <span
                    class="text-xs text-gray-600 dark:text-gray-300 mr-1"
                    :title="$t('itemLevelInfoAvailableHelp')"
                >
                    {{ $t('itemLevelInfoShort') }}
                </span>
                <span
                    v-for="entry in itemPreviewIconEntries(manifestation)"
                    :key="entry.key"
                    class="inline-flex items-center justify-center rounded-md border border-base-300/60 bg-base-100/70 px-1.5 py-1 shadow-sm shadow-base-300/10"
                    :title="entry.label"
                    :aria-label="entry.label"
                >
                    <Icon :name="entry.icon" class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                </span>
            </div>

            <div class="flex flex-row mt-1">
                <div v-if="allItemsEmpty" class="badge bg-warning-300 dark:text-black z-10" role="note"
                     :aria-label="$t('emptyItemsLong')">
                    <Icon class="text-lg" name="mi:document-empty" aria-hidden="true" />
                    &nbsp;{{ $t('emptyItemsShort') }}
                </div>
            </div>
        </div>

        <div class="hidden">
            <MicroEfiCopyComp :handle="manifestation?.handle ?? manifestation?.handle" category="manifestation"
                              class="z-10 relative" :comp-size="compSize" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping';

defineProps({
    manifestation: Object as PropType<any>,
    type: String as PropType<string>,
    compSize: {
        type: String as PropType<string>,
        default: 'md',
    },
    isTwin: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    allItemsEmpty: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    headingId: {
        type: String as PropType<string>,
        default: '',
    },
});

import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();

function safeT(val: unknown): string {
    return typeof val === 'string' && val.trim()
        ? $t(val)
        : '';
}

function formatInLanguageText(langs: any[]): string {
    return langs
        .map(lang => safeT(lang?.code))
        .filter(Boolean)
        .join(', ');
}

function formatInLanguageAria(langs: any[]): string {
    return safeT('in_language_code') + ': ' + langs
        .map(lang => safeT(lang?.code))
        .filter(Boolean)
        .join(', ');
}

function hasNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

function hasNonEmptyArray(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0;
}

function itemPreviewIconEntries(manifestation: any) {
    const items = Array.isArray(manifestation?.items) ? manifestation.items : [];
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
        { key: 'has_access_status', iconKey: 'has_access_status', label: $t('tooltip.accessStatus') },
        { key: 'has_format_type', iconKey: 'has_format_type', label: $t('tooltip.format') },
        { key: 'item_element_type', iconKey: 'item_element_type', label: $t('tooltip.elementType') },
        { key: 'in_language_code', iconKey: 'in_language_code', label: $t('in_language') },
        { key: 'has_sound_type', iconKey: 'has_sound_type', label: $t('has_sound_type') },
        { key: 'has_colour_type', iconKey: 'has_colour_type', label: $t('has_colour_type') },
        { key: 'has_duration_has_value', iconKey: 'has_duration_has_value', label: $t('has_duration') },
        { key: 'has_extent_has_value', iconKey: 'has_extent_has_value', label: $t('avefi:Extent') },
        { key: 'has_frame_rate', iconKey: 'items.has_record.has_frame_rate', label: $t('has_frame_rate') },
        { key: 'has_webresource', iconKey: 'items.has_record.has_webresource', label: $t('webresource') },
    ];

    return ordered
        .filter((entry) => flags[entry.key as keyof typeof flags])
        .map((entry) => ({
            key: entry.key,
            icon: getFacetIcon(entry.iconKey, 'tabler-info-circle'),
            label: entry.label,
        }));
}
</script>
