<template>
    <div class="flex flex-row gap-6 relative">
        <!-- Desktop sidebar (left, slide-in/out, relative) -->
        <button class="hidden lg:block absolute -top-4 left-2 z-10" @click="desktopDrawerOpen = !desktopDrawerOpen"
            :title="$t('toggleNavigation')" :aria-label="$t('toggleNavigation')">
            <div class="btn btn-sm btn-circle">
                <Icon :name="desktopDrawerOpen ? 'tabler-caret-left' : 'tabler-caret-right'" />
            </div>
        </button>
        <transition name="slide-sidebar">
            <aside v-if="desktopDrawerOpen"
                class="hidden lg:block w-72 shrink-0 order-1 self-start bg-base-200 z-0 mt-4 py-4">
                <span class="font-semibold p-2">{{ $t('workNavigation') }}</span>
                <nav aria-label="Work navigation" class="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <ul class="menu bg-base-200 rounded-box">
                        <li>
                            <a @click.prevent="scrollToId('work-events')" class="cursor-pointer"
                                :class="{ 'active': activeSection === 'work-events' }">
                                <span v-if="normalizedEvents?.length > 0">
                                    {{ $t(normalizedEvents[0]?.raw?.category) }}
                                </span>
                                <span v-else>
                                    {{ $t('workEvents') }}
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click.prevent="scrollToId('manifestations')" class="cursor-pointer"
                                :class="{ 'active': activeSection === 'manifestations' }">
                                {{ $t('manifestations') }}
                            </a>
                            <ul>
                                <li v-for="(mf, idx) in filteredManifestations" :key="idx">
                                    <a @click.prevent="scrollToId(`manifestation-${idx}`)" class="cursor-pointer pl-4"
                                        :class="{ 'active': activeSection === `manifestation-${idx}` }">
                                        <span class="text-ellipsis">
                                            {{ $t(mf.has_record?.has_event[0]?.type) }}
                                            {{ mf.has_primary_title?.has_name ?? $t('manifestation')}}
                                        </span>
                                        <div :aria-label="$t('items')" class="badge">{{ mf.has_record?.has_item?.length
                                            }}
                                        </div>
                                    </a>
                                    <!--
                                    <ul v-if="Array.isArray(mf.items)">
                                        <li v-for="(item, iidx) in mf.items" :key="iidx">
                                            <a @click.prevent="scrollToId(`item-${idx}-${iidx}`)"
                                                class="cursor-pointer pl-8"
                                                :class="{ 'active': activeSection === `item-${idx}-${iidx}` }">
                                                {{ item.has_name ?? $t('item') + ' ' + (iidx + 1) }}
                                            </a>
                                        </li>
                                    </ul>
                                -->
                                </li>
                            </ul>
                        </li>
                        <!--
                       <li v-for="(event, eidx) in mir?.has_event || []" :key="eidx">
                            <a @click.prevent="scrollToId(`event-${eidx}`)" class="cursor-pointer pl-4"
                                :class="{ 'active': activeSection === `event-${eidx}` }">
                                {{ $t('event') }} {{ eidx + 1 }}
                            </a>
                        </li>
                        -->
                    </ul>
                </nav>
            </aside>
        </transition>
        <!-- Mobile drawer for tree-view (left) -->
        <div class="drawer fixed inset-0 z-50 lg:hidden order-1" v-if="drawerOpen">
            <div class="drawer-overlay bg-black bg-opacity-40" @click="drawerOpen = false"></div>

            <div class="drawer-side fixed left-0 top-0 w-72 h-full bg-base-200 shadow-xl overflow-y-auto">
                <div class="btn btn-sm btn-circle absolute top-4 right-4" @click="drawerOpen = false"
                    aria-label="Close navigation">
                    <Icon name="tabler-x" />
                </div>
                <nav aria-label="Work navigation" class="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <ul class="menu bg-base-200 rounded-box p-2">
                        <li>
                            <a @click.prevent="scrollToId('work-events'); drawerOpen = false"
                                :class="{ 'active': activeSection === 'work-events' }" class="cursor-pointer">
                                {{ $t('workEvents') }}
                            </a>
                        </li>

                        <li>
                            <a @click.prevent="scrollToId('manifestations'); drawerOpen = false"
                                :class="{ 'active': activeSection === 'manifestations' }" class="cursor-pointer">
                                {{ $t('manifestations') }}
                            </a>
                            <ul>
                                <li v-for="(mf, idx) in filteredManifestations" :key="idx">
                                    <a @click.prevent="scrollToId(`manifestation-${idx}`); drawerOpen = false"
                                        :class="{ 'active': activeSection === `manifestation-${idx}` }"
                                        class="cursor-pointer pl-2">
                                        {{ mf.has_primary_title?.has_name ?? $t('manifestation') + ' ' + (idx + 1) }}
                                    </a>

                                    <ul v-if="Array.isArray(mf.items)">
                                        <li v-for="(item, iidx) in mf.items" :key="iidx">
                                            <a @click.prevent="scrollToId(`item-${idx}-${iidx}`); drawerOpen = false"
                                                :class="{ 'active': activeSection === `item-${idx}-${iidx}` }"
                                                class="cursor-pointer pl-8">
                                                {{ item.has_name ?? $t('item') + ' ' + (iidx + 1) }}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li v-for="(event, eidx) in mir?.has_event || []" :key="eidx">
                            <a @click.prevent="scrollToId(`event-${eidx}`); drawerOpen = false"
                                :class="{ 'active': activeSection === `event-${eidx}` }" class="cursor-pointer pl-4">
                                {{ $t('event') }} {{ eidx + 1 }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Mobile drawer button -->
        <div class="fixed top-4 left-4 z-50 lg:hidden order-0">
            <button class="btn btn-primary btn-circle" @click="drawerOpen = true" aria-label="Open navigation">
                <Icon name="tabler-list-tree" />
            </button>
        </div>

        <!-- Main content (right) -->
        <div class="flex-1 min-w-0 order-2">
            <div v-if="mir" class="border-l-2 border-work px-2" role="region"
                :aria-label="`${$t('detailsFor')} ${mir?.has_primary_title?.has_name ?? ''}`">
                <!-- MOBILE-ONLY TOGGLE (does not affect desktop) -->
                <div class="md:hidden mb-2">
                    <button type="button" class="btn btn-lg btn-outline w-full justify-between"
                        :aria-expanded="mirExpanded ? 'true' : 'false'" :aria-controls="mirPanelId"
                        @click="mirExpanded = !mirExpanded">
                        <span class="truncate text-sm">
                            {{ $t('detailsFor') }} {{ mir?.has_primary_title?.has_name ?? '' }}
                        </span>
                        <span v-if="mirExpanded" :title="$t('collapse') || 'Collapse'">
                            <Icon name="tabler-chevron-up" />
                        </span>
                        <span v-else :title="$t('expand') || 'Expand'">
                            <Icon name="tabler-chevron-down" />
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
            </div>

            <div v-else>
                <pre>{{ mir }}</pre>
            </div>

            <!-- Manifestations block -->
            <div v-if="filteredManifestations.length > 0" id="manifestations" role="region" aria-label="Manifestations">
                <div class="mt-4 ml-2">
                    <hr class="my-2 col-span-full" />
                    <h3 class="relative font-bold text-sm col-span-full text-primary-800 dark:text-primary-100 mb-1"
                        :alt="$t('manifestations')">
                        {{ $t("manifestations") }}
                        <GlobalTooltipInfo :text="$t('tooltip.manifestation')" />
                    </h3>

                    <FormKit type="dropdown" name="manifestation-item-search"
                        :label="$t('filterItemsAndManifestations')" :placeholder="$t('filterItemsAndManifestations')"
                        :options="suggestionsForManifestations.map((s) => ({ label: $t(s) !== s ? $t(s) : s, value: s }))"
                        :value="searchQuery" multiple popover class="w-72" @input="onSearchInput" />
                </div>

                <ClientOnly>
                    <div v-if="loading" class="flex justify-center items-center min-h-[120px]">
                        <span class="loading loading-spinner loading-lg text-primary" />
                    </div>
                    <DetailManifestationListComp v-else v-model="filteredManifestations" />
                </ClientOnly>
            </div>

            <div v-else-if="parts">
                <ViewsWorkViewCompParts class="mt-4" :parts="parts"
                    :handle="dataObject?.compound_record?._source?.handle" />
            </div>

            <div v-else class="ml-2 alert alert-warning alert-outline text-white max-w-96 mt-4" role="alert"
                aria-label="No manifestations available">
                <MicroIconTextComp icon-name="tabler:mood-empty" text="noManifestations" />
            </div>

            <!-- 12 Letzte Bearbeitung -->
            <div v-if="dataObject?._source?.['@timestamp']" class="w-full mt-4 justify-center items-center">
                <DetailKeyValueComp class="col-span-full mx-auto" keytxt="lastedit" :clip="false"
                    :valtxt="formatTimestamp(dataObject._source['@timestamp'])" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { FormKit } from "@formkit/vue";
import type { IAVefiWorkVariant as WorkVariant } from "~/models/interfaces/generated/IAVefiWorkVariant";

// Enable hash navigation for manifestations and items
useHash();

type Manifestation = any; // keep as-is if you already have a real type elsewhere

const desktopDrawerOpen = ref(true);

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

// --- Dynamic search state (manifestation filter) ---
const searchQuery = ref<string[]>([]);
const loading = ref(false);

function onSearchInput(val: any) {
    searchQuery.value = Array.isArray(val) ? val : val ? [val] : [];
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 600);
}

// --- SEARCH WHITELIST (manifestation/item fields) ---
const SEARCH_WHITELIST = [
    // Manifestation-level
    "has_record.described_by.has_issuer_name",
    "has_record.in_language.code",
    "has_record.has_colour_type",
    "has_record.has_sound_type",
    // Item-level (full paths)
    "items.has_webresource",
    "items.has_record.has_format.type",
    "items.has_record.element_type",
    "items.has_record.in_language.code",
    "items.has_record.has_colour_type",
    "items.has_record.has_sound_type",
    "items.has_record.has_frame_rate",
    "items.has_record.has_access_status",
    "items.has_record.note",
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

function valuesForManifestation(mf: any): string[] {
    const vals: string[] = [];

    for (const p of SEARCH_WHITELIST) {
        if (p.startsWith("items.")) {
            const items = Array.isArray(mf?.items) ? mf.items : [];
            for (const it of items) pushValue(vals, get(it, p.slice(6)));
        } else {
            pushValue(vals, get(mf, p));
        }
    }

    // Deduplicate (case-insensitive) and filter out empty/whitespace-only values
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of vals) {
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
    return Array.from(set).slice(0, 100);
});

const filteredManifestations = computed<any[]>(() => {
    const selected = searchQuery.value;
    if (!Array.isArray(selected) || selected.length === 0) {
        return manifestations.value;
    }

    function mfLevelMatches(mf: any, q: string): boolean {
        for (const p of SEARCH_WHITELIST) {
            if (p.startsWith("items.")) continue;
            const vals: string[] = [];
            pushValue(vals, get(mf, p));
            if (vals.some((v) => v === q)) return true;
        }
        return false;
    }

    function filterItems(items: any[], selected: string[]): any[] {
        return items.filter((it) =>
            selected.every((q) => {
                let matched = false;
                for (const p of SEARCH_WHITELIST) {
                    if (!p.startsWith("items.")) continue;
                    const vals: string[] = [];
                    pushValue(vals, get(it, p.slice(6)));
                    if (vals.some((v) => v === q)) {
                        matched = true;
                        break;
                    }
                }
                return matched;
            })
        );
    }

    return manifestations.value
        .map((mf) => {
            const items = Array.isArray(mf.items) ? mf.items : [];
            const filteredItems = filterItems(items, selected);
            const hasMfLevelMatch = selected.every((q) => mfLevelMatches(mf, q));

            if (filteredItems.length > 0 || hasMfLevelMatch) {
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

// ✅ Make isMobile reactive (so the collapse and drawer logic doesn't desync)
const isMobile = ref(false);
let mediaQuery: MediaQueryList | null = null;
let mediaListener: ((e: MediaQueryListEvent) => void) | null = null;

// Drawer + active section
const drawerOpen = ref(false);
const activeSection = ref("");

// ✅ Build the exact list of IDs that actually exist in the DOM (based on FILTERED data)
const sectionIds = computed<string[]>(() => {
    const ids: string[] = [];

    // Work anchor
    ids.push("work-events");

    // Manifestations anchor
    ids.push("manifestations");

    // Manifestations + items (FILTERED!)
    for (let idx = 0; idx < filteredManifestations.value.length; idx++) {
        ids.push(`manifestation-${idx}`);
        const mf = filteredManifestations.value[idx];
        const items = Array.isArray(mf?.items) ? mf.items : [];
        for (let iidx = 0; iidx < items.length; iidx++) {
            ids.push(`item-${idx}-${iidx}`);
        }
    }

    // Events (if your DetailHasEventComp actually renders these ids, this will work)
    const events = Array.isArray(mir?.has_event) ? (mir as any).has_event : [];
    for (let eidx = 0; eidx < events.length; eidx++) {
        ids.push(`event-${eidx}`);
    }

    return ids;
});

function getHeaderHeightPx() {
    if (typeof window === 'undefined') return 64;
    const root = document.documentElement;
    const cssVar = root.style.getPropertyValue('--header-height');
    if (cssVar) {
        const px = parseInt(cssVar, 10);
        if (!isNaN(px)) return px;
        // Try to parse e.g. '64px'
        const match = cssVar.match(/(\d+)(px)?/);
        if (match) return parseInt(match[1], 10);
    }
    // fallback: try computed style
    const computed = getComputedStyle(root).getPropertyValue('--header-height');
    if (computed) {
        const px = parseInt(computed, 10);
        if (!isNaN(px)) return px;
        const match = computed.match(/(\d+)(px)?/);
        if (match) return parseInt(match[1], 10);
    }
    return 64;
}

function scrollToId(id: string) {
    const el = document.getElementById(id);
    console.log(id);
    console.log(el);
    if (el) {
        const headerHeight = getHeaderHeightPx();
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top = rect.top + scrollTop - headerHeight;
        window.scrollTo({ top, behavior: "smooth" });
        activeSection.value = id; // immediate feedback
    }
}

// ✅ Robust active section tracking via IntersectionObserver
let observer: IntersectionObserver | null = null;
const visibleMap = new Map<string, number>(); // id -> intersectionRatio

function splitActivities(evt: Event) {
    const activities = Array.isArray(evt?.has_activity) ? evt.has_activity : [];
    const crew: Activity[] = [];
    const cast: Activity[] = [];
    for (const activity of activities) {
        if (!activity) continue;
        if (activity.type === "CastMember") {
            cast.push(activity);
        } else {
            crew.push(activity);
        }
    }
    return { crew, cast };
}

function normalizeEvent(evt: Event): NormalizedEvent {
    const { crew, cast } = splitActivities(evt);
    const showType = !crew.length && !cast.length && Boolean(evt?.type);
    const hasMeta = showType || Boolean(evt?.located_in) || Boolean(evt?.has_date);
    return {
        raw: evt,
        crew,
        cast,
        hasMeta,
        showType,
    };
}

const normalizedEvents = computed<NormalizedEvent[]>(() => {
    console.log(mir?.has_event);
    const events = Array.isArray(mir?.has_event) ? mir.has_event : [];
    return events.map((evt) => normalizeEvent(evt));
});

function setActiveFromVisibility() {
    // pick the id with the highest ratio; if tie, pick the last (deepest) in DOM order by sectionIds
    let bestId = "";
    let bestRatio = 0;

    for (const id of sectionIds.value) {
        const ratio = visibleMap.get(id) ?? 0;
        if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
        } else if (ratio === bestRatio && ratio > 0) {
            // tie-breaker: later in sectionIds wins (more "current" while scrolling down)
            bestId = id;
        }
    }

    if (bestId) activeSection.value = bestId;
}

async function initObserver() {
    // cleanup
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
            // tweak: top offset helps with sticky headers / layouts
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
    );

    for (const id of sectionIds.value) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    }

    // set initial active (topmost existing)
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

        // older Safari fallback not needed in Nuxt modern targets usually, but kept safe
        if (mediaQuery.addEventListener) mediaQuery.addEventListener("change", mediaListener);
        else (mediaQuery as any).addListener(mediaListener);

        initObserver();
    }
});

// re-init observer when rendered sections change (filtering, data load, etc.)
watch(
    () => sectionIds.value.join("|"),
    async () => {
        if (!process.client) return;
        await initObserver();
    }
);

onUnmounted(() => {
    if (observer) observer.disconnect();
    observer = null;

    if (mediaQuery && mediaListener) {
        if (mediaQuery.removeEventListener) mediaQuery.removeEventListener("change", mediaListener);
        else (mediaQuery as any).removeListener(mediaListener);
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
