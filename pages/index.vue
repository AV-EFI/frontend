<template>
  <div class="container mx-auto">
    <!-- Top row with full width banner -->
    <div class="w-full relative container">
      <div
        class="min-h-96 w-full flex-col lg:flex-row-reverse relative overflow-hidden flex items-center justify-center"
      >
        <ClientOnly>
          <video
            autoplay
            muted
            loop
            class="lg:visible absolute inset-0 w-full h-auto transition duration-300 ease-in-out hover:brightness-75 hover:blur-lg blur-xs focus:blur-xl"
            style="filter: blur(5px) opacity(0.8);"
          >
            <source          
              src="/vid/look_comp_2.mp4"
              type="video/mp4"
            >
            {{ $t('videoNotSupported') }}
          </video>
          <div
            class="lg:hidden absolute inset-0 w-full h-full bg-cover bg-center"
            style="background-image: url('/img/banner.jfif');"
          />
        </ClientOnly>
        <div class="absolute inset-0 bg-black opacity-70" />
        <div class="card shrink-0 w-full relative z-10">
          <div class="card-body p-2 md:p-4 w-full">
            <GlobalSearchCompReduced />
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto min-h-[75vh] flex flex-col justify-center h-full bg-gradient-to-r from-secondary-600 via-secondary to-secondary-600 text-white p-6 shadow-lg transition duration-500 ease-in-out hover:bg-gradient-to-r hover:from-secondary-700 hover:via-secondary hover:to-secondary-700 relative group dark:bg-gradient-to-r dark:from-secondary-800 dark:via-secondary-700 dark:to-secondary-800 dark:hover:bg-gradient-to-r dark:hover:from-secondary-600 dark:hover:via-secondary-500 dark:hover:to-secondary-600">
      <div class="flex justify-center mt-2">
        <div class="w-1/2 flex flex-col justify-center items-center p-2 relative mx-auto">
          <h2 class="text-2xl text-center w-full leading-tight mb-2 max-w-80 dark:text-gray-200">
            {{ $t('bannerText') }}
          </h2>
          <p class="text-justify mb-2 max-w-80 dark:text-gray-300">
            {{ $t('bannerDescription') }}
          </p>
        </div>
        <div class="w-1/2 flex justify-center p-2 relative">
          <GlobalCarouselCardComp :items="cardItems" />
        </div>
      </div>
    </div>
    <div class="mx-auto min-h-[66vh] flex flex-col justify-center h-full  p-6 shadow-lg transition duration-500 ease-in-out relative group dark:bg-gray-800 dark:hover:bg-gray-700">
      <div class="grid grid-cols-3 gap-4 mb-2 my-4 px-6 py-2 relative group h-full">
        <h2 class="text-2xl text-center col-start-2 col-span-1 dark:text-gray-200">
          {{ $t('coreFunctionsTitle') }}
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200">
          <div class="card-body flex-grow">
            <div class="flex justify-center ">
              <Icon
                name="fa:desktop"
                class="text-4xl text-primary dark:text-primary-300"
              />
            </div>
            <h2 class="card-title dark:text-gray-200">
              {{ $t('coreFunctionsTitle') }}
            </h2>
            <ul class="dark:text-gray-300">
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('coreFunctions[0]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('coreFunctions[1]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('coreFunctions[2]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('coreFunctions[3]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('coreFunctions[4]') }}</span>
              </li>
            </ul>
          </div>
          <div class="card-actions justify-end mt-auto mb-2 mr-2">
            <a
              href="https://projects.tib.eu/av-efi/projekt/"
              target="_blank"
              class="btn btn-primary dark:btn-primary-300"
            >{{ $t('learnMore') }}</a>
          </div>
        </div>
        <div class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200">
          <div class="card-body flex-grow">
            <div class="flex justify-center ">
              <Icon
                name="fa-film"
                class="text-4xl text-primary dark:text-primary-300"
              />
            </div>
            <h2 class="card-title dark:text-gray-200">
              {{ $t('forFilmResearchersTitle') }}
            </h2>
            <ul class="dark:text-gray-300">
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('forFilmResearchers[0]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('forFilmResearchers[1]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('forFilmResearchers[2]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('forFilmResearchers[3]') }}</span>
              </li>
            </ul>
          </div>
          <div class="card-actions justify-end mt-auto mb-2 mr-2">
            <a
              href="https://projects.tib.eu/av-efi/metadaten/"
              target="_blank"
              class="btn btn-primary dark:btn-primary-300"
            >{{ $t('learnMore') }}</a>
          </div>
        </div>
        <div class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200">
          <div class="card-body flex-grow">
            <div class="flex justify-center ">
              <label class="swap swap-flip text-4xl text-primary dark:text-primary-300">
                <input type="checkbox">
                <div class="swap-off">
                  <Icon name="fa-code" />
                </div>
                <div class="swap-on">
                  <Icon
                    class="animate-bounce"
                    name="fa-heart-o"
                  />
                </div>
              </label>
            </div>
            <h2 class="card-title dark:text-gray-200">
              {{ $t('technicalBasicsTitle') }}
            </h2>
            <ul class="dark:text-gray-300">
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('technicalBasics[0]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('technicalBasics[1]') }}</span>
              </li>
              <li class="mb-2">
                <span class="text-primary dark:text-primary-300">{{ $t('technicalBasics[2]') }}</span>
              </li>
            </ul>
          </div>
          <div class="card-actions justify-end mt-auto mb-2 mr-2">
            <a
              href="https://projects.tib.eu/av-efi/pid/efi-infrastruktur/"
              target="_blank"
              class="btn btn-primary dark:btn-primary-300"
            >{{ $t('learnMore') }}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto min-h-[75vh] flex flex-col justify-center h-full bg-gradient-to-r from-secondary-600 via-secondary to-secondary-600 text-white p-6 shadow-lg transition duration-500 ease-in-out hover:bg-gradient-to-r hover:from-secondary-700 hover:via-secondary hover:to-secondary-700 relative group dark:bg-gradient-to-r dark:from-secondary-800 dark:via-secondary-700 dark:to-secondary-800 dark:hover:bg-gradient-to-r dark:hover:from-secondary-600 dark:hover:via-secondary-500 dark:hover:to-secondary-600">
      <div class="flex justify-center mt-4">
        <div class="w-1/2 flex justify-center p-2 relative">          
          <video
            controls
            class="w-full h-auto"
          >
            <source
              type="video/mp4"
              src="/vid/look_comp.mp4"
            >
            {{ $t('videoNotSupported') }}
          </video>
        </div>
        <div class="w-1/2 flex flex-col justify-center items-center p-2 relative mx-auto">
          <h2 class="text-2xl text-center w-full leading-tight  max-w-80 dark:text-gray-200">
            {{ $t('videoTitle') }}
          </h2>
          <p class="text-justify  max-w-80 dark:text-gray-300">
            {{ $t('videoDescription') }}
          </p>
        </div>
      </div>
    </div>
    <div class="mx-auto min-h-[66vh] flex flex-col justify-center h-full  p-6 shadow-lg transition duration-500 ease-in-out relative group dark:bg-gray-800 dark:hover:bg-gray-700">
      <div class="flex justify-center mt-4">
        <div class="w-1/2 flex flex-col justify-center items-center p-2 relative mx-auto">
          <h2 class="text-2xl text-center w-full leading-tight  max-w-80 dark:text-gray-200">
            {{ $t('partnersTitle') }}
          </h2>
          <p class="text-justify  max-w-80 dark:text-gray-300">
            {{ $t('partnersDescription') }}
          </p>
        </div>
        <div class="w-1/2 flex justify-center p-2 relative">
          <GlobalCarouselComp :items="items" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta(
    { 
        auth: false 
    }
);

function rotateSpan(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.transition = 'transform 0.6s ease-in-out';
    target.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        target.style.transform = '';
    }, 600);
}

function changeBackground() {
    const bgElement = document.querySelector('.movie-classics-bg') as HTMLElement;
    if (bgElement) {
        bgElement.style.filter = 'brightness(0.9)';
    }
}

function resetBackground() {
    const bgElement = document.querySelector('.movie-classics-bg') as HTMLElement;
    if (bgElement) {
        bgElement.style.filter = 'brightness(1)';
    }
}

const items = ref([
    { src: '/img/logo_gwdg.png', alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen', link: 'https://www.gwdg.de' },
    { src: '/img/logo_sdk.png', alt: 'Stiftung Deutsche Kinemathek', link: 'https://www.deutsche-kinemathek.de' },
    { src: '/img/logo_tib.png', alt: 'Technische Informationsbibliothek Hannover', link: 'https://www.tib.eu' },
    { src: '/img/logo_fmd.png', alt: 'Filmmuseum Düsseldorf', link: 'https://www.duesseldorf.de/filmmuseum' }
]);

const cardItems = ref(
    [
        {
            title: 'Hermann Schlenker',
            description: 'Hermann Schlenkers ethnografische Arbeiten aus der zweiten Hälfte des 20. Jahrhunderts sind heute wichtiger denn je, da sie ein wertvolles Zeitzeugnis von Kulturen darstellen, die sich im Wandel befinden oder bereits verschwunden sind.',
            link: 'http://localhost:3000/search_altern/index?21.11155-dev-runtime%5BrefinementList%5D%5Bproducers%5D%5B0%5D=Schlenker%2C%20Hermann&21.11155-dev-runtime%5BrefinementList%5D%5Bproducers%5D%5B1%5D=Hermann%20Schlenker%20Filmproduktion',
            linkText: 'Hermann Schlenker bei AVefi'
        },
        {
            title: 'Georg Stefan Troller',
            imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
            imgAlt: 'Georg Stefan Troller',
            description: 'Georg Stefan Troller, ein österreichisch-französischer Filmemacher und Journalist, war bekannt für seinen tief empfundenen Humanismus. Seine Dokumentarfilme boten intime Porträts von Menschen und ihren Geschichten, indem sie persönliche Erfahrungen und soziale Themen auf eindringliche Weise miteinander verbanden.',
            link: 'https://projects.tib.eu/av-efi/metadaten/',
            linkText: 'Georg Stefan Troller bei AVefi',
            imgSourceLink: 'https://commons.wikimedia.org/wiki/File:Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
            imgSourceText: 'Wikimedia Commons',
            imgAuthor: 'ZDF',
            imgLicense: 'CC BY-SA 3.0',
            imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
            imgCoverType: 'object-top'            
        },
        {
            title: 'Filmgeschichte der DDR',
            description: 'Diese Sammlung stellt eine einzigartige Ressource dar, die sich mit der Filmgeschichte der DDR beschäftigen. Durch die Bereitstellung umfassender Metadaten ermöglicht sie anspruchsvolle Forschungsvorhaben und trägt zur Weiterentwicklung wissenschaftlicher Erkenntnisse über die Kultur und Gesellschaft der DDR bei.',
            link: 'http://localhost:3000/search_altern/?21.11155-dev-runtime%5BrefinementList%5D%5Bcountries%5D%5B0%5D=Deutsche%20Demokratische%20Republik%20%28DDR%29',
            linkText: 'Unsere Kollektion an DDR-Filmen'
        }
    ]
);
</script>

<style scoped>
.movie-classics-bg {
  background-attachment: fixed;
  background-image: url('/img/banner.jfif');
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  z-index: 0;
  width: 100%;
  max-width: none;
}
</style>
