<template>
  <div
    v-if="sameAsData"
    class="dropdown dropdown-right dropdown-end relative inline-block"
  >
    <!-- Trigger button -->
    <div
      ref="triggerRef"
      tabindex="0"
      role="button"
      class="btn m-1 btn-circle btn-outline btn-xs"
      @click="toggle = !toggle"
    >
      <Icon
        :class="['text-' + fontSize]"
        name="mdi:dots-horizontal"
      />
    </div>

    <!-- Dropdown menu rendered outside scrollable container -->
    <Teleport to="body">
      <ul
        v-if="toggle"
        class="menu bg-base-100 rounded-box z-[9999] w-52 p-2 shadow absolute"
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      >
        <li
          v-for="(same_as_item, same_as_index) in sameAsData"
          :key="same_as_index"
        >
          <a
            v-if="same_as_item.category === 'avefi:GNDResource'"
            :href="`https://explore.gnd.network/gnd/${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <img
              src="https://explore.gnd.network/images/icons/favicon.ico"
              alt="GND"
              class="w-4 h-4 inline"
            >
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <a
            v-else-if="same_as_item.category === 'avefi:VIAFResource'"
            :href="`https://viaf.org/viaf/${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <Icon
              name="carbon:notebook-reference"
              size="1em"
            />
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <a
            v-else-if="same_as_item.category === 'avefi:WikidataResource'"
            :href="`https://www.wikidata.org/wiki/${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <Icon
              name="carbon:notebook-reference"
              size="1em"
            />
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <a
            v-else-if="same_as_item.category === 'avefi:FilmportalResource'"
            :href="`https://www.filmportal.de/${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <img
              src="https://www.filmportal.de/themes/custom/filmportal/favicon.ico"
              class="w-4 h-4 inline"
              alt="Filmportal"
            >
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <a
            v-else-if="same_as_item.category === 'avefi:DOIResource'"
            :href="`https://doi.org/${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <Icon
              name="carbon:notebook-reference"
              size="1em"
            />
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <a
            v-else-if="same_as_item.category === 'avefi:EIDRResource'"
            :href="`https://ui.eidr.org/view/content?id=${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <Icon
              name="carbon:notebook-reference"
              size="1em"
            />
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <span v-else>
            Unbekannte Referenz: {{ $t(same_as_item.category) }}
          </span>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    sameAsData: {
        type: Object,
        default: null,
    },
    fontSize: {
        type: String,
        default: 'base',
    },
    type: {
        type: String,
        default: 'film',
    },
});

const toggle = ref(false);
const position = ref({ top: 0, left: 0 });
const triggerRef = ref<HTMLElement | null>(null);

const calculatePosition = () => {
    const rect = triggerRef.value?.getBoundingClientRect();
    if (rect) {
        position.value = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        };
    }
};

watch(toggle, (newVal) => {
    if (newVal) {
        calculatePosition();
    }
});

onMounted(() => {
    window.addEventListener('scroll', calculatePosition, true);
    document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', calculatePosition, true);
    document.removeEventListener('click', handleOutsideClick);
});

const handleOutsideClick = (e: MouseEvent) => {
    if (
        triggerRef.value &&
    !triggerRef.value.contains(e.target as Node)
    ) {
        toggle.value = false;
    }
};
</script>
