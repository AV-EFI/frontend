<template>
  <div class="mt-2">
    <NuxtLayout name="partial-grid-2-1">
      <template #left>
        <h2
          class="text-lg col-span-full text-primary-900 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="workVar.has_primary_title.has_name"
        >
          {{ workVar.has_primary_title.has_name }}
        </h2>  
      </template>
      <template #right>
        <MicroBadgeCategoryComp
          class="col-span-6"
          :category="workVar.type"
        />
      </template>
    </NuxtLayout>
    <MicroDividerComp
      in-class="work-variant"
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
            <MicroLabelComp
              class="col-span-full"
              label-text="Descbribed by"
            />
            <div class="col-span-full text-sm">
              <p>{{ workVar.described_by?.has_issuer_name }}</p>
              <a 
                :href="workVar.described_by?.has_issuer_id"
                class="link link-primary link-hover dark:link-accent"
                alt="Referenz bei ISIL"
                title="Referenz bei ISIL"
                target="_blank"
              >
                {{ workVar.described_by?.has_issuer_id }}
              </a>
              <p>{{ new Date(esTimestamp??'').toLocaleString('de-DE') }}</p>
            </div>
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