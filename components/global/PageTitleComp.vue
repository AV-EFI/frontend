<template>
    <h1 :class="[
        variant === 'hero' && 'bree font-extrabold',
        variant === 'panel' && 'font-bold text-lg xl:text-xl',
        variant === 'card' && 'font-bold text-2xl',
    ]">
        <slot />
    </h1>
</template>

<script setup lang="ts">
defineProps<{
    /**
     * hero: bree display font, extrabold — large landing/section titles (size/position stay page-specific via passthrough class).
     * panel: compact section-panel label (search, vocab, faq, compare).
     * card: standard content-page title inside a card/section.
     */
    variant: 'hero' | 'panel' | 'card';
}>();
</script>
