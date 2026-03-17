<template>
    <div ref="target" :class="anchorClass">
        <div v-if="hydrated && isReady" :class="contentClass">
            <slot name="content" />
        </div>
        <div v-else :class="fallbackClass">
            <slot name="fallback" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
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

const hydrated = ref(false);
const { target, isReady } = useDeferredVisibility({ rootMargin: props.rootMargin });

onMounted(() => {
    hydrated.value = true;
});
</script>