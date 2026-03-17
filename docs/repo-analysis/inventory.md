# Inventory

## Directory inventory

### Source counts

- `components/`: 117 files
- `pages/`: 33 files
- `layouts/`: 13 files
- `plugins/`: 14 files
- `composables/`: 22 files
- `stores/`: 6 files
- `server/api/`: 30 files
- `server/utils/`: 7 files
- `scripts/`: 14 files

### Component families

- `global/`: 38
- `detail/`: 20
- `search/`: 18
- `views/`: 12
- `micro/`: 11
- `home/`: 7
- `poc/`: 6
- `cart/`: 2
- `disambiguation/`: 2
- `input/`: 1

## Route surfaces

### Public

- `/` -> landing page with search-first hero and marketing sections
- `/search` and `/search/[...slug]` -> public search UI
- `/res/[prefix]/[id]` -> public resource detail
- `/film/*` -> legacy redirects to `/res/*`
- `/compare` -> compare view based on query-string params
- `/press`, `/vocab`, `/faq`, `/imprint`, `/dataprotection`, `/signout`

### Internal / legacy / admin

- `/protected/*` -> older compare, dashboard, merge, edit, vocab, user pages
- `/admin/user_tooltips` -> schema-tooltip editor
- `/admin/generate_pattern` -> pattern playground
- `/explorer-poc` -> graph explorer/chat proof of concept

## Generated and duplicated artifacts

### Clearly generated runtime assets

- `tailwind.colors.generated.ts`
- `assets/scss/_colors.generated.scss`
- `models/interfaces/generated/*`
- `assets/data/vocab.json`
- `assets/data/fieldIndex.json`
- `assets/data/schemaTree.json`
- `assets/data/entities.json`
- `assets/data/default-query-suggestions.json`
- `data/top-issuers.json`

### Schema copies / duplicate sources of truth

- `models/interfaces/schema/*`
- `server/assets/vocab/*`

These appear to duplicate schema-derived content in two runtime locations.

### Existing docs that look generated or stale

- `docs/components/` with 82 files
- `docs/composables/` with 36 files

These should not be treated as architecture source-of-truth without regeneration rules.

## Empty or placeholder files

- `composables/useMail.ts`
- `config/metaIconConfig.json`
- `types/AVefiUser.ts`
- `pages/nuxt.config.ts` is a no-op layer config inside the `pages/` directory

## Likely unused or legacy code

This list is based on static search for component-name and file-name references across source files. It is useful for refactoring triage, but it is not a perfect proof because Nuxt auto-imports and aliasing can hide usage.

### Higher-confidence dead-code candidates

- `components/detail/AVefiRefinementListComp.vue`
- `components/detail/GenericKVView.vue`
- `components/detail/NdFieldCard.vue`
- `components/detail/WorksMultiView.vue`
- `components/global/BaseCarousel.vue`
- `components/global/BenefitCardComp.vue`
- `components/global/CardList.vue`
- `components/global/CarouselCardCompBackup.vue`
- `components/global/CompareViewEditorStretched.vue`
- `components/global/ReusableCarousel.vue`
- `components/global/SwitchGenericComp.vue`
- `components/micro/ShoppingCartIcon.vue`
- `components/search/MetaIconListComp.vue`
- `components/search/SearchResultManifestation.vue`
- `components/views/ItemViewCompAVefi.vue`
- `components/views/ManifestationViewCompAVefi.vue`
- `components/views/NormDataSearchOverview.vue`
- `components/views/WorkViewReduced_backup.vue`

### Legacy but still reachable

- most `/protected/*` pages
- old FormKit schema JSON files under `models/formkit-schemas/`
- old compare/editor flows in `components/global/CompareView*`
- `components/global/ComparisonComp.vue`

These are still referenced, but they look like older internal tooling rather than current public UX.

## Small but concrete correctness issues found during inventory

- `pages/vocab.vue` has a stray `x` after `</NuxtLayout>`
- `composables/useVocab.ts` points to `/api/glossary`, while the actual route is `/api/cms/vocab`
- `components/global/ThemeSwitch.cy.ts` exists, but there is no visible Cypress setup in the repo
- there are two CI files: `.gitlab-ci.yml` and `gitlab-ci.yml`

## Existing route and feature split

### Current public product surface

- landing/search/detail/press/vocab/faq

### Current maintenance burden

- generated assets and docs
- internal CMS/tooling
- protected legacy pages
- POC explorer
- direct external API integrations

That is a wide surface area for a repo that currently has almost no meaningful automated test coverage.
