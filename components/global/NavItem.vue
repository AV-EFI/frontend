<template>
    <a
        v-if="to"
        :href="to"
        :aria-current="isCurrent ? 'page' : undefined"
        @click="emit('click', $event)"
    >
        <Icon :name="icon" class="icon-action" aria-hidden="true" />
        <span>{{ label }}</span>
        <span v-if="badge !== undefined" class="badge badge-sm" :class="badgeClass">{{ badge }}</span>
    </a>
    <button
        v-else
        type="button"
        :aria-haspopup="haspopup"
        @click="emit('click', $event)"
    >
        <Icon :name="icon" class="icon-action" aria-hidden="true" />
        <span>{{ label }}</span>
        <span v-if="badge !== undefined" class="badge badge-sm" :class="badgeClass">{{ badge }}</span>
    </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

/**
 * One header navigation entry: always an icon plus a visible text label.
 * With `to` it renders a link (and marks the current page), otherwise a button.
 */
const props = defineProps<{
    icon: string;
    label: string;
    to?: string;
    badge?: number | string;
    badgeClass?: string;
    haspopup?: 'dialog' | 'true';
}>();

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const route = useRoute();

const pathOf = (url: string) => (url.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/';

const isCurrent = computed(() => {
    if (!props.to) return false;
    const target = pathOf(props.to);
    const current = pathOf(route.path);
    return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
});
</script>
