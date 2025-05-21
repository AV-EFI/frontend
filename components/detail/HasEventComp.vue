<template>
  <div class="grid-container col-span-full">
    <div class="grid grid-cols-12 gap-2">
      <!-- has_event -->
      <!-- papa grid -->       
      <div
        v-for="(has_event_item, event_index) in eventList"
        :key="event_index"
        class="grid grid-cols-12 gap-2 col-span-12 event"
        :aria-label="$t('event') + ': ' + $t(has_event_item.category)"
        role="region"
      >
        <NuxtLayout
          v-if="getCastMemberList(has_event_item)?.length > 0 && getCrewMemberList(has_event_item)?.length > 0"
          name="partial-grid-3-4-4"
        >
          <template #heading>
            <span
              class="dark:text-white"
              :aria-label="$t('eventCategory') + ': ' + $t(has_event_item.category)"
              role="heading"
              aria-level="3"
            >
              {{ $t(has_event_item.category) }}
            </span>
          </template>
          <template #left>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCrewMemberList(has_event_item)"
              :key="activity_index"
              class="col-span-full"
              :aria-label="$t('crewMember') + ': ' + has_activity_item.type"
              role="group"
            >
              <DetailKeyValueListComp
                :keytxt="has_activity_item.type"
                class="col-span-full dark:text-gray-300"
                :ul="true"
                :same-as="true"
                same-as-type="person"
                :valtxt="has_activity_item.has_agent"
                :aria-label="$t('crewMember') + ': ' + has_activity_item.type"
              />
            </div>
          </template>
          <template #center>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCastMemberList(has_event_item)"
              :key="activity_index"
              class="grid col-span-12 grid-cols-8 activity"
              :aria-label="$t('castMember') + ': ' + has_activity_item.type"
              role="group"
            >
              <div class="col-span-full md:col-span-full">
                <div class="col-span-full md:col-span-full">
                  <DetailKeyValueListComp
                    v-if="has_activity_item.has_agent"
                    :keytxt="has_activity_item.type"
                    class="col-span-full dark:text-gray-300"
                    :ul="true"
                    :same-as="true"
                    same-as-type="person"
                    :valtxt="has_activity_item.has_agent"
                    :aria-label="$t('castMember') + ': ' + has_activity_item.type"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #right>
            <DetailKeyValueComp
              v-if="has_event_item?.has_date"
              keytxt="productionyear"
              class="col-span-full dark:text-gray-300"
              :valtxt="has_event_item?.has_date"
              :clip="false"
              :aria-label="$t('productionyear') + ': ' + has_event_item?.has_date"
            />
            <DetailKeyValueListComp
              v-if="has_event_item?.located_in"
              keytxt="place"
              class="col-span-full dark:text-gray-300"
              :valtxt="has_event_item?.located_in"
              :ul="true"
              :aria-label="$t('place') + ': ' + has_event_item?.located_in"
            />
          </template>
        </NuxtLayout>
        <NuxtLayout
          v-else-if="getCrewMemberList(has_event_item)?.length > 0 && getCastMemberList(has_event_item)?.length < 1"
          name="partial-grid-1-1"
        >
          <template #heading>
            <span
              class="dark:text-white"
              :aria-label="$t('eventCategory') + ': ' + $t(has_event_item.category)"
              role="heading"
              aria-level="3"
            >
              {{ $t(has_event_item.category) }}
            </span>
          </template>
          <template #left>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCrewMemberList(has_event_item)"
              :key="activity_index"
              class="col-span-full"
              :aria-label="$t('crewMember') + ': ' + has_activity_item.type"
              role="group"
            >
              <MicroLabelComp
                :label-text="has_activity_item.type"
                class="text-ellipsis dark:text-gray-300"
                :aria-label="$t('crewMemberType') + ': ' + has_activity_item.type"
              />
              <!-- has_agent -->
              <ul :aria-label="$t('agentsList')">
                <li
                  v-for="(has_agent_item, agent_index) in has_activity_item.has_agent"
                  :key="agent_index"
                  :aria-label="$t('agent') + ': ' + has_agent_item.has_name"
                >
                  <span class="break-words inline dark:text-gray-300">
                    {{ has_agent_item.has_name }}
                    <DetailSameAsComp
                      v-if="has_agent_item.same_as"
                      :same-as-data="has_agent_item.same_as"
                      type="person"
                      :aria-label="$t('sameAs')"
                    />
                  </span>
                </li>
              </ul>
            </div>
          </template>
          <template #right>
            <DetailKeyValueComp
              v-if="has_event_item?.has_date"
              keytxt="productionyear"
              class="col-span-full dark:text-gray-300"
              :valtxt="has_event_item?.has_date"
              :aria-label="$t('productionyear') + ': ' + has_event_item?.has_date"
            />
            <DetailKeyValueListComp
              v-if="has_event_item?.located_in"
              keytxt="place"
              class="col-span-full dark:text-gray-300"
              :valtxt="has_event_item?.located_in"
              :aria-label="$t('place') + ': ' + has_event_item?.located_in"
            />
          </template>
        </NuxtLayout>
        <NuxtLayout
          v-else-if="getCastMemberList(has_event_item)?.length > 0"
          name="partial-grid-1-1"
        >
          <template #heading>
            <span
              class="dark:text-white"
              :aria-label="$t('eventCategory') + ': ' + $t(has_event_item.category)"
              role="heading"
              aria-level="3"
            >
              {{ $t(has_event_item.category) }}
            </span>
          </template>
          <template #left>
            <!-- has_activity -->
            <div 
              v-for="(has_activity_item, activity_index) in getCastMemberList(has_event_item)"
              :key="activity_index"
              class="col-span-full"
              :aria-label="$t('castMember') + ': ' + has_activity_item.type"
              role="group"
            >
              <DetailKeyValueListComp
                :keytxt="has_activity_item.type"
                class="col-span-full dark:text-gray-300"
                :ul="true"
                :same-as="true"
                same-as-type="person"
                :valtxt="has_activity_item.has_agent"
                :aria-label="$t('castMember') + ': ' + has_activity_item.type"
              />
            </div>
          </template>
          <template #center>
            <!-- has_activity -->
            <DetailKeyValueComp
              v-if="has_event_item?.has_date"
              keytxt="productionyear"
              class="col-span-full dark:text-gray-300"
              :valtxt="has_event_item?.has_date"
              :ul="true"
              :clip="false"
              :aria-label="$t('productionyear') + ': ' + has_event_item?.has_date"
            />
            <DetailKeyValueListComp
              v-if="has_event_item?.located_in"
              keytxt="place"
              class="col-span-full dark:text-gray-300"
              :valtxt="has_event_item?.located_in"
              :ul="true"
              :aria-label="$t('place') + ': ' + has_event_item?.located_in"
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
