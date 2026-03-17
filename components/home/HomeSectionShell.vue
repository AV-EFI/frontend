<template>
    <section
        :id="id"
        :role="role"
        :aria-label="ariaLabel"
        :class="sectionClasses"
    >
        <div :class="containerClasses">
            <div :class="contentClasses">
                <slot />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    id?: string;
    role?: string;
    ariaLabel?: string;
    wash?: 'none' | 'default' | 'a';
    sectionClass?: string;
    containerClass?: string;
    contentClass?: string;
}>(), {
    wash: 'none',
    sectionClass: '',
    containerClass: '',
    contentClass: '',
});

const sectionClasses = computed(() => [
    'relative border-t border-base-200 py-10 block transition-opacity duration-300',
    props.wash === 'default' ? 'section-wash' : '',
    props.wash === 'a' ? 'section-wash section-wash--a' : '',
    props.sectionClass,
].filter(Boolean).join(' '));

const containerClasses = computed(() => [
    'container mx-auto px-4 sm:px-6 lg:px-8 min-h-100 flex items-center justify-between',
    props.containerClass,
].filter(Boolean).join(' '));

const contentClasses = computed(() => [
    'w-full py-2 md:py-4',
    props.contentClass,
].filter(Boolean).join(' '));
</script>