<template>
  <div :class="`divider before:bg-${inClass} after:bg-${inClass}`">
    <MicroBadgeCategoryComp
      v-if="labelText"
      :category="labelText"
      :icon="true"
      class="text-lg p-4"
    />
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