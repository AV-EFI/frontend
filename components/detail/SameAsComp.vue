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
      aria-haspopup="true"
      :aria-expanded="toggle.toString()"
      :aria-controls="'dropdown-menu'"
      class="btn m-1 btn-circle btn-outline btn-xs"
      @click="toggle = !toggle"
      @keydown="handleTriggerKeydown"
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
        id="dropdown-menu"
        ref="menuRef"
        role="menu"
        class="menu bg-base-100 rounded-box z-[9999] w-52 p-2 shadow absolute"
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      >
        <li
          v-for="(same_as_item, index) in sameAsData"
          :key="index"
          role="none"
        >
          <a
            v-if="same_as_item.category === 'avefi:GNDResource'"
            role="menuitem"
            tabindex="0"
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
            role="menuitem"
            tabindex="0"
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
            role="menuitem"
            tabindex="0"
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
            role="menuitem"
            tabindex="0"
            :href="`https://www.filmportal.de/${same_as_item.id}`"
            target="_blank"
            class="link link-primary link-hover dark:link-accent"
          >
            <img
              src="https://www.filmportal.de/themes/custom/filmportal/favicon.ico"
              alt="Filmportal"
              class="w-4 h-4 inline"
            >
            <span>&nbsp;{{ $t(same_as_item.category) }}</span>
          </a>

          <a
            v-else-if="same_as_item.category === 'avefi:DOIResource'"
            role="menuitem"
            tabindex="0"
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
            role="menuitem"
            tabindex="0"
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

          <span
            v-else
            role="menuitem"
            tabindex="0"
          >
            Unbekannte Referenz: {{ $t(same_as_item.category) }}
          </span>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps({
    sameAsData: { type: Object, default: null },
    fontSize: { type: String, default: 'base' },
    type: { type: String, default: 'film' },
});

const toggle = ref(false);
const position = ref({ top: 0, left: 0 });
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const calculatePosition = () => {
    const rect = triggerRef.value?.getBoundingClientRect();
    if (rect) {
        position.value = {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        };
    }
};

const focusFirstItem = () => {
    nextTick(() => {
        const first = menuRef.value?.querySelector('[role="menuitem"]') as HTMLElement;
        first?.focus();
    });
};

watch(toggle, (newVal) => {
    if (newVal) {
        calculatePosition();
        focusFirstItem();
    }
});

const handleOutsideClick = (e: MouseEvent) => {
    if (!triggerRef.value?.contains(e.target as Node) &&
      !menuRef.value?.contains(e.target as Node)) {
        toggle.value = false;
    }
};

const handleTriggerKeydown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.value = true;
        focusFirstItem();
    } else if (e.key === 'Escape') {
        toggle.value = false;
    }
};

const handleMenuKeydown = (e: KeyboardEvent) => {
    const items = Array.from(menuRef.value?.querySelectorAll('[role="menuitem"]') || []) as HTMLElement[];
    const index = items.findIndex((el) => el === document.activeElement);

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(index + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        toggle.value = false;
        triggerRef.value?.focus();
    } else if (e.key === 'Tab') {
        toggle.value = false;
    }
};

onMounted(() => {
    window.addEventListener('scroll', calculatePosition, true);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleMenuKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', calculatePosition, true);
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleMenuKeydown);
});
</script>
