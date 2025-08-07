<template>
  <div>
    <div
      v-for="item in parsedData"
      :key="item.handle"
      class="card bg-white border border-base-100 border-2 shadow-md rounded-xl dark:bg-gray-800 w-full shadow-lg hover:shadow-xl mb-4 text-neutral-900 dark:text-white"
      role="region"
      :aria-label="`${$t('title')}: ${item.has_record?.has_primary_title?.has_name}`"
    >
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row min-h-12 w-full p-4 rounded-t-xl bg-primary dark:bg-primary-800 text-white"
        :class="{ 'rounded-b-xl': !hasExtraInfo(item) }"
      >
        <div class="max-md:w-full w-4/5">
          <GlobalClipboardComp
            :display-text="item.handle"
            class="text-xs text-gray-50 dark:text-gray-300"
            :aria-label="$t('copyEfi')"
            :title="$t('copyEfi')"
            :dark-bg="true"
          />

          <h2 class="font-bold text-lg my-1 text-primary-50 dark:text-white">
            <a
              :href="`/film/${getHandlePrefix(item.handle)}/${getHandleId(item.handle)}`"
              :title="$t('detailviewlink')"
              class="link dark:link-white no-underline hover:underline"
            >
              {{ item.has_record?.has_primary_title?.has_name || item.handle }}
            </a>
          </h2>

          <div class="flex flex-col md:flex-row text-sm mt-2">
            <span v-if="getPlaces(item)" class="flex items-center">
              <Icon name="mdi:map-marker-outline" class="mr-1" :alt="$t('place')" :title="$t('place')" />
              {{ getPlaces(item) }}
            </span>

            <span v-if="item.years" class="flex items-center md:ml-4">
              <Icon name="fa:calendar" class="mr-1" :alt="$t('productionyear')" :title="$t('productionyear')" />
              {{ item.years.join(', ') }}
            </span>

            <span v-if="item.directors_or_editors" class="flex items-center md:ml-4">
              <Icon name="iconoir:director-chair" class="mr-1" :alt="$t('directors_or_editors')" :title="$t('directors_or_editors')" />
              {{ item.directors_or_editors.join(', ') }}
            </span>
          </div>
        </div>

        <div class="w-full md:w-1/5 flex justify-end items-center mt-2 md:mt-0">
          <NuxtLink
            :to="`/film/${getHandlePrefix(item.handle)}/${getHandleId(item.handle)}`"
            class="btn btn-circle btn-outline btn-md mr-2 text-white"
            :aria-label="$t('detailviewlink')"
            :title="$t('detailviewlink')"
          >
            <Icon name="mdi:eye-outline" class="text-2xl" :alt="$t('detailviewlink')" />
          </NuxtLink>
        </div>
      </div>

      <!-- Expand toggle -->
      <div
        v-if="hasExtraInfo(item)"
        class="border-t border-base-200 bg-base-200 px-3 py-2 flex justify-center"
      >
        <button
          class="btn btn-primary btn-xs btn-outline my-2 mx-auto"
          :aria-label="$t('toggleDetails')"
          :title="$t('toggleDetails')"
          :aria-expanded="expanded[item.handle] || false"
          @click="expanded[item.handle] = !expanded[item.handle]"
        >
          <Icon
            :name="expanded[item.handle] ? 'mdi:minus' : 'mdi:plus'"
            class="text-lg"
            :alt="expanded[item.handle] ? $t('hideDetails') : $t('showDetails')"
            :title="expanded[item.handle] ? $t('hideDetails') : $t('showDetails')"
          />
          <span class="text-sm">
            {{ expanded[item.handle] ? $t('hideDetails') : $t('showDetails') }}
          </span>
        </button>
      </div>

      <!-- Expanded info -->
      <transition name="fade">
        <div v-if="expanded[item.handle]" class="card-body p-4 pt-0 text-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

            <!-- Subjects -->
            <div v-if="item.has_record?.has_subject" class="flex flex-col">
              <MicroLabelComp label-text="avefi:Subject" />
              <ul>
                <li
                  v-for="(subj, idx) in item.has_record.has_subject"
                  :key="idx"
                  class="inline-block mr-2 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ subj?.has_name ?? '' }}
                </li>
              </ul>
            </div>

            <!-- Forms -->
            <div v-if="item.has_record?.has_form" class="flex flex-col">
              <MicroLabelComp label-text="has_form" />
              <ul>
                <li
                  v-for="(form, idx) in item.has_record.has_form"
                  :key="idx"
                  class="inline-block mr-2 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ form }}
                </li>
              </ul>
            </div>

            <!-- Genres -->
            <div v-if="item.has_record?.has_genre" class="flex flex-col">
              <MicroLabelComp label-text="avefi:Genre" />
              <ul>
                <li
                  v-for="(genre, idx) in item.has_record.has_genre"
                  :key="idx"
                  class="inline-block mr-2 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ genre.has_name }}
                </li>
              </ul>
            </div>

            <!-- Parts or Work Variants -->
            <div v-if="(item.parts?.length ?? 0) > 0 || (item.work_variants?.length ?? 0) > 0" class="flex flex-col">
              <MicroLabelComp
                :label-text="item.parts?.length ? $t('parts') : $t('workVariants')"
              />
              <ul>
                <li
                  v-for="(entry, idx) in item.parts?.length ? item.parts : item.work_variants"
                  :key="entry.handle || idx"
                  class="inline-block mr-2 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ entry?.has_record?.has_primary_title?.has_name || entry?.handle || '—' }}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiWorkVariant } from '@/models/interfaces/generated';
import type { Event, MovingImageResource } from '@/models/interfaces/schema/avefi_schema_type_utils';

type WorkVariantWithRelations = IAVefiWorkVariant & {
  parts?: MovingImageResource[];
  work_variants?: MovingImageResource[];
};

const props = defineProps<{ 
  dataJson: WorkVariantWithRelations[] 
}>();

const parsedData = computed(() => {
    return Array.isArray(props.dataJson) ? props.dataJson : [];
});

const expanded = reactive<Record<string, boolean>>({});

const getHandlePrefix = (handle: string): string => handle?.split('/')[0] || '';
const getHandleId = (handle: string): string => handle?.split('/')[1] || '';

const getPlaces = (item: IAVefiWorkVariant): string => {
    return item.has_record?.has_event
        ?.flatMap((ev: Event) => ev.located_in?.map(loc => loc.has_name) || [])
        .join(', ') || '';
};

const hasExtraInfo = (item: IAVefiWorkVariant & { parts?: any[]; work_variants?: any[] }): boolean => {
    return (
        (item?.has_record?.has_subject?.length ?? 0) > 0 ||
    (item?.has_record?.has_form?.length ?? 0) > 0 ||
    (item?.has_record?.has_genre?.length ?? 0) > 0 ||
    (item?.parts?.length ?? 0) > 0 ||
    (item?.work_variants?.length ?? 0) > 0
    );
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
