# Accessibility

This document summarizes current accessibility rules and evidence from repository sources.

## Current Claim

The public accessibility page (`pages/accessibility.vue`) uses i18n copy from `i18n/locales/de.ts` and `i18n/locales/en.ts`. It states that AVefi follows WCAG 2.1 AA as the target and that the website is currently partially compliant.

Treat this as the current repository claim, not as proof that all flows meet WCAG 2.1 AA.

The 2026-05-13 handbook export also treats accessibility as part of visual design, language, structure, operability, and technical implementation. It specifically calls out contrast, focus indicators, keyboard operability, semantic structure, clear headings, alt text for relevant images, readable font sizes, clear language, and robust operation on mobile and desktop.

## Current Implementation Anchors

- Skip link on the home page: `pages/index.vue`
- Navigation labels and menus: `components/global/NavBar.vue`
- Search input/listbox semantics: `components/search/QueryAutocompleteCore.vue`
- Search regions and active refinements: `components/search/InstantSearchTemplateAVefi.vue`
- Detail work navigation: `components/views/WorkViewCompAVefi.vue`
- Comparison drawer tab semantics: `components/global/ComparisonDrawer.vue`
- Contact drawer dialog, Escape handling, focus return, and body scroll lock: `components/global/ContactDrawer.vue`
- Carousel semantics and hidden-slide handling: `components/global/CarouselCardComp.vue`, `components/global/IssuerCarouselComp.vue`, `components/global/PartnersCarouselComp.vue`, `components/detail/FilmRelatedMaterialsComp.vue`

## Test Anchors

- `tests/unit/source-guards/home-carousels-a11y.contract.spec.ts`
- `tests/unit/source-guards/film-related-materials-a11y.contract.spec.ts`
- `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`
- `tests/unit/components/query-autocomplete-core.spec.ts`
- `tests/unit/source-guards/drawers.contract.spec.ts`
- `tests/unit/components/contact-drawer.spec.ts`
- `tests/unit/components/comparison-drawer.spec.ts`

## Rules For New Or Changed UI

- Preserve semantic landmarks, labels, `role`, `aria-*`, and keyboard behavior already covered by tests.
- Icon-only buttons need accessible names.
- Icons inside labeled controls should be decorative unless the icon adds meaning not present in text.
- Search/listbox interactions must support keyboard navigation and avoid stale async suggestions.
- Drawers and dialogs must close with Escape when already supported, prevent background scroll while open when already implemented, and return focus where the component contract requires it.
- Carousels must expose carousel/slide semantics, keep live slide status polite, provide pause/play controls when autoplay exists, and keep hidden slides out of keyboard and screen-reader navigation.
- Non-essential motion should respect `prefers-reduced-motion`.
- Use ARIA only where semantic HTML is not enough.
- Informative images need alt text; decorative images should not add noise to assistive technology output.
- Body text should stay at or above 16px on the web.

## Known Gaps

- The accessibility statement says some third-party components, older content, and some interactive elements are not fully accessible in all scenarios.
- No full automated accessibility audit configuration was found; `package.json` contains `audit:accessibility` as a placeholder command.
- Existing source-guard tests protect selected semantics, but they do not replace manual keyboard, screen-reader, colour-contrast, and responsive checks.
