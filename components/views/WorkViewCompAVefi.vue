<template>
  <div>
    <div
      v-if="mir"
      class="border-l-2 border-work-variant px-2"
    >
      <div class="w-full">
        <LazyMicroDividerComp
          label-text="avefi:WorkVariant"
          in-class="work"
        />
      </div>
      <NuxtLayout name="partial-grid-2-1-no-heading">
        <template #left>
          <DetailWorkVariantTopLevelComp
            v-model="mir"
            :handle="dataObject?._source?.handle"
            :es-timestamp="dataObject._source['@timestamp']"
          />
          <DetailHasEventComp
            v-if="mir.has_event"
            v-model="mir.has_event"
          />
        </template>
        <template #right>
          <DetailKeyValueListComp
            v-if="mir.has_genre"
            keytxt="avefi:Genre"
            class="col-span-full mb-2"
            :ul="true"
            :same-as="true"
            :valtxt="mir.has_genre"
          />
          <DetailKeyValueListComp
            v-if="mir.has_subject"
            class="col-span-full mt-1"
            keytxt="avefi:Subject"
            :bg-color="true"
            :valtxt="mir.has_subject"
            :same-as="true"
            :ul="true"
          />
        </template>
      </Nuxtlayout>
    </div>
    <div v-else>
      <pre>{{ mir }}</pre>
    </div>
    <div v-if="status === 'pending'">
      <GlobalSkeletonLoaderComp class="mt-2" />
    </div>
    <div
      v-else
      :class="[manifestations?.length < 1? 'flex place-content-center':'']"
    >
      <ClientOnly>
        <DetailManifestationListComp
          v-if="manifestations?.length > 0"
          v-model="manifestations"
        />
        <div
          v-else
          class="alert alert-warning alert-outline text-white max-w-96 mt-4"
          role="alert"
        >
          <MicroIconTextComp
            icon-name="mdi:emoticon-cry-outline"
            text="noManifestations"
          />
        </div>
      </ClientOnly>
    </div>
    <div class="w-full mt-4 justify-center items-center">
      <DetailKeyValueComp
        class="col-span-full mx-auto"
        keytxt="lastedit"
        :clip="false"
        :valtxt="new Date(dataObject._source['@timestamp']??'').toLocaleString('de-DE')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//models\interfaces\av_efi_schema.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { EventHookOn } from '@vueuse/core';
import type {WorkVariant, Manifestation, Item} from '../../models/interfaces/av_efi_schema.ts';
const dataJson = defineModel({type: String, required: true});
const dataObject = JSON.parse(dataJson.value);
const mir:WorkVariant = dataObject?._source?.has_record;

interface ApiResponseManifestationList extends Promise<Response> {
  status: string
  data: Manifestation[]
  onFetchResponse: EventHookOn<Response>
  onFetchError: EventHookOn
}

interface ApiResponseItemList extends Promise<Response> {
  data: Item[]
  onFetchResponse: EventHookOn<Response>
  onFetchError: EventHookOn
}

const manifestations = ref([] as Manifestation[]);
if(dataObject?._source?.manifestations?.length > 0) {
    manifestations.value = dataObject._source?.manifestations;
} else {
    manifestations.value = [] as Manifestation[];
}
console.log('manifestations', manifestations.value);

/*
const { status, data: manifestations } = useFetch<ApiResponseManifestationList>(`${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_MANIFEST_BY_WORK}`, 
    {
        method: 'POST',
        lazy: true,
        body: {
            id: "21.11155/"+dataObject._id
        }
    });
    */
</script>
