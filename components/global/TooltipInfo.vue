<template>
    <span
        class="relative inline-flex items-center align-text-middle"
        @mouseenter="open = true"
        @mouseleave="open = false"
    >
        <button
            type="button"
            class="ml-1 badge badge-neutral badge-sm inline-flex max-w-8 cursor-help items-center text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            :aria-label="accessibleLabel"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="tooltipId"
            @click="open = true"
            @focus="open = true"
            @blur="open = false"
            @keydown.escape.prevent="open = false"
        >
            <span class="sr-only">{{ accessibleLabel }}</span>
            <Icon name="tabler:info-circle" aria-hidden="true" />
        </button>

        <span
            v-show="open"
            :id="tooltipId"
            role="tooltip"
            class="absolute left-0 top-full z-30 mt-2 max-w-xs rounded-md bg-neutral px-3 py-2 text-xs text-neutral-content shadow-lg"
        >
            {{ text }}
        </span>
    </span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();

const { t } = useI18n();
const tooltipId = useId();
const open = ref(false);

const accessibleLabel = computed(() => `${t('info')}: ${props.text}`);
</script>
