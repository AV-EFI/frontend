# AVefi UX Context

This file is the top-level UX map for developers and AI coding agents. It summarizes only what is supported by current repository sources and the task brief. It is not a product requirements document.

## Source Status

- Live AVefi Gestaltungshandbuch page: `https://wiki.tib.eu/confluence/spaces/avefi/pages/409897177/AVefi+Gestaltungshandbuch`
- Live check on 2026-07-27 returned `403 Forbidden`; the live page could not be verified.
- Newest available export inspected: `C:\Users\StretzS\e\AVefi Gestaltungshandbuch_91cad766ce0542d3af60cf39cce1163a-270726-1208-20.pdf`.
- Export version: 2026-05-13, status "Work in Progress".
- Do not assume the 2026-05-13 export is current. Do not fill remaining handbook gaps with generic design assumptions.

## Product Purpose

AVefi is a Nuxt/Vue frontend for cross-archive film discovery and AV metadata workflows. Current product copy says AVefi enables discovery of film works, manifestations, and items across multiple film archives, with authority-data links, persistent identifiers, and structured metadata for research, archival practice, and digital film studies.

The 2026-05-13 handbook export describes AVefi as an open, scientific infrastructure for linking and reusing film metadata. It emphasizes visibility of audiovisual collections, Linked Open Data, FAIR principles, persistent identifiers, sustainable research infrastructure, and low-threshold access for professional communities and the public.

Primary implementation sources:

- `i18n/locales/de.ts`
- `i18n/locales/en.ts`
- `app.vue`
- `nuxt.config.ts`
- `docs/repo-analysis/architecture.md`

## Source Order

For technical and domain facts:

1. Current AVefi schema: `models/interfaces/schema/*`
2. Current API contracts and implementation: `server/api/**`, `tests/e2e/api/**`, `tests/e2e/utils/elastic-contracts.ts`
3. Accepted architecture/domain decisions: `docs/repo-analysis/**`
4. Current glossary and vocabulary files: `data/glossary.ts`, `assets/data/vocab.json`, `server/assets/vocab/*`
5. AVefi Gestaltungshandbuch
6. Issues and discussions

For visual implementation:

1. Current theme and token configuration: `assets/scss/main.scss`, `tailwind.config.ts`, `tailwind.colors.ts`
2. Current shared components: `components/global/**`, `components/micro/**`, `components/search/**`, `components/detail/**`, `components/views/**`
3. Accepted visual decisions: `docs/visual-ui-audit.md`
4. AVefi Gestaltungshandbuch
5. Historic screenshots and mockups

For brand, language, and communication:

1. AVefi Gestaltungshandbuch, when available
2. Current glossary and editorial copy: `data/glossary.ts`, `i18n/locales/de.ts`, `i18n/locales/en.ts`
3. Accepted communication decisions
4. Existing published materials and press content: `pages/press.vue`, `public/press/manifest.json`

For user-related claims:

1. Documented user research and usability tests
2. Confirmed user feedback
3. Accepted UX decisions supported by evidence
4. Explicitly marked hypotheses

When sources conflict, do not silently choose one. Link or name the conflicting sources, state which source would normally be authoritative, mark it unresolved, and do not change implementation without an explicit decision.

## Repository Map

- App shell and layout: `app.vue`, `layouts/default.vue`
- Public routes: `pages/index.vue`, `pages/search/index.vue`, `pages/res/[prefix]/[id].vue`, `pages/faq.vue`, `pages/vocab.vue`, `pages/press.vue`, `pages/accessibility.vue`
- Protected/internal routes: `pages/protected/**`, `pages/admin/user_tooltips.vue`, `pages/explorer-poc.vue`
- Search implementation: `searchConfig_avefi.ts`, `components/global/SearchCompReduced.vue`, `components/global/SearchCompExtended.vue`, `components/search/SearchSection.vue`, `components/search/InstantSearchTemplateAVefi.vue`, `components/search/QueryAutocompleteCore.vue`
- Detail implementation: `pages/res/[prefix]/[id].vue`, `components/views/WorkViewCompAVefi.vue`, `components/views/ManifestationViewCompAVefi.vue`, `components/views/CompilationViewCompAVefi.vue`, `components/detail/**`
- Navigation and drawers: `components/global/NavBar.vue`, `components/global/ComparisonDrawer.vue`, `components/global/ContactDrawer.vue`
- State: `stores/searchParams.ts`, `stores/compareList.ts`, `stores/favourites.ts`, `stores/locale.ts`
- Accessibility page/copy/tests: `pages/accessibility.vue`, `i18n/locales/*`, `tests/unit/source-guards/*a11y*.spec.ts`
- Existing UX/architecture docs: `docs/visual-ui-audit.md`, `docs/repo-analysis/**`
- Agent instructions found before this document: `.claude/settings.local.json`; no existing `AGENTS.md`, `CLAUDE.md`, or Copilot instructions were found.

## Domain Model

Use schema terms, not invented replacements.

- `WorkVariant`: intellectual or artistic film content plus variants. Important fields include primary title, alternative titles, form, genre, subject, events, same-as links, and part/series relationships. Source: `models/interfaces/schema/avefi_schema.ts`.
- `Manifestation`: concrete embodiment of one or more work variants. Source fields include linked work variants, item references, notes, web resources, and manifestation event data.
- `Item`: physical or digital copy of a manifestation. Source fields include access status, element type, format, colour type, sound type, duration, extent, frame rate, language, and web resources.
- `DescriptionResource`: metadata about the PID record itself, including issuer, source keys, history, and last-modified values.
- `Agent`, `Activity`, and `Event`: represent people/organizations, their roles, and lifecycle events such as production, publication, preservation, manufacture, and rights/copyright registration.
- `AuthorityResource` and subtypes: represent linked authority or identifier systems such as AVefi, GND, VIAF, Wikidata, DOI, EIDR, Filmportal, ISIL, TGN, AAT, and local resources.

## Terminology

- Product spelling in current code: `AVefi`.
- Current claim strings: German `Filme finden. Daten verbinden.` and English `Find films. Link data.` from `i18n/locales/de.ts` and `i18n/locales/en.ts`.
- The inspected handbook export confirms the same German and English claim strings.
- Prefer `platform` or, in German contexts, `Plattform`/`Verbundsystem` over `portal`/`Portal`; explain `Verbundsystem` when used.
- Public navigation terms include film research/search, FAQ, vocabulary, accessibility, press, comparison, favourites, and contact.
- Current glossary entries live in `data/glossary.ts`; schema-derived vocabulary lives in `assets/data/vocab.json` and `server/assets/vocab/*`.
- Several German strings in source show encoding damage. Do not treat mojibake as editorial guidance; verify copy against the handbook or accepted editorial sources before editing user-facing language.

## Handbook Rules For Platform UX

The handbook distinguishes contexts:

- Platform `av-efi.net`: rules are structured and binding because design, language, and structure directly affect orientation, accessibility, trust, and metadata understanding.
- Accompanying websites: rules are guiding principles and can be adapted to audience, medium, and purpose.
- Communication and social media: rules are more flexible, but central identity, clear language, truthful context, and non-misleading imagery remain required.

For platform-adjacent work, involve UX/Frontend early when a change affects information architecture, navigation, search, filters, detail pages, FAQ structure, help text, accessibility, interaction, or visual orientation.

## Interaction Rules

Detailed patterns are in `docs/ux/interaction-patterns.md`. High-level rules:

- Search is the primary public workflow. Home offers simple and advanced search; `/search` renders InstantSearch client-side.
- Search URLs are shareable state. Preserve canonicalization and query/facet synchronization behavior in `pages/search/index.vue` and `components/search/InstantSearchTemplateAVefi.vue`.
- Advanced search must block empty submits, support multiple facet rows, debounce/cancel facet suggestion requests, and hide blacklisted facets such as `has_access_status`.
- Detail pages route through `/res/:prefix/:id`, keep route-derived canonical URLs, and switch detail rendering by detected resource type.
- Comparison requires exactly two selected records before navigation to `/compare`.
- Drawers and dialogs need Escape behavior, focus management, and body-scroll control where already implemented.

## Accessibility

The public accessibility statement says AVefi follows WCAG 2.1 AA as the target and is currently partially compliant. Treat that as the current repository claim, not as proof that every UI path meets the target.

Detailed notes: `docs/ux/accessibility.md`

## Open UX Questions

- The live Gestaltungshandbuch could not be verified; the inspected 2026-05-13 export is marked Work in Progress and should be checked against the live page when access is available.
- Current theme tokens conflict between `assets/scss/main.scss`, `tailwind.config.ts`, and `_variables.scss` for some domain colors. Implementation currently renders through SCSS/DaisyUI v5, but the discrepancy should be resolved as a design decision.
- `data/glossary.ts` contains concise human definitions, while schema-derived vocab files contain broader technical vocabulary. Their ownership and synchronization are not documented.
- Search/detail field ordering includes dated layout maps in `models/interfaces/detail-layout-map.ts` and `models/interfaces/search-layout-map.ts`; some entries are marked missing, derived, duplicates, or UX questions.
- No documented user research or usability-test findings were found in the repository.
- The handbook says future updates may be driven by feedback from usage and tests, but the export itself is not a user-research report.
