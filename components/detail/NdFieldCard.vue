<template>
  <div class="border border-base-300 rounded-lg p-3">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="font-medium text-base">
          {{ label }}
        </h4>
        <p
          class="text-xs opacity-70 font-mono"
          :title="esPath"
        >
          {{ esPath }}
        </p>
      </div>
      <div class="text-right">
        <div
          class="text-2xl font-semibold"
          :aria-label="`count for ${label}`"
        >
          <template v-if="count !== null">
            {{ count.toLocaleString() }}
          </template>
          <template v-else>
            —
          </template>
        </div>
        <div class="text-xs opacity-70">
          docs with value
        </div>
      </div>
    </div>

    <div
      v-if="kibana"
      class="mt-2"
    >
      <!-- auto-registered component -->
      <KibanaEmbed
        :base-url="kibana.baseUrl"
        :view-type="kibana.viewType || 'discover'"
        :saved-object-id="kibana.savedObjectId"
        :data-view-id="kibana.dataViewId"
        :field-exists="esPath"
        filter-mode="exists"
        :time-from="kibana.timeFrom || 'now-10y'"
        :time-to="kibana.timeTo || 'now'"
        :aria-label="`Open Kibana view for ${label}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  esPath: string
  count: number | null
  kibana?: {
    baseUrl: string
    viewType?: 'discover' | 'lens'
    savedObjectId?: string
    dataViewId?: string
    timeFrom?: string
    timeTo?: string
  }
}>();
</script>

<style scoped>
.font-mono { max-width: 48ch; }
</style>
