<template>
  <span
    v-if="isSupported"
    :class="fontSize"
  >
    {{ displayText }}
    <Icon
      class="text-primary-400 dark:text-primary-300 !align-text-bottom cursor-pointer"
      :class="fontSize"
      name="mdi:clipboard-play-multiple-outline"
      :alt="`Copy ${displayText}`"
      :title="`Copy ${displayText}`"
      @click="copyExtended(displayText)"
    />
  </span>
  <span
    v-else
    :class="fontSize"
  >
    {{ String(displayText) }}
  </span>
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import {toast} from 'vue3-toastify';
const props = defineProps ({
    'displayText': {
        type: String,
        default: 'AVefi'
    },
    'fontSize': {
        type: String,
        default: 'text-base'
    }
});
const source = ref('AVefi');
const { text, copy, copied, isSupported } = useClipboard({ source });

function copyExtended (copyText:string) {
    try {
        if(typeof (copyText) == 'number') {
            copyText = String(copyText);
        } 
        copy(copyText);
        toast.info(`'${copyText}' copied to clipboard`);
    }
    catch(e) {
        toast.error('Copy to clipboard error');
    }
}

</script>