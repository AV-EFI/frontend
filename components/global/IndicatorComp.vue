<template>
  <div
    v-if="objectListStore.objects?.length > 0"
    :alt="$t('gotocomp')"
    :title="$t('gotocomp')"
    class="
    avefi_indicator
    indicator-item
    indicator-middle
    rounded-l-xl
    badge-secondary
    flex
    flex-col
    justify-center
    w-18
    h-24
    z-30"
  >
    <p class="text-white text-center">
      {{ objectListStore.objects?.length }}
    </p>
    <button
      class="btn btn-primary md:btn-xs md:w-12"
      :title="$t('showcomparison')"
      :alt="$t('showcomparison')"
      @click="$toggleComparisonDrawerState"
    >
      <span class="text-white text-center md:hidden">
        {{ $t('showcomparison') }}
      </span>
      <Icon name="formkit:caretleft" />
    </button>
  </div>
</template>
<script setup lang="ts">
import {useObjectListStore} from '../../stores/compareList';

const objectListStore = useObjectListStore();
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
    width:auto;
}
}
</style>