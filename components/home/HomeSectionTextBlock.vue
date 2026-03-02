<template>
    <div :class="wrapperClasses">
        <article :class="innerClasses">
            <header>
                <p v-if="eyebrow" class="text-sm uppercase tracking-[0.3em] text-base-content/70" tabindex="0">
                    {{ eyebrow }}
                </p>
                <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight" tabindex="0">
                    {{ title }}
                </h2>
            </header>
            <div class="space-y-3">
                <p v-for="(paragraph, idx) in normalizedParagraphs" :key="`paragraph-${idx}`"
                    class="text-base text-base-content/80" tabindex="0">
                    {{ paragraph }}
                </p>
                <slot />
            </div>
            <footer v-if="ctaHref && ctaLabel" class="pt-2">
                <NuxtLink :to="ctaHref" :target="ctaTarget" :rel="computedCtaRel" :class="ctaClasses">
                    {{ ctaLabel }}
                </NuxtLink>
            </footer>
        </article>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

type ParagraphInput = string | string[] | undefined;

const props = defineProps<{
    title: string;
    paragraphs?: ParagraphInput;
    ctaLabel?: string;
    ctaHref?: string;
    ctaTarget?: string;
    ctaRel?: string;
    wrapperClass?: string;
    innerClass?: string;
    ctaClass?: string;
    eyebrow?: string;
    variant?: 'default' | 'dashed' | 'minimal';
    unstyled?: boolean;
}>();

const normalizedParagraphs = computed(() => {
    if (!props.paragraphs) {
        return [] as string[];
    }
    return Array.isArray(props.paragraphs) ? props.paragraphs : [props.paragraphs];
});

const baseWrapperClasses = 'w-full flex items-center justify-between px-4 lg:px-0 lg:items-start';
const baseInnerClasses = 'w-full max-w-2xl text-left flex flex-col gap-4';

const variantClasses: Record<string, string> = {
    default: 'rounded-2xl dark:border-white/10 p-6',
    dashed: 'rounded-2xl border border-dashed border-base-300 bg-base-100/85 dark:bg-neutral/25 dark:border-white/20 p-6',
    minimal: 'p-0 bg-transparent border border-transparent shadow-none',
};

const wrapperClasses = computed(() => [
    props.unstyled ? '' : baseWrapperClasses,
    props.wrapperClass,
].filter(Boolean).join(' '));

const innerClasses = computed(() => [
    props.unstyled ? '' : baseInnerClasses,
    props.unstyled ? '' : (variantClasses[props.variant || 'default'] || variantClasses.default),
    props.innerClass,
].filter(Boolean).join(' '));

const computedCtaRel = computed(() => {
    if (props.ctaRel) return props.ctaRel;
    return props.ctaTarget === '_blank' ? 'noopener noreferrer' : undefined;
});

const ctaClasses = computed(() => props.ctaClass || 'btn btn-primary mt-4');
</script>
