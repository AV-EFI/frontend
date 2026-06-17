<template>
    <ul :class="rootClasses" role="list">
        <!-- First row: located_in, years, creators (WORK ONLY) -->
        <li
            v-if="level === 'work' && iconEntries.length > 0"
            :class="rowClasses('primary')"
        >
            <template
                v-for="entry in iconEntries.filter(e => ['located_in', 'years', 'creators'].includes(e.key))"
                :key="entry.key">
                <div
                    :class="primaryEntryClasses(entry)"
                    tabindex="0"
                    :aria-label="entry.aria"
                    :title="entry.aria"
                >
                    <Icon
                        :name="entry.icon"
                        :class="iconClasses"
                        aria-hidden="true"
                    />

                    <span :class="primaryTextClasses">
                        <span :id="entryContentId(entry)" :class="primaryValueClasses">
                            <template v-if="Array.isArray(entry.text)">
                                <template v-for="(segment, i) in visibleSegments(entry)" :key="i">
                                    <SearchClickableFacetValue
                                        v-if="facetAttributeForEntry(entry)"
                                        :attribute="facetAttributeForEntry(entry)"
                                        :value="facetValueForSegment(segment)"
                                        :label="segment.text"
                                    >
                                        {{ segment.text }}
                                    </SearchClickableFacetValue>
                                    <span v-else>{{ segment.text }}</span>
                                    <MicroDataQualityWarningIcon
                                        v-if="shouldWarnSegment(entry, segment)"
                                        class="ml-1"
                                        :label="dataQualityWarningLabel(entry, segment.text)"
                                    />
                                    <span v-if="segment.hilite" :title="`${$t('matchedField')}: ${segment.text}`"
                                          class="badge-highlight-xs ml-1" />
                                    <span v-if="i < visibleSegments(entry).length - 1">; </span>
                                </template>
                            </template>

                            <template v-else>
                                <SearchClickableFacetValue
                                    v-if="facetAttributeForEntry(entry)"
                                    :attribute="facetAttributeForEntry(entry)"
                                    :value="entry.text"
                                    :label="entry.text"
                                    :class="singleValueClasses"
                                >
                                    {{ entry.text }}
                                </SearchClickableFacetValue>
                                <span v-else :class="singleValueClasses">{{ entry.text }}</span>
                            </template>
                        </span>

                        <button
                            v-if="hasOverflow(entry)"
                            type="button"
                            :class="toggleButtonClasses"
                            :aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
                            :aria-label="toggleLabel(entry)"
                            :aria-controls="entryContentId(entry)"
                            @click="toggleExpand(entry.key)"
                        >
                            {{ toggleText(entry) }}
                        </button>
                    </span>
                </div>
            </template>
        </li>

        <!-- Second row: bounded metadata -->
        <li
            v-if="boundedEntries.length > 0"
            :class="rowClasses('bounded')"
        >
            <template
                v-for="entry in boundedEntries"
                :key="entry.key">
                <div
                    :class="entryClasses"
                    tabindex="0"
                    :aria-label="entry.aria" :title="entry.aria">
                    <Icon
                        :name="entry.icon"
                        :class="iconClasses"
                        aria-hidden="true"
                    />
                    <span :class="textClasses">
                        <span :id="entryContentId(entry)" :class="valueBlockClasses">
                            <template v-if="Array.isArray(entry.text)">
                                <template v-for="(segment, i) in visibleSegments(entry)" :key="i">
                                    <SearchClickableFacetValue
                                        v-if="facetAttributeForEntry(entry)"
                                        :attribute="facetAttributeForEntry(entry)"
                                        :value="facetValueForSegment(segment)"
                                        :label="segment.text"
                                        :class="segmentClasses(entry)"
                                    >
                                        {{ segment.text }}
                                    </SearchClickableFacetValue>
                                    <span v-else :class="segmentClasses(entry)">
                                        {{ segment.text }}
                                    </span>
                                    <MicroDataQualityWarningIcon
                                        v-if="shouldWarnSegment(entry, segment)"
                                        class="ml-1"
                                        :label="dataQualityWarningLabel(entry, segment.text)"
                                    />
                                    <span v-if="segment.hilite" :title="`${$t('matchedField')}: ${segment.text}`"
                                          class="badge-highlight-xs ml-1" />
                                    <span v-if="i < visibleSegments(entry).length - 1">; </span>
                                </template>
                            </template>

                            <template v-else>
                                <SearchClickableFacetValue
                                    v-if="facetAttributeForEntry(entry)"
                                    :attribute="facetAttributeForEntry(entry)"
                                    :value="entry.text"
                                    :label="entry.text"
                                    :class="singleValueClasses"
                                >
                                    {{ entry.text }}
                                </SearchClickableFacetValue>
                                <span v-else :class="singleValueClasses">
                                    {{ entry.text }}
                                </span>
                            </template>
                        </span>

                        <button
                            v-if="hasOverflow(entry)"
                            type="button"
                            :class="toggleButtonClasses"
                            :aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
                            :aria-label="toggleLabel(entry)"
                            :aria-controls="entryContentId(entry)"
                            @click="toggleExpand(entry.key)"
                        >
                            {{ toggleText(entry) }}
                        </button>
                    </span>
                </div>
            </template>
        </li>

        <!-- Third row: form, production event and genre belong together semantically -->
        <li
            v-if="thematicEntries.length > 0"
            :class="rowClasses('thematic')"
        >
            <template
                v-for="entry in thematicEntries"
                :key="entry.key">
                <div
                    :class="entryClasses"
                    tabindex="0"
                    :aria-label="entry.aria" :title="entry.aria">
                    <Icon
                        :name="entry.icon"
                        :class="iconClasses"
                        aria-hidden="true"
                    />
                    <span :class="textClasses">
                        <span :id="entryContentId(entry)" :class="valueBlockClasses">
                            <template v-if="Array.isArray(entry.text)">
                                <template v-for="(segment, i) in visibleSegments(entry)" :key="i">
                                    <SearchClickableFacetValue
                                        v-if="facetAttributeForEntry(entry)"
                                        :attribute="facetAttributeForEntry(entry)"
                                        :value="facetValueForSegment(segment)"
                                        :label="segment.text"
                                        :class="segmentClasses(entry)"
                                    >
                                        {{ segment.text }}
                                    </SearchClickableFacetValue>
                                    <span v-else :class="segmentClasses(entry)">
                                        {{ segment.text }}
                                    </span>
                                    <MicroDataQualityWarningIcon
                                        v-if="shouldWarnSegment(entry, segment)"
                                        class="ml-1"
                                        :label="dataQualityWarningLabel(entry, segment.text)"
                                    />
                                    <span v-if="segment.hilite" :title="`${$t('matchedField')}: ${segment.text}`"
                                          class="badge-highlight-xs ml-1" />
                                    <span v-if="i < visibleSegments(entry).length - 1">; </span>
                                </template>
                            </template>

                            <template v-else>
                                <SearchClickableFacetValue
                                    v-if="facetAttributeForEntry(entry)"
                                    :attribute="facetAttributeForEntry(entry)"
                                    :value="entry.text"
                                    :label="entry.text"
                                    :class="singleValueClasses"
                                >
                                    {{ entry.text }}
                                </SearchClickableFacetValue>
                                <span v-else :class="singleValueClasses">
                                    {{ entry.text }}
                                </span>
                            </template>
                        </span>

                        <button
                            v-if="hasOverflow(entry)"
                            type="button"
                            :class="toggleButtonClasses"
                            :aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
                            :aria-label="toggleLabel(entry)"
                            :aria-controls="entryContentId(entry)"
                            @click="toggleExpand(entry.key)"
                        >
                            {{ toggleText(entry) }}
                        </button>
                    </span>
                </div>
            </template>
        </li>

        <!-- Fourth row: volatile length metadata, e.g. subjects/keywords -->
        <li
            v-if="volatileEntries.length > 0"
            :class="rowClasses('volatile')"
        >
            <template
                v-for="entry in volatileEntries"
                :key="entry.key">
                <div
                    :class="volatileEntryClasses"
                    tabindex="0"
                    :aria-label="entry.aria"
                    :title="entry.aria">
                    <Icon
                        :name="entry.icon"
                        :class="iconClasses"
                        aria-hidden="true"
                    />
                    <span :class="textClasses">
                        <span :id="entryContentId(entry)" :class="volatileValueBlockClasses">
                            <template v-if="Array.isArray(entry.text)">
                                <template v-for="(segment, i) in visibleSegments(entry)" :key="i">
                                    <SearchClickableFacetValue
                                        v-if="facetAttributeForEntry(entry)"
                                        :attribute="facetAttributeForEntry(entry)"
                                        :value="facetValueForSegment(segment)"
                                        :label="segment.text"
                                        :class="segmentClasses(entry)"
                                    >
                                        {{ segment.text }}
                                    </SearchClickableFacetValue>
                                    <span v-else :class="segmentClasses(entry)">
                                        {{ segment.text }}
                                    </span>
                                    <MicroDataQualityWarningIcon
                                        v-if="shouldWarnSegment(entry, segment)"
                                        class="ml-1"
                                        :label="dataQualityWarningLabel(entry, segment.text)"
                                    />
                                    <span v-if="segment.hilite" :title="`${$t('matchedField')}: ${segment.text}`"
                                          class="badge-highlight-xs ml-1" />
                                    <span v-if="i < visibleSegments(entry).length - 1">; </span>
                                </template>
                            </template>

                            <template v-else>
                                <SearchClickableFacetValue
                                    v-if="facetAttributeForEntry(entry)"
                                    :attribute="facetAttributeForEntry(entry)"
                                    :value="entry.text"
                                    :label="entry.text"
                                    :class="singleValueClasses"
                                >
                                    {{ entry.text }}
                                </SearchClickableFacetValue>
                                <span v-else :class="singleValueClasses">
                                    {{ entry.text }}
                                </span>
                            </template>
                        </span>

                        <button
                            v-if="hasOverflow(entry)"
                            type="button"
                            :class="toggleButtonClasses"
                            :aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
                            :aria-label="toggleLabel(entry)"
                            :aria-controls="entryContentId(entry)"
                            @click="toggleExpand(entry.key)"
                        >
                            {{ toggleText(entry) }}
                        </button>
                    </span>
                </div>
            </template>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFacetIcon } from '@/models/interfaces/manual/IFacetIconMapping';
import { getSuspiciousAgentNamePattern, isWhitespaceCommaOnlyText } from '~/utils/agentQuality';
import { config as searchkitConfig } from '~/searchConfig_avefi';
const { t } = useI18n();
const { getLocalizedPlaceLabel } = useLocalizedPlaceLabel();

const props = withDefaults(defineProps<{
    data: any,
    level: 'work' | 'manifestation' | 'item',
    iconColor?: string,
    entryLevelClass?: string,
    density?: 'normal' | 'compact',
}>(), {
    iconColor: '',
    entryLevelClass: '',
    density: 'normal',
});

const isManifestationLevel = computed(() => props.level === 'manifestation');
const isCompact = computed(() => props.density === 'compact');
const baseEntryClasses = computed(() =>
    isCompact.value
        ? 'max-w-full rounded-md px-1 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
        : 'max-w-full rounded-md px-1.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
);
const levelEntryClasses = computed(() => props.entryLevelClass);
const rootClasses = computed(() =>
    isCompact.value
        ? 'flex flex-col gap-0.5 text-xs leading-[14px] text-base-content'
        : isManifestationLevel.value
            ? 'flex flex-row flex-wrap items-center gap-2 xl:gap-4 leading-4 text-base-content'
            : 'flex flex-col gap-1.5 leading-snug text-base-content'
);
const secondaryRowClasses = computed(() =>
    isCompact.value
        ? 'flex flex-row flex-wrap items-start gap-1 text-left justify-start'
        : isManifestationLevel.value
            ? 'flex flex-row flex-wrap items-center gap-2 xl:gap-4 text-left justify-start'
            : 'flex flex-row flex-wrap gap-2 items-start text-left justify-start'
);
function rowClasses(kind: 'primary' | 'bounded' | 'thematic' | 'volatile') {
    void kind;
    const base = secondaryRowClasses.value;
    return props.level === 'work' ? `${base} min-w-0` : base;
}
function primaryEntryClasses(entry: { key: string }) {
    const widthClass = entry.key === 'creators'
        ? 'flex-1 basis-80'
        : 'shrink-0';
    return `inline-grid ${widthClass} max-w-full ${entryGridClasses.value} items-start ${entryGapClasses.value} min-w-0 ${entryLeadingClasses.value} ${baseEntryClasses.value} ${levelEntryClasses.value}`;
}
const entryClasses = computed(() =>
    `inline-grid ${entryGridClasses.value} items-start ${entryGapClasses.value} min-w-0 ${entryLeadingClasses.value} ${baseEntryClasses.value} ${levelEntryClasses.value}`
);
const volatileEntryClasses = computed(() =>
    `grid w-full max-w-full ${entryGridClasses.value} items-start ${entryGapClasses.value} min-w-0 ${entryLeadingClasses.value} ${baseEntryClasses.value} ${levelEntryClasses.value}`
);
const entryGridClasses = computed(() =>
    isCompact.value ? 'grid-cols-[0.75rem_minmax(0,1fr)]' : 'grid-cols-[0.875rem_minmax(0,1fr)]'
);
const entryGapClasses = computed(() =>
    isCompact.value ? 'gap-x-1' : 'gap-x-1.5'
);
const entryLeadingClasses = computed(() =>
    isCompact.value ? 'leading-[14px]' : (isManifestationLevel.value ? 'leading-4' : 'leading-[16px]')
);
const iconClasses = computed(() =>
    isCompact.value
        ? ['block', 'h-3', 'w-3', 'shrink-0', 'self-start', 'mt-px', 'leading-none', props.iconColor]
        : ['block', 'h-3.5', 'w-3.5', 'shrink-0', 'self-start', 'mt-px', 'leading-none', props.iconColor]
);
const primaryTextClasses = computed(() =>
    isCompact.value
        ? 'min-w-0 inline-flex flex-col items-start gap-0.5 leading-[14px]'
        : 'min-w-0 inline-flex flex-col items-start gap-1 leading-[16px]'
);
const textClasses = computed(() =>
    isCompact.value
        ? 'min-w-0 inline-flex flex-col items-start gap-0.5 leading-[14px]'
        : isManifestationLevel.value
            ? 'min-w-0 inline-flex flex-col items-start gap-1 leading-4'
            : 'min-w-0 inline-flex flex-col items-start gap-1 leading-[16px]'
);
const primaryValueClasses = computed(() =>
    'min-w-0'
);
const valueBlockClasses = computed(() =>
    isCompact.value
        ? 'min-w-0 inline-flex flex-wrap items-center gap-x-0.5 whitespace-nowrap leading-[14px]'
        : isManifestationLevel.value
            ? 'min-w-0 inline-flex flex-wrap items-center gap-x-0.5 whitespace-nowrap leading-4'
            : 'min-w-0 inline-flex flex-wrap items-start gap-x-0.5 leading-[16px]'
);
const volatileValueBlockClasses = computed(() =>
    isCompact.value
        ? 'min-w-0 max-w-full inline-flex flex-wrap items-start gap-x-0.5 overflow-hidden leading-[14px]'
        : 'min-w-0 max-w-full inline-flex flex-wrap items-start gap-x-0.5 overflow-hidden leading-[16px]'
);
const singleValueClasses = computed(() =>
    isManifestationLevel.value || isCompact.value
        ? 'whitespace-nowrap'
        : 'break-words'
);
const toggleButtonClasses = 'text-xs text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm';
function segmentClasses(entry: { text: any[] }) {
    return {
        'line-clamp-1': visibleSegments(entry).length < 2,
        'whitespace-nowrap': isManifestationLevel.value || isCompact.value,
    };
}
function shouldWarnSegment(entry: { key: string }, segment: { text: unknown }) {
    if (entry.key === 'creators') return Boolean(getSuspiciousAgentNamePattern(segment.text));
    if (entry.key === 'production') return isWhitespaceCommaOnlyText(segment.text);
    return false;
}
function dataQualityWarningLabel(entry: { key: string }, value: unknown) {
    if (entry.key === 'production' && isWhitespaceCommaOnlyText(value)) {
        return `Empty, whitespace-only, or comma-only production value. ${t('dataQuality.probableImportIssue')}`;
    }
    const pattern = getSuspiciousAgentNamePattern(value);
    return pattern ? `${pattern.description}. ${t('dataQuality.probableImportIssue')}` : '';
}
function entryContentId(entry: { key: string }) {
    return `generic-icon-list-${props.level}-${entry.key}`;
}
function toggleText(entry: { key: string; text: any }) {
    return isExpanded(entry.key) ? t('showLess') : `${t('showMore')} (+${hiddenCount(entry)})`;
}
function toggleLabel(entry: { key: string; text: any }) {
    return toggleText(entry);
}

/* expand/collapse */
const expandedMap = ref<Record<string, boolean>>({});
const isLargeScreen = ref(false);
let largeScreenMediaQuery: MediaQueryList | null = null;

function updateLargeScreenState(event?: MediaQueryListEvent) {
    isLargeScreen.value = event?.matches ?? largeScreenMediaQuery?.matches ?? false;
}

onMounted(() => {
    if (typeof window === 'undefined') return;

    largeScreenMediaQuery = window.matchMedia('(min-width: 1280px)');
    updateLargeScreenState();
    largeScreenMediaQuery.addEventListener('change', updateLargeScreenState);
});

onBeforeUnmount(() => {
    largeScreenMediaQuery?.removeEventListener('change', updateLargeScreenState);
    largeScreenMediaQuery = null;
});

function isExpanded(key: string) { return !!expandedMap.value[key]; }
function toggleExpand(key: string) { expandedMap.value[key] = !expandedMap.value[key]; }
function visibleLimit(entry: { key: string }) {
    if (entry.key === 'creators') return 3;
    if (volatileEntryKeys.includes(entry.key)) return isLargeScreen.value ? 5 : 2;
    return 5;
}
function hasOverflow(entry: { key: string; text: any }) { return Array.isArray(entry.text) && entry.text.length > visibleLimit(entry); }
function hiddenCount(entry: { key: string; text: any }) { return Array.isArray(entry.text) ? Math.max(0, entry.text.length - visibleLimit(entry)) : 0; }
function visibleSegments(entry: { key: string; text: any }) {
    if (!Array.isArray(entry.text)) return entry.text;
    if (!hasOverflow(entry)) return entry.text;
    return isExpanded(entry.key) ? entry.text : entry.text.slice(0, visibleLimit(entry));
}

const iconFor = (key: string) => getFacetIcon(key, 'tabler-info-circle');

type IconSegment = {
    text: string
    hilite: boolean
    facetValue?: string
};

type IconEntry = {
    key: string
    icon: string
    text: IconSegment[] | string
    aria: string
};

const facetAttributeByEntryKey: Record<string, string> = {
    located_in: 'located_in_has_name',
    creators: 'creators',
    form: 'has_form',
    production: 'production',
    genre: 'has_genre_has_name',
    subject: 'subjects',
    eventType: 'manifestation_event_type',
    mfPlace: 'located_in_has_name',
    accessStatus: 'has_access_status',
    format: 'has_format_type',
    elementType: 'item_element_type',
    lang: 'in_language_code',
    sound: 'has_sound_type',
    colour: 'has_colour_type',
    duration: 'has_duration_has_value',
    extent: 'has_extent_has_value',
};

const configuredFacetAttributes = new Set(
    ((searchkitConfig as any)?.search_settings?.facet_attributes || [])
        .map((facet: any) => facet?.attribute)
        .filter((attribute: unknown): attribute is string => typeof attribute === 'string' && attribute.length > 0)
);

function segment(text: unknown, facetValue: unknown = text): IconSegment {
    return {
        text: String(text ?? '').trim(),
        facetValue: String(facetValue ?? '').trim(),
        hilite: false,
    };
}

function facetAttributeForEntry(entry: { key: string }) {
    const attribute = facetAttributeByEntryKey[entry.key] || '';
    return configuredFacetAttributes.has(attribute) ? attribute : '';
}

function facetValueForSegment(segmentValue: { text: unknown; facetValue?: unknown }) {
    return String(segmentValue.facetValue ?? segmentValue.text ?? '').trim();
}

/* helpers */
function formatDuration(has_value: string): string {
    try {
        const parts = has_value.replace(/^PT/, '').replace(/H/, ':').replace(/M/, ':').replace(/S/, '').split(':');
        return parts.map(p => p.padStart(2, '0')).join(':');
    } catch { return has_value; }
}
const asArray = (x:any) => (Array.isArray(x) ? x : (x ? [x] : []));

/* build entries strictly per table */
function buildIconEntries() {
    const d = props.data;
    const level = props.level;
    const entries: IconEntry[] = [];

    /* ---------- WORK ---------- */
    if (level === 'work') {
        // Produktionsorte
        const workEvents = asArray(d?.has_record?.has_event);
        const locs = workEvents.flatMap((ev: any) => asArray(ev?.located_in));
        const locTexts = locs.map((loc: any) => {
            const label = getLocalizedPlaceLabel(loc) || loc?.same_as?.id || (loc?.same_as?.category ? t(loc.same_as.category) : (loc?.category ? t(loc.category) : ''));
            return segment(label || '');
        }).filter(l => l.text);
        if (locTexts.length) {
            entries.push({
                key: 'located_in',
                icon: iconFor('located_in'),
                text: locTexts,
                aria: t('located_in') + ': ' + locTexts.map(l => l.text).join(', ')
            });
        }

        // Produktionsjahre
        if (d?.years) {
            const years = asArray(d.years);
            entries.push({
                key: 'years',
                icon: iconFor('years'),
                text: years.map((y: string) => segment(y)),
                aria: t('years') + ': ' + years.join(', ')
            });
        } else if (d?.production_in_year) {
            let label = '';
            if (Array.isArray(d.production_in_year)) {
                label = d.production_in_year.map((r: any) => {
                    const from = r.gte ?? r.gt ?? '';
                    const to = r.lte ?? r.lt ?? '';
                    return [from, to].filter(Boolean).join('–');
                }).join(', ');
            } else if (typeof d.production_in_year === 'object') {
                const from = d.production_in_year.gte ?? d.production_in_year.gt ?? '';
                const to = d.production_in_year.lte ?? d.production_in_year.lt ?? '';
                label = [from, to].filter(Boolean).join('–');
            }
            if (label) {
                entries.push({
                    key: 'years',
                    icon: iconFor('years'),
                    text: [segment(label)],
                    aria: t('productionyears') + ': ' + label
                });
            }
        }

        // Filmschaffende: creators is the current ES field, directors_or_editors is a transition fallback.
        const creators = asArray(d?.creators?.length ? d.creators : d?.directors_or_editors);
        if (creators.length) {
            entries.push({
                key: 'creators',
                icon: iconFor('creators'),
                text: creators.map((creator: string) => segment(creator)),
                aria: t('creators') + ': ' + creators.join(', ')
            });
        }

        // Form (Gattung)
        const forms = asArray(d?.has_record?.has_form);
        const formLabels = forms
            .map((f:any) => {
                const raw = typeof f === 'string' ? f : (f?.has_name ?? '');
                return raw ? segment(t(raw), raw) : null;
            })
            .filter(Boolean) as IconSegment[];
        if (formLabels.length) {
            entries.push({
                key: 'form',
                icon: iconFor('form'),
                text: formLabels,
                aria: t('has_form') + ': ' + formLabels.map(item => item.text).join(', ')
            });
        }

        // Episode/Teil-Indikator
        if (d?.is_part_of) {
            const cat = d.is_part_of?.category ? t(d.is_part_of.category) : '';
            const id = d.is_part_of?.id ? String(d.is_part_of.id) : '';
            const label = [cat, id].filter(Boolean).join(' ');
            if (label) {
                entries.push({
                    key: 'episode',
                    icon: iconFor('episode'),
                    text: [segment(label)],
                    aria: t('is_part_of') + ': ' + label
                });
            }
        }

        // Produktions-Events (Typ/Kategorie)
        const evTypeLabels = workEvents.map((e:any) => e?.type || e?.category).filter(Boolean);
        if (evTypeLabels.length) {
            entries.push({
                key: 'prod_events',
                icon: iconFor('prod_events'),
                text: evTypeLabels.map((tp:string) => segment(t(tp), tp)),
                aria: t('has_event') + ': ' + evTypeLabels.map((tp:string) => t(tp)).join(', ')
            });
        }

        // Production names from the denormalized search facet. Keep these close to
        // the production event row because their quality issue is tracked separately.
        const productionNames = asArray(d?.production);
        if (productionNames.length) {
            entries.push({
                key: 'production',
                icon: iconFor('production'),
                text: productionNames.map((name: string) => segment(name)),
                aria: t('production') + ': ' + productionNames.join(', ')
            });
        }

        // Genre
        const genres = asArray(d?.has_record?.has_genre);
        const gLabels = genres
            .map((g:any) => {
                const raw = g?.has_name ? g.has_name : g;
                return raw ? segment(t(raw), raw) : null;
            })
            .filter(Boolean) as IconSegment[];
        if (gLabels.length) {
            entries.push({
                key: 'genre',
                icon: iconFor('genre'),
                text: gLabels,
                aria: t('has_genre') + ': ' + gLabels.map(item => item.text).join(', ')
            });
        }

        // Subjects
        const subjects = asArray(d?.subjects);
        const sLabels = subjects.map((s:any) => (typeof s === 'string' ? s : (s?.has_name ?? ''))).filter(Boolean);
        if (sLabels.length) {
            entries.push({
                key: 'subject',
                icon: iconFor('subject'),
                text: sLabels.map((x:string) => segment(x)),
                aria: t('subjects') + ': ' + sLabels.join(', ')
            });
        }
    }

    /* ---------- MANIFESTATION (handle, issuer, type, year, place) ---------- */
    if (level === 'manifestation') {

        /*
        const has_issuer_name = d?.has_record?.described_by?.has_issuer_name;
        console.log('has_issuer_name:', has_issuer_name);
        if (has_issuer_name) {
                entries.push({
                    key: 'has_issuer_name',
                    icon: iconFor('has_issuer_name'),
                    text: [{ text: has_issuer_name, hilite: false }],
                    aria: t('has_issuer_name') + ': ' + has_issuer_name
                });
        }
                */

        // events (PublicationEvent / RestorationEvent etc.)
        const evs = asArray(d?.has_record?.has_event);        

        // Manifestationstyp (event type/category)
        const evTypes = evs.map((e:any) => e?.type || e?.category).filter(Boolean);
        if (evTypes.length) {
            entries.push({
                key: 'eventType',
                icon: iconFor('eventType'),
                text: evTypes.map((tp:string) => segment(t(tp), tp)),
                // aria label in DE to match your spec name:
                aria: 'Manifestationstyp: ' + evTypes.map((e:string) => t(e)).join(', ')
            });
        }

        // Jahresangabe (Manifestationstyp) → from event.has_date / event.date
        const evYears = evs.map((e:any) => e?.has_date || e?.date).filter(Boolean);
        if (evYears.length) {
            entries.push({
                key: 'mfYear',
                icon: iconFor('mfYear'),
                text: evYears.map((y:string) => segment(String(y))),
                aria: 'Jahresangabe (Manifestationstyp): ' + evYears.join(', ')
            });
        }
        

        // Ortsangabe (Manifestationsereignis) → event.located_in.has_name
        const evPlaces = evs
            .flatMap((e:any) => asArray(e?.located_in))
            .map((loc:any) => loc?.has_name)
            .filter(Boolean);
        if (evPlaces.length) {
            entries.push({
                key: 'mfPlace',
                icon: iconFor('mfPlace'),
                text: evPlaces.map((p:string) => segment(p)),
                aria: 'Ortsangabe (Manifestationsereignis): ' + evPlaces.join(', ')
            });
        }
    }

    /* ---------- ITEM ---------- */
    if (level === 'item') {
        //Status
        const hasAccessStatus = d?.has_record?.has_access_status || d?.has_access_status;
        if (hasAccessStatus) {
            entries.push({
                key: 'accessStatus',
                icon: iconFor('accessStatus'),
                text: [segment(t(hasAccessStatus), hasAccessStatus)],
                aria: t('has_access_status') + ': ' + t(hasAccessStatus)
            });
        }

        // Format
        const hasFormat = d?.has_record?.has_format;
        const formats = asArray(hasFormat).map((f:any) => f?.type).filter(Boolean);
        if (formats.length) {
            entries.push({
                key: 'format',
                icon: iconFor('format'),
                text: formats.map((f:string) => segment(t(f), f)),
                aria: t('has_format') + ': ' + formats.map((f:string) => t(f)).join(', ')
            });
        }

        // Materialart (element_type)
        const elementType = d?.has_record?.element_type;
        if (elementType) {
            entries.push({
                key: 'elementType',
                icon: iconFor('elementType'),
                text: [segment(t(elementType), elementType)],
                aria: t('item_element_type') + ': ' + t(elementType)
            });
        }

        // Sprache
        const inLang = d?.has_record?.in_language;
        const langsArr = asArray(inLang).map((l:any) => {
            const code = l?.code || (typeof l === 'string' ? l : '');
            const usage = l?.usage;
            const codeLabel = code ? t(code) : '';
            const usageLabel = Array.isArray(usage) && usage.length ? ` (${usage.map((u:string) => t(u)).join(', ')})` : (usage ? ` (${t(usage)})` : '');
            return { code, label: (codeLabel + usageLabel).trim() };
        }).filter(Boolean);
        if (langsArr.length) {
            entries.push({
                key: 'lang',
                icon: iconFor('lang'),
                text: langsArr.map((lang: { code: string; label: string }) => segment(lang.label, lang.code)),
                aria: t('in_language') + ': ' + langsArr.map((lang: { label: string }) => lang.label).join(', ')
            });
        }

        // Ton
        const sound = d?.has_record?.has_sound_type || d?.has_sound_type;
        if (sound) {
            const sx = ('' + sound).toLowerCase();
            entries.push({
                key: 'sound',
                icon: sx.includes('silent') ? 'tabler-volume-off' : iconFor('sound'),
                text: [segment(t(sound), sound)],
                aria: t('has_sound_type') + ': ' + t(sound)
            });
        }

        // Farbe
        const colour = d?.has_record?.has_colour_type || d?.has_colour_type;
        if (colour) {
            entries.push({
                key: 'colour',
                icon: iconFor('colour'),
                text: [segment(t(colour), colour)],
                aria: t('has_colour_type') + ': ' + t(colour)
            });
        }

        // Abspieldauer
        const rawDuration = d?.has_record?.has_duration?.has_value || d?.has_duration?.has_value;
        if (rawDuration) {
            const dur = formatDuration(rawDuration);
            entries.push({ key: 'duration', icon: iconFor('duration'), text: [segment(dur, rawDuration)], aria: t('duration') + ': ' + dur });
        }

        // Länge/Größe
        const extentVal = d?.has_record?.has_extent?.has_value || d?.has_extent?.has_value;
        const extentUnit = d?.has_record?.has_extent?.has_unit || d?.has_extent?.has_unit;
        if (extentVal) {
            const label = `${extentVal} ${extentUnit ? t(extentUnit) : ''}`.trim();
            entries.push({ key: 'extent', icon: iconFor('extent'), text: [segment(label, extentVal)], aria: t('avefi:Extent') + ': ' + label });
        }

        // BPS (frame rate)
        const fps = d?.has_record?.has_frame_rate || d?.has_frame_rate;
        if (fps) {
            entries.push({
                key: 'fps',
                icon: iconFor('fps'),
                text: [segment(String(fps))],
                aria: t('has_frame_rate') + ': ' + String(fps)
            });
        }
    }

    /* ORDER strictly by table */
    let orderArr: string[] = [];
    if (level === 'work') {
        orderArr = [
            'located_in',
            'years',
            'creators',
            'form',
            'episode',
            'prod_events',
            'production',
            'genre',
            'subject'
        ];
    } else if (level === 'manifestation') {
        orderArr = [
            'eventType',  // Manifestationstyp
            'mfYear',     // Jahresangabe (Manifestationstyp)
            'mfPlace'     // Ortsangabe (Manifestationsereignis)
        ];
    } else if (level === 'item') {
        orderArr = [
            'format',
            'elementType',
            'lang',
            'sound',
            'colour',
            'duration',
            'extent',
            'fps'
        ];
    }

    const ordered = [
        ...orderArr.map(k => entries.find(e => e.key === k)).filter(Boolean) as any[],
        ...entries.filter(e => !orderArr.includes(e.key)) // (should be none)
    ];
    return ordered;
}

const iconEntries = computed(() => buildIconEntries());
const thematicEntryKeys = ['form', 'prod_events', 'production', 'genre'];
const volatileEntryKeys = ['subject'];
const primaryEntryKeys = ['located_in', 'years', 'creators'];
const boundedEntries = computed(() =>
    iconEntries.value.filter(entry =>
        !primaryEntryKeys.includes(entry.key) &&
        !thematicEntryKeys.includes(entry.key) &&
        !volatileEntryKeys.includes(entry.key)
    )
);
const thematicEntries = computed(() =>
    props.level === 'work'
        ? iconEntries.value.filter(entry => thematicEntryKeys.includes(entry.key))
        : []
);
const volatileEntries = computed(() =>
    props.level === 'work'
        ? iconEntries.value.filter(entry => volatileEntryKeys.includes(entry.key))
        : []
);
</script>
