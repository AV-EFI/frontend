<template>
  <span
    :class="fontSize"
    class="flex flex-row items-center whitespace-break-spaces gap-1"
  >
    <span>{{ displayText }}</span>
    <button
      type="button"
      class="inline-flex items-center text-primary-600 dark:hover:text-primary-100 dark:text-primary-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
      :class="[darkBg ? 'text-primary-200 hover:text-primary-300' : '']"
      :aria-label="`${$t('copyToClipboard')}: ${displayText}`"
      :title="`${$t('copyToClipboard')}: ${displayText}`"
      @click="useClipboardUtil()?.copyExtended(copyText ?? displayText)"
    >
      <Icon
        class="min-w-4"
        :class="[fontSize]"
        name="tabler:copy"
        aria-hidden="true"
      />
    </button>
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
        default: 'text-sm'
    },
    'darkBg': {
        type: Boolean,
        default: false
    },
    'copyText': {
        type: String,
        default: null
    }
});

</script>