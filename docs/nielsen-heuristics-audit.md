# Nielsen's 10 Usability Heuristics â€“ AVefi Frontend Audit

> **Date:** 2026-04-23  
> **Scope:** All components under `components/`, `pages/`, `layouts/`, `composables/`  
> **Method:** Static code review with WCAG/ARIA cross-check

---

## Severity Scale

| Level | Meaning |
|-------|---------|
| ðŸ”´ **Critical** | Blocks task completion or heavily misleads users |
| ðŸŸ  **Major** | Significant friction; visible to most users |
| ðŸŸ¡ **Minor** | Noticeable but easily worked around |
| ðŸŸ¢ **Cosmetic** | Polished improvement, low impact |

---

## Summary Table

| # | Heuristic | Severity | Violations |
|---|-----------|----------|-----------|
| 1 | Visibility of System Status | ðŸŸ  Major | 4 |
| 2 | Match Between System and Real World | ðŸŸ  Major | 4 |
| 3 | User Control and Freedom | ðŸŸ  Major | 3 |
| 4 | Consistency and Standards | ðŸŸ  Major | 4 |
| 5 | Error Prevention | ðŸ”´ Critical | 3 |
| 6 | Recognition Rather Than Recall | ðŸŸ¡ Minor | 3 |
| 7 | Flexibility and Efficiency of Use | ðŸŸ¡ Minor | 3 |
| 8 | Aesthetic and Minimalist Design | ðŸŸ¡ Minor | 3 |
| 9 | Help Users Recognize, Diagnose, and Recover from Errors | ðŸ”´ Critical | 4 |
| 10 | Help and Documentation | ðŸŸ¡ Minor | 2 |

---

## Detailed Findings

---

### H5 Â· Error Prevention â€” ðŸ”´ Critical

---

#### 5.1 Â· `aria-expanded` hardcoded to `false` (never reactive)

**Files:** `components/global/ActionContextComp.vue:3`, `components/global/NavBar.vue:141`

```html
<!-- ActionContextComp.vue â€“ always says "not expanded" even when open -->
<div tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" â€¦>
```

The dropdown trigger announces itself as collapsed to AT users regardless of actual open state. Screen-reader users receive false information on every interaction.

**Fix:** Bind dynamically.

```html
<!-- ActionContextComp.vue â€“ reactive -->
<div
  ref="triggerRef"
  tabindex="0"
  role="button"
  aria-haspopup="true"
  :aria-expanded="menuOpen.toString()"
  @click="menuOpen = !menuOpen"
  @keydown.enter.prevent="menuOpen = !menuOpen"
  @keydown.space.prevent="menuOpen = !menuOpen"
  @keydown.escape.prevent="menuOpen = false"
>
```

> **Component opportunity:** A shared `<DropdownTrigger>` wrapper that manages `aria-expanded`, `aria-controls`, escape-close, and click-outside in one place could replace the pattern in `ActionContextComp`, `ExportDataComp`, and the NavBar settings menu.

---

#### 5.2 Â· No confirmation before destructive comparison/favourites operations

**Files:** `components/global/ComparisonDrawer.vue`, `components/global/IndicatorComp.vue`

Clicking "Clear all" from the comparison drawer immediately destroys the entire list. There is no undo and no confirmation step. Users who accidentally trigger this lose all added items.

**Fix:** Introduce a confirmation gate or a timed undo toast.

> **Component opportunity:** `<ConfirmActionModal>` â€” generic modal that accepts a title, description, and two labelled action slots (confirm/cancel). Can also be used for "Remove from list?" actions on individual items.

```vue
<!-- ConfirmActionModal.vue (new) -->
<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
}>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <dialog
    v-if="open"
    class="modal modal-open"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'confirm-title'"
    @keydown.escape.prevent="emit('cancel')"
  >
    <div class="modal-box">
      <h3 id="confirm-title" class="font-bold text-lg" :class="variant === 'danger' ? 'text-error' : ''">
        {{ title }}
      </h3>
      <p v-if="description" class="py-4">{{ description }}</p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="emit('cancel')">
          {{ cancelLabel ?? $t('cancel') }}
        </button>
        <button
          class="btn"
          :class="variant === 'danger' ? 'btn-error' : 'btn-primary'"
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? $t('confirm') }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="emit('cancel')" />
  </dialog>
</template>
```

---

#### 5.3 Â· Numeric range inputs allow min > max without constraint

**File:** `components/search/PanelRefinementListComp.vue`

The year-range or numeric facet allows a user to type a min value that is larger than the max value. The "Apply" button remains enabled and sends the invalid range to Elasticsearch, resulting in zero results with no explanation.

**Fix:** Clamp or disable `Apply` when `min > max`.

```ts
// In PanelRefinementListComp setup
const isRangeValid = computed(() => {
  const [lo, hi] = pending.value ?? []
  return lo !== undefined && hi !== undefined ? lo <= hi : true
})
```

```html
<button
  class="btn btn-block btn-sm w-1/2 btn-primary"
  :disabled="!isRangeValid || !hasUnsaved(â€¦)"
>
  {{ $t('apply') }}
</button>
<p v-if="!isRangeValid" role="alert" class="text-xs text-error mt-1">
  {{ $t('rangeMinMustBeLessOrEqual') }}
</p>
```

---

### H9 Â· Help Users Recognize, Diagnose, and Recover from Errors â€” ðŸ”´ Critical

---

#### 9.1 Â· Generic error message in `SearchSection.vue`

**File:** `components/search/SearchSection.vue`

```html
<p v-else class="text-error text-sm">{{ $t('error') }}</p>
```

When InstantSearch fails to load the user sees only the word "Error" with no recovery path. There is no retry button, no contact link, and no explanation.

**Fix:** Use a reusable error state component with actionable recovery.

> **Component opportunity:** `<ErrorStateComp>` â€” standardised error display with icon, heading, descriptive message, and a primary recovery action (retry/go home/contact).

```vue
<!-- ErrorStateComp.vue (new) -->
<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  retryLabel?: string
  showContact?: boolean
}>()
const emit = defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8 text-center" role="alert">
    <Icon name="tabler:alert-circle" class="w-12 h-12 text-error" aria-hidden="true" />
    <h3 class="text-lg font-semibold">{{ title ?? $t('errorOccurred') }}</h3>
    <p v-if="description" class="text-sm text-base-content/70">{{ description }}</p>
    <div class="flex gap-3">
      <button v-if="$attrs.onRetry" class="btn btn-primary btn-sm" @click="emit('retry')">
        <Icon name="tabler:refresh" class="w-4 h-4" />
        {{ retryLabel ?? $t('tryAgain') }}
      </button>
      <button v-if="showContact" class="btn btn-ghost btn-sm" @click="$openContactDrawer()">
        {{ $t('contactUs') }}
      </button>
    </div>
  </div>
</template>
```

---

#### 9.2 Â· No inline field-level error messages in `ContactForm.vue`

**File:** `components/micro/ContactForm.vue`

The form uses `novalidate` and custom JS validation but never renders error text adjacent to invalid fields. Failed validation only shows a toast notification, which disappears. Screen-reader users get no persistent description of what went wrong. The `aria-describedby` wiring exists for help text but not for errors.

**Fix:** Add per-field error state rendered inline.

> **Component opportunity:** `<InlineFieldError>` â€” a small `<p role="alert">` wrapper with standard styling, consumed by any form field.

```vue
<!-- InlineFieldError.vue (new) -->
<script setup lang="ts">
defineProps<{ message?: string | null }>()
</script>

<template>
  <p
    v-if="message"
    role="alert"
    class="mt-1 text-xs text-error flex items-center gap-1"
  >
    <Icon name="tabler:alert-circle" class="w-3 h-3 shrink-0" aria-hidden="true" />
    {{ message }}
  </p>
</template>
```

Usage in `ContactForm.vue`:
```html
<input id="email" v-model="email" â€¦ :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'email-error' : 'emailHelp'">
<InlineFieldError id="email-error" :message="errors.email" />
```

---

#### 9.3 Â· Clipboard copy failure is silently swallowed

**File:** `pages/press.vue:313`, `utils/clipboard.ts`

```ts
console.error('Clipboard copy failed', clipboardError)
```

The user receives no feedback when clipboard copy fails (e.g., missing `https` in dev or permission denied). The copy icon shows no error state.

**Fix:** Show a toast or inline temporary error on failure. The `ClipboardComp.vue` already renders the icon; add an error feedback slot or use a shared status pattern.

---

#### 9.4 Â· Error-state fallback in `error.vue` has no recovery guidance for non-404/500

**File:** `error.vue`

```html
<p class="text-base-content/70 mb-6">
  {{ error?.statusMessage || 'Something went wrong. Please try again.' }}
</p>
```

For anything other than 404/500 the user gets a bare card with no explanation, no contact link, and hardcoded English fallback text (`'Something went wrong. Please try again.'`). The `clearError` redirect button text ("Go to Homepage") is also not internationalised.

**Fix:** Replace hardcoded strings with i18n keys; add a contact link.

---

### H1 Â· Visibility of System Status â€” ðŸŸ  Major

---

#### 1.1 Â· `SkeletonLoaderComp` announces nothing to screen readers

**File:** `components/global/SkeletonLoaderComp.vue`

The skeleton has no accessible text. The containing `LoadingIndicator.vue` wraps it but passes only `aria-label="$t('loading')"` as a plain HTML attribute on a `<div>`, not `role="status"` or `aria-live`. Multiple parallel skeletons (used 5Ã—) produce 5 silent anonymous regions.

**Fix:** Either add a `role="status"` + `aria-label` to `SkeletonLoaderComp` itself or have `LoadingIndicator` emit a single live region.

> **Existing component to extend:** `LoadingScreen.vue` already models this correctly with `role="status"` and `aria-live="polite"` + `sr-only` text. Copy that pattern down to `SkeletonLoaderComp`.

---

#### 1.2 Â· `NoResultsComp` delays feedback by ~3 seconds (animation)

**File:** `components/search/NoResultsComp.vue`

```ts
setTimeout(() => {
  setTimeout(() => {
    showEmojis.value = false
    showMagnifyingGlass.value = false
    showNothing.value = true
  }, 1800)
}, 900)
```

The actual "no results" message only appears after a ~2.7 s animation. During this window the `aria-live="polite"` region is empty. Users (particularly screen-reader users) get no system status for nearly 3 seconds.

**Fix:** Render the sr-only no-results text immediately; keep the animation as pure visual sugar.

```html
<!-- always present for AT, but visually delayed -->
<span class="sr-only" aria-live="polite">
  {{ $t('noResults') }}
</span>
```

---

#### 1.3 Â· `FacetDrawer` `aria-busy` not propagated to the live region

**File:** `components/global/FacetDrawer.vue:25`

```html
<div â€¦ :aria-busy="isSearchLoading">
```

`aria-busy` is set on the container `div`, but there is no `aria-live` region inside it. AT will not announce that the facets are updating unless they actively navigate into the live element. The overlay spinner has no accessible label.

**Fix:** Add a visually-hidden live region inside the drawer that announces "Filters loading" / "Filters ready".

---

#### 1.4 Â· `IndicatorComp` hidden on mobile via CSS `display:none`

**File:** `components/global/IndicatorComp.vue`

```css
.avefi_indicator { display: none; }
@media screen and (min-width: 768px) {
  .avefi_indicator { display: inline-flex; â€¦ }
}
```

The comparison/favourites indicator is completely invisible on mobile. Users on small screens cannot see how many items are in their comparison list, violating the "always show system status" principle.

**Fix:** Provide a mobile-accessible status â€” either move count badges into the mobile nav menu or show a bottom-bar indicator.

---

### H2 Â· Match Between System and Real World â€” ðŸŸ  Major

---


#### 2.2 Â· `IndicatorComp` badge titles are swapped

**File:** `components/global/IndicatorComp.vue`

```html
<div â€¦ :title="$t('elementsincomparison')" :aria-label="`${$t('elementsincomparison')}: ${favourites.objects?.length}`">
  {{ favourites.objects?.length }}     <!-- shows favourites count! -->
</div>
<div â€¦ :title="$t('elementsinfavourites')" :aria-label="`${$t('elementsinfavourites')}: ${objectListStore.objects?.length}`">
  {{ objectListStore.objects?.length }}  <!-- shows comparison count! -->
</div>
```

The tooltip for "favourites" badge uses the `elementsincomparison` key and vice versa. The numbers shown are correct but the labels are swapped.

**Fix:** Swap the i18n keys so each label matches its value.

---

#### 2.3 Â· `SendValueComp` uses right-arrow icon for "copy/transfer"

**File:** `components/global/SendValueComp.vue`

The data-transfer action uses `tabler:arrow-right`, which universally means "navigate forward" in a UI. The action is actually "copy this value to the merge target". Users in the merge tool may click the arrow expecting navigation rather than data transfer.

**Fix:** Use a more specific icon such as `tabler:clipboard-copy` or `tabler:transfer` and add a visible label.

---

#### 2.4 Â· `RawDataCollapse` shows raw JSON to all users

**File:** `components/global/RawDataCollapse.vue`

The component renders an unlabelled checkbox and the text "JSON data" as its visible affordance. This pattern is more suited to a developer debug panel than end-user-facing UI. The checkbox has no `id`, `name`, or `aria-label`.

**Fix:** At minimum add `<label>` wiring. For non-admin users, hide the component or replace with a human-readable summary.

---

### H3 Â· User Control and Freedom â€” ðŸŸ  Major

---

#### 3.1 Â· Export menu has no click-outside-to-close

**File:** `components/global/ExportDataComp.vue`

```ts
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
```

There is no click-outside listener. Once the export dropdown is open, the user must click the trigger button again to close it. Pressing Escape also does nothing.

**Fix:** Add a `onClickOutside` (VueUse) or a `document.addEventListener('click', ...)` cleanup, and handle `@keydown.escape`.

> **Component opportunity:** `<DropdownMenu>` â€” a composable wrapper that manages open state, click-outside, Escape-close, and `aria-expanded`. Reusable by `ExportDataComp`, `ActionContextComp`, and the NavBar settings menu.

---

#### 3.2 Â· Disabled tabs in `ComparisonDrawer` give no explanation

**File:** `components/global/ComparisonDrawer.vue`

```html
<button â€¦ :disabled="!comparisonHasItems" @click="activeTab = 'comparison'">
  {{ $t('comparison') }}
</button>
```

The tab is simply `disabled` with no tooltip or label explaining that it will be enabled once items are added. Users cannot distinguish "this feature doesn't exist" from "add items first".

**Fix:** Replace native `disabled` with `aria-disabled` plus a `TooltipInfo` that explains the condition.

> **Existing component to reuse:** `TooltipInfo.vue` is already positioned-correctly and keyboard-accessible â€” wrap the disabled tab trigger with it.

---

#### 3.3 Â· No undo for adding/removing items from comparison or favourites

**File:** `composables/states.ts`, `stores/compareList.ts`, `stores/favourites.ts`

Both "Add to comparison" and "Add to favourites" are irreversible single-click actions. There is no toast-level undo. This is especially problematic in the merge tool where clearing the selection loses the user's work context.

**Fix:** After add/remove, show a dismissible toast with an "Undo" action that restores the previous state for ~5 s.

> **Component opportunity:** `<UndoToast>` â€” extends `vue3-toastify` with a reactive countdown and an undo callback.

---

### H4 Â· Consistency and Standards â€” ðŸŸ  Major

---

#### 4.1 Â· Hardcoded badge number in NavBar

**File:** `components/global/NavBar.vue`

```html
<a href="/protected/mergetool">{{ $t('mergeTool') }}
  <span class="badge badge-accent text-white">1</span>
</a>
```

A static `1` badge is hardcoded next to the MergeTool link. If this is meant to indicate "new feature" it should use a semantic label; if it counts pending items it should be driven by a store value. As-is it permanently displays `1` regardless of state.

**Fix:** Remove, or bind to a real count from a store.

---

#### 4.2 Â· `ThemeSwitch` `swap-off`/`swap-on` semantics are inverted

**File:** `components/global/ThemeSwitch.vue`

DaisyUI's `swap` component shows `swap-off` when the checkbox is **unchecked** (falsy) and `swap-on` when **checked** (truthy). In the component, `isLight` is `true` for light mode. When in light mode the checkbox is checked, so `swap-on` should represent the "in light mode" state â€” but `swap-on` contains the sun icon and no label, while `swap-off` contains the moon icon. The `alt` attributes on the wrapper divs are meaningless on `<div>` elements.

**Fix:** Use `aria-label` on the `<input>` that reflects the **current** theme, not the target:

```html
<input
  v-model="isLight"
  type="checkbox"
  class="hidden"
  :aria-label="isLight ? $t('switchToDarkMode') : $t('switchToLightMode')"
/>
```

---

#### 4.3 Â· `LanguageSwitch` uses abbreviations only ("De"/"En")

**File:** `components/global/LanguageSwitch.vue`

The language toggle shows only `De` / `En` â€” two-letter abbreviations with no visible full name or flag. Users unfamiliar with German/English ISO codes may not recognise these. Additionally the `aria-label` on the `<label>` wrapper duplicates the swap-off/swap-on labels without announcing the current state.

**Fix:** Show the full locale name on wider viewports; ensure the toggle aria-label announces the **action** not the current state.

---

#### 4.4 Â· Inconsistent loading patterns across pages

Multiple loading patterns co-exist without a standard:

| Pattern | Location |
|---------|---------|
| `SkeletonLoaderComp` | `SearchHitsComp`, `WorkViewCompAVefi` |
| Raw DaisyUI `loading-spinner` | `search/index.vue`, `search/[...slug].vue` |
| `LoadingScreen` splash | `app.vue` |
| `LoadingIndicator` wrapper | `SearchListFlatComp` |

None of them produce consistent SR announcements. **Fix:** standardise on `SkeletonLoaderComp` with the `role="status"` + sr-only text pattern from `LoadingScreen`.

---

### H6 Â· Recognition Rather Than Recall â€” ðŸŸ¡ Minor

---

#### 6.1 Â· Sidebar navigation in `WorkViewCompAVefi` uses internal type codes

**File:** `components/views/WorkViewCompAVefi.vue`

```html
<span v-if="normalizedEvents?.length > 0">
  {{ $t(normalizedEvents[0]?.raw?.category) }}
</span>
```

If the `$t()` call returns the raw key (missing translation), sidebar labels display strings like `avefi:ProductionEvent` to users.

**Fix:** Add a guard fallback label and ensure all `avefi:*` category keys have translations.

---

#### 6.2 Â· `ActionContextComp` silently hides for non-WorkVariant items

**File:** `components/global/ActionContextComp.vue`

```html
<div v-if="item?.has_record?.category === 'avefi:WorkVariant'" â€¦>
```

The three-dot menu button is completely absent for Manifestations and Items. Users who have learned that the button exists on some records will search for it elsewhere, having to recall from memory that it is category-specific.

**Fix:** Either render the button for all categories (with context-appropriate actions) or show a disabled button with a tooltip explaining unavailability.

---

#### 6.3 Â· No persistent visual indicator of active facets from facet drawer on mobile

**File:** `components/global/FacetDrawer.vue`, `components/search/SearchSection.vue`

On mobile the facet drawer closes after selection. The only visible count of active refinements is inside the closed drawer header. There is no summary of active filters visible on the results page while the drawer is closed.

**Fix:** Add a "Filters active: N" chip row below the search bar, similar to the `PanelRefinementListComp` approach in desktop view.

> **Component opportunity:** `<ActiveFiltersBar>` â€” renders active refinements as removable chips. Reuse the AlgoliaInstantSearch `ais-current-refinements` slot.

---

### H7 Â· Flexibility and Efficiency of Use â€” ðŸŸ¡ Minor

---

#### 7.1 Â· No keyboard shortcuts documented or implemented

**Files:** global

There are no keyboard shortcuts for power users: no shortcut to focus the search bar (e.g., `/`), no shortcut to open the facet drawer, and no shortcut to navigate between results. The app is keyboard-traversable but not keyboard-efficient.

**Fix:** Implement at minimum a `/` focus-search shortcut using a global `keydown` listener. Document it in the accessibility page.

---


#### 7.3 Â· No "save search" / "share search" affordance in the main search UI

**File:** `components/search/SearchQueryAutocomplete.vue`, `pages/search/index.vue`

Recent searches are stored client-side and the URL does encode the active query and facets, but there is no button that copies the current search URL to clipboard or saves it as a named search. Users must manually copy the URL from the address bar.

**Fix:** Add a "Share / Copy link" action to the search header toolbar.

---

### H8 Â· Aesthetic and Minimalist Design â€” ðŸŸ¡ Minor

---

#### 8.1 Â· `v-html` used for claim text in NavBar

**File:** `components/global/NavBar.vue`

```html
<span class="bree my-auto" v-html="$t('avefiClaimHtml').replace('. ', '<br/>')" />
```

Using `v-html` for UI text introduces XSS risk surface and couples layout logic (line-break) into a translation string. The `.replace('. ', '<br/>')` is fragile â€” it breaks for locales where the sentence structure differs.

**Fix:** Use CSS `white-space: pre-line` and `\n` in the translation string, or split into two separate i18n keys.

---

#### 8.2 Â· Duplicate work-navigation UI for desktop and mobile in `WorkViewCompAVefi`

**File:** `components/views/WorkViewCompAVefi.vue`

The component renders a full `<aside>` sidebar for desktop **and** a completely separate mobile `<div class="drawer â€¦">` with almost identical content. This doubles maintenance overhead and risks the two going out of sync.

**Fix:** Extract the navigation list into a shared `<WorkNavList>` slot component and render it inside both containers.

---

#### 8.3 Â· `CompareViewEditor.vue` has leftover `console.log` calls in production

**File:** `components/global/CompareViewEditor.vue`

```ts
console.log(targetPropertyValue, targetPropertyName, sameAsId)
```

Debug statements remain in production paths of the merge tool, polluting the browser console for all users.

**Fix:** Remove or replace with a conditional `import.meta.dev` guard.

---

### H10 Â· Help and Documentation â€” ðŸŸ¡ Minor

---

#### 10.1 Â· `RawDataCollapse` unlabelled and not gated by user role

**File:** `components/global/RawDataCollapse.vue`

The collapse section shows raw JSON data with no role check and a checkbox that has no `id`, no `<label for="...">` association, and no aria attributes. It appears throughout detail views.

**Fix:** Gate with `v-if="data?.user?.role === 'admin'"` or equivalent, and fix the label association.

---

#### 10.2 Â· No onboarding or contextual first-visit hints

**Files:** `pages/index.vue`, `components/search/*`

New users encounter the search-first hero, the facet panel, and the three view modes (accordion / flat / table) without any guided introduction. The FAQ is reachable but not proactively surfaced. There is no "learn more" hint adjacent to non-obvious controls.

**Fix:** A single dismissible hint banner per non-trivial feature area is sufficient.

> **Component opportunity:** `<OnboardingHint>` â€” dismisses itself to `localStorage`, only shown on first visit, uses `TooltipInfo` anatomy but as a callout rather than inline tooltip.

```vue
<!-- OnboardingHint.vue (new) -->
<script setup lang="ts">
const props = defineProps<{
  storageKey: string
  text: string
}>()
const dismissed = useLocalStorage(`hint-${props.storageKey}`, false)
</script>

<template>
  <Transition name="fade">
    <aside
      v-if="!dismissed"
      role="note"
      class="flex items-start gap-2 rounded-md bg-primary/10 p-3 text-sm"
    >
      <Icon name="tabler:bulb" class="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <span class="flex-1">{{ text }}</span>
      <button
        class="btn btn-xs btn-ghost"
        :aria-label="$t('dismissHint')"
        @click="dismissed = true"
      >
        <Icon name="tabler:x" aria-hidden="true" />
      </button>
    </aside>
  </Transition>
</template>
```

---

---

### H1-ADD Â· Toast System (Visibility of System Status) â€” ðŸŸ  Major

The `$toast` plugin (`plugins/01_vue3-toastify.ts`) is the primary feedback channel for user actions across the app. These findings are specific to how it is used (not the plugin implementation itself, which is solid).

---

#### T1 Â· Success toast messages are hardcoded English strings

**Files:** `components/global/ExportDataComp.vue:99â€“107`, `components/views/WorkViewEditorResult.vue:131`, `plugins/comparisonPlugin.ts:37`

```ts
$toast?.success?.('CSV exported!', { timeout: 2000 })
$toast?.success?.('JSON exported!', { timeout: 2000 })
$toast?.success?.('XML exported!', { timeout: 2000 })
$toast?.success?.("Form submitted")
toast && toast('Something happened')   // comparisonPlugin â€“ bare fallback
```

These strings are never passed through `$t()`. They appear in English regardless of the user's chosen locale. The bare `'Something happened'` fallback in `comparisonPlugin.ts` is particularly problematic â€” it is the catch-all for any add-to-list outcome not covered by the named branches.

**Fix:** Replace every hardcoded toast string with an i18n key. The `comparisonPlugin` catch-all should at minimum use `$t('unknownError')`.

---

#### T2 Â· Error toasts carry raw technical strings to the user

**Files:** `components/global/ExportDataComp.vue:110`, `components/global/ComparisonDrawer.vue:255`

```ts
$toast?.error?.(`Export failed: ${err}`, { timeout: 3000 })  // interpolates JS Error object
$toast?.error?.('Error')   // single word, no context
```

Serialising a JS `Error` object into a toast body may expose stack traces or internal API error messages. The one-word `'Error'` toast in `ComparisonDrawer` gives the user zero actionable information.

**Fix:** Strip the raw error object from user-facing toasts; log it to `console.error` instead. Use descriptive i18n messages with a contact-us follow-up action.

```ts
// ExportDataComp.vue
try { â€¦ }
catch (err) {
  console.error('[ExportDataComp] export failed', err)
  $toast?.error?.($t('exportFailed'), { timeout: 3000 })
}
```

---

#### T3 Â· No accessible `aria-live` fallback for toast notifications

**Files:** `plugins/01_vue3-toastify.ts`, all toast call-sites

`vue3-toastify` renders its container outside the Vue root via `ToastContainer`. The library does inject `role="alert"` on each toast, but only once the dynamic import resolves. During the bundle-loading window (deferred import) and in any SSR/hydration edge-case, toasts that fire early may not be announced.

Additionally, **there is no static `aria-live` region in `app.vue` or any layout that would announce toast-equivalent messages to AT when the toast container is not yet mounted.** The `sr-only role="status"` region in `app.vue` is used for route changes only.

**Fix:** For critical feedback (form submission, list-full warnings), pair the toast with a write to the existing `app.vue` live region, or add a secondary `aria-live="assertive"` region specifically for transient action feedback:

```html
<!-- app.vue â€“ add alongside existing sr-only status -->
<div id="toast-live" class="sr-only" aria-live="assertive" aria-atomic="true">
  {{ liveToastMessage }}
</div>
```

```ts
// composable: useLiveToast.ts
export function useLiveToast() {
  const liveToastMessage = useState('live-toast', () => '')
  function announce(msg: string) {
    liveToastMessage.value = ''
    nextTick(() => { liveToastMessage.value = msg })
  }
  return { announce }
}
```

> **Component opportunity:** `<LiveRegionToast>` â€” a thin wrapper that calls `$toast` AND writes to the live region simultaneously. Drop-in replacement for all `$toast.success/error/warn` call-sites.

---

### H1-ADD Â· Loading Status Patterns (Visibility of System Status) â€” ðŸŸ  Major

---

#### L1 Â· `loading-spinner` elements have `aria-live` but no `aria-label`

**Files:** `pages/search/index.vue`, `pages/search/[...slug].vue`, `components/search/SearchSection.vue`

```html
<!-- search/index.vue â€“ waiting for searchClient initialisation -->
<span class="loading loading-spinner loading-lg text-primary" />

<!-- SearchSection.vue -->
<span class="loading loading-spinner text-primary" aria-live="polite" aria-busy="true" />
```

The first example has no accessible information at all â€” it is an anonymous spinning icon. The second example adds `aria-live` to the spinner element itself, which is incorrect: `aria-live` is meant for a container whose **text content changes**, not for a purely visual spinner. Neither has an `aria-label` or a sibling `sr-only` text node.

**Fix:** Every standalone spinner should follow the `LoadingScreen.vue` model:

```html
<span
  role="status"
  aria-label="$t('loading')"
  class="loading loading-spinner text-primary"
  aria-hidden="true"
/>
<span class="sr-only">{{ $t('loading') }}</span>
```

> **Existing component to extend:** `LoadingIndicator.vue` wraps `SkeletonLoaderComp` but the skeleton itself has no sr-only text. A single `<LoadingSpinner>` micro-component would standardise all spinner instances (â‰ˆ8 across the codebase).

---

#### L2 Â· `loading-spinner` and `SkeletonLoaderComp` coexist without a shared contract

**Files:** `components/search/SearchHitsComp.vue`, `components/search/SearchSection.vue`, `pages/search/index.vue`, `pages/search/[...slug].vue`, `components/detail/PaginationComp.vue`

Five different loading representations are used interchangeably:

| Pattern | Used in |
|---------|---------|
| `SkeletonLoaderComp` repeated N times | `SearchHitsComp` |
| Raw `loading-spinner` DaisyUI class | `search/index.vue`, `[...slug].vue` |
| `<LoadingIndicator>` wrapper | `SearchListFlatComp` |
| Absolute overlay with spinner | `PaginationComp` |
| `LoadingScreen` splash | `app.vue` |

There is no single source of truth for "this section is loading." Inconsistency violates the standards heuristic and makes it harder for AT users to predict which pattern announces loading status.

**Fix:** Consolidate behind two patterns only:
- **Full-page / full-section:** `<LoadingScreen>` or full-width `<SkeletonLoaderComp>` with `role="status"` + sr-only text.
- **Inline / overlay:** a new `<InlineLoader>` micro-component with standardised accessible markup.

---

#### L3 Â· No loading state on initial search client hydration on the `/search` page

**File:** `pages/search/index.vue`

```ts
const isClient = typeof window !== 'undefined'
const searchClient = isClient ? Client({ â€¦ }) : null
```

```html
<div v-else class="text-center py-4">
  <span class="loading loading-spinner loading-lg text-primary" />
</div>
```

During SSR the `searchClient` is `null`, so the `v-else` spinner shows during hydration. This spinner has no role, no label, and no descriptive text. A user who lands on `/search` via a direct URL sees a silent spinner with no explanation of why the search is not yet available.

**Fix:** Apply the fix from L1 and add a brief caption below the spinner:

```html
<div class="text-center py-4 flex flex-col items-center gap-2">
  <span role="status" class="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
  <span class="sr-only">{{ $t('loading') }}</span>
  <p class="text-sm text-base-content/60">{{ $t('initialisingSearch') }}</p>
</div>
```

---

## Part II â€“ Existing UI Helper Components Assessment

### What exists

| Component | Pattern | Reusable As-Is? | Notes |
|-----------|---------|----------------|-------|
| `TooltipInfo.vue` | Teleported tooltip, keyboard + mouse, ARIA-compliant | âœ… Yes | Best-in-class implementation. Reuse for all "help" icons. |
| `GlossaryTermComp.vue` | Inline tooltip with external link | âœ… Yes | Good for domain term definitions. Missing viewport-edge clamping. |
| `GlossaryTextComp.vue` | Auto-annotates plain text with glossary links | âœ… Yes | Powerful pattern; extend to other structured text fields. |
| `SkeletonLoaderComp.vue` | Visual placeholder | âš ï¸ Extend | Missing `role="status"` + sr-only text. |
| `LoadingScreen.vue` | Splash + ARIA live region | âœ… Yes | Already fully accessible model. |
| `IndicatorComp.vue` | Fixed position status bar | âš ï¸ Extend | Hidden on mobile; labels swapped (H2.2). |
| `ClipboardComp.vue` | Copy-to-clipboard with icon button | âœ… Yes | Missing error feedback state. |
| `ExportDataComp.vue` | Export dropdown | âš ï¸ Extend | Missing click-outside close + Escape key. |
| `ActionContextComp.vue` | Three-dot context menu | âš ï¸ Fix | Hardcoded `aria-expanded="false"` (H5.1). |
| `ContactDrawer.vue` | Slide-in form drawer | âœ… Yes | Focus trap present; Escape key handled. |
| `ComparisonDrawer.vue` | Tabbed side drawer | âš ï¸ Extend | Disabled tabs lack explanation tooltip. |
| `BreadcrumbsComp.vue` | `<nav>` with `aria-current="page"` | âœ… Yes | Fully accessible. |

### New components recommended

| New Component | Replaces / Addresses | Priority |
|--------------|---------------------|---------|
| `ConfirmActionModal.vue` | H5.2 â€“ destructive actions | ðŸ”´ High |
| `ErrorStateComp.vue` | H9.1 â€“ generic error state | ðŸ”´ High |
| `InlineFieldError.vue` | H9.2 â€“ form field errors | ðŸ”´ High |
| `DropdownMenu.vue` | H3.1, H5.1 â€“ dropdown base with aria-expanded + close | ðŸŸ  Medium |
| `ActiveFiltersBar.vue` | H6.3 â€“ mobile filter visibility | ðŸŸ¡ Medium |
| `UndoToast.vue` | H3.3 â€“ reversible list actions | ðŸŸ¡ Medium |
| `OnboardingHint.vue` | H10.2 â€“ first-visit contextual help | ðŸŸ¡ Low |

---

## Quick-Win Checklist

The following are single-file fixes that can be done immediately without new components:

- [x] `ActionContextComp.vue` â€“ bind `:aria-expanded` dynamically
- [x] `IndicatorComp.vue` â€“ swap the two i18n label keys
- [ ] `NavBar.vue` â€“ replace hardcoded `1` badge with store value or remove
- [x] `CompareViewEditor.vue` â€“ remove `console.log` calls
- [x] `RawDataCollapse.vue` â€“ add `<label>` + `aria-label` to the checkbox
- [x] `ThemeSwitch.vue` â€“ fix `aria-label` to reflect current state (action vs. state label)
- [x] `error.vue` â€“ internationalise the "Go to Homepage" fallback string
- [x] `NoResultsComp.vue` â€“ render sr-only result text immediately, not after animation
- [ ] `PanelRefinementListComp.vue` â€“ disable Apply when `min > max`
- [x] `FacetDrawer.vue` â€“ fix `header-text` props to use i18n keys

