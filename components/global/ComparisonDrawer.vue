<template>
  <div class="drawer w-0 md:w-[20em] drawer-end">
    <ClientOnly>
      <input
        id="comparison_drawer"
        :aria-label="$t('toggleComparisonDrawer')"
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
        <div class="menu p-2 md:p-4 w-full md:w-[100vw] lg:w-max lg:max-w-[544px] min-h-full bg-white z-40 dark:bg-gray-700 dark:border-left-white dark:border-l-2 border-neutral-400 text-base-content dark:text-white border-l-gray-800 shadow-lg">
          <div class="w-full flex flex-row justify-between p-2 mb-2">
            <button 
              class="btn btn-neutral w-16"
              :title="$t('close')"
              @click="$toggleComparisonDrawerState()"
            >
              <Icon
                class="text-xl"
                name="formkit:close"
              />
            </button>
          </div>
          <div
            role="tablist"
            class="tabs tabs-bordered justify-stretch w-full"
          >
            <input
              id="comparison_list_tab"
              type="radio"
              name="drawer_tabs"
              role="tab"
              checked
              :class="['tab lg:!w-64', objectListStore.objects.length === 0 && 'tab-disabled disabled']" 
              :aria-label="$t('comparison')"
            >
            <div
              role="tabpanel"
              class="tab-content bg-base-200 dark:bg-gray-800 dark:text-white"
            >
              <div class="p-2 w-full flex flex-row justify-between">
                <button 
                  class="btn btn-ghost btn-sm w-16"
                  :title="$t('info')"
                  @click="showInfo = !showInfo"
                >
                  <Icon
                    name="material-symbols:info-outline"
                    class="text-lg"
                  />
                </button>
                <p
                  v-if="showInfo"
                  class="flex-grow"
                >
                  {{ $t('comparisonComponent') }}
                </p>
              </div>
              <div class="join w-full mt-2 p-2">
                <button
                  :title="$t('gotocomp')"
                  class="btn btn-compare-list h-12 join-item w-1/3"
                  :class="objectListStore.objects.length !== 2 && 'btn-disabled'"
                  @click="navigateToComparison"
                >
                  <Icon
                    class="text-lg text-white w-4 h-4"
                    name="tabler:arrows-exchange"
                  />
                  <span class="hidden md:inline-block">{{ $t('comp') }}</span>
                </button>
                <button 
                  class="btn btn-error h-12 join-item w-1/3"
                  :class="objectListStore.objects.length < 1 && 'btn-disabled'"
                  :title="$t('clearalllist')"
                  @click="removeAllObjects('objectListStore')"
                >
                <span class="text-white flex">
                  <Icon
                    class="text-lg text-white w-4 h-4 mr-2"
                    name="tabler:trash"
                  />
                  {{ $t('clearalllist') }}
                </span>
                </button>
                <GlobalExportDataComp
                  :data-set-id="objectListStore.getObjectIds"
                  :class="objectListStore.objects.length < 1 && 'btn-disabled'"
                  class="join-item h-12 btn-primary btn-outline w-1/3"
                  btn-size="rounded-l-none"
                  :show-label="true"
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
                        btn-size="btn-circle btn-sm !w-8 !h-8"
                      />
                      <button
                        :title="$t('remove')"
                        class="btn btn-error btn-circle btn-sm text-white ml-1 w-8 h-8"
                        @click="removeObject(index, 'objectListStore')"
                      >
                        <Icon name="tabler:trash" />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="hidden">
                {{ objectListStore.getObjectIds }}
              </div>
            </div>
            <input
              id="shopping_cart_tab"
              type="radio"
              name="drawer_tabs"
              role="tab"
              :class="['tab lg:!w-64', shoppingCart.objects.length === 0 && 'tab-disabled disabled']"
              :aria-label="$t('shoppingcart')"
            >
            <div
              role="tabpanel"
              class="tab-content bg-base-200 dark:bg-gray-800 dark:text-white"
            >
              <div class="p-2 w-full flex flex-row justify-between">
                <button 
                  class="btn btn-ghost btn-sm w-16"
                  :title="$t('info')"
                  @click="showInfo = !showInfo"
                >
                  <Icon
                    class="text-lg"
                    name="material-symbols:info-outline"
                  />
                </button>
                <p
                  v-if="showInfo"
                  class="flex-grow"
                >
                  {{ $t('favouritesComponent') }}
                </p>
              </div>
              <div class="join w-full mt-2 p-2">
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
                  :btn-size="'rounded-l-none'"
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
                        btn-size="btn-circle btn-sm !w-8 !h-8"
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
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify';
import {useObjectListStore} from '../../stores/compareList';
import {useShoppingCart} from '../../stores/shoppingCart';
const {$toggleComparisonDrawerState}:any = useNuxtApp();
const shoppingCart = useShoppingCart();
const objectListStore = useObjectListStore();
const showInfo = ref(false);

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
    try {
        const objectIds: string[] = objectListStore.getObjectIds;
        if(objectIds.length == 2) {
            navigateTo(`/compare_altern?prev=${objectIds[0]}&next=${objectIds[1]}`);
        }
    }
    catch(e) {
        console.error(e);
        toast.error($t('error'));
    }
};
</script>

<style lang="css" scoped>
.tab:is(input[type="radio"]):after {
  width: 100%;
  min-width: 150px;
}
</style>