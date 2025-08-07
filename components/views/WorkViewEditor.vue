<!-- eslint-disable -->
<!-- disable until backend done -->
<template>
  <div class="grid gap-1 row-span-full grid-rows-subgrid grid-cols-4 col-span-4 my-auto bg-base-200 border-base-300 p-1 border-2 rounded-xl">
    <div class="col-span-full">
      <h2 class="text-lg font-normal mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
        {{ title }}
      </h2>
    </div>
    <div class="col-span-full">
      <button
        class="btn btn-primary btn-sm"
        :alt="$t('updateallproperties')"
        :title="$t('updateallproperties')"
        @click="updateAllProperties"
      >
        {{ $t('updateallproperties') }}
        <Icon
          name="fa-solid:arrow-circle-right"
          class="text-white"
        />
      </button>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">efi:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li class="text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1 bg-white dark:bg-gray-700">
          <span class="col-span-6 my-auto">
            {{ data?.handle }}
          </span>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="data?.handle"
              target-property-name="efi"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100 bg-secondary-200 dark:bg-secondary-600">{{ $t('title') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li class="text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1 bg-gray-100 dark:bg-gray-800">
          <span class="col-span-6 my-auto">
            {{ data?.compound_record?._source?.has_record?.has_primary_title?.has_name }}
          </span>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="data?.compound_record?._source?.has_record?.has_primary_title?.has_name"
              target-property-name="title"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('AlternativeTitle') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(altTitle, index) in data?.compound_record?._source?.has_record?.has_alternative_title"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-6 my-auto">
            {{ altTitle.has_name }}
          </span>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="altTitle.has_name"
              target-property-name="alternative_title"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    

    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100 bg-secondary-200 dark:bg-secondary-600">{{ $t('location') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(country, index) in data?.compound_record?._source?.has_record?.has_event[0]?.located_in"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3">
            {{ country?.has_name }}
          </span>
          <div class="col-span-3">
            <ul>
              <li
                v-for="(sameAs, sameAsIndex) in country?.same_as"
                :key="sameAsIndex"
                class="list-disc"
              >
                {{ sameAs.id }} ({{ sameAs.category.replace('avefi:','') }})
              </li>
            </ul>
          </div>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="country?.has_name"
              target-property-name="location"
              :same-as-id="country?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ')"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100 bg-secondary-200 dark:bg-secondary-600">{{ $t('productionyear') }}:</label>
      <ul 
        v-if="data?.compound_record?._source?.has_record?.has_event?.find(ev => ev.category === 'avefi:ProductionEvent')?.has_date"
        class="grid grid-cols-7 subgrid gap-1 col-span-full"
      >
        <li
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-6">
            {{ data?.compound_record?._source?.has_record?.has_event?.find(ev => ev.category === 'avefi:ProductionEvent')?.has_date }}
          </span>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="data?.compound_record?._source?.has_record?.has_event.find(ev => ev.category === 'avefi:ProductionEvent')?.has_date"
              target-property-name="productionyear"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100 bg-secondary-200 dark:bg-secondary-600">{{ $t('Director') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(director, index) in data?.compound_record?._source?.has_record?.has_event?.find((ev) => ev.has_activity?.find(activity => activity.type === 'Director')?.has_agent)"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3">
            {{ director?.has_name }}
          </span>
          <div class="col-span-3">
            <ul>
              <li
                v-for="(sameAs, sameAsIndex) in director?.same_as"
                :key="sameAsIndex"
                class="list-disc"
              >
                {{ sameAs.id }} ({{ sameAs.category.replace('avefi:','') }})
              </li>
            </ul>
          </div>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="director.has_name"
              target-property-name="director"
              :same-as-id="director?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ')"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('production') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(producer, index) in data?.has_record?.has_event[0]?.has_activity?.find(activity => activity.type === 'Producer')?.has_agent"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3">
            {{ producer.has_name }}
          </span>
          <div class="col-span-3">
            <ul>
              <li
                v-for="(sameAs, sameAsIndex) in producer?.same_as"
                :key="sameAsIndex"
                class="list-disc"
              >
                {{ sameAs.id }} ({{ sameAs.category.replace('avefi:','') }})
              </li>
            </ul>
          </div>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="producer.has_name"
              target-property-name="producer"
              :same-as-id="producer?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ')"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('castmembers') }}</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(castMember, index) in data?.has_record?.has_event[0]?.has_activity?.find(activity => activity.type === 'CastMember')?.has_agent"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3">
            {{ castMember.has_name }}
          </span>
          <div
            class="col-span-3"
            style="word-break: break-word;"
          >
            <ul>
              <li
                v-for="(sameAs, sameAsIndex) in castMember?.same_as"
                :key="sameAsIndex"
                class="list-disc"
              >
                {{ sameAs.id }} ({{ sameAs.category.replace('avefi:','') }})
              </li>
            </ul>
          </div>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="castMember.has_name"
              target-property-name="castmember"
              :same-as-id="castMember?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ')"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold">{{ $t('Genre') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(genre, index) in data?.compound_record?._source?.has_record?.has_genre"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3">
            {{ genre.has_name }}
          </span>
          <div class="col-span-3">
            <ul>
              <li
                v-for="(sameAs, sameAsIndex) in genre?.same_as"
                :key="sameAsIndex"
                class="list-disc"
              >
                {{ sameAs.id }} ({{ sameAs.category.replace('avefi:','') }})
              </li>
            </ul>
          </div>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="genre.has_name"
              target-property-name="genre"
              :same-as-id="genre?.same_as?.flatMap((sameAs) => sameAs?.id).join(', ')"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('subject') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(subject, index) in data?.compound_record?._source?.has_record?.has_subject"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3">
            {{ subject.has_name }}
          </span>
          <div class="col-span-3">
            <ul>
              <li
                v-for="(sameAs, sameAsIndex) in subject?.same_as"
                :key="sameAsIndex"
                class="list-disc"
              >
                {{ sameAs.id }} ({{ sameAs.category.replace('avefi:','') }})
              </li>
            </ul>
          </div>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="subject.has_name"
              target-property-name="subject"
              :same-as-id="subject?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ')"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('other_ids') }}:</label>
      <ul class="grid grid-cols-7 subgrid gap-1 col-span-full">
        <li
          v-for="(otherId, index) in data?.compound_record?._source?.has_record?.same_as"
          :key="index"
          :class="['text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full col-span-full grid subgrid grid-cols-7 gap-1', index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700']"
        >
          <span class="col-span-3 break-all">
            {{ otherId.id }}
          </span>
          <span class="col-span-3">
            {{ otherId?.category?.replace('avefi:','') }}
          </span>
          <div class="col-span-1 flex flex-row justify-center my-auto">
            <GlobalSendValueComp
              :target-property-value="otherId.id"
              target-property-name="other_id"
              :same-as-id="`${otherId?.category?.replace('avefi:','')}`"
              @update-target-model="onUpdateTargetModel"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="col-span-full grid grid-cols-7 grid-rows-[20px_auto] text-sm gap-1 mt-2">
      <label class="col-span-full text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('lastedit') }}:</label>
      <span class="col-span-6 my-auto">
        {{ data?.compound_record?._source?.has_record?.described_by?.has_issuer_name }}
      </span>
    </div>
    <div class="col-span-full hidden">
      <GlobalRawDataCollapse
        :data="data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/* @TODO: refactor when backend done */
import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses';
defineProps({
    title: {
        type: String,
        required: true,
    },
});

const dataJson = defineModel
(
    { 
        type: Object,
        required: true
    }
);
const data = dataJson.value as ElasticGetByIdResponse;
console.log("WorkViewEditor data", data);

function onUpdateTargetModel(targetPropertyValue: string, targetPropertyName: string, sameAsId: string) {
    console.log("onUpdateTargetModel");
    console.log(targetPropertyValue);
    console.log(targetPropertyName);
    console.log(sameAsId);
    emit("updateTargetModelGP", targetPropertyValue, targetPropertyName, sameAsId);
}

function updateAllProperties() {
    const properties = [
        { value: data?.compound_record?._source?.has_record?.has_primary_title?.has_name, name: 'title' },
        { value: data?.handle, name: 'efi' },
        ...(data?.compound_record?._source?.has_record?.has_event[0]?.located_in || []).map((item) => ({ value: item?.has_name, name: 'location', sameAsId: item?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ') })),
        ...(data?.compound_record?._source?.has_record?.has_event[0]?.has_activity?.find(activity => activity?.type === 'Director')?.has_agent || []).map((item) => ({ value: item?.has_name, name: 'director', sameAsId: item?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ') })),
        ...(data?.compound_record?._source?.has_record?.has_event[0]?.has_activity?.find(activity => activity?.type === 'CastMember')?.has_agent || []).map((item) => ({ value: item?.has_name, name: 'castmember', sameAsId: item?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ') })),
        ...(data?.compound_record?._source?.has_record?.has_subject || []).map((item) => ({ value: item?.has_name, name: 'subject', sameAsId: item?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ') })),
        ...(data?.compound_record?._source?.has_record?.has_alternative_title || []).map((item) => ({ value: item?.has_name, name: 'alternative_title' })),
        ...(data?.compound_record?._source?.has_record?.has_genre || []).map((item) => ({ value: item?.has_name, name: 'genre', sameAsId: item?.same_as?.flatMap((sameAs) => sameAs.id).join(', ') })),
        ...(data?.compound_record?._source?.has_record?.has_event[0]?.has_activity?.find(activity => activity?.type === 'Producer')?.has_agent || []).map((item) => ({ value: item?.has_name, name: 'producer', sameAsId: item?.same_as?.flatMap((sameAs) => `${sameAs?.id} (${sameAs?.category.replace('avefi:','')})`).join(', ') })),
        { value: data?.compound_record?._source?.has_record?.has_event?.find(ev => ev.category === 'avefi:ProductionEvent')?.has_date, name: 'productionyear' },
        ...(data?.compound_record?._source?.has_record?.same_as || []).map((item) => ({ value: item.id, name: 'other_id', sameAsId: item.category.replace('avefi:','') })),
        { value: data?.compound_record?._source?.has_record?.described_by?.has_issuer_name, name: 'last_edit' },
    ];

    properties.forEach((property) => {
        emit('updateTargetModelGP', property.value, property.name, property.sameAsId);
    });
}

const emit = defineEmits<{
  (e: 'updateTargetModelGP', targetPropertyValue: string, targetPropertyName: string, sameAsId: string): void;
}>();
</script>
