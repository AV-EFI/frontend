<template>
  <div
    v-if="objectListStore.objects?.length > 0 || shoppingCart.objects?.length > 0"
    :alt="$t('gotocomp')"
    :title="$t('gotocomp')"
    class="avefi_indicator indicator-item indicator-middle rounded-l-xl bg-neutral-200 flex flex-row justify-between min-w-28 hover:transition-all h-16 z-30
    focus:outline-none focus:ring focus:ring-violet-300"
  >
    <button
      class="btn btn-primary rounded-l-xl rounded-r-none md:w-10 h-full"
      :title="$t('showcomparison')"
      :alt="$t('showcomparison')"
      @click="$toggleComparisonDrawerState"
    >
      <span class="text-white text-center md:hidden">
        {{ $t('showcomparison') }}
      </span>
      <Icon name="formkit:caretleft" />
    </button>
    <div class="join items-center justify-center w-full grow group transition-all transition ease-in-out delay-150 ">
      <div
        class="badge bg-shopping-cart hover:bg-shopping-cart font-bold text-white text-center join-item"
        alt="Elemente in Merkliste"
        title="Elemente in Merkliste"
      >
        <span class="hidden text-xs transition-all transition ease-in-out delay-150">Merkliste:</span>
        {{ shoppingCart.objects?.length }}
      </div>
      <div
        class="badge bg-compare-list font-bold text-white text-center join-item"
        alt="Elemente in Vergleichsliste"
        title="Elemente in Vergleichsliste"
      >
        <span class="hidden text-xs">Vergleichsliste:</span>
        {{ objectListStore.objects?.length }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useObjectListStore} from '../../stores/compareList';
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
    top: calc(50% - 51px);
}
}
</style>