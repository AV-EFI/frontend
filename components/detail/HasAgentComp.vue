<template>
  <div
    v-if="agentData"
    class="col-span-full md:col-span-5 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"
  >
    <div
      v-for="(has_agent_item, agent_index) in agentData"
      :key="agent_index"
      class="mb-4"
    >        
      <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ has_agent_item.has_name }}
      </h4>
      <span class="text-gray-700 dark:text-gray-300">
        {{ $t(has_agent_item.type) }}
      </span><br>
      <span class="text-sm xl:text-base font-bold text-gray-700 dark:text-gray-300">same_as:</span>
      <span v-if="has_agent_item.same_as">
        <DetailSameAsComp :same-as-data="has_agent_item?.same_as" />
      </span>
      <div>
        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">has_alternate_name:</span>
        <ul class="list-disc list-inside">
          <li
            v-for="(alternate_name_item, alternate_name_index) in has_agent_item?.has_alternate_name"
            :key="alternate_name_index"
            class="text-gray-700 dark:text-gray-300"
          >
            <span>
              {{ alternate_name_item }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div
    v-else
    class="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"
  >
    <span class="text-gray-700 dark:text-gray-300">invalid data in has_agent</span>
  </div>
</template>

<script setup lang="ts">
import type { Agent } from '../../models/interfaces/av_efi_schema.ts';

const props = defineProps({
    agentData: {
        type: Object,
        default: null
    }
});
</script>