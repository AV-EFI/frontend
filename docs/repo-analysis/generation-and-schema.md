# Generation And Schema

## Source of truth

The repository depends on an external schema repository:

- source repo: `https://github.com/AV-EFI/av-efi-schema.git`
- consumed by: `scripts/generate-interfaces.mjs`

That script clones the schema repo into a temporary folder, copies schema assets into this repo, and then generates runtime and developer-facing files.

## Main generation scripts

### `scripts/generate-interfaces.mjs`

Purpose:

- fetch schema material from the external AV-EFI schema repo
- copy schema files into `models/interfaces/schema/`
- generate wrapper interfaces in `models/interfaces/generated/`
- build schema-derived JSON for UI/CMS usage

Outputs:

- `models/interfaces/schema/avefi_schema.ts`
- `models/interfaces/schema/avefi_schema_type_utils.ts`
- `models/interfaces/schema/locale_messages.json`
- `models/interfaces/schema/model.yaml`
- `models/interfaces/schema/vocab.yaml`
- `models/interfaces/generated/*`
- `assets/data/vocab.json`
- `assets/data/fieldIndex.json`
- `assets/data/schemaTree.json`
- `assets/data/entities.json`

Important note:

- the script also prepends `/* eslint-disable */` to every `models/**/*.ts` file, which means generation is mutating a larger area than just generated outputs

### `scripts/fetch-schema.mjs`

This looks like an older, narrower predecessor to `generate-interfaces.mjs`. It only fetches and copies schema files. The newer script appears to supersede it for normal workflows.

### `scripts/generate-scss-vars.ts`

Purpose:

- convert `tailwind.colors.ts` theme tokens into generated SCSS and Tailwind token files

Outputs:

- `assets/scss/_colors.generated.scss`
- `tailwind.colors.generated.ts`

### `scripts/generate-query-suggestions.ts`

Purpose:

- fetch top query suggestions from Elasticsearch

Output:

- `assets/data/default-query-suggestions.json`

### `scripts/generate-issuer-data.ts`

Purpose:

- aggregate issuer data from Elasticsearch

Output:

- `data/top-issuers.json`

How the issuer numbers are updated:

- The issuer carousel (`IssuerCarouselComp`) calls `/api/top-issuers`, which queries the search backend live and caches the result for 24 hours (`TOP_ISSUERS_CACHE_MAX_AGE_SECONDS`, default `86400`). It needs no manual step.
- `data/top-issuers.json` is only the placeholder shown by `HomeIssuerSection` until the carousel loads, and the fallback of `/api/top-issuers` when the backend does not answer. It is updated by hand:
  1. `TOP_ISSUERS_BACKEND_BASE="https://<backend>/rest/v1" corepack yarn generate:issuers`
  2. Review the diff of `data/top-issuers.json` and commit it.
- The script keeps the existing file when the backend request fails (set `TOP_ISSUERS_FALLBACK_TO_EXISTING=false` to make that an error). `TOP_ISSUERS_LIMIT` sets the number of issuers (default 20).
- `yarn build` runs the script too (`prepare:generated`). In CI the backend is usually not reachable, so the committed file stays in place.
- `/api/elastic/cache_top_values` is unrelated: it writes `server/data/autocomplete_fallbacks.json` for search suggestions and is protected with `Authorization: Bearer <NUXT_SECRET>`.

### Image-related scripts

- `scripts/optimize-images.mjs`
- `scripts/report-image-metadata.mjs`

These support the large `public/img/` asset set.

## Runtime consumers of generated data

### Schema-derived JSON

Used by:

- CMS tooltip tooling
- vocab viewers
- model tree pages
- field-label / docs-link helpers

### Generated TypeScript interfaces

Used by:

- search components
- compare views
- detail views
- helper utilities

### Generated design tokens

Used by:

- Tailwind config
- global SCSS
- theme variables

## Structural concerns

### Duplicated schema content

The same schema family exists in multiple places:

- `models/interfaces/schema/*`
- `assets/data/*` derived JSON

This is workable, but there is no single obvious place a maintainer should edit or regenerate first.

### Generated files are committed next to hand-written files

This makes diffs noisy and encourages accidental manual edits in generated areas.

### Existing docs are mixed with generated docs

`docs/components/` was refreshed on 2026-07-27 as static source summaries for current Vue components, and `docs/composables/` already exists. Their generation path is still not obvious from the normal package scripts. That makes future doc drift likely unless a maintained generation entrypoint is added.

### Search and schema generation depend on live external systems

Several scripts require live Elasticsearch or GitHub access. That means fresh setup, CI reproducibility, and local regeneration are all more fragile than they need to be.

## Suggested cleanup direction

- define one documented generation entrypoint per artifact family
- mark generated directories clearly in README and file headers
- separate generated docs from handwritten docs
- avoid mutating non-generated files from generation scripts
- keep `models/interfaces/schema/*` as the only schema copy (the server vocab assets now read it directly)
