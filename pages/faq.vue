<!-- eslint-disable vue/no-v-html -->
<template>
    <NuxtLayout name="partial-layout-1-center">
        <template #navigation>
            <GlobalBreadcrumbsComp :breadcrumbs="[
                ['Home', '/'],
                [$t('faq.title'), '/faq'],
            ]" />
        </template>

        <template #title>
            <h1 class="text-lg font-bold xl:text-xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden content-center lg:ml-4">
                {{ $t('faq.title') }}
            </h1>
        </template>

        <template #cardBody>
            <div class="container" role="region" :aria-label="$t('faq.mainContent')">
                <div class="w-full md:w-4/5 mx-auto">
                    <article class="container flex justify-center" role="region" :aria-label="$t('faq.articleContent')">
                        <div class="frame frame-default frame-type-text frame-layout-0 w-full text-balance text-left">
                            <div
                                v-for="section in accordionSections"
                                :key="section.key"
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey(section.key)"
                                role="region"
                                :aria-label="$t(`${section.key}.heading`)"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections[section.key]"
                                    @change="(event) => handleToggle(section.key, event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t(`${section.key}.heading`) }}</h2>
                                </div>

                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <p
                                        v-for="(paragraph, index) in getContent(section.key)"
                                        :key="index"
                                        class="my-2"
                                        v-html="paragraph"
                                    />
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </template>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue';

definePageMeta({ auth: false });

const { t, tm } = useI18n();

type AccordionSection = {
    key: string;
    defaultOpen?: boolean;
};

const accordionSections: AccordionSection[] = [
    { key: 'faq.sections.about', defaultOpen: true },
    { key: 'faq.sections.availableMetadata' },
    { key: 'faq.sections.definitions' },
    { key: 'faq.sections.efis' },
    { key: 'faq.sections.whyEfis' },
    { key: 'faq.sections.keywords' },
    { key: 'faq.sections.normdata' },
    { key: 'faq.sections.reuse' },
    { key: 'faq.sections.watchBorrow' },
    { key: 'faq.sections.viewingCopies' },
    { key: 'faq.sections.dataProviders' },
    { key: 'faq.sections.dataQuality' },
];

const openSections = reactive<Record<string, boolean>>({});

accordionSections.forEach((section) => {
    openSections[section.key] = !!section.defaultOpen;
});

const getContent = (sectionKey: string): string[] => {
    const value = tm(`${sectionKey}.content`);
    return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];
};

const hashFromKey = (key: string) => key.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

const updateLocationHash = (key: string, isOpen: boolean) => {
    if (!import.meta.client) return;

    const normalized = hashFromKey(key);
    const currentHash = window.location.hash.replace('#', '');

    if (isOpen) {
        if (currentHash === normalized) return;
        const nextUrl = `${window.location.pathname}${window.location.search}#${normalized}`;
        window.history.replaceState(window.history.state, '', nextUrl);
    } else if (currentHash === normalized) {
        const nextUrl = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(window.history.state, '', nextUrl);
    }
};

const handleToggle = (key: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    openSections[key] = target.checked;
    updateLocationHash(key, target.checked);
};

const openSectionFromHash = (hash?: string | null) => {
    if (!hash) return;

    const normalized = hash.replace('#', '');
    const match = accordionSections.find((section) => hashFromKey(section.key) === normalized);

    if (match) {
        openSections[match.key] = true;

        if (import.meta.client) {
            requestAnimationFrame(() => {
                const target = document.getElementById(normalized);
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }
};

if (import.meta.client) {
    const handleHashChange = () => {
        openSectionFromHash(window.location.hash);
    };

    onMounted(() => {
        openSectionFromHash(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('hashchange', handleHashChange);
    });
}

useSeoMeta({
    title: t('seo.faq.title'),
    description: t('seo.faq.description'),
    ogTitle: t('seo.faq.ogTitle'),
    ogDescription: t('seo.faq.ogDescription'),
    ogImage: '/img/avefi-og-image.png',
    keywords: [
        'FAQ',
        'Häufig gestellte Fragen',
        'Hilfe',
        'Support',
        'Nutzungshinweise',
        'Anleitung',
        'Filmrecherche Hilfe',
        'Suchfunktionen',
        'Filterfunktionen',
        'Ergebnisanzeige',
        'AVefi Portal',
        'Filmmetadaten',
    ].join(', '),
});
</script>