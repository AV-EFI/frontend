<template>
    <div ref="target" :class="anchorClass">
        <ClientOnly>
            <div v-if="isReady" :class="contentClass">
                <slot name="content" />
            </div>
        </ClientOnly>
        <div v-if="!isReady" :class="fallbackClass">
            <slot name="fallback" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useDeferredVisibility } from '~/composables/useDeferredVisibility';

const props = withDefaults(defineProps<{
    rootMargin?: string;
    anchorClass?: string;
    contentClass?: string;
    fallbackClass?: string;
}>(), {
    rootMargin: '200px 0px',
    anchorClass: 'lazy-section-anchor',
    contentClass: 'block transition-opacity duration-300',
    fallbackClass: '',
});

const { target, isReady } = useDeferredVisibility({ rootMargin: props.rootMargin });
</script>
