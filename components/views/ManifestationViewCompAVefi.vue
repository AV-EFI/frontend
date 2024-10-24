<template>
  <div>
    <div
      v-if="mir"
    >
      <div class="mb-2">
        <h2
          class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="mir.has_primary_title.has_name"
        >
          {{ mir.has_primary_title.has_name }}
        </h2>
        <!-- top -->
        <div class="grid-container">
          <div class="mb-2">
            <span>
              {{ $t(mir.category?? '') }}
            </span>
          </div>

          <!-- is_manifestation_of -->
          <div
            v-if="mir.is_manifestation_of"
            class="mb-2"
          >
            <ul v-if="mir.is_manifestation_of">
              <li
                v-for="(has_record_is_manifestation_of_item, has_record_is_manifestation_of_index) in mir.is_manifestation_of"
                :key="has_record_is_manifestation_of_index"
              >
                <div>
                  <a
                    :href="`/film/${has_record_is_manifestation_of_item.id.replace(/^\d{2,3}\.\d{1,5}\//g,'')}`"
                    class="link link-primary dark:link-accent dark:link-accent link-hover"
                    alt="Referenz bei AVefi"
                    title="Referenz bei AVefi"
                  >
                    Dazugehöriges Werk bei {{ $t(has_record_is_manifestation_of_item.category) }}&nbsp;
                    <Icon
                      name="fa-regular:hand-point-right"
                      size="1em"
                      class="!align-baseline"
                      alt="Referenz bei Filmportal"
                    />
                  </a>
                </div>
              </li>
            </ul>
          </div>



          <div
            class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min"
          >
            <!--left-->
            <div class="md:col-span-8 col-span-12">
              <ul v-if="mir.same_as">
                <li
                  v-for="(has_record_same_as_item, has_record_same_as_index) in mir.same_as"
                  :key="has_record_same_as_index"
                >
                  <a
                    :href="`https://www.filmportal.de/film/${has_record_same_as_item.id}`"
                    class="link link-primary dark:link-accent link-hover"
                    alt="Referenz bei  Filmportal"
                    title="Referenz bei Filmportal"
                    target="_blank"
                  >
                    {{ $t('filmportalref') }}&nbsp;
                    <Icon
                      v-if="has_record_same_as_item.category === 'avefi:FilmportalResource'"
                      name="carbon:notebook-reference"
                      size="1em"
                      class="!align-baseline"
                      alt="Referenz bei Filmportal"
                    />
                  </a>
                </li>
              </ul>
              <h2 class="dark:text-primary-100">
                EFI:
              </h2>
              <GlobalClipboardComp :display-text="data?._source?.handle" />
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
                  class="grid grid-cols-7 gap-3 mb-2"
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
          <div class="grid grid-cols-12 gap-2">
            <!-- has_event -->
            <div class="col-span-12 md:col-span-7 mb-2">
              <div
                v-for="(has_event_item, event_index) in mir.has_event"
                :key="event_index"
                class="grid grid-cols-12 gap-2 event mb-4"
              >
                <div class="col-span-full">
                  <h2 class="text-primary-800 dark:text-primary-100">
                    {{ $t(has_event_item.category) }}
                  </h2>
                </div>

                <div class="col-span-full md:col-span-2">
                  <span class="text-md font-bold text-primary-900 dark:text-primary-100 md:float-right capitalize">
                    {{ $t('year') }}:
                  </span>
                </div>
                <div 
                  class="col-span-full md:col-span-8 md:col-start-3"
                >
                  {{ has_event_item.has_date }}
                </div>

                <div
                  v-if="has_event_item.located_in"
                  class="col-span-full md:col-span-4"
                >
                  <span class="text-md font-bold text-primary-900 dark:text-primary-100 md:float-right capitalize">
                    {{ $t('place') }}:
                  </span>
                </div>
                <div
                  v-if="has_event_item.located_in"
                  class="col-span-full md:col-span-8 md:col-start-5"
                >
                  <ul>
                    <li
                      v-for="(located_in_item, located_in_index) in has_event_item.located_in"
                      :key="located_in_index"
                    >
                      {{ located_in_item.has_name }}
                    </li>
                  </ul>
                </div>

                <!-- has_activity -->
                <div 
                  v-for="(has_activity_item, activity_index) in has_event_item.has_activity"
                  :key="activity_index"
                  class="grid col-span-full grid-cols-12 gap-2 activity"
                >
                  <div class="col-span-full md:col-span-6 md:col-start-2">
                    <h2 class="text-primary-800 dark:text-primary-100">
                      {{ $t(has_activity_item.category) }}
                    </h2>
                  </div>
                  <div class="col-span-3 md:col-span-4 md:col-start-2">
                    <span class="text-sm font-bold text-primary-900 dark:text-primary-100 md:float-right md:text-right">
                      {{ $t(has_activity_item.type) }}:
                    </span>
                  </div>
                  <!-- has_agent -->
                  <div
                    class="col-span-full md:col-span-7 col-start-5"
                  >
                    <ul>
                      <li
                        v-for="(has_agent_item, agent_index) in has_activity_item.has_agent"
                        :key="agent_index"
                        class="text-sm"
                      >
                        <strong>{{ $t(has_agent_item.type) }}:</strong><br>
                        {{ has_agent_item.has_name }}
                        <span v-if="has_agent_item.same_as">
                          &nbsp;|&nbsp;
                          <span
                            v-for="(same_as_item, same_as_index) in has_agent_item.same_as"
                            :key="same_as_index"
                          >
                            <a
                              v-if="same_as_item.category === 'avefi:GNDResource'"
                              class="link link-primary dark:link-accent link-hover"
                              :href="`https://explore.gnd.network/gnd/${same_as_item.id}`"
                              alt="Referenz bei GND"
                              title="Referenz bei GND"
                              target="_blank"
                            >
                              <Icon
                                name="fa-regular:address-card"
                                size="1.2em"
                                class="!align-text-bottom"
                                alt="Referenz bei GND"
                              /> 
                            </a></span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-span-full md:col-span-5">
              <div class="grid grid-cols-7 gap-2">
                <div
                  v-if="mir.has_duration"
                  class="col-span-full md:col-span-7"
                >
                  <h2 class=" dark:text-primary-100">
                    {{ $t('avefi:Duration') }}:
                  </h2>
                  {{ mir.has_duration?.has_value }}
                </div>

                <!-- in_language -->
                <div
                  v-if="mir.in_language"
                  class="col-span-full mb-2"
                >
                  <div class="grid grid-cols-7 gap-2">
                    <div class="col-span-full md:col-span-3">
                      <span class="text-md font-bold text-primary-900 dark:text-primary-100 md:float-right">
                        in_language:
                      </span>
                    </div>
                    <div
                      v-for="(in_language_item, in_language_index) in mir.in_language"
                      :key="in_language_index"
                      class="col-span-4 col-start-4 in_language"
                    >              
                      {{ $t(in_language_item?.code) }} ({{ in_language_item?.usage }})
                    </div>
                  </div>
                </div>

                <!-- has_colour_type -->
                <div
                  v-if="mir.has_colour_type"
                  class="col-span-full mb-2"
                >
                  <div class="grid grid-cols-7 gap-1">
                    <div class="col-span-full md:col-span-3">
                      <span class="text-md font-bold text-primary-900 dark:text-primary-100 md:float-right">
                        has_colour_type:
                      </span>
                    </div>
                    <div class="col-span-full md:col-span-4 md:col-start-4">
                      {{ $t(mir.has_colour_type??'') }}
                    </div>
                  </div>
                </div>
                <!-- has_sound_type -->
                <div
                  v-if="mir.has_sound_type"
                  class="col-span-12 md:col-span-7 mb-2"
                >
                  <div class="grid grid-cols-7 gap-1">
                    <div class="col-span-full md:col-span-3">
                      <span class="text-md font-bold text-primary-900 dark:text-primary-100 md:float-right">
                        has_sound_type:
                      </span>
                    </div>
                    <div class="col-span-full md:col-span-4 md:col-start-4">
                      {{ $t(mir.has_sound_type??'') }}
                    </div>
                  </div>
                </div>
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
            </div>
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

      <div
        v-if="mir.has_item"
      >
        <h2>{{ $t('items') }}</h2>
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $t('category') }}</th>
              <th>Filmhaltende Institution</th>
              <th>Detailansicht</th>            
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in mir.has_item"
              :key="item.id"
            >
              <td>{{ item?.id }}</td>
              <td>{{ $t(item.category) }}</td>
              <td>-</td>
              <td class="flex justify-center">
                <a
                  :href="`/film/${item.id.replace('21.11155/','')}`"
                >
                  <Icon
                    class="text-2xl"
                    name="bx:detail"
                  />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
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
import type {Manifestation} from '../../models/interfaces/av_efi_schema.ts';
const dataJson = defineModel({type: String, required: true});
const data = JSON.parse(dataJson.value);
const mir:Manifestation = data?._source?.has_record; 

</script>
