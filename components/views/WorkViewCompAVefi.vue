<template>
    <div class="flex flex-row gap-6 relative">
        <!-- Desktop sidebar (left, slide-in/out, relative) -->
        <button class="hidden lg:block absolute -top-4 z-10" @click="desktopDrawerOpen = !desktopDrawerOpen"
                :class="desktopDrawerOpen ? 'left-0' : 'left-5'" :title="$t('toggleNavigation')"
                :aria-label="$t('toggleNavigation')">
            <div class="btn btn-sm btn-circle">
                <Icon :name="desktopDrawerOpen ? 'tabler-caret-left' : 'tabler-caret-right'" aria-hidden="true" />
            </div>
        </button>
        <transition name="slide-sidebar">
            <aside v-if="desktopDrawerOpen"
                   class="hidden lg:block w-72 shrink-0 order-1 self-start bg-base-200 z-0 mt-4 py-4">
                <span class="font-semibold p-2">{{ $t('workNavigation') }}</span>
                <nav :aria-label="$t('workNavigation')" class="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <ul class="menu bg-base-200 rounded-box">
                        <li>
                            <button type="button" @click="scrollToId('work-events')" class="cursor-pointer text-left"
                                    :class="{ 'active': activeSection === 'work-events' }"
                                    :aria-current="activeSection === 'work-events' ? 'location' : undefined">
                                <span v-if="normalizedEvents?.length > 0">
                                    {{ $t(normalizedEvents[0]?.raw?.category) }}
                                </span>
                                <span v-else>
                                    {{ $t('workEvents') }}
                                </span>
                            </button>
                        </li>
                        <li>
                            <button type="button" @click="scrollToId('manifestations')" class="cursor-pointer text-left"
                                    :class="{ 'active': activeSection === 'manifestations' }"
                                    :aria-current="activeSection === 'manifestations' ? 'location' : undefined">
                                {{ $t('manifestations') }}
                            </button>
                            <ul>
                                <li v-for="(mf, idx) in filteredManifestations" :key="idx">
                                    <button type="button" @click="scrollToId(getManifestationAnchorId(mf, idx))" class="cursor-pointer pl-4 text-left w-full"
                                            :class="{ 'active': activeSection === getManifestationAnchorId(mf, idx) }"
                                            :aria-current="activeSection === getManifestationAnchorId(mf, idx) ? 'location' : undefined">
                                        <span class="text-ellipsis" v-if="mf.has_record.has_event?.[0]">
                                            {{ $t(mf.has_record?.has_event?.[0]?.type ?? '') !==
                                                mf.has_record?.has_event?.[0]?.type
                                                ? $t(mf.has_record?.has_event?.[0]?.type ?? '')
                                                : (mf.has_record?.has_event?.[0]?.type || `${$t('manifestation')} ${idx +
                                                    1}`) }}
                                        </span>
                                        <span v-else>
                                            {{ mf.has_record?.has_primary_title?.has_name ?? $t('manifestation') + ' ' +
                                                (idx + 1) }}
                                        </span>
                                        <span class="badge" :aria-label="`${mf.items?.length || 0} ${$t('items')}`">
                                            {{ mf.items?.length }}
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>
        </transition>
        <!-- Mobile drawer for tree-view (left) -->
        <div class="drawer fixed inset-0 z-50 lg:hidden order-1" v-if="drawerOpen">
            <div class="drawer-overlay bg-black bg-opacity-40" @click="drawerOpen = false"></div>

            <div class="drawer-side fixed left-0 top-0 w-72 h-full bg-base-200 shadow-xl overflow-y-auto">
                <button type="button" class="btn btn-sm btn-circle absolute top-4 right-4" @click="drawerOpen = false"
                        :aria-label="`${$t('close')} ${$t('workNavigation')}`"
                        :title="`${$t('close')} ${$t('workNavigation')}`">
                    <Icon name="tabler-x" aria-hidden="true" />
                </button>
                <nav id="work-navigation-drawer" :aria-label="$t('workNavigation')" class="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <ul class="menu bg-base-200 rounded-box p-2">
                        <li>
                            <button type="button" @click="scrollToId('work-events'); drawerOpen = false"
                                    :class="{ 'active': activeSection === 'work-events' }" class="cursor-pointer text-left"
                                    :aria-current="activeSection === 'work-events' ? 'location' : undefined">
                                {{ $t('workEvents') }}
                            </button>
                        </li>

                        <li>
                            <button type="button" @click="scrollToId('manifestations'); drawerOpen = false"
                                    :class="{ 'active': activeSection === 'manifestations' }" class="cursor-pointer text-left"
                                    :aria-current="activeSection === 'manifestations' ? 'location' : undefined">
                                {{ $t('manifestations') }}
                            </button>
                            <ul>
                                <li v-for="(mf, idx) in filteredManifestations" :key="idx">
                                    <button type="button" @click="scrollToId(getManifestationAnchorId(mf, idx)); drawerOpen = false"
                                            :class="{ 'active': activeSection === getManifestationAnchorId(mf, idx) }"
                                            :aria-current="activeSection === getManifestationAnchorId(mf, idx) ? 'location' : undefined"
                                            class="cursor-pointer pl-2 text-left w-full">
                                        {{ mf.has_primary_title?.has_name ?? $t('manifestation') + ' ' + (idx + 1) }}
                                    </button>

                                    <ul v-if="Array.isArray(mf.items)">
                                        <li v-for="(item, iidx) in mf.items" :key="iidx">
                                            <button type="button" @click="scrollToId(getItemAnchorId(item, idx, iidx)); drawerOpen = false"
                                                    :class="{ 'active': activeSection === getItemAnchorId(item, idx, iidx) }"
                                                    :aria-current="activeSection === getItemAnchorId(item, idx, iidx) ? 'location' : undefined"
                                                    class="cursor-pointer pl-8 text-left w-full">
                                                {{ item.has_name ?? $t('item') + ' ' + (iidx + 1) }}
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li v-for="(event, eidx) in mir?.has_event || []" :key="eidx">
                            <button type="button" @click="scrollToId(`event-${eidx}`); drawerOpen = false"
                                    :class="{ 'active': activeSection === `event-${eidx}` }" class="cursor-pointer pl-4 text-left w-full"
                                    :aria-current="activeSection === `event-${eidx}` ? 'location' : undefined">
                                {{ $t('event') }} {{ eidx + 1 }}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Mobile drawer button -->
        <div class="fixed top-4 left-4 z-20 lg:hidden order-0">
            <button class="btn btn-primary btn-circle" @click="drawerOpen = true"
                    :aria-label="`${$t('openMenu')}: ${$t('workNavigation')}`"
                    :aria-controls="'work-navigation-drawer'"
                    :aria-expanded="drawerOpen ? 'true' : 'false'">
                <Icon name="tabler-list-tree" aria-hidden="true" />
            </button>
        </div>

        <!-- Main content (right) -->
        <div class="flex-1 min-w-0 order-2">
            <section v-if="mir"
                     :id="dataObject?.compound_record?._source?.handle || undefined"
                     class="border-l-2 border-work px-2"
                     :aria-labelledby="'work-details-heading'">
                <h2 id="work-details-heading" class="sr-only">
                    {{ `${$t('detailsFor')} ${mir?.has_primary_title?.has_name ?? ''}` }}
                </h2>
                <!-- MOBILE-ONLY TOGGLE (does not affect desktop) -->
                <div class="md:hidden mb-2">
                    <button type="button" class="btn btn-lg btn-outline w-full justify-between"
                            :aria-expanded="mirExpanded ? 'true' : 'false'" :aria-controls="mirPanelId"
                            @click="mirExpanded = !mirExpanded">
                        <span class="truncate text-sm">
                            {{ $t('detailsFor') }} {{ mir?.has_primary_title?.has_name ?? '' }}
                        </span>
                        <span v-if="mirExpanded" :title="$t('collapse') || 'Collapse'">
                            <Icon name="tabler-chevron-up" aria-hidden="true" />
                        </span>
                        <span v-else :title="$t('expand') || 'Expand'">
                            <Icon name="tabler-chevron-down" aria-hidden="true" />
                        </span>
                    </button>
                </div>

                <!-- ONLY THIS CONTENT COLLAPSES ON MOBILE -->
                <div :id="mirPanelId" v-show="!isMobile || mirExpanded">
                    <!-- ✅ REAL DOM ANCHOR (template slot cannot carry an id) -->
                    <NuxtLayout name="partial-grid-2-1-no-heading">
                        <template #left>
                            <div class="w-full col-span-full">
                                <!-- 01–04 + 06–09: handled inside TopLevelComp -->
                                <DetailWorkVariantTopLevelComp v-model="mir" id="work-events"
                                                               :handle="dataObject?.compound_record?._source?.handle"
                                                               :es-timestamp="dataObject?.compound_record?._source?.['@timestamp']"
                                                               :order-key="'08-06-2025'" :hide-second-handle="true"
                                                               :swap-years-and-places="true" />

                                <!-- 05 Produktions-Events -->
                                <DetailHasEventComp v-if="Array.isArray(mir?.has_event) && mir.has_event.length > 0"
                                                    v-model="mir.has_event"
                                                    :event-ids="mir.has_event.map((_, idx) => `event-${idx}`)" />
                            </div>
                        </template>

                        <template #right>
                            <!-- 10 Genre -->
                            <DetailKeyActionRowsComp v-if="Array.isArray(mir?.has_genre) && mir.has_genre.length > 0"
                                                     class="col-span-full mb-2" :key-label="$t('avefi:Genre')" :values="mir.has_genre"
                                                     same-as-type="genre" :show-count="true" :initial-visible="6" />

                            <!-- 11 Schlagwort -->
                            <DetailKeyActionRowsComp
                                v-if="Array.isArray(mir?.has_subject) && mir.has_subject.length > 0"
                                class="col-span-full mt-1" :key-label="$t('avefi:Subject')" :values="mir.has_subject"
                                same-as-type="subject" :show-count="true" :initial-visible="8" />
                        </template>
                    </NuxtLayout>
                </div>
            </section>

            <div v-else>
                <pre>{{ mir }}</pre>
            </div>

            <!-- Manifestations block -->
            <section v-if="manifestations.length > 0" id="manifestations" :aria-labelledby="'manifestations-heading'">
                <div class="mt-4 ml-2">
                    <hr class="my-2 col-span-full" />
                    <h3 id="manifestations-heading" class="relative font-bold text-sm col-span-full text-primary-800 dark:text-primary-100 mb-1">
                        {{ $t("manifestations") }}
                        <GlobalTooltipInfo :text="$t('tooltip.manifestation')" />
                    </h3>

                    <!-- Native dropdown for filter -->
                    <div class="relative w-72 mb-2">
                        <!-- Compact dropdown for filter -->
                        <div class="relative w-72 mb-2" ref="filterDropdownRef">
                            <button
                                type="button"
                                class="btn btn-outline w-full justify-between"
                                :aria-label="$t('filterItemsAndManifestations')"
                                :aria-expanded="filterDropdownOpen ? 'true' : 'false'"
                                aria-haspopup="listbox"
                                @click="filterDropdownOpen = !filterDropdownOpen"
                            >
                                <span class="truncate">
                                    {{
                                        searchQuery.length > 0
                                            ? `${$t('filterItemsAndManifestations')} (${searchQuery.length})`
                                            : $t('filterItemsAndManifestations')
                                    }}
                                </span>
                                <Icon
                                    :name="filterDropdownOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'"
                                    aria-hidden="true"
                                />
                            </button>

                            <div
                                v-if="filterDropdownOpen"
                                class="absolute z-20 mt-1 w-full rounded-md border border-base-300 bg-base-100 shadow-lg"
                            >
                                <div class="max-h-72 flex flex-col overflow-auto p-2">
                                    <label
                                        v-for="suggestion in suggestionsForManifestations"
                                        :key="suggestion"
                                        class="label cursor-pointer justify-start gap-3 py-2"
                                    >
                                        <input
                                            type="checkbox"
                                            class="checkbox checkbox-sm"
                                            :checked="searchQuery.includes(suggestion)"
                                            @change="toggleSuggestion(suggestion)"
                                        />
                                        <span class="label-text">
                                            {{ $t(suggestion) !== suggestion ? $t(suggestion) : suggestion }}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="searchQuery.length > 0" class="flex flex-wrap gap-1 mb-2">
                        <span v-for="selected in searchQuery" :key="selected" class="badge badge-outline gap-1">
                            {{ $t(selected) !== selected ? $t(selected) : selected }}
                            <button
                                type="button"
                                class="btn btn-ghost btn-xs px-1 min-h-0 h-auto"
                                :aria-label="`${$t('remove') || 'Remove'}: ${selected}`"
                                @click="removeSuggestion(selected)"
                            >
                                &times;
                            </button>
                        </span>
                    </div>
                </div>

                <ClientOnly>
                    <div v-if="loading" class="flex justify-center items-center min-h-[120px]">
                        <span class="loading loading-spinner loading-lg text-primary" />
                    </div>
                    <div
                        v-else-if="filteredManifestations.length === 0"
                        class="alert alert-info mt-3"
                        role="status"
                        :aria-label="$t('noResults')"
                    >
                        <div>
                            <p class="font-semibold">{{ $t('noResults') }}</p>
                            <p class="text-sm">{{ $t('tryClearingFiltersOrQuery') }}</p>
                        </div>
                    </div>
                    <DetailManifestationListComp v-else v-model="filteredManifestations" />
                </ClientOnly>
            </section>

            <div v-else-if="parts">
                <ViewsWorkViewCompParts class="mt-4" :parts="parts"
                                        :handle="dataObject?.compound_record?._source?.handle" />
            </div>

            <div v-else class="ml-2 alert alert-warning alert-outline text-white max-w-96 mt-4" role="alert"
                 :aria-label="$t('noManifestations')">
                <MicroIconTextComp icon-name="tabler:mood-empty" text="noManifestations" />
            </div>

            <!-- 12 Letzte Bearbeitung -->
            <div v-if="dataObject?._source?.['@timestamp']" id="last-edit" class="w-full mt-4 justify-center items-center">
                <DetailKeyValueComp class="col-span-full mx-auto" keytxt="lastedit" :clip="false"
                                    :valtxt="formatTimestamp(dataObject._source['@timestamp'])" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import type { IAVefiWorkVariant as WorkVariant } from "~/models/interfaces/generated/IefiWorkVariant";
import { useFormKitLoader } from '~/composables/useFormKitLoader';

const { ensureFormKitReady } = useFormKitLoader();
const { t } = useI18n();

await ensureFormKitReady();

// Enable hash navigation for manifestations and items
useHash();

type Manifestation = any; // keep as-is if you already have a real type elsewhere

const desktopDrawerOpen = ref(true);
const props = defineProps({
    handle: {
        type: String,
        default: '',
    },
    requestedHandle: {
        type: String,
        default: '',
    },
});

const dataJson = defineModel({ type: Object, required: true });

// Defensive parse
let dataObject: any = {};
try {
    dataObject = dataJson.value ?? {};
} catch {
    dataObject = {};
}

// WorkVariant (optional)
const mir = (dataObject?.compound_record?._source?.has_record ?? null) as WorkVariant | null;
const parts = (dataObject?.compound_record?._source?.parts ?? null) as WorkVariant | null;

// Manifestations (optional)
const manifestations = ref<Manifestation[]>(
    Array.isArray(dataObject?.compound_record?._source?.manifestations)
        ? dataObject.compound_record._source.manifestations
        : []
);

// --- Dynamic search state (manifestation / item filter) ---
const searchQuery = ref<string[]>([]);
const filterDropdownOpen = ref(false);
const filterDropdownRef = ref<HTMLElement | null>(null);
const loading = ref(false);
let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

function triggerLoading() {
    loading.value = true;

    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
    }

    loadingTimeout = setTimeout(() => {
        loading.value = false;
        loadingTimeout = null;
    }, 600);
}

function onSearchInput(val: any) {
    searchQuery.value = Array.isArray(val) ? val : val ? [val] : [];
    triggerLoading();
}

function toggleSuggestion(suggestion: string) {
    const next = searchQuery.value.includes(suggestion)
        ? searchQuery.value.filter(value => value !== suggestion)
        : [...searchQuery.value, suggestion];

    onSearchInput(next);
}

function removeSuggestion(suggestion: string) {
    searchQuery.value = searchQuery.value.filter(value => value !== suggestion);
    onSearchInput(searchQuery.value);
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!filterDropdownRef.value || !target) return;

    if (!filterDropdownRef.value.contains(target)) {
        filterDropdownOpen.value = false;
    }
}

// --- SEARCH / FACET WHITELIST ---
// Important: paths are relative to the current object passed in.
// manifestationLevelValues(mf) receives a manifestation object.
// itemLevelValues(item) receives an item object.

const MANIFESTATION_SEARCH_FIELDS = [
    "has_record.has_event.type",
    "has_event.type",
    "has_record.described_by.has_issuer_name",
    "has_record.is_manifestation_of",
];

const ITEM_SEARCH_FIELDS = [
    "has_record.has_access_status",
    "has_record.has_format.type",
    "has_record.has_colour_type",
    "has_record.has_sound_type",
    "has_record.in_language.code",
    "has_record.element_type",
];

function get(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const parts = path.split(".");
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
        if (current == null) return undefined;
        const part = parts[i];

        if (Array.isArray(current)) {
            const rest = parts.slice(i).join(".");
            return current.flatMap((el) => get(el, rest));
        }
        current = current[part];
    }
    return current;
}

function pushValue(arr: string[], v: any) {
    if (v === null || v === undefined) return;

    if (Array.isArray(v)) {
        for (const x of v) pushValue(arr, x);
    } else if (typeof v === "object") {
        if (typeof v.code === "string" && v.code) arr.push(v.code);
        if (typeof v.type === "string" && v.type) arr.push(v.type);
    } else {
        const s = String(v);
        if (s !== "") arr.push(s);
    }
}

function dedupeValues(values: string[]) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of values) {
        const trimmed = s.trim();
        if (!trimmed) continue;
        const k = trimmed.toLowerCase();
        if (!seen.has(k)) {
            seen.add(k);
            out.push(trimmed);
        }
    }
    return out;
}

function manifestationLevelValues(mf: any): string[] {
    const vals: string[] = [];
    for (const p of MANIFESTATION_SEARCH_FIELDS) {
        pushValue(vals, get(mf, p));
    }
    return dedupeValues(vals);
}

function itemLevelValues(item: any): string[] {
    const vals: string[] = [];
    for (const p of ITEM_SEARCH_FIELDS) {
        pushValue(vals, get(item, p));
    }
    return dedupeValues(vals);
}

function valuesForManifestation(mf: any): string[] {
    const manifestationValues = manifestationLevelValues(mf);
    const itemValues = (Array.isArray(mf?.items) ? mf.items : []).flatMap((item: any) => itemLevelValues(item));
    return dedupeValues([...manifestationValues, ...itemValues]);
}

function queryScope(q: string) {
    let matchesManifestation = false;
    let matchesItem = false;

    for (const mf of manifestations.value) {
        if (!matchesManifestation && manifestationLevelValues(mf).includes(q)) {
            matchesManifestation = true;
        }

        if (!matchesItem) {
            const items = Array.isArray(mf?.items) ? mf.items : [];
            if (items.some((item: any) => itemLevelValues(item).includes(q))) {
                matchesItem = true;
            }
        }

        if (matchesManifestation && matchesItem) break;
    }

    return {
        manifestation: matchesManifestation,
        item: matchesItem,
    };
}

function translatedFacetLabel(value: string) {
    return t(value) !== value ? t(value) : value;
}

const suggestionsForManifestations = computed(() => {
    const set = new Set<string>();

    for (const mf of manifestations.value) {
        for (const v of valuesForManifestation(mf)) {
            const trimmed = v.trim();
            if (!trimmed) continue;
            set.add(trimmed);
            if (set.size >= 100) break;
        }
        if (set.size >= 100) break;
    }

    return Array.from(set)
        .sort((a, b) =>
            translatedFacetLabel(a).localeCompare(
                translatedFacetLabel(b),
                undefined,
                { sensitivity: "base" }
            )
        )
        .slice(0, 100);
});

const filteredManifestations = computed<any[]>(() => {
    const selected = searchQuery.value;

    if (!Array.isArray(selected) || selected.length === 0) {
        return manifestations.value;
    }

    const manifestationQueries = selected.filter((q) => {
        const scope = queryScope(q);
        return scope.manifestation;
    });

    const itemQueries = selected.filter((q) => {
        const scope = queryScope(q);
        return scope.item && !scope.manifestation;
    });

    return manifestations.value
        .map((mf) => {
            const manifestationValues = manifestationLevelValues(mf);
            const items = Array.isArray(mf.items) ? mf.items : [];
            const hasManifestationMatch = manifestationQueries.every((q) =>
                manifestationValues.includes(q)
            );

            if (!hasManifestationMatch) {
                return null;
            }

            if (itemQueries.length === 0) {
                return { ...mf, items };
            }

            const filteredItems = items.filter((item: any) => {
                const itemValues = itemLevelValues(item);
                return itemQueries.every((q) => itemValues.includes(q));
            });

            if (filteredItems.length > 0) {
                return { ...mf, items: filteredItems };
            }

            return null;
        })
        .filter((mf) => mf !== null) as any[];
});

// helpers
function formatTimestamp(ts: any): string {
    try {
        const d = new Date(ts);
        return isNaN(d.getTime()) ? "" : d.toLocaleString("de-DE");
    } catch {
        return "";
    }
}

// Mobile collapse state
const mirExpanded = ref(false);
const mirPanelId = "mir-panel";

// Make isMobile reactive
const isMobile = ref(false);
let mediaQuery: MediaQueryList | null = null;
let mediaListener: ((e: MediaQueryListEvent) => void) | null = null;

// Drawer + active section
const drawerOpen = ref(false);
const activeSection = ref("");

// Build the exact list of IDs that actually exist in the DOM (based on FILTERED data)
const sectionIds = computed<string[]>(() => {
    const ids: string[] = [];

    ids.push("work-events");
    ids.push("manifestations");

    for (let idx = 0; idx < filteredManifestations.value.length; idx++) {
        const mf = filteredManifestations.value[idx];
        ids.push(getManifestationAnchorId(mf, idx));

        const items = Array.isArray(mf?.items) ? mf.items : [];
        for (let iidx = 0; iidx < items.length; iidx++) {
            ids.push(getItemAnchorId(items[iidx], idx, iidx));
        }
    }

    const events = Array.isArray(mir?.has_event) ? (mir as any).has_event : [];
    for (let eidx = 0; eidx < events.length; eidx++) {
        ids.push(`event-${eidx}`);
    }

    return ids;
});

function scrollToId(id: string) {
    if (!import.meta.client) return;

    const nextUrl = `${window.location.pathname}${window.location.search}#${id}`;
    activeSection.value = id;

    if (window.location.hash === `#${id}`) {
        window.dispatchEvent(new Event('hashchange'));
        return;
    }

    window.history.replaceState(window.history.state, '', nextUrl);
    window.dispatchEvent(new Event('hashchange'));
}

function getManifestationAnchorId(manifestation: any, index: number) {
    return manifestation?.handle || `manifestation-${index}`;
}

function getItemAnchorId(item: any, manifestationIndex: number, itemIndex: number) {
    return item?.handle || `item-${manifestationIndex}-${itemIndex}`;
}

function findTargetIdForRequestedHandle(handle: string) {
    const normalizedHandle = handle.trim();
    if (!normalizedHandle) return '';

    for (let idx = 0; idx < manifestations.value.length; idx++) {
        const manifestation = manifestations.value[idx];
        if (manifestation?.handle === normalizedHandle) {
            return getManifestationAnchorId(manifestation, idx);
        }

        const items = Array.isArray(manifestation?.items) ? manifestation.items : [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            if (items[itemIndex]?.handle === normalizedHandle) {
                return getItemAnchorId(items[itemIndex], idx, itemIndex);
            }
        }
    }

    return '';
}

function syncHashToRequestedHandle() {
    if (!import.meta.client) return;

    const requestedHandle = props.requestedHandle?.trim();
    const currentWorkHandle = dataObject?.compound_record?._source?.handle?.trim();
    if (!requestedHandle || requestedHandle === currentWorkHandle) return;
    if (window.location.hash) return;

    const targetId = findTargetIdForRequestedHandle(requestedHandle);
    if (!targetId) return;

    const nextUrl = `${window.location.pathname}${window.location.search}#${requestedHandle}`;
    window.history.replaceState(window.history.state, '', nextUrl);
    window.dispatchEvent(new Event('hashchange'));
}

// Robust active section tracking via IntersectionObserver
let observer: IntersectionObserver | null = null;
const visibleMap = new Map<string, number>();

function splitActivities(evt: Event) {
    const activities = Array.isArray((evt as any)?.has_activity) ? (evt as any).has_activity : [];
    const crew: Activity[] = [];
    const cast: Activity[] = [];

    for (const activity of activities) {
        if (!activity) continue;
        if ((activity as any).type === "CastMember") {
            cast.push(activity);
        } else {
            crew.push(activity);
        }
    }

    return { crew, cast };
}

function normalizeEvent(evt: Event): NormalizedEvent {
    const { crew, cast } = splitActivities(evt);
    const showType = !crew.length && !cast.length && Boolean((evt as any)?.type);
    const hasMeta = showType || Boolean((evt as any)?.located_in) || Boolean((evt as any)?.has_date);

    return {
        raw: evt,
        crew,
        cast,
        hasMeta,
        showType,
    };
}

const normalizedEvents = computed<NormalizedEvent[]>(() => {
    const events = Array.isArray(mir?.has_event) ? mir.has_event : [];
    return events.map((evt) => normalizeEvent(evt as any));
});

function setActiveFromVisibility() {
    let bestId = "";
    let bestRatio = 0;

    for (const id of sectionIds.value) {
        const ratio = visibleMap.get(id) ?? 0;
        if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
        } else if (ratio === bestRatio && ratio > 0) {
            bestId = id;
        }
    }

    if (bestId) activeSection.value = bestId;
}

async function initObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }

    visibleMap.clear();

    await nextTick();

    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const id = (entry.target as HTMLElement)?.id;
                if (!id) continue;
                visibleMap.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
            }
            setActiveFromVisibility();
        },
        {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
    );

    for (const id of sectionIds.value) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    }

    for (const id of sectionIds.value) {
        if (document.getElementById(id)) {
            activeSection.value = id;
            break;
        }
    }
}

onMounted(() => {
    if (process.client) {
        mediaQuery = window.matchMedia("(max-width: 767px)");
        isMobile.value = mediaQuery.matches;

        mediaListener = (e: MediaQueryListEvent) => {
            isMobile.value = e.matches;
        };

        if (mediaQuery.addEventListener) mediaQuery.addEventListener("change", mediaListener);
        else (mediaQuery as any).addListener(mediaListener);

        document.addEventListener("click", handleClickOutside);

        initObserver();
        nextTick(() => {
            syncHashToRequestedHandle();
        });
    }
});

watch(
    () => sectionIds.value.join("|"),
    async () => {
        if (!process.client) return;
        await initObserver();
        syncHashToRequestedHandle();
    }
);

onUnmounted(() => {
    if (observer) observer.disconnect();
    observer = null;

    document.removeEventListener("click", handleClickOutside);

    if (mediaQuery && mediaListener) {
        if (mediaQuery.removeEventListener) mediaQuery.removeEventListener("change", mediaListener);
        else (mediaQuery as any).removeListener(mediaListener);
    }

    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }
});
</script>

<style scoped>
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
    width: 0;
}

.slide-sidebar-enter-to,
.slide-sidebar-leave-from {
    width: 18rem;
    /* 72 Tailwind units */
}

.collapse-plus>.collapse-title:after {
    top: 25%;
}
</style>