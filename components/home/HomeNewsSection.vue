<template>
    <HomeSectionShell
        v-if="articles?.length"
        wash="none"
        section-class="bg-base-200/60 dark:bg-neutral/20"
        role="region"
        :aria-label="t('home.sections.news.aria')"
    >
        <div class="w-full flex flex-col gap-6 px-4 lg:px-0">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight">
                    {{ t('home.sections.news.title') }}
                </h2>
                <div class="flex flex-col items-end gap-1 text-right">
                    <a v-if="latestArticle" :href="latestArticle.link" lang="de" class="link text-sm">
                        {{ t('news.original') }}: {{ latestArticle.title }}
                    </a>
                    <NuxtLink to="/news" class="link">
                        {{ t('home.sections.news.allNews') }}
                    </NuxtLink>
                </div>
            </div>
            <ul class="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list">
                <li v-for="article in articles" :key="article.id">
                    <NuxtLink to="/news" class="card h-full bg-base-100 border border-base-300 p-5 flex flex-col gap-2 hover:border-primary transition-colors">
                        <time v-if="article.publishedAt" :datetime="article.publishedAt" class="text-sm font-semibold opacity-70">
                            {{ formatDate(article.publishedAt) }}
                        </time>
                        <h3 lang="de" class="text-lg font-bold leading-snug">{{ article.title }}</h3>
                        <p v-if="teaser(article)" lang="de" class="text-sm opacity-80 line-clamp-3">{{ teaser(article) }}</p>
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </HomeSectionShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from 'nuxt/app';
import HomeSectionShell from '~/components/home/HomeSectionShell.vue';
import { useNews, type NewsArticle } from '~/composables/useNews';

const { t, locale } = useI18n();
const runtimeConfig = useRuntimeConfig();

const { data: articles } = await useNews({ limit: computed(() => Number(runtimeConfig.public.newsHomeCount) || 3) });
const latestArticle = computed(() => articles.value?.[0]);

const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long', timeZone: 'UTC',
}).format(new Date(value));

const TEASER_MAX_LENGTH = 160;
const teaser = (article: NewsArticle) => {
    const plain = article.preview.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!plain) return '';
    return plain.length > TEASER_MAX_LENGTH ? `${plain.slice(0, TEASER_MAX_LENGTH).trimEnd()}…` : plain;
};
</script>
