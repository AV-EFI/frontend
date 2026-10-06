<!-- Feed HTML is sanitized on the server using an explicit allowlist. -->
<!-- eslint-disable vue/no-v-html -->
<template>
    <NuxtLayout name="partial-layout-1-center" narrow padding-class="p-4 sm:px-8 lg:px-12" margin-bottom-class="mb-12 lg:mb-16">
        <template #navigation>
            <GlobalBreadcrumbsComp :breadcrumbs="[[$t('home.breadcrumbs'), '/'], [$t('news.title'), '/news']]" />
        </template>
        <template #title>
            <header class="news-header">
                <GlobalPageTitleComp variant="hero" class="text-3xl sm:text-4xl">{{ $t('news.title') }}</GlobalPageTitleComp>
                <a href="https://projects.tib.eu/av-efi/" class="link news-source">
                    {{ $t('news.projectWebsite') }}
                    <Icon name="tabler:external-link" aria-hidden="true" />
                </a>
            </header>
        </template>
        <template #cardBody>
            <div class="mx-auto w-full max-w-3xl space-y-6 break-words text-base">
                <p v-if="status === 'pending'" role="status">{{ $t('news.loading') }}</p>
                <div v-else-if="error" role="alert" class="space-y-3">
                    <p>{{ $t('news.error') }}</p>
                    <button type="button" class="btn btn-outline" @click="refresh()">{{ $t('news.retry') }}</button>
                </div>
                <p v-else-if="!articles?.length" role="status">{{ $t('news.empty') }}</p>
                <ul v-else ref="listRef" class="news-list">
                    <li v-for="article in pagedArticles" :key="article.id">
                        <article class="news-article">
                            <time v-if="article.publishedAt" :datetime="article.publishedAt" class="news-date">{{ formatDate(article.publishedAt) }}</time>
                            <div class="news-article-heading">
                                <h2 lang="de" class="bree text-2xl sm:text-3xl leading-tight">{{ article.title }}</h2>
                                <a :href="article.link" class="link news-source">
                                    <span>{{ $t('news.original') }}<span lang="de" class="sr-only">: {{ article.title }}</span></span>
                                    <Icon name="tabler:external-link" aria-hidden="true" />
                                </a>
                            </div>
                            <div v-if="article.preview" lang="de" class="news-content" v-html="article.preview" />
                            <details v-if="article.content" class="news-details">
                                <summary class="news-toggle">
                                    <span>{{ $t('news.fullText') }}<span lang="de" class="sr-only">: {{ article.title }}</span></span>
                                    <Icon name="tabler:chevron-down" class="news-chevron" aria-hidden="true" />
                                </summary>
                                <div lang="de" class="news-content" v-html="article.content" />
                            </details>
                        </article>
                    </li>
                </ul>
                <nav v-if="pageCount > 1" class="news-pagination" role="navigation" :aria-label="$t('news.pagination.label')">
                    <button type="button" class="btn btn-sm btn-ghost" :disabled="page <= 1" @click="goToPage(page - 1)">
                        <Icon name="tabler:chevron-left" aria-hidden="true" />
                        <span class="sr-only">{{ $t('news.pagination.previous') }}</span>
                    </button>
                    <span role="status" aria-live="polite" class="news-pagination-status">{{ $t('news.pagination.page', { page, total: pageCount }) }}</span>
                    <button type="button" class="btn btn-sm btn-ghost" :disabled="page >= pageCount" @click="goToPage(page + 1)">
                        <Icon name="tabler:chevron-right" aria-hidden="true" />
                        <span class="sr-only">{{ $t('news.pagination.next') }}</span>
                    </button>
                </nav>
            </div>
        </template>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNews } from '~/composables/useNews';

definePageMeta({ auth: false, middleware: ['news'] });
const { t, locale } = useI18n();
useSeoMeta({ title: () => `${t('news.title')} | AVefi`, robots: 'noindex, nofollow' });
const { data: articles, status, error, refresh } = await useNews();
const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long', timeZone: 'UTC',
}).format(new Date(value));

const PAGE_SIZE = 10;
const route = useRoute();
const router = useRouter();
const listRef = ref<HTMLElement | null>(null);

const pageCount = computed(() => Math.max(1, Math.ceil((articles.value?.length ?? 0) / PAGE_SIZE)));
const page = computed(() => {
    const raw = Number(route.query.page);
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(Math.trunc(raw), pageCount.value);
});
const pagedArticles = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;
    return articles.value?.slice(start, start + PAGE_SIZE) ?? [];
});

const goToPage = (target: number) => {
    const clamped = Math.min(Math.max(target, 1), pageCount.value);
    router.push({ query: { ...route.query, page: clamped === 1 ? undefined : clamped } });
    listRef.value?.scrollIntoView({ block: 'start' });
};
</script>

<style scoped>
.news-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0 1.5rem;
}
.news-source { display: inline-flex; align-items: center; gap: 0.5rem; text-underline-offset: 0.25em; }
.news-source :deep(.iconify) { flex-shrink: 0; }
.news-list { padding: 0; list-style: none; }
.news-list > li + li { border-top: 1px solid var(--color-base-300); }
.news-article { display: grid; gap: 0.625rem; padding: 3rem 0; }
.news-article-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1.5rem; }
.news-article-heading > .news-source { font-size: 0.8125rem; opacity: 0.75; flex-shrink: 0; margin-bottom: 0.375rem; margin-left: auto; }
.news-article-heading > .news-source:hover { opacity: 1; }
.news-date { display: block; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.03em; }
.news-date::before { content: ''; display: inline-block; width: 1.5rem; height: 2px; margin-right: 0.75rem; vertical-align: middle; background: var(--color-primary); }
.news-details { border-top: 1px solid var(--color-base-300); }
.news-toggle { display: flex; align-items: center; gap: 0.375rem; padding: 0.75rem 0; cursor: pointer; font-size: 1rem; font-weight: 700; list-style: none; color: var(--color-primary); }
.news-toggle::-webkit-details-marker { display: none; }
.news-toggle:hover { text-decoration: underline; text-underline-offset: 0.25em; }
.news-toggle:focus-visible { outline: 2px solid currentColor; outline-offset: -4px; }
.news-chevron { flex-shrink: 0; width: 1rem; height: 1rem; }
.news-details[open] .news-chevron { transform: rotate(180deg); }
.news-details > .news-content { padding-top: 0.25rem; }
.news-content { line-height: 1.7; }
.news-content :deep(p + p), .news-content :deep(ul), .news-content :deep(ol) { margin-top: 1rem; }
.news-content :deep(a) { text-decoration: underline; overflow-wrap: anywhere; }
.news-content :deep(ul) { list-style: disc; padding-left: 1.5rem; }
.news-content :deep(ol) { list-style: decimal; padding-left: 1.5rem; }
.news-pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; padding-top: 2rem; }
.news-pagination-status { font-size: 0.875rem; }
</style>
