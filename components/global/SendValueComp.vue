<template>
    <button class="btn btn-xs btn-primary" :aria-label="$t('copyValueToTargetModelPropertyName', {'name': targetPropertyName})"
            :title="$t('copyValueToTargetModelPropertyName', {'name': targetPropertyName})"
            @click="copyExtended(targetPropertyValue, targetPropertyName, sameAsId)">
        <Icon name="tabler:transfer" />
    </button>
    <!--
    <Icon
      class="text-primary-600 dark:text-primary-300 !align-baseline cursor-pointer"
      name="tabler:clipboard"
      :alt="`Copy ${displayText || targetPropertyValue}`"
      :title="`Copy ${displayText || targetPropertyValue}`"
      @click="copyExtended(targetPropertyValue, targetPropertyName)"
    />
    -->
</template>
<script setup lang="ts">

const nuxtApp = useNuxtApp();
const {$toast} = nuxtApp;
const $t = (key: string) => {
    const i18n = nuxtApp.$i18n as { t?: (key: string) => string } | undefined;
    return i18n?.t?.(key) ?? key;
};

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
        if(typeof (copyValue) == 'number') {
            copyValue = String(copyValue);
        } 
        //copy(copyValue);
        emit("updateTargetModel", copyValue, copyPropertyName, sameAsId);
        $toast?.info?.($t('valueTransferred'), {autoClose: 1000} );
    }
    catch(e) {
        console.error(e);
        $toast?.error?.($t('valueTransferError'));
    }
}

//const emit= defineEmits(["updateTargetModel"]);
const emit = defineEmits<{
    (e: 'updateTargetModel', targetPropertyValue:string, targetPropertyName:string, sameAsId:string)
}>();

</script>
