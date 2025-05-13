<template>
  <div
    class="collapse collapse-arrow mt-1 mb-1"
    :title="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
    :alt="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
    tabindex="0"
  >
    <input
      type="checkbox"
      class="collapse-checkbox"
    >

    <!-- Panel Header -->
    <div class="collapse-title bg-slate-50 dark:bg-slate-800 dark:text-white !min-h-5 !mb-0 flex flex-row justify-between">
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

    <!-- Panel Body -->
    <div class="collapse-content !pl-0 pr-0 bg-slate-50 dark:bg-slate-900 dark:text-white text-xs">
      <!-- Hidden configure filter -->
      <ais-configure
        :numeric-filters="[
          `production_in_year >= ${appliedSliderValue[0]}`,
          `production_in_year <= ${appliedSliderValue[1]}`
        ]"
        :optional-filters="appliedIncludeMissing ? ['production_in_year IS NULL'] : []"
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
        />
        <div class="w-1/3 flex flex-col justify-center h-100 mb-3.5 justify-items-center">
          <Icon
            class="align-self-center mx-auto dark:text-white"
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
        />
      </div>

      <!-- Include missing years checkbox -->
      <div
        class="text-center mt-2 py-2 px-4"
        :alt="$t('includeMissingProductionYearExtended')"
        :title="$t('includeMissingProductionYearExtended')"
      >
        <label class="label cursor-pointer text-xs">
          <input
            v-model="includeMissingYears"
            type="checkbox"
            class="checkbox checkbox-xs"
          >
          <span class="label-text ml-2">{{ $t('includeMissingProductionYear') }}</span>
        </label>
      </div>

      <!-- Apply Button -->
      <!-- Reset Button -->
      <div class="text-center flex flex-row mt-4">
        <button
          class="btn btn-block btn-sm w-1/2 btn-outline btn-secondary"
          @click="resetSlider"
        >
          {{ $t('reset') }}
        </button>
        <button
          class="btn btn-block btn-sm w-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasUnsavedChanges"
          @click="applySlider"
        >
          {{ $t('apply') }}
          <span
            v-if="hasUnsavedChanges"
            class="ml-1 text-xs align-top text-red-500"
          >•</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Slider from '@vueform/slider';

const props = defineProps({
    headerText: { type: String, default: 'Production Year' },
    category: { type: String, default: null },
    min: { type: Number, default: 1896 },
    max: { type: Number, default: 2025 }
});

const appliedSliderValue = ref<[number, number]>([props.min, props.max]);
const appliedIncludeMissing = ref(true);


const indexName = useRuntimeConfig().public.ELASTIC_INDEX;
const route = useRoute();
const router = useRouter();

const sliderValue = ref<[number, number]>([props.min, props.max]);
const includeMissingYears = ref(false);

onMounted(() => {
    const start = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][>=]`] as string);
    const end = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][<=]`] as string);
    const missing = route.query?.[`${indexName}[includeMissingProductionYear]`] === '1';

    sliderValue.value = [
        !isNaN(start) ? start : props.min,
        !isNaN(end) ? end : props.max
    ];
    includeMissingYears.value = missing;

    // Initialize applied values
    appliedSliderValue.value = [...sliderValue.value];
    appliedIncludeMissing.value = missing;
});

const resetSlider = () => {
    sliderValue.value = [props.min, props.max];
    applySlider();
};

watchEffect(() => {
    const start = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][>=]`] as string);
    const end = parseInt(route.query?.[`${indexName}[numericRefinement][production_in_year][<=]`] as string);
    sliderValue.value = [
        !isNaN(start) ? start : props.min,
        !isNaN(end) ? end : props.max
    ];
});

// Sync slider value to query string
/*
const onSliderEnd = ([from, to]: number[]) => {
    router.replace({
        path: route.path,
        query: {
            ...route.query,
            [`${indexName}[numericRefinement][production_in_year][>=]`]: from.toString(),
            [`${indexName}[numericRefinement][production_in_year][<=]`]: to.toString()
        }
    });
};
*/
const applySlider = () => {
    const [from, to] = sliderValue.value;

    // Update applied state (drives <ais-configure>)
    appliedSliderValue.value = [from, to];
    appliedIncludeMissing.value = includeMissingYears.value;

    // Update URL
    const updatedQuery = {
        ...route.query,
        [`${indexName}[numericRefinement][production_in_year][>=]`]: from.toString(),
        [`${indexName}[numericRefinement][production_in_year][<=]`]: to.toString()
    };

    if (includeMissingYears.value) {
        updatedQuery[`${indexName}[includeMissingProductionYear]`] = '1';
    } else {
        delete updatedQuery[`${indexName}[includeMissingProductionYear]`];
    }

    router.replace({
        path: route.path,
        query: updatedQuery
    });
};

const hasUnsavedChanges = computed(() => {
    const [from, to] = sliderValue.value;
    const [appliedFrom, appliedTo] = appliedSliderValue.value;
    return (
        from !== appliedFrom ||
    to !== appliedTo ||
    includeMissingYears.value !== appliedIncludeMissing.value
    );
});

// Sync checkbox state to query string
/*
const updateCheckboxQuery = () => {
    if (includeMissingYears.value) {
        router.replace({
            path: route.path,
            query: {
                ...route.query,
                [`${indexName}[includeMissingProductionYear]`]: '1'
            }
        });
    } else {
        const { [`${indexName}[includeMissingProductionYear]`]: _, ...rest } = route.query;
        router.replace({
            path: route.path,
            query: rest
        });
    }
};
*/
// InstantSearch numeric filters
const numericFilters = computed(() => [
    `production_in_year >= ${sliderValue.value[0]}`,
    `production_in_year <= ${sliderValue.value[1]}`
]);

// Optional: can be used by Searchkit if you customize the backend to pick this up
const optionalFilters = computed(() => {
    return includeMissingYears.value ? [`production_in_year IS NULL`] : [];
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
