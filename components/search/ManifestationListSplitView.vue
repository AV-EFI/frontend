<template>
  <div class="flex flex-col md:flex-row gap-2 border border-base-300 rounded-lg overflow-hidden">
    <!-- Manifestation list (left) -->
    <div class="bg-base-200 dark:bg-base-300 md:[width:calc(40%+50px)]">
      <ul class="bg-base-100 rounded-box w-full">
        <li
          v-for="(m, i) in paginatedManifestations"
          :key="i + currentPage"
          :aria-label="$t('clickToSelectManifestation')"
          :title="$t('clickToSelectManifestation')"
        >
          <a
            class="group min-h-20 px-2 py-4 cursor-pointer flex items-center justify-between text-left transition-colors"
            :class="[
              'transition-all duration-200 ease-in-out border-2 rounded-md',
              selectedIndex === i + currentPage * itemsPerPage
                ? 'border-primary bg-base-100 dark:bg-base-300'
                : 'border-transparent hover:border-primary-200 hover:bg-base-200 dark:hover:bg-base-100'
            ]"
            :aria-current="selectedIndex === i + currentPage * itemsPerPage ? 'true' : 'false'"
            @click="selectedIndex = i + currentPage * itemsPerPage"
          >
            <div class="flex flex-col justify-center leading-tight w-full">
              <div class="w-full flex flex-row justify-between items-center mb-1">
                <LazyMicroBadgeCategoryComp
                  category="avefi:Manifestation"
                  :dense="false"
                  class="mr-2"
                />
                <span
                  class="text-md ml-auto font-mono"
                  :alt="$t('itemsCount')"
                  :aria-label="$t('itemsCount')"
                  :title="$t('itemsCount')"
                >
                  {{ getFilteredItems(m).length }}
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
                @click="navigateToItem(m)"
              >
                <Icon
                  name="material-symbols:read-more-rounded"
                  class="w-4 h-4 mr-1"
                  aria-hidden="true"
                />
              </button>
            </div>
            <!-- Right: Chevron icon in full-height div -->
            <div class="flex items-center px-1">
              <Icon
                name="mdi:chevron-up"
                class="text-xl text-neutral shrink-0 transition-transform duration-200 ease-in-out dark:text-neutral-400"
                :class="selectedIndex === i + currentPage * itemsPerPage ? 'rotate-90' : 'rotate-0'"
                aria-hidden="true"
              />  
            </div>
          </a>
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

    <!-- Detail view (right) -->
    <transition name="fade-slide">
      <div
        v-if="selectedManifestation"
        class="md:[width:calc(60%-50px)] bg-base-200 dark:bg-base-100 p-4 relative"
        role="region"
        :aria-labelledby="`manifestation-${selectedManifestation.handle}`"
      >
        <h5
          class="text-sm font-bold uppercase text-primary mb-2 flex items-center gap-1"
          :alt="$t('tooltip.item')"
          :title="$t('tooltip.item')"
        >
          <Icon
            name="carbon:chart-relationship"
            class="text-base"
          />
          {{ $t('items') }}
        </h5>

        <div
          ref="itemsContainer"
          class="relative pl-6"
        >
          <div class="absolute left-2 top-0 bottom-0 w-px bg-base-300 dark:bg-base-500" />
          <ul class="space-y-2">
            <li
              v-for="(item, j) in paginatedItems"
              :key="j"
              class="relative p-2 bg-base-100 dark:bg-base-200 rounded-md"
              :aria-labelledby="`item-${item.handle}`"
              role="group"
            >
              <div class="flex items-center gap-2 mb-1">
                <Icon
                  name="carbon:parent-node"
                  class="text-primary w-4 h-4 shrink-0"
                  aria-hidden="true"
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
                type="item"
                :data="item"
              />
              <div class="text-sm text-gray-500 dark:text-gray-300 mt-2">
                <a
                  v-if="item?.has_record?.has_webresource"
                  :href="item.has_record.has_webresource"
                  target="_blank"
                  class="link link-primary dark:link-accent inline-flex items-center gap-1"
                >
                  <Icon name="formkit:linkexternal" />
                  {{ $t('webresource') }}
                </a>
              </div>
              <div class="flex justify-end">
                <button 
                  class="btn btn-xs btn-block btn-outline mt-2"
                  :aria-label="$t('viewItemDetails')"
                  :title="$t('viewItemDetails')"
                  :class="{
                    'btn-primary': selectedIndex === j + itemPage * itemsPerPage,
                    'btn-outline': selectedIndex !== j + itemPage * itemsPerPage
                  }"
                  @click="navigateToItem(item)"
                >
                  <Icon
                    name="material-symbols:read-more-rounded"
                    class="w-4 h-4 mr-1"
                    aria-hidden="true"
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
            :disabled="itemPage >= totalItemPages - 1"
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
const totalPages = computed(() => Math.ceil(props.manifestations.length / itemsPerPage));
const selectedManifestation = computed(() => props.manifestations[selectedIndex.value] || null);


const navigateToItem = (item: string) => {
    const route = useRoute();
    const router = useRouter();
    const itemPath = `/film/${props.workVariantHandle?.replace('21.11155/','')}#${item?.handle?.replace('21.11155/','')}`;
    if (route.path !== itemPath) {
        router.push(itemPath);
    }
};

watch(selectedManifestation, () => {
    itemPage.value = 0;

    nextTick(() => {
        const el = itemsContainer.value;
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 125; // adjust offset if needed
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

const paginatedManifestations = computed(() => {
    const start = currentPage.value * itemsPerPage;
    return props.manifestations.slice(start, start + itemsPerPage);
});


function prevPage() {
    if (currentPage.value > 0) currentPage.value--;
}
function nextPage() {
    if (currentPage.value < totalPages.value - 1) currentPage.value++;
}

const manifestationFields = [
    'has_record.in_language',
    'has_record.has_colour_type',
    'has_record.has_sound_characteristics'
];

const itemFields = [
    'has_record.has_format',
    'has_record.element_type',
    'has_record.in_language.code',
    'has_record.has_webresource'
];

function getCompleteness(obj: any, fieldPaths: string[]): number {
    return fieldPaths.filter(path => {
        const value = path.split('.').reduce((o, key) => o?.[key], obj);
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
    }).length;
}

function getCompletenessIcons(obj: any, fieldPaths: string[]): string[] {
    return fieldPaths.map(path => {
        const value = path.split('.').reduce((o, key) => o?.[key], obj);
        return Array.isArray(value) ? (value.length > 0 ? '●' : '○') : (value ? '●' : '○');
    });
}

const itemPage = ref(0);

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

function nextItemPage() {
    if (itemPage.value < totalItemPages.value - 1) itemPage.value++;
}

function prevItemPage() {
    if (itemPage.value > 0) itemPage.value--;
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
