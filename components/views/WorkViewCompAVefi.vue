<template>
  <div>
    <div
      v-if="mir" 
      class="border-l-2 border-work px-2" 
      role="region"
      :aria-label="`${$t('detailsFor')} ${mir?.has_record?.has_primary_title?.has_name}`">
      <div class="w-full">
        <LazyMicroDividerComp :label-text="mir?.has_record?.category" in-class="work" />
      </div>
      <NuxtLayout name="partial-grid-2-1-no-heading">
        <template #left>
          <DetailKeyValueComp
            :id="dataObject?.handle" 
            keytxt="EFI" 
            :valtxt="dataObject?.handle"
            class="col-span-full mb-2" 
            :clip="true" />
          <DetailWorkVariantTopLevelComp
              v-model="mir" 
              :handle="dataObject?.handle || ''"
           />
          <DetailHasEventComp
            v-if="mir?.has_record?.has_event" 
            v-model="mir.has_record.has_event" 
            />
        </template>
        <template #right>
          <!-- has_form -->
          <DetailKeyValueListComp
            v-if="mir?.has_record?.has_form" class="col-span-full mb-2" keytxt="has_form"
            :valtxt="mir?.has_record?.has_form" :ul="true" />
          <DetailKeyValueListComp
            v-if="mir.has_record?.has_genre" keytxt="avefi:Genre" class="col-span-full mb-2" :ul="true"
            :same-as="true" :valtxt="mir.has_record?.has_genre" />
          <DetailKeyValueListComp
            v-if="mir.has_record?.has_subject" 
            class="col-span-full mt-1" keytxt="avefi:Subject"
            :bg-color="true" :valtxt="mir.has_record?.has_subject" 
            :same-as="true" 
            :ul="true" 
            />
        </template>
      </NuxtLayout>
    </div>
    <div v-else>
      <pre>{{ mir }}</pre>
    </div>
    <div
      :class="[manifestations?.length < 1? 'flex place-content-center':'']" role="region"
      aria-label="Manifestations"
      >
      <ClientOnly>
        <DetailManifestationListComp 
          v-if="manifestations?.length > 0" 
          v-model="manifestations" 
        />
        <div
          v-else-if="manifestations?.length < 1 && mir?.parts?.length < 1"
          class="flex flex-col items-center justify-center max-w-md mx-auto mt-6 p-4 rounded-lg border-2 border-dashed border-base-300 bg-base-100 text-center text-neutral-700 dark:text-neutral-300 dark:bg-gray-800 shadow-sm"
          role="alert" aria-label="No manifestations available">

          <Icon name="tabler:mood-sad" class="text-4xl mb-2 text-neutral-500" aria-hidden="true" />

          <p class="text-base font-medium">{{ $t('noManifestations') }}</p>
        </div>
      </ClientOnly>
    </div>
          <div v-if="mir?.parts" class="mt-4">
            <h3 class="text-lg font-bold mb-2">{{ $t('parts') }}</h3>
            <LazyViewsWorkViewCompParts
              :data-json="mir?.parts"
              class="mb-4"
            />
          </div>
          <div v-else-if="mir?.work_variants">
            <p class="my-4" v-html="$t('multihelptext', {'name': mir?.handle })" />
            <h3 class="text-lg font-bold mb-2">{{ $t('workVariants') }}</h3>
            <LazyViewsWorkViewCompParts
              :data-json="mir?.work_variants"
              class="mb-4"
            />
          </div>

    <div class="w-full mt-4 justify-center items-center">
      <DetailKeyValueComp
        class="col-span-full mx-auto" keytxt="lastedit" :clip="false"
        :valtxt="new Date((dataObject as IAVefiWorkVariant)['@timestamp']??'').toLocaleString('de-DE')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiWorkVariant } from '../../models/interfaces/generated/IAVefiWorkVariant.js';
import type { IAVefiManifestation } from '@/models/interfaces/generated/IAVefiManifestation.js';

const dataObject = defineModel<IAVefiWorkVariant>({ required: true });
console.log(dataObject, 'dataObject in WorkViewCompAVefi.vue');
const manifestations = ref<IAVefiManifestation[]>([]);

const mir = dataObject.value as IAVefiWorkVariant & {
  manifestations?: IAVefiManifestation[]
};

if (mir?.manifestations?.length) {
    manifestations.value = mir.manifestations;
}
</script>