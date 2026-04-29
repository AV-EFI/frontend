<template>
    <ul :class="rootClasses" role="list">
        <!-- First row: located_in, years, creators (WORK ONLY) -->
        <li
            v-if="level === 'work' && iconEntries.length > 0"
            :class="primaryRowClasses"
        >
            <template
                v-for="entry in iconEntries.filter(e => ['located_in', 'years', 'creators'].includes(e.key))"
                :key="entry.key">
                <div
                    :class="primaryEntryClasses"
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
                                <span v-if="visibleSegments(entry).length > 0">
                                    <span>{{ visibleSegments(entry)[0]?.text }}</span>
                                    <span v-if="visibleSegments(entry)[0]?.hilite"
                                          :title="`${$t('matchedField')}: ${visibleSegments(entry)[0]?.text}`"
                                          class="badge badge-xs bg-highlight text-white ml-1" />
                                    <span v-if="visibleSegments(entry).length > 1">, </span>
                                </span>

                                <template v-for="(segment, i) in visibleSegments(entry).slice(1)" :key="i + 1">
                                    <br>
                                    <span>{{ segment.text }}</span>
                                    <span v-if="segment.hilite" :title="`${$t('matchedField')}: ${segment.text}`"
                                          class="badge badge-xs bg-highlight text-white ml-1" />
                                    <span v-if="i < visibleSegments(entry).length - 2">, </span>
                                </template>
                            </template>

                            <template v-else>
                                <span :class="singleValueClasses">{{ entry.text }}</span>
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

        <!-- Second row: everything else -->
        <li
            v-if="iconEntries.length > 0"
            :class="secondaryRowClasses"
        >
            <template
                v-for="entry in iconEntries.filter(e => !['located_in', 'years', 'creators'].includes(e.key))"
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
                                    <span :class="segmentClasses(entry)">
                                        {{ segment.text }}
                                    </span>
                                    <span v-if="segment.hilite" :title="`${$t('matchedField')}: ${segment.text}`"
                                          class="badge badge-xs bg-highlight text-white ml-1" />
                                    <span v-if="i < visibleSegments(entry).length - 1">; </span>
                                </template>
                            </template>

                            <template v-else>
                                <span :class="singleValueClasses">
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFacetIcon } from '@/models/interfaces/manual/IFacetIconMapping';
const { t } = useI18n();
const { getLocalizedPlaceLabel } = useLocalizedPlaceLabel();

const props = defineProps<{ data: any, level: 'work' | 'manifestation' | 'item', iconColor: string }>();

const isManifestationLevel = computed(() => props.level === 'manifestation');
const baseEntryClasses = 'max-w-full rounded-md border border-base-300/60 bg-base-100/70 px-2 py-1 shadow-sm shadow-base-300/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1';
const rootClasses = computed(() =>
    isManifestationLevel.value
        ? 'flex flex-row flex-wrap items-center gap-2 text-[0.8rem] leading-4 text-base-content'
        : 'flex flex-col gap-1.5 text-[0.8rem] leading-snug text-base-content'
);
const primaryRowClasses = computed(() =>
    'flex flex-row flex-wrap gap-2 items-start text-left justify-start'
);
const secondaryRowClasses = computed(() =>
    isManifestationLevel.value
        ? 'flex flex-row flex-wrap items-center gap-2 text-left justify-start'
        : 'flex flex-row flex-wrap gap-2 items-start text-left justify-start'
);
const primaryEntryClasses = computed(() =>
    `inline-grid grid-cols-[0.875rem_minmax(0,1fr)] items-start gap-x-1.5 min-w-0 leading-[16px] ${baseEntryClasses}`
);
const entryClasses = computed(() =>
    isManifestationLevel.value
        ? `inline-grid grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-x-1.5 min-w-0 leading-4 ${baseEntryClasses}`
        : `inline-grid grid-cols-[0.875rem_minmax(0,1fr)] items-start gap-x-1.5 min-w-0 leading-[16px] ${baseEntryClasses}`
);
const iconClasses = computed(() =>
    isManifestationLevel.value
        ? ['w-3.5', 'h-3.5', 'shrink-0', props.iconColor]
        : ['w-3.5', 'h-3.5', 'shrink-0', 'mt-0.5', props.iconColor]
);
const primaryTextClasses = computed(() =>
    'min-w-0 inline-flex flex-col items-start gap-1 leading-[16px]'
);
const textClasses = computed(() =>
    isManifestationLevel.value
        ? 'min-w-0 inline-flex flex-col items-start gap-1 leading-4'
        : 'min-w-0 inline-flex flex-col items-start gap-1 leading-[16px]'
);
const primaryValueClasses = computed(() =>
    'min-w-0'
);
const valueBlockClasses = computed(() =>
    isManifestationLevel.value
        ? 'min-w-0 inline-flex flex-wrap items-center gap-x-0.5 whitespace-nowrap leading-4'
        : 'min-w-0 inline-flex flex-wrap items-start gap-x-0.5 leading-[16px]'
);
const singleValueClasses = computed(() =>
    isManifestationLevel.value
        ? 'whitespace-nowrap'
        : 'break-words'
);
const toggleButtonClasses = 'text-xs text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm';
function segmentClasses(entry: { text: any[] }) {
    return {
        'line-clamp-1': visibleSegments(entry).length < 2,
        'whitespace-nowrap': isManifestationLevel.value,
    };
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
function isExpanded(key: string) { return !!expandedMap.value[key]; }
function toggleExpand(key: string) { expandedMap.value[key] = !expandedMap.value[key]; }
function hasOverflow(entry: { key: string; text: any }) { return Array.isArray(entry.text) && entry.text.length > 5; }
function hiddenCount(entry: { key: string; text: any }) { return Array.isArray(entry.text) ? Math.max(0, entry.text.length - 5) : 0; }
function visibleSegments(entry: { key: string; text: any }) {
    if (!Array.isArray(entry.text)) return entry.text;
    if (!hasOverflow(entry)) return entry.text;
    return isExpanded(entry.key) ? entry.text : entry.text.slice(0, 5);
}

const iconFor = (key: string) => getFacetIcon(key, 'tabler-info-circle');

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
    const entries: { key: string; icon: string; text: any; aria: string }[] = [];

    /* ---------- WORK ---------- */
    if (level === 'work') {
        // Produktionsorte
        const workEvents = asArray(d?.has_record?.has_event);
        const locs = workEvents.flatMap((ev: any) => asArray(ev?.located_in));
        const locTexts = locs.map((loc: any) => {
            const label = getLocalizedPlaceLabel(loc) || loc?.same_as?.id || (loc?.same_as?.category ? t(loc.same_as.category) : (loc?.category ? t(loc.category) : ''));
            return { text: label || '', hilite: false };
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
                    key: 'years',
                    icon: iconFor('years'),
                    text: [{ text: label, hilite: false }],
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
                text: creators.map((creator: string) => ({ text: creator, hilite: false })),
                aria: t('creators') + ': ' + creators.join(', ')
            });
        }

        // Form (Gattung)
        const forms = asArray(d?.has_record?.has_form);
        const formLabels = forms.map((f:any) => (typeof f === 'string' ? t(f) : (f?.has_name ? t(f.has_name) : ''))).filter(Boolean);
        if (formLabels.length) {
            entries.push({
                key: 'form',
                icon: iconFor('form'),
                text: formLabels.map((s:string) => ({ text: s, hilite: false })),
                aria: t('has_form') + ': ' + formLabels.join(', ')
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
                    text: [{ text: label, hilite: false }],
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
                text: evTypeLabels.map((tp:string) => ({ text: t(tp), hilite: false })),
                aria: t('has_event') + ': ' + evTypeLabels.map((tp:string) => t(tp)).join(', ')
            });
        }

        // Genre
        const genres = asArray(d?.has_record?.has_genre);
        const gLabels = genres.map((g:any) => (g?.has_name ? t(g.has_name) : t(g))).filter(Boolean);
        if (gLabels.length) {
            entries.push({
                key: 'genre',
                icon: iconFor('genre'),
                text: gLabels.map((x:string) => ({ text: x, hilite: false })),
                aria: t('has_genre') + ': ' + gLabels.join(', ')
            });
        }

        // Subjects
        const subjects = asArray(d?.subjects);
        const sLabels = subjects.map((s:any) => (typeof s === 'string' ? s : (s?.has_name ?? ''))).filter(Boolean);
        if (sLabels.length) {
            entries.push({
                key: 'subject',
                icon: iconFor('subject'),
                text: sLabels.map((x:string) => ({ text: x, hilite: false })),
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
                text: evTypes.map((tp:string) => ({ text: t(tp), hilite: false })),
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
                text: evYears.map((y:string) => ({ text: String(y), hilite: false })),
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
                text: evPlaces.map((p:string) => ({ text: p, hilite: false })),
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
                text: [{ text: t(hasAccessStatus), hilite: false }],
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
                text: formats.map((f:string) => ({ text: t(f), hilite: false })),
                aria: t('has_format') + ': ' + formats.map((f:string) => t(f)).join(', ')
            });
        }

        // Materialart (element_type)
        const elementType = d?.has_record?.element_type;
        if (elementType) {
            entries.push({
                key: 'elementType',
                icon: iconFor('elementType'),
                text: [{ text: t(elementType), hilite: false }],
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
            return (codeLabel + usageLabel).trim();
        }).filter(Boolean);
        if (langsArr.length) {
            entries.push({
                key: 'lang',
                icon: iconFor('lang'),
                text: langsArr.map((x:string) => ({ text: x, hilite: false })),
                aria: t('in_language') + ': ' + langsArr.join(', ')
            });
        }

        // Ton
        const sound = d?.has_record?.has_sound_type || d?.has_sound_type;
        if (sound) {
            const sx = ('' + sound).toLowerCase();
            entries.push({
                key: 'sound',
                icon: sx.includes('silent') ? 'tabler-volume-off' : iconFor('sound'),
                text: [{ text: t(sound), hilite: false }],
                aria: t('has_sound_type') + ': ' + t(sound)
            });
        }

        // Farbe
        const colour = d?.has_record?.has_colour_type || d?.has_colour_type;
        if (colour) {
            entries.push({
                key: 'colour',
                icon: iconFor('colour'),
                text: [{ text: t(colour), hilite: false }],
                aria: t('has_colour_type') + ': ' + t(colour)
            });
        }

        // Abspieldauer
        const rawDuration = d?.has_record?.has_duration?.has_value || d?.has_duration?.has_value;
        if (rawDuration) {
            const dur = formatDuration(rawDuration);
            entries.push({ key: 'duration', icon: iconFor('duration'), text: [{ text: dur, hilite: false }], aria: t('duration') + ': ' + dur });
        }

        // Länge/Größe
        const extentVal = d?.has_record?.has_extent?.has_value || d?.has_extent?.has_value;
        const extentUnit = d?.has_record?.has_extent?.has_unit || d?.has_extent?.has_unit;
        if (extentVal) {
            const label = `${extentVal} ${extentUnit ? t(extentUnit) : ''}`.trim();
            entries.push({ key: 'extent', icon: iconFor('extent'), text: [{ text: label, hilite: false }], aria: t('avefi:Extent') + ': ' + label });
        }

        // BPS (frame rate)
        const fps = d?.has_record?.has_frame_rate || d?.has_frame_rate;
        if (fps) {
            entries.push({
                key: 'fps',
                icon: iconFor('fps'),
                text: [{ text: String(fps), hilite: false }],
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
</script>
