<template>
  <section
    class="relative border-t border-base-200 py-10 section-wash section-wash--a"
    role="region"
    :aria-label="t('timeline.title')"
  >
    <div class="container mx-auto p-6 lg:px-4 lg:min-h-[400px] flex items-center">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
        <div
          class="w-full p-6 flex flex-col justify-center max-lg:bg-white/70 max-lg:dark:bg-neutral/30 max-lg:shadow-lg max-lg:rounded-xl"
        >
          <h2 class="text-3xl text-left bree md:text-4xl font-extrabold mb-6" tabindex="0">
            {{ t('timeline.title') }}
          </h2>

          <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical" role="list">
            <!-- 1) QUERY -->
            <li role="listitem" tabindex="0" class="group relative">
              <div class="timeline-middle text-primary my-2 relative">
                <Icon class="text-2xl relative z-10" name="tabler:search" aria-hidden="true" />
              </div>

              <div class="timeline-start md:text-end mb-4">
                <div class="text-lg font-semibold">{{ t('timeline.query.title') }}</div>
                <div class="opacity-80">{{ t('timeline.query.desc') }}</div>
              </div>

              <hr class="bg-primary/40" />
            </li>

            <!-- 2) REFINE -->
            <li role="listitem" tabindex="0" class="group relative">
              <hr class="bg-primary/40" />

              <div class="timeline-middle text-primary my-2 relative">
                <Icon class="text-2xl relative z-10" name="tabler:filter" aria-hidden="true" />
              </div>

              <div class="timeline-end mb-4">
                <div class="text-lg font-semibold">{{ t('timeline.refine.title') }}</div>
                <div class="opacity-80">{{ t('timeline.refine.desc') }}</div>
              </div>
              <hr class="bg-primary/40" />
            </li>

            <!-- 3) SHARE -->
            <li role="listitem" tabindex="0" class="group relative">
              <hr class="bg-primary/40" />

              <div class="timeline-middle text-primary my-2 relative">
                <Icon class="text-2xl relative z-10" name="tabler:share-2" aria-hidden="true" />
              </div>

              <div class="timeline-start md:text-end mb-4">
                <div class="text-lg font-semibold">{{ t('timeline.share.title') }}</div>
                <div class="opacity-80">{{ t('timeline.share.desc') }}</div>
              </div>

              <hr class="bg-primary/40" />
            </li>

            <!-- 4) CITE -->
            <li role="listitem" tabindex="0" class="group relative">
              <hr class="bg-primary/40" />

              <div class="timeline-middle text-primary my-2 relative">
                <Icon class="text-2xl relative z-10" name="tabler:books" aria-hidden="true" />
              </div>

              <div class="timeline-end">
                <div class="text-lg font-semibold">{{ t('timeline.cite.title') }}</div>
                <div class="opacity-80">{{ t('timeline.cite.desc') }}</div>
              </div>
            </li>
          </ul>
        </div>

        <HomeSectionTextBlock
          :title="t('build.linked.title')"
          :paragraphs="[t('build.linked.lead')]"
          wrapper-class="w-full"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';

const { t } = useI18n();
</script>

<style scoped>
/* --- Academic subtle micro-interactions for “infrastructure / linked data” --- */

.timeline li:focus-visible {
  outline: 2px solid color-mix(in oklab, currentColor 25%, transparent);
  outline-offset: 6px;
  border-radius: 14px;
}

</style>