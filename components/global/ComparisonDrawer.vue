<template>
  <div class="drawer w-0 md:w-[20em] drawer-end">
    <ClientOnly>
      <input
        id="comparison_drawer"
        type="checkbox"
        class="drawer-toggle"
        :checked="objectListStore.comparisonDrawerOpen"
      >
      <div class="drawer-side z-50">
        <label
          :aria-label="$t('close')"
          class="drawer-overlay z-99"
          @click="toggleDrawer"
        />
        <div class="menu p-4 w-[100vw] md:w-80 min-h-full bg-base-50 bg-neutral dark:border-left-white dark:border-l-2 border-neutral-400 text-base-content">
          <div class="w-100 flex flex-row justify-between p-2">
            <button 
              class="btn btn-outline btn-primary w-1/3"
              :title="$t('close')"
              @click="$toggleComparisonDrawerState"
            >
              <Icon name="formkit:caretright" />
            </button>
            <button
              :title="$t('gotocomp')"
              class="btn btn-secondary w-1/3"
              :class="objectListStore.objects.length !== 2 && 'btn-disabled'"
              @click="navigateToComparison"
            >
              <Icon name="material-symbols:compare" />
            </button>
          </div>
          <ul class="mt-2 p-2">
            <li
              v-for="(object, index) in objectListStore.objects"
              :key="index"
              class="text-lg mt-2 border-2 rounded-xl border-zinc-300 p-3"
            >
              {{ object.filmTitle }}
              <button
                :title="$t('remove')"
                class="btn btn-error btn-outline"
                @click="removeObject(index)"
              >
                {{ $t('remove').toUpperCase() }}
              </button>
            </li>
          </ul>
          <div class="mt-2 p-2">
            <button
              class="btn btn-error btn-block"
              :title="$t('clearalllist')"
              @click="removeAllObjects"
            >
              {{ $t('clearalllist') }}
            </button>
          </div>
          <div class="hidden">
            {{ objectListStore.getObjectIds }}
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import {useObjectListStore} from '../../stores/compareList';
const {$toggleComparisonDrawerState}:any = useNuxtApp();

const objectListStore = useObjectListStore();
const toggleDrawer = (() => {
    objectListStore.comparisonDrawerOpen = !objectListStore.comparisonDrawerOpen;
});

const removeObject = (index) => {
    objectListStore.removeObject(index);
};

const removeAllObjects = () => {
    console.log("removeAll");
    objectListStore.removeAllObjects();
    console.log('Objects after removal:', objectListStore.objects);
};

const navigateToComparison = () => {
    const objectIds: string[] = objectListStore.getObjectIds;
    if(objectIds.length == 2) {
        navigateTo(`/protected/compare_altern?prev=${objectIds[0]}&next=${objectIds[1]}`);
    }
};
</script>
