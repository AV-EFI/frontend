<template>
  <!--
    <Icon
      class="text-primary-600 dark:text-primary-300 !align-baseline cursor-pointer"
      name="tabler:clipboard-copy"
      :alt="`Copy ${displayText || targetPropertyValue}`"
      :title="`Copy ${displayText || targetPropertyValue}`"
      @click="copyExtended(targetPropertyValue, targetPropertyName)"
    />
  -->
  <button
    class="btn btn-xs btn-primary"
    :alt="$t('copyValueToTargetModelPropertyName', {'name': targetPropertyName})"
    :title="$t('copyValueToTargetModelPropertyName', {'name': targetPropertyName})"
    @click="copyExtended(targetPropertyValue, targetPropertyName, sameAsId)"
  >
    <Icon name="tabler:arrow-right" />
  </button>
  <!--
    <Icon
      class="text-primary-600 dark:text-primary-300 !align-baseline cursor-pointer"
      name="mdi:clipboard-play-multiple-outline"
      :alt="`Copy ${displayText || targetPropertyValue}`"
      :title="`Copy ${displayText || targetPropertyValue}`"
      @click="copyExtended(targetPropertyValue, targetPropertyName)"
    />
    -->
</template>
<script setup lang="ts">
import {toast} from 'vue3-toastify';

defineProps ({
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
    'sameAsId': {
        type: String,
        required: false,
        default: null
    }
});

function copyExtended (copyValue:string|number, copyPropertyName:string, sameAsId:string)  {
    try {
        console.log(copyValue, copyPropertyName, sameAsId);
        if(typeof (copyValue) == 'number') {
            copyValue = String(copyValue);
        } 
        //copy(copyValue);
        emit("updateTargetModel", copyValue, copyPropertyName, sameAsId);
        toast.info(`'${copyValue}', ${sameAsId} transferred`, {autoClose: 1000} );
    }
    catch(e) {
        toast.error('Copy error');
    }
}

//const emit= defineEmits(["updateTargetModel"]);
const emit = defineEmits<{
  (e: 'updateTargetModel', targetPropertyValue:string, targetPropertyName:string, sameAsId:string): void
}>();

</script>