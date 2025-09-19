<template>
  <section
    v-for="work in datasets"
    :key="work?.handle ?? Math.random()"
    class="card bg-base-100 shadow-md rounded-2xl mb-6 border border-base-200"
    role="region"
    :aria-labelledby="`work-title-${work?.handle ?? ''}`"
  >
    <!-- Work header -->
    <header class="card-body p-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div class="w-4/5 md:w-4/5 lg:w-3/5">
          <GlobalClipboardComp
            class="text-regular flex flex-row items-center whitespace-break-spaces text-xs dark:text-gray-300"
            :display-text="work?.handle ?? ''"
          />
          <h2
            class="font-bold text-lg my-1"
            :alt="$t('title')"
            :title="$t('title')"
          >
            <a
              :href="`/film/${work.objectID}`"
              :title="$t('detailviewlink')"
              target="_blank"
              class="link dark:link-white no-underline hover:underline"
            >
              <span 
                v-if="work._highlightResult?.has_record?.has_primary_title?.has_name"
              >
                <ais-highlight
                  attribute="has_record.has_primary_title.has_name"
                  :hit="work"
                />
              </span>
              <span v-else>
                {{ work?.has_record?.has_primary_title?.has_name }}
              </span>
            </a>
            <MicroBadgeCategoryComp
              :category="work?.category || 'avefi:WorkVariant'"
              :dense="false"
              class="ml-2"
            />
          </h2>
          <h3
            v-if="work?.has_record?.has_alternative_title"
          >
            <ul
              v-if="work._highlightResult?.has_record?.has_alternative_title?.has_name"
            >
              <li
                v-for="(alt, idx) in work._highlightResult?.has_record?.has_alternative_title?.has_name"
                :key="idx"
                class="block"
                :aria-label="$t('alternativeTitle')"
              >
                <span v-html="alt.value" />
                <span v-if="work.has_record?.has_alternative_title?.[idx]?.type">
                  ({{ $t(work.has_record.has_alternative_title[idx].type) }})
                </span>
              </li>
            </ul>
            <ul v-else-if="work?.has_record?.has_alternative_title">
              <li
                v-for="alt in work?.has_record?.has_alternative_title"
                :key="alt.id"
              >
                {{ alt.has_name }} ({{ $t(alt.type) }})
              </li>
            </ul>
          </h3>
        </div>
        <div class="w-full md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto">
          <NuxtLink 
            v-if="work?.handle"
            :to="`/film/${work.handle.replace('21.11155/','')}`"
            class="btn btn-circle btn-outline btn-md mr-2"
            :aria-label="$t('detailviewlink')"
            :title="$t('detailviewlink')"
            target="_blank"
          >
            <Icon
              name="mdi:eye-outline"
              class="text-2xl"
              :alt="$t('detailviewlink')"
            />
          </NuxtLink>
          <GlobalActionContextComp
            v-if="work"
            :item="work"
          />
        </div>
      </div>

      <SearchGenericIconList
        :data="work"
        level="work"
        class="mt-1"
      />
    </header>

    <div class="divider my-0 divider-primary" />
    <!-- Search + Dropdown (FormKit) -->
    <div class="px-4 py-2 flex items-center gap-2">
      <FormKit
        type="dropdown"
        :name="`item-search-${work?.handle ?? ''}`"
        :label="$t('searchItems')"
        :placeholder="$t('searchItems')"
        :options="suggestionsForWork(work).map(s => ({ label: $t(s) !== s ? $t(s) : s, value: s }))"
        :value="Array.isArray(searchQuery[work?.handle ?? '']) ? searchQuery[work?.handle ?? ''] : (searchQuery[work?.handle ?? ''] ? [searchQuery[work?.handle ?? '']] : [])"
        multiple
        popover
        class="w-72"
        @input="val => onSearchInput(work?.handle ?? '', val)"
      />
    </div>
    <!-- Items carousel -->
    <section
      class="px-5 py-2"
      role="region"
      :aria-label="$t('items') || 'Items'"
    >
      <div
        v-if="loading[work?.handle ?? '']"
        class="flex justify-center items-center min-h-[120px]"
      >
        <span class="loading loading-spinner loading-lg text-primary" />
      </div>
      <template v-else>
        <div class="flex items-center gap-2  bg-base-200/50">
          <button
            class="btn btn-sm btn-outline"
            :aria-label="$t('previous') || 'Previous'"
            @click="prev(work?.handle ?? '')"
          >
            ‹
          </button>

          <div
            :id="`carousel-${work?.handle ?? ''}`"
            class="carousel-viewport"
            role="listbox"
            :aria-roledescription="$t('carousel') || 'carousel'"
          >
            <div
              class="carousel-track"
              :style="trackStyle(work)"
            >
              <article
                v-for="row in filteredRows(work)"
                :key="row.item?.handle ?? Math.random()"
                class="item-card card border border-primary/40 bg-base-100 rounded-xl shadow-md"
                role="option"
                :aria-label="row.item?.handle || 'item'"
              >
                <div class="card-body p-2 flex flex-col gap-2">
                  <!-- Primary (item-level) info -->
                  <div class="flex flex-col items-start gap-1 md:h-48">
                    <MicroBadgeCategoryComp
                      category="avefi:Item"
                      :dense="false"
                      class="block mx-auto mb-2"
                    />
                    <h4>
                      <GlobalClipboardComp
                        class="text-xs text-base-content/90"
                        :title="row.item?.handle || ''"
                        :display-text="row.item?.handle || ''"
                      />
                    </h4>
                    <div class="divider my-0" />
                    <SearchGenericIconList
                      :data="row.item"
                      level="item"
                      class="mt-2 items-start justify-start text-left"
                    />
                  </div>
                  <div v-if="row.item?.has_record?.has_webresource">
                    <GlobalTooltipInfo
                      :text="$t('tooltip.webresource')"
                    />
                    <a
                      v-if="row.item?.has_record?.has_webresource"
                      :href="row.item?.has_record?.has_webresource"
                      class="text-sm link link-primary"
                    >
                      <Icon name="tabler:external-link" /> {{ $t('webresource') || 'View Web Resource' }}
                    </a>
                  </div>

                  <!-- Secondary (manifestation-level) info -->
                  <div
                    v-if="row.mf"
                    class="border border-base-200 rounded-lg bg-base-100 flex flex-col gap-1 mt-4 mb-2"
                  >
                    <div class="text-xs font-semibold text-base-content/70 flex items-center gap-1">
                      <span class="text-base-content/90">{{ $t('fromManifestation') || 'Manifestation' }}</span>
                    </div>
                    <SearchGenericIconList
                      :data="row.mf"
                      level="manifestation"
                      class="items-start justify-start text-left"
                    />
                  </div>
                </div>
                <div class="flex justify-end p-2">
                  <button 
                    class="btn btn-xs btn-block btn-outline mt-2"
                    :aria-label="$t('viewItemDetails')"
                    :title="$t('viewItemDetails')"
                    @click="navigateToItem(row.item, work?.handle ?? '')"
                  >
                    <Icon
                      name="mdi:eye-outline"
                      class="w-4 h-4 mr-1"
                    />
                  </button>
                </div>
              </article>
            </div>
          </div>

          <button
            class="btn btn-sm btn-outline"
            :aria-label="$t('next') || 'Next'"
            @click="next(work?.handle ?? '')"
          >
            ›
          </button>
        </div>

        <!-- Page indicator -->
        <div class="mt-2 text-center text-xs opacity-70">
          {{ pageInfo(work).label }}
        </div>

        <!-- Empty state -->
        <p
          v-if="filteredRows(work).length === 0"
          class="mt-4 text-sm opacity-70"
        >
          {{ $t('noItemsFound') || 'No items found.' }}
        </p>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { FormKit } from '@formkit/vue';
import type { PropType } from 'vue';
import type { MovingImageRecordContainer } from 'models/interfaces/av_efi_schema';
import fieldsSpec from '../../models/interfaces/avefi_search_fields';
defineProps({
    datasets: {
        type: Array as PropType<Array<MovingImageRecordContainer>>,
        required: true
    }
});

// ------- Config -------
const perPageDesktop = 3;
const perPageTablet = 2;
const perPageMobile = 1;

// ------- State -------
const searchQuery = ref<Record<string, string[]>>({});
const carouselIndex = ref<Record<string, number>>({});
const viewportCols = ref(3);
const loading = ref<Record<string, boolean>>({});

function onSearchInput(handle: string, val: any) {
    searchQuery.value[handle] = Array.isArray(val) ? val : (val ? [val] : []);
    loading.value[handle] = true;
    setTimeout(() => {
        loading.value[handle] = false;
    }, 600);
}

// ------- Spec fields (ordered) -------
const workFields = computed(() =>
    (fieldsSpec?.workvariant ?? []).filter((f: any) => f.show).sort((a: any, b: any) => a.order - b.order)
);
const itemFields = computed(() =>
    (fieldsSpec?.item ?? []).filter((f: any) => f.show).sort((a: any, b: any) => a.order - b.order)
);

// ------- Responsive columns -------
function updateViewportCols() {
    const w = window.innerWidth || 1280;
    viewportCols.value = w < 640 ? perPageMobile : (w < 1024 ? perPageTablet : perPageDesktop);
}
onMounted(() => {
    updateViewportCols();
    window.addEventListener('resize', updateViewportCols);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateViewportCols);
});

// ------- Utilities -------
function get(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((o, p) => (o && o[p] != null ? o[p] : undefined), obj);
}
function has(obj: any, path: string): boolean {
    const v = get(obj, path);
    return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== '';
}
function asList(val: any): string {
    if (Array.isArray(val))  {
        if (val.length > 0 && typeof val[0] === 'object') {
            return (val as any[]).map((v: any) => (v?.has_name ? String(v.has_name) : '')).filter((v: string) => v !== '').join(', ');
        } else if (typeof val[0] === 'string' || typeof val[0] === 'number' || typeof val[0] === 'boolean') {
            return (val as Array<string | number | boolean>).join(', ');
        }
        return (val as any[]).filter(v => v != null && v !== '').join(', ');
    }
    return String(val);
}

function yearsDisplay(work: any): string {
    const years = get(work, 'years');
    if (years && Array.isArray(years) && years.length) return years.join(', ');
    const range = get(work, 'production_in_year');
    if (range && typeof range === 'object') {
        const from = (range.gte ?? range.gt ?? '');
        const to = (range.lte ?? range.lt ?? '');
        return [from, to].filter(Boolean).join('–');
    }
    return '';
}
function formatValue(val: any): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map(formatValue).join(', ');
    if (typeof val === 'object') {
        return '{ ' + Object.entries(val).map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ') + ' }';
    }
    return String(val);
}

// ------- Flatten rows (Work → Items, carrying manifestation context) -------
function buildRows(work: any): Array<{ item: any, mf: any | null }> {
    const rows: Array<{ item: any, mf: any | null }> = [];
    const mfs: any[] = Array.isArray(work?.manifestations) ? work.manifestations : [];
    const mfByHandle = new Map<string, any>();
    for (const m of mfs) if (m?.handle) mfByHandle.set(String(m.handle), m);

    // Preferred: items from manifestations (keep context)
    for (const mf of mfs) {
        const items: any[] = Array.isArray(mf?.items) ? mf.items : [];
        for (const it of items) rows.push({ item: it, mf });
    }

    // Also: items directly under work.items with best-effort mf linkage
    const tlItems: any[] = Array.isArray(work?.items) ? work.items : [];
    for (const it of tlItems) {
        const maybeHandle = get(it, 'is_item_of.id');
        const mf = maybeHandle ? (mfByHandle.get(String(maybeHandle)) || null) : null;
        rows.push({ item: it, mf });
    }
    return rows;
}

// ------- Produktions-Events parsing (display; search will only use placeName) -------
function parsedEvents(mf: any): Array<{ placeName?: string; sameAsId?: string; sameAsCategory?: string; placeCategory?: string; }> {
    const out: Array<{ placeName?: string; sameAsId?: string; sameAsCategory?: string; placeCategory?: string; }> = [];
    const events = get(mf, 'has_record.has_event');
    if (!events) return out;
    const list = Array.isArray(events) ? events : [events];
    for (const ev of list) {
        const loc = ev?.located_in || {};
        const same = loc?.same_as || {};
        out.push({
            placeName: loc?.has_name,
            sameAsId: same?.id,
            sameAsCategory: same?.category,
            placeCategory: loc?.category
        });
    }
    return out.filter(e => e.placeName || e.sameAsId || e.sameAsCategory || e.placeCategory);
}

// ------- SEARCH WHITELIST (only these paths are used for search/suggestions) -------
const SEARCH_WHITELIST = [
    // Item-level
    'item.has_webresource',
    'item.has_record.has_format.type',
    'item.has_record.element_type',
    'item.in_language.code',
    'item.has_record.has_colour_type',
    'item.has_record.has_sound_type',
    'item.has_record.has_frame_rate',
    // Manifestation-level (selected subset)
    'mf.id',
    'mf.has_record.described_by.has_issuer_name',
    'mf.in_language.code',
    'mf.has_record.has_colour_type',
    'mf.has_record.has_sound_type',
    // Parsed event place name only (ignore IDs/categories in search)
    'mf.events.located_in.has_name'
];

// Collect search values from whitelist; DO NOT split strings
function valuesForSearch(row: { item: any, mf: any | null }): string[] {
    const vals: string[] = [];

    for (const p of SEARCH_WHITELIST) {
        if (p.startsWith('item.')) {
            const v = get(row.item, p.slice(5)); // remove "item."
            pushValue(vals, v);
        } else if (p.startsWith('mf.')) {
            const rest = p.slice(3);
            if (rest.startsWith('events.')) {
                // special: events place name
                const evs = parsedEvents(row.mf);
                for (const e of evs) pushValue(vals, e.placeName);
            } else {
                const v = row.mf ? get(row.mf, rest) : undefined;
                pushValue(vals, v);
            }
        }
    }

    // Deduplicate and keep order
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of vals) {
        const k = s.toLowerCase();
        if (!seen.has(k)) {
            seen.add(k);
            out.push(s);
        }
    }
    return out;
}

function pushValue(arr: string[], v: any) {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) {
        for (const x of v) if (x !== null && x !== undefined && String(x) !== '') arr.push(String(x));
    } else {
        const s = String(v);
        if (s !== '') arr.push(s);
    }
}

// ------- Search matching across item + mf with whitelist; no tokenization -------
function rowMatchesQuery(row: { item: any, mf: any | null }, q: string): boolean {
    if (!q) return true;
    // Exact, case-sensitive match for dropdown values
    return valuesForSearch(row).some(v => v === q);
}

// ------- Suggestions (autocomplete) from the same whitelist; no splitting -------
function suggestionsForWork(work: any): string[] {
    const rows = buildRows(work);
    const set = new Set<string>();
    for (const row of rows) {
        for (const v of valuesForSearch(row)) {
            set.add(v); // keep full strings as-is
            if (set.size >= 100) break;
        }
        if (set.size >= 100) break;
    }
    return Array.from(set).slice(0, 100);
}

// ------- Filtered rows per work -------
function filteredRows(work: any): Array<{ item: any, mf: any | null }> {
    const rows = buildRows(work);
    const selected = searchQuery.value[work?.handle ?? ''] || [];
    let filtered = rows;
    if (Array.isArray(selected) && selected.length > 0) {
        filtered = rows.filter(r => selected.every(q => rowMatchesQuery(r, q)));
    } else if (typeof selected === 'string' && selected.trim()) {
        filtered = rows.filter(r => rowMatchesQuery(r, selected));
    }
    // Stable order by item.handle
    return filtered.sort((a, b) => String(a.item?.handle || '').localeCompare(String(b.item?.handle || '')));
}

// ------- Carousel controls -------
function pageSize(): number {
    return viewportCols.value;
}
function pagesCount(work: any): number {
    const count = Math.ceil(filteredRows(work).length / pageSize());
    return Math.max(count, 1);
}
function pageInfo(work: any): { index: number; total: number; label: string } {
    const h = work?.handle ?? '';
    const idx = Math.min(carouselIndex.value[h] || 0, pagesCount(work) - 1);
    return { index: idx, total: pagesCount(work), label: `${idx + 1} / ${pagesCount(work)}` };
}
function prev(handle: string) {
    const idx = carouselIndex.value[handle] || 0;
    carouselIndex.value[handle] = Math.max(0, idx - 1);
}
function next(handle: string) {
    const idx = carouselIndex.value[handle] || 0;
    carouselIndex.value[handle] = Math.min(idx + 1, Number.MAX_SAFE_INTEGER); // clamped in trackStyle
}
function trackStyle(work: any) {
    const rows = filteredRows(work);
    const per = pageSize();
    const totalPages = Math.max(Math.ceil(rows.length / per), 1);
    const h = work?.handle ?? '';
    const rawIndex = carouselIndex.value[h] || 0;
    const clampedIndex = Math.min(Math.max(rawIndex, 0), totalPages - 1);
    if (rawIndex !== clampedIndex) carouselIndex.value[h] = clampedIndex;

    const pct = -(clampedIndex * 100);
    return { transform: `translateX(${pct}%)` };
}

const navigateToItem = (item: any, workHandle: string) => {
    const itemPath = `/film/${workHandle?.replace('21.11155/', '')}#${item?.handle?.replace('21.11155/', '')}`;
    window.open(itemPath, '_blank');
};

</script>

<style scoped>
/* carousel layout */
.carousel-viewport { overflow: hidden; width: 100%; }
.carousel-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  transition: transform 220ms ease-in-out;
}
@media (min-width: 640px) {
  .carousel-track { grid-auto-columns: 50%; }
}
@media (min-width: 1024px) {
  .carousel-track { grid-auto-columns: 33.3333%; }
}
.item-card { margin: 0.5rem; }
.kv-l { @apply font-medium text-base-content/80 mr-1; }
.kv-v { @apply text-base-content; }
</style>
