<template>
    <span
        class="relative inline-flex items-baseline"
        @mouseenter="open = true"
        @mouseleave="open = false"
    >
        <button
            type="button"
            class="inline cursor-help rounded-sm underline decoration-dotted underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            :aria-label="accessibleLabel"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="tooltipId"
            @click="open = !open"
            @focus="open = true"
            @blur="open = false"
            @keydown.escape.prevent="open = false"
        >
            {{ label }}
        </button>

        <span
            v-show="open"
            :id="tooltipId"
            role="tooltip"
            class="absolute left-0 top-full z-30 mt-2 w-72 max-w-[85vw] rounded-md bg-neutral px-3 py-3 text-left text-xs text-neutral-content shadow-lg"
        >
            <span class="block font-semibold">{{ entry.term[locale] }}</span>
            <span class="mt-1 block">{{ entry.description[locale] }}</span>
            <a
                v-if="entry.externalUrl"
                :href="entry.externalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-flex text-xs underline underline-offset-2"
            >
                {{ $t('vocab.moreInfo') }}
            </a>
        </span>
    </span>
</template>

<script setup lang="ts">
import type { GlossaryEntry, GlossaryLocale } from '~/data/glossary';

const props = defineProps<{
    entry: GlossaryEntry
    label: string
    locale: GlossaryLocale
}>();

const { t } = useI18n();
const tooltipId = useId();
const open = ref(false);

const accessibleLabel = computed(() => `${t('info')}: ${props.entry.term[props.locale]}`);
</script>
