<template>
  <div class="carousel-container flex items-center relative">
    <button
      :alt="$t('togglePreviousSlide')"
      :aria-label="$t('togglePreviousSlide')"
      class="md:flex z-10 p-2 md:bg-gray-800 md:text-white text-black rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:mr-4 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:left-[-3rem]"
      @click="prevSlide"
    >
      <Icon name="tabler:chevron-left" />
    </button>
    <div class="carousel rounded-box w-[250px] md:w-[384px] lg:w-128  relative overflow-hidden text-gray-700 dark:text-gray-300">
      <div
        class="carousel-inner flex transition-transform duration-500 ease-in-out"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel-item !w-[250px] md:!w-[384px] lg:!w-128 flex-shrink-0 justify-center"
        >
          <div class="card w-[250px] md:w-[384px] lg:w-128 shadow-xl md:h-full max-w-full bg-white dark:bg-gray-800 dark:shadow-gray-700">
            <figure
              v-if="item.imgSrc"
              class="flex flex-col items-center"
            >
              <div class="relative w-full h-48 lg:h-48 rounded overflow-hidden">
                <img
                  :src="item.imgSrc"
                  alt=""
                  class="absolute inset-0 w-full h-full object-cover blur scale-110 opacity-30"
                  aria-hidden="true"
                >
                <div class="relative z-10 flex items-center justify-center w-full h-full">
                  <img
                    :src="item.imgSrc"
                    :alt="item.imgAlt"
                    class="max-w-full max-h-full object-contain z-10"
                  >
                </div>
              </div>
              <figcaption class="text-xs text-gray-500 h-8 mt-2 px-4 dark:text-gray-400">
                <div v-if="item.imgSourceText">
                  {{ $t('imageSource') }}: <a
                    :href="item.imgSourceLink"
                    target="_blank"
                    class="underline"
                  >{{ item.imgSourceText }}</a>, {{ $t('author') }}: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{ item.imgLicenseLink }})
                </div>              
              </figcaption>
            </figure>
            <figure
              v-else
              class="flex flex-col items-center"
            >
              <img
                src="/img/avefi_ph_modern.svg"
                alt="Avefi"
                :class="`w-full h-48 lg:h-48 object-cover ${item.imgCoverType || 'object-center'}`"
              >
              <figcaption class="text-xs text-gray-500 h-8 mt-2 px-4 dark:text-gray-400">
                <div v-if="item.imgSourceText">
                  {{ $t('imageSource') }}: <a
                    :href="item.imgSourceLink"
                    target="_blank"
                    class="underline"
                  >{{ item.imgSourceText }}</a>, {{ $t('author') }}: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{ item.imgLicenseLink }})
                </div>              
              </figcaption>
            </figure>
            <div class="card-body pt-2">
              <h2 class="card-title dark:text-gray-200">
                {{ $t(item.title) }}
              </h2>
              <p :class="['text-gray-700 text-base mt-2 dark:text-gray-300  md:!line-clamp-none', { 'line-clamp-4': !showFullText }]">
                {{ $t(item.description) }}
              </p>
              <a
                class="md:hidden link link-secondary"
                @click="toggleText"
              >
                {{ showFullText ? $t('showLess') : $t('showMore') }}
              </a>
              <div class="card-actions justify-end">
                <a
                  :href="item.link"
                  class="btn btn-outline max-md:btn-block"
                >{{ $t(item.linkText) }} 
                  <Icon
                    class="hidden md:inline-block"
                    name="tabler:arrow-right"
                  /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      :alt="$t('toggleNextSlide')"
      :aria-label="$t('toggleNextSlide')"
      class="z-10 md:flex p-2 md:bg-gray-800 text-black md:text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:ml-4 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:right-[-3rem]"
      @click="nextSlide"
    >
      <Icon name="tabler:chevron-right" />
    </button>
  </div>
</template>

<script lang="ts" setup>
interface CarouselItem {
  title: string;
  imgSrc: string;
  imgAlt: string;
  description: string;
  link: string;
  linkText: string;
  imgSourceLink: string;
  imgSourceText: string;
  imgAuthor: string;
  imgLicense: string;
  imgLicenseLink: string;
  imgCoverType: string;
}

const props = defineProps({
    items: {
        type: Array as PropType<CarouselItem[]>,
        required: true
    }
});

const showFullText = ref(false);

const toggleText = (e: Event) => {
    e.preventDefault();
    showFullText.value = !showFullText.value;
};

const currentIndex = ref(0);

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length;
};

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length;
};

watch(currentIndex, (newIndex) => {
    const width = window.innerWidth;
    const itemWidth = width < 768 ? 250 : 512; // Adjust item width based on screen size
    const carouselInner = document.querySelector('.carousel-inner') as HTMLElement;
    if (carouselInner) {
        carouselInner.style.transform = `translateX(-${newIndex * itemWidth}px)`;
    }
});
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
}
.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}
.card {
  max-width: 100%; /* Ensure card does not exceed parent width */
}
</style>
