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
        <input id="raw-data-collapse" type="checkbox" :aria-label="$t('rawData')">
        <label for="raw-data-collapse" class="collapse-title font-medium">
            JSON data
        </label>
        <div class="collapse-content"> 
            <pre wrap>{{ apiData }}</pre>
        </div>
    </div>
</template>