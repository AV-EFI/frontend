<template>
  <ul
    class="flex flex-col gap-y-1 text-[0.75rem] leading-snug text-base-content mt-1"
    role="list"
  >
    <!-- First row: located_in, years, directors_or_editors -->
    <li
      v-if="level == 'work' && iconEntries.length > 0"
      class="flex flex-row flex-wrap gap-x-3 items-start text-left justify-start"
    >
      <template
        v-for="entry in iconEntries.filter(e => ['located_in', 'years', 'directors_or_editors'].includes(e.key))"
        :key="entry.key"
      >
        <div
          class="flex min-w-[6rem] gap-1.5 items-start"
          :aria-label="entry.aria"
          :title="entry.aria"
        >
          <div class="flex flex-col items-start">
            <Icon
              :name="entry.icon"
              class="w-[0.85rem] h-[0.85rem] shrink-0 my-auto"
              :class="[iconColor]"
              aria-hidden="true"
            />
          </div>

          <span class="inline-block flex-wrap">
            <template v-if="Array.isArray(entry.text)">
              <!-- use first + rest (with line breaks) but respect expansion -->
              <span v-if="visibleSegments(entry).length > 0">
                <span>{{ visibleSegments(entry)[0]?.text }}</span>
                <span
                  v-if="visibleSegments(entry)[0]?.hilite"
                  :title="`${$t('matchedField')}: ${visibleSegments(entry)[0]?.text}`"
                  class="badge badge-xs bg-highlight text-white ml-1"
                />
                <span v-if="visibleSegments(entry).length > 1">, </span>
              </span>

              <template
                v-for="(segment, i) in visibleSegments(entry).slice(1)"
                :key="i + 1"
              >
                <br>
                <span>{{ segment.text }}</span>
                <span
                  v-if="segment.hilite"
                  :title="`${$t('matchedField')}: ${segment.text}`"
                  class="badge badge-xs bg-highlight text-white ml-1"
                />
                <span v-if="i < visibleSegments(entry).length - 2">, </span>
              </template>

              <!-- toggle -->
              <button
                v-if="hasOverflow(entry)"
                type="button"
                class="badge badge-accent badge-xs text-xs ml-1"
                :aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
                :aria-label="isExpanded(entry.key) ? $t('showLess') : `${$t('showMore')} (+${hiddenCount(entry)})`"
                @click="toggleExpand(entry.key)"
              >
                {{ isExpanded(entry.key) ? $t('showLess') : `${$t('showMore')} (+${hiddenCount(entry)})` }}
              </button>
            </template>

            <template v-else>
              <span>{{ entry.text }}</span>
            </template>
          </span>
        </div>
      </template>
    </li>

    <!-- Second row: all other entries -->
    <li
      v-if="iconEntries.length > 0"
      class="flex flex-row flex-wrap gap-x-3 items-start text-left justify-start"
    >
      <template
        v-for="entry in iconEntries.filter(e => !['located_in', 'years', 'directors_or_editors'].includes(e.key))"
        :key="entry.key"
      >
        <div
          class="flex flex-row items-start gap-1.5 min-w-[6rem]"
          :aria-label="entry.aria"
          :title="entry.aria"
        >
          <Icon
            :name="entry.icon"
            class="w-[0.85rem] h-[0.85rem] shrink-0"
            :class="[iconColor]"
            aria-hidden="true"
          />
          <span class="inline-block flex-wrap">
            <template v-if="Array.isArray(entry.text)">
              <template
                v-for="(segment, i) in visibleSegments(entry)"
                :key="i"
              >
                <span :class="{'line-clamp-1': visibleSegments(entry).length < 2}">
                  {{ segment.text }}
                </span>
                <span
                  v-if="segment.hilite"
                  :title="`${$t('matchedField')}: ${segment.text}`"
                  class="badge badge-xs bg-highlight text-white ml-1"
                />
                <span v-if="i < visibleSegments(entry).length - 1">, </span>
              </template>

              <!-- toggle -->
              <button
                v-if="hasOverflow(entry)"
                type="button"
                class="badge badge-neutral badge-outline text-white badge-sm text-xs ml-1"
                :aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
                :aria-label="isExpanded(entry.key) ? $t('showLess') : `${$t('showMore')} (+${hiddenCount(entry)})`"
                @click="toggleExpand(entry.key)"
              >
                {{ isExpanded(entry.key) ? $t('showLess') : `${$t('showMore')} (+${hiddenCount(entry)})` }}
              </button>
            </template>

            <template v-else>
              <span class="line-clamp-1">
                {{ entry.text }}
              </span>
            </template>
          </span>
        </div>
      </template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// Note: expects i18n keys 'showMore' and 'showLess' to exist.
const props = defineProps<{ data: any, level: 'work' | 'manifestation' | 'item', iconColor: string }>();

// Track expanded state per entry key
const expandedMap = ref<Record<string, boolean>>({});

function isExpanded(key: string) {
    return !!expandedMap.value[key];
}
function toggleExpand(key: string) {
    expandedMap.value[key] = !expandedMap.value[key];
}
function hasOverflow(entry: { key: string; text: any }) {
    return Array.isArray(entry.text) && entry.text.length > 5;
}
function hiddenCount(entry: { key: string; text: any }) {
    if (!Array.isArray(entry.text)) return 0;
    return Math.max(0, entry.text.length - 5);
}
function visibleSegments(entry: { key: string; text: any }) {
    if (!Array.isArray(entry.text)) return entry.text;
    if (!hasOverflow(entry)) return entry.text;
    return isExpanded(entry.key) ? entry.text : entry.text.slice(0, 5);
}

// Only use tabler icons
const ICONS = {
    lang: 'tabler-language',
    colour: 'tabler-palette',
    sound: 'tabler-volume',
    silent: 'tabler-volume-off',
    duration: 'tabler-clock-hour-3',
    extent: 'tabler-ruler',
    elementType: 'tabler-movie',
    format: 'tabler-disc',
    eventType: 'tabler-calendar-event',
    genre: 'tabler-category',
    subject: 'tabler-tag',
    issuer: 'tabler-building',
    handle: 'tabler-hash',
    directors: 'tabler-chair-director',
    cast: 'tabler-users',
    year: 'tabler-calendar',
    production: 'tabler-building-factory',
    default: 'tabler-info-circle',
};

function formatDuration(has_value: string): string {
    try {
        const parts = has_value.replace(/^PT/, '').replace(/H/, ':').replace(/M/, ':').replace(/S/, '').split(':');
        return parts.map(p => p.padStart(2, '0')).join(':');
    } catch {
        return has_value;
    }
}

function buildIconEntries() {
    const entries: { key: string; icon: string; text: any; aria: string }[] = [];
    const d = props.data;
    const level = props.level;

    // Directors/Editors
    if (d?.directors_or_editors) {
        const directors = Array.isArray(d.directors_or_editors) ? d.directors_or_editors : [d.directors_or_editors];
        entries.push({
            key: 'directors_or_editors',
            icon: ICONS.directors,
            text: directors.map((dir: string) => ({ text: dir, hilite: false })),
            aria: t('directors_or_editors') + ': ' + directors.join(', ')
        });
    }

    // Castmembers
    if (d?.castmembers) {
        const cast = Array.isArray(d.castmembers) ? d.castmembers : [d.castmembers];
        entries.push({
            key: 'castmembers',
            icon: ICONS.cast,
            text: cast.map((c: string) => ({ text: c, hilite: false })),
            aria: t('castmembers') + ': ' + cast.join(', ')
        });
    }

    // Years or production_in_year
    if (d?.years) {
        const years = Array.isArray(d.years) ? d.years : [d.years];
        entries.push({
            key: 'years',
            icon: ICONS.year,
            text: years.map((y: string) => ({ text: y, hilite: false })),
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
                key: 'production_in_year',
                icon: ICONS.year,
                text: [{ text: label, hilite: false }],
                aria: t('productionyears') + ': ' + label
            });
        }
    }

    // Language (item)
    if (level === 'item') {
        const inLang = d?.has_record?.in_language;
        const arr = Array.isArray(inLang) ? inLang : (inLang ? [inLang] : []);
        const langs = arr.map((l: any) => {
            const code = l?.code || '';
            const usage = l?.usage;
            const codeLabel = code ? t(code) : '';
            const usageLabel = Array.isArray(usage) && usage.length ? ` (${usage.map((u: string) => t(u)).join(', ')})` : (usage ? ` (${t(usage)})` : '');
            return { text: (codeLabel + usageLabel).trim(), hilite: false };
        }).filter(x => x.text);
        if (langs.length) {
            entries.push({
                key: 'lang',
                icon: ICONS.lang,
                text: langs,
                aria: t('in_language') + ': ' + langs.map(l => l.text).join(', ')
            });
        }
    }

    // Colour
    const colour =
    d?.has_record?.has_colour_type ||
    d?.has_colour_type;
    if (colour) {
        entries.push({
            key: 'colour',
            icon: ICONS.colour,
            text: [{ text: t(colour), hilite: false }],
            aria: t('has_colour_type') + ': ' + t(colour)
        });
    }

    // Sound
    const sound =
    d?.has_record?.has_sound_type ||
    d?.has_sound_type;
    if (sound) {
        const sx = ('' + sound).toLowerCase();
        entries.push({
            key: 'sound',
            icon: sx.includes('silent') ? ICONS.silent : ICONS.sound,
            text: [{ text: t(sound), hilite: false }],
            aria: t('has_sound_type') + ': ' + t(sound)
        });
    }

    // Duration
    const rawDuration = d?.has_record?.has_duration?.has_value || d?.has_duration?.has_value;
    if (rawDuration) {
        const dur = formatDuration(rawDuration);
        entries.push({
            key: 'duration',
            icon: ICONS.duration,
            text: [{ text: dur, hilite: false }],
            aria: t('duration') + ': ' + dur
        });
    }

    // Extent
    const extentVal = d?.has_record?.has_extent?.has_value || d?.has_extent?.has_value;
    const extentUnit = d?.has_record?.has_extent?.has_unit || d?.has_extent?.has_unit;
    if (extentVal) {
        const label = `${extentVal} ${extentUnit ? t(extentUnit) : ''}`.trim();
        entries.push({
            key: 'extent',
            icon: ICONS.extent,
            text: [{ text: label, hilite: false }],
            aria: t('avefi:Extent') + ': ' + label
        });
    }

    // Element type (item)
    if (level === 'item') {
        const elementType = d?.has_record?.element_type;
        if (elementType) {
            entries.push({
                key: 'elementType',
                icon: ICONS.elementType,
                text: [{ text: t(elementType), hilite: false }],
                aria: t('item_element_type') + ': ' + t(elementType)
            });
        }
    }

    // Format types (item)
    if (level === 'item') {
        const hasFormat = d?.has_record?.has_format;
        const formats = Array.isArray(hasFormat) ? hasFormat : (hasFormat ? [hasFormat] : []);
        const formatTypes = formats.map((f: any) => f?.type).filter(Boolean);
        if (formatTypes.length) {
            entries.push({
                key: 'format',
                icon: ICONS.format,
                text: formatTypes.map((f: string) => ({ text: t(f), hilite: false })),
                aria: t('has_format') + ': ' + formatTypes.map((f: string) => t(f)).join(', ')
            });
        }
    }

    // Event types (manifestation)
    if (level === 'manifestation') {
        const hasEvent = d?.has_record?.has_event;
        const events = Array.isArray(hasEvent) ? hasEvent : (hasEvent ? [hasEvent] : []);
        const eventTypes = events.map((e: any) => e?.type).filter(Boolean);
        if (eventTypes.length) {
            entries.push({
                key: 'eventType',
                icon: ICONS.eventType,
                text: eventTypes.map((tp: string) => ({ text: t(tp), hilite: false })),
                aria: t('manifestation_event_type') + ': ' + eventTypes.map((e: string) => t(e)).join(', ')
            });
        }
    }

    // Genre (work)
    if (level === 'work') {
        const genres = Array.isArray(d?.has_record?.has_genre)
            ? d.has_record.has_genre
            : (d?.has_record?.has_genre ? [d.has_record.has_genre] : []);
        if (genres.length) {
            entries.push({
                key: 'genre',
                icon: ICONS.genre,
                text: genres.map((g: any) => ({ text: g?.has_name ? t(g.has_name) : t(g), hilite: false })),
                aria: t('has_genre') + ': ' + genres.map((g: any) => g?.has_name ? t(g.has_name) : t(g)).join(', ')
            });
        }
    }

    // Subjects (work)
    if (level === 'work') {
        const subjects = Array.isArray(d?.subjects) ? d.subjects : (d?.subjects ? [d.subjects] : []);
        if (subjects.length) {
            entries.push({
                key: 'subject',
                icon: ICONS.subject,
                text: subjects.map((s: any) => ({ text: typeof s === 'string' ? s : (s?.has_name ?? ''), hilite: false })).filter(s => s.text),
                aria: t('subjects') + ': ' + subjects.map((s: any) => (typeof s === 'string' ? s : (s?.has_name ?? ''))).filter(Boolean).join(', ')
            });
        }
    }

    // Issuer (manifestation)
    if (level === 'manifestation') {
        const issuer = d?.has_record?.described_by?.has_issuer_name;
        if (issuer) {
            entries.push({
                key: 'issuer',
                icon: ICONS.issuer,
                text: [{ text: issuer, hilite: false }],
                aria: t('has_issuer_name') + ': ' + issuer
            });
        }
    }

    // Located_in (work)
    if (level === 'work') {
        const workEvents = Array.isArray(d?.has_record?.has_event) ? d.has_record.has_event : (d?.has_record?.has_event ? [d.has_record.has_event] : []);
        const locs = workEvents.flatMap((ev: any) => {
            const li = ev?.located_in;
            return Array.isArray(li) ? li : (li ? [li] : []);
        });
        const locTexts = locs.map((loc: any) => {
            if (!loc) return { text: '', hilite: false };
            const label = loc.has_name
                ? t(loc.has_name)
                : (loc.same_as?.id || (loc.same_as?.category ? t(loc.same_as.category) : (loc.category ? t(loc.category) : '')));
            return { text: label || '', hilite: false };
        }).filter(l => l.text);
        if (locTexts.length) {
            entries.push({
                key: 'located_in',
                icon: 'tabler-map-pin',
                text: locTexts,
                aria: t('located_in') + ': ' + locTexts.map(l => l.text).join(', ')
            });
        }
    }

    // Order by level
    let orderArr: string[] = [];
    if (level === 'work') {
        orderArr = [
            'handle',
            'located_in',
            'years',
            'directors_or_editors',
            'genre',
            'subject'
        ];
    } else if (level === 'manifestation') {
        orderArr = [
            'handle',
            'issuer',
            'lang',
            'sound',
            'colour',
            'duration',
            'extent'
        ];
    } else if (level === 'item') {
        orderArr = [
            'handle',
            'lang',
            'sound',
            'colour',
            'duration',
            'extent',
            'elementType',
            'format'
        ];
    }

    const sorted = [
        ...orderArr.map(key => entries.find(e => e.key === key)).filter(Boolean) as any[],
        ...entries.filter(e => !orderArr.includes(e.key))
    ];
    return sorted;
}

const iconEntries = computed(() => buildIconEntries());
</script>
