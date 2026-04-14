<template>
    <span
        ref="anchorEl"
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

        <Teleport to="body">
            <span
                v-show="open"
                :id="tooltipId"
                role="tooltip"
                :style="tooltipStyle"
                class="fixed z-[9999] max-w-sm rounded-md bg-neutral/90 px-3 py-2 text-xs text-neutral-content shadow-lg pointer-events-none"
            >
                {{ text }}
            </span>
        </Teleport>
    </span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();

const { t } = useI18n();
const open = ref(false);
const anchorEl = ref<HTMLElement | null>(null);
const tooltipStyle = ref<Record<string, string>>({
    top: '0px',
    left: '0px',
});

const accessibleLabel = computed(() => `${t('info')}: ${props.text}`);
const tooltipId = computed(() => {
    const normalized = (props.text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);

    return `tooltip-${normalized || 'info'}`;
});

const updateTooltipPosition = () => {
    if (!process.client || !anchorEl.value) return;

    const rect = anchorEl.value.getBoundingClientRect();
    tooltipStyle.value = {
        top: `${Math.round(rect.bottom + 8)}px`,
        left: `${Math.round(Math.max(8, rect.left))}px`,
    };
};

watch(open, async (isOpen) => {
    if (!process.client) return;

    if (isOpen) {
        await nextTick();
        updateTooltipPosition();
        window.addEventListener('scroll', updateTooltipPosition, true);
        window.addEventListener('resize', updateTooltipPosition);
    } else {
        window.removeEventListener('scroll', updateTooltipPosition, true);
        window.removeEventListener('resize', updateTooltipPosition);
    }
});

onBeforeUnmount(() => {
    if (!process.client) return;

    window.removeEventListener('scroll', updateTooltipPosition, true);
    window.removeEventListener('resize', updateTooltipPosition);
});
</script>
