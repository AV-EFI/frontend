# `InstantSearchTemplateAVefi.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/search/InstantSearchTemplateAVefi.vue`
- Matching tests:
  - `tests/unit/components/instant-search-template.spec.ts`
  - `tests/unit/components/search-section.spec.ts`
  - `tests/unit/source-guards/creators-routing.contract.spec.ts`

## Props

- `indexName`
- `searchClient`

## Emits

_None found by static scan._

## Reactive State

- `currentRefinements (computed)`
- `expandAllChecked (ref)`
- `expandAllHandlesChecked (ref)`
- `forceHideProductionYearChip (ref)`
- `hasProductionYearRefinement (computed)`
- `historyTrigger (ref)`
- `isClearingAllRefinements (ref)`
- `isNonProduction (computed)`
- `isRestoringViewType (ref)`
- `isSearchLoading (ref)`
- `localSearchValue (ref)`
- `productionDetailsChecked (ref)`
- `productionYearLabel (computed)`
- `recentSearchesWithUrl (computed)`
- `searchBackendError (ref)`
- `searchMenuOpen (ref)`
- `searchQuery (ref)`
- `showRecentSearches (ref)`

## Watchers

- 4 watcher call(s): watch

## Functions

- `applySearchQueryValue`
- `clearProductionYearRefinement`
- `convertNumericFiltersToNumericRefinements`
- `createEmptyFacetSearchResult`
- `createEmptySearchResult`
- `createFallbackSearchResponse`
- `emitSearchUpdated`
- `expandAllItems`
- `fetchFacetValueSuggestions`
- `fetchFacetValueSuggestionsForRequest`
- `getFacetSearchAttribute`
- `getProductionYearRefinement`
- `handleClearAllHistory`
- `handleClearAllRefinements`
- `handleClickOutside`
- `handleCurrentRefinementRemove`
- `handlePopState`
- `handleRecentSearchClick`
- `handleRemoveRecentSearch`
- `handleSearchClear`
- `handleSearchQuerySync`
- `handleSearchSubmit`
- `isRecord`
- `isValidSearchResponse`
- `mapFacetAttributeForBackend`
- `mapFacetAttributeForUi`
- `mapFacetFilterForBackend`
- `mapFacetsForBackend`
- `mapRenderingContentForUi`
- `mapSearchResponseForUi`
- `normalizeEmptySearchQuery`
- `normalizeFacetSearchResponse`
- `normalizeFacetSearchResult`
- `normalizeIndexUiState`
- `normalizedJson`
- `notifyRefinementAction`
- `onDocClickForMenu`
- `queryObjectFromUrlSearch`
- `queryTextFromRouteQuery`
- `rewriteInstantSearchRequests`
- `runDeferred`
- `runRefinementAction`
- `shareSearch`
- `suggestSearch`
- `syncInstantSearchStateFromRouteQuery`
- `syncPreservedSliderParamsFromRoute`
- `syncSearchFromUrlState`
- `syncSearchLoading`
- `syncSearchValueFromRouteQuery`
- `toggleSearchMenu`
- `triggerInstantSearchRequest`
- `updateFromStorage`

## Lifecycle Hooks

- `onBeforeUnmount`
- `onMounted`

## Exposed Methods

_None found by static scan._

## Local Imports

- `~/composables/searchRefinementCoordinator`
- `~/composables/useMatomoTracking`
- `~/utils/searchResultCounts`

## Template Component Tags

- `ClientOnly`
- `GlobalFacetDrawer`
- `Icon`
- `MicroContactForm`
- `SearchQueryAutocomplete`

## Shared Classes Used

- `icon-inline`
- `icon-status`
- `btn-icon`
- `btn-danger`
- `btn-danger-outline`
- `panel-surface`
- `filter-chip`

## Preserved Notes From Previous Documentation

## Search Transport

`InstantSearchTemplateAVefi.vue` receives its `searchClient` from the page-level search route. It must not create its own regular-search client internally.

For the public `/search` UI, the page-level client is configured with:

- `runtimeConfig.public.elasticApiBase`
- `runtimeConfig.public.searchApiPath`

In the normal runtime configuration this resolves to `/rest/v1/frontend/search`. The local Nitro endpoints `/api/elastic/msearch` and `/api/elastic/msearch_inst` are not the regular public search path.

If a search crash appears as an Algolia/InstantSearch helper error such as `Cannot read properties of undefined (reading 'slice')`, inspect the actual browser POST response before editing `/api/elastic/msearch`. The expected response contract is a JSON object with a top-level `results` array.

## Backend Response Contract

The backend search response is the source of truth for search facets, facet ordering, and hits.

- Frontend must not silently remove or rewrite domain facet filters (for example issuer filters) to "make things work".
- Frontend may only perform transport-level normalization (for example dropping an empty query string).
- If backend returns an invalid shape or a failing response, frontend must stay interactive, show the warning alert (`searchBackendError`), and return a safe empty fallback result shape.

This behavior is locked by tests:

- `tests/unit/components/instant-search-template.spec.ts`
	- preserves issuer + item-level facet filter requests
	- keeps backend facet ordering and facet buckets unchanged
	- shows warning + fallback on backend failure/invalid payload

- `tests/e2e/smoke/search-backend-error-resilience.spec.ts`
	- backend 500 shows warning
	- search page remains interactive (non-crashing)

## Central Refinement Coordination

Refinement actions are coordinated centrally in `InstantSearchTemplateAVefi.vue` through `searchRefinementCoordinator`.

Action paths covered:

- Panel facet toggle
- Current refinement remove
- Clear-all refinements
- Production-year clear

The coordinator emits `avefi:search-refinement-action` for traceability and shared handling.

Behavior contract test:

- `tests/e2e/smoke/search-refinement-request-flow.spec.ts`
	- panel toggle, active-refinement delete, and clear-all all dispatch centralized refinement actions
