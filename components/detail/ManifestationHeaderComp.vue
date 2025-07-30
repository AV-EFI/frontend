<template>
  <div
    class="flex flex-row lg:flex-row justify-between lg:items-center"
    role="group"
    :aria-label="`${manifestation?.has_record?.described_by?.has_issuer_name ?? manifestation?.handle}`"
  >
    <div
      v-if="type === 'searchresult'"
      :class="['flex justify-center flex-col w-4/5']"
    >
      <h4 class="col-span-full text-xs text-gray-700 dark:text-gray-300 text-sm">
        {{ manifestation?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-gray-900 dark:text-primary-200 my-1">
        {{ manifestation?.has_record?.described_by?.has_issuer_name }}
      </h4>

      <div class="col-span-full text-sm 2xl:text-md text-gray-700 dark:text-neutral-200 flex flex-row">
        <span
          v-if="manifestation?.has_record?.has_event?.has_date"
          class="flex flex-row justify-start items-center"
          :aria-label="$t('productionyear') + ': ' + manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ')"
        >
          {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>

        <span
          v-if="manifestation?.has_record?.has_colour_type"
          class="flex flex-row items-center"
          :aria-label="$t('has_colour') + ': ' + $t(manifestation.has_record?.has_colour_type)"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span>
          </template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block"
            aria-hidden="true"
          />
          {{ $t(manifestation.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="manifestation?.has_record?.in_language"
          class="flex flex-row items-center"
          :aria-label="$t('in_language_code') + ': ' + manifestation.has_record?.in_language?.map(language => `${$t(language?.code || '')}`).join(', ')"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date || manifestation.has_record?.has_colour_type">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span>
          </template>
          <Icon
            name="mdi:language"
            class="w-4 h-4 mr-1 inline-block"
            aria-hidden="true"
          />
          {{ manifestation.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </div>

      <div class="flex flex-row mt-1 hidden">
        <div
          v-if="allItemsEmpty"
          class="badge bg-warning-300 text-white z-10"
          role="note"
          :aria-label="$t('emptyItemsLong')"
        >
          <Icon
            class="text-lg"
            name="mi:document-empty"
            aria-hidden="true"
          />
          &nbsp;{{ $t('emptyItemsShort') }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col justify-center w-4/5"
    >
      <h4 class="col-span-full text-xs text-gray-700 dark:text-gray-300 text-sm">
        {{ manifestation?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-gray-900 dark:text-primary-200 my-1 xl:text-base">
        {{ manifestation?.has_record?.described_by?.has_issuer_name }}
      </h4>

      <div class="col-span-full text-sm 2xl:text-md text-gray-700 dark:text-neutral-200 flex flex-row flex-wrap">
        <span
          v-if="manifestation?.has_record?.has_event?.has_date"
          class="flex flex-row justify-start items-center"
          :aria-label="$t('productionyear') + ': ' + manifestation._source.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ')"
        >
          {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation?.has_record?.has_colour_type"
          class="flex flex-row items-center mr-1"
          :aria-label="$t('has_colour') + ': ' + $t(manifestation?.has_record?.has_colour_type)"
        >
          <template v-if="manifestation?.has_record?.has_event?.has_date">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span>
          </template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block"
            aria-hidden="true"
          />
          {{ $t(manifestation?.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="Array.isArray(manifestation?.has_record?.in_language) && manifestation.has_record.in_language.length > 0 && manifestation.has_record?.in_language[0]?.code"
          class="flex flex-row items-center mr-1"
          :aria-label="formatInLanguageAria(manifestation.has_record.in_language)"
        >
          <template
            v-if="manifestation?.has_record?.has_event?.length || manifestation?.has_record?.has_colour_type"
          >
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span>
          </template>
          <Icon
            name="mdi:language"
            class="w-4 h-4 mr-1 inline-block"
            aria-hidden="true"
          />
          {{ formatInLanguageText(manifestation.has_record.in_language) }}
        </span>
        <span
          v-if="manifestation.has_record.has_item"
          class="flex flex-row items-center"
        >
          <Icon
            name="i-carbon:chart-relationship"
            class="w-4 h-4 mr-1 inline-block"
          />
          {{ manifestation.has_record.has_item.length }}&nbsp;{{ manifestation.has_record.has_item.length === 1 ? $t('item') : $t('items') }}
        </span>
      </div>

      <div class="flex flex-row mt-1">
        <div
          v-if="allItemsEmpty"
          class="badge bg-warning text-white z-10"
          role="note"
          :aria-label="$t('emptyItemsLong')"
        >
          <Icon
            class="text-lg"
            name="mi:document-empty"
            aria-hidden="true"
          />
          &nbsp;{{ $t('emptyItemsShort') }}
        </div>
      </div>
    </div>

    <div class="hidden">
      <MicroEfiCopyComp
        :handle="manifestation?.handle ?? manifestation?.handle"
        category="manifestation"
        class="z-10 relative"
        :comp-size="compSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps({
    manifestation: Object as PropType<any>,
    type: String as PropType<string>,
    compSize: {
        type: String as PropType<string>,
        default: 'md',
    },
    isTwin: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    allItemsEmpty: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
});
const { t: $t } = useI18n();

function safeT(val: unknown): string {
    return typeof val === 'string' && val.trim()
        ? $t(val)
        : '';
}

function formatInLanguageText(langs: any[]): string {
    return langs
        .map(lang => safeT(lang?.code))
        .filter(Boolean)
        .join(', ');
}

function formatInLanguageAria(langs: any[]): string {
    return safeT('in_language_code') + ': ' + langs
        .map(lang => safeT(lang?.code))
        .filter(Boolean)
        .join(', ');
}

</script>
