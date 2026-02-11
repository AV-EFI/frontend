<!-- eslint-disable vue/no-v-html -->
<template>
  <NuxtLayout name="partial-layout-1-center">
    <template #navigation>
      <GlobalBreadcrumbsComp
        :breadcrumbs="[
          ['Home', '/'],
          [$t('faq'), '/faq'],
        ]"
      />
    </template>

    <template #title>
      <h2 class="text-lg font-bold mb-2">
        {{ $t('faq') }}
      </h2>
    </template>

    <template #cardBody>
      <div class="container" role="region" :aria-label="$t('contact.mainContent')">
        <div class="w-full md:w-4/5 mx-auto">
          <article class="container flex justify-center" role="region" :aria-label="$t('contact.articleContent')">
            <div id="c7273" class="frame frame-default frame-type-text frame-layout-0 w-full text-balance text-left">
              <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.about.heading')">
                <input type="checkbox" checked>
                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                  <h2>{{ $t('contact.about.heading') }}</h2>
                </div>
                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                  <p class="my-2">{{ $t('contact.about.0') }}</p>
                  <p class="my-2">{{ $t('contact.about.1') }}</p>
                  <p class="my-2">
                    {{ $t('contact.about.2.beforeLink') }}
                    <a class="link" href="https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html" target="_blank">FIAF-Regelwerk</a>
                    {{ $t('contact.about.2.afterLink') }}
                  </p>
                </div>
              </div>

              <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.availableMetadata')">
                <input type="checkbox">
                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                  <h2>{{ $t('contact.availableMetadata') }}</h2>
                </div>
                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                  <p class="my-2">{{ $t('contact.availableMetadataContent') }}</p>
                </div>
              </div>

              <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.definitions')">
                <input type="checkbox">
                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                  <h2>{{ $t('contact.definitions') }}</h2>
                </div>
                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                  <p class="my-2">{{ $t('contact.workContent.0') }}</p>
                  <p class="my-2">{{ $t('contact.workContent.1') }}</p>
                  <p class="my-2">{{ $t('contact.workContent.2') }}</p>
                  <p class="my-2">{{ $t('contact.workContent.3') }}</p>
                  <p class="my-2">{{ $t('contact.workContent.4') }}</p>
                  <p class="my-2">{{ $t('contact.workContent.5') }}</p>
                  <p class="my-2">{{ $t('contact.workContent.6') }}</p>
                </div>
              </div>

                <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.keywords')">
                  <input type="checkbox">
                  <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                    <h2>{{ $t('contact.keywords') }}</h2>
                  </div>
                  <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                    <p class="my-2">{{ $t('contact.keywordsContent') }}</p>
                  </div>
                </div>

                <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.normdata')">
                  <input type="checkbox">
                  <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                    <h2>{{ $t('contact.normdata') }}</h2>
                  </div>
                  <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                    <p class="my-2">
                      {{ $t('contact.normdataContent.beforeLink') }}
                      <a class="link" href="https://gnd.network/Webs/gnd/DE/UeberGND/ueberGND_node.html" target="_blank">Gemeinsamen Normdatei (GND)</a>
                      {{ $t('contact.normdataContent.afterLink') }}
                    </p>
                  </div>
                </div>

                <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.availability')">
                  <input type="checkbox">
                  <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                    <h2>{{ $t('contact.availability') }}</h2>
                  </div>
                  <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                    <p class="my-2">{{ $t('contact.availabilityContent') }}</p>
                  </div>
                </div>

              <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.pids')">
                <input type="checkbox">
                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                  <h2>{{ $t('contact.pids') }}</h2>
                </div>
                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                  <p class="my-2">{{ $t('contact.pidsContent.0') }}</p>
                  <p>{{ $t('contact.pidsContent.1') }}</p>
                </div>
              </div>

              <div class="collapse collapse-arrow mt-2" role="region" :aria-label="$t('contact.dataProviders')">
                <input type="checkbox">
                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                  <h2>{{ $t('contact.dataProviders') }}</h2>
                </div>
                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                  {{ $t('contact.dataProvidersContent') }}
                  <ul>
                    <li class="link"><span v-html="$t('howToDoc')" /></li>
                    <li class="link"><span v-html="$t('manual')" /></li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ auth: false });

const { t } = useI18n();

useSeoMeta({
    title: t('seo.faq.title'),
    description: t('seo.faq.description'),
    ogTitle: t('seo.faq.ogTitle'),
    ogDescription: t('seo.faq.ogDescription'),
  ogImage: '/img/avefi-og-image.png',
  keywords: [
    'FAQ',
    'Häufig gestellte Fragen',
    'Hilfe',
    'Support',
    'Nutzungshinweise',
    'Anleitung',
    'Filmrecherche Hilfe',
    'Suchfunktionen',
    'Filterfunktionen',
    'Ergebnisanzeige',
    'AVefi Portal',
    'Filmmetadaten',
  ].join(', '),
});

</script>
