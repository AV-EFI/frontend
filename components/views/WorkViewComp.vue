<template>
  <div>
    <div class="mb-2">
      <h2
        class="text-lg mb-2  dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="dataJson.has_record.has_primary_title.has_name"
      >
        {{ dataJson.has_record.has_primary_title.has_name }}
      </h2>
      <div class="grid-container">
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <!--left-->
          <div class="md:col-span-8 col-span-12">
            <ul v-if="dataJson.has_record.same_as">
              <li
                v-for="(has_record_same_as_item, has_record_same_as_index) in dataJson.has_record.same_as"
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
                    name="fa-regular:hand-peace"
                    size="1em"
                    class="!align-baseline"
                    alt="Referenz bei Filmportal"
                  />
                </a>
              </li>
            </ul>
            <h2 class=" dark:text-primary-100">
              ID:
            </h2>
            <pre class="text-wrap">{{ dataJson.has_record.id }}</pre>            
          </div>
          <!--right-->
          <div class="col-span-12 md:col-span-4">
            <div class="grid grid-cols-12 gap-2 ">
              <div
                v-if="dataJson.has_record.type"
                class="col-span-12 md:col-span-6"
              >
                <h2 class="md:float-right dark:text-primary-100">
                  {{ $t('Type') }}:
                </h2>
              </div>
              <div class="col-span-12 md:col-span-6">
                <span>
                  {{ $t(dataJson.has_record.type) }}
                </span>
              </div>
              <!-- Genre -->
              <div class="col-span-12 md:col-span-6">
                <h2 class="md:float-right dark:text-primary-100">
                  {{ $t('avefi:Genre') }}:
                </h2>
              </div>
              <div class="col-span-12 md:col-span-6">
                <ul>
                  <li
                    v-for="(has_genre_item, has_genre_index) in dataJson.has_record.has_genre"
                    :key="has_genre_index"
                  >
                    {{ has_genre_item.has_name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="mt-4 mb-4">
    
    <div
      v-if="dataJson.has_record.has_event"
    >
      <div class="grid-container">
        <div class="grid grid-cols-12 gap-2 ">
          <!-- has_event -->
          <div class="col-span-12 md:col-span-7">
            <div
              v-for="(has_event_item, event_index) in dataJson.has_record.has_event"
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
              <div class="col-span-full md:col-span-2">
                <span class="text-md font-bold text-primary-900  dark:text-primary-100 md:float-right">
                  Ort:
                </span>
              </div>
              <div class="col-span-full md:col-span-5">
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
                class="grid col-span-7 grid-cols-7 gap-3 activity"
              >
                <div class="col-span-full md:col-span-2">
                  <span class="text-md font-bold text-primary-900  dark:text-primary-100 md:float-right">
                    {{ $t(has_activity_item.type) }}:
                  </span>
                </div>
                <!-- has_agent -->
                <div
                  class="col-span-full md:col-span-5"
                >
                  <ul>
                    <li
                      v-for="(has_agent_item, agent_index) in has_activity_item.has_agent"
                      :key="agent_index"
                    >
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
                              size="1em"
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
            v-if="dataJson.has_record.described_by"
            class="col-span-full md:col-span-2"
          >
            <span class="text-md font-bold text-primary-900  dark:text-primary-100 md:float-right">Described by:</span>
          </div>
          <div class="col-span-full md:col-span-8">
            <p>{{ dataJson.has_record.described_by.has_issuer_name }}</p>
            <a 
              :href="dataJson.has_record.described_by.has_issuer_id"
              class="link link-primary dark:link-accent link-hover"
              alt="Referenz bei ISIL"
              title="Referenz bei ISIL"
              target="_blank"
            >
              {{ dataJson.has_record.described_by.has_issuer_id }}
            </a>
            <p>{{ new Date(dataJson.has_record.described_by.last_modified).toLocaleString('de-DE') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const dataJson = defineModel({type: Object, required: true});
</script>
