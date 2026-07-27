# `ManifestationListSplitView.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/search/ManifestationListSplitView.vue`
- Matching tests:
  - `tests/unit/components/search-list-view-items.spec.ts`

## Props

- `getFilteredItems`
- `manifestations`
- `refinementSignature`
- `searchUpdateTick`
- `workVariantHandle`

## Emits

_None found by static scan._

## Reactive State

- `currentPage (ref)`
- `itemPage (ref)`
- `itemsContainerKey (computed)`
- `paginatedItems (computed)`
- `paginatedManifestations (computed)`
- `selectedIndex (ref)`
- `selectedManifestation (computed)`
- `selectedManifestationRenderKey (computed)`
- `totalItemPages (computed)`
- `totalPages (computed)`

## Watchers

- 6 watcher call(s): watch

## Functions

- `navigateToItem`
- `nextItemPage`
- `nextPage`
- `prevItemPage`
- `prevPage`
- `triggerScrollToItem`

## Lifecycle Hooks

_None found by static scan._

## Exposed Methods

_None found by static scan._

## Local Imports

- `@/composables/useItemEmpty`

## Template Component Tags

- `GlobalClipboardComp`
- `GlobalTooltipInfo`
- `Icon`
- `LazyMicroBadgeCategoryComp`
- `MicroBadgeCategoryComp`
- `SearchGenericIconList`

## Shared Classes Used

- `icon-inline`
