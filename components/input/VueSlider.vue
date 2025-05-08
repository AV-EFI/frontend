<template>
  <div
    class="collapse collapse-arrow mt-2 mb-2"
    :title="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
    :alt="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
    tabindex="0"
  >
    <input
      type="checkbox"
      class="collapse-checkbox"
    >

    <!-- Panel Header -->
    <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white !min-h-5 !mb-0 flex flex-row justify-between">
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
      <ais-configure
        :numeric-filters="numericFilters"
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
          @end="onSliderEnd"
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
      <!-- Reset Button -->
      <div class="text-center mt-4">
        <button
          class="btn btn-xs btn-outline btn-secondary"
          @click="resetSlider"
        >
          {{ $t('reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Slider from '@vueform/slider';

const props = defineProps({
    headerText: { type: String, default: 'Production Year' },
    category: { type: String, default: null },
    min: { type: Number, default: 1850 },
    max: { type: Number, default: 2025 }
});

const resetSlider = () => {
    sliderValue.value = [props.min, props.max];
    onSliderEnd(sliderValue.value);
};

const indexName = useRuntimeConfig().public.ELASTIC_INDEX;
const route = useRoute();
const router = useRouter();

// Reactive slider state
const sliderValue = ref<[number, number]>([props.min, props.max]);

// Watch for query param changes and update slider
watchEffect(() => {
    const start = parseInt(route.query?.[`${indexName}[numericRefinement][production_year_start][>=]`] as string);
    const end = parseInt(route.query?.[`${indexName}[numericRefinement][production_year_end][<=]`] as string);
    sliderValue.value = [
        !isNaN(start) ? start : props.min,
        !isNaN(end) ? end : props.max
    ];
});

// Update URL query when slider drag ends
const onSliderEnd = ([from, to]: number[]) => {
    router.replace({
        path: route.path,
        query: {
            ...route.query,
            [`${indexName}[numericRefinement][production_year_start][>=]`]: from.toString(),
            [`${indexName}[numericRefinement][production_year_end][<=]`]: to.toString()
        }
    });
};

const numericFilters = computed(() => [
    `production_year_start >= ${sliderValue.value[0]}`,
    `production_year_end <= ${sliderValue.value[1]}`
]);

</script>

<style lang="scss">
@import '../../assets/scss/slider_tailwind.scss';

.slider-primary {
  --slider-connect-bg: var(--primary-50)!important;
  --slider-tooltip-bg: var(--secondary)!important;
  --slider-handle-ring-color: var(--accent)!important;
}
</style>