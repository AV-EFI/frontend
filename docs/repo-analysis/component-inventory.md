# Component Inventory

This file lists every file under `components/` together with a static usage signal.

## Legend

- `referenced`: found in more than one source file outside itself
- `single-reference`: found once outside itself
- `candidate-unused`: no static reference found by component name or file name

This is only a heuristic. Nuxt auto-imports, dynamic components, and local aliasing can hide usage. Treat `candidate-unused` as "check manually before deleting".

## cart
- cart/AddToComparisonComp.vue | single-reference | refs=1 | first=components/global/ActionContextComp.vue
- cart/AddToFavouritesComp.vue | single-reference | refs=1 | first=components/global/ActionContextComp.vue

## detail
- detail/AVefiRefinementListComp.vue | candidate-unused | refs=0
- detail/FavouritesListComp.vue | single-reference | refs=1 | first=pages/protected/favouriteslist.vue
- detail/GenericKVView.vue | candidate-unused | refs=0
- detail/HasAgentComp.vue | single-reference | refs=1 | first=components/views/ItemViewCompAVefi.vue
- detail/HasEventComp.vue | single-reference | refs=1 | first=components/views/WorkViewCompAVefi.vue
- detail/InstitutionListComp.vue | single-reference | refs=1 | first=pages/protected/institutionlist.vue
- detail/ItemListNewComp.vue | single-reference | refs=1 | first=components/detail/ManifestationListComp.vue
- detail/KeyActionRowsComp.vue | single-reference | refs=1 | first=components/views/WorkViewCompAVefi.vue
- detail/KeyValueComp.vue | referenced | refs=7 | first=components/detail/HasEventComp.vue
- detail/KeyValueListComp.vue | referenced | refs=2 | first=components/detail/HasEventComp.vue
- detail/LocatedInComp.vue | single-reference | refs=1 | first=components/views/ItemViewCompAVefi.vue
- detail/LogListComp.vue | single-reference | refs=1 | first=pages/protected/loglist.vue
- detail/ManifestationHeaderComp.vue | referenced | refs=2 | first=components/detail/ManifestationListComp.vue
- detail/ManifestationListComp.vue | single-reference | refs=1 | first=components/views/WorkViewCompAVefi.vue
- detail/MergeToolListComp.vue | single-reference | refs=1 | first=pages/protected/mergetool.vue
- detail/NdFieldCard.vue | candidate-unused | refs=0
- detail/PaginationComp.vue | single-reference | refs=1 | first=components/search/InstantSearchTemplateAVefi.vue
- detail/SameAsComp.vue | referenced | refs=6 | first=components/detail/HasAgentComp.vue
- detail/WorkVariantTopLevelComp.vue | single-reference | refs=1 | first=components/views/WorkViewCompAVefi.vue
- detail/WorksMultiView.vue | candidate-unused | refs=0

## disambiguation
- disambiguation/DisambiguationIcon.vue | single-reference | refs=1 | first=components/disambiguation/ShowDisambiguationComp.vue
- disambiguation/ShowDisambiguationComp.vue | single-reference | refs=1 | first=pages/protected/filmedit.vue

## global
- global/ActionContextComp.vue | referenced | refs=5 | first=pages/res/[prefix]/[id].vue
- global/AuthProvider.vue | single-reference | refs=1 | first=app.vue
- global/BaseCarousel.vue | candidate-unused | refs=0
- global/BenefitCardComp.vue | candidate-unused | refs=0
- global/BreadcrumbsComp.vue | referenced | refs=17 | first=pages/admin/generate_pattern.vue
- global/CardList.vue | candidate-unused | refs=0
- global/CarouselCardComp.vue | single-reference | refs=1 | first=pages/index.vue
- global/CarouselCardCompBackup.vue | candidate-unused | refs=0
- global/ClipboardComp.vue | referenced | refs=10 | first=pages/res/[prefix]/[id].vue
- global/CompareViewEditor.vue | single-reference | refs=1 | first=pages/protected/disambiguation.vue
- global/CompareViewEditorStretched.vue | candidate-unused | refs=0
- global/CompareViewProps.vue | referenced | refs=2 | first=pages/compare.vue
- global/CompareViewRaw.vue | referenced | refs=3 | first=pages/compare.vue
- global/ComparisonComp.vue | single-reference | refs=1 | first=components/global/ActionContextComp.vue
- global/ComparisonDrawer.vue | referenced | refs=7 | first=layouts/default.vue
- global/ContactDrawer.vue | referenced | refs=3 | first=layouts/default.vue
- global/ExportDataComp.vue | referenced | refs=2 | first=components/global/ActionContextComp.vue
- global/FacetDrawer.vue | referenced | refs=5 | first=components/detail/InstitutionListComp.vue
- global/FilmDiamondPatternGenerator.vue | single-reference | refs=1 | first=pages/admin/generate_pattern.vue
- global/FilmDiamondPatternGeneratorInner.vue | single-reference | refs=1 | first=components/global/FilmDiamondPatternGenerator.vue
- global/Footer.vue | referenced | refs=2 | first=layouts/default.vue
- global/IndicatorComp.vue | single-reference | refs=1 | first=layouts/filmroll.vue
- global/IssuerCarouselComp.vue | referenced | refs=2 | first=components/global/ReusableCarousel.vue
- global/LanguageSwitch.vue | referenced | refs=2 | first=app.vue
- global/LoadingScreen.vue | single-reference | refs=1 | first=app.vue
- global/NavBar.vue | referenced | refs=2 | first=layouts/default.vue
- global/PartnersCarouselComp.vue | single-reference | refs=1 | first=pages/index.vue
- global/RawDataCollapse.vue | single-reference | refs=1 | first=components/views/WorkViewEditor.vue
- global/ReusableCarousel.vue | candidate-unused | refs=0
- global/SearchCompExtended.vue | single-reference | refs=1 | first=pages/index.vue
- global/SearchCompReduced.vue | single-reference | refs=1 | first=pages/index.vue
- global/SendValueComp.vue | referenced | refs=2 | first=components/views/WorkViewEditor.vue
- global/SkeletonLoaderComp.vue | referenced | refs=2 | first=components/search/LoadingIndicator.vue
- global/SwitchGenericComp.vue | candidate-unused | refs=0
- global/ThemeSwitch.cy.ts | candidate-unused | refs=0
- global/ThemeSwitch.vue | referenced | refs=2 | first=components/global/NavBar.vue
- global/TooltipInfo.vue | referenced | refs=7 | first=components/detail/ItemListNewComp.vue
- global/VocabViewer.vue | referenced | refs=2 | first=pages/protected/vocab.vue

## home
- home/HomeCoreFunctionsSection.vue | single-reference | refs=1 | first=pages/index.vue
- home/HomeIssuerSection.vue | single-reference | refs=1 | first=pages/index.vue
- home/HomeLazySectionLoader.vue | single-reference | refs=1 | first=pages/index.vue
- home/HomeSectionShell.vue | single-reference | refs=1 | first=pages/index.vue
- home/HomeSectionTextBlock.vue | referenced | refs=3 | first=pages/index.vue
- home/HomeTimelineSection.vue | single-reference | refs=1 | first=pages/index.vue
- home/HomeVideoSection.vue | single-reference | refs=1 | first=pages/index.vue

## input
- input/VueSlider.vue | single-reference | refs=1 | first=components/global/FacetDrawer.vue

## micro
- micro/BadgeCategoryComp.vue | referenced | refs=10 | first=pages/res/[prefix]/[id].vue
- micro/CompareIcon.vue | single-reference | refs=1 | first=components/cart/AddToComparisonComp.vue
- micro/ContactForm.vue | referenced | refs=4 | first=pages/index.vue
- micro/DividerComp.vue | referenced | refs=2 | first=components/detail/ItemListNewComp.vue
- micro/ESCountComp.vue | single-reference | refs=1 | first=pages/protected/dashboard.vue
- micro/EfiCopyComp.vue | referenced | refs=2 | first=components/detail/ManifestationHeaderComp.vue
- micro/IconTextComp.vue | single-reference | refs=1 | first=components/views/WorkViewCompAVefi.vue
- micro/LabelComp.vue | referenced | refs=8 | first=components/detail/HasEventComp.vue
- micro/RainbowStripeText.vue | single-reference | refs=1 | first=components/global/NavBar.vue
- micro/SendMailButt.vue | single-reference | refs=1 | first=components/global/NavBar.vue
- micro/ShoppingCartIcon.vue | candidate-unused | refs=0

## poc
- poc/ChatPanel.vue | single-reference | refs=1 | first=pages/explorer-poc.vue
- poc/ContextTray.vue | single-reference | refs=1 | first=pages/explorer-poc.vue
- poc/ExplorerSearchBox.vue | single-reference | refs=1 | first=pages/explorer-poc.vue
- poc/GraphView.vue | single-reference | refs=1 | first=pages/explorer-poc.vue
- poc/SidebarPanel.vue | single-reference | refs=1 | first=pages/explorer-poc.vue
- poc/WorkResultList.vue | single-reference | refs=1 | first=pages/explorer-poc.vue

## search
- search/GenericIconList.vue | referenced | refs=6 | first=components/detail/ManifestationHeaderComp.vue
- search/HighlightListComp.vue | referenced | refs=3 | first=components/detail/ItemListNewComp.vue
- search/HighlightMatchComp.vue | referenced | refs=2 | first=components/search/SearchListViewComp.vue
- search/HighlightSingleComp.vue | referenced | refs=3 | first=components/detail/ItemListNewComp.vue
- search/InstantSearchTemplateAVefi.vue | single-reference | refs=1 | first=components/search/SearchSection.vue
- search/LoadingIndicator.vue | single-reference | refs=1 | first=app.vue
- search/ManifestationListSplitView.vue | single-reference | refs=1 | first=components/search/SearchListViewComp.vue
- search/MetaIconListComp.vue | candidate-unused | refs=0
- search/NoResultsComp.vue | referenced | refs=2 | first=components/detail/InstitutionListComp.vue
- search/PanelRefinementListComp.vue | single-reference | refs=1 | first=components/global/FacetDrawer.vue
- search/QueryAutocompleteCore.vue | single-reference | refs=1 | first=components/search/SearchQueryAutocomplete.vue
- search/SearchHitsComp.vue | referenced | refs=2 | first=components/detail/InstitutionListComp.vue
- search/SearchListFlatComp.vue | single-reference | refs=1 | first=components/search/SearchHitsComp.vue
- search/SearchListViewComp.vue | single-reference | refs=1 | first=components/search/SearchHitsComp.vue
- search/SearchQueryAutocomplete.vue | referenced | refs=3 | first=components/global/SearchCompExtended.vue
- search/SearchResultManifestation.vue | candidate-unused | refs=0
- search/SearchSection.vue | referenced | refs=2 | first=pages/search/index.vue
- search/SearchTableViewComp.vue | single-reference | refs=1 | first=components/search/SearchHitsComp.vue

## views
- views/CompilationViewCompAVefi.vue | single-reference | refs=1 | first=pages/res/[prefix]/[id].vue
- views/ItemViewCompAVefi.vue | candidate-unused | refs=0
- views/KibanaEmbed.vue | referenced | refs=2 | first=components/detail/NdFieldCard.vue
- views/ManifestationViewCompAVefi.vue | candidate-unused | refs=0
- views/NormDataSearchOverview.vue | candidate-unused | refs=0
- views/WorkViewCompAVefi.vue | single-reference | refs=1 | first=pages/res/[prefix]/[id].vue
- views/WorkViewCompParts.vue | referenced | refs=2 | first=components/views/CompilationViewCompAVefi.vue
- views/WorkViewEditor.vue | referenced | refs=2 | first=components/global/CompareViewEditor.vue
- views/WorkViewEditorResult.vue | referenced | refs=2 | first=components/global/CompareViewEditor.vue
- views/WorkViewEditorStretched.vue | single-reference | refs=1 | first=components/global/CompareViewEditorStretched.vue
- views/WorkViewReduced.vue | single-reference | refs=1 | first=components/global/CompareViewProps.vue
- views/WorkViewReduced_backup.vue | candidate-unused | refs=0
