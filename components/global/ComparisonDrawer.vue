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
                    class="hidden md:visible drawer-overlay bg-base-200 dark:bg-gray-800 z-40"
                    @click="toggleDrawer"
                />
                <div
                    class="menu p-2 md:p-4 w-full md:w-screen lg:w-max lg:max-w-136 min-h-full bg-white z-40 dark:bg-gray-700 dark:border-left-white dark:border-l-2 border-neutral-400 text-base-content dark:text-white border-l-gray-800 shadow-lg"
                >
                    <div class="w-full flex flex-row justify-between p-2 mb-2">
                        <button class="btn btn-neutral w-16" :title="$t('close')" @click="$toggleComparisonDrawerState()">
                            <Icon class="text-xl" name="formkit:close" />
                        </button>
                    </div>

                    <div
                        class="tabs tabs-bordered justify-stretch w-full"
                        role="tablist"
                        :aria-label="$t('toggleComparisonDrawer')"
                    >
                        <button
                            id="comparison-tab"
                            role="tab"
                            type="button"
                            class="tab flex-1 lg:!w-64"
                            :class="{ 'tab-active': activeTab === 'comparison' }"
                            :aria-selected="activeTab === 'comparison'"
                            aria-controls="comparison-panel"
                            :disabled="!comparisonHasItems"
                            @click="activeTab = 'comparison'"
                        >
                            {{ $t('comparison') }}
                        </button>

                        <button
                            id="favourites-tab"
                            role="tab"
                            type="button"
                            class="tab flex-1 lg:!w-64"
                            :class="{ 'tab-active': activeTab === 'favourites' }"
                            :aria-selected="activeTab === 'favourites'"
                            aria-controls="favourites-panel"
                            :disabled="!favouritesHasItems"
                            @click="activeTab = 'favourites'"
                        >
                            {{ $t('favourites') }}
                        </button>
                    </div>
                    <section
                        id="comparison-panel"
                        role="tabpanel"
                        class="bg-base-200 dark:bg-gray-800 dark:text-white"
                        aria-labelledby="comparison-tab"
                        :aria-hidden="activeTab !== 'comparison'"
                        v-show="activeTab === 'comparison'"
                    >
                        <div class="p-2 w-full flex flex-row justify-between">
                            <button class="btn btn-ghost btn-sm w-16" :title="$t('info')" @click="showInfo = !showInfo">
                                <Icon name="tabler:info" class="text-lg" />
                            </button>
                            <p v-if="showInfo" class="grow">
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
                                <Icon class="text-lg text-white w-4 h-4" name="tabler:arrows-exchange" />
                                <span class="hidden md:inline-block">{{ $t('comp') }}</span>
                            </button>

                            <button
                                class="btn btn-error h-12 join-item w-1/3"
                                :class="objectListStore.objects.length < 1 && 'btn-disabled'"
                                :title="$t('clearalllist')"
                                @click="removeAllObjects('objectListStore')"
                            >
                                <span class="text-white flex">
                                    <Icon class="text-lg text-white w-4 h-4 mr-2" name="tabler:trash" />
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

                        <ul v-if="objectListStore.objects.length > 0" class="mt-2 w-full">
                            <li v-for="(object, index) in objectListStore.objects" :key="index" class="text-sm">
                                <div class="flex justify-between w-full">
                                    <a class="link w-3/4" :href="`/res/${object.filmId}`" target="_blank">
                                        {{ object.filmTitle }}
                                    </a>
                                    <div class="w-1/4 flex flex-row">
                                        <GlobalExportDataComp :data-set-id="[object.filmId]" btn-size="btn-circle btn-sm !w-8 !h-8" />
                                        <button
                                            :title="$t('remove')"
                                            class="btn btn-error btn-circle btn-sm text-white ml-1 w-8 h-8"
                                            @click="removeObject(index, 'objectListStore')"
                                        >
                                            <Icon class="text-lg" name="tabler:trash" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div v-else class="p-4 text-gray-500 text-sm">
                            {{ $t('noComparisonItems') }}
                        </div>
                    </section>

                    <section
                        id="favourites-panel"
                        role="tabpanel"
                        class="bg-base-200 dark:bg-gray-800 dark:text-white"
                        aria-labelledby="favourites-tab"
                        :aria-hidden="activeTab !== 'favourites'"
                        v-show="activeTab === 'favourites'"
                    >
                        <div class="p-2 w-full flex flex-row justify-between">
                            <button class="btn btn-ghost btn-sm w-16" :title="$t('info')" @click="showInfo = !showInfo">
                                <Icon class="text-lg" name="tabler:info-circle" />
                            </button>
                            <p v-if="showInfo" class="grow">
                                {{ $t('favouritesComponent') }}
                            </p>
                        </div>

                        <div class="join w-full mt-2 p-2">
                            <button
                                class="btn btn-error text-white join-item h-12 w-1/2"
                                :class="favourites.objects.length < 1 && 'btn-disabled'"
                                :title="$t('clearalllist')"
                                @click="removeAllObjects('favourites')"
                            >
                                <Icon name="tabler:trash" />
                                {{ $t('clearalllist') }}
                            </button>

                            <GlobalExportDataComp
                                :data-set-id="favourites.getObjectIds"
                                :class="favourites.objects.length < 1 && 'btn-disabled'"
                                class="join-item w-1/2"
                                :show-label="true"
                                :btn-size="'rounded-l-none'"
                            />
                        </div>
                        <ul v-if="favourites.objects.length > 0" class="mt-2 w-full">
                            <li v-for="(favouritesItem, index) in favourites.objects" :key="index" class="mt-2">
                                <div class="flex justify-between w-full">
                                    <a class="link w-3/4" :href="`/res/${favouritesItem.filmId}`" target="_blank">
                                        {{ favouritesItem.filmTitle }}
                                    </a>
                                    <div class="w-1/4 flex flex-row">
                                        <GlobalExportDataComp
                                            :data-set-id="[favouritesItem.filmId]"
                                            btn-size="btn-circle btn-sm !w-8 !h-8"
                                        />
                                        <button
                                            :title="$t('remove')"
                                            class="btn btn-error btn-circle btn-sm w-8 h-8 text-white ml-1"
                                            @click="removeObject(index, 'favourites')"
                                        >
                                            <Icon class="text-lg" name="tabler:trash" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div v-else class="p-4 text-gray-500 text-sm">
                            {{ $t('nofavouritesItems') }}
                        </div>
                    </section>
                </div>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useObjectListStore } from '../../stores/compareList';
import { useFavourites } from '../../stores/favourites';

const { $toggleComparisonDrawerState, $toast }: any = useNuxtApp();
const favourites = useFavourites();
const objectListStore = useObjectListStore();
const showInfo = ref(false);
const activeTab = ref<'comparison' | 'favourites'>('comparison');

const comparisonHasItems = computed(() => objectListStore.objects.length > 0);
const favouritesHasItems = computed(() => favourites.objects.length > 0);

watch([comparisonHasItems, favouritesHasItems], () => {
    if (activeTab.value === 'comparison' && !comparisonHasItems.value && favouritesHasItems.value) {
        activeTab.value = 'favourites';
    } else if (activeTab.value === 'favourites' && !favouritesHasItems.value && comparisonHasItems.value) {
        activeTab.value = 'comparison';
    } else if (!comparisonHasItems.value && favouritesHasItems.value) {
        activeTab.value = 'favourites';
    } else if (!favouritesHasItems.value && comparisonHasItems.value) {
        activeTab.value = 'comparison';
    }
}, { immediate: true });

const toggleDrawer = () => {
    objectListStore.comparisonDrawerOpen = !objectListStore.comparisonDrawerOpen;
};

const removeObject = (index: number, type: string) => {
    if (type === 'favourites') {
        favourites.removeObject(index);
        return;
    }
    objectListStore.removeObject(index);
};

const removeAllObjects = (type: string) => {
    if (type === 'favourites') {
        favourites.removeAllObjects();
        return;
    }
    objectListStore.removeAllObjects();
};

const navigateToComparison = () => {
    try {
        const objectIds: string[] = objectListStore.getObjectIds;
        if (objectIds.length === 2) {
            navigateTo(`/compare?prev=${objectIds[0]}&next=${objectIds[1]}`);
        }
    } catch (e) {
        console.error(e);
        $toast?.error?.('Error');
    }
};
</script>

<style scoped>
.tab[disabled] {
    pointer-events: none;
    opacity: 0.5;
}
</style>