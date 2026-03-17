<template>
    <component :is="tag">
        <template v-for="(segment, index) in segments" :key="`${index}-${segment.text}`">
            <span v-if="segment.type === 'text'">{{ segment.text }}</span>
            <GlobalGlossaryTermComp
                v-else-if="segment.entry"
                :entry="segment.entry"
                :label="segment.text"
                :locale="resolvedLocale"
            />
        </template>
    </component>
</template>

<script setup lang="ts">
import type { GlossaryLocale } from '~/data/glossary';

const props = withDefaults(defineProps<{
    text: string
    tag?: string
    locale?: GlossaryLocale
}>(), {
    tag: 'span',
    locale: undefined,
});

const { locale } = useI18n();
const { annotateText } = useGlossary();

const resolvedLocale = computed<GlossaryLocale>(() => {
    if (props.locale) return props.locale;
    return locale.value.startsWith('en') ? 'en' : 'de';
});

const segments = computed(() => annotateText(props.text, resolvedLocale.value));
</script>
