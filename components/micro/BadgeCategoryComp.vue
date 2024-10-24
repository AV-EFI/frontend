<template>
  <span
    v-if="category !== 'Monographic'"
    :class="[category == 'avefi:WorkVariant' ? 'bg-work-variant' : category == 'avefi:Manifestation'? 'bg-manifestation': category == 'avefi:Item' ? 'bg-item':'bg-primary-500', 'badge text-white']"
  >  
    {{ $t(category?? '' ) }}
  </span>
  <span
    v-else
    class="badge badge-outline text-primary-500 dark:text-primary-200"
  >
    {{ $t(category?? '' ) }}
  </span>
</template>
<script lang="ts" setup>
import { boolean } from 'zod';

defineProps({
    'category': {
        type: String,
        default: 'avefi:WorkVariant'
    },
    'dense': {
        type: Boolean,
        default: false
    }
});
</script>