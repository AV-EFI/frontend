<template>
  <div class="container mx-auto">
    <!-- Top row with full width banner -->
    <div class="w-full relative container">
      <div
        class="min-h-128 w-full flex-col lg:flex-row-reverse relative overflow-hidden flex items-center justify-center"
      >
        <ClientOnly>
          <video
            autoplay
            muted
            loop
            class="lg:visible absolute inset-0 w-full h-auto transition duration-300 ease-in-out lg:hover:brightness-75 lg:hover:blur-lg blur-xs focus:blur-xl"
            style="filter: blur(5px) opacity(0.8);"
          >
            <source          
              src="/vid/roll_comp.mp4"
              type="video/mp4"
            >
            {{ $t('videoNotSupported') }}
          </video>
          <div
            class="lg:hidden absolute inset-0 w-full h-full bg-cover bg-center"
            style="background-image: url('/img/banner.jfif');"
          />
        </ClientOnly>
        <div class="absolute inset-0 bg-tertiary opacity-70" />
        <div class="card shrink-0 w-full relative z-10">
          <div class="card-body p-2 md:p-4 w-full">
            <GlobalSearchCompReduced />
          </div>
        </div>
      </div>
    </div>
    <div
      class="mx-auto min-h-[75vh] flex flex-col justify-between h-full p-6 shadow-lg transition duration-900 ease-in-out relative group dark:bg-gray-800 lg:dark:hover:bg-gray-700"
      style="background-image: url('/img/movietape.png'); background-blend-mode: overlay; background-position: left bottom; background-size: cover; animation: fadeIn 2s, moveBg 60s linear infinite;"
    >
      <div
        class="absolute inset-0 bg-secondary-200 dark:bg-secondary-800 opacity-100 lg:bg-gradient-to-r lg:from-secondary-700 lg:via-secondary-500 lg:to-secondary-700 transition-opacity duration-300 ease-in lg:group-hover:opacity-95 lg:group-hover:bg-gradient-to-r lg:group-hover:from-secondary-600 lg:group-hover:via-secondary-500 lg:group-hover:to-secondary-600 dark:lg:from-gray-900 dark:lg:via-gray-800 dark:lg:to-gray-900 lg:dark:group-hover:from-gray-800 lg:dark:group-hover:via-gray-700 lg:dark:group-hover:to-gray-800"
      />
      <div class="relative flex flex-col lg:flex-row justify-between content-center items-center mt-2 lg:group-hover:bg-opacity-90">
        <div class="w-full lg:w-1/2">
          <div class="flex flex-col justify-center items-center bg-white opacity-90 rounded-lg p-[25px] relative mx-auto max-h-96 lg:group-hover:bg-opacity-100 max-w-96 lg:group-hover:shadow-xl dark:bg-gray-700 dark:shadow-gray-700 lg:dark:group-hover:bg-gray-800 mb-4">
            <h2 class="text-xl font-bold text-left w-full leading-tight mb-2 max-w-80 dark:text-gray-200">
              {{ $t('bannerText') }}
            </h2>
            <p class="text-left mb-2 max-w-80 dark:text-gray-300">
              {{ $t('bannerDescription') }}
            </p>
          </div>
        </div>
        <div class="w-full lg:w-1/2 flex justify-center md:p-2 relative">
          <GlobalCarouselCardComp
            :items="cardItems"
          />
        </div>
      </div>
    </div>
    <div class="mx-auto min-h-[66vh] flex flex-col justify-between h-full p-6 shadow-lg transition duration-500 ease-in-out relative group dark:bg-gray-800 lg:dark:hover:bg-gray-700">
      <div class="grid grid-cols-1 gap-4 mb-2 my-4 px-6 py-2 relative group h-full text-center">
        <div class="flex flex-col items-center bg-white dark:bg-transparent bg-opacity-90 p-4 rounded-lg">
          <img
            src="/img/AV-EFI-Logo.png"
            alt="AV-EFI Logo"
            class="max-w-64 mx-auto dark:bg-slate-100 rounded-xl p-2"
          >
          <h2 class="text-xl dark:text-gray-200 mt-4 max-w-64">
            {{ $t('slogan') }}
          </h2>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div
          v-motion-slide-visible-once-left
          class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:shadow-gray-700 lg:dark:group-hover:bg-gray-800"
        >
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
                <span class="dark:text-primary-300">{{ $t('coreFunctions[0]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('coreFunctions[1]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('coreFunctions[2]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('coreFunctions[3]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('coreFunctions[4]') }}</span>
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
        <div
          v-motion-slide-visible-once-bottom
          class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:shadow-gray-700 lg:dark:group-hover:bg-gray-800"
        >
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
                <span class="dark:text-primary-300">{{ $t('forFilmResearchers[0]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('forFilmResearchers[1]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('forFilmResearchers[2]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('forFilmResearchers[3]') }}</span>
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
        <div
          v-motion-slide-visible-once-bottom
          class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:shadow-gray-700 lg:dark:group-hover:bg-gray-800"
        >
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
                <span class="dark:text-primary-300">{{ $t('technicalBasics[0]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('technicalBasics[1]') }}</span>
              </li>
              <li class="mb-2">
                <span class="dark:text-primary-300">{{ $t('technicalBasics[2]') }}</span>
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
    <div
      class="mx-auto lg:min-h-[75vh] flex flex-col lg:justify-center flex-wrap justify-between h-full p-6 shadow-lg transition duration-900 ease-in-out relative group dark:bg-gray-800 lg:dark:hover:bg-gray-700"
      style="background-image: url('/img/movietape.png'); background-blend-mode: overlay; background-position: left bottom; background-size: cover; animation: fadeIn 2s, moveBg 60s linear infinite;"
    >
      <div
        class="absolute inset-0 bg-secondary-200 dark:bg-secondary-800 opacity-100 lg:bg-gradient-to-r lg:from-secondary-700 lg:via-secondary-500 lg:to-secondary-700 transition-opacity duration-300 ease-in lg:group-hover:opacity-95 lg:group-hover:bg-gradient-to-r lg:group-hover:from-secondary-600 lg:group-hover:via-secondary-500 lg:group-hover:to-secondary-600 dark:lg:from-gray-900 dark:lg:via-gray-800 dark:lg:to-gray-900 lg:dark:group-hover:from-gray-800 lg:dark:group-hover:via-gray-700 lg:dark:group-hover:to-gray-800"
      />
      <div class="relative flex flex-col lg:flex-row justify-between content-center items-center my-2 lg:group-hover:bg-opacity-90">
        <div class="w-full lg:w-1/2 flex justify-center p-2 relative h-full">
          <video
            controls
            class="lg:h-80 w-auto"
          >
            <source
              type="video/mp4"
              src="/vid/roll_comp.mp4"
            >
            {{ $t('videoNotSupported') }}
          </video>
        </div>
        <div class="w-full hidden lg:inline-flex lg:w-1/2 flex flex-col justify-center items-center">
          <div class="flex flex-col justify-center items-center bg-white opacity-90 rounded-lg p-[25px] relative mx-auto max-h-96 lg:group-hover:bg-opacity-100 lg:max-w-96 lg:group-hover:shadow-xl dark:bg-gray-700 dark:shadow-gray-700 lg:dark:group-hover:bg-gray-800">
            <h2 class="text-2xl text-left w-full leading-tight lg:max-w-80 dark:text-gray-200 mb-4">
              <img
                src="/img/AV-EFI-Logo.png"
                alt="AV-EFI Logo"
                class="mx-auto max-w-64 ml-0"
              >
            </h2>
            <p class="text-left max-w-80 dark:text-gray-300">
              {{ $t('videoDescription') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto lg:min-h-[66vh] flex flex-col justify-between h-full p-6 shadow-lg transition duration-500 ease-in-out relative group dark:bg-gray-800 lg:dark:hover:bg-gray-700">
      <div class="flex flex-col lg:flex-row justify-around lg:justify-between mt-4 lg:mt-auto lg:mb-auto">
        <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-2 relative mx-auto">
          <div class="flex flex-col items-center bg-white dark:bg-gray-700 lg:dark:group-hover:bg-gray-800 bg-opacity-90 p-4 rounded-lg">
            <h2 class="text-2xl text-left font-bold mb-2 w-full leading-tight max-w-80 dark:text-gray-200">
              {{ $t('partnersTitle') }}
            </h2>
            <p class="text-left max-w-80 dark:text-gray-300">
              {{ $t('partnersDescription') }}
            </p>
          </div>
        </div>
        <div class="w-full lg:w-1/2 flex justify-center p-2 relative">
          <div class="w-96 md:w-128">
            <GlobalCarouselComp :items="items" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta(
    { 
        auth: false,
        layout: 'default'
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

const items = ref([
    { src: '/img/logo_gwdg.png', alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen', link: 'https://www.gwdg.de' },
    { src: '/img/logo_sdk.png', alt: 'Stiftung Deutsche Kinemathek', link: 'https://www.deutsche-kinemathek.de' },
    { src: '/img/logo_tib.png', alt: 'Technische Informationsbibliothek Hannover', link: 'https://www.tib.eu' },
    { src: '/img/logo_fmd.png', alt: 'Filmmuseum Düsseldorf', link: 'https://www.duesseldorf.de/filmmuseum' }
]);

const cardItems = ref(
    [
        {
            title: 'schlenkerTitle',
            description: 'schlenkerDescription',
            linkText: 'schlenkerLinkText',
            //title: 'Hermann Schlenker',
            //description: 'Hermann Schlenkers ethnografische Arbeiten aus der zweiten Hälfte des 20. Jahrhunderts sind heute wichtiger denn je, da sie ein wertvolles Zeitzeugnis von Kulturen darstellen, die sich im Wandel befinden oder bereits verschwunden sind.',
            link: `/search_altern/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bproduction%5D%5B0%5D=Schlenker%2C%20Hermann&${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bproduction%5D%5B1%5D=Hermann%20Schlenker%20Filmproduktion`,
            //linkText: 'Hermann Schlenker bei AVefi'
        },
        {
            title: 'trollerTitle',
            imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
            imgAlt: 'Georg Stefan Troller',
            description: 'trollerDescription',
            //description: 'Georg Stefan Troller, ein österreichisch-französischer Filmemacher und Journalist, war bekannt für seinen tief empfundenen Humanismus. Seine Dokumentarfilme boten intime Porträts von Menschen und ihren Geschichten, indem sie persönliche Erfahrungen und soziale Themen auf eindringliche Weise miteinander verbanden.',
            link: `/search_altern/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bdirectors_or_editors%5D%5B0%5D=Troller%2C%20Georg%20Stefan`,
            linkText: 'trollerLinkText',
            imgSourceLink: 'https://commons.wikimedia.org/wiki/File:Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
            imgSourceText: 'Wikimedia Commons',
            imgAuthor: 'ZDF',
            imgLicense: 'CC BY-SA 3.0',
            imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
            imgCoverType: 'object-top'            
        },
        {
            title: 'ddrTitle',//'Filmgeschichte der DDR',
            description: 'ddrDescription',//'Diese Sammlung stellt eine einzigartige Ressource dar, die sich mit der Filmgeschichte der DDR beschäftigen. Durch die Bereitstellung umfassender Metadaten ermöglicht sie anspruchsvolle Forschungsvorhaben und trägt zur Weiterentwicklung wissenschaftlicher Erkenntnisse über die Kultur und Gesellschaft der DDR bei.',
            link: `/search_altern/?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bcountries%5D%5B0%5D=Deutsche%20Demokratische%20Republik%20%28DDR%29`,
            linkText: 'ddrLinkText'//'Unsere DDR-Filme'
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
