# `QueryAutocompleteCore.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/search/QueryAutocompleteCore.vue`
- Matching tests:
  - `tests/unit/components/query-autocomplete-core.spec.ts`
  - `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`

## Props

- `ariaLabel`
- `autofocus`
- `clearTitle`
- `dropdownAriaLabel`
- `enforceList`
- `facetAttr`
- `helpText`
- `iconMap`
- `infoTooltipText`
- `modelValue`
- `name`
- `noResultsText`
- `placeholder`
- `query`
- `recentSearches`
- `showInfoTooltip`
- `size`
- `timestamp`
- `url`

## Emits

- `blur`
- `clear`
- `clear-history`
- `focus`
- `recent-search-click`
- `remove-recent`
- `select`
- `submit`
- `update:modelValue`

## Reactive State

- `activeDescId (computed)`
- `alive (ref)`
- `ariaLabel (computed)`
- `enforced (computed)`
- `facetMode (computed)`
- `fetching (ref)`
- `highlighted (ref)`
- `lastSelected (ref)`
- `listboxAriaLabel (computed)`
- `noResultsMessage (computed)`
- `searchHelpButtonLabel (computed)`
- `searchHelpButtonOffsetClass (computed)`
- `searchHelpText (computed)`
- `searchHelpVisible (computed)`
- `showDropdown (ref)`
- `showSearchHelp (ref)`
- `size (computed)`
- `suppressNextInput (ref)`
- `userInteracting (ref)`
- `visibleSuggestions (computed)`

## Watchers

- 3 watcher call(s): watch

## Functions

- `cancelDebounce`
- `debounce`
- `fetchSuggestions`
- `focusInput`
- `iconClassFor`
- `normalizeForSearch`
- `onBlur`
- `onClear`
- `onDocumentPointerDown`
- `onFocus`
- `onInput`
- `onKeydown`
- `onNativeInput`
- `onSelect`
- `optionId`
- `submit`
- `suggestionLabel`
- `translateFacetSuggestion`
- `typeLabel`

## Lifecycle Hooks

- `onBeforeUnmount`
- `onMounted`

## Exposed Methods

- `focusInput`
- `submit`

## Local Imports

- `~/assets/data/default-query-suggestions.json`

## Template Component Tags

- `Icon`

## Shared Classes Used

- `icon-inline`
- `icon-action`
