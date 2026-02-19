<template>
    <section class="w-full">
        <div class="flex flex-wrap gap-6">
            <article v-for="(item, index) in items" :key="index"
                class="card bg-base-100/95 dark:bg-base-200/70 w-full md:max-w-sm flex-1 min-w-[220px] shadow-sm border border-base-200/60">
                <figure class="px-6 pt-6">
                    <div class="w-full h-32 flex items-center justify-center rounded-xl bg-white dark:bg-base-100 overflow-hidden"
                        aria-hidden="true">
                        <img v-if="item.src" :src="item.src" :alt="item.alt || item.title || ''"
                            :title="item.alt || item.title || undefined" loading="lazy" decoding="async"
                            :width="item.width || undefined" :height="item.height || undefined"
                            class="max-h-20 object-contain" />
                        <img v-else src="/img/placeholder-16x9.svg" alt="AVefi placeholder" loading="lazy"
                            decoding="async" class="max-h-20 object-contain opacity-70" />
                    </div>
                </figure>
                <div class="card-body">
                    <h3 class="card-title text-lg font-semibold">
                        {{ item.title || item.alt || '' }}
                    </h3>
                    <p v-if="item.description" class="text-sm opacity-80">
                        {{ item.description }}
                    </p>
                    <div class="card-actions mt-auto">
                        <NuxtLink v-if="item.link" :to="item.link" target="_blank" rel="noopener"
                            class="btn btn-primary btn-sm">
                            {{ item.linkText || item.ctaText || $t('viewHomepage') || 'View Homepage' }}
                            <Icon name="tabler:arrow-right" class="ml-1" />
                        </NuxtLink>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
type CarouselItem = {
  src?: string;
  alt?: string;
  title?: string;
  link?: string;
  linkText?: string;
  ctaText?: string;
  description?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

withDefaults(
  defineProps<{
    items: CarouselItem[];
    autoSlideInterval?: number;
  }>(),
  {
    items: () => [],
    autoSlideInterval: 5000,
  }
);
</script>
