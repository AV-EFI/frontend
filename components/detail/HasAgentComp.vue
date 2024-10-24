<template>
  <div
    v-if="agentData"
    class="col-span-full md:col-span-5"
  >
    <div
      v-for="(has_agent_item, agent_index) in agentData"
      :key="agent_index"
    >        
      <h4>{{ has_agent_item.has_name }}</h4>
      <span>
        {{ $t(has_agent_item.type) }}
      </span><br>
      <span class="text-sm"><strong>same_as:</strong></span>
      <span v-if="has_agent_item.same_as">
        <DetailSameAsComp :same-as-data="has_agent_item?.same_as" />
      </span>
      <div>
        <span class="text-sm"><strong>has_alternate_name:</strong></span>
        <ul>
          <li
            v-for="(alternate_name_item, alternate_name_index) in has_agent_item?.has_alternate_name"
            :key="alternate_name_index"
          >
            <span>
              {{ alternate_name_item }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else>
    <span>invalid data in has_agent</span>
  </div>
</template>

<script setup lang="ts">
import type {Agent} from '../../models/interfaces/av_efi_schema.ts';

const props = defineProps ( {
    'agentData': {
        type: Object,
        default: null
    }
}); 

</script>