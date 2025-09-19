<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="">
    <NuxtLayout
      name="partial-grid-2-1"
      class="mt-2"
    >
      <template #heading>
        <h4
          class="font-bold uppercase text-sm col-span-full text-primary-800 dark:text-primary-200 pl-1"
        >
          {{ $t('items') }}
          <GlobalTooltipInfo
            :text="$t('tooltip.format')"
            class="ml-2"
          />
        </h4>
        <hr class="my-2">        
      </template>
    </NuxtLayout>
    <EasyDataTable
      table-class-name="customize_table w-[250px] mx-auto sm:w-auto"
      table-theme-color="var(--primary)"
      :headers="headers"
      :items="itemList"
      alternating
      buttons-pagination
      show-index
      :rows-per-page="10"
    >
      <template #header-_source.has_record.in_language.spoken="header">
        <div class="customize-header dark:text-primary-100 text-left">
          {{ $t(header.text) }}
        </div>
      </template>
      <template #header-_source.has_record.in_language.subtitles="header">
        <div class="customize-header dark:text-primary-100 text-left">
          {{ $t(header.text) }}
        </div>
      </template>
      <template #header-_source.has_record.has_webresource="header">
        <div class="customize-header dark:text-primary-100 text-left">
          {{ $t(header.text) }}
        </div>
      </template>
      <template #loading>
        <div class="dark:text-primary-100">
          loading items ...
        </div>
      </template>
      <template
        #item-_source.has_record.has_webresource="item"
      >
        <a
          v-if="item._source.has_record.has_webresource"
          :href="item._source.has_record.has_webresource"
          target="_blank"
          :title="$t('webresource')"
          :alt="$t('webresource')"
          class="link link-primary dark:link-accent"
        ><Icon
          name="formkit:linkexternal"
          class=""
        /><span class="hidden 2xl:inline">{{ $t('webresource') }}</span></a>
      </template>
      <template #item-_source.has_record.described_by.has_issuer_name="item">
        <div
          :id="item._id"
          class="flex flex-row"
        >
          <p>{{ item?._source?.has_record?.described_by?.has_issuer_name }}</p>
          <MicroBadgeCategoryComp
            category="avefi:Item"
            class="my-auto"
          />
        </div>
      </template>
      <template
        #item-actions="item"
      >
        <div class="w-full h-full flex flex-row">
          <a
            target="_blank"
            :href="`/film/${item._id}`"
            class="btn btn-primary btn-xs dark:btn-accent"
          >Details →</a>
        </div>
      </template>
      <template #item-_source.has_record.has_format="item">
        <div class="dark:text-primary-100">
          {{ item._source.has_record?.has_format?.map(function (has_format_item) {return $t(has_format_item.type); }).join(',') }}
        </div>
      </template>
      <template #item-_source.has_record.in_language.spoken="item">
        <div class="dark:text-primary-100">
          {{ item._source?.has_record?.in_language?.filter(function(in_lang) { return in_lang.usage == 'SpokenLanguage';}).map(function (in_lang) {return $t(in_lang.code); }).join(',') }}
        </div>
      </template>
      <template #item-_source.has_record.in_language.subtitles="item">
        <div class="dark:text-primary-100">
          {{ item._source?.has_record?.in_language?.filter(function(in_lang) { return in_lang.usage == 'Subtitles';}).map(function (in_lang) {return $t(in_lang.code); }).join(',') }}
        </div>
      </template>
      <template #empty-message>
        <span class="dark:text-primary-100">nothing here</span>
      </template>
      <template
        #expand="item"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 p-4 ml-4">          
          <div class="col-span-full md:col-span-3 row-start-1">
            <DetailKeyValueComp 
              :keytxt="$t('efi')"
              :valtxt="item?.handle"
              class="w-full"
              :clip="false"
            />
          </div>
          <div class="col-span-full md:col-span-1 row-start-1 flex flex-col items-end hidden">
            <MicroEfiCopyComp
              :id="item._id"
              :handle="item?.handle"
              category="item"
            />
          </div>

          <div
            v-if="item._source?.has_record?.in_language"
            class="flex flex-col"
          >
            <MicroLabelComp
              label-text="language"
            />
            <div class="flex flex-col">
              <ul>
                <li
                  v-for="in_lang in item._source?.has_record?.in_language"
                  :key="in_lang.code"
                  :value="in_lang"
                  class="flex flex-row"
                >
                  <span class="dark:text-primary-100">{{ $t(in_lang.code) }}</span>
                  &nbsp;
                  (<span class="dark:text-primary-100">{{ in_lang.usage.map(function (usage) {return $t(usage); }).join(',') }}</span>)
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="item._source?.has_record?.has_format"
            class="flex flex-col"
          >
            <LazyDetailKeyValueComp
              :keytxt="$t('has_format')"
              :valtxt="item?._source?.has_record?.has_format.flatMap(function (has_format_item) {return $t(has_format_item.type); }).join(',')"
              class="w-full"
              :clip="false"
              :title="$t('tooltip.format')"
            />
          </div>
          <div
            v-if="item._source?.has_record?.element_type"
            class="flex flex-col"
          >
            <LazyDetailKeyValueComp
              :keytxt="$t('item_element_type')"
              :valtxt="item._source?.has_record?.element_type"
              :title="$t('tooltip.elementType')"
              class="w-full"
              :clip="false"
            />
          </div>
          <div class="col-span-1 flex flex-col justify-center">
            <a
              v-if="item?._source.has_record?.has_webresource"
              :href="item?._source.has_record?.has_webresource"
              target="_blank"
              class="link link-primary dark:link-accent"
            >
              <Icon
                name="formkit:linkexternal"
              />&nbsp;{{ $t('webresource') }}</a>
          </div>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
<script lang="ts" setup>
import type { Header } from 'vue3-easy-data-table';

const itemList = defineModel({type: Array as PropType<Object>, required: true});
const headers: Header[] = [
    { text: "Institution", value: "_source.has_record.described_by.has_issuer_name", sortable:true },
    { text: "SpokenLanguage", value: "_source.has_record.in_language.spoken", sortable:true },
    { text: "Subtitles", value: "_source.has_record.in_language.subtitles", sortable:true },
    { text: "Format", value: "_source.has_record.has_format", sortable:true },
    { text: "webresource", value: "_source.has_record.has_webresource", sortable:false },
];
</script>