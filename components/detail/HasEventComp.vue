<template>
  <div class="grid-container col-span-full">
    <div class="grid grid-cols-12 gap-2">
      <!-- has_event -->
      <!-- papa grid -->       
      <div
        v-for="(has_event_item, event_index) in eventList"
        :key="event_index"
        class="grid grid-cols-12 gap-2 col-span-12 event"
      >
        <NuxtLayout
          v-if="getCastMemberList(has_event_item)?.length > 0"
          name="partial-grid-3-4-4"
        >
          <template #heading>
            {{ $t(has_event_item.category) }}
          </template>
          <template #left>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCrewMemberList(has_event_item)"
              :key="activity_index"
              class="col-span-full"
            >
              <MicroLabelComp
                :label-text="has_activity_item.type"
                class="text-ellipsis"
              />
              <!-- has_agent -->
              <ul>
                <li
                  v-for="(has_agent_item, agent_index) in has_activity_item.has_agent"
                  :key="agent_index"
                >
                  <span class="break-words inline text-sm">
                    {{ has_agent_item.has_name }}
                    <DetailSameAsComp
                      v-if="has_agent_item.same_as"
                      :same-as-data="has_agent_item.same_as"
                    />
                  </span>
                </li>
              </ul>
            </div>
          </template>
          <template #center>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCastMemberList(has_event_item)"
              :key="activity_index"
              class="grid col-span-12 grid-cols-8 activity"
            >
              <div
                class="col-span-full md:col-span-full"
              >
                <MicroLabelComp
                  :label-text="has_activity_item.type"
                  class="text-ellipsis"
                />
                <!-- has_agent -->
                <div
                  class="col-span-full md:col-span-full"
                >
                  <ul>
                    <li
                      v-for="(has_agent_item, agent_index) in has_activity_item.has_agent"
                      :key="agent_index"
                    >
                      <span class="break-words text-sm">
                        {{ has_agent_item.has_name }}
                        <DetailSameAsComp
                          v-if="has_agent_item.same_as"
                          :same-as-data="has_agent_item.same_as"
                        />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
          <template #right>
            <DetailKeyValueComp
              v-if="has_event_item?.has_date"
              keytxt="year"
              class="col-span-full"
              :valtxt="has_event_item?.has_date"
            />
            <DetailKeyValueListComp
              v-if="has_event_item?.located_in"
              keytxt="place"
              class="col-span-full"
              :valtxt="has_event_item?.located_in"
            />
          </template>
        </NuxtLayout>
        <NuxtLayout
          v-else
          name="partial-grid-2-1"
        >
          <template #heading>
            {{ $t(has_event_item.category) }}
          </template>
          <template #left>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCrewMemberList(has_event_item)"
              :key="activity_index"
              class="col-span-6"
            >
              <MicroLabelComp
                :label-text="has_activity_item.type"
                class="text-ellipsis"
              />
              <!-- has_agent -->
              <ul>
                <li
                  v-for="(has_agent_item, agent_index) in has_activity_item.has_agent"
                  :key="agent_index"
                >
                  <span class="break-words inline text-sm">
                    {{ has_agent_item.has_name }}
                    <DetailSameAsComp
                      v-if="has_agent_item.same_as"
                      :same-as-data="has_agent_item.same_as"
                    />
                  </span>
                </li>
              </ul>
            </div>
          </template>
          <template #right>
            <DetailKeyValueComp
              v-if="has_event_item?.has_date"
              keytxt="year"
              class="col-span-full"

              :valtxt="has_event_item?.has_date"
            />
            <DetailKeyValueListComp
              v-if="has_event_item?.located_in"
              keytxt="place"
              class="col-span-full"
              :valtxt="has_event_item?.located_in"
            />
          </template>
        </NuxtLayout>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Event } from '../../models/interfaces/av_efi_schema';
const eventList = defineModel({type: Array as PropType<Event[]>, required: true});

//).length > 0

function getCastMemberList (hasEvent: Event) {
    try {
        return hasEvent.has_activity?.filter((hasAct) => hasAct.type == 'CastMember');
    }
    catch(ex) {
        console.error(ex);        
    }
    return null;
}

function getCrewMemberList (hasEvent: Event) {
    try {
        return hasEvent.has_activity?.filter((hasAct) => hasAct.type != 'CastMember');
    }
    catch(ex) {
        console.error(ex);        
    }
    return null;
}
</script>