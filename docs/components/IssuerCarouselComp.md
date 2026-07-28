# `IssuerCarouselComp.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/global/IssuerCarouselComp.vue`
- Matching tests:
  - `tests/unit/source-guards/home-carousels-a11y.contract.spec.ts`

## Props

- `autoSlideInterval`

## Emits

_None found by static scan._

## Reactive State

- `canAutoplay (computed)`
- `carouselStatus (computed)`
- `currentSlideIndex (ref)`
- `error (computed)`
- `isAutoplayPaused (ref)`
- `isReady (computed)`
- `loading (computed)`
- `visibleSlideIndexes (ref)`

## Watchers

_None found by static scan._

## Functions

- `getIssuerCategoryCount`
- `getSlideAriaLabel`
- `initEmbla`
- `isSlideHidden`
- `nextSlide`
- `prevSlide`
- `toggleAutoplay`
- `updateVisibleSlides`

## Lifecycle Hooks

- `onBeforeUnmount`
- `onMounted`

## Exposed Methods

_None found by static scan._

## Local Imports

- `~/data/issuer-images.json`

## Template Component Tags

- `Icon`
- `NuxtLink`

## Shared Classes Used

- `icon-status`
- `btn-carousel-control`
