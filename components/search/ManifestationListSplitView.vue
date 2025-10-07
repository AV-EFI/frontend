<template>
  <div class="flex flex-col md:flex-row gap-2 border border-base-300 rounded-lg">
    <!-- Manifestation list (left) -->
    <div class="bg-base-200 dark:bg-base-300 md:[width:calc(40%+50px)]">
      <ul class="bg-base-100 w-full divide-y divide-base-300 dark:divide-base-400">
        <li
          v-for="(manifestation, index) in paginatedManifestations"
          :key="manifestation.handle"
          class="p-3 cursor-pointer hover:bg-base-50 dark:hover:bg-base-600"
          :class="{ 'bg-primary-50 dark:bg-primary-900': selectedIndex === index }"
          @click="selectedIndex = index; itemPage = 0; triggerScrollToItem()"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-sm">
                {{ manifestation.has_record.has_primary_title || 'Untitled' }}
              </h3>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ manifestation.handle }}
              </div>
            </div>
            <LazyMicroBadgeCategoryComp
              v-if="manifestation.has_record.category"
              :category="manifestation.has_record.category"
              :dense="true"
            />
          </div>
        </li>
      </ul>
      
      <!-- Pagination for manifestations -->
      <div class="flex justify-between p-3 bg-base-200">
        <button
          class="btn btn-sm"
          :disabled="currentPage <= 0"
          @click="prevPage"
        >
          {{ $t('prevPage') }}
        </button>
        <span class="text-sm">{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button
          class="btn btn-sm"
          :disabled="currentPage >= totalPages - 1"
          @click="nextPage"
        >
          {{ $t('nextPage') }}
        </button>
      </div>
    </div>

    <!-- Items panel -->
    <div class="flex-1 bg-base-100">
      <div v-if="selectedManifestation" ref="itemsContainer">
        <div class="p-4 border-b border-base-300">
          <div class="flex justify-between items-start mb-2">
            <h2 class="text-lg font-bold">Items</h2>
            <GlobalClipboardComp
              :text="selectedManifestation.handle"
              :label="'Copy Handle'"
            />
          </div>
          <SearchMetaIconListComp
            :data="selectedManifestation"
            icon-color="text-primary-600"
          />
        </div>
        
        <ul class="divide-y divide-base-300">
          <li
            v-for="item in paginatedItems"
            :key="item.handle"
            class="p-4 hover:bg-base-50 dark:hover:bg-base-600"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-semibold">{{ item.title || 'Untitled Item' }}</h3>
                  <MicroBadgeCategoryComp
                    v-if="item.category"
                    :category="item.category"
                    :dense="true"
                  />
                </div>
                
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {{ item.handle }}
                </div>
                
                <SearchMetaIconListComp
                  :data="item"
                  icon-color="text-secondary-600"
                />
              </div>
              
              <div class="flex gap-2 ml-4">
                <GlobalClipboardComp
                  :text="item.handle"
                  :label="'Copy'"
                />
                <GlobalTooltipInfo :text="'Open in new tab'">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="navigateToItem(item)"
                  >
                    View
                  </button>
                </GlobalTooltipInfo>
              </div>
            </div>
          </li>
        </ul>
        
        <!-- Pagination for items -->
        <div class="flex justify-between p-4 bg-base-200">
          <button
            class="btn btn-sm"
            :disabled="itemPage <= 0"
            @click="prevItemPage"
          >
            {{ $t('prevPage') }}
          </button>
          <span class="text-sm">{{ itemPage + 1 }} / {{ totalItemPages }}</span>
          <button
            class="btn btn-sm"
            :disabled="itemPage >= totalItemPages - 1"
            @click="nextItemPage"
          >
            {{ $t('nextPage') }}
          </button>
        </div>
      </div>
      
      <div v-else class="p-8 text-center text-gray-500">
        Select a manifestation to view its items
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiManifestation } from '~/models/interfaces/generated/IAVefiManifestation'

const props = defineProps<{
    manifestations: IAVefiManifestation[]
    getFilteredItems: (manifestation: IAVefiManifestation) => any[]
    workVariantHandle?: string | null
}>()

const selectedIndex = ref(0)
const currentPage = ref(0)
const itemsPerPage = 5
const itemsContainer = ref<HTMLElement | null>(null)
const itemPage = ref(0)

const totalPages = computed(() => Math.ceil(props.manifestations.length / itemsPerPage))
const selectedManifestation = computed(() => props.manifestations[selectedIndex.value] || null)

const paginatedManifestations = computed(() => {
    const start = currentPage.value * itemsPerPage
    return props.manifestations.slice(start, start + itemsPerPage)
})

const paginatedItems = computed(() => {
    if (!selectedManifestation.value) return []
    const all = props.getFilteredItems(selectedManifestation.value)
    const start = itemPage.value * itemsPerPage
    return all.slice(start, start + itemsPerPage)
})

const totalItemPages = computed(() => {
    const all = selectedManifestation.value ? props.getFilteredItems(selectedManifestation.value) : []
    return Math.ceil(all.length / itemsPerPage)
})

function nextPage() {
    if (currentPage.value < totalPages.value - 1) currentPage.value++
}
function prevPage() {
    if (currentPage.value > 0) currentPage.value--
}
function nextItemPage() {
    if (itemPage.value < totalItemPages.value - 1) itemPage.value++
}
function prevItemPage() {
    if (itemPage.value > 0) itemPage.value--
}

const navigateToItem = (item: any) => {
    const itemPath = `/film/${props.workVariantHandle?.replace('21.11155/', '')}#${item?.handle?.replace('21.11155/', '')}`
    window.open(itemPath, '_blank')
}

function triggerScrollToItem() {
    nextTick(() => {
        const el = itemsContainer.value
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 125
            window.scrollTo({ top, behavior: 'smooth' })
        }
    })
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
