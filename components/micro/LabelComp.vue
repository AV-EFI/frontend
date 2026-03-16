<template>
    <span
        v-if="translateKey"
        class="tracking-wide text-xs font-bold dark:text-slate-300 text-neutral h-4"
        :class="fontSize"
    >
        <span class="sr-only">{{ $t($props.labelText) }}</span>
        <span aria-hidden="true">{{ $t($props.labelText) }}:</span>
    </span>
    <span
        v-else
        class="tracking-wide text-xs font-bold dark:text-slate-300 text-neutral h-4"
        :class="fontSize"
    >
        <span class="sr-only">{{ labelText }}</span>
        <span aria-hidden="true">{{ labelText }}:</span>
    </span>
</template>

<script lang="ts" setup>
defineProps({
    labelText: {
        type: String,
        required: true
    },
    fontSize: {
        type: String,
        required: false,
        default: "text-xs"
    },
    translateKey: {
        type: Boolean,
        default: true
    }
});
</script>
