<template>
  <div class="p-4">
    <ul class="space-y-4">
      <li
        v-for="work in workList"
        :key="work"
        class="bg-base-100 shadow-md rounded-lg p-4"
      >
        <h2
          class="font-bold text-lg my-1 text-primary-900 dark:text-white"
          :alt="$t('title')"
          :title="$t('title')"
        >
          <a
            :href="`/film/${work?._id}#${itemId}`"
            :title="$t('detailviewlink')"
            target="_blank"
            class="link dark:link-white no-underline hover:underline"
          >
            <span>
              {{ work?._source?.has_record?.has_primary_title?.has_name }}
            </span>
          </a>
        </h2>        
        <div class="flex flex-col md:flex-row text-sm text-primary-700 dark:text-gray-200 mt-2">
          <span
            v-if="work?._source?.has_record?.has_event?.map((loc) => loc)"
            class="flex items-center"
          >
            <Icon
              name="mdi:map-marker-outline"
              class="mr-1"
              :alt="$t('country')"
              :title="$t('country')"
            />
            {{ work?._source?.has_record?.has_event?.flatMap(ev => ev.located_in?.map(location => location.has_name) || null).join(', ') }}
          </span>
          <span
            v-if="work?._source?.years"
            class="flex items-center"
          >
            <template v-if="work?._source?.has_record?.has_event"><span class="flex items-center">&nbsp;&nbsp;</span></template>
            <Icon
              name="fa:calendar"
              class="mr-1"
            />
            {{ work?._source?.years.join(', ') }}
          </span>
          <span
            v-if="work?._source?.has_record?.has_form"
            class="flex items-center"
          >
            <template v-if="work?._source?.has_record?.has_event || item.years">
              <span class="flex items-center">&nbsp;&nbsp;</span>
            </template>
            <Icon
              name="fa:film"
              class="mr-1"
            />
            {{ work?._source?.has_record?.has_form?.flatMap((f) => $t(f)).join(', ') }}
          </span>
          <span
            v-if="work?._source?.has_record?.is_part_of"
            class="flex items-center"
          >
            <template v-if="work?._source?.has_record?.has_event || work?._source?.years || work?._source?.has_record?.has_form">
              <span class="flex items">
                &nbsp;&nbsp;
              </span>
              <Icon
                name="carbon:logical-partition"
                class="mr-1"
              />
              {{ $t('Episode/Part') }}
            </template>
          </span>
        </div>
        <div class="text-sm text-gray-500 w-full mt-2">
          <MicroLabelComp label-text="AlternativeTitle" />
          <ul>
            <li
              v-for="alt in work?._source.has_record?.has_alternative_title"
              :key="alt.id"
            >
              {{ alt.has_name }}
            </li>
          </ul>
        </div>
        <div class="w-full flex flex-col mt-2">
          <h3
            class="font-bold text-sm mb-2 pl-1 uppercase text-primary-800 dark:text-gray-200"
            :title="$t('tooltip.manifestation')"
          >
            {{ $t('manifestations') }}
          </h3>
          <div
            v-for="manifestation in work?._source?.manifestations"
            :key="manifestation.id"
            class="collapse collapse-plus"
          >
            <input
              type="checkbox"
              class="manifestation-checkbox"
            >
            <div class="collapse-title bg-gray-100 dark:bg-slate-700 dark:text-white font-medium">
              <LazyDetailManifestationHeaderComp
                :manifestation="manifestation"
                type="searchresult"
                :is-twin="manifestation.isTwin"
                :all-items-empty="manifestation.allItemsEmpty"
              />
            </div>        
            <div class="collapse-content bg-slate-50 dark:bg-gray-800 dark:text-white">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-1 grid-rows-[minmax(0,1fr)]">
                <!--top-->
                <div class="col-span-full md:col-span-12 grid-cols-12 gap-2">
                  <div class="col-span-full md:col-span-12">
                    <MicroDividerComp
                      class="mx-auto my-[10px]"
                      label-text="avefi:Manifestation" 
                      in-class="manifestation"
                    />
                  </div>
                </div>
                <div class="col-span-1 md:flex-row">
                  <MicroLabelComp label-text="in_language_code" />
                  <SearchHighlightListComp
                    :items="manifestation?.has_record?.in_language?.map(lang => lang.code) || []"
                    class="mb-2"
                  />
                </div>
                <div class="col-span-1 md:flex-row">
                  <MicroLabelComp label-text="has_colour" />
                  <SearchHighlightSingleComp 
                    :item="manifestation?.has_record?.has_colour_type || null"
                    class="mb-2"
                  />
                </div>
              </div>
              <hr class="mt-4 mb-2 dark:border-gray-500">
              <h4
                class="font-bold text-sm text-primary-800 dark:text-primary-200 pl-1 mt-4"
              >
                {{ $t('items') }}
                <span
                  class="absolute ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help group"
                  role="img"
                  aria-label="Info"
                  tabindex="0"
                  :title="$t('tooltip.item')"
                >
                  ⓘ
                </span>
              </h4>
              <div
                v-for="exemplar in manifestation.items"
                :key="exemplar.id"
                class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 mb-2 grid-rows-[minmax(0,1fr)]"
              >
                <div class="col-span-full">
                  <MicroDividerComp
                    class="mx-auto lg:my-[10px]"
                    label-text="avefi:Item" 
                    in-class="item"
                  />
                </div>
                <div class="col-span-full md:col-full">
                  <DetailKeyValueComp
                    keytxt="EFI"
                    :valtxt="exemplar?.handle"
                    :clip="true"                  
                    class="mb-2"
                  />
                </div>
                <div class="col-span-full md:col-span-1">
                  <MicroLabelComp
                    label-text="has_format"
                    :title="$t('tooltip.format')"
                  />
                  <SearchHighlightListComp
                    :items="exemplar?.has_record?.has_format?.map(form => form.type) || []"
                    class="mb-2"
                  />
                </div>
                <div class="col-span-full md:col-span-1">
                  <MicroLabelComp label-text="item_element_type" />
                  <SearchHighlightSingleComp
                    :item="exemplar?.has_record.element_type"
                    class="mb-2"
                  />
                </div>
                <div class="col-span-full md:col-span-1">
                  <MicroLabelComp label-text="in_language_code" />
                  <SearchHighlightSingleComp
                    :item="exemplar?.has_record?.in_language?.code"
                    class="mb-2"
                  />
                </div>
                <div
                  v-if="exemplar?.has_record?.has_webresource"
                  class="col-span-full md:col-span-1 flex flex-col justify-end"
                >
                  <a
                    v-if="exemplar?.has_record?.has_webresource"
                    :href="exemplar?.has_record?.has_webresource"
                    target="_blank"
                    class="link link-primary dark:link-accent mt-auto md:mb-2"
                  >
                    <Icon name="formkit:linkexternal" />&nbsp;{{ $t('webresource') }}
                  </a>
                </div>
                <div class="max-md:flex max-md:justify-end col-span-full md:col-span-1 hidden">
                  <MicroEfiCopyComp 
                    category="work"
                    :handle="exemplar?.handle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    workIds: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
});
const workIds = ref(props.workIds.split(','));
const workList = ref([]);

await getDataSet(workIds.value).then((data) => {
    console.log('Data:', data);
    workList.value = data;
});
</script>