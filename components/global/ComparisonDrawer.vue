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
          class="hidden md: visible drawer-overlay z-40"
          @click="toggleDrawer"
        />
        <div class="menu p-4 w-[100vw] md:w-96 min-h-full bg-base-50 bg-neutral z-40 dark:bg-primary-800 dark:border-left-white dark:border-l-2 border-neutral-400 text-base-content dark:text-white">
          <div class="w-full flex flex-row justify-between p-2 mb-2">
            <button 
              class="btn btn-outline btn-sm btn-primary w-1/4"
              :title="$t('close')"
              @click="$toggleComparisonDrawerState"
            >
              <Icon name="formkit:caretright" />
            </button>
          </div>
          <div
            role="tablist"
            class="tabs tabs-bordered justify-stretch w-full"
          >
            <input
              type="radio"
              name="drawer_tabs"
              role="tab"
              checked="checked"
              :class="['tab !w-full', shoppingCart.objects.length === 0 && 'tab-disabled disabled']"
              :aria-label="$t('shoppingcart')"
            >
            <div
              role="tabpanel"
              class="tab-content"
            >
              <div class="join w-full mt-2">
                <button 
                  class="btn btn-error text-white join-item w-1/2"
                  :class="shoppingCart.objects.length < 1 && 'btn-disabled'"
                  :title="$t('clearalllist')"
                  @click="removeAllObjects('shoppingCart')"
                >
                  {{ $t('clearalllist') }}
                </button>
                <GlobalExportDataComp
                  :data-set-id="shoppingCart.getObjectIds"
                  :class="shoppingCart.objects.length < 1 && 'btn-disabled'"
                  class="join-item w-1/2"
                  :btn-size="''"
                />
              </div>
              <ul class="mt-2 w-full">
                <li
                  v-for="(shoppingCartItem, index) in shoppingCart.objects"
                  :key="index"
                  class="mt-2"
                >
                  <div class="flex justify-between w-full">
                    <a
                      class="link w-3/4"
                      :href="`/film/${ shoppingCartItem.filmId }`"
                      target="_blank"
                    >
                      {{ shoppingCartItem.filmTitle }}
                    </a>
                    <div class="w-1/4 flex flex-row">
                      <GlobalExportDataComp
                        :data-set-id="[shoppingCartItem.filmId]"
                        class="btn btn-circle btn-sm"
                      />
                      <button
                        :title="$t('remove')"
                        class="btn btn-error btn-circle btn-sm text-white ml-1"
                        @click="removeObject(index, 'shoppingCart')"
                      >
                        <Icon name="material-symbols:delete" />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <input
              type="radio"
              name="drawer_tabs"
              role="tab"
              :class="['tab !w-full', objectListStore.objects.length === 0 && 'tab-disabled disabled']" 
              :aria-label="$t('comparison')"
            >
            <div
              role="tabpanel"
              class="tab-content"
            >
              <div class="join w-full mt-2">
                <button
                  :title="$t('gotocomp')"
                  class="btn btn-secondary join-item w-1/3"
                  :class="objectListStore.objects.length !== 2 && 'btn-disabled'"
                  @click="navigateToComparison"
                >
                  <Icon name="material-symbols:compare" />
                </button>
                <button 
                  class="btn btn-error text-white join-item w-1/3"
                  :class="objectListStore.objects.length < 1 && 'btn-disabled'"
                  :title="$t('clearalllist')"
                  @click="removeAllObjects('objectListStore')"
                >
                  {{ $t('clearalllist') }}
                </button>
                <GlobalExportDataComp
                  :data-set-id="objectListStore.getObjectIds"
                  :class="objectListStore.objects.length < 1 && 'btn-disabled'"
                  class="join-item w-1/3"
                  :btn-size="''"
                />
              </div>
              <ul class="mt-2 w-full">
                <li
                  v-for="(object, index) in objectListStore.objects"
                  :key="index"
                  class="text-sm"
                >
                  <div class="flex justify-between w-full">
                    <a
                      class="link w-3/4"
                      :href="`/film/${ object.filmId }`"
                      target="_blank"
                    >
                      {{ object.filmTitle }}
                    </a>
                    <div class="w-1/4 flex flex-row">
                      <GlobalExportDataComp
                        :data-set-id="[object.filmId]"
                        class="btn btn-circle btn-sm"
                      />
                      <button
                        :title="$t('remove')"
                        class="btn btn-error btn-circle btn-sm text-white ml-1"
                        @click="removeObject(index, 'objectListStore')"
                      >
                        <Icon name="material-symbols:delete" />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="hidden">
                {{ objectListStore.getObjectIds }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {useObjectListStore} from '../../stores/compareList';
import {useShoppingCart} from '../../stores/shoppingCart';
const {$toggleComparisonDrawerState}:any = useNuxtApp();
const shoppingCart = useShoppingCart();
const objectListStore = useObjectListStore();

const toggleDrawer = (() => {
    objectListStore.comparisonDrawerOpen = !objectListStore.comparisonDrawerOpen;
});

const removeObject = (index, type:string) => {
    if(type === 'shoppingCart') {
        shoppingCart.removeObject(index);
        return;
    }
    objectListStore.removeObject(index);
};

const removeAllObjects = (type: string) => {
    if(type === 'shoppingCart') {
        shoppingCart.removeAllObjects();
        return;
    }
    objectListStore.removeAllObjects();
    return;
};

const navigateToComparison = () => {
    const objectIds: string[] = objectListStore.getObjectIds;
    if(objectIds.length == 2) {
        navigateTo(`/compare_altern?prev=${objectIds[0]}&next=${objectIds[1]}`);
    }
};
</script>

<style lang="css" scoped>
.tab:is(input[type="radio"]):after {
  width: 100%;
  min-width: 150px;
}
</style>