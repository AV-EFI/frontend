<script setup lang="ts">
defineProps({
    apiData: {
        type: String,
        default: 'No data'
    }
});
</script>

<template>
  <div class="collapse">
    <input type="checkbox"> 
    <div class="collapse-title font-medium">
      Raw data
    </div>
    <div class="collapse-content"> 
      <pre wrap>{{ apiData }}</pre>
    </div>
  </div>
</template>