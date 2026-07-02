<template>
    <ul :class="rootClasses" role="list">
        <!-- Row 1: primary — located_in, years, creators (work only) -->
        <li
            v-if="level === 'work' && primaryEntries.length > 0"
            :class="rowClasses"
        >
            <IconEntryItem
                v-for="entry in primaryEntries"
                :key="entry.key"
                :entry="entry"
                :facet-attribute="facetAttributeForEntry(entry)"
                :entry-class="primaryEntryClass(entry)"
                :text-class="primaryTextClass"
                :value-block-class="primaryValueBlockClass"
                :icon-class="iconClass"
                :toggle-button-class="TOGGLE_BUTTON_CLASS"
                :single-value-class="singleValueClass"
                :seg-class="segClass(entry)"
                :content-id="`${level}-${entry.key}`"
                :is-large-screen="isLargeScreen"
            />
        </li>

        <!-- Row 2: bounded — manifestation/item metadata + work fields not in other rows -->
        <li v-if="boundedEntries.length > 0" :class="rowClasses">
            <IconEntryItem
                v-for="entry in boundedEntries"
                :key="entry.key"
                :entry="entry"
                :facet-attribute="facetAttributeForEntry(entry)"
                :entry-class="entryClass"
                :text-class="textClass"
                :value-block-class="valueBlockClass"
                :icon-class="iconClass"
                :toggle-button-class="TOGGLE_BUTTON_CLASS"
                :single-value-class="singleValueClass"
                :seg-class="segClass(entry)"
                :content-id="`${level}-${entry.key}`"
                :is-large-screen="isLargeScreen"
            />
        </li>

        <!-- Row 3: thematic — form, prod_events, production, genre (work only) -->
        <li v-if="thematicEntries.length > 0" :class="rowClasses">
            <IconEntryItem
                v-for="entry in thematicEntries"
                :key="entry.key"
                :entry="entry"
                :facet-attribute="facetAttributeForEntry(entry)"
                :entry-class="entryClass"
                :text-class="textClass"
                :value-block-class="valueBlockClass"
                :icon-class="iconClass"
                :toggle-button-class="TOGGLE_BUTTON_CLASS"
                :single-value-class="singleValueClass"
                :seg-class="segClass(entry)"
                :content-id="`${level}-${entry.key}`"
                :is-large-screen="isLargeScreen"
            />
        </li>

        <!-- Row 4: volatile — subjects/keywords (work only, full-width) -->
        <li v-if="volatileEntries.length > 0" :class="rowClasses">
            <IconEntryItem
                v-for="entry in volatileEntries"
                :key="entry.key"
                :entry="entry"
                :facet-attribute="facetAttributeForEntry(entry)"
                :entry-class="volatileEntryClass"
                :text-class="textClass"
                :value-block-class="volatileValueBlockClass"
                :icon-class="iconClass"
                :toggle-button-class="TOGGLE_BUTTON_CLASS"
                :single-value-class="singleValueClass"
                :seg-class="segClass(entry)"
                :content-id="`${level}-${entry.key}`"
                :is-large-screen="isLargeScreen"
            />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import IconEntryItem from './IconEntryItem.vue';
import { getFacetIcon } from '@/models/interfaces/manual/IFacetIconMapping';
import { config as searchkitConfig } from '~/searchConfig_avefi';
import { clickableFacetConfig } from '~/config/clickableFacetConfig';
import {
    FACET_ATTRIBUTE_BY_ENTRY_KEY,
    PRIMARY_ENTRY_KEYS,
    THEMATIC_ENTRY_KEYS,
    VOLATILE_ENTRY_KEYS,
} from '~/config/entryDisplayConfig';
import { useIsLargeScreen } from '~/composables/useIsLargeScreen';
import { buildWorkEntries } from '~/utils/iconEntry/buildWorkEntries';
import { buildManifestationEntries } from '~/utils/iconEntry/buildManifestationEntries';
import { buildItemEntries } from '~/utils/iconEntry/buildItemEntries';
import { orderEntries } from '~/utils/iconEntry/entryHelpers';
import type { IconEntry, Level } from '~/types/iconEntry';

const { t } = useI18n();
const { getLocalizedPlaceLabel } = useLocalizedPlaceLabel();
const { isLargeScreen } = useIsLargeScreen();

const props = withDefaults(defineProps<{
    data: unknown;
    level: Level;
    iconColor?: string;
    entryLevelClass?: string;
    density?: 'normal' | 'compact';
}>(), {
    iconColor: '',
    entryLevelClass: '',
    density: 'normal',
});

// ─── Derived flags ───────────────────────────────────────────────────────────

const isCompact = computed(() => props.density === 'compact');
const isManifestationLevel = computed(() => props.level === 'manifestation');

// ─── Constants ───────────────────────────────────────────────────────────────

const TOGGLE_BUTTON_CLASS =
    'text-xs text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm';

// ─── Class computeds ─────────────────────────────────────────────────────────

const rootClasses = computed(() =>
    isCompact.value
        ? 'flex flex-col gap-0.5 text-xs leading-[14px] text-base-content'
        : isManifestationLevel.value
            ? 'flex flex-row flex-wrap items-center gap-2 xl:gap-4 leading-4 text-base-content'
            : 'flex flex-col gap-1.5 leading-snug text-base-content',
);

const rowClasses = computed(() => {
    const base = isCompact.value
        ? 'flex flex-row flex-wrap items-start gap-1 text-left justify-start'
        : isManifestationLevel.value
            ? 'flex flex-row flex-wrap items-center gap-2 xl:gap-4 text-left justify-start'
            : 'flex flex-row flex-wrap gap-2 items-start text-left justify-start';
    return props.level === 'work' ? `${base} min-w-0` : base;
});

const baseEntryClass = computed(() =>
    isCompact.value
        ? 'max-w-full rounded-md px-1 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
        : 'max-w-full rounded-md px-1.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
);

const gridClass = computed(() =>
    isCompact.value ? 'grid-cols-[0.75rem_minmax(0,1fr)]' : 'grid-cols-[0.875rem_minmax(0,1fr)]',
);
const gapClass = computed(() => isCompact.value ? 'gap-x-1' : 'gap-x-1.5');
const leadingClass = computed(() =>
    isCompact.value ? 'leading-[14px]' : (isManifestationLevel.value ? 'leading-4' : 'leading-[16px]'),
);
const sharedEntryClasses = computed(() =>
    `inline-grid ${gridClass.value} items-start ${gapClass.value} min-w-0 ${leadingClass.value} ${baseEntryClass.value} ${props.entryLevelClass}`,
);

function primaryEntryClass(entry: IconEntry): string {
    const widthClass = entry.key === 'creators' ? 'flex-1 basis-80' : 'shrink-0';
    return `inline-grid ${widthClass} max-w-full ${gridClass.value} items-start ${gapClass.value} min-w-0 ${leadingClass.value} ${baseEntryClass.value} ${props.entryLevelClass}`;
}

const entryClass = computed(() => sharedEntryClasses.value);
const volatileEntryClass = computed(() =>
    `grid w-full max-w-full ${gridClass.value} items-start ${gapClass.value} min-w-0 ${leadingClass.value} ${baseEntryClass.value} ${props.entryLevelClass}`,
);

const iconClass = computed(() =>
    isCompact.value
        ? ['block', 'h-3', 'w-3', 'shrink-0', 'self-start', 'mt-px', 'leading-none', props.iconColor]
        : ['block', 'h-3.5', 'w-3.5', 'shrink-0', 'self-start', 'mt-px', 'leading-none', props.iconColor],
);

const primaryTextClass = computed(() =>
    isCompact.value
        ? 'min-w-0 inline-flex flex-col items-start gap-0.5 leading-[14px]'
        : 'min-w-0 inline-flex flex-col items-start gap-1 leading-[16px]',
);
const textClass = computed(() =>
    isCompact.value
        ? 'min-w-0 inline-flex flex-col items-start gap-0.5 leading-[14px]'
        : isManifestationLevel.value
            ? 'min-w-0 inline-flex flex-col items-start gap-1 leading-4'
            : 'min-w-0 inline-flex flex-col items-start gap-1 leading-[16px]',
);

const primaryValueBlockClass = 'min-w-0';
const valueBlockClass = computed(() =>
    isCompact.value
        ? 'min-w-0 inline-flex flex-wrap items-center gap-x-0.5 whitespace-nowrap leading-[14px]'
        : isManifestationLevel.value
            ? 'min-w-0 inline-flex flex-wrap items-center gap-x-0.5 whitespace-nowrap leading-4'
            : 'min-w-0 inline-flex flex-wrap items-start gap-x-0.5 leading-[16px]',
);
const volatileValueBlockClass = computed(() =>
    isCompact.value
        ? 'min-w-0 max-w-full inline-flex flex-wrap items-start gap-x-0.5 overflow-hidden leading-[14px]'
        : 'min-w-0 max-w-full inline-flex flex-wrap items-start gap-x-0.5 overflow-hidden leading-[16px]',
);

const singleValueClass = computed(() =>
    isManifestationLevel.value || isCompact.value ? 'whitespace-nowrap' : 'break-words',
);

function segClass(entry: IconEntry): Record<string, boolean> {
    const segs = Array.isArray(entry.text) ? entry.text : [];
    return {
        'line-clamp-1': segs.length < 2,
        'whitespace-nowrap': isManifestationLevel.value || isCompact.value,
    };
}

// ─── Facet attribute resolution ──────────────────────────────────────────────

const configuredFacetAttributes = new Set(
    ((searchkitConfig as unknown as { search_settings?: { facet_attributes?: { attribute: string }[] } })
        ?.search_settings?.facet_attributes ?? [])
        .map(f => f?.attribute)
        .filter((a): a is string => typeof a === 'string' && a.length > 0),
);

function facetAttributeForEntry(entry: IconEntry): string {
    const attribute = FACET_ATTRIBUTE_BY_ENTRY_KEY[entry.key] ?? '';
    if (!attribute) return '';
    return (configuredFacetAttributes.has(attribute) || attribute in clickableFacetConfig) ? attribute : '';
}

// ─── Icon helper ─────────────────────────────────────────────────────────────

const iconFor = (key: string) => getFacetIcon(key, 'tabler-info-circle');

// ─── Entry building ──────────────────────────────────────────────────────────

const iconEntries = computed((): IconEntry[] => {
    const deps = { t, getLocalizedPlaceLabel, iconFor };
    let raw: IconEntry[];

    if (props.level === 'work') {
        raw = buildWorkEntries(props.data, deps);
    } else if (props.level === 'manifestation') {
        raw = buildManifestationEntries(props.data, { t, iconFor });
    } else {
        raw = buildItemEntries(props.data, { t, iconFor });
    }

    return orderEntries(raw, props.level);
});

// ─── Row categorisation ──────────────────────────────────────────────────────

const primaryEntries = computed(() =>
    iconEntries.value.filter(e => (PRIMARY_ENTRY_KEYS as readonly string[]).includes(e.key)),
);
const thematicEntries = computed(() =>
    props.level === 'work'
        ? iconEntries.value.filter(e => (THEMATIC_ENTRY_KEYS as readonly string[]).includes(e.key))
        : [],
);
const volatileEntries = computed(() =>
    props.level === 'work'
        ? iconEntries.value.filter(e => (VOLATILE_ENTRY_KEYS as readonly string[]).includes(e.key))
        : [],
);
const boundedEntries = computed(() =>
    iconEntries.value.filter(e =>
        !(PRIMARY_ENTRY_KEYS as readonly string[]).includes(e.key) &&
        !(THEMATIC_ENTRY_KEYS as readonly string[]).includes(e.key) &&
        !(VOLATILE_ENTRY_KEYS as readonly string[]).includes(e.key),
    ),
);
</script>
