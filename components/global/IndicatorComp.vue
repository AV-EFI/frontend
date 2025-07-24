<template>
  <div
    v-if="objectListStore.objects?.length > 0 || shoppingCart.objects?.length > 0"
    class="hidden avefi_indicator indicator-item indicator-bottom indicator-end rounded-l-xl bg-base-100 dark:bg-base-800 flex flex-row justify-between min-w-28 hover:transition-all h-16 z-30 focus:outline-none focus:ring focus:ring-violet-300"
    role="region"
    :aria-label="$t('gotocomp')"
  >
    <button
      class="btn btn-primary rounded-l-xl rounded-r-none md:w-10 h-full"
      :title="$t('showcomparison')"
      :aria-label="$t('showcomparison')"
      @click="$toggleComparisonDrawerState"
    >
      <span class="text-white text-center md:hidden">
        {{ $t('showcomparison') }}
      </span>
      <Icon
        name="formkit:caretleft"
        aria-hidden="true"
      />
    </button>

    <div
      class="join items-center justify-center w-full grow group transition-all ease-in-out delay-150"
      role="group"
      :aria-label="$t('comparisonAndCartCounts')"
    >
      <div
        class="badge bg-favourites-list hover:bg-favourites-list font-bold text-white text-center join-item"
        :title="$t('elementsincomparison')"
        :aria-label="`${$t('elementsincomparison')}: ${shoppingCart.objects?.length}`"
      >
        <span class="hidden text-xs transition-all ease-in-out delay-150">
          {{ $t('shoppingcart') }}
        </span>
        {{ shoppingCart.objects?.length }}
      </div>
      <div
        class="badge bg-compare-list font-bold text-white text-center join-item"
        :title="$t('elementsinshoppingcart')"
        :aria-label="`${$t('elementsinshoppingcart')}: ${objectListStore.objects?.length}`"
      >
        <span class="hidden text-xs">
          {{ $t('comparison') }}
        </span>
        {{ objectListStore.objects?.length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useObjectListStore } from '../../stores/compareList';
import { useShoppingCart } from '../../stores/shoppingCart';

const objectListStore = useObjectListStore();
const shoppingCart = useShoppingCart();
</script>

<style scoped>
.avefi_indicator {
  display: none;
}
@media screen and (min-width: 768px) {
  .avefi_indicator {
    position: fixed;
    display: inline-flex;
    right: 0;
    top: calc(66% - 51px);
  }
}
@media screen and (max-width: 767px) {
  .avefi_indicator {
    position: fixed;
    display: inline-flex;
    right: 0;
    bottom: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>