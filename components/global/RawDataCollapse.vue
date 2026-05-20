<script setup lang="ts">
const rawDataToggleId = `raw-data-toggle-${Math.random().toString(36).slice(2)}`;

defineProps({
    apiData: {
        type: String,
        default: 'No data'
    }
});
</script>

<template>
    <div class="collapse">
        <input :id="rawDataToggleId" type="checkbox" :aria-label="$t('rawData')" />
        <label class="collapse-title font-medium cursor-pointer" :for="rawDataToggleId">
            {{ $t('rawData') }}
        </label>
        <div class="collapse-content"> 
            <pre wrap>{{ apiData }}</pre>
        </div>
    </div>
</template>
