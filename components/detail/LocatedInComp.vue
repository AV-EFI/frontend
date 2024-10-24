<template>
  <div
    v-if="locatedInData"
    class="col-span-full flex flex-col"
  >
    <div class="w-1/3">
      <span class="text-md font-bold text-primary-900 dark:text-primary-100 capitalize">
        {{ $t('place') }}:
      </span>
    </div>    
    <div
      v-for="(located_in_item, located_in_index) in locatedInData"
      :key="located_in_index"
      class="w-2/3 flex flex-col"
    >
      <h4>{{ located_in_item.has_name }}</h4>
      <div v-if="located_in_item.same_as">
        <DetailSameAsComp :same-as-data="located_in_item.same_as" />
      </div>      
      <ul
        v-if="located_in_item.has_alternate_name"
      >
        <li
          v-for="(located_in_has_alternate_name_item, located_in_has_alternate_name_index) in located_in_item.has_alternate_name"
          :key="located_in_has_alternate_name_index"
        >
          <span>{{ located_in_has_alternate_name_item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {LocalResource} from '../../models/interfaces/av_efi_schema.ts';

const props = defineProps ( {
    'locatedInData': {
        type: Object,
        default: null
    }
}); 

</script>