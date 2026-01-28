<template>
  <div :class="`divider before:bg-${inClass} after:bg-${inClass}`" :aria-label="$t('divider')">
    <MicroBadgeCategoryComp v-if="labelText" :category="labelText" :icon="true" class="md:text-regular" />
  </div>
</template>
<script lang="ts" setup>
defineProps({
    'inClass': {
        type: String,
        required: true
    },
    'labelText': {
        type: String,
        default: 'avefi:WorkVariant'
    }
});
</script>