<template>
  <div
    v-for="exemplar in items"
    :key="exemplar?.id"
    class="grid grid-cols-4 gap-x-2 gap-y-0 mb-4 grid-rows-[minmax(0,1fr)] px-2 md: ml-4 md:px-2 py-1 dark:text-white border-l-2 border-item text-neutral-700"
  >
    <div class="col-span-full row-start-1 mb-2">
      <MicroDividerComp
        class="mx-auto lg:mt-[5px] mb-4"
        label-text="avefi:Item" 
        in-class="item"
      />
    </div>
    <div class="col-span-full md:col-span-3 row-start-2">
      <DetailKeyValueComp 
        :id="exemplar._id ?? exemplar?.handle?.replace('21.11155/', '') ?? exemplar?.handle"
        :keytxt="$t('EFI')"
        :valtxt="exemplar?.handle"
        class="w-full mb-2"
        :clip="true"
      />
    </div>
    <div class="col-span-full md:col-span-1 md:row-start-2 flex flex-col justify-end">
      <span class="flex items-center gap-1">
        <MicroLabelComp label-text="webresource" />
        <span
          class="inline ml-2"
          role="img"
          aria-label="Info"
          tabindex="0"
          :title="$t('tooltip.webresource')"
        >
          ⓘ
        </span>      
      </span>
      <a
        v-if="exemplar?.has_record?.has_webresource"
        :href="exemplar?.has_record?.has_webresource"
        target="_blank"
        class="link link-primary dark:link-accent my-auto"
      >
        <Icon name="formkit:linkexternal" />&nbsp;{{ $t('webresource') }}
      </a>
      <p v-else>
        -
      </p>
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp
        label-text="has_access_status"
        :alt="$t('has_access_status')"
        :title="$t('has_access_status')"
      />
      <SearchHighlightSingleComp
        :item="exemplar?.has_record?.has_access_status?.type || null"
        :hitlite="highlightResult?.manifestations?.items.has_record?.has_access_status?.matchedWords"
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp
        label-text="has_format"
      />
      <span
        class="inline ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help group relative inline-block"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="$t('tooltip.format')"
      >
        ⓘ        
      </span>
      
      <SearchHighlightListComp
        :items="exemplar?.has_record?.has_format?.map(form => form.type) || []"
        :hilite="highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"                  
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp
        label-text="item_element_type" 
      />
      <span
        class="ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help group relative"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="$t('tooltip.elementType')"
      >
        ⓘ
      </span>

      <SearchHighlightSingleComp
        :item="exemplar?.has_record?.element_type || null"
        :hitlite="highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="in_language_code" />
      <SearchHighlightListComp
        :items="exemplar?.has_record?.in_language?.flatMap((il) => `${$t(il?.code)} (${il?.usage?.map((usage) => $t(usage)).join(', ')})`) || []"
        :hilite="highlightResult?.manifestations?.items?.has_record?.in_language?.code?.matchedWords"
        class="mb-2"
      />
    </div>
    <!-- Duration -->
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="has_duration" />
      <p class="mb-2">
        {{
          exemplar?.has_record?.has_duration?.has_value
            ? exemplar.has_record.has_duration.has_value.replace('PT', '').toLowerCase()
            : '-'
        }}
      </p>
    </div>

    <!-- Extent -->
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="avefi:Extent" />
      <p class="mb-2">
        {{
          exemplar?.has_record?.has_extent
            ? `${exemplar.has_record.has_extent.has_value} ${$t(exemplar.has_record.has_extent.has_unit)}`
            : '-'
        }}
      </p>
    </div>

    <!-- Colour Type -->
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="has_colour_type" />
      <p class="mb-2">
        {{ exemplar?.has_record?.has_colour_type ? $t(exemplar.has_record.has_colour_type) : '-' }}
      </p>
    </div>

    <!-- Sound Type -->
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="has_sound_type" />
      <p class="mb-2">
        {{ exemplar?.has_record?.has_sound_type ? $t(exemplar.has_record.has_sound_type) : '-' }}
      </p>
    </div>

    <!-- Notes -->
    <div
      v-if="exemplar?.has_record?.has_note?.length"
      class="col-span-full"
    >
      <MicroLabelComp label-text="has_note" />
      <ul class="text-sm mb-2 list-disc list-inside">
        <li
          v-for="note in exemplar.has_record.has_note"
          :key="note"
        >
          {{ note }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
    items: {
        type: Array,
        required: true,
    },
    highlightResult: {
        type: Object,
        required: false,
        default: () => ({}),
    },
    productionDetailsChecked: {
        type: Boolean,
        required: false,
        default: false,
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>