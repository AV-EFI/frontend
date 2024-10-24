<template>
  <div>
    <div
      v-if="mir"
    >
      <div class="mb-2">
        <h2
          class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="mir.has_primary_title?.has_name"
        >
          {{ mir.has_primary_title?.has_name }}
        </h2>
        <!-- top -->
        <div class="grid-container">
          <div class="mb-2">
            <span>
              {{ $t(mir.category?? '') }}
            </span>
          </div>
          <div
            v-if="mir.is_item_of"
            class="mb-2"
          >
            <div>
              <a
                :href="`/film/${mir.is_item_of.id.replace(/^\d{2,3}\.\d{1,5}\//g,'')}`"
                class="link link-primary dark:link-accent link-hover"
                alt="Referenz bei AVefi"
                title="Referenz bei AVefi"
              >
                Dazugehörige Manifestation bei {{ $t(mir.is_item_of.category) }}&nbsp;
                <Icon
                  name="fa-regular:hand-point-right"
                  size="1em"
                  class="!align-baseline"
                  alt="Manifestation"
                />
              </a>
            </div>
          </div>
          <div
            class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min"
          >
            <!--left-->
            <div class="md:col-span-8 col-span-12">
              <h2 class=" dark:text-primary-100">
                EFI:
              </h2>
              <GlobalClipboardComp
                class="text-sm"
                :display-text="data?._source?.handle"
              />
              <!-- has_alternative_title -->
              <div
                v-if="mir.has_alternative_title"
                class="col-span-12"
              >
                <h2 class="dark:text-primary-100">
                  {{ $t('AlternativeTitle') }}:
                </h2>
                <div 
                  v-for="(has_alttitle_item, alttitle_index) in mir.has_alternative_title"
                  :key="alttitle_index"
                  class="grid grid-cols-7 gap-3 event"
                >
                  <div class="col-span-full md:col-span-7">
                    {{ has_alttitle_item.has_name }} ({{ $t(has_alttitle_item.type) }})
                  </div>
                </div>
              </div>
            </div>

            <!--right-->
            <div class="col-span-12 md:col-span-4">
              <div class="grid grid-cols-12 gap-2">
                <!-- Genre -->
                <div class="col-span-12 md:col-span-6">
                  <h2 class="md:float-right dark:text-primary-100" />
                </div>
                <div class="col-span-12 md:col-span-6">
                  <ul />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="mt-4 mb-4">
    
      <!-- center -->
      <div>
        <div class="grid-container">
          <div class="grid grid-cols-12 gap-2 ">
            <div
              v-if="mir.has_duration"
              class="col-span-12 md:col-span-7"
            >
              <h2 class=" dark:text-primary-100">
                {{ $t('avefi:Duration') }}:
              </h2>

              {{ mir.has_duration?.has_value }}
            </div>

            <!-- has_format -->
            <div 
              v-for="(has_format_item, has_format_index) in mir.has_format"
              :key="has_format_index"
              class="grid col-span-7 grid-cols-7 gap-3 has_format"
            >
              <div class="col-span-full md:col-span-2">
                <span class="text-md font-bold text-primary-900  dark:text-primary-100 md:float-right">
                  {{ $t(has_format_item?.category) }}:
                </span>
              </div>
              <div class="col-span-full md:col-span-5">
                <span class="text-md">
                  {{ $t(has_format_item?.type?? '') }}
                </span>
              </div>
            </div>

            <!-- has_event -->
            <div class="col-span-12 md:col-span-7">
              <div
                v-for="(has_event_item, event_index) in mir.has_event"
                :key="event_index"
                class="grid grid-cols-7 gap-3 event"
              >
                <div class="col-span-full">
                  <h2 class=" dark:text-primary-100">
                    {{ $t(has_event_item.category) }}
                  </h2>
                </div>
                <div class="col-span-full md:col-span-2">
                  <span class="text-md font-bold text-primary-900 dark:text-primary-100 md:float-right">
                    Jahr:
                  </span>
                </div>
                <div class="col-span-full md:col-span-5">
                  {{ has_event_item.has_date }}
                </div>
                
                <div class="col-span-full md:col-span-7">
                  <DetailLocatedInComp :located-in-data="has_event_item.located_in" />
                </div>

                <!-- has_activity -->
                <div 
                  v-for="(has_activity_item, activity_index) in has_event_item.has_activity"
                  :key="activity_index"
                  class="grid col-span-7 grid-cols-7 gap-3 activity"
                >
                  <div class="col-span-full md:col-span-6 md:col-start-2">
                    <h3 class="text-primary-800 dark:text-primary-100">
                      {{ $t(has_activity_item.category) }}
                    </h3>
                  </div>
                  <div class="col-span-full md:col-span-2">
                    <span class="text-md font-bold text-primary-900  dark:text-primary-100 md:float-right">
                      {{ $t(has_activity_item.type) }}:
                    </span>
                  </div>
                  <!-- has_agent -->
                  <DetailHasAgentComp :agent-data="has_activity_item.has_agent" />
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-span-full md:col-span-5">
              <div class="grid grid-cols-6 gap-3">
                <div class="col-span-full md:col-span-2" />
                <div class="col-span-full md:col-span-4" />
              </div>
            </div>
          </div>
          <hr class="mt-4 mb-4">
          <div class="grid grid-cols-12 gap-2">
            <!-- Described by -->
            <div
              v-if="mir.described_by"
              class="col-span-full md:col-span-2"
            >
              <span class="text-md font-bold text-primary-900  dark:text-primary-100 md:float-right">Described by:</span>
              <div class="col-span-full md:col-span-8">
                <p>{{ mir.described_by?.has_issuer_name }}</p>
                <a 
                  :href="mir.described_by?.has_issuer_id"
                  class="link link-primary dark:link-accent link-hover"
                  alt="Referenz bei ISIL"
                  title="Referenz bei ISIL"
                  target="_blank"
                >
                  {{ mir.described_by?.has_issuer_id }}
                </a>
                <p>{{ new Date(data?._source['@timestamp']??'').toLocaleString('de-DE') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <pre>{{ mir }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
//models\interfaces\av_efi_schema.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {Item} from '../../models/interfaces/av_efi_schema.ts';
const dataJson = defineModel({type: String, required: true});
const data = JSON.parse(dataJson.value);
const mir:Item = data?._source?.has_record; 

</script>
