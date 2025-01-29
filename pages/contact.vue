<script setup lang="ts">
interface ApiPage {
  "data": {
        "id": number,
        "attributes": {
            "title": string,
            "createdAt": string,
            "updatedAt": string,
            "publishedAt": string,
            "locale": string,
            "FAQs": FAQ[],
            "DescriptionCK": string
        }
    },
    "meta": {}
}

interface FAQ {
  id: number,
  Question: string,
  Answer: string
}
definePageMeta({
    auth: false
});
</script>

<template>
  <div class="container mx-auto p-2 mb-2">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('help'), '/contact'],
      ]"
    />

    <div class="container">
      <div>
        <div
          role="alert"
          class="alert bg-neutral dark:bg-neutral-dark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-info h-6 w-6 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>TODO: add missing info</span>
        </div>
      </div>
      <article class="container flex justify-center">
        <div
          id="c7273"
          class="frame frame-default frame-type-text frame-layout-0 w-full md:w-2/3 text-balance text-justify"
        >
          <div class="collapse collapse-arrow mt-2">
            <input
              type="checkbox"
              checked
            >
            <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.about.heading') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('contact.about') }}
              </p>
            </div>
          </div>

          <div class="collapse collapse-arrow mt-2">
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.availableMetadata') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('contact.availableMetadataContent') }}
              </p>
            </div>
          </div>

          <div class="collapse collapse-arrow mt-2">
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.definitions') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('work') }}
                {{ $t('workContent') }}
                {{ $t('manifestation') }}
                {{ $t('manifestationContent') }}
                {{ $t('item') }}
                {{ $t('itemContent') }}
              </p>
            </div>

            <div class="collapse collapse-arrow mt-2">
              <input type="checkbox">
              <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
                <h2>
                  {{ $t('keywords') }}
                </h2>
              </div>
              <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
                <p class="my-2">
                  {{ $t('keywordsContent') }}
                </p>
              </div>
            </div>

            <div class="collapse collapse-arrow mt-2">
              <input type="checkbox">
              <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
                <h2>
                  {{ $t('usage') }}
                </h2>
              </div>
              <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
                <p class="my-2">
                  {{ $t('filmsViewable') }}
                  {{ $t('filmsViewableContent') }}
                  {{ $t('resultsUsage') }}
                  {{ $t('resultsUsageContent') }}
                  {{ $t('licensing') }}
                  {{ $t('licensingContent') }}
                </p>
              </div>
            </div>
          </div>

          <div class="collapse collapse-arrow mt-2">
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
              <h2>
                {{ $t('pids') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('pidsContent') }}
              </p>
            </div>
          </div>

          <div class="collapse collapse-arrow mt-2">
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.dataProviders') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              {{ $t('contact.dataProvidersContent') }}
              <ul>
                <li><a href="#">{{ $t('howToDoc') }}</a></li>
                <li><a href="#">{{ $t('manual') }}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>