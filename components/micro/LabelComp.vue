<template>
  <label class="text-xs tracking-wide font-bold dark:text-primary-100 text-primary-500 uppercase">{{ $t($props.labelText) }}:</label>
</template>
<script lang="ts" setup>
defineProps ({
    'labelText': {
        type: String,
        required: true
    }
});

</script>