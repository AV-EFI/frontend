<template>
    <section class="relative border-t border-base-200 py-10 section-wash section-wash--a">
        <div class="px-2 text-center">
            <div class="w-full flex flex-col justify-center max-lg:mt-6">
                <h2 class="text-3xl bree md:text-4xl font-extrabold mt-6 mb-4 lg:mb-6 text-center" tabindex="0">
                    {{ t('topIssuers') || 'Top Publishers & Archives' }}
                </h2>
                <div class="flex" ref="issuerCarouselRef">
                    <div v-if="issuerCarouselReady" class="w-full">
                        <ClientOnly>
                            <LazyGlobalIssuerCarouselComp />
                        </ClientOnly>
                    </div>
                    <div v-else class="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4" aria-hidden="true">
                        <article v-for="issuer in issuerPlaceholderItems" :key="issuer.name"
                            class="border border-base-200 rounded-2xl p-4 bg-white/90 dark:bg-base-200/70">
                            <figure class="flex items-center justify-center h-20 mb-3">
                                <img :src="issuer.image" :alt="issuer.alt" loading="lazy" decoding="async" width="220"
                                    height="80" class="max-h-full max-w-full object-contain" />
                            </figure>
                            <h3 class="text-base font-semibold">{{ issuer.name }}</h3>
                            <p class="text-sm opacity-75">{{ issuer.count.toLocaleString() }} {{ issuer.count === 1 ?
                                t('dataset') : t('datasets') }}</p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import topIssuersData from '~/data/top-issuers.json';
import issuerImagesData from '~/data/issuer-images.json';

const { t } = useI18n();

const issuerCarouselRef = ref<HTMLElement | null>(null);
const issuerCarouselReady = ref(false);

const issuerPlaceholderItems = computed(() => {
  const issuers = Array.isArray((topIssuersData as any)?.issuers) ? (topIssuersData as any).issuers : [];
  const mappings = (issuerImagesData as any)?.mappings || {};
  const fallback = (issuerImagesData as any)?.fallback || {};

  return issuers.slice(0, 4).map((issuer: any) => {
    const imageInfo = issuer.id && mappings[issuer.id] ? mappings[issuer.id] : null;
    return {
      name: issuer.name,
      count: issuer.doc_count,
      image: imageInfo?.image || fallback.image,
      alt: imageInfo?.alt || `${issuer.name} Logo`
    };
  });
});

if (import.meta.client) {
  const { stop } = useIntersectionObserver(
    issuerCarouselRef,
    ([entry]) => {
      if (entry?.isIntersecting) {
        issuerCarouselReady.value = true;
        stop();
      }
    },
    { rootMargin: '240px 0px' }
  );
}
</script>
