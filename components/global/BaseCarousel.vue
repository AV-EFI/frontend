<template>
  <div class="relative w-full">
    <!-- DESKTOP -->
    <div class="hidden lg:flex items-center relative bg-white/80 dark:bg-base-200/80 rounded-box p-4">
      <button
        v-if="items.length > 1"
        class="nav-btn left"
        @click="prev"
        :aria-label="t('togglePreviousSlide')"
      >
        <Icon name="tabler:chevron-left" />
      </button>

      <div class="relative w-full overflow-hidden" :style="{ minHeight: minHeightPx }">
        <TransitionGroup name="slide">
          <div
            v-for="(item, i) in items"
            v-show="i === index"
            :key="keyOf(item, i)"
            class="absolute inset-0 flex justify-center"
          >
            <component :is="cardComponent" :item="item" />
          </div>
        </TransitionGroup>
      </div>

      <button
        v-if="items.length > 1"
        class="nav-btn right"
        @click="next"
        :aria-label="t('toggleNextSlide')"
      >
        <Icon name="tabler:chevron-right" />
      </button>
    </div>

    <!-- MOBILE -->
    <div class="lg:hidden relative">
      <div
        ref="mobileRef"
        class="carousel carousel-center overflow-x-auto scroll-smooth p-4"
      >
        <div
          v-for="(item, i) in items"
          :key="keyOf(item, i)"
          class="carousel-item mx-2"
        >
          <component :is="cardComponent" :item="item" />
        </div>
      </div>

      <button class="mobile-btn left" @click="prevMobile">
        <Icon name="tabler:chevron-left" />
      </button>
      <button class="mobile-btn right" @click="nextMobile">
        <Icon name="tabler:chevron-right" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const { t } = useI18n();

const props = defineProps({
    items: { type: Array, required: true },
    cardComponent: { type: Object, required: true },
    minHeight: { type: Number, default: 320 },
    itemKey: { type: Function, default: null }
});

const index = ref(0);
const mobileRef = ref<HTMLElement | null>(null);

const minHeightPx = computed(() => `${props.minHeight}px`);

const keyOf = (item: any, i: number) =>
    props.itemKey ? props.itemKey(item, i) : item.id ?? i;

const prev = () => {
    index.value = (index.value - 1 + props.items.length) % props.items.length;
};

const next = () => {
    index.value = (index.value + 1) % props.items.length;
};

/* MOBILE SNAP-AWARE SCROLL */
const mobileItems = () =>
    mobileRef.value
        ? Array.from(mobileRef.value.querySelectorAll<HTMLElement>('.carousel-item'))
        : [];

const closestIndex = () => {
    const el = mobileRef.value;
    if (!el) return 0;
    let best = 0;
    let dist = Infinity;
    mobileItems().forEach((it, i) => {
        const d = Math.abs(it.offsetLeft - el.scrollLeft);
        if (d < dist) {
            dist = d;
            best = i;
        }
    });
    return best;
};

const scrollTo = (i: number) => {
    const items = mobileItems();
    if (!items.length || !mobileRef.value) return;
    const clamped = Math.max(0, Math.min(i, items.length - 1));
    mobileRef.value.scrollTo({
        left: items[clamped].offsetLeft,
        behavior: 'smooth'
    });
};

const prevMobile = () => scrollTo(closestIndex() - 1);
const nextMobile = () => scrollTo(closestIndex() + 1);
</script>

<style scoped>

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: var(--tw-bg-opacity, 1) var(--color-primary);
  color: white;
  border-radius: 9999px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
}
.nav-btn.left { left: -2.5rem; }
.nav-btn.right { right: -2.5rem; }

.mobile-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: var(--tw-bg-opacity, 1) var(--color-primary);
  color: white;
  border-radius: 9999px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
  /* Glass effect */
  backdrop-filter: blur(8px);
  background-color: rgba(59, 130, 246, 0.7); /* fallback for btn-glass */
}
.mobile-btn.left { left: 0.5rem; }
.mobile-btn.right { right: 0.5rem; }

/* IssuerCarousel animation preserved */
.slide-enter-active,
.slide-leave-active { transition: all .45s ease; }
.slide-enter-from { opacity: 0; transform: translateX(100%); }
.slide-leave-to { opacity: 0; transform: translateX(-100%); }
</style>
