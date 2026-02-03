<template>
  <div class="grid-container col-span-full">
    <div class="grid grid-cols-12 gap-6">
      <div v-for="(entry, eventIndex) in normalizedEvents" :key="eventIndex" :id="`event-${eventIndex}`"
        class="col-span-12 space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        :aria-label="$t('event') + ': ' + (entry.raw?.category ? $t(entry.raw.category) : '')" role="region">
        <header class="flex flex-col gap-1">
          <span class="text-base font-medium leading-5 dark:text-white"
            :aria-label="$t('eventCategory') + ': ' + (entry.raw?.category ? $t(entry.raw.category) : '')"
            role="heading" aria-level="3">
            {{ entry.raw?.category ? $t(entry.raw.category) : '' }}
          </span>
        </header>

        <div class="flex flex-row flex-wrap gap-2 lg:gap-4">
          <!-- ===================== META ===================== -->
          <section v-if="entry.hasMeta" class="w-full space-y-2" :aria-label="$t('eventCategory')">
            <DetailKeyValueComp v-if="entry.showType && entry.raw?.type" keytxt="manifestation_event_type"
              class="w-full dark:text-white" :valtxt="$t(entry.raw.type)"
              :aria-label="$t('eventCategory') + ': ' + $t(entry.raw.type)" :clip="false" />

            <div class="flex flex-row flex-wrap gap-3 lg:gap-6">
              <DetailKeyValueListComp v-if="entry.raw?.located_in" keytxt="place"
                class="w-full lg:w-[calc(50%-0.75rem)] dark:text-gray-300" :valtxt="entry.raw.located_in"
                :aria-label="$t('place') + ': ' + entry.raw.located_in" :clip="false" :ul="true" :same-as="true"
                :narrow="true" />

              <DetailKeyValueComp v-if="entry.raw?.has_date" keytxt="productionyear"
                class="w-full lg:w-[calc(50%-0.75rem)] dark:text-gray-300" :valtxt="entry.raw.has_date"
                :aria-label="$t('productionyear') + ': ' + entry.raw.has_date" :clip="false" />
            </div>
          </section>

          <!-- ===================== CREW ===================== -->
          <section v-if="entry.crew.length" class="w-full space-y-2" :aria-label="$t('crewMember')" role="group">
            <div class="flex flex-row flex-wrap gap-2">
              <div v-for="(activity, activityIndex) in entry.crew" :key="activityIndex"
                class="w-full lg:w-[calc(50%-0.25rem)] rounded-md border border-gray-100 p-2 dark:border-gray-800"
                :aria-label="$t('crewMember') + ': ' + (activity?.type ?? '')">
                <header class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <MicroLabelComp :label-text="activity?.type ?? ''" class="text-ellipsis dark:text-gray-300"
                      :aria-label="$t('crewMemberType') + ': ' + (activity?.type ?? '')" />
                  </div>

                  <span class="badge badge-sm badge-ghost"
                    :aria-label="`${activity?.type ?? ''}: ${normalizeAgents(activity?.has_agent).length}`">
                    {{ normalizeAgents(activity?.has_agent).length }}
                  </span>
                </header>

                <ul class="mt-2 space-y-1" :aria-label="$t('agentsList')">
                  <li v-for="(agent, agentIndex) in normalizeAgents(activity?.has_agent)" :key="agentIndex"
                    :aria-label="$t('agent') + ': ' + (agent?.has_name ?? '')" class="group">
                    <div class="flex items-start justify-between gap-2 rounded-lg px-2 py-2
                     hover:bg-primary-50 focus-within:bg-primary-50
                     dark:hover:bg-gray-800/40 dark:focus-within:bg-gray-800/40">
                      <span class="min-w-0 flex-1 break-words text-sm leading-5 dark:text-gray-300">
                        {{ agent?.has_name ?? '' }}
                      </span>

                      <DetailSameAsComp v-if="agent?.same_as" :same-as-data="agent.same_as" type="person"
                        :aria-label="$t('sameAs')" text="sm"
                        class="flex h-6 items-start opacity-70 group-hover:opacity-100 focus-within:opacity-100" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ===================== CAST ===================== -->
          <section v-if="entry.cast.length" class="w-full lg:w-1/2 space-y-2" :aria-label="$t('castMember')"
            role="group">
            <div class="flex flex-row flex-wrap gap-2">
              <div v-for="(activity, activityIndex) in entry.cast" :key="activityIndex"
                class="w-full rounded-md border border-gray-100 p-2 dark:border-gray-800"
                :aria-label="$t('castMember') + ': ' + (activity?.type ?? '')">
                <header class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <MicroLabelComp :label-text="activity?.type ?? ''" class="text-ellipsis dark:text-gray-300"
                      :aria-label="$t('castMember') + ': ' + (activity?.type ?? '')" />
                  </div>

                  <span class="badge badge-sm badge-ghost"
                    :aria-label="`${activity?.type ?? ''}: ${normalizeAgents(activity?.has_agent).length}`">
                    {{ normalizeAgents(activity?.has_agent).length }}
                  </span>
                </header>

                <ul class="mt-2 space-y-1" :aria-label="$t('agentsList')">
                  <li v-for="(agent, agentIndex) in normalizeAgents(activity?.has_agent)" :key="agentIndex"
                    :aria-label="$t('agent') + ': ' + (agent?.has_name ?? '')" class="group">
                    <div class="flex items-start justify-between gap-2 rounded-lg px-2 py-2
                     hover:bg-primary-50 focus-within:bg-primary-50
                     dark:hover:bg-gray-800/40 dark:focus-within:bg-gray-800/40">
                      <span class="min-w-0 flex-1 break-words text-sm leading-5 dark:text-gray-300">
                        {{ agent?.has_name ?? '' }}
                      </span>

                      <DetailSameAsComp v-if="agent?.same_as" :same-as-data="agent.same_as" type="person"
                        :aria-label="$t('sameAs')" text="sm"
                        class="flex h-6 items-start opacity-70 group-hover:opacity-100 focus-within:opacity-100" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { Event } from "../../models/interfaces/av_efi_schema";

type Activity = NonNullable<Event["has_activity"]>[number];
type Agent = Activity["has_agent"] extends Array<infer T> ? T : NonNullable<Activity["has_agent"]>;

interface NormalizedEvent {
  raw: Event;
  crew: Activity[];
  cast: Activity[];
  hasMeta: boolean;
  showType: boolean;
}

const eventList = defineModel({ type: Array as PropType<Event[]>, required: true });

const normalizedEvents = computed<NormalizedEvent[]>(() => {
    const events = Array.isArray(eventList.value) ? eventList.value : [];
    return events.map((evt) => normalizeEvent(evt));
});

function normalizeEvent(evt: Event): NormalizedEvent {
    const { crew, cast } = splitActivities(evt);
    const showType = !crew.length && !cast.length && Boolean(evt?.type);
    const hasMeta = showType || Boolean(evt?.located_in) || Boolean(evt?.has_date);
    return {
        raw: evt,
        crew,
        cast,
        hasMeta,
        showType,
    };
}

function splitActivities(evt: Event) {
    const activities = Array.isArray(evt?.has_activity) ? evt.has_activity : [];
    const crew: Activity[] = [];
    const cast: Activity[] = [];
    for (const activity of activities) {
        if (!activity) continue;
        if (activity.type === "CastMember") {
            cast.push(activity);
        } else {
            crew.push(activity);
        }
    }
    return { crew, cast };
}

function normalizeAgents(agentData: Activity["has_agent"] | undefined): Agent[] {
    if (Array.isArray(agentData)) {
        return agentData.filter(Boolean) as Agent[];
    }
    if (agentData) {
        return [agentData as Agent];
    }
    return [];
}
</script>
