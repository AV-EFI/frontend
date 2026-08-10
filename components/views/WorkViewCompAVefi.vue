<template>
    <div class="work-detail-shell relative">
        <transition name="work-summary-bar">
            <aside
                v-if="showNavbarProductionSummary"
                class="work-production-summary fixed inset-x-0 z-20 border-b border-work/50 bg-base-100/95 shadow-sm backdrop-blur"
                :style="navbarSummaryStyle"
                :aria-label="$t('workEvents')"
            >
                <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-sm 2xl:px-6">
                    <p class="min-w-0 max-w-md truncate text-sm font-semibold text-base-content">
                        {{ workSummaryTitle }}
                    </p>
                    <dl class="flex min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-1">
                        <div
                            v-for="row in workContextRows"
                            :key="row.key"
                            class="flex min-w-0 max-w-full items-center gap-1"
                        >
                            <dt class="flex shrink-0 items-center gap-1 text-xs font-medium text-base-content/60">
                                <Icon :name="row.icon" class="icon-inline" aria-hidden="true" />
                                <span>{{ row.label }}</span>
                            </dt>
                            <dd class="min-w-0 truncate text-sm text-base-content" :title="row.value">
                                {{ row.value }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </aside>
        </transition>

        <!-- Mobile drawer for tree-view (left) -->
        <div class="drawer fixed inset-0 z-50 lg:hidden order-1" v-if="drawerOpen">
            <div class="drawer-overlay bg-black bg-opacity-40" @click="drawerOpen = false"></div>
            <div class="drawer-side fixed left-0 top-0 w-72 h-full bg-base-200 shadow-xl overflow-y-auto">
                <button type="button" class="btn btn-sm btn-circle absolute top-4 right-4" @click="drawerOpen = false"
                        :aria-label="`${$t('close')} ${$t('workNavigation')}`"
                        :title="`${$t('close')} ${$t('workNavigation')}`">
                    <Icon name="tabler-x" aria-hidden="true" />
                </button>
                <div class="border-b border-base-300 p-4 pr-12">
                    <p class="text-xs font-medium uppercase text-base-content/60">{{ $t('workNavigation') }}</p>
                    <p class="mt-2 line-clamp-2 text-sm font-semibold">
                        {{ mir?.has_primary_title?.has_name ?? dataObject?.compound_record?._source?.handle }}
                    </p>
                </div>
                <nav id="work-navigation-drawer" :aria-label="$t('workNavigation')" class="max-h-[calc(100vh-8rem)] overflow-y-auto p-2">
                    <ol class="menu work-section-menu w-full p-0">
                        <li v-if="workVariantNavigationItems.length" class="work-section-menu-group-label">
                            <span>{{ $t('avefi_WorkVariant') }}</span>
                        </li>
                        <li v-for="item in workVariantNavigationItems" :key="item.id">
                            <button
                                type="button"
                                class="work-section-menu-item"
                                :class="{ 'is-active': isNavigationItemActive(item), 'work-section-menu-item--work': item.kind === 'work' }"
                                :aria-current="isNavigationItemActive(item) ? 'location' : undefined"
                                @click="scrollToId(item.id); drawerOpen = false"
                            >
                                <span class="work-section-menu-marker" aria-hidden="true">
                                    <Icon :name="item.icon" class="h-4 w-4" aria-hidden="true" />
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span class="block truncate">{{ item.label }}</span>
                                    <span v-if="item.description" class="block truncate text-xs text-base-content/60">
                                        {{ item.description }}
                                    </span>
                                </span>
                                <span v-if="typeof item.count === 'number'" class="badge badge-sm badge-outline">
                                    {{ item.count }}
                                </span>
                            </button>
                        </li>
                        <li v-if="collectionNavigationItems.length" class="work-section-menu-separator" aria-hidden="true"></li>
                        <li v-for="item in collectionNavigationItems" :key="item.id">
                            <button
                                type="button"
                                class="work-section-menu-item"
                                :class="{ 'is-active': isNavigationItemActive(item) }"
                                :aria-current="isNavigationItemActive(item) ? 'location' : undefined"
                                @click="scrollToId(item.id); drawerOpen = false"
                            >
                                <span class="work-section-menu-marker" aria-hidden="true">
                                    <Icon :name="item.icon" class="h-4 w-4" aria-hidden="true" />
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span class="block truncate">{{ item.label }}</span>
                                    <span v-if="item.description" class="block truncate text-xs text-base-content/60">
                                        {{ item.description }}
                                    </span>
                                </span>
                                <span v-if="typeof item.count === 'number'" class="badge badge-sm badge-outline">
                                    {{ item.count }}
                                </span>
                            </button>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>

        <!-- Mobile drawer button -->
        <div class="fixed top-4 left-4 z-20 lg:hidden order-0">
            <button class="btn btn-primary btn-circle" @click="drawerOpen = true"
                    :aria-label="`${$t('openMenu')}: ${$t('workNavigation')}`"
                    :aria-controls="'work-navigation-drawer'"
                    :aria-expanded="drawerOpen ? 'true' : 'false'">
                <Icon name="tabler-list-tree" aria-hidden="true" />
            </button>
        </div>

        <div class="work-detail-layout lg:flex lg:items-start lg:gap-4">
            <transition name="slide-sidebar">
                <aside
                    v-if="desktopDrawerOpen"
                    class="work-navigation-sidebar hidden lg:block w-72 shrink-0"
                >
                    <div class="sticky top-[calc(var(--header-height,4rem)+1rem)] flex max-h-[calc(100vh-var(--header-height,4rem)-2rem)] flex-col overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
                        <div class="border-b border-base-300 p-4 pr-12">
                            <button
                                type="button"
                                class="btn btn-sm btn-circle absolute right-3 top-3"
                                :aria-label="`${$t('close')} ${$t('workNavigation')}`"
                                :title="`${$t('close')} ${$t('workNavigation')}`"
                                @click="setWorkNavigationVisible(false)"
                            >
                                <Icon name="tabler:x" aria-hidden="true" />
                            </button>
                            <p class="text-xs font-medium uppercase text-base-content/60">{{ $t('workNavigation') }}</p>
                            <p class="mt-2 line-clamp-2 text-sm font-semibold">
                                {{ mir?.has_primary_title?.has_name ?? dataObject?.compound_record?._source?.handle }}
                            </p>
                        </div>
                        <nav id="work-navigation-desktop-menu" :aria-label="$t('workNavigation')" class="min-h-0 flex-1 overflow-y-auto p-2">
                            <ol class="menu work-section-menu w-full p-0">
                                <li v-if="workVariantNavigationItems.length" class="work-section-menu-group-label">
                                    <span>{{ $t('avefi_WorkVariant') }}</span>
                                </li>
                                <li v-for="item in workVariantNavigationItems" :key="item.id">
                                    <button
                                        type="button"
                                        class="work-section-menu-item"
                                        :class="{ 'is-active': isNavigationItemActive(item), 'work-section-menu-item--work': item.kind === 'work' }"
                                        :aria-current="isNavigationItemActive(item) ? 'location' : undefined"
                                        @click="scrollToId(item.id)"
                                    >
                                        <span class="work-section-menu-marker" aria-hidden="true">
                                            <Icon :name="item.icon" class="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        <span class="min-w-0 flex-1">
                                            <span class="block truncate">{{ item.label }}</span>
                                            <span v-if="item.description" class="block truncate text-xs text-base-content/60">
                                                {{ item.description }}
                                            </span>
                                        </span>
                                        <span v-if="typeof item.count === 'number'" class="badge badge-sm badge-outline">
                                            {{ item.count }}
                                        </span>
                                    </button>
                                </li>
                                <li v-if="collectionNavigationItems.length" class="work-section-menu-separator" aria-hidden="true"></li>
                                <li v-for="item in collectionNavigationItems" :key="item.id">
                                    <button
                                        type="button"
                                        class="work-section-menu-item"
                                        :class="{ 'is-active': isNavigationItemActive(item) }"
                                        :aria-current="isNavigationItemActive(item) ? 'location' : undefined"
                                        @click="scrollToId(item.id)"
                                    >
                                        <span class="work-section-menu-marker" aria-hidden="true">
                                            <Icon :name="item.icon" class="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        <span class="min-w-0 flex-1">
                                            <span class="block truncate">{{ item.label }}</span>
                                            <span v-if="item.description" class="block truncate text-xs text-base-content/60">
                                                {{ item.description }}
                                            </span>
                                        </span>
                                        <span v-if="typeof item.count === 'number'" class="badge badge-sm badge-outline">
                                            {{ item.count }}
                                        </span>
                                    </button>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </aside>
            </transition>

            <!-- Main content (right) -->
            <div class="min-w-0 flex-1">
                <section v-if="mir"
                         :id="dataObject?.compound_record?._source?.handle || undefined"
                         class="border-l-2 border-work pl-3 pr-1 lg:pl-4"
                         :aria-labelledby="'work-details-heading'">
                    <h2 id="work-details-heading" class="sr-only">
                        {{ `${$t('detailsFor')} ${mir?.has_primary_title?.has_name ?? ''}` }}
                    </h2>
                    <!-- MOBILE-ONLY TOGGLE (does not affect desktop) -->
                    <div class="md:hidden mb-2">
                        <button type="button" class="btn btn-lg btn-outline w-full justify-between"
                                :aria-expanded="mirExpanded ? 'true' : 'false'" :aria-controls="mirPanelId"
                                @click="mirExpanded = !mirExpanded">
                            <span class="truncate text-sm">
                                {{ $t('detailsFor') }} {{ mir?.has_primary_title?.has_name ?? '' }}
                            </span>
                            <span v-if="mirExpanded" :title="$t('collapse')">
                                <Icon name="tabler-chevron-up" aria-hidden="true" />
                            </span>
                            <span v-else :title="$t('expand')">
                                <Icon name="tabler-chevron-down" aria-hidden="true" />
                            </span>
                        </button>
                    </div>

                    <!-- ONLY THIS CONTENT COLLAPSES ON MOBILE -->
                    <div :id="mirPanelId" v-show="!isMobile || mirExpanded">
                        <!-- ✅ REAL DOM ANCHOR (template slot cannot carry an id) -->
                        <div class="hidden lg:flex mb-3">
                            <button
                                type="button"
                                class="work-navigation-toggle btn btn-sm btn-outline"
                                :aria-label="$t('toggleNavigation')"
                                :title="$t('toggleNavigation')"
                                :aria-expanded="desktopDrawerOpen ? 'true' : 'false'"
                                aria-controls="work-navigation-desktop-menu"
                                @click="setWorkNavigationVisible(!desktopDrawerOpen)"
                            >
                                <Icon :name="desktopDrawerOpen ? 'tabler:layout-sidebar-left-collapse' : 'tabler:layout-sidebar-left-expand'" class="h-4 w-4" aria-hidden="true" />
                                <span>{{ $t('workNavigation') }}</span>
                            </button>
                        </div>
                        <div class="work-detail-content-grid">
                            <div class="min-w-0">
                                <!-- 01–04 + 06–09: handled inside TopLevelComp -->
                                <DetailWorkVariantTopLevelComp v-model="mir"
                                                               :handle="dataObject?.compound_record?._source?.handle ?? ''"
                                                               :es-timestamp="String(dataObject?.compound_record?._source?.['@timestamp'] ?? '')"
                                                               :order-key="'08-06-2025'" :hide-second-handle="true"
                                                               :swap-years-and-places="true" />
                                <!-- 05 Produktions-Events -->
                                <DetailHasEventComp v-if="Array.isArray(mir?.has_event) && mir.has_event.length > 0"
                                                    v-model="mir.has_event"
                                                    root-id="work-events"
                                                    :event-ids="mir.has_event.map((_, idx) => `event-${idx}`)" />

                            </div>

                            <div class="work-detail-side-rail min-w-0">
                                <!-- 03/04 References & Work Relations (GND, Filmportal, etc. / same_as, is_part_of) -->
                                <div
                                    v-if="hasReferencesAndWorkRelations"
                                    class="mb-2 grid grid-cols-1 gap-3 rounded-lg border border-base-300 p-4"
                                    role="region"
                                    :aria-label="$t('referencesAndWorkRelations')"
                                >
                                    <header class="flex flex-col gap-1">
                                        <h3 id="references-work-relations" class="text-base font-semibold leading-6 truncate dark:text-white">
                                            {{ $t('referencesAndWorkRelations') }}
                                        </h3>
                                    </header>

                                    <div
                                        v-if="workSameAs.length"
                                        class="rounded-md p-2"
                                        role="region"
                                        :aria-label="`${$t('same_as')}`"
                                    >
                                        <div
                                            v-for="sas in workSameAs"
                                            :key="sas?.id"
                                            role="group"
                                            :aria-label="`${$t('same_as')} ${$t(sas?.category)}`"
                                        >
                                            <DetailKeyValueComp
                                                :keytxt="sas?.category"
                                                :valtxt="sas?.id"
                                                :same-as="true"
                                                :show-same-as-link="true"
                                                :clip="false"
                                                font-size="text-sm"
                                                :translate-key="true"
                                                :truncate="true"
                                            />
                                        </div>
                                    </div>

                                    <!-- (Optional) Episode/Teil-Indikator? -> is_part_of -->
                                    <div
                                        v-if="workIsPartOf.length"
                                        role="region"
                                        :aria-label="$t('isPartOf')"
                                    >
                                        <MicroLabelComp label-text="isPartOf" />
                                        <ul>
                                            <li v-for="ipo in workIsPartOf" :key="ipo?.id" class="min-w-0">
                                                <router-link
                                                    target="_blank"
                                                    rel="noopener"
                                                    :to="`/res/${(ipo?.id || '')}`"
                                                    class="link link-primary block truncate"
                                                    :title="`${ipo?.id} (${ $t(ipo?.category) })`"
                                                    :aria-label="`${ipo?.id} (${ $t(ipo?.category) })`"
                                                >
                                                    {{ ipo?.id }}&nbsp;({{ $t(ipo?.category) }})
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- 05 Alternative Titel -->
                                <div
                                    v-if="Array.isArray(mir?.has_alternative_title) && mir.has_alternative_title.length"
                                    id="alternative-titles"
                                    class="mb-2 grid grid-cols-1 gap-3 rounded-lg border border-base-300 p-4"
                                    role="region"
                                    :aria-label="$t('AlternativeTitles')"
                                >
                                    <DetailKeyActionRowsComp
                                        :key-label="$t('AlternativeTitles')"
                                        :values="mir.has_alternative_title"
                                        same-as-type="work"
                                        :show-count="true"
                                        :initial-visible="6"
                                    />
                                </div>

                                <!-- 10 Genre -->
                                <div
                                    v-if="hasGenre"
                                    id="genre"
                                    class="mb-2 grid grid-cols-1 gap-3 rounded-lg border border-base-300 p-4"
                                    role="region"
                                    :aria-label="$t('avefi:Genre')"
                                >
                                    <DetailKeyActionRowsComp
                                        :key-label="$t('avefi:Genre')" :values="mir.has_genre"
                                        same-as-type="genre" facet-attribute="has_genre_has_name"
                                        :show-count="true" :initial-visible="6" />
                                </div>

                                <!-- 11 Schlagwort -->
                                <div
                                    v-if="hasSubjects"
                                    id="subjects"
                                    class="mb-2 grid grid-cols-1 gap-3 rounded-lg border border-base-300 p-4"
                                    role="region"
                                    :aria-label="$t('avefi:Subject')"
                                >
                                    <DetailKeyActionRowsComp
                                        :key-label="$t('avefi:Subject')" :values="workSubjects"
                                        same-as-type="subject" facet-attribute="subjects"
                                        :show-count="true" :initial-visible="8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div v-else>
                    <pre>{{ mir }}</pre>
                </div>

                <!-- Manifestations and film-related materials block -->
                <section v-if="hasCollectionTabs" id="manifestations" aria-labelledby="collection-tabs-heading">
                    <div class="mt-4 ml-2">
                        <hr class="my-2 col-span-full" />
                        <h3 id="collection-tabs-heading" class="sr-only">
                            {{ $t('manifestationsAndFilmRelatedMaterials') }}
                        </h3>

                        <div
                            class="tabs tabs-lift"
                            role="tablist"
                            :aria-label="$t('manifestationsAndFilmRelatedMaterials')"
                        >
                            <input
                                v-if="manifestations.length > 0"
                                id="manifestations-tab"
                                v-model="activeDetailTab"
                                type="radio"
                                name="work-detail-tabs"
                                value="manifestations"
                                role="tab"
                                class="tab"
                                :aria-label="`${$t('manifestations')} (${manifestations.length})`"
                                aria-controls="manifestations-panel"
                                @click="setDetailTab('manifestations')"
                                @change="setDetailTab('manifestations')"
                            />

                            <div
                                v-if="manifestations.length > 0"
                                id="manifestations-panel"
                                class="tab-content border-base-300 bg-base-100 p-4"
                                role="tabpanel"
                                aria-labelledby="manifestations-tab"
                            >
                                <header class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 id="manifestations-heading" class="text-base font-semibold leading-6 dark:text-white">
                                            {{ $t("manifestations") }}
                                        </h3>
                                        <p class="mt-1 text-sm text-base-content/70">
                                            {{ $t('tooltip.manifestation') }}
                                        </p>
                                    </div>
                                </header>

                                <div class="mt-4 flex flex-col gap-3">
                                    <div class="form-control min-w-0">
                                        <span class="label pb-1">
                                            <span class="label-text text-xs">{{ $t('viewType') }}</span>
                                        </span>
                                        <div class="join w-full">
                                            <button
                                                type="button"
                                                class="btn btn-sm join-item flex-1"
                                                :class="filterDropdownViewMode === 'list' ? 'btn-primary' : 'btn-outline'"
                                                :aria-pressed="filterDropdownViewMode === 'list' ? 'true' : 'false'"
                                                @click="setFilterDropdownViewMode('list')"
                                            >
                                                {{ $t('filterViewList') }}
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-sm join-item flex-1"
                                                :class="filterDropdownViewMode === 'badges' ? 'btn-primary' : 'btn-outline'"
                                                :aria-pressed="filterDropdownViewMode === 'badges' ? 'true' : 'false'"
                                                @click="setFilterDropdownViewMode('badges')"
                                            >
                                                {{ $t('filterViewBadges') }}
                                            </button>
                                        </div>
                                    </div>

                                    <div class="form-control min-w-0">
                                        <span class="label pb-1">
                                            <span class="label-text text-xs">{{ $t('filterItemsAndManifestations') }}</span>
                                        </span>

                                        <!-- Dropdown mode -->
                                        <div v-if="filterDropdownViewMode === 'list'" class="relative min-w-0" ref="filterDropdownRef">
                                            <button
                                                type="button"
                                                class="btn btn-outline w-full justify-between"
                                                :aria-label="$t('filterItemsAndManifestations')"
                                                :aria-expanded="filterDropdownOpen ? 'true' : 'false'"
                                                aria-haspopup="listbox"
                                                @click="filterDropdownOpen = !filterDropdownOpen"
                                            >
                                                <span class="truncate">
                                                    {{
                                                        searchQuery.length > 0
                                                            ? `${$t('filterItemsAndManifestations')} (${searchQuery.length})`
                                                            : $t('filterItemsAndManifestations')
                                                    }}
                                                </span>
                                                <Icon
                                                    :name="filterDropdownOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'"
                                                    aria-hidden="true"
                                                />
                                            </button>

                                            <div
                                                v-if="filterDropdownOpen"
                                                class="absolute z-20 mt-1 w-full rounded-md border border-base-300 bg-base-100 shadow-lg"
                                            >
                                                <div class="max-h-72 flex flex-col overflow-auto p-2">
                                                    <label
                                                        v-for="suggestion in suggestionsForManifestations"
                                                        :key="suggestion"
                                                        class="label cursor-pointer justify-start gap-3 py-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            class="checkbox checkbox-sm"
                                                            :checked="searchQuery.includes(suggestion)"
                                                            @change="toggleSuggestion(suggestion)"
                                                        />
                                                        <Icon :name="suggestionIconName(suggestion)" class="icon-inline text-primary" aria-hidden="true" />
                                                        <span class="label-text">
                                                            {{ $t(suggestion) !== suggestion ? $t(suggestion) : suggestion }}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Badge mode (standalone, not inside dropdown) -->
                                        <div v-else class="rounded-md border border-base-300 bg-base-100 p-1.5 relative">
                                            <div class="overflow-x-auto overflow-y-hidden py-2 pr-14">
                                                <div class="flex flex-nowrap items-center gap-1 min-w-max">
                                                    <button
                                                        v-for="suggestion in suggestionsForManifestations"
                                                        :key="suggestion"
                                                        type="button"
                                                        class="badge badge-outline h-7 min-h-0 gap-1 px-1.5 text-xs cursor-pointer shrink-0"
                                                        :class="searchQuery.includes(suggestion) ? 'badge-primary' : ''"
                                                        :aria-pressed="searchQuery.includes(suggestion) ? 'true' : 'false'"
                                                        :title="$t(suggestion) !== suggestion ? $t(suggestion) : suggestion"
                                                        @click="toggleSuggestion(suggestion)"
                                                    >
                                                        <Icon :name="suggestionIconName(suggestion)" class="w-3 h-3" aria-hidden="true" />
                                                        <span class="truncate max-w-32 leading-tight">
                                                            {{ $t(suggestion) !== suggestion ? $t(suggestion) : suggestion }}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-base-100 to-transparent"></div>
                                            <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide text-base-content/60">
                                                {{ $t('filterScrollForMore') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                                    <div v-if="searchQuery.length > 0" class="flex flex-wrap gap-1" :aria-label="$t('selectedFilters')">
                                        <span v-for="selected in searchQuery" :key="selected" class="badge badge-outline gap-1">
                                            <Icon :name="suggestionIconName(selected)" class="w-3.5 h-3.5" aria-hidden="true" />
                                            {{ $t(selected) !== selected ? $t(selected) : selected }}
                                            <button
                                                type="button"
                                                class="btn btn-ghost btn-xs px-1 min-h-0 h-auto"
                                                :aria-label="`${$t('remove')}: ${selected}`"
                                                @click="removeSuggestion(selected)"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    </div>
                                    <p class="ml-auto text-sm text-base-content/70" role="status">
                                        {{ filteredManifestations.length }} {{ $t('results') }}
                                    </p>
                                </div>

                                <ClientOnly>
                                    <div v-if="loading" class="flex justify-center items-center min-h-30">
                                        <span class="loading loading-spinner loading-lg text-primary" />
                                    </div>
                                    <div
                                        v-else-if="filteredManifestations.length === 0"
                                        class="alert alert-info mt-3"
                                        role="status"
                                        :aria-label="$t('noResults')"
                                    >
                                        <div>
                                            <p class="font-semibold">{{ $t('noResults') }}</p>
                                            <p class="text-sm">{{ $t('tryClearingFiltersOrQuery') }}</p>
                                        </div>
                                    </div>
                                    <DetailManifestationListComp v-else v-model="filteredManifestations" />
                                </ClientOnly>
                            </div>

                            <input
                                v-if="hasFilmRelatedMaterials"
                                id="film-related-materials-tab"
                                v-model="activeDetailTab"
                                type="radio"
                                name="work-detail-tabs"
                                value="filmRelatedMaterials"
                                role="tab"
                                class="tab"
                                :aria-label="`${$t('filmRelatedMaterials')} (${filmRelatedMaterialCount})`"
                                aria-controls="film-related-materials-panel"
                                @click="setDetailTab('filmRelatedMaterials')"
                                @change="setDetailTab('filmRelatedMaterials')"
                            />

                            <div
                                v-if="hasFilmRelatedMaterials"
                                id="film-related-materials-panel"
                                class="tab-content border-base-300 bg-base-100 p-4"
                                role="tabpanel"
                                aria-labelledby="film-related-materials-tab"
                            >
                                <DetailFilmRelatedMaterialsComp :work-variant-id="workVariantHandle" />
                            </div>
                        </div>
                    </div>
                </section>

                <div v-else-if="parts">
                    <ViewsWorkViewCompParts class="mt-4" :parts="parts"
                                            :handle="dataObject?.compound_record?._source?.handle" />
                </div>

                <div v-else class="ml-2 alert alert-warning alert-outline text-white max-w-96 mt-4" role="alert"
                     :aria-label="$t('noManifestations')">
                    <MicroIconTextComp icon-name="tabler:mood-empty" text="noManifestations" />
                </div>

                <!-- 12 Letzte Bearbeitung -->
                <div v-if="dataObject?.compound_record?._source?.['@timestamp']" id="last-edit" class="w-full mt-4 justify-center items-center">
                    <DetailKeyValueComp class="col-span-full mx-auto" keytxt="lastedit" :clip="false"
                                        :valtxt="formatTimestamp(dataObject.compound_record._source['@timestamp'])" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import type { IAVefiManifestation } from "~/models/interfaces/generated/IAVefiManifestation";
import type { IAVefiItem } from "~/models/interfaces/generated/IAVefiItem";
import type {
    WorkVariant,
    Event as AVefiEvent,
    Activity,
    AuthorityResource,
    MovingImageResource,
    GeographicName,
    Subject,
} from "~/models/interfaces/schema/avefi_schema_type_utils";
import type { Part } from './WorkViewCompParts.vue';
import { useFormKitLoader } from '~/composables/useFormKitLoader';
import { useLocalizedPlaceLabel } from '~/composables/useLocalizedPlaceLabel';
import { getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping';
import { getFilmRelatedMaterialCountForWork } from '~/composables/useFilmRelatedMaterials';
import { patchUserPreferences, readUserPreferences } from '~/utils/userPreferences';

const { ensureFormKitReady } = useFormKitLoader();
const { t } = useI18n();
const { getLocalizedPlaceLabel } = useLocalizedPlaceLabel();

await ensureFormKitReady();

// Enable hash navigation for manifestations and items
useHash();

// Generated interfaces are missing the nested collection field the ES response
// actually returns, so it's added back on here rather than hand-modelling the wrapper.
type Item = IAVefiItem;
type Manifestation = IAVefiManifestation & { items?: Item[] };
// Base Event doesn't carry `type` — only its subclasses (ProductionEvent etc.) do —
// but has_event is stored as plain Event[], so widen it rather than importing every subtype.
type Event = AVefiEvent & { type?: string };
type DetailTab = 'manifestations' | 'filmRelatedMaterials';
type WorkNavigationItem = {
    id: string;
    label: string;
    icon: string;
    count?: number;
    description?: string;
    kind: 'work' | 'collection';
};
type WorkContextRow = {
    key: string;
    label: string;
    value: string;
    icon: string;
};
interface NormalizedEvent {
    raw: Event;
    crew: Activity[];
    cast: Activity[];
    hasMeta: boolean;
    showType: boolean;
}

const desktopDrawerOpen = ref(true);
const props = defineProps({
    handle: {
        type: String,
        default: '',
    },
    requestedHandle: {
        type: String,
        default: '',
    },
    enableFilmrelated: {
        type: Boolean,
        default: false,
    }
});

const dataJson = defineModel({ type: Object, required: true });

// Shape of the ES compound-record wrapper this component actually reads; the
// generated IAVefiWorkVariant is missing `manifestations`, so this is hand-modelled
// against real usage instead.
interface WorkVariantSource {
    handle?: string;
    creators?: string[];
    directors_or_editors?: string[];
    '@timestamp'?: number;
    has_record?: WorkVariant;
    parts?: Part[];
    manifestations?: Manifestation[];
}
interface DataObject {
    handle?: string;
    compound_record?: {
        _source?: WorkVariantSource;
    };
}

// Defensive parse
let dataObject: DataObject = {};
try {
    dataObject = (dataJson.value ?? {}) as DataObject;
} catch {
    dataObject = {};
}

// WorkVariant (optional)
const mir = (dataObject?.compound_record?._source?.has_record ?? null) as WorkVariant | null;
// Array of sibling work-variant parts (e.g. episodes of a serial)
const parts = dataObject?.compound_record?._source?.parts ?? null;

// Manifestations (optional)
const manifestations = ref<Manifestation[]>(
    Array.isArray(dataObject?.compound_record?._source?.manifestations)
        ? dataObject.compound_record._source.manifestations
        : []
);

const workVariantHandle = computed(() =>
    String(dataObject?.compound_record?._source?.handle || props.handle || '')
);

const filmRelatedMaterialCount = computed(() =>
    props.enableFilmrelated ? getFilmRelatedMaterialCountForWork(workVariantHandle.value) : 0
);

const hasFilmRelatedMaterials = computed(() => filmRelatedMaterialCount.value > 0);

const totalItemCount = computed(() =>
    manifestations.value.reduce(
        (count, manifestation) => count + (Array.isArray(manifestation?.items) ? manifestation.items.length : 0),
        0
    )
);

const hasCollectionTabs = computed(() => manifestations.value.length > 0 || hasFilmRelatedMaterials.value);
const activeDetailTab = ref<DetailTab>(manifestations.value.length > 0 ? 'manifestations' : 'filmRelatedMaterials');

function setDetailTab(tab: DetailTab) {
    activeDetailTab.value = tab;
    if (tab === 'manifestations') activeSection.value = 'manifestations';
    if (tab === 'filmRelatedMaterials') activeSection.value = 'film-related-materials';
    pinActiveSection();
}

// --- Dynamic search state (manifestation / item filter) ---
const searchQuery = ref<string[]>([]);
const filterDropdownOpen = ref(false);
const filterDropdownRef = ref<HTMLElement | null>(null);
const filterDropdownViewMode = ref<'list' | 'badges'>('list');
const loading = ref(false);
let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

function setWorkNavigationVisible(visible: boolean) {
    desktopDrawerOpen.value = visible;
    patchUserPreferences({ workDetail: { navigationVisible: visible } });
}

function setFilterDropdownViewMode(mode: 'list' | 'badges') {
    filterDropdownViewMode.value = mode;
    if (mode === 'badges') {
        filterDropdownOpen.value = false;
    }

    patchUserPreferences({ workDetail: { filterDropdownViewMode: mode } });
}

function triggerLoading() {
    loading.value = true;

    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
    }

    loadingTimeout = setTimeout(() => {
        loading.value = false;
        loadingTimeout = null;
    }, 600);
}

function onSearchInput(val: string | string[]) {
    searchQuery.value = Array.isArray(val) ? val : val ? [val] : [];
    triggerLoading();
}

function toggleSuggestion(suggestion: string) {
    const next = searchQuery.value.includes(suggestion)
        ? searchQuery.value.filter(value => value !== suggestion)
        : [...searchQuery.value, suggestion];

    onSearchInput(next);
}

function removeSuggestion(suggestion: string) {
    searchQuery.value = searchQuery.value.filter(value => value !== suggestion);
    onSearchInput(searchQuery.value);
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!filterDropdownRef.value || !target) return;

    if (!filterDropdownRef.value.contains(target)) {
        filterDropdownOpen.value = false;
    }
}

// --- SEARCH / FACET WHITELIST ---
// Important: paths are relative to the current object passed in.
// manifestationLevelValues(mf) receives a manifestation object.
// itemLevelValues(item) receives an item object.

const MANIFESTATION_SEARCH_FIELDS = [
    "has_record.described_by.has_issuer_name",
    "has_record.is_manifestation_of",
    "has_record.has_event.type",
    "has_record.has_event.category",
];

const ITEM_SEARCH_FIELDS = [
    "has_record.has_access_status",
    "has_record.has_format.type",
    "has_record.has_colour_type",
    "has_record.has_sound_type",
    "has_record.in_language.code",
    "has_record.element_type",
];

const FIELD_ICON_KEY: Record<string, string> = {
    'has_record.described_by.has_issuer_name': 'has_issuer_name',
    'has_record.is_manifestation_of': 'episode',
    'has_record.has_event.type': 'manifestation_event_type',
    'has_record.has_event.category': 'manifestation_event_type',
    'has_record.has_access_status': 'has_access_status',
    'has_record.has_format.type': 'has_format_type',
    'has_record.has_colour_type': 'has_colour_type',
    'has_record.has_sound_type': 'has_sound_type',
    'has_record.in_language.code': 'in_language_code',
    'has_record.element_type': 'item_element_type',
};

// Recursive shape for values pulled out of the dotted-path walk below.
type PathValue = string | number | boolean | null | undefined | PathValue[] | { [key: string]: PathValue };

// obj takes `unknown` (not PathValue) because our schema types (Manifestation, Item, ...)
// are nominal interfaces: TS won't assign them to an index-signature type like PathValue
// even though they're structurally JSON-like data, so this stays intentionally untyped
// at the boundary and narrows internally instead.
function get(obj: unknown, path: string): PathValue {
    if (!obj || !path) return undefined;
    const parts = path.split(".");
    let current: unknown = obj;

    for (let i = 0; i < parts.length; i++) {
        if (current == null) return undefined;
        const part = parts[i];
        if (part === undefined) return undefined;

        if (Array.isArray(current)) {
            const rest = parts.slice(i).join(".");
            return current.flatMap((el) => get(el, rest));
        }
        if (typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return current as PathValue;
}

function pushValue(arr: string[], v: PathValue) {
    if (v === null || v === undefined) return;

    if (Array.isArray(v)) {
        for (const x of v) pushValue(arr, x);
    } else if (typeof v === "object") {
        if (typeof v.code === "string" && v.code) arr.push(v.code);
        if (typeof v.type === "string" && v.type) arr.push(v.type);
    } else {
        const s = String(v);
        if (s !== "") arr.push(s);
    }
}

function dedupeValues(values: string[]) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of values) {
        const trimmed = s.trim();
        if (!trimmed) continue;
        const k = trimmed.toLowerCase();
        if (!seen.has(k)) {
            seen.add(k);
            out.push(trimmed);
        }
    }
    return out;
}

function manifestationLevelValues(mf: Manifestation): string[] {
    const vals: string[] = [];
    for (const p of MANIFESTATION_SEARCH_FIELDS) {
        pushValue(vals, get(mf, p));
    }
    return dedupeValues(vals);
}

function itemLevelValues(item: Item): string[] {
    const vals: string[] = [];
    for (const p of ITEM_SEARCH_FIELDS) {
        pushValue(vals, get(item, p));
    }
    return dedupeValues(vals);
}

function valuesForManifestation(mf: Manifestation): string[] {
    const manifestationValues = manifestationLevelValues(mf);
    const itemValues = (Array.isArray(mf?.items) ? mf.items : []).flatMap((item: Item) => itemLevelValues(item));
    return dedupeValues([...manifestationValues, ...itemValues]);
}

function valuesForPath(obj: unknown, path: string): string[] {
    const vals: string[] = [];
    pushValue(vals, get(obj, path));
    return dedupeValues(vals);
}

function queryScope(q: string) {
    let matchesManifestation = false;
    let matchesItem = false;

    for (const mf of manifestations.value) {
        if (!matchesManifestation && manifestationLevelValues(mf).includes(q)) {
            matchesManifestation = true;
        }

        if (!matchesItem) {
            const items = Array.isArray(mf?.items) ? mf.items : [];
            if (items.some((item: Item) => itemLevelValues(item).includes(q))) {
                matchesItem = true;
            }
        }

        if (matchesManifestation && matchesItem) break;
    }

    return {
        manifestation: matchesManifestation,
        item: matchesItem,
    };
}

function translatedFacetLabel(value: string) {
    return t(value) !== value ? t(value) : value;
}

const suggestionsForManifestations = computed(() => {
    const set = new Set<string>();

    for (const mf of manifestations.value) {
        for (const v of valuesForManifestation(mf)) {
            const trimmed = v.trim();
            if (!trimmed) continue;
            set.add(trimmed);
            if (set.size >= 100) break;
        }
        if (set.size >= 100) break;
    }

    return Array.from(set)
        .sort((a, b) =>
            translatedFacetLabel(a).localeCompare(
                translatedFacetLabel(b),
                undefined,
                { sensitivity: "base" }
            )
        )
        .slice(0, 100);
});

const suggestionIconMap = computed(() => {
    const sourceMap = new Map<string, Set<string>>();

    for (const mf of manifestations.value) {
        for (const path of MANIFESTATION_SEARCH_FIELDS) {
            const iconKey = FIELD_ICON_KEY[path];
            const values = valuesForPath(mf, path);
            for (const value of values) {
                if (!sourceMap.has(value)) sourceMap.set(value, new Set<string>());
                if (iconKey) sourceMap.get(value)?.add(iconKey);
            }
        }

        const items = Array.isArray(mf?.items) ? mf.items : [];
        for (const item of items) {
            for (const path of ITEM_SEARCH_FIELDS) {
                const iconKey = FIELD_ICON_KEY[path];
                const values = valuesForPath(item, path);
                for (const value of values) {
                    if (!sourceMap.has(value)) sourceMap.set(value, new Set<string>());
                    if (iconKey) sourceMap.get(value)?.add(iconKey);
                }
            }
        }
    }

    return sourceMap;
});

function suggestionIconName(suggestion: string) {
    const iconKeys = suggestionIconMap.value.get(suggestion);
    const firstIconKey = iconKeys ? Array.from(iconKeys)[0] : undefined;
    if (firstIconKey) {
        return getFacetIcon(firstIconKey, 'tabler-filter');
    }

    const scope = queryScope(suggestion);
    if (scope.item && !scope.manifestation) return 'tabler-stack-3';
    if (scope.manifestation && !scope.item) return 'tabler-stack-2';
    return 'tabler-filter';
}

const filteredManifestations = computed<Manifestation[]>(() => {
    const selected = searchQuery.value;

    if (!Array.isArray(selected) || selected.length === 0) {
        return manifestations.value;
    }

    const manifestationQueries = selected.filter((q) => {
        const scope = queryScope(q);
        return scope.manifestation;
    });

    const itemQueries = selected.filter((q) => {
        const scope = queryScope(q);
        return scope.item && !scope.manifestation;
    });

    return manifestations.value
        .map((mf): Manifestation | null => {
            const manifestationValues = manifestationLevelValues(mf);
            const items = Array.isArray(mf.items) ? mf.items : [];
            const hasManifestationMatch = manifestationQueries.every((q) =>
                manifestationValues.includes(q)
            );

            if (!hasManifestationMatch) {
                return null;
            }

            if (itemQueries.length === 0) {
                return { ...mf, items };
            }

            const filteredItems = items.filter((item: Item) => {
                const itemValues = itemLevelValues(item);
                return itemQueries.every((q) => itemValues.includes(q));
            });

            if (filteredItems.length > 0) {
                return { ...mf, items: filteredItems };
            }

            return null;
        })
        .filter((mf): mf is Manifestation => mf !== null);
});

// helpers
function formatTimestamp(ts: string | number): string {
    try {
        const d = new Date(ts);
        return isNaN(d.getTime()) ? "" : d.toLocaleString("de-DE");
    } catch {
        return "";
    }
}

// Mobile collapse state
const mirExpanded = ref(false);
const mirPanelId = "mir-panel";

// Make isMobile reactive
const isMobile = ref(false);
let mediaQuery: MediaQueryList | null = null;
let mediaListener: ((e: MediaQueryListEvent) => void) | null = null;
const navbarSummaryTop = ref('var(--header-height)');
let navbarResizeObserver: ResizeObserver | null = null;

// Drawer + active section
const drawerOpen = ref(false);
const activeSection = ref("");

const workSameAs = computed<AuthorityResource[]>(() => Array.isArray(mir?.same_as) ? mir.same_as : []);
const workIsPartOf = computed<MovingImageResource[]>(() => Array.isArray(mir?.is_part_of) ? mir.is_part_of : []);

const hasReferencesAndWorkRelations = computed(() =>
    workSameAs.value.length > 0 || workIsPartOf.value.length > 0
);

const hasAlternativeTitles = computed(() =>
    Array.isArray(mir?.has_alternative_title) && mir.has_alternative_title.length > 0
);
const hasGenre = computed(() => Array.isArray(mir?.has_genre) && mir.has_genre.length > 0);
const hasSubjects = computed(() => Array.isArray(mir?.has_subject) && mir.has_subject.length > 0);
// WorkVariant.has_subject is generated as CategorizedThing[] (just { category }), but real
// records carry the fuller Subject shape (has_name, same_as, ...) that DetailKeyActionRowsComp needs.
const workSubjects = computed<Subject[]>(() => (mir?.has_subject ?? []) as Subject[]);

// Build the exact list of IDs that actually exist in the DOM (based on FILTERED data)
const sectionIds = computed<string[]>(() => {
    const ids: string[] = [];

    if (hasReferencesAndWorkRelations.value) ids.push("references-work-relations");
    if (hasWorkEvents.value) ids.push("work-events");
    if (hasAlternativeTitles.value) ids.push("alternative-titles");
    if (hasGenre.value) ids.push("genre");
    if (hasSubjects.value) ids.push("subjects");
    if (manifestations.value.length > 0) ids.push("manifestations");
    if (hasFilmRelatedMaterials.value) ids.push("film-related-materials");

    for (let idx = 0; idx < filteredManifestations.value.length; idx++) {
        const mf = filteredManifestations.value[idx];
        if (!mf) continue;
        ids.push(getManifestationAnchorId(mf, idx));

        const items = Array.isArray(mf?.items) ? mf.items : [];
        for (let iidx = 0; iidx < items.length; iidx++) {
            const item = items[iidx];
            if (!item) continue;
            ids.push(getItemAnchorId(item, idx, iidx));
        }
    }

    const events = Array.isArray(mir?.has_event) ? mir.has_event : [];
    for (let eidx = 0; eidx < events.length; eidx++) {
        ids.push(`event-${eidx}`);
    }

    return ids;
});

async function scrollToId(id: string) {
    if (!import.meta.client) return;

    syncDetailTabToId(id);

    await nextTick();

    const target = document.getElementById(id);
    const nextUrl = `${window.location.pathname}${window.location.search}#${id}`;
    activeSection.value = id;
    pinActiveSection(2400);

    if (target) {
        const scrollRoot = document.scrollingElement;
        const absoluteTop = window.scrollY + target.getBoundingClientRect().top;
        const targetTop = Math.max(absoluteTop - window.innerHeight * 0.35, 0);

        if (scrollRoot?.scrollTo) {
            scrollRoot.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    }

    if (window.location.hash === `#${id}`) {
        window.dispatchEvent(new Event('hashchange'));
        return;
    }

    window.history.replaceState(window.history.state, '', nextUrl);
    window.dispatchEvent(new Event('hashchange'));
}

function getManifestationAnchorId(manifestation: Manifestation, index: number) {
    return manifestation?.handle?.trim() || `manifestation-${index}`;
}

function getItemAnchorId(item: Item, manifestationIndex: number, itemIndex: number) {
    return item?.handle?.trim() || `item-${manifestationIndex}-${itemIndex}`;
}

function findTargetIdForRequestedHandle(handle: string) {
    const normalizedHandle = handle.trim();
    if (!normalizedHandle) return '';

    for (let idx = 0; idx < manifestations.value.length; idx++) {
        const manifestation = manifestations.value[idx];
        if (!manifestation) continue;
        if (manifestation.handle === normalizedHandle) {
            return getManifestationAnchorId(manifestation, idx);
        }

        const items = Array.isArray(manifestation.items) ? manifestation.items : [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];
            if (item && item.handle === normalizedHandle) {
                return getItemAnchorId(item, idx, itemIndex);
            }
        }
    }

    return '';
}

function syncHashToRequestedHandle() {
    if (!import.meta.client) return;

    const requestedHandle = props.requestedHandle?.trim();
    const currentWorkHandle = dataObject?.compound_record?._source?.handle?.trim();
    if (!requestedHandle || requestedHandle === currentWorkHandle) return;
    if (window.location.hash) return;

    const targetId = findTargetIdForRequestedHandle(requestedHandle);
    if (!targetId) return;

    const nextUrl = `${window.location.pathname}${window.location.search}#${requestedHandle}`;
    window.history.replaceState(window.history.state, '', nextUrl);
    window.dispatchEvent(new Event('hashchange'));
}

// Robust active section tracking via IntersectionObserver
let observer: IntersectionObserver | null = null;
const visibleMap = new Map<string, number>();
let activeSectionPinnedUntil = 0;

function pinActiveSection(durationMs = 1200) {
    activeSectionPinnedUntil = Date.now() + durationMs;
}

function updateNavbarSummaryTop() {
    if (!import.meta.client) return;

    const header = document.querySelector('header.fixed.top-0') as HTMLElement | null;
    const headerBottom = header?.getBoundingClientRect().bottom;
    navbarSummaryTop.value = typeof headerBottom === 'number' && headerBottom > 0
        ? `${Math.round(headerBottom)}px`
        : 'var(--header-height)';
}

function splitActivities(evt: Event) {
    const activities = Array.isArray(evt?.has_activity) ? evt.has_activity : [];
    const crew: Activity[] = [];
    const cast: Activity[] = [];

    for (const activity of activities) {
        if (!activity) continue;
        if (activity.type === "CastMember") {
            cast.push(activity);
        } else {
            crew.push(activity);
        }
    }

    return { crew, cast };
}

function normalizeEvent(evt: Event): NormalizedEvent {
    const { crew, cast } = splitActivities(evt);
    const showType = !crew.length && !cast.length && Boolean(evt?.type);
    const hasMeta = showType || Boolean(evt?.located_in) || Boolean(evt?.has_date);

    return {
        raw: evt,
        crew,
        cast,
        hasMeta,
        showType,
    };
}

const normalizedEvents = computed<NormalizedEvent[]>(() => {
    const events = Array.isArray(mir?.has_event) ? mir.has_event : [];
    return events.map((evt) => normalizeEvent(evt));
});

const hasWorkEvents = computed(() => normalizedEvents.value.length > 0);
const productionEvent = computed(() => {
    const events = Array.isArray(mir?.has_event) ? mir.has_event : [];
    return events.find((event) => event?.category === 'avefi:ProductionEvent') || events[0] || null;
});

const workProductionPlaces = computed(() => {
    const places = Array.isArray(productionEvent.value?.located_in) ? productionEvent.value.located_in : [];
    return dedupeValues(places.map((place: GeographicName) => getLocalizedPlaceLabel(place)).filter(Boolean));
});

const workProductionYear = computed(() => {
    const value = productionEvent.value?.has_date;
    return typeof value === 'string' ? value.trim() : '';
});

const workDirectors = computed(() => {
    const source = dataObject?.compound_record?._source || {};
    const topLevelDirectors = Array.isArray(source.creators) && source.creators.length
        ? source.creators
        : source.directors_or_editors;

    if (Array.isArray(topLevelDirectors) && topLevelDirectors.length > 0) {
        return dedupeValues(topLevelDirectors.map((director) => String(director || '').trim()).filter(Boolean));
    }

    const directors: string[] = [];
    const events = Array.isArray(mir?.has_event) ? mir.has_event : [];
    for (const event of events) {
        const activities = Array.isArray(event?.has_activity) ? event.has_activity : [];
        for (const activity of activities) {
            if (
                activity?.category === 'avefi:DirectingActivity' &&
                ['Director', 'Creator'].includes(activity?.type) &&
                Array.isArray(activity?.has_agent)
            ) {
                for (const agent of activity.has_agent) {
                    if (agent?.has_name) directors.push(agent.has_name);
                }
            }
        }
    }

    return dedupeValues(directors);
});

const workContextRows = computed<WorkContextRow[]>(() => [
    {
        key: 'place',
        label: t('place'),
        value: workProductionPlaces.value.join(', '),
        icon: 'tabler:map-pin',
    },
    {
        key: 'productionyear',
        label: t('productionyear'),
        value: workProductionYear.value,
        icon: 'tabler:calendar-event',
    },
    {
        key: 'director',
        label: t('directors'),
        value: workDirectors.value.join(', '),
        icon: 'tabler:chair-director',
    },
].filter((row) => row.value));

const workSummaryTitle = computed(() =>
    String(mir?.has_primary_title?.has_name || dataObject?.compound_record?._source?.handle || '').trim()
);

const showNavbarProductionSummary = computed(() => {
    if (!workContextRows.value.length) return false;
    if (!activeSection.value) return false;
    if (activeSection.value === 'references-work-relations') return false;
    if (activeSection.value === 'alternative-titles' || activeSection.value === 'genre' || activeSection.value === 'subjects') return false;
    if (activeSection.value === 'work-events' || activeSection.value.startsWith('event-')) return false;
    return true;
});

const navbarSummaryStyle = computed(() => ({
    top: navbarSummaryTop.value,
}));

const productionNavigationLabel = computed(() => {
    const firstEventCategory = normalizedEvents.value[0]?.raw?.category;
    if (firstEventCategory) return translatedFacetLabel(firstEventCategory);
    return t('workEvents');
});

const workNavigationItems = computed<WorkNavigationItem[]>(() => {
    const items: WorkNavigationItem[] = [];

    if (hasReferencesAndWorkRelations.value) {
        items.push({
            id: 'references-work-relations',
            label: t('referencesAndWorkRelations'),
            icon: 'tabler:link',
            kind: 'work',
        });
    }

    if (hasAlternativeTitles.value) {
        items.push({
            id: 'alternative-titles',
            label: t('AlternativeTitles'),
            icon: 'tabler:language',
            count: mir?.has_alternative_title?.length || undefined,
            kind: 'work',
        });
    }

    if (hasGenre.value) {
        items.push({
            id: 'genre',
            label: t('avefi:Genre'),
            icon: 'tabler:tags',
            kind: 'work',
        });
    }

    if (hasSubjects.value) {
        items.push({
            id: 'subjects',
            label: t('avefi:Subject'),
            icon: 'tabler:tags',
            kind: 'work',
        });
    }

    if (hasWorkEvents.value) {
        items.push({
            id: 'work-events',
            label: productionNavigationLabel.value,
            icon: 'tabler:building-factory',
            count: normalizedEvents.value.length || undefined,
            kind: 'work',
        });
    }

    if (manifestations.value.length > 0) {
        items.push({
            id: 'manifestations',
            label: t('manifestations'),
            icon: 'tabler:stack-2',
            count: manifestations.value.length,
            description: totalItemCount.value ? `${totalItemCount.value} ${t('items')}` : undefined,
            kind: 'collection',
        });
    }

    if (hasFilmRelatedMaterials.value) {
        items.push({
            id: 'film-related-materials',
            label: t('filmRelatedMaterials'),
            icon: 'tabler:archive',
            count: filmRelatedMaterialCount.value,
            kind: 'collection',
        });
    }

    return items;
});

const workVariantNavigationItems = computed(() =>
    workNavigationItems.value.filter((item) => item.kind === 'work')
);

const collectionNavigationItems = computed(() =>
    workNavigationItems.value.filter((item) => item.kind === 'collection')
);

function isManifestationAnchor(id: string): boolean {
    if (id === 'manifestations') return true;

    for (let idx = 0; idx < filteredManifestations.value.length; idx++) {
        const manifestation = filteredManifestations.value[idx];
        if (!manifestation) continue;
        if (getManifestationAnchorId(manifestation, idx) === id) return true;

        const items = Array.isArray(manifestation.items) ? manifestation.items : [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];
            if (item && getItemAnchorId(item, idx, itemIndex) === id) return true;
        }
    }

    return false;
}

function syncDetailTabToId(id: string) {
    if (id === 'film-related-materials' && hasFilmRelatedMaterials.value) {
        activeDetailTab.value = 'filmRelatedMaterials';
        return;
    }

    if (isManifestationAnchor(id) && manifestations.value.length > 0) {
        activeDetailTab.value = 'manifestations';
    }
}

function syncDetailTabToHash() {
    if (!import.meta.client) return;

    const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!hashId) return;

    syncDetailTabToId(hashId);
}

function isNavigationItemActive(item: WorkNavigationItem): boolean {
    if (item.id === 'film-related-materials') {
        return activeSection.value === 'film-related-materials';
    }

    if (item.id === 'manifestations') {
        return isManifestationAnchor(activeSection.value);
    }

    if (item.id === 'work-events') {
        return activeSection.value === 'work-events' || activeSection.value.startsWith('event-');
    }

    return activeSection.value === item.id;
}

function setActiveFromVisibility() {
    if (Date.now() < activeSectionPinnedUntil) return;

    let bestId = "";
    let bestRatio = 0;

    for (const id of sectionIds.value) {
        const ratio = visibleMap.get(id) ?? 0;
        if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
        } else if (ratio === bestRatio && ratio > 0) {
            bestId = id;
        }
    }

    if (bestId) activeSection.value = bestId;
}

async function initObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }

    visibleMap.clear();

    await nextTick();

    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const id = (entry.target as HTMLElement)?.id;
                if (!id) continue;
                visibleMap.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
            }
            setActiveFromVisibility();
        },
        {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
    );

    for (const id of sectionIds.value) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    }

    const currentSection = activeSection.value;
    if (currentSection && document.getElementById(currentSection)) {
        return;
    }

    for (const id of sectionIds.value) {
        if (document.getElementById(id)) {
            activeSection.value = id;
            break;
        }
    }
}

onMounted(() => {
    if (typeof window !== 'undefined') {
        const userPreferences = readUserPreferences();
        desktopDrawerOpen.value = userPreferences.workDetail.navigationVisible;
        filterDropdownViewMode.value = userPreferences.workDetail.filterDropdownViewMode;

        mediaQuery = window.matchMedia("(max-width: 767px)");
        isMobile.value = mediaQuery.matches;

        mediaListener = (e: MediaQueryListEvent) => {
            isMobile.value = e.matches;
        };

        if (mediaQuery.addEventListener) mediaQuery.addEventListener("change", mediaListener);
        else mediaQuery.addListener(mediaListener);

        updateNavbarSummaryTop();
        const header = document.querySelector('header.fixed.top-0') as HTMLElement | null;
        if (header && 'ResizeObserver' in window) {
            navbarResizeObserver = new ResizeObserver(() => updateNavbarSummaryTop());
            navbarResizeObserver.observe(header);
        }
        window.addEventListener('resize', updateNavbarSummaryTop);

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("hashchange", syncDetailTabToHash);
        syncDetailTabToHash();

        initObserver();
        nextTick(() => {
            syncHashToRequestedHandle();
        });
    }
});

watch(
    desktopDrawerOpen,
    (visible) => {
        patchUserPreferences({ workDetail: { navigationVisible: visible } });
    }
);

watch(
    () => sectionIds.value.join("|"),
    async () => {
        if (!process.client) return;
        await initObserver();
        syncHashToRequestedHandle();
    }
);

watch(
    activeDetailTab,
    async () => {
        if (!process.client) return;
        await initObserver();
    }
);

watch(
    [() => manifestations.value.length, hasFilmRelatedMaterials],
    () => {
        if (activeDetailTab.value === 'manifestations' && manifestations.value.length === 0 && hasFilmRelatedMaterials.value) {
            activeDetailTab.value = 'filmRelatedMaterials';
        }

        if (activeDetailTab.value === 'filmRelatedMaterials' && !hasFilmRelatedMaterials.value && manifestations.value.length > 0) {
            activeDetailTab.value = 'manifestations';
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    if (observer) observer.disconnect();
    observer = null;

    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("hashchange", syncDetailTabToHash);

    if (mediaQuery && mediaListener) {
        if (mediaQuery.removeEventListener) mediaQuery.removeEventListener("change", mediaListener);
        else mediaQuery.removeListener(mediaListener);
    }

    if (navbarResizeObserver) {
        navbarResizeObserver.disconnect();
        navbarResizeObserver = null;
    }
    window.removeEventListener('resize', updateNavbarSummaryTop);

    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }
});
</script>

<style scoped>
.work-detail-content-grid {
    display: grid;
    gap: 1rem;
}

.work-detail-side-rail {
    align-self: start;
}

@media (min-width: 1280px) {
    .work-detail-content-grid {
        grid-template-columns: minmax(0, 1fr) minmax(12rem, 16rem);
    }
}

@media (min-width: 1536px) {
    .work-detail-content-grid {
        grid-template-columns: minmax(0, 1fr) minmax(14rem, 18rem);
    }
}

.work-section-menu {
    position: relative;
    display: grid;
    gap: 0.25rem;
    padding-left: 0.25rem;
}

.work-section-menu::before {
    position: absolute;
    bottom: 0.75rem;
    left: 1.25rem;
    top: 0.75rem;
    width: 1px;
    background: color-mix(in oklab, var(--color-base-content) 18%, transparent);
    content: "";
}

.work-section-menu-group-label {
    position: relative;
    z-index: 1;
    margin: 0 0 0.25rem 0.25rem;
    padding: 0.25rem 0.5rem 0.25rem 2.75rem;
    color: color-mix(in oklab, var(--color-work) 82%, var(--color-base-content));
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
}

.work-section-menu-separator {
    position: relative;
    z-index: 1;
    margin: 0.25rem 0 0.25rem 2.75rem;
    height: 1px;
    background: color-mix(in oklab, var(--color-base-content) 14%, transparent);
}

.work-section-menu-item {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 3rem;
    width: 100%;
    align-items: center;
    gap: 0.75rem;
    border-radius: 0.5rem;
    padding: 0.4rem 0.5rem;
    text-align: left;
    text-decoration: none;
    transition: background-color 120ms ease, color 120ms ease;
}

.work-section-menu-item.is-active::before {
    position: absolute;
    bottom: 0.45rem;
    left: 0.15rem;
    top: 0.45rem;
    width: 3px;
    border-radius: 999px;
    background: var(--color-primary);
    content: "";
}

.work-section-menu-item:hover,
.work-section-menu-item:focus-visible {
    background: color-mix(in oklab, var(--color-primary) 10%, transparent);
}

.work-section-menu-item.is-active {
    background: color-mix(in oklab, var(--color-primary) 14%, transparent);
    color: var(--color-primary);
    font-weight: 600;
}

.work-section-menu-item--work {
    margin-left: 0.75rem;
}

.work-section-menu-marker {
    display: grid;
    height: 2rem;
    width: 2rem;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 999px;
    border: 1px solid color-mix(in oklab, var(--color-base-content) 18%, transparent);
    background: var(--color-base-100);
    color: color-mix(in oklab, var(--color-base-content) 70%, transparent);
}

.work-section-menu-item.is-active .work-section-menu-marker {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-primary-content);
}

.work-summary-bar-enter-active,
.work-summary-bar-leave-active {
    transition: opacity 180ms ease, transform 180ms ease;
}

.work-summary-bar-enter-from,
.work-summary-bar-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
}

.work-summary-bar-enter-to,
.work-summary-bar-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.collapse-plus>.collapse-title:after {
    top: 25%;
}

.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
    overflow: hidden;
    transition: width 180ms ease, opacity 180ms ease;
}

.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
    width: 0;
    opacity: 0;
}

.slide-sidebar-enter-to,
.slide-sidebar-leave-from {
    width: 18rem;
    opacity: 1;
}
</style>
