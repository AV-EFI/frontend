<template>
  <span
    :class="fontSize"
    class="flex flex-row items-center whitespace-break-spaces"
  >
    {{ displayText }}
    &nbsp;
    <Icon
      class="text-primary-600 dark:hover:text-primary-100 dark:text-primary-300 my-auto cursor-pointer min-w-4"
      :class="[fontSize, darkBg ? 'text-primary-200 hover:text-primary-300' : '']"
      name="tabler:copy"
      :alt="`Copy ${displayText}`"
      :title="`Copy ${displayText}`"
      @click="useClipboardUtil()?.copyExtended(displayText)"
    />
  </span>
</template>
<script setup lang="ts">

defineProps ({
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

</script>