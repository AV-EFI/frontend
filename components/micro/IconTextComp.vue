<template>
  <span class="inline-block flex items-center justify-self-center">
    <Icon
      :name="iconName"
    />
    <span>&nbsp;{{ $t(text) }}</span>
  </span>
</template>
<script lang="ts" setup>
defineProps({
    iconName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    }
});
</script>