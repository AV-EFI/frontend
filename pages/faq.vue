<!-- eslint-disable vue/no-v-html -->
<template>
    <NuxtLayout name="partial-layout-1-center">
        <template #navigation>
            <GlobalBreadcrumbsComp :breadcrumbs="[
                ['Home', '/'],
                [$t('faq'), '/faq'],
            ]" />
        </template>

        <template #title>
            <h1 class="text-lg font-bold xl:text-xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden content-center lg:ml-4">
                {{ $t('faq') }}
            </h1>
        </template>

        <template #cardBody>
            <div class="container" role="region" :aria-label="$t('contact.mainContent')">
                <div class="w-full md:w-4/5 mx-auto">
                    <article class="container flex justify-center" role="region" :aria-label="$t('contact.articleContent')">
                        <div id="c7273" class="frame frame-default frame-type-text frame-layout-0 w-full text-balance text-left">
                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.about.heading')"
                                role="region"
                                :aria-label="$t('contact.about.heading')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.about.heading']"
                                    @change="(event) => handleToggle('contact.about.heading', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.about.heading') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.about.0')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.about.1')" />
                                    <p class="my-2">
                                        <GlobalGlossaryTextComp tag="span" :text="$t('contact.about.2.beforeLink')" />
                                        <a class="link" href="https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html"
                                           target="_blank">FIAF-Regelwerk</a>
                                        <GlobalGlossaryTextComp tag="span" :text="$t('contact.about.2.afterLink')" />
                                    </p>
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.availableMetadata')"
                                role="region"
                                :aria-label="$t('contact.availableMetadata')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.availableMetadata']"
                                    @change="(event) => handleToggle('contact.availableMetadata', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.availableMetadata') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.availableMetadataContent')" />
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.definitions')"
                                role="region"
                                :aria-label="$t('contact.definitions')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.definitions']"
                                    @change="(event) => handleToggle('contact.definitions', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.definitions') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.0')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.1')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.2')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.3')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.4')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.5')" />
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.workContent.6')" />
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.keywords')"
                                role="region"
                                :aria-label="$t('contact.keywords')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.keywords']"
                                    @change="(event) => handleToggle('contact.keywords', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.keywords') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.keywordsContent')" />
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.normdata')"
                                role="region"
                                :aria-label="$t('contact.normdata')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.normdata']"
                                    @change="(event) => handleToggle('contact.normdata', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.normdata') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <p class="my-2">
                                        <GlobalGlossaryTextComp tag="span" :text="$t('contact.normdataContent.beforeLink')" />
                                        <a class="link" href="https://gnd.network/Webs/gnd/DE/UeberGND/ueberGND_node.html"
                                           target="_blank">Gemeinsamen Normdatei (GND)</a>
                                        <GlobalGlossaryTextComp tag="span" :text="$t('contact.normdataContent.afterLink')" />
                                    </p>
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.availability')"
                                role="region"
                                :aria-label="$t('contact.availability')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.availability']"
                                    @change="(event) => handleToggle('contact.availability', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.availability') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.availabilityContent')" />
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.pids')"
                                role="region"
                                :aria-label="$t('contact.pids')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.pids']"
                                    @change="(event) => handleToggle('contact.pids', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.pids') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.pidsContent.0')" />
                                    <GlobalGlossaryTextComp tag="p" :text="$t('contact.pidsContent.1')" />
                                </div>
                            </div>

                            <div
                                class="collapse collapse-arrow mt-2"
                                :id="hashFromKey('contact.dataProviders')"
                                role="region"
                                :aria-label="$t('contact.dataProviders')"
                            >
                                <input
                                    type="checkbox"
                                    :checked="openSections['contact.dataProviders']"
                                    @change="(event) => handleToggle('contact.dataProviders', event)"
                                >
                                <div class="collapse-title bg-gray-100 dark:bg-gray-700 dark:text-white font-bold">
                                    <h2>{{ $t('contact.dataProviders') }}</h2>
                                </div>
                                <div class="collapse-content bg-gray-50 dark:bg-gray-900 dark:text-white">
                                    <GlobalGlossaryTextComp tag="p" class="my-2" :text="$t('contact.dataProvidersContent')" />
                                    <ul>
                                        <li class="link"><span v-html="$t('howToDoc')" /></li>
                                        <li class="link"><span v-html="$t('manual')" /></li>
                                    </ul>
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

const { t } = useI18n();

type AccordionSection = {
    key: string;
    defaultOpen?: boolean;
};

const accordionSections: AccordionSection[] = [
    { key: 'contact.about.heading', defaultOpen: true },
    { key: 'contact.availableMetadata' },
    { key: 'contact.definitions' },
    { key: 'contact.keywords' },
    { key: 'contact.normdata' },
    { key: 'contact.availability' },
    { key: 'contact.pids' },
    { key: 'contact.dataProviders' },
];

const openSections = reactive<Record<string, boolean>>({});

accordionSections.forEach((section) => {
    openSections[section.key] = !!section.defaultOpen;
});

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


</script>

