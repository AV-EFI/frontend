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
- `server/assets/vocab/*`
- `assets/data/*` derived JSON

This is workable, but there is no single obvious place a maintainer should edit or regenerate first.

### Generated files are committed next to hand-written files

This makes diffs noisy and encourages accidental manual edits in generated areas.

### Existing docs are mixed with generated docs

`docs/components/` and `docs/composables/` already exist, but their generation path is not obvious from the normal package scripts. That makes doc drift likely.

### Search and schema generation depend on live external systems

Several scripts require live Elasticsearch or GitHub access. That means fresh setup, CI reproducibility, and local regeneration are all more fragile than they need to be.

## Suggested cleanup direction

- define one documented generation entrypoint per artifact family
- mark generated directories clearly in README and file headers
- separate generated docs from handwritten docs
- avoid mutating non-generated files from generation scripts
- decide whether `server/assets/vocab/*` is required, or whether one schema copy is enough
