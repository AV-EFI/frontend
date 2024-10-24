<template>
  <div>
    <div>
      <div
        v-if="mir"
      >
        <DetailWorkVariantTopLevelComp
          v-model="mir"
          :handle="dataObject?._source?.handle"
          :es-timestamp="dataObject._source['@timestamp']"
        />
        <DetailHasEventComp
          v-if="mir.has_event"
          v-model="mir.has_event"
          class="mt-4"
        />      
      </div>
      <div v-else>
        <pre>{{ mir }}</pre>
      </div>
    </div>
    <div v-if="status === 'pending'">
      {{ status }}
      Loading Manifestations ...
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
          class="alert alert-warning text-white max-w-96 mt-4"
        >
          <MicroIconTextComp
            icon-name="mdi:emoticon-cry-outline"
            text="noManifestations"
          />
        </div>
      </ClientOnly>
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

const { status, data: manifestations } = useFetch<ApiResponseManifestationList>('/api/elastic/searchmanifestbyworkid', 
    {
        method: 'POST',
        lazy: true,
        body: {
            id: "21.11155/"+dataObject._id
        }
    });
</script>
