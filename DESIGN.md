# AVefi Design Context

This file records implementation-facing design context from the current repository. It does not replace the AVefi Gestaltungshandbuch.

## Source Status

The live Gestaltungshandbuch could not be verified on 2026-07-27 because the Confluence page returned `403 Forbidden`. The newest available export inspected is `C:\Users\StretzS\e\AVefi Gestaltungshandbuch_91cad766ce0542d3af60cf39cce1163a-270726-1208-20.pdf`, dated 2026-05-13 and marked "Work in Progress". Treat it as reviewed but not necessarily current.

## Implemented Theme

Current visual implementation is Nuxt 4, Vue 3, Tailwind 4, and DaisyUI 5.

Primary files:

- `assets/scss/main.scss`
- `assets/scss/_colors.scss`
- `assets/scss/_variables.scss`
- `tailwind.config.ts`
- `tailwind.colors.ts`
- `tailwind.colors.generated.ts`
- `formkit.theme.ts`
- `docs/visual-ui-audit.md`

## Active Tokens

The active DaisyUI v5 themes are defined in `assets/scss/main.scss`:

- Light theme: `avefi_light`
- Dark theme: `avefi_dark`
- Theme is applied through `data-theme`, initialized in `nuxt.config.ts` and synchronized in `app.vue`.
- Core colors include base surfaces, primary, secondary, accent, neutral, info, success, warning, error, highlight, favourites, compare, work, manifestation, item, and userinfo tokens.
- Fonts are loaded from `public/fonts/BreeSerif-Regular.ttf` and `public/fonts/Inter.ttf`; global body text uses Inter and `.bree` uses BreeSerif.

## Handbook Visual Rules

The handbook describes AVefi as an open scientific infrastructure, not a marketing platform. Visual design should be calm, functional, semantic, durable, and oriented toward trust in data, structure, and provenance.

Handbook colour rules:

- Light theme primary: `#4d768d`
- Light theme accent: `#d8899c`
- Light theme highlight: `#ffc0cb`
- Light theme neutral: `#141b1f`
- Light theme base: `#fbfcfd`
- Dark theme keeps the same design logic; primary and accent stay identical between light and dark according to the export.
- Signal colours are reserved for real status, warning, or error messages.
- Domain colours: favourites `#B85A5E`, compare `#3A434A`, work `#8ea1a1`, manifestation `#7c949e`, item `#748599`.

Handbook typography rules:

- Bree Serif: logo, claim, and main headings.
- Inter/system UI: interface, body text, buttons, labels, and metadata.
- Body text target: 16px with relaxed line height.
- Office fallback: Arial, pending final confirmation in the handbook.

Handbook layout rules:

- Maximum layout width: 1280px.
- Grid: 12 columns.
- Inputs and small controls: 4px radius.
- Cards and containers: 8px radius.
- Large selectors/highlights: 16px radius.
- Use whitespace and repeatable structure before visual effects.

## Known Token Conflict

There is a repository conflict between token files:

- `assets/scss/main.scss` defines current DaisyUI v5 variables used by Tailwind 4 runtime CSS.
- `tailwind.config.ts` defines older fallback theme values and plugin classes.
- `assets/scss/_variables.scss` has older semantic colors, including different `compare-list`, `work`, `manifestation`, and `item` values.
- `docs/visual-ui-audit.md` states that because Tailwind v4 is loaded through `assets/scss/main.scss`, shared classes that must render in the current app also need definitions in `main.scss`.
- The handbook export lists highlight as `#ffc0cb`, while current implementation uses `#e4acba`.
- The handbook export says primary and accent remain identical in light and dark themes, while current implementation uses dark primary `#80a3b5`.

Normally, current implemented theme and token configuration are authoritative for visual implementation. Mark this conflict unresolved before changing token values.

## Components And Controls

Prefer existing shared classes and components before adding local styling:

- Icon utilities: `.icon-inline`, `.icon-action`, `.icon-status`, `.icon-empty-state`
- Icon buttons: `.btn-icon`, `.btn-icon-xs`, `.btn-icon-sm`, `.btn-icon-danger`
- Destructive buttons: `.btn-danger`, `.btn-danger-outline`
- Semantic badges: `.badge-highlight`, `.badge-highlight-xs`, `.badge-work`, `.badge-manifestation`, `.badge-item`, `.badge-favourites-list`, `.badge-compare-list`, `.badge-userinfo`
- Search/filter surfaces: `.panel-surface`, `.panel-surface-muted`, `.filter-chip`
- Carousel controls: `.btn-carousel-control`

Shared component sources:

- `components/global/**`
- `components/micro/**`
- `components/search/**`
- `components/detail/**`
- `components/views/**`

Generated component docs exist under `docs/components/`; use them only as supporting references because they are incomplete and partly stale. Start with `docs/components/handover-audit.md` for the current component/class handover map.

## Icons

Current icon module collections are `tabler` and `formkit` in `nuxt.config.ts`. `docs/visual-ui-audit.md` recommends:

- Use Tabler for general app navigation, search results, drawers, alerts, and global actions.
- Keep FormKit icons valid for FormKit-rendered form controls and schema/form-heavy workflows.
- Icon-only controls need an accessible label.
- Icons inside labeled buttons should generally be decorative via `aria-hidden`.

## Visual Semantics

Use semantic colors consistently:

- `work`, `manifestation`, and `item` represent AVefi data levels.
- `highlight` is for match/highlight emphasis.
- `favourites-list` and `compare-list` are for saved-list and comparison affordances.
- `error`, `warning`, `success`, and `info` should remain status colors.

Do not infer implementation from screenshots, mockups, or handbook examples. Treat them as design input only until a decision maps them to the current codebase.

## Imagery

Handbook rules for imagery:

- Use images only when they have a clear content purpose.
- Suitable platform imagery includes screenshots, explanatory visualizations, data-structure diagrams, and purposeful help graphics.
- Avoid decorative images, generic stock imagery, misleading film symbolism, and context images that distract from workflows.
- Make provenance transparent: photography, archival material, screenshot, visualization, or AI-generated image.
- Guiding rule: use an image only when it explains more than text alone.

## Motion

The current visual audit allows small functional transitions, loading spinners, and expected carousel movement. Non-essential motion should respect `prefers-reduced-motion`; do not add decorative motion to dense search/detail reading areas without an accepted decision.

## Assets

Primary visual assets are in `public/img/**`, `public/vid/**`, and generated image families. Before cleaning or replacing assets, read:

- `docs/repo-analysis/images.md`
- `scripts/optimize-images.mjs`
- `scripts/report-image-metadata.mjs`

Do not treat historic screenshots or mockups as proof that a feature is implemented.
