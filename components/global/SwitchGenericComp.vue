<template>
  <FormKit
    v-model="state"
    off-value="readonly"
    on-value="edit"
    type="toggle"
    :off-value-label="labelOff"
    :on-value-label="labelOn"
    thumb-icon="fa-regular:edit"
    thumb-color-on="(--primary-200)"
    track-color-on="(--primary-500)"
    icon-color-on="white"
    $emit
  />
</template>
<script setup lang="ts">

const state = defineModel({default: 'false', type: String});

const props = defineProps({
    labelOff: {
        type: String,
        default: 'Off'
    },
    labelOn: {
        type: String,
        default: 'On'
    }
});

</script>