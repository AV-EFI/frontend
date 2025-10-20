<template>
  <div v-if="sameAsData?.length" class="inline-block">
    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="btn btn-circle btn-outline btn-xs m-1"
      aria-haspopup="true"
      :aria-expanded="String(open)"
      aria-controls="sameas-dropdown-menu"
      @click.stop="toggle()"
      @keydown="onTriggerKeydown"
    >
      <Icon :class="['text-' + fontSize]" name="mdi:dots-horizontal" />
      <span class="sr-only">Open external references</span>
    </button>

    <!-- Menu (fixed, viewport-positioned) -->
    <ul
      v-show="open"
      id="sameas-dropdown-menu"
      ref="menuRef"
      role="menu"
      tabindex="-1"
      class="menu menu-sm bg-base-100 rounded-box shadow fixed z-[1000] w-56 p-2"
      :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
      @keydown="onMenuKeydown"
    >
      <li v-for="(item, idx) in sameAsData" :key="idx" role="none">
        <a
          v-if="item.category === 'avefi:GNDResource'"
          role="menuitem"
          tabindex="0"
          :href="`https://explore.gnd.network/gnd/${item.id}`"
          target="_blank" rel="noopener"
          class="link link-primary link-hover dark:link-accent"
          @click="close()"
        >
          <img src="https://explore.gnd.network/images/icons/favicon.ico" alt="GND" class="w-4 h-4 inline" />
          <span>&nbsp;{{ $t(item.category) }}</span>
        </a>

        <a
          v-else-if="item.category === 'avefi:VIAFResource'"
          role="menuitem"
          tabindex="0"
          :href="`https://viaf.org/viaf/${item.id}`"
          target="_blank" rel="noopener"
          class="link link-primary link-hover dark:link-accent"
          @click="close()"
        >
          <Icon name="tabler:notebook" size="1em" />
          <span>&nbsp;{{ $t(item.category) }}</span>
        </a>

        <a
          v-else-if="item.category === 'avefi:WikidataResource'"
          role="menuitem"
          tabindex="0"
          :href="`https://www.wikidata.org/wiki/${item.id}`"
          target="_blank" rel="noopener"
          class="link link-primary link-hover dark:link-accent"
          @click="close()"
        >
          <Icon name="carbon:notebook-reference" size="1em" />
          <span>&nbsp;{{ $t(item.category) }}</span>
        </a>

        <a
          v-else-if="item.category === 'avefi:FilmportalResource'"
          role="menuitem"
          tabindex="0"
          :href="`https://www.filmportal.de/${item.id}`"
          target="_blank" rel="noopener"
          class="link link-primary link-hover dark:link-accent"
          @click="close()"
        >
          <img src="https://www.filmportal.de/themes/custom/filmportal/favicon.ico" alt="Filmportal" class="w-4 h-4 inline" />
          <span>&nbsp;{{ $t(item.category) }}</span>
        </a>

        <a
          v-else-if="item.category === 'avefi:DOIResource'"
          role="menuitem"
          tabindex="0"
          :href="`https://doi.org/${item.id}`"
          target="_blank" rel="noopener"
          class="link link-primary link-hover dark:link-accent"
          @click="close()"
        >
          <Icon name="carbon:notebook-reference" size="1em" />
          <span>&nbsp;{{ $t(item.category) }}</span>
        </a>

        <a
          v-else-if="item.category === 'avefi:EIDRResource'"
          role="menuitem"
          tabindex="0"
          :href="`https://ui.eidr.org/view/content?id=${item.id}`"
          target="_blank" rel="noopener"
          class="link link-primary link-hover dark:link-accent"
          @click="close()"
        >
          <Icon name="carbon:notebook-reference" size="1em" />
          <span>&nbsp;{{ $t(item.category) }}</span>
        </a>

        <span v-else role="menuitem" tabindex="0" class="opacity-70">
          Unbekannte Referenz: {{ $t(item.category) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  sameAsData: { type: Array as () => Array<any>, default: () => [] },
  fontSize: { type: String, default: 'base' },
  type: { type: String, default: 'film' },
});

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const pos = ref({ top: 0, left: 0 });

function computePosition() {
  const btn = triggerRef.value;
  const menu = menuRef.value;
  if (!btn || !menu) return;

  const r = btn.getBoundingClientRect();

  // Make sure we can measure the menu
  const prevDisplay = menu.style.display;
  if (getComputedStyle(menu).display === 'none') menu.style.display = 'block';

  const menuW = menu.offsetWidth || 224; // ~w-56 fallback
  const menuH = menu.offsetHeight || 0;
  const pad = 8;      // viewport padding
  const gapY = 6;     // vertical gap below/above button
  const gapX = 6;     // horizontal gap to the side

  // Default: place to the RIGHT of the button
  let top = r.bottom + gapY;
  let left = r.right + gapX;

  // If it overflows to the right, flip to LEFT of the button
  if (left + menuW > window.innerWidth - pad) {
    left = r.left - gapX - menuW;
  }

  // Clamp horizontally inside viewport
  left = Math.max(pad, Math.min(left, window.innerWidth - menuW - pad));

  // If it overflows bottom, flip ABOVE the button (still side-positioned)
  if (top + menuH > window.innerHeight - pad && r.top - gapY - menuH >= pad) {
    top = r.top - gapY - menuH;
  }

  pos.value = { top, left };

  // Restore prior display state
  menu.style.display = prevDisplay;
}


async function toggle() {
  open.value = !open.value;
  if (open.value) {
    await nextTick();
    computePosition();
    // focus first item
    const first = menuRef.value?.querySelector('[role="menuitem"]') as HTMLElement | null;
    first?.focus();
  }
}

function close() {
  if (!open.value) return;
  open.value = false;
  nextTick(() => triggerRef.value?.focus());
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggle();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

function onMenuKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

function onDocumentClick(e: MouseEvent) {
  const t = e.target as Node;
  if (!triggerRef.value?.contains(t) && !menuRef.value?.contains(t)) {
    close();
  }
}

function onResizeOrScroll() {
  if (open.value) computePosition();
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, { capture: true });
  window.addEventListener('resize', onResizeOrScroll, { passive: true });
  window.addEventListener('scroll', onResizeOrScroll, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick, { capture: true } as any);
  window.removeEventListener('resize', onResizeOrScroll as any);
  window.removeEventListener('scroll', onResizeOrScroll as any);
});
</script>
