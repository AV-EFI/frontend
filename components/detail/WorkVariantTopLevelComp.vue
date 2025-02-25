<template>
  <NuxtLayout name="partial-grid-1">
    <template #center>
      <div
        v-for="sas in workVar.same_as"
        :key="sas.id"
        class="col-span-full"
      >
        <DetailKeyValueComp
          :keytxt="sas.category"
          :valtxt="sas.id"
          :same-as="true"
        />
      </div>
      <DetailKeyValueListComp
        v-if="workVar.has_alternative_title"
        class="col-span-full mb-2"
        keytxt="AlternativeTitle"
        :valtxt="workVar.has_alternative_title"
        :ul="true"
      />
      <!-- Described by -->
      <div class="grid col-span-12 md:col-span-6 grid-cols-12 gap-1" />
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { WorkVariant } from '../../models/interfaces/av_efi_schema';
const workVar = defineModel({type: Array as PropType<WorkVariant>, required: true});
const props = defineProps({
    "handle": {
        type: String,
        required: true
    },
    "esTimestamp": {
        type: String,
        required: true
    }
});
</script>