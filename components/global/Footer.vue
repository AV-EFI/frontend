<template>
  <ClientOnly>
    <footer class="footer bg-primary-800 text-white dark:bg-gray-950 dark:text-white dark:border-gray-700 px-6">
      <div class="container mx-auto p-4 pb-10 md:pb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <nav class="flex flex-col col-span-1">
            <h6 class="footer-title">
              {{ $t("language") }}
            </h6>
            <Suspense>
              <GlobalLanguageSwitch />
            </Suspense>
          </nav>
          <nav class="flex flex-col col-span-1">
            <h6 class="footer-title">
              Info
            </h6>
            <ul>
              <li>
                <a
                  href="https://datenschutz.gwdg.de/services/av-efi"
                  target="_blank"
                  class="dark:text-gray-300"
                >
                  {{ $t('Datenschutzerklärung') }}
                </a>
              </li>
              <li>
                <a
                  href="/imprint"
                  class="dark:text-gray-300"
                >
                  {{ $t('imprint') }}
                </a>
              </li>
            </ul>
            <div
              role="alert"
              class="alert bg-neutral dark:bg-gray-700 md:w-64 mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-info dark:stroke-gray-300 h-6 w-6 shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="dark:text-gray-300">{{ $t('alpha') }}</span>                
            </div>
          </nav>
          <nav class="flex flex-col col-span-1">
            <h6 class="footer-title">
              {{ $t("sponsoring") }}
            </h6>
            <div class="bg-transparent">
              <a
                href="https://gepris.dfg.de/gepris/projekt/517778207?context=projekt&task=showDetail&id=517778207&"
                target="_blank"
              >
                <img
                  alt="Sponsoring by DFG"
                  title="❤️"
                  class="object-contain h-24 w-full md:h-48 md:w-96"
                  src="/img/dfg_logo.jpg"                
                >
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  </ClientOnly>
</template>
