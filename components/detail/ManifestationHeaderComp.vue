<template>
  <div class="flex flex-row justify-between items-center">
    <div
      v-if="type == 'searchresult'"
      class="flex flex-col justify-center"
    >
      <h4 class="col-span-full text-xs 2xl:text-base">
        {{ manifestation?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-primary-900 dark:text-primary-200 text-sm xl:text-base">
        {{ manifestation.has_record?.described_by?.has_issuer_name }}
      </h4>
      <h4 class="col-span-full text-sm xl:text-base">
        <span
          v-if="manifestation.has_record?.has_event?.has_date"
          class="flex inline-flex flex-row justify-start items-center"
        >
          {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation.has_record?.has_colour_type"
          class="flex inline-flex flex-row items-center"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date"><span class="flex flex-row items-center">&nbsp;|&nbsp;</span></template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block text-primary"
            :alt="$t('has_colour')"
          />
          {{ $t(manifestation.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="manifestation.has_record?.in_language"
          class="flex inline-flex flex-row justify-start items-center"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date || manifestation.has_record?.has_colour_type"><span class="flex flex-row items-center">&nbsp;|&nbsp;</span></template>
          <Icon
            name="fa:language"
            class="w-4 h-4 mr-1 inline-block text-primary"
            :alt="$t('in_language_code')"
          />
          {{ manifestation.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </h4>
    </div>
    <div v-else>
      <h4 class="col-span-full text-xs 2xl:text-base">
        {{ manifestation._source?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-primary-900 dark:text-primary-200 text-sm xl:text-base">
        {{ manifestation._source.has_record?.described_by?.has_issuer_name }}
      </h4>
      <h4 class="col-span-full text-sm xl:text-base">
        {{ manifestation._source.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
      </h4>
      <h4 class="col-span-full text-sm xl:text-base">
        <span
          v-if="manifestation._source?.has_record?.has_event?.has_date"
          class="flex inline-flex flex-row justify-start items-center"
        >
          {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation._source?.has_record?.has_colour_type"
          class="flex inline-flex flex-row items-center"
        >
          <template v-if="manifestation._source?.has_record?.has_event?.has_date"><span class="flex flex-row items-center">&nbsp;|&nbsp;</span></template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block text-primary"
            :alt="$t('has_colour')"
          />
          {{ $t(manifestation._source?.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="manifestation._source?.has_record?.in_language"
          class="flex inline-flex flex-row justify-start items-center"
        >
          <template v-if="manifestation._source?.has_record?.has_event?.has_date || manifestation._source?.has_record?.has_colour_type"><span class="flex flex-row items-center">&nbsp;|&nbsp;</span></template>
          <Icon
            name="fa:language"
            class="w-4 h-4 mr-1 inline-block text-primary"
            :alt="$t('in_language_code')"
          />
          {{ manifestation._source?.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </h4>
    </div>
    <div>
      <MicroEfiCopyComp
        :handle="manifestation?.handle?? manifestation._source?.handle"
        class="z-10 relative"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    manifestation: Object as PropType<any>,
    type: String as PropType<string>,
});
</script>