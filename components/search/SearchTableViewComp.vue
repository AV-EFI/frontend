<template>
  <div class="overflow-x-auto bg-base-100 rounded-lg shadow-sm">
    <table class="table table-xs w-full">
      <thead>
        <tr class="bg-base-200/50 border-b border-base-300">
          <th class="text-sm font-semibold py-2 px-3">
            <div class="flex items-center gap-1">
              {{ $t('title') }}
              <GlobalTooltipInfo :text="$t('tooltip.title')" />
            </div>
          </th>
          <th class="text-sm font-semibold py-2 px-3 hidden md:table-cell text-center">
            <div class="flex items-center justify-center gap-1">
              {{ $t('located_in_has_name') }}
              <GlobalTooltipInfo :text="$t('tooltip.country')" />
            </div>
          </th>
          <th class="text-sm font-semibold py-2 px-3 hidden lg:table-cell text-center">
            <div class="flex items-center justify-center gap-1">
              {{ $t('production_in_year') }}
              <GlobalTooltipInfo :text="$t('tooltip.year')" />
            </div>
          </th>
          <th class="text-sm font-semibold py-2 px-3 hidden xl:table-cell text-center">
            <div class="flex items-center justify-center gap-1">
              {{ $t('directors_or_editors') }}
              <GlobalTooltipInfo :text="$t('tooltip.director')" />
            </div>
          </th>
          <th class="text-sm font-semibold py-2 px-3 text-center">
            <div class="flex items-center justify-center gap-1">
              {{ $t('items') }}
              <GlobalTooltipInfo :text="$t('tooltip.item')" />
            </div>
          </th>
          <th class="text-sm font-semibold py-2 px-3 hidden sm:table-cell text-center">
            <div class="flex items-center justify-center gap-1">
              EFI Handle
              <GlobalTooltipInfo :text="$t('tooltip.handle')" />
            </div>
          </th>
          <th class="text-sm font-semibold py-2 px-3 w-12 text-center">
            {{ $t('detailview') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="workVariant in items" :key="workVariant.handle || workVariant._id">
          <!-- Main WorkVariant Row -->
          <tr class="hover:bg-base-100 transition-colors duration-200 cursor-pointer border-b border-base-200/50 bg-base-50/30"
              @click="toggleExpansion(workVariant)">
            <!-- Title Column -->
            <td class="py-2 px-3">
              <!-- Handle (mobile first) -->
              <div class="sm:hidden mb-1">
                <GlobalClipboardComp
                  class="text-xs text-base-content/60"
                  :display-text="workVariant?.handle ?? ''"
                />
              </div>
              
              <!-- Expand/Collapse Icon and Title -->
              <div class="flex items-start gap-2">
                <Icon 
                  :name="isExpanded(workVariant) ? 'tabler:chevron-down' : 'tabler:chevron-right'"
                  class="text-sm text-base-content/60 mt-0.5 flex-shrink-0"
                />
                
                <div class="flex-1 min-w-0">
                  <!-- Title -->
                  <div class="font-medium text-sm text-base-content leading-tight">
                    {{ get(workVariant, 'has_record.has_primary_title.has_name') || workVariant?.handle || $t('untitled') }}
                  </div>
                  
                  <!-- Alternative title -->
                  <div v-if="workVariant?.has_record?.has_alternative_title?.length" 
                       class="text-xs text-base-content/70 leading-tight mt-0.5">
                    {{ workVariant.has_record.has_alternative_title[0].has_name }}
                  </div>
                </div>
              </div>
            </td>
            
            <!-- Location (hidden on mobile) -->
            <td class="py-2 px-3 text-center hidden md:table-cell">
              <div class="text-xs text-base-content">
                {{ getCountries(workVariant) || '-' }}
              </div>
            </td>
            
            <!-- Year (hidden on mobile/tablet) -->
            <td class="py-2 px-3 text-center hidden lg:table-cell">
              <div class="text-xs text-base-content">
                {{ getProductionYear(workVariant) || '-' }}
              </div>
            </td>
            
            <!-- Director (hidden on mobile/tablet/desktop) -->
            <td class="py-2 px-3 text-center hidden xl:table-cell">
              <div class="text-xs text-base-content">
                {{ getDirector(workVariant) || '-' }}
              </div>
            </td>
            
            <!-- Items Count -->
            <td class="py-2 px-3 text-center">
              <div class="badge badge-primary badge-sm font-medium">
                {{ getTotalItemsCount(workVariant) }}
              </div>
            </td>
            
            <!-- Handle (hidden on mobile) -->
            <td class="py-2 px-3 text-center hidden sm:table-cell">
              <GlobalClipboardComp
                class="text-xs text-base-content/60"
                :display-text="workVariant?.handle ?? ''"
              />
              <div class="badge badge-ghost badge-xs mt-0.5">
                WorkVariant
              </div>
            </td>

            <!-- Detail Link -->
            <td class="py-2 px-3 text-center">
              <button 
                @click.stop="navigateToDetail(workVariant)"
                class="btn btn-ghost btn-xs"
                :title="$t('detailviewlink')"
              >
                <Icon name="tabler:external-link" class="text-sm" />
              </button>
            </td>
          </tr>

          <!-- Expanded Content: Items Only -->
          <tr v-if="isExpanded(workVariant)" class="bg-base-50/50">
            <td colspan="7" class="py-0 px-0">
              <div class="p-3 border-l-4 border-primary/30">
                <div class="flex items-center gap-2 mb-3">
                  <Icon name="tabler:package" class="text-base text-primary" />
                  <h4 class="text-sm font-semibold text-base-content">
                    {{ $t('items') }} ({{ getAllItems(workVariant).length }})
                  </h4>
                </div>

                <!-- Search + Dropdown (FormKit) -->
                <div class="mb-3 flex items-center gap-2">
                  <FormKit
                    type="dropdown"
                    :name="`item-search-${workVariant?.handle ?? ''}`"
                    :label="$t('searchItems')"
                    :placeholder="$t('searchItems')"
                    :options="suggestionsForWork(workVariant).map(s => ({ label: $t(s) !== s ? $t(s) : s, value: s }))"
                    :value="getFormKitValue(workVariant?.handle ?? '')"
                    multiple
                    popover
                    class="w-72"
                    @input="val => onSearchInput(workVariant?.handle ?? '', val)"
                  />
                </div>

                <!-- Loading State -->
                <div
                  v-if="loading[workVariant?.handle ?? '']"
                  class="flex justify-center items-center min-h-[120px]"
                >
                  <span class="loading loading-spinner loading-lg text-primary" />
                </div>

                <!-- Items Carousel -->
                <template v-else>
                  <div v-if="filteredRows(workVariant).length" class="flex items-center gap-2 bg-base-200/50 p-2 rounded">
                    <button
                      class="btn btn-sm btn-outline"
                      :aria-label="$t('previous') || 'Previous'"
                      @click="prev(workVariant?.handle ?? '')"
                    >
                      ‹
                    </button>

                    <div
                      :id="`carousel-${workVariant?.handle ?? ''}`"
                      class="carousel-viewport"
                      role="listbox"
                      :aria-roledescription="$t('carousel') || 'carousel'"
                    >
                      <div
                        class="carousel-track"
                        :style="trackStyle(workVariant)"
                      >
                        <article
                          v-for="row in filteredRows(workVariant)"
                          :key="row.item?.handle ?? Math.random()"
                          class="item-card card border border-primary/40 bg-base-100 rounded-xl shadow-md"
                          role="option"
                          :aria-label="row.item?.handle || 'item'"
                        >
                          <div class="card-body p-3 flex flex-col gap-2">
                            <!-- Primary (item-level) info -->
                            <div class="flex flex-col items-start gap-1 md:min-h-32">
                              <MicroBadgeCategoryComp
                                category="avefi:Item"
                                :dense="true"
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
                                class="mt-2 items-start justify-start text-left text-xs"
                                icon-color="primary"
                              />
                            </div>
                            <div v-if="row.item?.has_record?.has_webresource">
                              <GlobalTooltipInfo
                                :text="$t('tooltip.webresource')"
                              />
                              <a
                                v-if="row.item?.has_record?.has_webresource"
                                :href="row.item?.has_record?.has_webresource"
                                class="text-xs link link-primary"
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
                                class="items-start justify-start text-left text-xs"
                                icon-color="primary"
                              />
                            </div>
                          </div>
                          <div class="flex justify-end p-2">
                            <button 
                              class="btn btn-xs btn-block btn-outline mt-2"
                              :aria-label="$t('viewItemDetails')"
                              :title="$t('viewItemDetails')"
                              @click="navigateToItem(row.item, workVariant?.handle ?? '')"
                            >
                              <Icon
                                name="tabler:eye"
                                class="w-3 h-3 mr-1"
                              />
                            </button>
                          </div>
                        </article>
                      </div>
                    </div>

                    <button
                      class="btn btn-sm btn-outline"
                      :aria-label="$t('next') || 'Next'"
                      @click="next(workVariant?.handle ?? '')"
                    >
                      ›
                    </button>
                  </div>

                  <!-- Page indicator -->
                  <div class="mt-2 text-center text-xs opacity-70">
                    {{ pageInfo(workVariant).label }}
                  </div>

                  <!-- Empty state -->
                  <p
                    v-if="filteredRows(workVariant).length === 0"
                    class="mt-4 text-sm opacity-70"
                  >
                    {{ $t('noItemsFound') || 'No items found.' }}
                  </p>
                </template>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { FormKit } from '@formkit/vue';
import type { IAVefiWorkVariant } from '@/models/interfaces/generated';
import type { PropType } from 'vue';
import fieldsSpec from '../../models/interfaces/avefi_search_fields';

defineOptions({
  name: 'SearchTableViewComp',
});

const props = defineProps({
  items: {
    type: Array as PropType<IAVefiWorkVariant[]>,
    required: true,
  },
  productionDetailsChecked: {
    type: Boolean,
    default: false,
  },
  showAdminStats: {
    type: Boolean,
    default: false,
  },
  currentRefinements: {
    type: Array,
    required: false,
    default: () => []
  }
});

// Helper function to get nested object properties (matching SearchListFlatComp)
function get(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((o, p) => (o && o[p] != null ? o[p] : undefined), obj);
}

// Get production year (matching SearchListFlatComp structure)
function getProductionYear(workVariant: IAVefiWorkVariant): string {
  const range = get(workVariant, 'production_in_year');
  if (range && typeof range === 'object') {
    const from = (range.gte ?? range.gt ?? '');
    const to = (range.lte ?? range.lt ?? '');
    if (from && to && from === to) {
      return String(from);
    } else if (from && to) {
      return `${from}–${to}`;
    } else if (from) {
      return String(from);
    } else if (to) {
      return String(to);
    }
  }
  return '';
}

// Calculate total items count across all manifestations
function getTotalItemsCount(workVariant: IAVefiWorkVariant): number {
  const manifestations = workVariant.manifestations || [];
  return manifestations.reduce((total, manifestation) => {
    return total + (manifestation.items?.length || 0);
  }, 0);
}

// Navigate to detail page (matching SearchListFlatComp navigation pattern)
function navigateToDetail(workVariant: IAVefiWorkVariant) {
  if (workVariant.handle) {
    const path = `/film/${workVariant.handle.replace('21.11155/', '')}`;
    navigateTo(path);
  }
}

// Expansion state management
const expandedItems = ref<Set<string>>(new Set());

// ------- Carousel and Search Config (from SearchListFlatComp) -------
const perPageDesktop = 3;
const perPageTablet = 2;
const perPageMobile = 1;

// ------- Search and Carousel State -------
const searchQuery = ref<Record<string, string[]>>({});
const carouselIndex = ref<Record<string, number>>({});
const viewportCols = ref(3);
const loading = ref<Record<string, boolean>>({});

// Expansion management
function getItemKey(workVariant: IAVefiWorkVariant): string {
  return workVariant.handle || workVariant._id || '';
}

function isExpanded(workVariant: IAVefiWorkVariant): boolean {
  return expandedItems.value.has(getItemKey(workVariant));
}

function toggleExpansion(workVariant: IAVefiWorkVariant) {
  const key = getItemKey(workVariant);
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key);
  } else {
    expandedItems.value.add(key);
  }
}

// Get all items from all manifestations
function getAllItems(workVariant: IAVefiWorkVariant) {
  const manifestations = workVariant.manifestations || [];
  const allItems: any[] = [];
  manifestations.forEach(manifestation => {
    if (manifestation.items) {
      allItems.push(...manifestation.items);
    }
  });
  return allItems;
}

// Build rows (Work → Items, carrying manifestation context) - from SearchListFlatComp
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

// Navigate to item detail - from SearchListFlatComp
function navigateToItem(item: any, workHandle: string) {
  const itemPath = `/film/${workHandle?.replace('21.11155/', '')}#${item?.handle?.replace('21.11155/', '')}`;
  window.open(itemPath, '_blank');
}

// ------- FormKit Search Functions -------
// Helper to get properly typed FormKit value
function getFormKitValue(handle: string): string[] {
  const value = searchQuery.value[handle] || [];
  return Array.isArray(value) ? value : [];
}

function onSearchInput(handle: string, val: any) {
  searchQuery.value[handle] = Array.isArray(val) ? val : (val ? [val] : []);
  loading.value[handle] = true;
  setTimeout(() => {
    loading.value[handle] = false;
  }, 600);
}

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
  } else if (typeof selected === 'string' && (selected as string).trim()) {
    filtered = rows.filter(r => rowMatchesQuery(r, selected as string));
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

// Get countries/located_in information
function getCountries(workVariant: IAVefiWorkVariant): string {
  const countries = get(workVariant, 'located_in');
  if (countries && Array.isArray(countries)) {
    return countries.map(c => c.has_name || c).filter(Boolean).join(', ');
  }
  if (countries && typeof countries === 'object' && countries.has_name) {
    return countries.has_name;
  }
  if (typeof countries === 'string') {
    return countries;
  }
  return '';
}

// Get director/editor information
function getDirector(workVariant: IAVefiWorkVariant): string {
  const directors = get(workVariant, 'directors_or_editors');
  if (directors && Array.isArray(directors)) {
    return directors.map(d => d.has_name || d).filter(Boolean).join(', ');
  }
  if (directors && typeof directors === 'object' && directors.has_name) {
    return directors.has_name;
  }
  if (typeof directors === 'string') {
    return directors;
  }
  return '';
}
</script>

<style scoped>
/* Container styling */
.overflow-x-auto {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
}

/* Base table styling */
.table {
  background: white;
  font-size: 0.75rem;
  line-height: 1rem;
}

/* Header styling */
.table thead tr {
  background: #f8fafc;
  border-bottom: 1px solid #d1d5db;
}

.table thead th {
  color: #374151;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #d1d5db;
}

/* Row styling and hover effects */
.table tbody tr {
  transition: all 0.15s ease-in-out;
  border-bottom: 1px solid #f3f4f6;
  background: white;
}

.table tbody tr:hover {
  background: #f8fafc;
  transform: none;
}

/* Cell styling */
.table tbody td {
  color: #111827;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.75rem;
}

/* Typography improvements */
.font-medium {
  color: #111827;
  line-height: 1.25;
}

.text-base-content\/70 {
  color: #6b7280;
}

.text-base-content\/60 {
  color: #9ca3af;
}

/* Badge improvements */
.badge-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.badge-secondary {
  background-color: #8b5cf6;
  color: white;
  border: none;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.badge-outline {
  border: 1px solid #d1d5db;
  color: #374151;
  background: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  font-weight: 500;
}

.badge-ghost {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .table th,
  .table td {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  .badge-lg {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .table th,
  .table td {
    padding: 0.5rem;
  }
  
  .font-medium {
    font-size: 0.875rem;
  }
}

/* Smooth scrolling for mobile */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--bc) / 0.2) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Carousel layout from SearchListFlatComp */
.carousel-viewport { 
  overflow: hidden; 
  width: 100%; 
}

.carousel-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  transition: transform 220ms ease-in-out;
}

@media (min-width: 640px) {
  .carousel-track { 
    grid-auto-columns: 50%; 
  }
}

@media (min-width: 1024px) {
  .carousel-track { 
    grid-auto-columns: 33.3333%; 
  }
}

.item-card { 
  margin: 0.5rem; 
}
</style>