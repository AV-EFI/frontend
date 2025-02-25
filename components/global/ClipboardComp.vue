<template>
  <span
    :class="fontSize"
    class="flex flex-row items-center"
  >
    {{ displayText }}
    &nbsp;
    <Icon
      class="text-primary-400 dark:text-primary-300 my-auto cursor-pointer min-w-4"
      :class="fontSize"
      name="mdi:clipboard-play-multiple-outline"
      :alt="`Copy ${displayText}`"
      :title="`Copy ${displayText}`"
      @click="useClipboardUtil()?.copyExtended(displayText)"
    />
  </span>
</template>
<script setup lang="ts">

const props = defineProps ({
    'displayText': {
        type: String,
        default: 'AVefi'
    },
    'fontSize': {
        type: String,
        default: 'text-regular'
    }
});
//const source = ref('AVefi');
//useClipboardUtil()

</script>