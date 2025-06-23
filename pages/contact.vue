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
        [$t('helpAndGlossary'), '/contact'],
      ]"
    />

    <div
      class="container"
      role="region"
      :aria-label="$t('contact.mainContent')"
    >
      <article
        class="container flex justify-center"
        role="region"
        :aria-label="$t('contact.articleContent')"
      >
        <div
          id="c7273"
          class="frame frame-default frame-type-text frame-layout-0 w-full md:w-2/3 text-balance text-left"
        >
          <h2 class="text-2xl font-bold mb-4">
            FAQs
          </h2>
          <div
            class="collapse collapse-arrow mt-2"
            role="region"
            :aria-label="$t('contact.about.heading')"
          >
            <input
              type="checkbox"
              checked
            >
            <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.about.heading') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('contact.about.0') }}
              </p>
              <p class="my-2">
                {{ $t('contact.about.1') }}
              </p>
              <p v-html="$t('contact.about.2')" />
            </div>
          </div>

          <div
            class="collapse collapse-arrow mt-2"
            role="region"
            :aria-label="$t('contact.availableMetadata')"
          >
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
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

          <div
            class="collapse collapse-arrow mt-2"
            role="region"
            :aria-label="$t('contact.definitions')"
          >
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.definitions') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('contact.workContent.0') }}
              </p>
              <p class="my-2">
                {{ $t('contact.workContent.1') }}
              </p>
              <p class="my-2">
                {{ $t('contact.workContent.2') }}
              </p>
              <p class="my-2">
                {{ $t('contact.workContent.3') }}
              </p>
              <p class="my-2">
                {{ $t('contact.workContent.4') }}
              </p>
              <p class="my-2">
                {{ $t('contact.workContent.5') }}
              </p>
              <p class="my-2">
                {{ $t('contact.workContent.6') }}
              </p>
            </div>

            <div
              class="collapse collapse-arrow mt-2"
              role="region"
              :aria-label="$t('contact.keywords')"
            >
              <input type="checkbox">
              <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
                <h2>
                  {{ $t('contact.keywords') }}
                </h2>
              </div>
              <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
                <p class="my-2">
                  {{ $t('contact.keywordsContent') }}
                </p>
              </div>
            </div>
            <div
              class="collapse collapse-arrow mt-2"
              role="region"
              :aria-label="$t('contact.normdata')"
            >
              <input type="checkbox">
              <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
                <h2>
                  {{ $t('contact.normdata') }}
                </h2>
              </div>
              <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
                <p
                  class="my-2"
                  v-html="$t('contact.normdataContent')"
                />
              </div>
            </div>
            <div
              class="collapse collapse-arrow mt-2"
              role="region"
              :aria-label="$t('contact.availability')"
            >
              <input type="checkbox">
              <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
                <h2>
                  {{ $t('contact.availability') }}
                </h2>
              </div>
              <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
                <p class="my-2">
                  {{ $t('contact.availabilityContent') }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="collapse collapse-arrow mt-2"
            role="region"
            :aria-label="$t('contact.pids')"
          >
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.pids') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              <p class="my-2">
                {{ $t('contact.pidsContent.0') }}
              </p>
              <p>
                {{ $t('contact.pidsContent.1') }}
              </p>
            </div>
          </div>

          <div
            class="collapse collapse-arrow mt-2"
            role="region"
            :aria-label="$t('contact.dataProviders')"
          >
            <input type="checkbox">
            <div class="collapse-title bg-slate-100 dark:bg-gray-800 dark:text-white font-bold">
              <h2>
                {{ $t('contact.dataProviders') }}
              </h2>
            </div>
            <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
              {{ $t('contact.dataProvidersContent') }}
              <ul>
                <li
                  class="link"
                  v-html="$t('howToDoc')"
                />
                <li
                  class="link"
                  v-html="$t('manual')"
                />
              </ul>
            </div>
          </div>
        </div>
      </article>
      <div class="divider my-4" />
      <article
        class="container flex justify-center"
        role="region"
        :aria-label="$t('glossary.title')"
      >
        <div class="mt-4 frame frame-default frame-type-text frame-layout-0 w-full md:w-2/3 text-balance text-left">
          <GlobalGlossaryViewer />
        </div>
        <article />
      </article>
    </div>
  </div>
</template>