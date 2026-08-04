<template>
    <NuxtLayout name="partial-grid-1">
        <template #center>
        </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { WorkVariant } from '~/models/interfaces/schema/avefi_schema.js';

defineModel({ type: Object as PropType<WorkVariant>, required: true });

defineProps({
    handle: { type: String, required: true },
    esTimestamp: { type: String, required: true },
});
</script>
