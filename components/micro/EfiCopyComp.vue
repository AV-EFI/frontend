<template>
  <button
    :class="[
      'btn btn-circle transition-all border border-white/30 ring-black duration-300 ease-in-out',
      'text-white dark:btn-outline mr-2 ml-auto',
      compSize === 'sm' ? 'btn-sm p-1' : 'p-2',
      'bg-accent dark:bg-accent',
      hoverBgClass,
      { 'animate-ping-bg': isClicked }
    ]"
    :title="$t('copyEFI', { category: categoryText })"
    :alt="$t('copyEFI', { category: categoryText })"
    :aria-label="$t('copyEFI', { category: categoryText })"
    :aria-pressed="isClicked.toString()"
    role="button"
    @click="handleClick"
  >
    <svg
      v-if="!isClicked"
      class="fill-white stroke-primary mb-1 svg-icon"
      :class="[compSize === 'sm' ? 'w-4 h-auto' : 'w-6 h-auto']"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 200 150"
      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g><path
        d="M 174.5,-0.5 C 178.5,-0.5 182.5,-0.5 186.5,-0.5C 194.5,2.48941 199.5,8.15607 201.5,16.5C 201.5,18.5 201.5,20.5 201.5,22.5C 195.967,39.2598 184.967,44.0932 168.5,37C 160.998,30.8147 158.498,22.9813 161,13.5C 163.352,6.64983 167.852,1.98316 174.5,-0.5 Z"
      /></g>
      <g><path
        d="M 112.5,28.5 C 126.611,27.2056 140.278,29.0389 153.5,34C 154.516,34.5194 155.182,35.3527 155.5,36.5C 154.414,41.0966 152.747,45.4299 150.5,49.5C 140.258,44.5483 129.592,43.0483 118.5,45C 115.619,46.2506 113.786,48.4173 113,51.5C 112.501,55.8206 112.334,60.1539 112.5,64.5C 129.167,64.5 145.833,64.5 162.5,64.5C 162.5,88.1667 162.5,111.833 162.5,135.5C 165.518,135.704 168.518,136.037 171.5,136.5C 171.5,140.833 171.5,145.167 171.5,149.5C 158.833,149.5 146.167,149.5 133.5,149.5C 133.5,145.167 133.5,140.833 133.5,136.5C 135.92,136.708 138.253,136.374 140.5,135.5C 141.5,116.845 141.833,98.1786 141.5,79.5C 131.833,79.5 122.167,79.5 112.5,79.5C 112.5,98.1667 112.5,116.833 112.5,135.5C 116.179,135.724 119.846,136.058 123.5,136.5C 123.5,140.833 123.5,145.167 123.5,149.5C 109.833,149.5 96.1667,149.5 82.5,149.5C 82.5,145.167 82.5,140.833 82.5,136.5C 86.0134,137.124 88.8467,136.124 91,133.5C 91.4999,115.503 91.6666,97.5031 91.5,79.5C 87.5,79.5 83.5,79.5 79.5,79.5C 79.5,74.5 79.5,69.5 79.5,64.5C 83.5,64.5 87.5,64.5 91.5,64.5C 90.4421,55.3348 91.9421,46.6681 96,38.5C 100.427,33.2113 105.927,29.8779 112.5,28.5 Z"
      /></g>
      <g><path
        d="M 44.5,151.5 C 40.8333,151.5 37.1667,151.5 33.5,151.5C 12.5002,148.163 1.16682,135.83 -0.5,114.5C -0.5,110.5 -0.5,106.5 -0.5,102.5C 5.63312,67.9294 25.6331,55.4294 59.5,65C 69.0067,72.1855 72.1734,81.6855 69,93.5C 65.5489,104.615 58.0489,111.115 46.5,113C 38.2195,114.287 29.8861,114.787 21.5,114.5C 21.2669,123.077 24.9335,129.244 32.5,133C 43.3653,135.951 53.3653,134.118 62.5,127.5C 64.5905,131.35 66.4239,135.35 68,139.5C 68.7805,140.944 68.6139,142.277 67.5,143.5C 60.2926,147.79 52.626,150.457 44.5,151.5 Z M 39.5,76.5 C 49.5637,77.6181 52.7304,82.9514 49,92.5C 46.8995,95.4668 44.0662,97.3002 40.5,98C 34.2312,99.2573 27.8979,99.7573 21.5,99.5C 22.0602,87.3026 28.0602,79.6359 39.5,76.5 Z"
      /></g>
    </svg>
    <Icon
      v-else
      name="tabler:check"
      class="text-white w-5 h-5 transition-transform duration-400 ease-out"
    />
  </button>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = defineProps({
    handle: String,
    compSize: {
        type: String,
        default: 'w-6 h-auto',
    },
    category: {
        type: String,
        default: 'work',
    },
});
const { t } = useI18n();
const isClicked = ref(false);
const categoryText = ref(t(props.category));
const hoverBgClass = computed(() => {
    return {
        work: 'hover:bg-work',
        'work-variant': 'hover:bg-work',
        item: 'hover:bg-item',
        manifestation: 'hover:bg-manifestation',
    }[props.category] || 'hover:bg-accent';
});

const handleClick = () => {
    useClipboardUtil()?.copyExtended(props.handle);
    isClicked.value = true;
    setTimeout(() => {
        isClicked.value = false;
    }, 300);
};
</script>

<style scoped>
@keyframes pulse-bg {
  0% {
    background-color: #22c55e; /* success green-500 */
  }
  100% {
    background-color: var(--primary); /* accent blue-500 (or adapt to your theme) */
  }
}

.animate-ping-bg {
  animation: pulse-bg 0.6s ease-in-out;
}

button:focus {
  outline: none;
}

button:hover .svg-icon {
  transform: scale(1.1);
}

.svg-icon {
  transition: fill 0.6s ease, transform 0.6s ease;
}
</style>
