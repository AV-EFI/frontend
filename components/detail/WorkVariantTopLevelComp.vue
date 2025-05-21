<template>
  <NuxtLayout name="partial-grid-1">
    <template #center>
      <div
        v-if="workVar.is_part_of"
        class="col-span-full"
        role="region"
        :aria-label="$t('isPartOf')"
      >
        <MicroLabelComp
          class="col-span-full"
          :label-text="$t('isPartOf')"
        />
        <ul>
          <li
            v-for="ipo in workVar.is_part_of"
            :key="ipo.id"
          >
            <router-link
              target="_blank"
              :to="`/film/${ipo.id.replace('21.11155/', '')}`"
              class="link lin-primary"
              :aria-label="`${ipo?.id} (${ $t(ipo.category) })`"
            >
              {{ ipo?.id }}&nbsp;({{ $t(ipo.category) }})
            </router-link>
          </li>
        </ul>
      </div>

      <div
        v-for="sas in workVar.same_as"
        :key="sas.id"
        class="col-span-full"
        role="group"
        :aria-label="`${$t('same_as')} ${$t(sas.category)}`"
      >
        <DetailKeyValueComp
          :keytxt="sas.category"
          :valtxt="sas.id"
          :same-as="true"
        />
      </div>

      <DetailKeyValueListComp
        v-if="workVar.has_alternative_title"
        class="col-span-full mb-2"
        keytxt="AlternativeTitle"
        :valtxt="workVar.has_alternative_title"
        :ul="true"
        role="region"
        :aria-label="$t('AlternativeTitle')"
      />
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { WorkVariant } from '../../models/interfaces/av_efi_schema';
const workVar = defineModel({type: Array as PropType<WorkVariant>, required: true});
const props = defineProps({
    "handle": {
        type: String,
        required: true
    },
    "esTimestamp": {
        type: String,
        required: true
    }
});
</script>
