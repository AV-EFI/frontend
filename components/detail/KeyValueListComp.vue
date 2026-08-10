<template>
    <div class="flex flex-col">
        <!-- LABEL (fixed baseline, space always reserved) -->
        <div v-if="keytxt" class="h-4 flex items-start">
            <MicroLabelComp
                :label-text="keytxt"
            />
        </div>

        <!-- CONTENT (single normalized offset) -->
        <div class="mt-1">
            <!-- NON-LIST DISPLAY -->
            <div
                v-if="!ul"
                class="flex flex-row flex-wrap items-start min-h-8 h-8 leading-5 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <!-- CLIPBOARD MODE -->
                <template v-if="clip">
                    <GlobalClipboardComp
                        v-for="val in valtxt"
                        :key="getValueKey(val)"
                        :display-text="displayTextFrom(val)"
                        :copy-text="clipText ? clipText : displayTextFrom(val)"
                        class="flex items-start h-8 leading-5 mr-2 min-w-6"
                        :class="fontSize"
                    />
                </template>

                <!-- TEXT MODE -->
                <span
                    v-else
                    class="grow h-8 flex items-start leading-5 text-xs"
                >
                    <template v-for="(val, index) in valtxt" :key="getValueKey(val)">
                        <span v-if="index > 0">, </span>
                        <SearchClickableFacetValue
                            v-if="facetAttribute && facetValueFrom(val)"
                            :attribute="facetAttribute"
                            :value="facetValueFrom(val)"
                            :label="displayTextFrom(val)"
                        >
                            {{ displayTextFrom(val) }}
                        </SearchClickableFacetValue>
                        <span v-else>{{ displayTextFrom(val) }}</span>
                    </template>
                </span>

                <!-- SAME AS -->
                <DetailSameAsComp
                    v-if="sameAs"
                    :same-as-data="sameAsData"
                    :type="sameAsType"
                    class="h-8 flex items-start"
                    :class="fontSize"
                />
            </div>

            <!-- LIST DISPLAY -->
            <div
                v-else
                :class="[
                    'min-h-8',
                    'max-h-48',
                    overflowY,
                    'overflow-x-visible'
                ]"
            >
                <!-- background & padding moved INSIDE to preserve baseline -->
                <div
                    :class="[
                        { 'bg-base-100 dark:bg-gray-900 p-2 rounded-lg': bgColor },
                        overflowY,
                    ]"
                >
                    <ul
                        v-if="displayValues.length"
                        :aria-label="keytxt ? $t(keytxt) : undefined"
                    >
                        <li
                            v-for="val in displayValues"
                            :key="getValueKey(val)"
                            class="flex flex-row items-start justify-between min-h-6 leading-5 hover:bg-gray-100 dark:hover:bg-gray-700"
                            :class="fontSize"
                        >
                            <SearchClickableFacetValue
                                v-if="facetAttribute && facetValueFrom(val)"
                                :attribute="facetAttribute"
                                :value="facetValueFrom(val)"
                                :label="displayTextFrom(val)"
                                class="grow flex items-start leading-5"
                                :class="[narrow ? 'w-3/4' : '']"
                            >
                                {{ displayTextFrom(val) }}
                            </SearchClickableFacetValue>

                            <span
                                v-else
                                class="grow flex items-start leading-5"
                                :class="[narrow ? 'w-3/4' : '']"
                            >
                                {{ displayTextFrom(val) }}
                            </span>

                            <DetailSameAsComp
                                v-if="sameAs"
                                :same-as-data="sameAsRefsFrom(val)"
                                :type="sameAsType"
                                class="flex items-start shrink-0 mr-4"
                                :class="fontSize"
                            />
                        </li>
                    </ul>

                    <span
                        v-else
                        aria-hidden="true"
                    >
                        -
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
    keytxt: {
        type: String,
        required: false,
        default: null
    },
    valtxt: {
        type: Array as PropType<RawValue[]>,
        required: true
    },
    sameAs: {
        type: Boolean,
        default: false
    },
    ul: {
        type: Boolean,
        default: false
    },
    bgColor: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: String,
        required: false,
        default: 'text-sm'
    },
    overflowY: {
        type: String,
        default: 'overflow-y-auto'
    },
    clip: {
        type: Boolean,
        default: true
    },
    clipText: {
        type: String,
        default: null
    },
    sameAsType: {
        type: String,
        default: 'film'
    },
    narrow: {
        type: Boolean,
        default: false
    },
    facetAttribute: {
        type: String,
        default: ''
    }
});

type SameAsRef = {
    category?: string;
    id?: string;
};

type DisplayValue = {
    has_name?: string;
    category?: string;
    same_as?: SameAsRef[];
};
type RawValue = string | number | DisplayValue;

function isDisplayValue(value: unknown): value is DisplayValue {
    return Boolean(value && typeof value === 'object');
}

function getValueKey(value: unknown): string {
    if (!value || typeof value !== 'object') return String(value);
    const displayValue = value as DisplayValue;

    const sameAsKey = Array.isArray(displayValue.same_as)
        ? displayValue.same_as
            .map((sameAs) => `${sameAs?.category || ''}:${sameAs?.id || ''}`)
            .filter(Boolean)
            .sort()
            .join('|')
        : '';

    return [
        displayValue.has_name || '',
        displayValue.category || '',
        sameAsKey
    ].join('::');
}

function displayTextFrom(value: unknown): string {
    if (isDisplayValue(value) && typeof value.has_name === 'string') return value.has_name;
    return String(value ?? '');
}

function facetValueFrom(value: unknown): string {
    if (isDisplayValue(value) && typeof value.has_name === 'string') return value.has_name.trim();
    return (typeof value === 'string' ? value : '').trim();
}

function sameAsRefsFrom(value: unknown): SameAsRef[] {
    return isDisplayValue(value) && Array.isArray(value.same_as) ? value.same_as : [];
}

const displayValues = computed(() => {
    const values = Array.isArray(props.valtxt) ? props.valtxt : [];

    if (!props.sameAs || !props.ul) return values;

    const seen = new Set<string>();
    return values.filter((value) => {
        const key = getValueKey(value);
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
});

const sameAsData = computed<SameAsRef[]>(() => {
    if (props.keytxt === 'avefi:Subject') {
        return props.valtxt
            .map((value) => ({ id: displayTextFrom(value), category: props.keytxt || undefined }))
            .filter((entry) => entry.id);
    }

    return props.valtxt.flatMap(sameAsRefsFrom);
});
</script>
