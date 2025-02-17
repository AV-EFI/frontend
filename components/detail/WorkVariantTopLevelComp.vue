<template>
  <div class="dark:text-white">
    <MicroDividerComp
      in-class="work-variant"
      class="mt-0"
      :label-text="workVar.category"
    />
    <div class="mt-4 mb-2">
      <NuxtLayout name="partial-grid-2-1">
        <template #left>
          <DetailKeyValueComp
            keytxt="EFI"
            :valtxt="handle"
            class="col-span-full"
          />
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
            class="col-span-full"
            keytxt="AlternativeTitle"
            :valtxt="workVar.has_alternative_title"
            :ul="true"
          />
          <!-- Described by -->
          <div class="grid col-span-12 md:col-span-6 grid-cols-12 gap-1">
            <DetailKeyValueComp
              class="col-span-full"
              keytxt="lastedit"
              :clip="false"
              :valtxt="new Date(esTimestamp??'').toLocaleString('de-DE')"
            />
          </div>
        </template>
        <template #right>
          <DetailKeyValueListComp
            v-if="workVar.has_genre"
            keytxt="avefi:Genre"
            class="col-span-full"
            :ul="true"
            :same-as="true"
            :valtxt="workVar.has_genre"
          />
          <DetailKeyValueListComp
            v-if="workVar.has_subject"
            class="col-span-full mt-1"
            keytxt="avefi:Subject"
            :bg-color="true"
            :valtxt="workVar.has_subject"
            :same-as="true"
            :ul="true"
          />
        </template>
      </NuxtLayout>
    </div>
  </div>
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