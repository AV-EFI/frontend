<template>
  <li class="text-sm ml-2" tabindex="0">
    <span class="font-bold text-sm">
      {{ $t(`${field}`) }}:
    </span>
    <span
      class="px-1 rounded-sm"
      v-html="value"
    />
  </li>
</template>
  
<script lang="ts" setup>
defineProps({
    value: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    }
});
</script>
  