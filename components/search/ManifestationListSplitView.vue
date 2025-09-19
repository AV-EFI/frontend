<template>
  <div class="flex flex-col md:flex-row gap-2 border border-base-300 rounded-lg">
    <!-- Manifestation list (left) -->
    <div class="bg-base-200 dark:bg-base-300 md:[width:calc(40%+50px)]">
      <ul class="bg-base-100 w-full divide-y divide-base-300 dark:divide-base-400">
        <li
          v-for="(m, i) in paginatedManifestations"
          :key="i + currentPage"
          :aria-label="$t('clickToSelectManifestation')"
          :title="$t('clickToSelectManifestation')"
          class="px-2 pt-2"
        >
          <a
            class="group min-h-20 px-1 py-4 cursor-pointer flex items-center justify-between bg-base-100 dark:bg-base-200 rounded-md shadow-sm"
            :class="[
              'transition-all duration-200 ease-in-out border',
              selectedIndex === i + currentPage * itemsPerPage
                ? 'border-primary'
                : 'border-transparent hover:border-base-300 dark:hover:border-base-400'
            ]"
            :aria-current="selectedIndex === i + currentPage * itemsPerPage ? 'true' : 'false'"
            @click="selectedIndex = i + currentPage * itemsPerPage; triggerScrollToItem()"
          >
            <div class="flex flex-col justify-center leading-tight w-full">
              <div class="w-full flex flex-row justify-between items-center mb-2">
                <LazyMicroBadgeCategoryComp
                  category="avefi:Manifestation"
                  :dense="false"
                  class="mr-2"
                />
                <span
                  class="text-sm ml-auto font-mono"
                  :alt="$t('itemsCount')"
                  :aria-label="$t('itemsCount')"
                  :title="$t('itemsCount')"
                >
                  <Icon
                    class="text-xs"
                    name="tabler:hierarchy"
                  /> {{ getFilteredItems(m).length }}
                </span>
              </div>
              <GlobalClipboardComp
                :display-text="m.handle"
                class="text-xs dark:hover:text-gray-400"
                :aria-label="$t('copyManifestationHandle')"
                :dark-bg="false"
              />
              <div class="text-sm font-medium mt-0.5">
                {{ m.has_record?.described_by?.has_issuer_name || $t('unknownIssuer') }}
              </div>
              <SearchMetaIconListComp
                type="manifestation"
                :data="m"
              />
              <button 
                class="btn btn-primary btn-outline btn-xs mt-2"
                :aria-label="$t('viewManifestationDetails')"
                :title="$t('viewManifestationDetails')"
                @click.stop="navigateToItem(m)"
              >
                <Icon
                  name="mdi:eye-outline"
                  class="w-4 h-4 mr-1"
                />
              </button>
            </div>
            <div class="flex items-center px-1 self-start sm:self-center">
              <Icon
                name="mdi:chevron-up"
                class="text-xl text-neutral shrink-0 transition-transform duration-200 ease-in-out dark:text-neutral-400"
                :class="selectedIndex === i + currentPage * itemsPerPage ? 'rotate-90' : 'rotate-0'"
                aria-hidden="true"
              />
            </div>
          </a>

          <!-- Collapsible mobile detail -->
          <transition name="fade-slide">
            <div
              v-if="selectedIndex === i + currentPage * itemsPerPage"
              class="block md:hidden mt-2 p-3 bg-base-100 dark:bg-base-200 rounded-b-md"
            >
              <h5 class="text-sm font-bold text-primary mb-1 flex items-center gap-1">
                <Icon
                  name="tabler:binary-tree"
                  class="text-base"
                />
                {{ $t('items') }}
                <GlobalTooltipInfo
                  :text="$t('tooltip.item')"
                />
              </h5>
              <ul class="space-y-2 pl-1">
                <li
                  v-for="(item, j) in getFilteredItems(m).slice(0, 3)"
                  :key="j"
                  class="bg-base-100 dark:bg-base-300 rounded-md p-2"
                >
                  <div class="flex gap-2 items-center mb-1">
                    <Icon
                      name="carbon:parent-node"
                      class="text-primary w-4 h-4"
                    />
                    <span class="text-sm font-semibold">{{ item?.handle }}</span>
                  </div>
                  <SearchMetaIconListComp
                    type="item"
                    :data="item"
                  />
                </li>
              </ul>
              <button
                class="btn btn-xs btn-outline mt-2 w-full"
                :aria-label="$t('viewAllItems')"
                @click.stop="navigateToItem(m)"
              >
                {{ $t('viewAllItems') }}
              </button>
            </div>
          </transition>
        </li>
      </ul>

      <div class="flex justify-between items-center mt-2 p-2">
        <button
          class="btn btn-xs btn-outline"
          :disabled="currentPage === 0"
          @click="prevPage"
        >
          {{ $t('prevPage') }}
        </button>
        <span class="text-xs">
          {{ $t('page') }} {{ currentPage + 1 }} / {{ totalPages }} — {{ manifestations.length }} {{ $t('total') }}
        </span>
        <button
          class="btn btn-xs btn-outline"
          :disabled="currentPage >= totalPages - 1"
          @click="nextPage"
        >
          {{ $t('nextPage') }}
        </button>
      </div>
    </div>

    <!-- Detail view (right) for md+ -->
    <transition name="fade-slide">
      <div
        v-if="selectedManifestation"
        class="hidden md:block z-10 md:[width:calc(60%-50px)] bg-base-200 dark:bg-base-100 p-4 relative"
        role="region"
        :aria-label="`manifestation-${selectedManifestation.handle}`"
      >
        <h5 class="relative text-sm font-bold mb-2 flex items-center gap-1">
          <Icon
            name="tabler:binary-tree"
            class="text-base"
          />
          {{ $t('items') }}
          <GlobalTooltipInfo
            :text="$t('tooltip.item')"
          />
        </h5>
        <div
          ref="itemsContainer"
          class="relative"
        >
          <ul class="space-y-2">
            <li
              v-for="(item, j) in paginatedItems"
              :key="j"
              class="p-2 bg-base-100 dark:bg-base-200 rounded-md"
              :aria-labelledby="`item-${item.handle}`"
              role="group"
              :aria-label="$t('itemDetails', { handle: item.handle })"
            >
              <div class="flex items-center gap-2 mb-1">
                <Icon
                  name="tabler:hierarchy"
                  class="text-primary w-4 h-4 shrink-0"
                />
                <MicroBadgeCategoryComp
                  category="avefi:Item"
                  :dense="false"
                  class="block"
                />
              </div>
              <GlobalClipboardComp 
                :display-text="item.handle"
                class="font-semibold hover:text-gray-700 dark:hover:text-gray-300 my-2"
                :aria-label="$t('copyItemHandle')"
                font-size="text-sm"
              />
              <SearchMetaIconListComp
                :data="item"
                type="item"
              />
              <div class="text-sm text-gray-500 dark:text-gray-300 mt-2 relative">
                <a
                  v-if="item?.has_record?.has_webresource"
                  :href="item.has_record.has_webresource"
                  target="_blank"
                  class="link link-primary dark:link-accent inline-flex items-center gap-1"
                >
                  <GlobalTooltipInfo
                    :text="$t('tooltip.webresource')"
                  />
                  <Icon name="formkit:linkexternal" />
                  {{ $t('webresource') }}
                </a>
              </div>
              <div class="flex justify-end">
                <button 
                  class="btn btn-xs btn-block btn-outline mt-2"
                  :aria-label="$t('viewItemDetails')"
                  :title="$t('viewItemDetails')"
                  @click="navigateToItem(item)"
                >
                  <Icon
                    name="mdi:eye-outline"
                    class="w-4 h-4 mr-1"
                  />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex justify-between items-center mt-2 px-2 text-xs">
          <button
            class="btn btn-xs btn-outline"
            :disabled="itemPage === 0"
            @click="prevItemPage"
          >
            {{ $t('prevPage') }}
          </button>
          <span>
            {{ $t('page') }} {{ itemPage + 1 }} / {{ totalItemPages }}
          </span>
          <button
            class="btn btn-xs btn-outline"
            :disabled="itemPage >= totalItemPages.value - 1"
            @click="nextItemPage"
          >
            {{ $t('nextPage') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
    manifestations: { type: Array, required: true },
    getFilteredItems: { type: Function, required: true },
    workVariantHandle: { type: String, required: false, default: null }
});

const selectedIndex = ref(0);
const currentPage = ref(0);
const itemsPerPage = 5;
const itemsContainer = ref<HTMLElement | null>(null);
const itemPage = ref(0);

const totalPages = computed(() => Math.ceil(props.manifestations.length / itemsPerPage));
const selectedManifestation = computed(() => props.manifestations[selectedIndex.value] || null);

const paginatedManifestations = computed(() => {
    const start = currentPage.value * itemsPerPage;
    return props.manifestations.slice(start, start + itemsPerPage);
});

const paginatedItems = computed(() => {
    if (!selectedManifestation.value) return [];
    const all = props.getFilteredItems(selectedManifestation.value);
    const start = itemPage.value * itemsPerPage;
    return all.slice(start, start + itemsPerPage);
});

const totalItemPages = computed(() => {
    const all = selectedManifestation.value ? props.getFilteredItems(selectedManifestation.value) : [];
    return Math.ceil(all.length / itemsPerPage);
});

function nextPage() {
    if (currentPage.value < totalPages.value - 1) currentPage.value++;
}
function prevPage() {
    if (currentPage.value > 0) currentPage.value--;
}
function nextItemPage() {
    if (itemPage.value < totalItemPages.value - 1) itemPage.value++;
}
function prevItemPage() {
    if (itemPage.value > 0) itemPage.value--;
}

const navigateToItem = (item: any) => {
    const itemPath = `/film/${props.workVariantHandle?.replace('21.11155/', '')}#${item?.handle?.replace('21.11155/', '')}`;
    window.open(itemPath, '_blank');
};

function triggerScrollToItem() {
    nextTick(() => {
        const el = itemsContainer.value;
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 125;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
}

</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.3s ease;
}
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
