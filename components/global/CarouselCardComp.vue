<template>
  <div class="carousel-container flex items-center relative">
    <button
      class="md:flex z-20 p-2 md:bg-gray-800 md:text-white text-black rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:mr-4 dark:bg-gray-600 dark:text-gray-200 absolute md:relative top-1/2 transform -translate-y-1/2 md:left-2"
      @click="prevSlide"
    >
      <Icon name="fa:chevron-left" />
    </button>
    <div class="carousel rounded-box w-[384px] md:w-96 relative overflow-hidden text-gray-700 dark:text-gray-300">
      <div
        class="carousel-inner flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 384}px)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel-item w-[384px] md:w-96 flex-shrink-0 justify-center"
        >
          <div class="card w-[384px] md:w-96 bg-base-100 shadow-xl h-full max-w-full dark:bg-gray-800 dark:shadow-gray-700">
            <figure
              v-if="item.imgSrc"
              class="flex flex-col items-center"
            >
              <img
                :src="item.imgSrc"
                :alt="item.imgAlt"
                :class="`w-full h-48 2xl:h-64 object-cover ${item.imgCoverType || 'object-center'}`"
              >
              <figcaption class="text-xs text-gray-500 h-8 mt-2 px-4 dark:text-gray-400">
                <div v-if="item.imgSourceText">
                  Bildquelle: <a
                    :href="item.imgSourceLink"
                    target="_blank"
                    class="underline"
                  >{{ item.imgSourceText }}</a>, Urheber: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{ item.imgLicenseLink }})
                </div>              
              </figcaption>
            </figure>
            <figure
              v-else
              class="flex flex-col items-center"
            >
              <img
                src="/img/avefi_ph_hq.jpeg"
                alt="Avefi"
                :class="`w-full h-48 2xl:h-64 object-cover ${item.imgCoverType || 'object-center'}`"
              >
              <figcaption class="text-xs text-gray-500 h-8 mt-2 px-4 dark:text-gray-400">
                <div v-if="item.imgSourceText">
                  Bildquelle: <a
                    :href="item.imgSourceLink"
                    target="_blank"
                    class="underline"
                  >{{ item.imgSourceText }}</a>, Urheber: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{ item.imgLicenseLink }})
                </div>              
              </figcaption>
            </figure>
            <div class="card-body pt-2">
              <h2 class="card-title dark:text-gray-200">
                {{ item.title }}
              </h2>
              <p :class="['text-gray-700 text-base mt-2 dark:text-gray-300  md:!line-clamp-none', { 'line-clamp-4': !showFullText }]">
                {{ item.description }}
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
                  class="btn btn-primary"
                >{{ item.linkText }} <Icon name="fa-regular:arrow-alt-circle-right" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="z-20 md:flex p-2 md:bg-gray-800 text-black md:text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:ml-4 dark:bg-gray-600 dark:text-gray-200 absolute md:relative top-1/2 transform -translate-y-1/2 right-0 md:right-2"
      @click="nextSlide"
    >
      <Icon name="fa:chevron-right" />
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

const toggleText = (e) => {
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
.carousel-item {
  flex-shrink: 0;
  width: 24rem; /* Fixed width of w-[384px] md:w-96 */
}
.card {
  max-width: 100%; /* Ensure card does not exceed parent width */
}
</style>
