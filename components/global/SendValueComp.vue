<template>
  <span v-if="isSupported">
    {{ String(displayText || targetPropertyValue) }}
    <Icon
      class="text-primary-600 dark:text-primary-300 !align-baseline cursor-pointer"
      name="mdi:clipboard-play-multiple-outline"
      :alt="`Copy ${displayText || targetPropertyValue}`"
      :title="`Copy ${displayText || targetPropertyValue}`"
      @click="copyExtended(targetPropertyValue, targetPropertyName)"
    />
  </span>
  <span v-else>
    {{ String(displayText || targetPropertyValue) }}
  </span>
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import {toast} from 'vue3-toastify';
const props = defineProps ({
    'targetPropertyValue': {
        type: String,
        default: 'AVefi',
        required: true
    },
    'displayText': {
        type: String,
        default: null
    },
    'targetPropertyName': {
        type: String,
        required: true,
        default: 'AVefi'
    },

});
const source = ref('AVefi');
const { text, copy, copied, isSupported } = useClipboard({ source });

function copyExtended (copyValue:string|number, copyPropertyName:string)  {
    try {
        if(typeof (copyValue) == 'number') {
            copyValue = String(copyValue);
        } 
        //copy(copyValue);
        emit("updateTargetModel", copyValue, copyPropertyName);
        toast.info(`'${copyValue}' transferred`, {autoClose: 1000} );
    }
    catch(e) {
        toast.error('Copy error');
    }
}

//const emit= defineEmits(["updateTargetModel"]);
const emit = defineEmits<{
  (e: 'updateTargetModel', targetPropertyValue:string, targetPropertyName:string)
}>();

</script>