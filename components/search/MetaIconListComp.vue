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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
const { t } = useI18n();
  
const props = defineProps<{ data: any }>();
const route = useRoute();
const metaEntries = ref([]);
  
function formatDuration(has_value: string): string {
    try {
        const parts = has_value.replace(/^PT/, '').replace(/H/, ':').replace(/M/, ':').replace(/S/, '').split(':');
        return parts.map(p => p.padStart(2, '0')).join(':');
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
            if (facet in result) {
                result[facet].push(value);
            }
        }
    }
  
    return result;
}
  
function updateActiveFacetsFromUrl() {
    Object.keys(activeFacets.value).forEach(facet => {
        activeFacets.value[facet] = [];
    });
  
    const refinements = parseRefinementsFromUrl(window.location.href);
  
    Object.entries(refinements).forEach(([facet, values]) => {
        if (facet in activeFacets.value && Array.isArray(values)) {
            activeFacets.value[facet] = values;
        }
    });
}
  
function isFacetActive(facetKey: string, value: string) {
    return activeFacets.value[facetKey]?.includes(value);
}
  
function highlightIfActive(facetKey: string, rawValue: string, displayValue?: string): { text: string, hilite: boolean } {
    const active = isFacetActive(facetKey, rawValue);
    return { text: displayValue || rawValue, hilite: active };
}
  
function buildMetaEntries() {
    const entries: { key: string; icon: string; text: any; aria: string }[] = [];
  
    const langs = props.data?.has_record?.in_language?.map(l => {
        const code = l?.code || '';
        const label = t(code);
        const usage = l?.usage?.length ? ` (${l.usage.map((u: string) => t(u)).join(', ')})` : '';
        const h = highlightIfActive('in_language_code', code, label);
        return { text: h.text + usage, hilite: h.hilite };
    }) || [];
    if (langs.length) {
        entries.push({
            key: 'lang',
            icon: 'mdi:translate',
            text: langs,
            aria: t('in_language_code') + ': ' + langs.map(l => l.text).join(', ')
        });
    }
  
    const colour =
      props.data?.has_colour_type ||
      props.data?.has_record?.has_colour_type ||
      props.data?.has_record?.described_by?.has_colour_attribute;
    if (colour) {
        entries.push({
            key: 'colour',
            icon: 'mdi:palette',
            text: [highlightIfActive('has_colour_type', colour, t(colour))],
            aria: t('has_colour') + ': ' + t(colour)
        });
    }
  
    const sound =
      props.data?.has_sound_type ||
      props.data?.has_record?.has_sound_type ||
      props.data?.has_record?.described_by?.has_sound_attribute;
    if (sound) {
        entries.push({
            key: 'sound',
            icon: sound.toLowerCase().includes('silent') ? 'mdi:volume-off' : 'mdi:volume-high',
            text: [highlightIfActive('has_sound_type', sound, t(sound))],
            aria: t('has_sound_type') + ': ' + t(sound)
        });
    }
  
    const rawDuration = props.data?.has_duration?.has_value || props.data?.has_record?.has_duration?.has_value;
    if (rawDuration) {
        const d = formatDuration(rawDuration);
        entries.push({
            key: 'duration',
            icon: 'mdi:clock-outline',
            text: [highlightIfActive('has_duration_has_value', rawDuration, d)],
            aria: t('duration') + ': ' + d
        });
    }
  
    const extent = props.data?.has_extent?.has_value || props.data?.has_record?.has_extent?.has_value;
    const unit = props.data?.has_extent?.has_unit || props.data?.has_record?.has_extent?.has_unit;
    if (extent) {
        const label = `${extent} ${unit ? t(unit) : ''}`.trim();
        entries.push({
            key: 'extent',
            icon: 'mdi:ruler-square',
            text: label,
            aria: `${t('avefi:Extent')}: ${label}`
        });
    }
  
    const elementType = props.data?.has_record?.element_type;
    if (elementType) {
        entries.push({
            key: 'elementType',
            icon: 'mdi:filmstrip-box-multiple',
            text: [highlightIfActive('item_element_type', elementType, t(elementType))],
            aria: t('tooltip.elementType') + ': ' + t(elementType)
        });
    }
  
    const formatTypes =
      props.data?.has_record?.has_format?.map((f: any) => f?.type).filter(Boolean) ||
      (props.data?.has_record?.has_format?.type ? [props.data.has_record.has_format.type] : []) ||
      (props.data?.has_record?.has_digital_format ? [props.data.has_record.has_digital_format] : []);
    if (formatTypes.length) {
        entries.push({
            key: 'format',
            icon: 'mdi:disc',
            text: formatTypes.map((f: string) => highlightIfActive('has_format_type', f, t(f))),
            aria: t('tooltip.format') + ': ' + formatTypes.map((f: string) => t(f)).join(', ')
        });
    }
  
    const eventTypes = props.data?.has_record?.has_event?.map((e: any) => e?.type).filter(Boolean);
    if (eventTypes?.length) {
        entries.push({
            key: 'eventType',
            icon: 'mdi:calendar-clock',
            text: eventTypes.map((tpe: string) => highlightIfActive('manifestation_event_type', tpe, t(tpe))),
            aria: t('manifestation_event_type') + ': ' + eventTypes.map((e: string) => t(e)).join(', ')
        });
    }
    return entries.map(e => ({ ...e, text: Array.isArray(e.text) ? e.text.map(t => ({ ...t })) : e.text }));
    //    return entries;
}
  
updateActiveFacetsFromUrl();
metaEntries.value = buildMetaEntries();
  
const lastHref = ref(window.location.href);

function updateFromHref() {
    updateActiveFacetsFromUrl();
    metaEntries.value = buildMetaEntries();
}

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
  