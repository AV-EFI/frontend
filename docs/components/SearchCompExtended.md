# `SearchCompExtended.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/global/SearchCompExtended.vue`
- Matching tests:
  - `tests/unit/components/search-comp-extended.spec.ts`
  - `tests/unit/source-guards/search-comp-extended.contract.spec.ts`

## Props

_None found by static scan._

## Emits

_None found by static scan._

## Reactive State

- `ariaLabel (computed)`
- `buttonText (computed)`
- `canSubmit (computed)`
- `formKitRetrying (ref)`
- `historyTrigger (ref)`
- `nextFacetRowId (ref)`
- `recentSearchesWithUrl (computed)`
- `showValidationWarning (ref)`

## Watchers

- 1 watcher call(s): watch

## Functions

- `addFacetFilter`
- `buildFacetSearchCandidates`
- `debounceFetch`
- `facetMeta`
- `fetchFacetSuggestions`
- `filterLocalizedSuggestions`
- `handleClearAllHistory`
- `handleClick`
- `handleRecentSearchClick`
- `handleRemoveRecentSearch`
- `handleSearchSubmit`
- `isYearFacet`
- `loadFormKit`
- `newFacetRow`
- `normalizeForSearch`
- `normalizeYearInput`
- `onFacetChange`
- `onFacetDropdownClick`
- `onFacetKeydown`
- `onMainSelect`
- `onSubmit`
- `onValueBlur`
- `onValueFocus`
- `onValueInput`
- `redirectToSearchScreen`
- `refreshVisibleFacetSuggestions`
- `removeFacetFilter`
- `resolveRawFacetValue`
- `retryLoadFormKit`
- `selectSuggestion`
- `translateValue`

## Lifecycle Hooks

- `onBeforeUnmount`

## Exposed Methods

_None found by static scan._

## Local Imports

- `~/composables/useFormKitLoader`
- `~/models/interfaces/manual/IFacetIconMapping.js`
- `~/models/interfaces/schema/locale_messages.json`
- `~/searchConfig_avefi.js`
- `~/stores/searchParams.js`

## Template Component Tags

- `ClientOnly`

## Shared Classes Used

_None found by static scan._
