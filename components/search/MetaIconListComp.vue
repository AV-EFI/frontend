<template>
  <ul
    class="flex flex-col sm:flex-row sm:flex-wrap gap-y-1 sm:gap-x-3 text-[0.75rem] leading-snug text-base-content mt-1"
    role="list"
  >
    <li
      v-for="entry in metaEntries"
      :key="entry.key"
      class="flex flex-row items-center gap-1.5 min-w-[6rem]"
      :aria-label="entry.aria"
      :title="entry.aria"
    >
      <Icon
        :name="entry.icon"
        class="w-[0.85rem] h-[0.85rem] text-primary shrink-0 my-auto"
        aria-hidden="true"
      />
      <span class="inline-block flex-wrap">
        <template v-if="Array.isArray(entry.text)">
          <template
            v-for="(segment, i) in entry.text"
            :key="i"
          >
            <span>{{ segment.text }}</span>
            <span
              v-if="segment.hilite"
              :title="`${$t('matchedField')}: ${segment.text}`"
              class="badge badge-xs bg-highlight text-white ml-1"
            />
            <span v-if="i < entry.text.length - 1">, </span>
          </template>
        </template>
        <template v-else>
          {{ entry.text }}
        </template>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
const { t: $t } = useI18n();

type MetaSegment = { text: string; hilite: boolean };
type MetaEntry = { key: string; icon: string; text: MetaSegment[] | string; aria: string };

const props = defineProps<{ data: any }>();
const metaEntries = ref<MetaEntry[]>([]);

function formatDuration(has_value: string): string {
    try {
        const parts = has_value
            .replace(/^PT/, '')
            .replace(/H/, ':')
            .replace(/M/, ':')
            .replace(/S/, '')
            .split(':');
        return parts.map((p) => p.padStart(2, '0')).join(':');
    } catch {
        return has_value;
    }
}

const activeFacets = ref<Record<string, string[]>>({
    in_language_code: [],
    has_colour_type: [],
    has_sound_type: [],
    has_duration_has_value: [],
    has_extent_has_value: [],
    item_element_type: [],
    has_format_type: [],
    manifestation_event_type: []
});

function parseRefinementsFromUrl(href: string) {
    const url = new URL(href);
    const params = new URLSearchParams(url.search);

    const result: Record<string, string[]> = {
        in_language_code: [],
        has_colour_type: [],
        has_sound_type: [],
        has_duration_has_value: [],
        has_extent_has_value: [],
        item_element_type: [],
        has_format_type: [],
        manifestation_event_type: []
    };

    for (const [key, value] of params.entries()) {
        const match = key.match(/\[refinementList]\[([^\]]+)](?:\[\d+])?$/);
        if (match) {
            const facet = match[1];
            if (facet in result) result[facet].push(value);
        }
    }
    return result;
}

function updateActiveFacetsFromUrl() {
    Object.keys(activeFacets.value).forEach((f) => (activeFacets.value[f] = []));
    const refinements = parseRefinementsFromUrl(window.location.href);
    Object.entries(refinements).forEach(([facet, values]) => {
        if (facet in activeFacets.value && Array.isArray(values)) activeFacets.value[facet] = values;
    });
}

function isFacetActive(facetKey: string, value: string) {
    return activeFacets.value[facetKey]?.includes(value);
}
function highlightIfActive(facetKey: string, rawValue: string, displayValue?: string): MetaSegment {
    return { text: displayValue || rawValue, hilite: isFacetActive(facetKey, rawValue) };
}
function toArray<T>(x: T | T[] | undefined | null): T[] {
    return Array.isArray(x) ? x : x ? [x] : [];
}

// safe getter for first non-empty string across candidate paths
function getFirstString(obj: any, paths: string[]): string | undefined {
    for (const p of paths) {
        const val = p.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
        if (val != null && val !== '') return String(val);
    }
    return undefined;
}

function buildMetaEntries(): MetaEntry[] {
    const entries: MetaEntry[] = [];

    // LANGUAGES (items.has_record.in_language.code)
    const langObjs = toArray(props.data?.has_record?.in_language);
    const langs = langObjs
        .map((l: any) => {
            const code = l?.code || '';
            if (!code) return null;
            const label = $t(code);
            const usage = Array.isArray(l?.usage)
                ? l.usage.length ? ` (${l.usage.map((u: string) => $t(u)).join(', ')})` : ''
                : l?.usage ? ` (${$t(String(l.usage))})` : '';
            const h = highlightIfActive('in_language_code', code, label);
            return { text: h.text + usage, hilite: h.hilite };
        })
        .filter(Boolean) as MetaSegment[];
    if (langs.length) {
        entries.push({
            key: 'lang',
            icon: 'tabler:language',
            text: langs,
            aria: $t('in_language_code') + ': ' + langs.map((l) => l.text).join(', ')
        });
    }

    // COLOUR (item/manifestation)
    const colour = getFirstString(props.data, [
        'has_record.has_colour_type',
        'has_colour_type'
    ]);
    if (colour) {
        entries.push({
            key: 'colour',
            icon: 'tabler:palette',
            text: [highlightIfActive('has_colour_type', colour, $t(colour))],
            aria: $t('has_colour') + ': ' + $t(colour)
        });
    }

    // SOUND (item/manifestation)
    const sound = getFirstString(props.data, [
        'has_record.has_sound_type',
        'has_sound_type'
    ]);
    if (sound) {
        const s = sound.toLowerCase();
        entries.push({
            key: 'sound',
            icon: s.includes('silent') ? 'tabler:volume-off' : 'tabler:volume',
            text: [highlightIfActive('has_sound_type', sound, $t(sound))],
            aria: $t('has_sound_type') + ': ' + $t(sound)
        });
    }

    // DURATION (string)
    const rawDuration = getFirstString(props.data, [
        'has_record.has_duration.has_value',
        'has_duration.has_value'
    ]);
    if (rawDuration) {
        const d = formatDuration(rawDuration);
        entries.push({
            key: 'duration',
            icon: 'tabler:clock-hour-3',
            text: [highlightIfActive('has_duration_has_value', rawDuration, d)],
            aria: $t('duration') + ': ' + d
        });
    }

    // EXTENT
    const extent = getFirstString(props.data, [
        'has_record.has_extent.has_value',
        'has_extent.has_value'
    ]);
    const unit = getFirstString(props.data, [
        'has_record.has_extent.has_unit',
        'has_extent.has_unit'
    ]);
    if (extent) {
        const label = `${extent} ${unit ? $t(unit) : ''}`.trim();
        entries.push({
            key: 'extent',
            icon: 'tabler:ruler',
            text: label,
            aria: `${$t('avefi:Extent')}: ${label}`
        });
    }

    // ELEMENT TYPE (item) — primary path + fallback
    const elementType = getFirstString(props.data, [
        'has_record.element_type', // items.has_record.element_type
        'element_type'             // fallback if denormalized
    ]);
    if (elementType) {
        entries.push({
            key: 'elementType',
            icon: 'tabler:movie',
            text: [highlightIfActive('item_element_type', elementType, $t(elementType))],
            aria: $t('tooltip.elementType') + ': ' + $t(elementType)
        });
    }

    // FORMAT (item)
    const formatField = props.data?.has_record?.has_format;
    const formatTypes = toArray(formatField).map((f: any) => f?.type).filter(Boolean) as string[];
    if (formatTypes.length) {
        entries.push({
            key: 'format',
            icon: 'tabler:disc',
            text: formatTypes.map((f: string) => highlightIfActive('has_format_type', f, $t(f))),
            aria: $t('tooltip.format') + ': ' + formatTypes.map((f: string) => $t(f)).join(', ')
        });
    }

    // EVENT TYPE (manifestation only; harmless on items)
    const eventTypes = toArray(props.data?.has_record?.has_event)
        .map((e: any) => e?.type)
        .filter(Boolean) as string[];
    if (eventTypes.length) {
        entries.push({
            key: 'eventType',
            icon: 'tabler:calendar-event',
            text: eventTypes.map((tpe: string) => highlightIfActive('manifestation_event_type', tpe, $t(tpe))),
            aria: $t('manifestation_event_type') + ': ' + eventTypes.map((e: string) => $t(e)).join(', ')
        });
    }

    // ensure immutability for array texts
    return entries.map((e) => ({
        ...e,
        text: Array.isArray(e.text) ? e.text.map((seg) => ({ ...seg })) : e.text
    }));
}

function updateFromHref() {
    updateActiveFacetsFromUrl();
    metaEntries.value = buildMetaEntries();
}

// initial build
updateActiveFacetsFromUrl();
metaEntries.value = buildMetaEntries();

// rebuild when data changes (covers inner_hits arriving later)
watch(
    () => props.data,
    () => {
        metaEntries.value = buildMetaEntries();
    },
    { deep: true }
);

const lastHref = ref(window.location.href);

onMounted(() => {
    updateFromHref();

    const interval = setInterval(() => {
        if (window.location.href !== lastHref.value) {
            lastHref.value = window.location.href;
            updateFromHref();
        }
    }, 200);

    window.addEventListener('popstate', updateFromHref);
    window.addEventListener('pushstate', updateFromHref);
    window.addEventListener('replacestate', updateFromHref);

    onBeforeUnmount(() => {
        clearInterval(interval);
        window.removeEventListener('popstate', updateFromHref);
        window.removeEventListener('pushstate', updateFromHref);
        window.removeEventListener('replacestate', updateFromHref);
    });
});
</script>
