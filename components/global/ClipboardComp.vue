<template>
  <span
    :class="fontSize"
    class="flex flex-row items-center flex-wrap"
  >
    {{ displayText }}
    &nbsp;
    <Icon
      class="text-primary dark:hover:text-primary-100 dark:text-primary-300 my-auto cursor-pointer min-w-4"
      :class="[fontSize, darkBg ? 'text-primary-200 hover:text-primary-300' : '']"
      name="mdi:content-copy"
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
    },
    'darkBg': {
        type: Boolean,
        default: false
    }
});
//const source = ref('AVefi');
//useClipboardUtil()

</script>