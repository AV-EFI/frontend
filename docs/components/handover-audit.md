# Component And Class Handover Audit

This audit is a handover map for developers working on AVefi UI components and shared classes. It is based on the repository state inspected on 2026-07-27.

Do not treat generated component docs as the source of truth. For behavior and implementation, check the source component and its tests first.

## Freshness Status

Current inventory:

- Source Vue components under `components/`: 99
- Markdown component docs under `docs/components/`: 79, excluding this audit and `index.md`
- Source components without matching component docs: 38
- Component docs without a matching current source component: 18

This means `docs/components/` is useful as supporting material, but not complete enough for handover by itself.

## Handover Reading Order

For component work, read in this order:

1. `../../README.md`, `../README.md`, `../../UX.md`, and `../../DESIGN.md` for repo, documentation, UX, and design context.
2. The source component under `components/**`.
3. Matching tests under `tests/unit/components/**`, `tests/unit/source-guards/**`, and `tests/e2e/smoke/**`.
4. Existing component docs under `docs/components/**`, when present.
5. `../repo-analysis/component-behavior-contracts.md` and `../repo-analysis/test-contract-mapping.md` for behavior-level context.

## High-Value Component Map

| Area | Source components | Current docs | Test anchors |
| --- | --- | --- | --- |
| Home search entry | `components/global/SearchCompReduced.vue` | `docs/components/SearchCompReduced.md` | `tests/unit/components/search-comp-reduced.spec.ts`, `tests/e2e/smoke/home-search-detail.spec.ts` |
| Advanced search entry | `components/global/SearchCompExtended.vue` | missing | `tests/unit/components/search-comp-extended.spec.ts`, `tests/unit/source-guards/search-comp-extended.contract.spec.ts` |
| Autocomplete core | `components/search/QueryAutocompleteCore.vue` | missing | `tests/unit/components/query-autocomplete-core.spec.ts`, `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`, `tests/e2e/smoke/compare-press-assets-autocomplete.spec.ts` |
| Search route/results | `components/search/InstantSearchTemplateAVefi.vue`, `components/search/SearchHitsComp.vue`, `components/search/SearchListViewComp.vue`, `components/search/SearchListCompactComp.vue`, `components/search/SearchListFlatComp.vue` | partial | `tests/unit/components/instant-search-template.spec.ts`, `tests/unit/components/search-hits-compact-refinements.spec.ts`, `tests/unit/components/search-list-view-items.spec.ts`, `tests/unit/components/search-list-compact.spec.ts`, `tests/e2e/smoke/search-refinement-request-flow.spec.ts` |
| Facets and refinement values | `components/search/PanelRefinementListComp.vue`, `components/search/ClickableFacetValue.vue`, `components/search/GenericIconList.vue` | partial | `tests/unit/components/clickable-facet-value.spec.ts`, `tests/unit/components/generic-icon-list-creators.spec.ts`, `tests/unit/facet-icon-map.spec.ts` |
| Detail view shell | `components/views/WorkViewCompAVefi.vue`, `components/views/ManifestationViewCompAVefi.vue`, `components/views/CompilationViewCompAVefi.vue`, `components/detail/ManifestationListComp.vue`, `components/detail/ItemListNewComp.vue` | partial | `tests/unit/components/work-view-avefi.spec.ts`, `tests/unit/components/detail-clickable-facets.spec.ts`, `tests/e2e/smoke/home-search-detail.spec.ts` |
| Detail metadata rows | `components/detail/KeyValueComp.vue`, `components/detail/KeyValueListComp.vue`, `components/detail/KeyActionRowsComp.vue`, `components/detail/HasEventComp.vue`, `components/detail/SameAsComp.vue` | partial | `tests/unit/components/key-value-comp.spec.ts`, `tests/unit/components/key-value-list-comp.spec.ts`, `tests/unit/components/same-as-comp.spec.ts`, `tests/unit/components/detail-clickable-facets.spec.ts` |
| Related materials | `components/detail/FilmRelatedMaterialsComp.vue` | missing | `tests/unit/source-guards/film-related-materials-a11y.contract.spec.ts` |
| Navigation and app chrome | `components/global/NavBar.vue`, `components/global/BreadcrumbsComp.vue`, `components/global/Footer.vue`, `components/global/LanguageSwitch.vue`, `components/global/ThemeSwitch.vue` | partial | `tests/e2e/smoke/public-routes-auth.spec.ts`, `components/global/ThemeSwitch.cy.ts` |
| Drawers and dialogs | `components/global/ComparisonDrawer.vue`, `components/global/ContactDrawer.vue`, `components/global/FacetDrawer.vue` | partial | `tests/unit/components/comparison-drawer.spec.ts`, `tests/unit/components/contact-drawer.spec.ts`, `tests/unit/source-guards/drawers.contract.spec.ts` |
| Comparison and favourites | `components/cart/AddToComparisonComp.vue`, `components/cart/AddToFavouritesComp.vue`, `components/detail/FavouritesListComp.vue`, `components/micro/CompareIcon.vue`, `components/micro/FavouritesIcon.vue` | present for older docs; verify source | `tests/unit/stores/compare-list.spec.ts`, `tests/unit/stores/favourites.spec.ts` |
| Homepage sections and carousels | `components/home/**`, `components/global/IssuerCarouselComp.vue`, `components/global/PartnersCarouselComp.vue`, `components/global/CarouselCardComp.vue` | mostly missing | `tests/unit/source-guards/home-carousels-a11y.contract.spec.ts`, `tests/unit/source-guards/carousel-card-contract.spec.ts` |
| Vocabulary and JSON/data viewers | `components/global/VocabViewer.vue`, `components/global/JsonTreeViewer.vue`, `components/global/JsonTreeNode.vue`, `components/global/RawDataCollapse.vue` | partial | no direct component tests found |
| Internal explorer proof of concept | `components/poc/**` | missing | no direct component tests found |

## Shared Class Reference

Current shared component classes are defined in `assets/scss/main.scss` inside `@layer components`. Prefer these classes before adding local one-off Tailwind strings for repeated UI patterns.

Icon classes:

- `.icon-inline` and `.icon-inline-muted`: 1em inline metadata or label icons.
- `.icon-action`: 1.25em action icons.
- `.icon-status`: status or alert icons.
- `.icon-empty-state`: empty-state illustration-scale icons.

Button classes:

- `.btn-icon`, `.btn-icon-xs`, `.btn-icon-sm`: circular icon buttons.
- `.btn-icon-danger`: destructive circular icon button.
- `.btn-danger`, `.btn-danger-outline`: destructive labeled buttons.
- `.btn-highlight`: highlight-colored action button.
- `.btn-carousel-control`: fixed-size carousel control button with dark-theme handling.

Badge classes:

- `.badge-highlight`, `.badge-highlight-xs`: search highlights and compact highlight markers.
- `.badge-work`, `.badge-manifestation`, `.badge-item`, `.badge-work-part`: AVefi data-level badges.
- `.badge-favourites-list`, `.badge-compare-list`, `.badge-userinfo`: list and user-info badges.

Surface and filter classes:

- `.panel-surface`: white/light panel with base border and dark-theme transparent treatment.
- `.panel-surface-muted`: muted panel surface.
- `.filter-chip`: selected filter/refinement chip.

Border helpers:

- `.border-work`
- `.border-manifestation`

Older or supporting style files exist at `assets/scss/_colors.scss`, `assets/scss/_variables.scss`, `tailwind.config.ts`, `tailwind.colors.ts`, and `tailwind.colors.generated.ts`. Per `../../DESIGN.md`, the currently rendered DaisyUI/Tailwind v4 component classes live in `assets/scss/main.scss`.

## Missing Current Component Docs

The following current source components have no matching markdown page in `docs/components/`:

`AuthProvider`, `AvefiPosterComp`, `ChatPanel`, `ClickableFacetValue`, `CompilationViewCompAVefi`, `ContactDrawer`, `ContextTray`, `DataQualityWarningIcon`, `ExplorerSearchBox`, `FilmRelatedMaterialsComp`, `GenericIconList`, `GraphView`, `HomeCallToActionSection`, `HomeIssuerSection`, `HomeLazySectionLoader`, `HomeOpenAndExtendableSection`, `HomeSectionShell`, `HomeSectionTextBlock`, `HomeTimelineSection`, `HomeVideoSection`, `IconEntryItem`, `IssuerCarouselComp`, `JsonTreeNode`, `JsonTreeViewer`, `KeyActionRowsComp`, `LoadingScreen`, `LoadingSpinner`, `PartnersCarouselComp`, `QueryAutocompleteCore`, `SearchCompExtended`, `SearchListCompactComp`, `SearchListFlatComp`, `SearchQueryAutocomplete`, `SidebarPanel`, `TooltipInfo`, `VocabViewer`, `WorkResultList`, `WorkViewCompParts`.

Handover priority for new docs: `SearchCompExtended`, `QueryAutocompleteCore`, `ContactDrawer`, `ClickableFacetValue`, `FilmRelatedMaterialsComp`, `SearchListCompactComp`, `SearchListFlatComp`, `KeyActionRowsComp`, homepage section components, and carousel components.

## Stale Or Orphaned Component Docs

The following docs have no matching current Vue component by basename:

`AuthComponent`, `AVefiRefinementListComp`, `BenefitCardComp`, `CarouselComp`, `CompareViewEditorStretched`, `ComparisonComp`, `ESCountComp`, `HasAgentComp`, `InstitutionListComp`, `ItemListComp`, `ItemViewCompAVefi`, `LoadingIndicator`, `LocatedInComp`, `RainbowStripeText`, `SearchResultManifestation`, `SwitchGenericComp`, `WorksMultiView`, `WorkViewEditorStretched`.

Do not delete these only from this audit. First check whether they document renamed components, intentionally removed components, generated history, or still-referenced concepts.

## Maintenance Rules

- For behavioral changes, update source and tests first, then update the relevant docs.
- If a generated component doc conflicts with source or tests, source and tests win.
- If a shared visual pattern appears in multiple components, consider documenting or moving it toward the shared classes in `assets/scss/main.scss`.
- For accessibility-sensitive components, update or add tests under `tests/unit/source-guards/**` or `tests/unit/components/**`.
- For search, detail, comparison, favourites, and contact flows, check `../../UX.md` and `../ux/interaction-patterns.md` before changing labels, focus behavior, routing, or data semantics.
