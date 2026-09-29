<!-- Feed HTML is sanitized on the server using an explicit allowlist. -->
<!-- eslint-disable vue/no-v-html -->
<template>
    <HomeSectionShell
        v-if="articles?.length"
        wash="a"
        role="region"
        :aria-label="t('home.sections.news.aria')"
    >
        <div class="w-full flex flex-col gap-6">
            <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight">
                    {{ t('home.sections.news.title') }}
                </h2>
                <NuxtLink to="/news" class="link shrink-0">
                    {{ t('home.sections.news.allNews') }}
                </NuxtLink>
            </div>
            <Transition name="news-layout" mode="out-in">
                <ul v-if="!expandedArticle" key="grid" class="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list">
                    <li v-for="article in articles" :key="article.id" class="min-w-0">
                        <article class="h-full rounded-lg bg-base-100 dark:bg-base-200 p-4 flex flex-col gap-2">
                            <time v-if="article.publishedAt" :datetime="article.publishedAt" class="text-sm font-semibold opacity-70">
                                {{ formatDate(article.publishedAt) }}
                            </time>
                            <h3 lang="de" class="text-lg font-bold leading-snug wrap-break-word">{{ article.title }}</h3>
                            <p v-if="article.preview" lang="de" class="home-news-content text-sm opacity-80 wrap-break-word" v-html="article.preview" />
                            <button
                                v-if="article.content"
                                type="button"
                                class="mt-auto pt-1 text-sm font-semibold text-primary text-left cursor-pointer hover:underline underline-offset-4"
                                :aria-expanded="false"
                                :aria-controls="`home-news-panel-${article.id}`"
                                @click="expandedId = article.id"
                            >
                                {{ t('news.fullText') }}
                            </button>
                        </article>
                    </li>
                </ul>

                <div v-else key="split" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <article
                        :id="`home-news-panel-${expandedArticle.id}`"
                        class="rounded-lg bg-base-100 dark:bg-base-200 p-4 flex flex-col gap-2"
                        :class="otherArticles.length ? '' : 'lg:col-span-2'"
                    >
                        <div class="flex items-start justify-between gap-4">
                            <time v-if="expandedArticle.publishedAt" :datetime="expandedArticle.publishedAt" class="text-sm font-semibold opacity-70">
                                {{ formatDate(expandedArticle.publishedAt) }}
                            </time>
                            <button
                                type="button"
                                class="btn btn-ghost btn-xs shrink-0"
                                :aria-expanded="true"
                                :aria-controls="`home-news-panel-${expandedArticle.id}`"
                                :aria-label="t('home.sections.news.collapse')"
                                @click="expandedId = null"
                            >
                                <Icon name="tabler:x" aria-hidden="true" />
                            </button>
                        </div>
                        <h3 lang="de" class="text-lg font-bold leading-snug wrap-break-word">{{ expandedArticle.title }}</h3>
                        <div lang="de" class="home-news-content text-sm opacity-80 wrap-break-word" v-html="expandedArticle.content" />
                        <a href="expandedArticle.link" class="sr-only" :aria-label="t('news.fullText')" />
                        <a class="link link-primary text-sm ml-auto" target="_blank" :href="expandedArticle.link" :aria-label="t('news.original')" >{{ t('news.original') }}</a>
                    </article>

                    <ul v-if="otherArticles.length" class="flex flex-col gap-4" role="list">
                        <li v-for="article in otherArticles" :key="article.id">
                            <article class="rounded-lg bg-base-100 dark:bg-base-200 p-4 flex flex-col gap-1">
                                <time v-if="article.publishedAt" :datetime="article.publishedAt" class="text-sm font-semibold opacity-70">
                                    {{ formatDate(article.publishedAt) }}
                                </time>
                                <h3 lang="de" class="text-base font-bold leading-snug wrap-break-word">{{ article.title }}</h3>
                                <p v-if="article.preview" lang="de" class="home-news-content text-sm opacity-80 wrap-break-word line-clamp-2" v-html="article.preview" />
                                <button
                                    v-if="article.content"
                                    type="button"
                                    class="text-sm font-semibold text-primary text-left cursor-pointer hover:underline underline-offset-4"
                                    :aria-expanded="false"
                                    :aria-controls="`home-news-panel-${article.id}`"
                                    @click="expandedId = article.id"
                                >
                                    {{ t('news.fullText') }}
                                </button>
                            </article>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>
    </HomeSectionShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from 'nuxt/app';
import HomeSectionShell from '~/components/home/HomeSectionShell.vue';
import { useNews } from '~/composables/useNews';

const { t, locale } = useI18n();
const runtimeConfig = useRuntimeConfig();

const { data: articles } = await useNews({ limit: computed(() => Number(runtimeConfig.public.newsHomeCount) || 3) });
const latestArticle = computed(() => articles.value?.[0]);

const expandedId = ref<string | null>(null);
const expandedArticle = computed(() => articles.value?.find((article) => article.id === expandedId.value) ?? null);
const otherArticles = computed(() => articles.value?.filter((article) => article.id !== expandedId.value) ?? []);

const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long', timeZone: 'UTC',
}).format(new Date(value));
</script>

<style scoped>
.home-news-content :deep(a) { text-decoration: underline; overflow-wrap: anywhere; }
.home-news-content :deep(p + p) { margin-top: 0.5rem; }

.news-layout-enter-active,
.news-layout-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.news-layout-enter-from,
.news-layout-leave-to {
    opacity: 0;
    transform: translateY(6px) scale(0.99);
}
@media (prefers-reduced-motion: reduce) {
    .news-layout-enter-active,
    .news-layout-leave-active {
        transition: none;
    }
}
</style>
