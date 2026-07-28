# `CarouselCardComp.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/global/CarouselCardComp.vue`
- Matching tests:
  - `tests/unit/source-guards/carousel-card-contract.spec.ts`
  - `tests/unit/source-guards/home-carousels-a11y.contract.spec.ts`

## Props

- `items`

## Emits

- `create-item`

## Reactive State

- `canNavigate (computed)`
- `carouselStatus (computed)`
- `contactFormOpen (ref)`
- `contactInitialMessage (ref)`
- `createForm (ref)`
- `createOpen (ref)`
- `createSlideIndex (computed)`
- `currentSlideIndex (ref)`
- `isReady (computed)`
- `totalSlides (computed)`
- `visibleSlideIndexes (ref)`

## Watchers

_None found by static scan._

## Functions

- `getSlideAriaLabel`
- `handleCreate`
- `initEmbla`
- `isSlideHidden`
- `nextSlide`
- `prevSlide`
- `updateVisibleSlides`

## Lifecycle Hooks

- `onBeforeUnmount`
- `onMounted`

## Exposed Methods

_None found by static scan._

## Local Imports

_None found by static scan._

## Template Component Tags

- `Icon`
- `MicroContactForm`

## Shared Classes Used

- `btn-carousel-control`
