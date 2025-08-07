<template>
  <NuxtLayout name="partial-grid-1">
    <pre class="text-xs">{{ workVar }}</pre>

    <template #center>
      <DetailKeyValueListComp
        v-if="workVar?.has_record?.has_alternative_title"
        class="col-span-full mb-2"
        keytxt="AlternativeTitle"
        :valtxt="workVar.has_record?.has_alternative_title"
        :ul="true"
        role="region"
        :aria-label="$t('AlternativeTitle')"
      />
      <div
        v-if="workVar?.has_record?.is_part_of"
        class="col-span-full mb-2"
        role="region"
        :aria-label="$t('isPartOf')"
      >
        <MicroLabelComp
          class="col-span-full"
          :label-text="$t('isPartOf')"
        />
        <ul>
          <li
            v-for="ipo in workVar.has_record?.is_part_of"
            :key="ipo.id"
          >
            <router-link
              target="_blank"
              :to="`/film/${ipo.id.replace('21.11155/', '')}`"
              class="link link-primary"
              :aria-label="`${ipo?.id} (${ $t(ipo.category) })`"
            >
              {{ ipo?.id }}&nbsp;({{ $t(ipo.category) }})
            </router-link>
          </li>
        </ul>
      </div>

      <div
        v-for="sas in workVar.has_record?.same_as"
        :key="sas.id"
        class="col-span-full mb-2"
        role="group"
        :aria-label="`${$t('same_as')} ${$t(sas.category)}`"
      >
        <DetailKeyValueComp
          :keytxt="sas.category"
          :valtxt="sas.id"
          :same-as="true"
        />
      </div>


    </template>    
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { IAVefiWorkVariant } from '../../models/interfaces/generated/IAVefiWorkVariant';

const workVar = defineModel<IAVefiWorkVariant>({
    required: true
});

defineProps({
    "handle": {
        type: String,
        required: true
    }
});
</script>
