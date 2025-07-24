<template>
  <div 
    :class="`divider before:bg-${inClass} after:bg-${inClass}`"
    :aria-label="$t('divider')"
  >
    <MicroBadgeCategoryComp
      v-if="labelText"
      :category="labelText"
      :icon="true"
      class="md:text-regular"
      :class="inClass == 'work' ? 'p-4' : inClass == 'manifestation' ? 'p-3' : 'p-2'"
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