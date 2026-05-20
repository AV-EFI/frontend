<template>
    <section
        class="no-results-state"
        role="status"
        aria-live="polite"
        aria-atomic="true"
    >
        <div class="no-results-mark" aria-hidden="true">
            <Icon name="tabler:mood-empty" class="h-8 w-8" />
        </div>

        <div class="no-results-copy">
            <h2 class="text-base font-semibold text-base-content">
                {{ $t('noResults') }}
            </h2>
            <p class="text-sm leading-6 text-base-content/70">
                {{ $t('tryClearingFiltersOrQuery') }}
            </p>
        </div>
    </section>
</template>

<style scoped>
.no-results-state {
  width: min(100%, 42rem);
  margin: 1.5rem auto;
  padding: 2rem 1.5rem;
  display: grid;
  justify-items: center;
  gap: 0.875rem;
  border-block: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  color: inherit;
  text-align: center;
  animation: noResultsEnter 180ms ease-out both;
}

.no-results-mark {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in oklch, currentColor 16%, transparent);
  border-radius: 999px;
  color: var(--color-primary, #4d768d);
  background: color-mix(in oklch, currentColor 4%, transparent);
}

.no-results-copy {
  display: grid;
  gap: 0.25rem;
  max-width: 32rem;
}

@keyframes noResultsEnter {
  from {
    opacity: 0;
    transform: translateY(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .no-results-state {
    animation: none;
  }
}
</style>
