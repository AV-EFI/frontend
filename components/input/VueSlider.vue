<template>
  <div
    class="collapse collapse-arrow border-2 border-primary dark:border-primary-600 bg-white rounded-lg mb-1 max-md:!w-[90vw]"
    :title="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
    :alt="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
    tabindex="0"
  >
    <input
      type="checkbox"
      class="collapse-checkbox"
      :aria-label="$t('togglePanel')"
    >

    <div class="collapse-title bg-slate-50 dark:bg-gray-800 dark:text-white !min-h-5 !mb-0 flex flex-row justify-between">
      <h4 class="my-auto font-bold text-primary-600 dark:text-primary-100">
        {{ $t(headerText) }}
      </h4>
      <MicroBadgeCategoryComp
        v-if="category"
        :category="category"
        :dense="true"
        class="my-auto"
      />
    </div>

    <div class="collapse-content !pl-0 pr-0 bg-slate-50 dark:bg-slate-900 dark:text-white text-xs">
      <ais-configure
        :key="`${appliedSliderValue.join('-')}-${appliedProdYearOnly}`"
        :numeric-refinements="{
          ...(appliedSliderValue[0] !== props.min || appliedSliderValue[1] !== props.max
            ? {
              'production_in_year': {
                '>=': appliedSliderValue[0],
                '<=': appliedSliderValue[1]
              }
            }
            : {}),
          ...(appliedProdYearOnly
            ? {
              'prodYearsOnly': { '=': 1 }
            }
            : {})
        }"
        class="hidden"
      />

      <div class="p-4 m-4">
        <Slider
          v-model="sliderValue"
          :min="props.min"
          :max="props.max"
          :step="1"
          thumb-label
          class="w-full h-8"
          :aria-label="$t('refineBy', { headerText: $t(headerText) })"
        />
      </div>

      <div class="flex flex-row justify-around mt-2 p-2">
        <FormKit
          v-model="sliderValue[0]"
          type="number"
          outer-class="!w-8"
          :min="min"
          :max="max"
          :placeholder="String(min)"
          number="integer"
          :aria-label="$t('minimumProductionYear')"
        />
        <div class="w-1/3 flex flex-col justify-center mb-3.5">
          <Icon
            class="mx-auto dark:text-white"
            name="formkit:arrowright"
          />
        </div>
        <FormKit
          v-model="sliderValue[1]"
          type="number"
          outer-class="!w-8"
          :min="min"
          :max="max"
          :placeholder="String(max)"
          number="integer"
          :aria-label="$t('maximumProductionYear')"
        />
      </div>

      <div
        class="text-center mt-2 py-2 px-4"
        :title="$t('prodYearOnlyProductionYearExtended')"
      >
        <label class="label cursor-pointer text-xs">
          <input
            v-model="prodYearOnly"
            type="checkbox"
            class="checkbox checkbox-xs"
          >
          <span class="label-text ml-2">{{ $t('prodYearOnlyProductionYear') }}</span>
        </label>
      </div>

      <div class="text-center flex flex-row mt-4 mx-2">
        <button
          class="btn btn-block btn-sm w-1/2"
          @click="resetSlider"
        >
          {{ $t('reset') }}
        </button>
        <button
          class="btn btn-block btn-sm w-1/2 btn-primary"
          :disabled="!hasUnsavedChanges"
          @click="applySlider"
        >
          {{ $t('apply') }}
          <span
            v-if="hasUnsavedChanges"
            class="ml-1 text-md align-top text-warning-500 dark:text-warning-400"
          >•</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Slider from '@vueform/slider';

const props = defineProps({
    headerText: { type: String, default: 'Production Year' },
    category: { type: String, default: null },
    min: { type: Number, default: 1896 },
    max: { type: Number, default: 2025 },
});

const indexName = useRuntimeConfig().public.ELASTIC_INDEX;
const route = useRoute();
const router = useRouter();

const sliderValue = ref<[number, number]>([props.min, props.max]);
const prodYearOnly = ref(false);
const appliedSliderValue = ref<[number, number]>([props.min, props.max]);
const appliedProdYearOnly = ref(false);

onMounted(() => {
    const start = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][>=]`] as string);
    const end = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][<=]`] as string);
    const raw = route.query?.[`${indexName}[numericRefinement][prodYearsOnly][=]`] === '1';

    if (!isNaN(start) && !isNaN(end)) {
        sliderValue.value = [start, end];
        appliedSliderValue.value = [start, end];
    }

    prodYearOnly.value = raw;
    appliedProdYearOnly.value = raw;
});

watchEffect(() => {
    const start = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][>=]`] as string);
    const end = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][<=]`] as string);
    sliderValue.value = [
        !isNaN(start) ? start : props.min,
        !isNaN(end) ? end : props.max,
    ];
});

const resetSlider = () => {
    sliderValue.value = [props.min, props.max];
    prodYearOnly.value = false;
    applySlider();
};

const applySlider = () => {
    const [from, to] = sliderValue.value;
    const isDefaultRange = from === props.min && to === props.max;

    appliedSliderValue.value = [from, to];
    appliedProdYearOnly.value = prodYearOnly.value;

    // Parse current URL params directly
    const urlParams = new URLSearchParams(window.location.search);

    // Remove existing slider-related params
    for (const key of Array.from(urlParams.keys())) {
        if (
            key.startsWith(`${indexName}[numericRefinement][production_in_year][`) ||
      key === `${indexName}[numericRefinement][prodYearsOnly][=]`
        ) {
            urlParams.delete(key);
        }
    }

    // Add new slider params if different from default
    if (!isDefaultRange) {
        urlParams.set(`${indexName}[numericRefinement][production_in_year][>=]`, from.toString());
        urlParams.set(`${indexName}[numericRefinement][production_in_year][<=]`, to.toString());
    }

    if (prodYearOnly.value) {
        urlParams.set(`${indexName}[numericRefinement][prodYearsOnly][=]`, '1');
    }

    // Convert URLSearchParams back to plain object for Vue Router
    const updatedQuery: Record<string, string> = {};
    for (const [key, value] of urlParams.entries()) {
        updatedQuery[key] = value;
    }

    // Update the route with merged query params
    router.replace({
        path: route.path,
        query: updatedQuery,
    });

    // Trigger InstantSearch to sync from URL
    window.dispatchEvent(
        new StorageEvent('storage', {
            key: 'latest-search-query',
            newValue: window.location.search,
        }),
    );
};


const hasUnsavedChanges = computed(() => {
    const [from, to] = sliderValue.value;
    const [appliedFrom, appliedTo] = appliedSliderValue.value;
    return (
        from !== appliedFrom || to !== appliedTo || prodYearOnly.value !== appliedProdYearOnly.value
    );
});
</script>

<style lang="scss">
@import '../../assets/scss/slider_tailwind.scss';

.slider-primary {
  --slider-connect-bg: var(--primary-50) !important;
  --slider-tooltip-bg: var(--secondary) !important;
  --slider-handle-ring-color: var(--accent) !important;
}
</style>
