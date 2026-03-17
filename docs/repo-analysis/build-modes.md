# Build Modes

This repo now has two intended build modes.

## Why this exists

The old default scripts were doing too much on every local run:

- regenerate SCSS colors
- clone and regenerate schema/interfaces
- query Elasticsearch for suggestions
- run a full Nuxt production build
- prerender static routes
- run link checking during build

That made normal local `build` and `dev` workflows much slower than they need to be.

## Current commands

### Fast local path

- `npm run dev`
- `npm run dev:local`
- `npm run build`
- `npm run build:local`

Behavior:

- only runs `generate:colours`
- skips schema/interface regeneration
- skips suggestion regeneration
- disables release-oriented modules such as sitemap, robots, SEO bundle helpers, and winston logging integration
- disables build-time prerender QA
- disables build-time link checker
- disables Vite sourcemaps for the production build

Use this for:

- day-to-day frontend development
- local layout, styling, and component work
- verifying that the app still compiles

### Full strict path

- `npm run dev:full`
- `npm run build:ci`
- `npm run deploy`

Behavior:

- runs all generators
- keeps the current schema refresh flow
- refreshes query suggestions
- keeps prerender enabled
- keeps link-checker enabled
- keeps build sourcemaps enabled

Use this for:

- CI
- release verification
- validating generated artifacts before committing them

## Profile switch

The distinction is implemented through `NUXT_BUILD_PROFILE`:

- `local`: fast local workflow
- `ci`: full build checks

The helper script [scripts/run-with-env.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/run-with-env.mjs) exists so npm scripts can set that env var consistently on Windows and Unix-like shells.

## What is still expensive

Even the local build is still a real Nuxt production build, so it is not "instant". The biggest remaining local cost is Nuxt/Nitro compilation itself.

The heaviest strict-path costs still come from:

- [scripts/generate-interfaces.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/generate-interfaces.mjs)
- [scripts/generate-query-suggestions.ts](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/generate-query-suggestions.ts)
- prerender and link checking in [nuxt.config.ts](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/nuxt.config.ts)

## Follow-up ideas

- make schema regeneration incremental instead of cloning every time
- make suggestion refresh explicitly opt-in outside CI
- move release-only QA checks fully into CI rather than coupling them to generic build scripts
