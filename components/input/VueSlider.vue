<template>
    <div
        class="collapse collapse-arrow border-2 border-base-200 dark:border-gray-600 dark:bg-gray-900 rounded-lg mb-1 max-md:!w-[90vw]"
        :title="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
        :alt="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
        tabindex="0"
    >
        <input type="checkbox" class="collapse-checkbox" :aria-label="$t('togglePanel')">

        <div class="collapse-title dark:bg-gray-800 dark:text-white !min-h-5 !mb-0 flex flex-row justify-between">
            <div class="flex items-center gap-2">
                <Icon
                    :name="facetIcon"
                    class="w-4 h-4"
                    :class="hasActiveRefinements ? 'text-primary-600 dark:text-primary-100' : 'text-primary-200 dark:text-primary-600'"
                    aria-hidden="true"
                />
                <h3
                    :id="`facet-title-${props.attributeName}`"
                    class="my-auto font-bold"
                    :class="hasActiveRefinements ? 'text-primary-600 dark:text-primary-100' : 'text-primary-200 dark:text-primary-600'"
                >
                    {{ $t(headerText as string) }}
                </h3>
            </div>
            <MicroBadgeCategoryComp v-if="category" :category="category" :dense="true" class="my-auto" />
        </div>

        <div class="collapse-content !pl-0 pr-0 dark:text-white text-xs dark:bg-gray-900">
            <ais-configure
                v-if="sliderReady"
                :key="configureKey"
                :numeric-refinements="configureNumericRefinements"
                class="hidden"
            />

            <div class="p-4 m-4 dark:bg-gray-800 rounded-lg">
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

            <div class="flex flex-row justify-around mt-2 p-2 dark:bg-gray-800 rounded-lg">
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
                    <Icon class="mx-auto dark:text-white" name="tabler:arrow-right" />
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
                class="text-center mt-2 py-2 px-4 dark:bg-gray-800 rounded-lg"
                :title="$t('prodYearOnlyProductionYearExtended')"
            >
                <label class="label cursor-pointer text-xs">
                    <input v-model="prodYearOnly" type="checkbox" class="checkbox checkbox-xs">
                    <span class="label-text ml-2">{{ $t('prodYearOnlyProductionYear') }}</span>
                </label>
            </div>

            <div class="text-center flex flex-row mt-4 mx-2 dark:bg-gray-800 rounded-lg">
                <button class="btn btn-block btn-xs w-1/2" @click="resetSlider">
                    {{ $t('reset') }}
                </button>
                <button class="btn btn-block btn-xs w-1/2 btn-primary" :disabled="!hasUnsavedChanges" @click="applySlider">
                    {{ $t('apply') }}
                    <span v-if="hasUnsavedChanges" class="ml-1 text-md align-top text-warning-500 dark:text-warning-400">•</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// facet icon mapping
import { FACET_ICON_MAP as ICON_MAP } from '@/models/interfaces/manual/IFacetIconMapping';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Slider from '@vueform/slider';
import { useFormKitLoader } from '~/composables/useFormKitLoader';

const { ensureFormKitReady } = useFormKitLoader();
await ensureFormKitReady();

const props = defineProps({
    headerText: { type: String, default: 'Production Year' },
    attributeName: { type: String, default: 'production_in_year' },
    category: { type: String, default: null },
    min: { type: Number, default: 1896 },
    max: { type: Number, default: 2025 },
});

const facetIcon = computed(() => ICON_MAP[props.attributeName as string] || 'tabler-adjustments-horizontal');

const route = useRoute();
const router = useRouter();

function getSingleQueryValue(value: unknown): string | undefined {
    if (Array.isArray(value)) {
        return typeof value[0] === 'string' ? value[0] : undefined;
    }
    return typeof value === 'string' ? value : undefined;
}

function parseIntOrUndefined(value: unknown): number | undefined {
    const single = getSingleQueryValue(value);
    if (!single) return undefined;

    const parsed = parseInt(single, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function parseBooleanOne(value: unknown): boolean {
    return getSingleQueryValue(value) === '1';
}

function clampRange(range: [number, number]): [number, number] {
    let [from, to] = range;

    if (!Number.isFinite(from)) from = props.min;
    if (!Number.isFinite(to)) to = props.max;

    from = Math.max(props.min, Math.min(props.max, Math.trunc(from)));
    to = Math.max(props.min, Math.min(props.max, Math.trunc(to)));

    if (from > to) {
        return [to, from];
    }

    return [from, to];
}

function getStateFromRoute(query: Record<string, unknown>) {
    const start = parseIntOrUndefined(query['numericRefinement[production_in_year][>=]']);
    const end = parseIntOrUndefined(query['numericRefinement[production_in_year][<=]']);
    const only = parseBooleanOne(query['numericRefinement[prodYearsOnly][=]']);

    const range = clampRange([
        start ?? props.min,
        end ?? props.max,
    ]);

    return {
        range,
        prodYearOnly: only,
    };
}

// IMPORTANT: initialize synchronously from route query
const initialState = getStateFromRoute(route.query as Record<string, unknown>);

const sliderValue = ref<[number, number]>([...initialState.range] as [number, number]);
const prodYearOnly = ref(initialState.prodYearOnly);

const appliedSliderValue = ref<[number, number]>([...initialState.range] as [number, number]);
const appliedProdYearOnly = ref(initialState.prodYearOnly);

// Guard initial hidden configure render until state is seeded from URL
const sliderReady = ref(true);

const hasActiveRefinements = computed(() => {
    return (
        appliedSliderValue.value[0] !== props.min ||
        appliedSliderValue.value[1] !== props.max ||
        appliedProdYearOnly.value
    );
});

const hasUnsavedChanges = computed(() => {
    const [from, to] = clampRange(sliderValue.value);
    const [appliedFrom, appliedTo] = appliedSliderValue.value;

    return (
        from !== appliedFrom ||
        to !== appliedTo ||
        prodYearOnly.value !== appliedProdYearOnly.value
    );
});

const configureKey = computed(() => {
    return `${appliedSliderValue.value[0]}-${appliedSliderValue.value[1]}-${appliedProdYearOnly.value ? '1' : '0'}`;
});

const configureNumericRefinements = computed(() => {
    const [from, to] = appliedSliderValue.value;

    return {
        ...(from !== props.min || to !== props.max
            ? {
                production_in_year: {
                    '>=': from,
                    '<=': to,
                },
            }
            : {}),
        ...(appliedProdYearOnly.value
            ? {
                prodYearsOnly: {
                    '=': 1,
                },
            }
            : {}),
    };
});

// Keep local and applied state in sync with route changes coming from browser navigation
// or other widgets / clear refinements, but do not run an immediate reset after initial sync.
watch(
    () => route.query,
    (query) => {
        const nextState = getStateFromRoute(query as Record<string, unknown>);

        sliderValue.value = [...nextState.range] as [number, number];
        appliedSliderValue.value = [...nextState.range] as [number, number];
        prodYearOnly.value = nextState.prodYearOnly;
        appliedProdYearOnly.value = nextState.prodYearOnly;
    }
);

const resetSlider = () => {
    sliderValue.value = [props.min, props.max];
    prodYearOnly.value = false;
    applySlider();
};

const applySlider = () => {
    const [from, to] = clampRange(sliderValue.value);
    const isDefaultRange = from === props.min && to === props.max;

    sliderValue.value = [from, to];
    appliedSliderValue.value = [from, to];
    appliedProdYearOnly.value = prodYearOnly.value;

    const urlParams = new URLSearchParams(window.location.search);

    // Remove existing slider-related params first
    for (const key of Array.from(urlParams.keys())) {
        if (
            key.startsWith('numericRefinement[production_in_year][') ||
            key === 'numericRefinement[prodYearsOnly][=]'
        ) {
            urlParams.delete(key);
        }
    }

    // Add production year only if not default range
    if (!isDefaultRange) {
        urlParams.set('numericRefinement[production_in_year][>=]', String(from));
        urlParams.set('numericRefinement[production_in_year][<=]', String(to));
    }

    if (prodYearOnly.value) {
        urlParams.set('numericRefinement[prodYearsOnly][=]', '1');
    }

    const updatedQuery: Record<string, string | string[]> = {};
    for (const [key, value] of urlParams.entries()) {
        if (updatedQuery[key] === undefined) {
            updatedQuery[key] = value;
        } else if (Array.isArray(updatedQuery[key])) {
            (updatedQuery[key] as string[]).push(value);
        } else {
            updatedQuery[key] = [updatedQuery[key] as string, value];
        }
    }

    router.replace({
        path: route.path,
        query: updatedQuery,
    });
};

const clearFromExternalEvent = () => {
    sliderValue.value = [props.min, props.max];
    appliedSliderValue.value = [props.min, props.max];
    prodYearOnly.value = false;
    appliedProdYearOnly.value = false;
};

onMounted(() => {
    window.addEventListener('avefi:clear-production-year', clearFromExternalEvent);
});

onBeforeUnmount(() => {
    window.removeEventListener('avefi:clear-production-year', clearFromExternalEvent);
});
</script>

<style lang="scss">
@use '../../assets/scss/slider_tailwind.scss';

.slider-primary {
  --slider-connect-bg: var(--primary-50) !important;
  --slider-tooltip-bg: var(--secondary) !important;
  --slider-handle-ring-color: var(--accent) !important;
}
</style>
