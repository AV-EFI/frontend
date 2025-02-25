<template>
  <span v-if="sameAsData">
    <span
      v-for="(same_as_item, same_as_index) in sameAsData"
      :key="same_as_index"
      :class="fontSize"
    >
      <a
        v-if="same_as_item.category === 'avefi:GNDResource'"
        class="link link-primary link-hover dark:link-accent inline-flex flex-row items-center"
        :href="`https://explore.gnd.network/gnd/${same_as_item.id}`"
        alt="Referenz bei GND"
        title="Referenz bei GND"
        target="_blank"
      >
      &nbsp;
        <img
          src="https://explore.gnd.network/images/icons/favicon.ico"
          alt="GND"
          class="my-auto w-4 h-4 inline"
        >
        <span class="slide-in">&nbsp;{{ $t(same_as_item.category) }}</span>
      </a>
      <a
        v-else-if="same_as_item.category === 'avefi:VIAFResource'"
        class="link link-primary link-hover dark:link-accent flex items-center"
        :href="`https://viaf.org/viaf/${same_as_item.id}`"
        alt="Referenz bei VIAF"
        title="Referenz bei VIAF"
        target="_blank"
      >
        <Icon
          name="carbon:notebook-reference"
          size="1em"
          class="align-text-middle"
          alt="Referenz bei VIAF"
        />
        <span class="slide-in">{{ $t(same_as_item.category) }}</span>
      </a>
      <a
        v-else-if="same_as_item.category === 'avefi:WikidataResource'"
        class="link link-primary link-hover dark:link-accent flex items-center"
        :href="`https://www.wikidata.org/wiki/${same_as_item.id}`"
        alt="Referenz bei Wikidata"
        title="Referenz bei Wikidata"
        target="_blank"
      >
        <Icon
          name="carbon:notebook-reference"
          size="1em"
          class="align-text-middle"
          alt="Referenz bei Wikidata"
        />
        <span class="slide-in">{{ $t(same_as_item.category) }}</span>
      </a>
      <a
        v-else-if="same_as_item.category === 'avefi:FilmportalResource'"
        :href="`https://www.filmportal.de/film/${same_as_item.id}`"
        class="link link-primary link-hover dark:link-accent flex flex-row items-center"
        alt="Referenz bei Filmportal"
        title="Referenz bei Filmportal"
        target="_blank"
      >
        <img
          src="https://www.filmportal.de/themes/custom/filmportal/favicon.ico"
          class="align-text-middle grayscale w-4 h-4 inline"
          alt="Referenz bei Filmportal"
        >
        <span class="slide-in">&nbsp;{{ $t(same_as_item.category) }}</span>
      </a>
      <a
        v-else-if="same_as_item.category === 'avefi:DOIResource'"
        :href="`https://doi.org/${same_as_item.id}`"
        class="link link-primary link-hover dark:link-accent flex items-center"
        alt="Referenz bei DOI"
        title="Referenz bei DOI"
        target="_blank"
      >
        <Icon
          name="carbon:notebook-reference"
          size="1em"
          class="align-text-middle"
          alt="Referenz bei DOI"
        />
        <span class="slide-in">&nbsp;{{ $t(same_as_item.category) }}</span>
      </a>
      <a
        v-else-if="same_as_item.category === 'avefi:EIDRResource'"
        :href="`https://ui.eidr.org/view/content?id=${same_as_item.id}`"
        class="link link-primary link-hover dark:link-accent flex items-center"
        alt="Referenz bei EIDR"
        title="Referenz bei EIDR"
        target="_blank"
      >
        <Icon
          name="carbon:notebook-reference"
          size="1em"
          class="align-text-middle"
          alt="Referenz bei EIDR"
        />
        <span class="slide-in">{{ $t(same_as_item.category) }}</span>
      </a>
      <span v-else>
        Unbekannte Referenz: {{ $t(same_as_item.category) }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { _fontSize } from '#tailwind-config/theme';
import type {} from '../../models/interfaces/av_efi_schema.ts';

defineProps({
    sameAsData: {
        type: Object,
        default: null,
    },
    fontSize: {
        type: String,
        default: _fontSize,
    },
});
</script>

<style scoped>
.slide-in {
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

a:hover .slide-in {
  opacity: 1;
  transform: translateX(0);
}
</style>
