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
            "FAQs": FAQ[]
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
//const response:ApiPage = await $fetch<ApiPage>(`http://localhost:1337/api/pages/1?populate=*`);
//http://localhost:1337/api/articles/1?populate=*
const response = null;

</script>
<template>
  <div>
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
          class="alert bg-neutral"
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
          class="frame frame-default frame-type-text frame-layout-0 w-2/3 text-balance text-justify"
        >
          <section class="mt-2">
            <h2>{{ $t('contact.about.heading') }}</h2>
            <p>
              {{ $t('contact.about') }}
            </p>
          </section>

          <section class="mt-2">
            <h2>{{ $t('availableMetadata') }}</h2>
            <p>{{ $t('availableMetadataContent') }}</p>
          </section>

          <section class="mt-2">
            <h2>{{ $t('definitions') }}</h2>
        
            <h3>{{ $t('work') }}</h3>
            <p>{{ $t('workContent') }}</p>
        
            <h3>{{ $t('manifestation') }}</h3>
            <p>{{ $t('manifestationContent') }}</p>
        
            <h3>{{ $t('item') }}</h3>
            <p>{{ $t('itemContent') }}</p>
          </section>

          <section class="mt-2">
            <h2>{{ $t('keywords') }}</h2>
            <p>{{ $t('keywordsContent') }}</p>
          </section>

          <section class="mt-2">
            <h2>{{ $t('usage') }}</h2>
        
            <h3>{{ $t('filmsViewable') }}</h3>
            <p>{{ $t('filmsViewableContent') }}</p>
        
            <h3>{{ $t('resultsUsage') }}</h3>
            <p>{{ $t('resultsUsageContent') }}</p>
        
            <h3>{{ $t('licensing') }}</h3>
            <p>{{ $t('licensingContent') }}</p>
          </section>

          <section class="mt-2">
            <h2>{{ $t('pids') }}</h2>
            <p>{{ $t('pidsContent') }}</p>
          </section>

          <section class="mt-2">
            <h2>{{ $t('dataProviders') }}</h2>
            <p>{{ $t('dataProvidersContent') }}</p>
            <ul>
              <li><a href="#">{{ $t('howToDoc') }}</a></li>
              <li><a href="#">{{ $t('manual') }}</a></li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>