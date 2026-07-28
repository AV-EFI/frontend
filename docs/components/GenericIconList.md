# `GenericIconList.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/search/GenericIconList.vue`
- Matching tests:
  - `tests/unit/components/generic-icon-list-creators.spec.ts`
  - `tests/unit/components/search-list-view-items.spec.ts`
  - `tests/unit/facet-icon-map.spec.ts`

## Props

- `data`
- `density`
- `entryLevelClass`
- `iconColor`
- `level`

## Emits

_None found by static scan._

## Reactive State

- `baseEntryClass (computed)`
- `boundedEntries (computed)`
- `entryClass (computed)`
- `gapClass (computed)`
- `gridClass (computed)`
- `iconClass (computed)`
- `iconEntries (computed)`
- `isCompact (computed)`
- `isManifestationLevel (computed)`
- `leadingClass (computed)`
- `primaryEntries (computed)`
- `primaryTextClass (computed)`
- `rootClasses (computed)`
- `rowClasses (computed)`
- `sharedEntryClasses (computed)`
- `singleValueClass (computed)`
- `textClass (computed)`
- `thematicEntries (computed)`
- `valueBlockClass (computed)`
- `volatileEntries (computed)`
- `volatileEntryClass (computed)`
- `volatileValueBlockClass (computed)`

## Watchers

_None found by static scan._

## Functions

- `facetAttributeForEntry`
- `iconFor`
- `primaryEntryClass`
- `segClass`

## Lifecycle Hooks

_None found by static scan._

## Exposed Methods

_None found by static scan._

## Local Imports

- `./IconEntryItem.vue`
- `@/models/interfaces/manual/IFacetIconMapping`
- `~/composables/useIsLargeScreen`
- `~/config/clickableFacetConfig`
- `~/config/entryDisplayConfig`
- `~/searchConfig_avefi`
- `~/types/iconEntry`
- `~/utils/iconEntry/buildItemEntries`
- `~/utils/iconEntry/buildManifestationEntries`
- `~/utils/iconEntry/buildWorkEntries`
- `~/utils/iconEntry/entryHelpers`

## Template Component Tags

- `IconEntryItem`

## Shared Classes Used

_None found by static scan._
