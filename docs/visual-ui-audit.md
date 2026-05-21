# Visual UI Audit: Icons, Buttons, And Non-Text UI

Scope: static inventory of Vue templates in `components/`, `pages/`, and `layouts/`.
Premise: keep component/page markup mostly semantic and move repeated visual rules into DaisyUI theme tokens or Tailwind component classes.

## Working Decisions

- Prefer default DaisyUI/Tailwind interaction behavior first. Only customize hover, focus-visible, active, disabled, loading, or selected states when the default is inaccessible, visually unclear, or inconsistent with an AVefi semantic token.
- Accessibility and WCAG come before animation. Motion should stay minor, functional, and respect `prefers-reduced-motion`.
- Third-party templates and class maps, especially Algolia and FormKit, may be intentionally customized. Leave them as-is unless they use duplicated AVefi-wide visual patterns that should become shared classes.
- Semantic colors should stay reserved for their meaning: `error`, `warning`, `success`, `info`, `comparison`, `favourites`, `work`, `manifestation`, and `item`.
- Dark-mode fixes should preferably happen through DaisyUI theme tokens or shared Tailwind component classes. Replace one-off `dark:bg-gray-*`, `dark:text-gray-*`, and `dark:border-gray-*` only when there is a clear semantic equivalent.

## Current Sources Of Truth

- `assets/scss/main.scss` defines the active DaisyUI v5 themes: `avefi_light` and `avefi_dark`.
- `tailwind.config.ts` defines older DaisyUI theme fallbacks plus a small Tailwind plugin with AVefi classes. Because Tailwind v4 is loaded through `assets/scss/main.scss`, shared classes that must render in the current app also need matching definitions in `main.scss`:
  - `.btn-favourites-list`
  - `.btn-compare-list`
  - `.badge-favourites-list`
  - `.badge-compare-list`
  - `.btn-highlight`
- AVefi domain colors already exist as theme/config concepts: `work`, `manifestation`, `item`, `highlight`, `favourites-list`, `compare-list`, `userinfo`.

## Inventory Snapshot

### Icons

Primary general-purpose icon set is `tabler:*`, but other sets are mixed in:

- `tabler:*`: dominant set.
- `formkit:*`: search, trash, close, caret/arrow icons. This should stay available because dataset merging and schema/form-heavy workflows will likely use FormKit.
- `carbon:*`: notebook/reference icons.
- `mi:*`, `material-symbols:*`, `fa:*`: isolated cases.

Most frequent icon names found:

- `tabler:chevron-right` and `tabler:chevron-left`: carousel, pagination, expandable UI.
- `tabler:alert-circle` / `tabler:alert-triangle`: alert/status states.
- `tabler:eye`: detail/view links.
- `tabler:arrow-right`: CTA links.
- `tabler:info-circle`: help/status hints.
- `tabler:external-link`: outbound links.
- `tabler:trash` and `formkit:trash`: destructive/removal actions.
- `tabler:dots` and `tabler:dots-vertical`: context menus.

Likely consistency issues:

- Same action uses different icon families without a clear context rule: `tabler:trash` vs `formkit:trash`; `formkit:close` vs `tabler:x` vs `tabler-x`.
- Icon sizing is mixed between `text-lg`, `text-xl`, `text-2xl`, `w-4 h-4`, `w-6 h-6`, `w-8 h-8`, `w-10 h-10`, and `size="..."`.
- Some decorative icons have `aria-hidden`, while others rely on surrounding labels but do not explicitly hide the icon.
- Many icons live inside text-bearing buttons, links, labels, badges, or stats where fixed pixel-like sizing may not be needed. These should usually inherit the surrounding text size.

### Buttons

Most common button classes:

- `btn-sm`
- `btn-primary`
- `btn-outline`
- `btn-circle`
- `btn-xs`
- `btn-ghost`
- `btn-glass`
- `btn-error`
- `btn-md`
- `btn-disabled`

Good existing patterns:

- Most actions use DaisyUI `btn` classes.
- Comparison/favourites have custom semantic button classes already.
- Many icon-only buttons have `aria-label` or `title`.

Likely consistency issues:

- Carousel arrows repeat long local class strings in several components.
- Error/destructive buttons sometimes rely on `btn-error`, sometimes add `text-white`, sometimes use manual `bg-red-500 hover:bg-red-600`.
- Search action buttons repeat local shapes such as `rounded-xl rounded-l-none`, `w-12 h-12`, `lg:btn-lg`.
- A few non-button elements use `role="button"` with button styling.

### Badges

Common badge patterns:

- `badge-sm`, `badge-xs`, `badge-outline`
- `badge-primary`, `badge-secondary`, `badge-accent`, `badge-neutral`
- custom `badge-favourites-list`, `badge-compare-list`
- repeated highlight chips: `badge badge-xs bg-highlight text-white`
- category badges via `MicroBadgeCategoryComp`

Likely consistency issues:

- Highlight badges should probably become a semantic `.badge-highlight`.
- Text color is often forced with `text-white` instead of using `*-content` theme tokens.
- Category badges mix local component logic with global color semantics.

### Alerts And Status Visuals

Common patterns:

- `alert-error`: search backend, compare URL errors, admin errors, carousel errors.
- `alert-info`: larger result notices, admin informational states.
- `alert-warning`: stale/orphan tooltip warnings.
- Loading states: DaisyUI `loading loading-spinner`, skeleton blocks, and a new `MicroLoadingSpinner`.
- Empty states: `NoResultsComp`, carousel empty text.

Likely consistency issues:

- Error alerts use different icons and icon sizes (`alert-circle`, `alert-triangle`, `w-6 h-6`, no size).
- Some alert containers rely on DaisyUI only; others layer custom backgrounds or text colors.
- Loading status visuals are split between raw DaisyUI spans and a reusable spinner component.
- Interaction states should mostly inherit DaisyUI behavior. Custom hover/focus/disabled styles should be extracted only if repeated or required for accessibility.

## Repeated Local Styling To Move Toward Config

### 1. Carousel Controls

Current pattern repeats in:

- `components/global/CarouselCardComp.vue`
- `components/global/IssuerCarouselComp.vue`
- `components/global/PartnersCarouselComp.vue`
- `components/global/ReusableCarousel.vue`

Typical local class shape:

```text
absolute ... btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow ... w-10 h-10
```

Suggested config class:

```text
.btn-carousel-control
```

Possible variants:

```text
.btn-carousel-control-prev
.btn-carousel-control-next
.btn-carousel-control-mobile
```

Goal: component markup keeps only placement variant plus semantic button class.

### 2. Icon-Only Action Buttons

Current repeated contexts:

- context menus: dots buttons
- export/copy/transfer buttons
- drawer close/remove buttons
- search options

Suggested config classes:

```text
.btn-icon
.btn-icon-sm
.btn-icon-danger
.btn-icon-muted
```

Goal: avoid local `w-8 h-8`, `w-12 h-12`, `text-lg`, `btn-circle`, and color overrides being repeated.

### 3. Destructive Actions

Current variations:

- `btn btn-error`
- `btn btn-error text-white`
- `bg-red-500 hover:bg-red-600 text-white`
- Algolia class maps with manual red hover states.

Suggested config classes:

```text
.btn-danger
.btn-danger-outline
.action-remove
```

Also keep DaisyUI `error-content` white in the theme so components do not need `text-white`.

### 4. Highlight And Domain Badges

Current variations:

- `badge badge-xs bg-highlight text-white`
- `badge-favourites-list`
- `badge-compare-list`
- category-specific local logic in `BadgeCategoryComp`

Suggested config classes:

```text
.badge-highlight
.badge-domain-work
.badge-domain-manifestation
.badge-domain-item
```

Goal: move visual identity to Tailwind/DaisyUI tokens and keep components semantic.

### 5. Search Panels And Filters

Current patterns use many local gray utilities:

- `bg-white dark:bg-gray-900`
- `text-gray-700 dark:text-gray-200`
- `border-gray-*`
- custom hover colors for refinement chips.

The static scan found about 260 local gray/dark-gray utility references in Vue files.

Suggested config classes:

```text
.panel-surface
.panel-surface-muted
.filter-chip
.filter-chip-remove
.search-control-row
```

Goal: keep search/filter layout readable while moving repeated dark-mode and hover color choices into one place.

Dark-mode approach:

- Do not blindly replace every `dark:bg-gray-*`.
- First ask whether the element is a semantic surface, panel, chip, menu, alert, drawer, or metadata row.
- If yes, move it toward a shared class or DaisyUI token such as `bg-base-100`, `bg-base-200`, `text-base-content`, `border-base-300`, `.panel-surface`, or `.filter-chip`.
- If no semantic equivalent exists, keep the local class until a visual contract exists for that context.

Implemented example:

- `components/global/JsonTreeViewer.vue` now avoids `:global(.dark)` overrides and uses local CSS variables mapped to DaisyUI theme tokens (`--color-base-*`, `--color-primary`, `--color-success`, `--color-warning`, `--color-info`) so both light and dark modes are inherited without global selector coupling.

## Proposed Icon Conventions

Prefer one icon family per shared action within the same context. FormKit icons remain valid for FormKit/forms/schema-driven merge interfaces; Tabler is preferred for general app navigation, search results, drawers, alerts, and global actions.

| Action | Preferred Icon |
| --- | --- |
| More/options | `tabler:dots` |
| Close/remove dialog | `tabler:x` |
| Delete/remove item | `tabler:trash` |
| Export/download | `tabler:download` |
| External link | `tabler:external-link` |
| Info/help | `tabler:info-circle` |
| Previous/next | `tabler:chevron-left` / `tabler:chevron-right` |
| Expand/collapse | `tabler:chevron-down` / `tabler:chevron-up` |
| View details | `tabler:eye` |

FormKit-specific exception:

| Context | Preferred Icon Source |
| --- | --- |
| FormKit-rendered form controls | `formkit:*` |
| Dataset merge/schema editing workflows | `formkit:*` when it matches FormKit UI vocabulary |
| General destructive app actions outside forms | `tabler:trash` |
| General global close/menu actions outside forms | `tabler:x`, `tabler:dots` |

Suggested size scale:

| Context | Size |
| --- | --- |
| Icon inside normal text, links, badges, or labeled buttons | inherit text size, optionally `size="1em"` |
| Inline metadata icon that must align with compact rows | `size="1em"` or a shared `.icon-inline` class |
| Icon-only button icon | shared `.icon-button-icon` class, not local `w-* h-*` |
| Alert/status icon | shared `.icon-status` class |
| Empty state icon | shared `.icon-empty-state` class |

Sizing principle:

- If the icon sits beside visible text, rely on the parent text size and line-height first.
- If the parent already provides size (`btn-sm`, `btn-xs`, `btn-lg`, `badge-xs`, `text-sm`, `card-title`), avoid hard-coded `w-* h-*`, `text-lg`, or numeric `size="18"` unless alignment breaks without it.
- Use fixed dimensions only where the icon defines the control target or layout: icon-only buttons, carousel arrows, status/alert icons, empty states, stable table/action columns, or intentionally compact metadata rows.
- Prefer config classes for fixed sizing rather than local classes in pages/components.

Accessibility rule:

- Icon-only controls need an accessible label on the button.
- Icons inside labeled buttons should generally be `aria-hidden="true"`.
- Status icons in alerts should be decorative unless the icon adds meaning not present in text.

## Recommended Streamlining Order

1. **Config foundation**
   - Add Tailwind plugin component classes for carousel controls, icon buttons, danger buttons, highlight badges, and panel surfaces.
   - Keep/align DaisyUI theme tokens in `assets/scss/main.scss` first; treat `tailwind.config.ts` theme fallback as secondary.
   - Add text-relative icon utilities such as `.icon-inline`, `.icon-action`, `.icon-status`, and `.icon-empty-state`.
   - Let DaisyUI default interaction states stand unless a shared class has a documented reason to override them.
  - Status: shared classes are now active in `assets/scss/main.scss`, with `tailwind.config.ts` kept as fallback/legacy config. This fixes the v4 loading issue where config-only custom classes were not reliably visible in the app.

2. **Low-risk repeated controls**
  - Carousel controls. Status: standardized `btn-carousel-control` usage is in `CarouselCardComp.vue`, `IssuerCarouselComp.vue`, `PartnersCarouselComp.vue`, and `ReusableCarousel.vue` with desktop/mobile visibility classes preserved.
   - Dots/options buttons.
   - Close buttons.
   - Remove/trash buttons.

3. **Search and filter UI**
   - Move active refinement chip visuals into config classes.
   - Normalize clear/remove filter buttons.
   - Reduce local gray/dark-gray utilities.
  - Status: destructive/search-clear button replacements are done in `InstantSearchTemplateAVefi.vue` and `InstitutionListComp.vue`; active refinement chips now use `.filter-chip`; icon-size normalization was extended in `ManifestationListSplitView.vue`, `SearchListFlatComp.vue`, `PanelRefinementListComp.vue`, `WorkViewCompAVefi.vue`, and `normdata.vue`. Deeper Algolia layout classes are still deferred.

4. **Badges and domain labels**
   - Add `.badge-highlight` and domain badge classes.
   - Replace forced `text-white` where a content token exists.
   - Status: highlight badge replacements started in `GenericIconList.vue` and `HighlightListComp.vue`.

5. **Visual review pass**
   - Compare light/dark mode.
   - Check hover/focus/disabled states.
   - Check keyboard focus visibility.
   - Check touch target sizing for icon-only buttons.

6. **Third-party template pass**
   - Review Algolia/FormKit class maps after shared classes exist.
   - Keep intentional third-party customization.
   - Replace only repeated AVefi-wide patterns, not local third-party layout requirements.

## First Good Candidates

These are small enough to streamline without changing behavior:

- Carousel arrow buttons across `CarouselCardComp`, `IssuerCarouselComp`, `PartnersCarouselComp`, and `ReusableCarousel`.
- `tabler:trash` vs `formkit:trash` in search refinements and comparison drawer, deciding by context rather than banning FormKit icons.
- `formkit:close` vs `tabler:x` in drawers/modals, while keeping FormKit icons for form/merge-specific interfaces.
- `badge badge-xs bg-highlight text-white` in `GenericIconList` and `HighlightListComp`.
- `btn-error text-white` and `bg-red-500 hover:bg-red-600` destructive buttons.

Progress update:

- `tabler:trash` vs `formkit:trash`: normalized for non-FormKit destructive actions in search/list flows.
- `formkit:close` vs `tabler:x`: normalized in `ComparisonDrawer.vue` and `FacetDrawer.vue`.

## Icon And Button Sizing Follow-Up

Static scan notes:

- About 200 icon/button sizing references were found across Vue files (`w-4 h-4`, `w-6 h-6`, `text-lg`, `text-xl`, `size="..."`, fixed button dimensions).
- Many of these are in components where the parent already carries text/size semantics, such as `btn-sm`, `btn-xs`, `btn-lg`, `badge-xs`, `text-sm`, or `card-title`.
- Good existing example: `SameAsComp.vue` uses `size="1em"` for notebook/reference icons, which follows surrounding text size.

Likely no longer needed, or better as shared classes:

- Icons in labeled buttons:
  - `ExportDataComp.vue`: download icon has both `text-xl` and `w-4 h-4` even though the button and label define scale.
  - `InstantSearchTemplateAVefi.vue`: share/suggest menu icons use `w-4 h-4` beside visible text.
  - `error-500.vue` and `[...slug].vue`: home/refresh/back icons use `w-4 h-4` inside small labeled buttons.
- Icons in compact labels/metadata:
  - `ManifestationHeaderComp.vue`: paint/language icons use fixed `w-4 h-4` beside text.
  - `SearchListCompactComp.vue`: map/calendar/users icons use fixed `w-3.5 h-3.5` inside compact metadata rows. These may be acceptable, but should be moved to `.icon-inline-muted` if repeated.
- Icon-only controls where fixed sizing is valid but should move to config:
  - carousel arrows with repeated `w-10 h-10`.
  - comparison drawer row actions with repeated `w-8 h-8`.
  - search options button with repeated `w-12 h-12`.
- Alerts/status icons where fixed sizing is valid but should be semantic:
  - `alert-circle` / `alert-triangle` with `w-6 h-6` or `w-8 h-8`.

Proposed utility classes:

```text
.icon-inline          -> size: 1em; flex-shrink: 0;
.icon-inline-muted    -> size: 1em; flex-shrink: 0; color: currentColor;
.icon-action          -> size: 1.25em; flex-shrink: 0;
.icon-status          -> @apply w-6 h-6 shrink-0;
.icon-empty-state     -> @apply w-8 h-8 shrink-0;
.btn-icon             -> @apply btn btn-circle;
.btn-icon-sm          -> @apply btn btn-circle btn-sm;
.btn-icon-xs          -> @apply btn btn-circle btn-xs;
.btn-carousel-control -> repeated carousel button visual rules;
```

Audit rule for future edits:

- Remove local icon sizing from text-bearing controls first.
- Keep fixed sizes for icon-only controls, but move them into Tailwind plugin classes.
- Do not add page/component-specific pixel or width/height classes unless the parent cannot provide stable sizing.

## Motion Policy

- Allowed by default:
  - small opacity/translate transitions for empty states, menus, drawers, and status feedback.
  - loading spinners where they communicate waiting.
  - carousel movement when user-initiated or already expected by the component.
- Avoid:
  - decorative motion without information value.
  - long or looping motion near dense reading/search areas.
  - animations that delay status feedback.
- Required:
  - all non-essential animation must respect `prefers-reduced-motion`.
  - animated controls must remain keyboard and screen-reader usable without relying on the animation.
