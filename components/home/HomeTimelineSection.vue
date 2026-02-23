<template>
    <section class="relative border-t border-base-200 py-10 section-wash section-wash--a" role="region"
        :aria-label="t('timeline.title')">
        <div class="container mx-auto p-6 lg:px-4 lg:min-h-[400px] flex items-center">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
                <div
                    class="w-full max-lg:card max-lg:bg-white/70 max-lg:dark:bg-neutral/30 max-lg:shadow-lg max-lg:rounded-xl p-6 flex flex-col justify-center">
                    <h2 class="text-3xl text-left bree md:text-4xl font-extrabold mb-6" tabindex="0">
                        {{ t('timeline.title') }}
                    </h2>
                    <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical" role="list">
                        <li role="listitem" tabindex="0">
                            <div class="timeline-middle text-primary my-2">
                                <Icon class="text-2xl" name="tabler:search" aria-hidden="true" />
                            </div>
                            <div class="timeline-start md:text-end mb-4">
                                <div class="text-lg font-semibold">{{ t('timeline.query.title') }}</div>
                                <div class="opacity-80">{{ t('timeline.query.desc') }}</div>
                            </div>
                            <hr class="bg-primary/40" />
                        </li>
                        <li role="listitem" tabindex="0">
                            <hr class="bg-primary/40" />
                            <div class="timeline-middle text-primary my-2">
                                <Icon class="text-2xl" name="tabler:filter" aria-hidden="true" />
                            </div>
                            <div class="timeline-end mb-4">
                                <div class="text-lg font-semibold">{{ t('timeline.refine.title') }}</div>
                                <div class="opacity-80">{{ t('timeline.refine.desc') }}</div>
                            </div>
                            <hr class="bg-primary/40" />
                        </li>
                        <li role="listitem" tabindex="0">
                            <hr class="bg-primary/40" />
                            <div class="timeline-middle text-primary my-2">
                                <Icon class="text-2xl" name="tabler:share-2" aria-hidden="true" />
                            </div>
                            <div class="timeline-start md:text-end mb-4">
                                <div class="text-lg font-semibold">{{ t('timeline.share.title') }}</div>
                                <div class="opacity-80">{{ t('timeline.share.desc') }}</div>
                            </div>
                            <hr class="bg-primary/40" />
                        </li>
                        <li role="listitem" tabindex="0">
                            <hr class="bg-primary/40" />
                            <div class="timeline-middle text-primary my-2">
                                <Icon class="text-2xl" name="tabler:books" aria-hidden="true" />
                            </div>
                            <div class="timeline-end">
                                <div class="text-lg font-semibold">{{ t('timeline.cite.title') }}</div>
                                <div class="opacity-80">{{ t('timeline.cite.desc') }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    class="lg:col-span-1 flex justify-center items-center max-w-md md:max-w-lg lg:max-w-full px-6 md:px-6 lg:px-0">
                    <div class="text-left max-w-md">
                        <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                            {{ t('build.linked.title') }}
                        </h2>
                        <p class="text-base md:text-lg opacity-80" tabindex="0">
                            {{ t('build.linked.lead') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
