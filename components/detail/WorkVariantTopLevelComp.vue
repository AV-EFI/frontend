<template>
  <NuxtLayout name="partial-grid-1">
    <template #center>
      <!-- 03/04 GND, Filmportal, etc. (Same As) -->
      <div
        v-if="Array.isArray(workVar?.same_as) && workVar.same_as.length"
        class="col-span-full"
        role="region"
        :aria-label="`${$t('same_as')}`"
      >
        <div
          v-for="sas in workVar.same_as"
          :key="sas?.id"
          class="col-span-full"
          role="group"
          :aria-label="`${$t('same_as')} ${$t(sas?.category)}`"
        >
          <DetailKeyValueComp
            :keytxt="sas?.category"
            :valtxt="sas?.id"
            :same-as="true"
          />
        </div>
      </div>

      <!-- 05 Alternative Titel -->
      <DetailKeyValueListComp
        v-if="Array.isArray(workVar?.has_alternative_title) && workVar.has_alternative_title.length"
        class="col-span-full mb-2"
        keytxt="AlternativeTitle"
        :valtxt="workVar.has_alternative_title"
        :ul="true"
        role="region"
        :aria-label="$t('AlternativeTitle')"
      />

      <!-- (Optional) Episode/Teil-Indikator? -> is_part_of -->
      <div
        v-if="Array.isArray(workVar?.is_part_of) && workVar.is_part_of.length"
        class="col-span-full"
        role="region"
        :aria-label="$t('isPartOf')"
      >
        <MicroLabelComp
          class="col-span-full"
          label-text="isPartOf"
        />
        <ul>
          <li
            v-for="ipo in workVar.is_part_of"
            :key="ipo?.id"
          >
            <router-link
              target="_blank"
              rel="noopener"
              :to="`/film/${(ipo?.id || '')}`"
              class="link link-primary"
              :aria-label="`${ipo?.id} (${ $t(ipo?.category) })`"
            >
              {{ ipo?.id }}&nbsp;({{ $t(ipo?.category) }})
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { WorkVariant } from '~/models/interfaces/schema/avefi_schema.js';

const workVar = defineModel({ type: Object as PropType<WorkVariant>, required: true });

const props = defineProps({
    handle: { type: String, required: true },
    esTimestamp: { type: String, required: true }
});
</script>
