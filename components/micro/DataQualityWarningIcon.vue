<template>
    <span
        class="inline-flex items-center align-text-bottom text-warning"
        :title="label"
        :aria-label="label"
        role="img"
    >
        <Icon name="tabler:alert-triangle" class="h-3.5 w-3.5" aria-hidden="true" />
        <span class="sr-only">{{ label }}</span>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
