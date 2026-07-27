# `WorkViewCompAVefi.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/views/WorkViewCompAVefi.vue`
- Matching tests:
  - `tests/unit/components/work-view-avefi.spec.ts`

## Props

- `enableFilmrelated`
- `handle`
- `requestedHandle`

## Emits

_None found by static scan._

## Reactive State

- `activeSection (ref)`
- `desktopDrawerOpen (ref)`
- `drawerOpen (ref)`
- `filterDropdownOpen (ref)`
- `hasAlternativeTitles (computed)`
- `hasFilmRelatedMaterials (computed)`
- `hasReferencesAndWorkRelations (computed)`
- `isMobile (ref)`
- `loading (ref)`
- `mirExpanded (ref)`
- `suggestionIconMap (computed)`
- `suggestionsForManifestations (computed)`

## Watchers

- 1 watcher call(s): watch

## Functions

- `dedupeValues`
- `findTargetIdForRequestedHandle`
- `formatTimestamp`
- `get`
- `getItemAnchorId`
- `getManifestationAnchorId`
- `getManifestationMenuLabel`
- `handleClickOutside`
- `initObserver`
- `itemLevelValues`
- `itemValues`
- `manifestationLevelValues`
- `normalizeEvent`
- `onSearchInput`
- `pushValue`
- `queryScope`
- `removeSuggestion`
- `scrollToId`
- `setActiveFromVisibility`
- `setFilterDropdownViewMode`
- `splitActivities`
- `suggestionIconName`
- `syncHashToRequestedHandle`
- `toggleSuggestion`
- `translatedFacetLabel`
- `triggerLoading`
- `valuesForManifestation`
- `valuesForPath`

## Lifecycle Hooks

- `onMounted`
- `onUnmounted`

## Exposed Methods

_None found by static scan._

## Local Imports

- `~/composables/useFormKitLoader`
- `~/models/interfaces/generated/IefiWorkVariant`
- `~/models/interfaces/manual/IFacetIconMapping`

## Template Component Tags

- `DetailHasEventComp`
- `DetailWorkVariantTopLevelComp`
- `Icon`
- `NuxtLayout`

## Shared Classes Used

- `icon-inline`
- `border-work`
