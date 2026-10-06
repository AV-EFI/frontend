<template>
    <h1 :class="[
        variant === 'hero' && 'bree font-extrabold',
        variant === 'panel' && 'bree font-bold text-xl',
        variant === 'card' && 'bree font-bold text-xl',
    ]">
        <slot />
    </h1>
</template>

<script setup lang="ts">
defineProps<{
    /**
     * hero: bree display font, extrabold — large landing/section titles (size/position stay page-specific via passthrough class).
     * panel / card: all other page titles, Bree Serif bold at one size. Titles stand out by weight, not by size.
     */
    variant: 'hero' | 'panel' | 'card';
}>();
</script>
