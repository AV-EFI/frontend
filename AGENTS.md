# AVefi Agent Guide

This repository is a Nuxt/Vue frontend plus Nitro server for AVefi. Before making UX, design, domain, or search changes, read:

1. `UX.md`
2. `DESIGN.md`
3. `docs/ux/interaction-patterns.md`
4. `docs/ux/accessibility.md`
5. `docs/components/handover-audit.md`
6. `docs/repo-analysis/architecture.md`
7. `docs/repo-analysis/behavior-baseline.md`
8. `docs/repo-analysis/component-behavior-contracts.md`

## Boundaries

- Do not invent product, domain, UX, brand, language, or visual-design decisions.
- Do not treat screenshots, mockups, or handbook examples as implemented behavior.
- Do not edit generated schema or generated docs manually unless the task explicitly asks for generated artifacts and the generation path is understood.
- Do not add dependencies for documentation-only work.
- Preserve user changes in the worktree.

## Source Order

For technical/domain facts, prefer:

1. `models/interfaces/schema/*`
2. Current API implementation and tests
3. `docs/repo-analysis/**`
4. `data/glossary.ts`, `assets/data/vocab.json`, `server/assets/vocab/*`
5. AVefi Gestaltungshandbuch when available

For visual implementation, prefer:

1. `assets/scss/main.scss`, `tailwind.config.ts`, `tailwind.colors.ts`
2. Current shared components
3. `docs/visual-ui-audit.md`
4. AVefi Gestaltungshandbuch when available

For brand/language, prefer the Gestaltungshandbuch export when the live page is unavailable, then current i18n/glossary files. Mark conflicts and unresolved handbook gaps explicitly.

## Handbook Status

The live Gestaltungshandbuch page was checked on 2026-07-27 and returned `403 Forbidden`. The newest available export inspected is `C:\Users\StretzS\e\AVefi Gestaltungshandbuch_91cad766ce0542d3af60cf39cce1163a-270726-1208-20.pdf`, dated 2026-05-13 and marked "Work in Progress". Do not assume that export is current.

## Handbook Basics

- AVefi is an open scientific infrastructure, not a marketing platform.
- Platform rules are binding for `av-efi.net`, search, detail pages, FAQ, glossary, UI text, help text, errors, export, and comparison.
- Accompanying websites follow the handbook as adaptable guidelines.
- Communication formats are flexible inside central guidelines.
- Keep language factual, friendly, precise, understandable, inclusive, and low-barrier.
- Do not use emojis, exaggerated advertising language, unclear abbreviations, or unexplained technical terms in AVefi product copy.

## Search And Detail Invariants

- Public search is configured by `searchConfig_avefi.ts` and rendered through `components/search/InstantSearchTemplateAVefi.vue`.
- `/search` canonical and robots behavior lives in `pages/search/index.vue`.
- Detail records route through `/res/:prefix/:id` and render by detected resource type in `pages/res/[prefix]/[id].vue`.
- `has_access_status` is intentionally blacklisted from advanced-search facet selection but may appear in detail/list rendering when backend data includes it.
- Comparison navigation requires exactly two records.

## Testing

Use targeted tests for code changes:

- `yarn test:unit`
- `yarn test:e2e:smoke`
- `yarn test:e2e:api`

For documentation-only changes, inspect the changed markdown and run no production build unless specifically requested.
