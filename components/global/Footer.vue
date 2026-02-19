<template>
  <ClientOnly>
    <footer class="footer w-full bg-neutral text-white dark:text-white px-6 border-t-2 border-base-100"
      role="contentinfo" :aria-label="$t('footer')">
      <div class="container mx-auto p-2 lg:p-4 pb-6 md:pb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <nav class="flex flex-col col-span-1" :aria-label="$t('footerInfo')">
            <h2 class="footer-title">
              {{ $t("partnersTitle") }}
              <LazyGlobalTooltipInfo :text="$t('partnersDescription')" />
            </h2>
            <div>
              <div class="w-full 2xl:w-2/3 flex justify-start" ref="partnersCarouselRef">
                <ClientOnly>
                  <LazyGlobalCarouselComp :items="partnersItems">
                  </LazyGlobalCarouselComp>
                </ClientOnly>
              </div>
            </div>
          </nav>

          <!-- Info / Legal -->
          <nav class="flex flex-col col-span-1" :aria-label="$t('footerInfo')">
            <h2 class="footer-title">
              Info
            </h2>
            <ul>
              <li>
                <p>{{ $t('footerLicense') }}</p>
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" class="link transition"
                  :aria-label="$t('license')">
                  <Icon name="tabler:creative-commons" />
                  <span class="hidden lg:inline-flex sr-only">
                    {{ $t('license') }}
                  </span>
                </a>
              </li>
              <li>
                <a href="https://datenschutz.gwdg.de/services/av-efi" target="_blank" class="link transition"
                  :aria-label="$t('dataprotection')">
                  {{ $t('dataprotection') }}
                </a>
              </li>
              <li>
                <a href="/imprint" class="link transition" :aria-label="$t('imprint')">
                  {{ $t('imprint') }}
                </a>
              </li>
              <li>
                <NuxtLink to="/press" class="link transition" aria-label="Press &amp; Media Kit">
                  Press &amp; Media Kit
                </NuxtLink>
              </li>
            </ul>

            <!-- Alpha Notice -->
            <div role="note" aria-live="polite" class="text-white opacity-95 w-full md:max-w-64 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="stroke-primary dark:stroke-info h-6 w-6 shrink-0" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="transition" :aria-label="$t('alpha')">
                {{ $t('alpha') }}
              </span>
            </div>
          </nav>

          <!-- Sponsoring -->
          <nav class="flex flex-col col-span-1" :aria-label="$t('footerSponsoring')">
            <h2 class="footer-title">
              {{ $t("sponsoring") }}
            </h2>
            <div class="bg-transparent">
              <a href="https://gepris.dfg.de/gepris/projekt/517778207?context=projekt&task=showDetail&id=517778207&"
                target="_blank" aria-label="DFG Projektförderung">
                <img alt="Sponsoring by DFG" title="❤️" class="object-contain h-20 w-full md:h-40 md:w-96"
                  src="/img/DFG.svg">
              </a>
            </div>

          </nav>
        </div>
      </div>
    </footer>
  </ClientOnly>
</template>
<script setup lang="ts">
const partnersItems = ref([
    {
        src: '/img/gwdg_logo.min.svg',
        width: 176.871,
        height: 52.384,
        alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen',
        link: 'https://www.gwdg.de'
    },
    {
        src: '/img/logo_sdk.webp',
        width: 50,
        height: 56,
        alt: 'Stiftung Deutsche Kinemathek',
        link: 'https://www.deutsche-kinemathek.de'
    },
    {
        src: '/img/logo_tib.webp',
        width: 85,
        height: 56,
        alt: 'Technische Informationsbibliothek Hannover',
        link: 'https://www.tib.eu'
    },
    {
        src: '/img/logo_fmd.webp',
        width: 199,
        height: 56,
        alt: 'Filmmuseum Düsseldorf',
        link: 'https://www.duesseldorf.de/filmmuseum'
    },
    {
        src: '/img/logo_mcdci.webp',
        width: 56,
        height: 56,
        alt: 'Marburg Center for Digital Culture and Infrastructure',
        link: 'https://www.uni-marburg.de/de/mcdci'
    }
]);
</script>
