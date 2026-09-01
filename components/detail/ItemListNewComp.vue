<template>
    <div role="list" :aria-label="$t('items')">
        <article
            v-for="(exemplar, itemIndex) in items"
            :key="exemplar?.id || exemplar?.handle"
            class="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 mb-2 px-2 md:px-4 py-2 dark:text-white text-neutral-700"
            role="listitem"
            :aria-labelledby="getItemHeadingId(exemplar, itemIndex)"
        >
            <div class="col-span-full md:col-span-12 mb-1">
                <MicroDividerComp
                    class="mx-auto lg:mt-1.25 mb-4"
                    label-text="avefi:Item"
                    :label-suffix="itemNumber(itemIndex)"
                    in-class="item"
                />
                <h5 :id="getItemHeadingId(exemplar, itemIndex)" class="sr-only">
                    {{ itemSummaryLabel(exemplar, itemIndex) }}
                </h5>
                <div :id="getItemAnchorId(exemplar, itemIndex)">
                    <DetailKeyValueComp
                        keytxt="efi"
                        :translate-key="false"
                        :valtxt="exemplar?.handle"
                        :clip-text="`${copyPidUrl}${exemplar?.handle}`"
                        class="w-full mb-2 text-base"
                        :clip="true"
                    />
                </div>
                <div v-if="exemplar?.has_record?.has_access_status == 'Removed'" class="alert">
                    {{ $t('itemRemovedWarning') }}
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_access_status" />
                        <GlobalTooltipInfo
                            :text="$t('tooltip.accessStatus')"
                            class="ml-2"
                        />
                    </span>
                    <SearchHighlightSingleComp
                        :item="exemplar?.has_record?.has_access_status || null"
                        :hitlite="highlightResult?.manifestations?.items?.has_record?.has_access_status?.matchedWords"
                        facet-attribute="has_access_status"
                        class="text-sm"
                    />
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_format" />
                        <GlobalTooltipInfo
                            :text="$t('tooltip.format')"
                            class="ml-2"
                        />
                    </span>
                    <SearchHighlightListComp
                        :items="formatItemFormatTypes(exemplar?.has_record?.has_format)"
                        :hilite="highlightResult?.manifestations?.items?.has_record?.has_format?.type?.matchedWords"
                        facet-attribute="has_format_type"
                        class="text-sm"
                    />
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="item_element_type" />
                        <GlobalTooltipInfo
                            :text="$t('tooltip.elementType')"
                            class="ml-2"
                        />
                    </span>
                    <SearchHighlightSingleComp
                        :item="exemplar?.has_record?.element_type || null"
                        :hitlite="highlightResult?.manifestations?.items?.has_record?.element_type?.matchedWords"
                        facet-attribute="item_element_type"
                        class="text-sm"
                    />
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="in_language" />
                    </span>
                    <SearchHighlightListComp
                        :items="formatItemLanguages(exemplar?.has_record?.in_language)"
                        :facet-values="formatItemLanguageCodes(exemplar?.has_record?.in_language)"
                        :hilite="highlightResult?.manifestations?.items?.has_record?.in_language?.code?.matchedWords"
                        facet-attribute="in_language_code"
                        class="text-sm"
                    />
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_sound_type" />
                    </span>
                    <SearchClickableFacetValue
                        v-if="exemplar?.has_record?.has_sound_type"
                        attribute="has_sound_type"
                        :value="exemplar.has_record.has_sound_type"
                        :label="translateKey(exemplar.has_record.has_sound_type)"
                        class="text-sm font-normal"
                    >
                        {{ translateKey(exemplar.has_record.has_sound_type) }}
                    </SearchClickableFacetValue>
                    <p v-else class="text-sm font-normal">-</p>
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_colour_type" />
                    </span>
                    <SearchClickableFacetValue
                        v-if="exemplar?.has_record?.has_colour_type"
                        attribute="has_colour_type"
                        :value="exemplar.has_record.has_colour_type"
                        :label="translateKey(exemplar.has_record.has_colour_type)"
                        class="text-sm font-normal"
                    >
                        {{ translateKey(exemplar.has_record.has_colour_type) }}
                    </SearchClickableFacetValue>
                    <p v-else class="text-sm font-normal">-</p>
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_duration" />
                    </span>
                    <p class="text-sm font-normal">
                        {{
                            exemplar?.duration_in_minutes
                                ? `${exemplar.duration_in_minutes} ${$t('minutes')}`
                                : (exemplar?.has_record?.has_duration?.has_value
                                    ? exemplar.has_record.has_duration.has_value.replace('PT', '').toLowerCase()
                                    : '-')
                        }}
                    </p>
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="avefi:Extent" />
                    </span>
                    <p class="text-sm font-normal">
                        {{
                            exemplar?.has_record?.has_extent?.has_value
                                ? `${exemplar.has_record.has_extent.has_value} ${translateKey(exemplar.has_record.has_extent.has_unit)}`
                                : '-'
                        }}
                    </p>
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_frame_rate" />
                    </span>
                    <p class="text-sm font-normal">
                        {{ exemplar?.has_record?.has_frame_rate ? translateKey(exemplar.has_record.has_frame_rate) : '-' }}
                    </p>
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3">
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="has_note" />
                    </span>
                    <p class="text-sm font-normal">
                        {{ exemplar?.has_record?.has_note ? translateKey(exemplar.has_record.has_note) : '-' }}
                    </p>
                </div>
            </div>

            <div
                v-if="sameAsRefsFrom(exemplar).length"
                class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3"
            >
                <div class="flex flex-col mb-1">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <MicroLabelComp label-text="referencesAndWorkRelations" />
                    </span>
                    <ul class="mt-1 space-y-1">
                        <li
                            v-for="sameAs in sameAsRefsFrom(exemplar)"
                            :key="sameAsKey(sameAs)"
                            class="flex min-h-8 items-start gap-2"
                        >
                            <span
                                class="min-w-0 grow truncate text-sm font-normal"
                                :title="sameAsDisplayLabel(sameAs)"
                            >
                                {{ sameAsDisplayLabel(sameAs) }}
                            </span>
                            <DetailSameAsComp
                                :same-as-data="[sameAs]"
                                type="item"
                                class="shrink-0 text-sm"
                            />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-span-full md:col-span-6 xl:col-span-4 2xl:col-span-3 flex flex-col justify-end">
                <span class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <MicroLabelComp label-text="webresource" />
                    <GlobalTooltipInfo
                        :text="$t('tooltip.webresource')"
                        class="ml-2"
                    />
                </span>

                <template v-if="Array.isArray(exemplar?.has_record?.has_webresource) && exemplar.has_record.has_webresource.length">
                    <ul class="mt-1 space-y-0.5">
                        <li
                            v-for="(url, i) in exemplar.has_record.has_webresource"
                            :key="i"
                        >
                            <a
                                :href="url"
                                target="_blank"
                                rel="noopener"
                                class="link link-primary text-sm font-semibold inline-flex items-center"
                            >
                                <Icon
                                    name="tabler:external-link"
                                    class="mr-1"
                                    aria-hidden="true"
                                /> {{ $t('webresource') }}{{ exemplar.has_record.has_webresource.length > 1 ? ` ${i + 1}` : '' }}
                            </a>
                        </li>
                    </ul>
                </template>
                <a
                    v-else-if="typeof exemplar?.has_record?.has_webresource === 'string'"
                    :href="exemplar.has_record.has_webresource"
                    target="_blank"
                    rel="noopener"
                    class="link link-primary my-auto text-base font-semibold inline-flex items-center"
                >
                    <Icon
                        name="tabler:external-link"
                        class="mr-1"
                        aria-hidden="true"
                    /> {{ $t('webresource') }}
                </a>
                <p
                    v-else
                    class="text-base font-semibold opacity-60"
                >
                    -
                </p>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { IAVefiItem } from '~/models/interfaces/generated/IAVefiItem';
import type { AuthorityResource, Format } from '~/models/interfaces/schema/avefi_schema_type_utils';

const { t } = useI18n();
const config = useRuntimeConfig();
const copyPidUrl = String(config.public.AVEFI_COPY_PID_URL ?? '');

// Detail views feed this component real IAVefiItem records. `id` and
// duration_in_minutes are optional add-ons because search-hit-shaped data
// (SearchItem, see ISearchWorkHit.ts) is structurally close but carries an
// ES-index-only duration_in_minutes field; keeping both optional here lets
// either shape flow through without lying about what's actually populated.
type ItemHeadingExemplar = IAVefiItem & {
    id?: string;
    duration_in_minutes?: number;
};

const props = defineProps({
    items: { type: Array as PropType<ItemHeadingExemplar[]>, required: true },
    manifestationIndex: { type: Number, required: true },
    manifestationHandle: { type: String, required: false, default: '' },
    highlightResult: { type: Object, required: false, default: () => ({}) },
    productionDetailsChecked: { type: Boolean, required: false, default: false },
    showAdminStats: { type: Boolean, required: false, default: false },
});

function formatItemFormatTypes(formats: Format[] | undefined) {
    return (formats || []).map((f) => f?.type).filter((type): type is string => Boolean(type));
}

function translateKey(value: unknown) {
    if (typeof value !== 'string' || !value) return '';
    return t(value);
}

function formatUsageList(usage: unknown) {
    if (!Array.isArray(usage)) return '';

    const translatedUsage = usage
        .map((entry) => translateKey(entry))
        .filter(Boolean);

    return translatedUsage.length ? ` (${translatedUsage.join(', ')})` : '';
}

function formatItemLanguages(languages: unknown) {
    if (!Array.isArray(languages)) return [];

    return languages
        .map((language) => {
            const code = translateKey(language?.code);
            if (!code) return '';
            return `${code}${formatUsageList(language?.usage)}`;
        })
        .filter(Boolean);
}

function formatItemLanguageCodes(languages: unknown) {
    if (!Array.isArray(languages)) return [];

    return languages
        .map((language) => (typeof language?.code === 'string' ? language.code : ''))
        .filter(Boolean);
}

function sameAsRefsFrom(exemplar: ItemHeadingExemplar | undefined): AuthorityResource[] {
    if (!Array.isArray(exemplar?.has_record?.same_as)) return [];

    const seen = new Set<string>();
    return exemplar.has_record.same_as.filter((sameAs): sameAs is AuthorityResource => {
        if (!sameAs?.category || !sameAs?.id) return false;

        const key = sameAsKey(sameAs);
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

function sameAsKey(sameAs: Pick<AuthorityResource, 'category' | 'id'>) {
    return `${sameAs.category}:${sameAs.id}`;
}

function sameAsDisplayLabel(sameAs: Pick<AuthorityResource, 'category' | 'id'>): string {
    return `${translateKey(sameAs.category)}: ${sameAs.id}`;
}

function getItemAnchorId(exemplar: ItemHeadingExemplar | undefined, itemIndex: number) {
    return exemplar?.handle?.trim() || `item-${props.manifestationIndex}-${itemIndex}`;
}

function getItemHeadingId(exemplar: ItemHeadingExemplar | undefined, itemIndex: number) {
    return `${getItemAnchorId(exemplar, itemIndex)}-heading`;
}

function itemNumber(itemIndex: number) {
    return `${props.manifestationIndex + 1}.${itemIndex + 1}`;
}

function itemSummaryLabel(exemplar: ItemHeadingExemplar | undefined, itemIndex: number) {
    const record = exemplar?.has_record;
    const values = [
        `${t('item')} ${itemNumber(itemIndex)}`,
        record?.has_access_status ? `${t('has_access_status')}: ${translateKey(record.has_access_status)}` : '',
        formatItemFormatTypes(record?.has_format).length ? `${t('has_format_type')}: ${formatItemFormatTypes(record?.has_format).map(translateKey).join(', ')}` : '',
        record?.element_type ? `${t('item_element_type')}: ${translateKey(record.element_type)}` : '',
        formatItemLanguages(record?.in_language).length ? `${t('in_language_code')}: ${formatItemLanguages(record?.in_language).join(', ')}` : '',
    ].filter(Boolean);

    return values.join(', ');
}
</script>
