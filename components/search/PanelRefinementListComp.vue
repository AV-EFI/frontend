<template>
  <ais-panel
    role="region"
    :aria-labelledby="`facet-title-${attributeName}`"
    :class-names="{
      'ais-Panel': 'collapse collapse-arrow bg-white border-2 border-base-300 dark:border-primary-600 rounded-lg mb-2 max-md:!w-[90vw]',
      'ais-Panel-body': 'collapse-content !pl-0 !pr-0 mx-1 bg-gray-50 dark:bg-slate-900 dark:text-white text-xs ',
      'ais-Panel-header': 'collapse-title bg-white dark:bg-gray-800 dark:text-white !min-h-5 !mb-0 flex flex-row items-center justify-between gap-2'
    }"
    :title="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
  >
    <!-- Header with icon (unchanged) -->
    <template #header="{ hasRefinements }">
      <div class="flex items-center gap-2">
        <Icon
          :name="facetIcon"
          class="w-4 h-4"
          :class="hasRefinements ? 'text-primary-600 dark:text-primary-100' : 'text-primary-200 dark:text-primary-600'"
          aria-hidden="true"
        />
        <h4
          :id="`facet-title-${attributeName}`"
          class="my-auto font-bold"
          :class="!hasRefinements ? 'text-primary-200 dark:text-primary-600' : 'text-primary-600 dark:text-primary-100'"
        >
          {{ $t(headerText) }}
        </h4>
      </div>

      <MicroBadgeCategoryComp
        v-if="category"
        :category="category"
        :dense="true"
        class="my-auto"
      />
    </template>

    <!-- Body -->
    <template #default>
      <!-- ===== NUMERIC: slider + inputs; refine ONLY on submit ===== -->
      <ais-range-input
        v-if="isNumeric"
        :key="`range-${attributeName}`"
        :attribute="attributeName"
      >
        <template #default="{ currentRefinement, range, refine, canRefine }">
          <!-- Slider -->
          <div class="p-4 m-4">
            <Slider
              :model-value="pendingModel(currentRefinement, range)"
              :min="boundMin(range)"
              :max="boundMax(range)"
              :step="1"
              thumb-label
              class="w-full h-8 slider-primary"
              :aria-label="$t('refineBy', { headerText: $t(headerText) })"
              @update:model-value="onSliderChangeLocal($event, range)"
            />
          </div>

          <!-- Numeric inputs (update local only) -->
          <div class="flex flex-row justify-around mt-2 p-2 gap-3">
            <input
              :id="`${inputId}-min`"
              type="number"
              inputmode="numeric"
              class="input input-bordered input-xs w-24 bg-white dark:bg-gray-800 text-neutral-700 dark:text-neutral-300"
              :placeholder="String(boundMin(range))"
              :min="boundMin(range)"
              :max="boundMax(range)"
              :value="(pending?.[0] ?? boundMin(range))"
              :disabled="!canRefine"
              @change="onMinChangeLocal($event, range)"
            >
            <div class="w-1/3 flex flex-col justify-center mb-3.5 max-w-16">
              <Icon
                class="mx-auto dark:text-white"
                name="formkit:arrowright"
              />
            </div>
            <input
              :id="`${inputId}-max`"
              type="number"
              inputmode="numeric"
              class="input input-bordered input-xs w-24 bg-white dark:bg-gray-800 text-neutral-700 dark:text-neutral-300"
              :placeholder="String(boundMax(range))"
              :min="boundMin(range)"
              :max="boundMax(range)"
              :value="(pending?.[1] ?? boundMax(range))"
              :disabled="!canRefine"
              @change="onMaxChangeLocal($event, range)"
            >
          </div>

          <!-- Actions: Reset local / Apply to refine -->
          <div class="text-center flex flex-row mt-4 mx-2 gap-2">
            <button
              class="btn btn-block btn-sm w-1/2"
              :disabled="!canRefine"
              @click="resetLocal(range)"
            >
              {{ $t('reset') }}
            </button>
            <button
              class="btn btn-block btn-sm w-1/2 btn-primary"
              :disabled="!canRefine || !hasUnsaved(currentRefinement, range)"
              :aria-disabled="(!canRefine || !hasUnsaved(currentRefinement, range)).toString()"
              @click="applyRefinement(refine, range)"
            >
              {{ $t('apply') }}
              <span
                v-if="hasUnsaved(currentRefinement, range)"
                class="ml-1 text-md align-top text-warning-500 dark:text-warning-400"
              >•</span>
            </button>
          </div>
        </template>
      </ais-range-input>

      <!-- ===== STRING: original refinement list (unchanged) ===== -->
      <ais-refinement-list
        v-else
        :attribute="attributeName"
        :operator="operatorType"
        :sort-by="['isRefined', 'count', 'name:asc']"
        :searchable="isSearchable"
        :limit="5"
        :show-more="true"
        :show-more-limit="10"
        :class-names="{
          'ais-RefinementList-labelText': 'text-xs',
          'ais-RefinementList-checkbox': 'checkbox checkbox-xs',
          'ais-RefinementList-count': 'badge badge-secondary font-bold text-white text-xs'
        }"
      >
        <template #noResults="{ query }">
          {{ $t('noResults') }}
        </template>

        <template #showMoreLabel="{ isShowingMore }">
          {{ !isShowingMore ? 'More' : 'Less' }}
        </template>

        <template #default="{ items, refine, searchForItems, isShowingMore, canToggleShowMore, toggleShowMore }">
          <div
            v-if="!items.length"
            class="max-w-[250px] mx-auto my-2"
          >
            <p>{{ $t('noResults') }}</p>
            <p>{{ $t('tryAdjustingFacets') }}</p>
          </div>

          <ais-search-box
            v-if="isSearchable && items.length > 0"
            class="p-1 max-w-[250px] mx-auto"
          >
            <div class="formkit-inner !rounded-3xl">
              <label
                :aria-label="$t('searchInFacet', { facetName: $t(headerText) })"
                :for="inputId"
                class="label-text !text-sm !mb-0 !p-0 !text-neutral-500 dark:!text-neutral-300"
              />
              <input
                :id="inputId"
                type="search"
                class="!text-sm p-1 !rounded-3xl w-full bg-white dark:bg-gray-800 text-neutral-700 dark:text-neutral-300 focus:outline-none ring-primary-200 ring-2 focus:ring-2 focus:ring-primary-500 px-2"
                :placeholder="$t('search')"
                @input="(e) => { searchForItems(e?.currentTarget?.value) }"
              >
            </div>
          </ais-search-box>

          <ul
            v-if="items.length > 0"
            class="ais-RefinementList py-2 max-md:max-w-[300px]"
          >
            <li
              v-for="item in items"
              :key="item.value"
              class="ais-RefinementList-item max-w-[250px]"
            >
              <label
                class="ais-RefinementList-label"
                :aria-label="$t('refineBy', { label: item.label })"
                for="checkbox"
                @click="refine(item.value)"
              >
                <input
                  class="ais-RefinementList-checkbox checkbox-primary checkbox checkbox-xs"
                  type="checkbox"
                  name="checkbox"
                  :value="item.value"
                  :checked="item.isRefined ?? 'checked'"
                  :aria-checked="item.isRefined"
                  :title="$t('refineBy', { label: item.label })"
                  :aria-label="$t('refineBy', { label: item.label })"
                >
                <span>
                  {{ $t(item.label.replace('_', ':')) }}
                </span>
                <span class="ais-RefinementList-count badge bg-neutral text-xs font-bold text-white">
                  {{ item.count }}
                </span>
              </label>
            </li>
          </ul>

          <button
            v-if="items.length > 0"
            class="btn btn-xs btn-primary btn-outline btn-block mx-auto"
            :disabled="!canToggleShowMore"
            :aria-expanded="isShowingMore.toString()"
            @click="toggleShowMore"
          >
            {{ !isShowingMore ? $t('showMore') : $t('showLess') }}
          </button>
        </template>
      </ais-refinement-list>
    </template>
  </ais-panel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Slider from '@vueform/slider';

const props = defineProps({
    headerText: String,
    attributeName: String,
    operatorType: { type: String, default: 'or' },
    isSearchable: { type: Boolean, default: true },
    translateLabel: { type: Boolean, default: false },
    category: { type: String, default: null },

    // tell the component when to use numeric UI
    inputType: { type: String, default: null }, // set to 'numeric' to enable slider

    // fallback bounds if stats are missing
    fallbackMin: { type: Number, default: 0 },
    fallbackMax: { type: Number, default: 300 }
});

const inputId = `facet-search-${props.attributeName}_${Math.random().toString(36).substring(2, 15)}`;

// numeric detection: explicit prop wins; otherwise auto-detect duration facet
const isDurationName = computed(
    () => props.attributeName === 'item_duration_in_minutes' || props.attributeName === 'duration_in_minutes'
);
const isNumeric = computed(() =>
    props.inputType === 'numeric' ? true : props.inputType === 'string' ? false : isDurationName.value
);

// ----- local pending/applied state (so we only refine on submit) -----
const pending = ref<[number, number] | null>(null);
const lastApplied = ref<[number, number] | null>(null);

// helpers
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const boundMin = (range: { min?: number }) => (isFiniteNumber(range.min) ? Math.floor(range.min) : props.fallbackMin);
const boundMax = (range: { max?: number }) => (isFiniteNumber(range.max) ? Math.ceil(range.max) : props.fallbackMax);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));
const normalizePair = (lo: number, hi: number, min: number, max: number): [number, number] => {
    const a = clamp(lo, min, max);
    const b = clamp(hi, min, max);
    return a <= b ? [a, b] : [b, a];
};

function appliedFromCR(cr: { min?: number; max?: number }, range: { min?: number; max?: number }): [number, number] {
    const lo = cr.min ?? boundMin(range);
    const hi = cr.max ?? boundMax(range);
    return normalizePair(lo, hi, boundMin(range), boundMax(range));
}

// ensure a stable model for the slider (init from current refinement, resync if external change)
function pendingModel(cr: any, range: any): [number, number] {
    const applied = appliedFromCR(cr, range);
    if (!pending.value || !lastApplied.value || pendingChangedExternally(applied)) {
        pending.value = [...applied];
        lastApplied.value = [...applied];
    }
    return pending.value!;
}
function pendingChangedExternally(applied: [number, number]) {
    return !lastApplied.value || lastApplied.value[0] !== applied[0] || lastApplied.value[1] !== applied[1];
}

// UI interactions — update local only
function onSliderChangeLocal(val: [number, number], range: any) {
    const [lo, hi] = normalizePair(val[0], val[1], boundMin(range), boundMax(range));
    pending.value = [lo, hi];
}
function onMinChangeLocal(e: Event, range: any) {
    const lo = clamp(Number((e.target as HTMLInputElement).value), boundMin(range), boundMax(range));
    const hi = pending.value?.[1] ?? boundMax(range);
    pending.value = normalizePair(lo, hi, boundMin(range), boundMax(range));
}
function onMaxChangeLocal(e: Event, range: any) {
    const hi = clamp(Number((e.target as HTMLInputElement).value), boundMin(range), boundMax(range));
    const lo = pending.value?.[0] ?? boundMin(range);
    pending.value = normalizePair(lo, hi, boundMin(range), boundMax(range));
}

// buttons
function resetLocal(range: any) {
    pending.value = [boundMin(range), boundMax(range)]; // no refine until apply
}
function applyRefinement(refine: (v: any) => void, range: any) {
    if (!pending.value) return;
    const [lo, hi] = pending.value;
    // full span -> clear refinement so CurrentRefinements hides it
    if (lo === boundMin(range) && hi === boundMax(range)) {
        refine({ min: undefined, max: undefined });
        lastApplied.value = [lo, hi];
        return;
    }
    refine({ min: lo, max: hi });
    lastApplied.value = [lo, hi];
}
function hasUnsaved(cr: any, range: any) {
    const applied = appliedFromCR(cr, range);
    const p = pending.value ?? applied;
    return p[0] !== applied[0] || p[1] !== applied[1];
}

// facet icon mapping (attributeName → Tabler icon)
const ICON_MAP: Record<string, string> = {
    // item-level moved facets
    in_language_code: 'tabler-language',
    has_colour_type: 'tabler-palette',
    has_sound_type: 'tabler-volume',
    has_duration_has_value: 'tabler-clock-hour-3',
    has_extent_has_value: 'tabler-ruler',
    item_element_type: 'tabler-movie',
    has_format_type: 'tabler-disc',
    item_duration_in_minutes: 'tabler-clock-hour-3',

    // manifestation/work facets
    manifestation_event_type: 'tabler-calendar-event',
    located_in_has_name: 'tabler-map-pin',
    has_genre_has_name: 'tabler-category',
    subjects: 'tabler-tag',
    directors_or_editors: 'tabler-chair-director',
    castmembers: 'tabler-users',
    production: 'tabler-building-factory',
    has_form: 'tabler:shape',

    // numeric range helpers
    production_year_start: 'tabler-calendar',
    production_year_end: 'tabler-calendar',
    has_issuer_name: 'tabler-building'
};
const facetIcon = computed(() => ICON_MAP[props.attributeName as string] || 'tabler-adjustments-horizontal');
</script>

<style lang="scss">
/* your slider styles */
.slider-primary {
  --slider-connect-bg: var(--primary-50) !important;
  --slider-tooltip-bg: var(--secondary) !important;
  --slider-handle-ring-color: var(--accent) !important;
}
</style>
