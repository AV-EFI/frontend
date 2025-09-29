<template>
  <div class="w-full">
    <button
      class="btn btn-sm btn-outline mb-2"
      type="button"
      :aria-label="ariaLabel || 'Toggle Kibana view'"
      @click="load = !load"
    >
      {{ load ? 'Hide Kibana view' : 'Show Kibana view' }}
    </button>

    <div
      v-if="load"
      class="border rounded-md"
    >
      <iframe
        :src="finalUrl"
        class="w-full h-[520px] rounded-md"
        referrerpolicy="no-referrer"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type ViewType = 'discover' | 'lens'
type FilterMode = 'exists' | 'custom'

const props = defineProps<{
  baseUrl: string
  viewType: ViewType
  savedObjectId?: string
  dataViewId?: string
  fieldExists?: string
  filterMode?: FilterMode
  customKql?: string
  timeFrom?: string
  timeTo?: string
  ariaLabel?: string
}>();

const load = ref(false);

const timePart = computed(
    () =>
        `_g=(filters:!(),time:(from:${encodeURIComponent(props.timeFrom || 'now-15y')},to:${encodeURIComponent(props.timeTo || 'now')}))`
);

const kql = computed(() => {
    if (props.filterMode === 'custom' && props.customKql) return props.customKql;
    const parts: string[] = [];
    if ((props.filterMode ?? 'exists') === 'exists' && props.fieldExists) {
        parts.push(`exists ${props.fieldExists}`);
    }
    return parts.length ? parts.join(' and ') : '*';
});

const aQuery = computed(() => {
    const queryPart = `query:(language:kuery,query:'${encodeURIComponent(kql.value)}')`;
    if (props.viewType === 'discover') {
        if (props.savedObjectId) return `_a=(${queryPart})`;
        return `_a=(index:'${props.dataViewId}',${queryPart})`;
    } 
    return `_a=(${queryPart})`;
  
});

const finalUrl = computed(() => {
    const base = props.baseUrl.replace(/\/+$/, '');
    if (props.viewType === 'discover') {
        const path = props.savedObjectId ? `/app/discover#/view/${props.savedObjectId}` : `/app/discover#/`;
        return `${base}${path}?${timePart.value}&${aQuery.value}`;
    } 
    const path = props.savedObjectId ? `/app/lens#/view/${props.savedObjectId}` : `/app/lens#/`;
    return `${base}${path}?${timePart.value}&${aQuery.value}`;
  
});
</script>
