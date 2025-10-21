<template>
  <div
    v-for="exemplar in items"
    :key="exemplar?.id || exemplar?.handle"
    class="grid grid-cols-4 gap-x-2 gap-y-0 mb-4 grid-rows-[minmax(0,1fr)] px-2 md: ml-4 md:px-2 py-1 dark:text-white border-l-2 border-item text-neutral-700"
  >
    <div class="col-span-full row-start-1 mb-2">
      <MicroDividerComp
        class="mx-auto lg:mt-[5px] mb-4"
        label-text="avefi:Item"
        in-class="item"
      />
    </div>

    <!-- 01 EFI Handle -->
    <div class="col-span-full md:col-span-4 row-start-2">
      <DetailKeyValueComp
        :id="exemplar?._id ?? exemplar?.handle?.replace('21.11155/', '') ?? exemplar?.handle"
        :keytxt="$t('efi')"
        :valtxt="exemplar?.handle"
        class="w-full mb-2 text-base"
        :clip="true"
      />
    </div>

    <!-- 02 Status (has_access_status) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="has_access_status" />
          <GlobalTooltipInfo
            :text="$t('tooltip.accessStatus')"
            class="ml-2"
          />
        </span>
        <SearchHighlightSingleComp
          :item="exemplar?.has_record?.has_access_status || null"
          :hitlite="highlightResult?.manifestations?.items?.has_record?.has_access_status?.matchedWords"
          class="text-base"
        />
      </div>
    </div>

    <!-- 03 Format (has_format[].type) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="has_format" />
          <GlobalTooltipInfo
            :text="$t('tooltip.format')"
            class="ml-2"
          />
        </span>
        <SearchHighlightListComp
          :items="(exemplar?.has_record?.has_format || []).map(f => f?.type).filter(Boolean)"
          :hilite="highlightResult?.manifestations?.items?.has_record?.has_format?.type?.matchedWords"
          class="text-base"
        />
      </div>
    </div>

    <!-- 04 Materialart (element_type) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="item_element_type" />
          <GlobalTooltipInfo
            :text="$t('tooltip.elementType')"
            class="ml-2"
          />
        </span>
        <SearchHighlightSingleComp
          :item="exemplar?.has_record?.element_type || null"
          :hitlite="highlightResult?.manifestations?.items?.has_record?.element_type?.matchedWords"
          class="text-base"
        />
      </div>
    </div>

    <!-- 05 Sprache (in_language) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="in_language" />
        </span>
        <SearchHighlightListComp
          :items="(exemplar?.has_record?.in_language || []).map(il => `${$t(il?.code)}${il?.usage?.length ? ' (' + il.usage.map(u => $t(u)).join(', ') + ')' : ''}`)"
          :hilite="highlightResult?.manifestations?.items?.has_record?.in_language?.code?.matchedWords"
          class="text-base"
        />
      </div>
    </div>

    <!-- 06 Ton (Sound Type) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="has_sound_type" />
        </span>
        <p class="text-base font-normal">
          {{ exemplar?.has_record?.has_sound_type ? $t(exemplar.has_record.has_sound_type) : '-' }}
        </p>
      </div>
    </div>

    <!-- 07 Farbe (Colour Type) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="has_colour_type" />
        </span>
        <p class="text-base font-normal">
          {{ exemplar?.has_record?.has_colour_type ? $t(exemplar.has_record.has_colour_type) : '-' }}
        </p>
      </div>
    </div>

    <!-- 08 Abspieldauer (prefer duration_in_minutes, else has_duration) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="has_duration" />
        </span>
        <p class="text-base font-normal">
          {{
            exemplar?.duration_in_minutes
              ? `${exemplar.duration_in_minutes} ${$t('minutes')}`
              : (exemplar?.has_record?.has_duration?.has_value
                ? exemplar.has_record.has_duration.has_value.replace('PT', '').toLowerCase()
                : '-')
          }}
        </p>
      </div>
    </div>

    <!-- 09 Länge / Größe (Extent) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="avefi:Extent" />
        </span>
        <p class="text-base font-normal">
          {{
            exemplar?.has_record?.has_extent?.has_value
              ? `${exemplar.has_record.has_extent.has_value} ${$t(exemplar.has_record.has_extent.has_unit)}`
              : '-'
          }}
        </p>
      </div>
    </div>

    <!-- 10 BPS (Frame rate) -->
    <div class="col-span-full md:col-span-1">
      <div class="flex flex-col mb-2">
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          <MicroLabelComp label-text="has_frame_rate" />
        </span>
        <p class="text-base font-normal">
          {{ exemplar?.has_record?.has_frame_rate || '-' }}
        </p>
      </div>
    </div>

    <!-- 11 Webressource (array) -->
    <div class="col-span-full md:col-span-1 flex flex-col justify-end">
      <span class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
        <MicroLabelComp label-text="webresource" />
        <GlobalTooltipInfo
          :text="$t('tooltip.webresource')"
          class="ml-2"
        />
      </span>

      <template v-if="Array.isArray(exemplar?.has_record?.has_webresource) && exemplar.has_record.has_webresource.length">
        <ul class="mt-1 space-y-0.5">
          <li
            v-for="(url, i) in exemplar.has_record.has_webresource"
            :key="i"
          >
            <a
              :href="url"
              target="_blank"
              rel="noopener"
              class="link link-primary text-base font-semibold inline-flex items-center"
            >
              <Icon
                name="tabler:external-link"
                class="mr-1"
              /> {{ $t('webresource') }}{{ exemplar.has_record.has_webresource.length > 1 ? ` ${i+1}` : '' }}
            </a>
          </li>
        </ul>
      </template>
      <a
        v-else-if="typeof exemplar?.has_record?.has_webresource === 'string'"
        :href="exemplar.has_record.has_webresource"
        target="_blank"
        rel="noopener"
        class="link link-primary my-auto text-base font-semibold inline-flex items-center"
      >
        <Icon
          name="tabler:external-link"
          class="mr-1"
        /> {{ $t('webresource') }}
      </a>
      <p
        v-else
        class="text-base font-semibold opacity-60"
      >
        -
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: { type: Array, required: true },
  highlightResult: { type: Object, required: false, default: () => ({}) },
  productionDetailsChecked: { type: Boolean, required: false, default: false },
  showAdminStats: { type: Boolean, required: false, default: false },
});
</script>
