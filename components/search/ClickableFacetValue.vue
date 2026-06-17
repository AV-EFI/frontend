<template>
    <a
        v-if="opensInNewTab && canToggle"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex max-w-full rounded-sm text-left text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        :class="{ 'font-semibold decoration-current': active }"
        :aria-label="ariaLabel"
        :title="ariaLabel"
    >
        <span class="min-w-0 break-words">
            <slot>{{ label }}</slot>
        </span>
    </a>
    <button
        v-else
        type="button"
        class="inline-flex max-w-full rounded-sm text-left text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-default disabled:text-base-content disabled:no-underline"
        :class="{ 'font-semibold decoration-current': active }"
        :disabled="!canToggle"
        :aria-label="ariaLabel"
        :aria-pressed="active ? 'true' : 'false'"
        :title="ariaLabel"
        @click="toggle"
    >
        <span class="min-w-0 break-words">
            <slot>{{ label }}</slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { clickableFacetLabelKey } from '~/config/clickableFacetConfig';

const props = withDefaults(defineProps<{
    attribute?: string
    value?: string | number | null
    label?: string
    openInNewTab?: boolean
}>(), {
    attribute: '',
    value: '',
    label: '',
    openInNewTab: false,
});

const { t, te } = useI18n();
const route = useRoute();
const { getFacetToggleHref, isFacetValueActive, toggleFacetValue } = useSearchFacetToggle();

const normalizedValue = computed(() => String(props.value ?? '').trim());
const normalizedLabel = computed(() => String(props.label || normalizedValue.value).trim());
const canToggle = computed(() => Boolean(props.attribute && normalizedValue.value));
const active = computed(() => canToggle.value && isFacetValueActive(props.attribute, normalizedValue.value));
const opensInNewTab = computed(() => props.openInNewTab || /^\/res(?:\/|$)/.test(String(route.path || '')));
const href = computed(() => (canToggle.value ? getFacetToggleHref(props.attribute, normalizedValue.value) : ''));
const attributeLabel = computed(() => {
    const key = clickableFacetLabelKey(props.attribute);
    return key && te(key) ? t(key) : props.attribute;
});

const ariaLabel = computed(() => {
    const action = active.value ? t('remove') : t('addFilter');
    return `${action}: ${attributeLabel.value} = ${normalizedLabel.value}`;
});

function toggle() {
    if (!canToggle.value) return;
    void toggleFacetValue(props.attribute, normalizedValue.value);
}
</script>
