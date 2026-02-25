<template>
    <div class="min-h-screen bg-base-100 text-base-content flow">
        <!-- Skip link -->
        <a href="#main"
            class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-40 btn btn-sm btn-primary">
            {{ $t('skipToContent') || 'Skip to main content' }}
        </a>

        <!-- ======= HERO / SEARCH-FIRST ======= -->
        <section id="hero" role="banner" :aria-label="$t('bannerSection')" class="relative z-20">
            <div class="hero max-sm:min-h-[48vh] sm:min-h-[32vh] lg:min-h-[58vh]">
                <div class="hero-overlay absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
                    <div
                        class="absolute inset-0 md:hidden bg-gradient-to-b from-base-200 to-base-100 dark:from-neutral-900 dark:to-neutral-950">
                    </div>
                    <picture class="absolute inset-0 w-full h-full hidden md:block" aria-hidden="true">
                        <source media="(min-width: 1280px)" srcset="/img/avefi_nodes-hero-2040.webp" type="image/webp">
                        <source media="(min-width: 1024px)" srcset="/img/avefi_nodes-hero-1024.webp" type="image/webp">
                        <source media="(min-width: 640px)" srcset="/img/avefi_nodes-hero-720.webp" type="image/webp">
                        <img src="/img/avefi_nodes-hero-480.webp" width="2040" height="1360" alt=""
                            class="h-full w-full object-cover object-center dark:brightness-100 dark:invert dark:hue-rotate-180"
                            loading="eager" decoding="async" fetchpriority="high" sizes="100vw"
                            srcset="/img/avefi_nodes-hero-480.webp 480w, /img/avefi_nodes-hero-720.webp 720w, /img/avefi_nodes-hero-1024.webp 1024w, /img/avefi_nodes-hero-2040.webp 2040w">
                    </picture>
                    <!-- Aurora / glow overlays (light + dark variants) -->
                    <div class="absolute inset-0 motion-reduce:transition-none motion-reduce:animate-none saturate-[1.05] pointer-events-none hidden md:block"
                        aria-hidden="true"></div>
                    <!-- Vignette -->
                    <div class="absolute inset-0 pointer-events-none hidden md:block
              mix-blend-multiply dark:mix-blend-normal
              bg-[radial-gradient(1200px_700px_at_50%_40%,rgba(0,0,0,0)_42%,rgba(0,0,0,0.08)_100%),linear-gradient(180deg,rgba(0,0,0,0.08),transparent_22%,transparent_78%,rgba(0,0,0,0.10))]
              dark:hidden">
                    </div>
                </div>

                <div class="hero-content p-0 md:p-2 w-full lg:w-full">
                    <div class="w-full lg:max-w-6xl mx-auto">
                        <!-- Center content panel: THIS is what makes it readable -->
                        <div class="hero-panel max-w-90vw lg:max-w-6xl mx-auto px-4 py-9 rounded-2xl
                  border
                  shadow-none md:shadow-[0_28px_70px_-52px_rgba(0,0,0,0.40)]
                  md:supports-[backdrop-filter]:backdrop-blur-[10px]
                  motion-reduce:transition-none
                " :class="[
                  // LIGHT glass
                  'bg-white/95 border-white/30 md:bg-white/85 md:border-white/40',
                  // DARK glass (this is what was missing)
                  'dark:bg-neutral/40 dark:border-white/10',
                  // subtle inner highlight like your inset 1px
                  'shadow-inner dark:shadow-none',
                ]">
                            <div class="text-center">
                                <h1 class="hero-title mt-2 bree text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight
                  [text-shadow:0_1px_0_rgba(255,255,255,0.75)]
                  dark:[text-shadow:0_1px_0_rgba(0,0,0,0.55)]" tabindex="0">
                                    <span v-for="(line, idx) in heroClaimLines" :key="`hero-claim-${idx}`"
                                        class="hero-title__line">{{ line }}</span>
                                </h1>
                                <p class="
                    mt-4 md:text-lg opacity-85 max-w-2xl mx-auto
                    [text-shadow:0_1px_0_rgba(255,255,255,0.55)]
                    dark:[text-shadow:0_1px_0_rgba(0,0,0,0.45)]
                  " tabindex="0">
                                    {{ $t('home.tagline') }}
                                </p>
                            </div>

                            <!-- BIG centered search -->
                            <div class="mt-6 grid place-items-center">
                                <div class="w-full max-w-4xl">
                                    <!-- Glass search card -->
                                    <div class="hero-search-card card border
                              shadow-none md:shadow-[0_26px_70px_-48px_rgba(0,0,0,0.45),0_8px_26px_-18px_rgba(0,0,0,0.18)]
                              md:supports-[backdrop-filter]:backdrop-blur-[14px]" :class="[
                        // LIGHT
                        'bg-white border-white/30 md:bg-white/55 md:border-white/35',
                        // DARK
                        'dark:bg-neutral/35 dark:border-white/10',
                      ]">
                                        <div id="home-search-area" class="card-body p-2 md:p-6 my-auto" role="search"
                                            :aria-labelledby="'home-search-label'" aria-live="polite"
                                            aria-atomic="false" tabindex="0">
                                            <!-- Card header row: integrated mode switch -->
                                            <div
                                                class="flex flex-col md:flex-row md:items-center md:justify-between gap-1 lg:gap-3 bg-base-200 rounded-xl">
                                                <div class="md:justify-end" role="group"
                                                    :aria-label="$t('searchModeSwitcher') || 'Search mode switcher'">
                                                    <div class="join w-full">
                                                        <button class="join-item btn md:btn-sm"
                                                            :aria-label="$t('showSimpleSearch')"
                                                            :class="!showAdvancedSearch ? 'btn-primary' : 'btn-ghost'"
                                                            @click="showAdvancedSearch = false"
                                                            :aria-pressed="!showAdvancedSearch"
                                                            aria-controls="home-search-area">
                                                            <span class="hidden md:block">
                                                                {{ $t('showSimpleSearch') }}
                                                            </span>
                                                            <Icon name="tabler:zoom-scan"
                                                                class="lg:hidden ml-1 md:ml-0" />

                                                        </button>
                                                        <button class="join-item btn md:btn-sm"
                                                            :aria-label="$t('showAdvancedSearch')"
                                                            :class="showAdvancedSearch ? 'btn-primary' : 'btn-ghost'"
                                                            @click="showAdvancedSearch = true"
                                                            @pointerenter="prefetchAdvancedSearch"
                                                            @focus="prefetchAdvancedSearch"
                                                            :aria-pressed="showAdvancedSearch"
                                                            aria-controls="home-search-area">
                                                            <span class="hidden md:block">
                                                                {{ $t('showAdvancedSearch') }}
                                                            </span>
                                                            <Icon name="tabler:adjustments-cog"
                                                                class="lg:hidden ml-1 md:ml-0" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Search component -->
                                            <Suspense>
                                                <template #default>
                                                    <KeepAlive>
                                                        <component :is="activeSearchComponent" ref="searchCompRef"
                                                            :aria-labelledby="'home-search-label'" />
                                                    </KeepAlive>
                                                </template>
                                                <template #fallback>
                                                    <div
                                                        class="h-24 flex items-center justify-center text-sm opacity-70">
                                                        {{ $t('loadingSearch') || 'Loading search…' }}
                                                    </div>
                                                </template>
                                            </Suspense>

                                        </div>
                                    </div>
                                    <!-- /glass search card -->
                                </div>
                            </div>
                        </div>
                        <!-- /hero-content-panel -->
                    </div>
                </div>
            </div>
        </section>

        <NuxtLazyHydrate when-visible :offset="180">
            <section id="main" role="main" :aria-label="$t('featuredContent')"
                class="relative overflow-hidden border-t border-base-200 py-10">
                <!-- wash layer -->
                <!-- Aurora / glow overlays (light + dark variants) -->
                <div class="absolute inset-0 motion-reduce:transition-none motion-reduce:animate-none saturate-[1.05] pointer-events-none"
                    aria-hidden="true"></div>

                <!-- content stays above -->
                <div class="relative z-10 container mx-auto px-4 min-h-[400px] flex items-center">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        <HomeSectionTextBlock :title="$t('searchAndFind.title')"
                            :paragraphs="[$t('searchAndFind.text')]"
                            wrapper-class="lg:col-span-4" />
                        <div v-if="showFeaturedCarousel" class="lg:col-span-8 flex justify-center w-full"
                            ref="featuredCarouselRef">
                            <div class="relative w-full min-h-[32rem]">
                                <ClientOnly>
                                    <LazyGlobalCarouselCardComp v-if="featuredCarouselReady" :items="cardItems"
                                        class="h-full transition-opacity duration-300"
                                        :class="featuredCarouselReady ? 'opacity-100' : 'opacity-0 pointer-events-none'" />
                                </ClientOnly>
                                <div class="absolute inset-0 transition-opacity duration-200" role="presentation"
                                    :class="featuredCarouselReady ? 'opacity-0 pointer-events-none' : 'opacity-100'">
                                    <div class="carousel carousel-center w-full rounded-box p-4 overflow-hidden h-full"
                                        aria-hidden="true">
                                        <div v-for="n in 3" :key="`featured-skeleton-${n}`"
                                            class="carousel-item align-top flex flex-col items-center mx-2 bg-white/90 dark:bg-gray-800/80 w-[78vw] max-w-[240px] sm:max-w-none sm:w-72 md:w-96">
                                            <article
                                                class="card border border-base-200 bg-white/95 dark:bg-base-200/70 shadow-sm w-full">
                                                <figure class="rounded-xl overflow-hidden mb-3 bg-base-200 h-48">
                                                </figure>
                                                <div class="space-y-3 px-4 pb-4">
                                                    <div class="h-4 bg-base-200 rounded w-3/4"></div>
                                                    <div class="h-3 bg-base-200 rounded w-full"></div>
                                                    <div class="h-3 bg-base-200 rounded w-5/6"></div>
                                                    <div class="mt-4 h-9 bg-base-200 rounded"></div>
                                                </div>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="lg:col-span-8 flex justify-center w-full">
                            <div
                                class="card bg-base-100 border border-dashed border-base-300 shadow-none max-w-xl xl:max-w-full w-full p-6">
                                <p class="text-base md:text-lg opacity-80">
                                    {{ featuredCarouselFallback }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </NuxtLazyHydrate>

        <!-- ======= FROM RECORD TO KNOWLEDGE (timeline) ======= -->
        <NuxtLazyHydrate when-visible :offset="220">
            <div ref="timelineSectionRef" class="lazy-section-anchor">
                <ClientOnly>
                    <HomeTimelineSection v-if="timelineReady" class="block transition-opacity duration-300" />
                </ClientOnly>
                <section v-if="!timelineReady"
                    class="relative border-t border-base-200 py-10 section-wash section-wash--a" role="presentation"
                    aria-hidden="true">
                    <div class="container mx-auto p-6 lg:px-4 lg:min-h-[320px] flex items-center">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
                            <div class="w-full p-6 space-y-4">
                                <div class="h-10 w-3/4 bg-base-200 rounded-full"></div>
                                <div class="space-y-2">
                                    <div class="h-4 bg-base-200 rounded w-full"></div>
                                    <div class="h-4 bg-base-200 rounded w-5/6"></div>
                                    <div class="h-4 bg-base-200 rounded w-2/3"></div>
                                </div>
                            </div>
                            <HomeSectionTextBlock :title="$t('build.linked.title')"
                                :paragraphs="[$t('build.linked.lead')]" wrapper-class="w-full" />
                        </div>
                    </div>
                </section>
            </div>
        </NuxtLazyHydrate>

        <!-- ======= CORE FUNC & VIDEO BAND ======= -->
        <NuxtLazyHydrate when-visible :offset="260">
            <div
                class="container mx-auto p-6 lg:px-4 lg:min-h-[400px] grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
                <div ref="coreSectionRef" class="lazy-section-anchor w-full">
                    <ClientOnly>
                        <HomeCoreFunctionsSection v-if="coreReady" class="block transition-opacity duration-300" />
                    </ClientOnly>
                    <section v-if="!coreReady" role="presentation" aria-hidden="true"
                        class="relative border-t border-base-200 py-10">
                        <div class="container mx-auto px-4 min-h-[240px] flex items-center">
                            <HomeSectionTextBlock :title="$t('openAndExtendable.title')"
                                :paragraphs="[$t('openAndExtendable.content[0]'), $t('openAndExtendable.content[1]')]"
                                wrapper-class="w-full"
                                :cta-label="$t('openAndExtendable.cta')" :cta-href="$t('openAndExtendable.content[2]')"
                                cta-target="_blank" />
                        </div>
                    </section>
                </div>
                <div ref="videoSectionRef" class="lazy-section-anchor w-full">
                    <ClientOnly>
                        <HomeVideoSection v-if="videoReady" class="block transition-opacity duration-300" />
                    </ClientOnly>
                    <section v-if="!videoReady" role="presentation" aria-hidden="true"
                        class="relative border-t border-base-200 py-10">
                        <div class="container mx-auto px-4 min-h-[260px] flex items-center">
                            <div
                                class="w-full max-w-4xl mx-auto rounded-xl border border-dashed border-base-300 h-60 bg-base-200">
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </NuxtLazyHydrate>
        <!-- ======= ISSUER CAROUSEL ======= -->
        <NuxtLazyHydrate when-visible :offset="320">
            <div ref="issuerSectionRef" class="lazy-section-anchor">
                <ClientOnly>
                    <HomeIssuerSection v-if="issuerReady" class="block transition-opacity duration-300" />
                </ClientOnly>
                <section v-if="!issuerReady"
                    class="relative border-t border-base-200 py-10 section-wash section-wash--a" role="presentation"
                    aria-hidden="true">
                    <div class="px-4 text-center">
                        <div class="w-full flex flex-col justify-center max-lg:mt-6">
                            <div class="h-10 w-1/2 mx-auto bg-base-200 rounded mb-6"></div>
                            <div class="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div v-for="n in 4" :key="`issuer-skeleton-${n}`"
                                    class="border border-dashed border-base-300 rounded-2xl p-4 bg-base-100"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </NuxtLazyHydrate>


        <!-- ======= CTA ======= -->
        <NuxtLazyHydrate when-visible :offset="520">
            <div ref="ctaSectionRef" class="lazy-section-anchor">
                <ClientOnly>
                    <HomeCTASection v-if="ctaReady" class="block transition-opacity duration-300" />
                </ClientOnly>
                <section v-if="!ctaReady" role="presentation" aria-hidden="true"
                    class="relative border-t border-base-200 py-10">
                    <div class="container mx-auto p-6 lg:px-4 lg:min-h-[400px] flex items-center">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
                            <HomeSectionTextBlock :title="$t('callToAction.title')"
                                :paragraphs="[$t('callToAction.text')]" wrapper-class="w-full"
                                variant="dashed" />
                            <HomeSectionTextBlock :title="$t('becomeAPartner.title')"
                                :paragraphs="[$t('becomeAPartner.text')]" wrapper-class="w-full"
                                variant="dashed"
                                :cta-label="$t('becomeAPartner.cta')" :cta-href="$t('becomeAPartner.ctaLink')"
                                cta-target="_blank" />
                        </div>
                    </div>
                </section>
            </div>
        </NuxtLazyHydrate>
    </div>
</template>

<script lang="ts" setup>
import { useRuntimeConfig, useSeoMeta, useHead } from 'nuxt/app';
import { ref, onMounted, nextTick, watch, defineAsyncComponent, computed } from 'vue';
import type { Ref, ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useIntersectionObserver, unrefElement } from '@vueuse/core';
import SearchCompReduced from '~/components/global/SearchCompReduced.vue';
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';

const route = useRoute();
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const DEFAULT_FEATURED_CAROUSEL_FALLBACK = 'Scanne die Highlights bequem auf dem Desktop – auf dem Smartphone konzentrieren wir uns voll auf Suche und Ergebnisse.';
const criticalLinks: any[] = [
    {
        rel: 'preload',
        href: '/img/avefi_diamonds_prim_mobile.webp',
        as: 'image',
        media: '(max-width: 640px)',
        fetchpriority: 'high',
    },
];

criticalLinks.push({
    rel: 'preload',
    as: 'image',
    href: '/img/avefi_nodes-hero-1024.webp',
    imagesrcset:
    '/img/avefi_nodes-hero-480.webp 480w, /img/avefi_nodes-hero-720.webp 720w, /img/avefi_nodes-hero-1024.webp 1024w, /img/avefi_nodes-hero-2040.webp 2040w',
    imagesizes: '100vw',
    fetchpriority: 'high',
});

if (runtimeConfig.public.matomoUrl) {
    criticalLinks.push(
        { rel: 'preconnect', href: runtimeConfig.public.matomoUrl, crossorigin: '' },
        { rel: 'dns-prefetch', href: runtimeConfig.public.matomoUrl }
    );
}

useHead({
    link: criticalLinks,
});

const HomeTimelineSection = defineAsyncComponent(() => import('~/components/home/HomeTimelineSection.vue'));
const HomeVideoSection = defineAsyncComponent(() => import('~/components/home/HomeVideoSection.vue'));
const HomeIssuerSection = defineAsyncComponent(() => import('~/components/home/HomeIssuerSection.vue'));
const HomeCoreFunctionsSection = defineAsyncComponent(() => import('~/components/home/HomeCoreFunctionsSection.vue'));
const HomeCTASection = defineAsyncComponent(() => import('~/components/home/HomeCTASection.vue'));
const loadAdvancedSearchComponent = () => import('~/components/global/SearchCompExtended.vue');
const SearchCompExtended = defineAsyncComponent({
    loader: loadAdvancedSearchComponent,
    suspensible: true,
});
const featuredCarouselFallback = computed(() => t('featuredCarousel.mobileFallback') || DEFAULT_FEATURED_CAROUSEL_FALLBACK);
const heroClaimLines = computed(() => {
    const claim = t('avefiClaim');
    if (typeof claim !== 'string') {
        return [''];
    }
    const segments = claim.split(/(?<=\.)\s+/).filter(Boolean);
    return segments.length ? segments : [claim];
});

const CARD_IMAGE_WIDTHS = [240, 320, 360, 480, 720] as const;
const CARD_IMAGE_SIZES = '(max-width: 639px) 240px, (max-width: 1023px) 288px, 384px';

type CardItem = {
  description: string;
  title: string;
  link: string;
  linkText: string;
  imgSourceLink?: string;
  imgSourceText?: string;
  imgAuthor?: string;
  imgLicense?: string;
  imgLicenseLink?: string;
  imgSrc?: string;
  imgAlt?: string;
  imgCoverType?: string;
  imgCaption?: string;
  imgDepictedPlace?: string;
  imgDate?: string;
  imgCollection?: string;
  imgAccessionNumber?: string;
  imgSrcSet?: string;
  imgSizes?: string;
  imgWidth?: number;
  imgHeight?: number;
  imgBlurSrc?: string;
  imgBlurWidth?: number;
  imgBlurHeight?: number;
};

function createResponsiveCardMedia(baseName: string, width: number, height: number) {
    const normalized = baseName.replace(/\.(webp|jpg|jpeg|png)$/i, '');
    const aspectRatio = height / width;
    const blurWidth = CARD_IMAGE_WIDTHS[0];
    const blurHeight = Math.round(aspectRatio * blurWidth);

    return {
        imgSrc: `/img/${normalized}.webp`,
        imgSrcSet: CARD_IMAGE_WIDTHS.map((w) => `/img/${normalized}-${w}.webp ${w}w`).join(', '),
        imgSizes: CARD_IMAGE_SIZES,
        imgWidth: width,
        imgHeight: height,
        imgBlurSrc: `/img/${normalized}-${blurWidth}.webp`,
        imgBlurWidth: blurWidth,
        imgBlurHeight: blurHeight,
    } satisfies Partial<CardItem>;
}

// ─────────────────────────────────────────────
// SEO META (multi-language via i18n)
// ─────────────────────────────────────────────
useSeoMeta({
    title: t('seo.home.title'),
    description: t('seo.home.description'),
    ogTitle: t('seo.home.ogTitle'),
    ogDescription: t('seo.home.ogDescription'),
    ogType: 'website',
    ogUrl: (runtimeConfig.public.siteUrl || 'https://www.av-efi.net') + route.path,
    ogImage:
    runtimeConfig.public.siteOgImage ||
    ((runtimeConfig.public.siteUrl || 'https://www.av-efi.net') + '/img/avefi-og-image.png'),
    twitterCard: 'summary_large_image',
    twitterTitle: t('seo.home.title'),
    twitterDescription: t('seo.home.description'),
    keywords: [
        'AVefi',
        'Filmforschungsportal',
        'Filmrecherche',
        'Filmdatenbank',
        'Filmmetadaten',
        'audiovisuelle Bestände',
        'Archivdaten',
        'Filme suchen',
        'wissenschaftliche Nutzung',
        'Forschungsdaten',
        'Filmwissenschaft',
        'Linked Open Data',
        'Normdaten',
        'Persistent Identifier',
    ].join(', '),
});

// ─────────────────────────────────────────────
// Schema.org: WebSite + SearchAction + WebPage
// ─────────────────────────────────────────────
useSchemaOrg(() => {
    const baseUrl = runtimeConfig.public.siteUrl || 'https://www.av-efi.net';
    const url = baseUrl + route.path;
    return [
        defineWebSite({
            name: t('seo.home.siteName'),
            url: baseUrl,
            potentialAction: {
                '@type': 'SearchAction',
                target: `${baseUrl}/search/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        }),
        defineWebPage({
            '@type': 'WebPage',
            name: t('seo.home.title'),
            description: t('seo.home.description'),
            url,
        }),
    ];
});

const showAdvancedSearch = ref(false);
const searchCompRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
const advancedSearchPrefetched = ref(false);
const activeSearchComponent = computed(() => (showAdvancedSearch.value ? SearchCompExtended : SearchCompReduced));

async function prefetchAdvancedSearch() {
    if (advancedSearchPrefetched.value) return;
    advancedSearchPrefetched.value = true;
    await loadAdvancedSearchComponent();
}

function focusFirstInput(root?: ComponentPublicInstance | HTMLElement | null) {
    const scope = unrefElement(root ?? searchCompRef.value) as HTMLElement | null;
    if (!scope || typeof scope.querySelector !== 'function') return;
    const el = scope.querySelector<HTMLElement>(
        'input[type="text"], input:not([type]), textarea, [contenteditable="true"], [autofocus]'
    );
    if (el && typeof (el as HTMLElement).focus === 'function') {
        (el as HTMLInputElement | HTMLTextAreaElement).focus();
        try {
            const inp = el as HTMLInputElement;
            if ('selectionStart' in inp && typeof inp.value === 'string') {
                inp.selectionStart = inp.selectionEnd = inp.value.length;
            }
        } catch {}
    }
}

onMounted(async () => {
    await nextTick();
    setTimeout(() => {
        focusFirstInput();
    }, 1100);
});

watch(showAdvancedSearch, async (isAdvanced) => {
    if (isAdvanced) {
        prefetchAdvancedSearch();
    }
    await nextTick();
    focusFirstInput();
});

definePageMeta({
    auth: false,
    layout: 'default',
});

const showFeaturedCarousel = ref(true);

const cardItems = ref<CardItem[]>([
    {
        description: "restShortFilmCollectionDescription",
        title: "restShortFilmCollectionTitle",
        link: `/search/?has_form=Short&manifestation_event_type=RestorationEvent`,
        linkText: 'restShortFilmCollectionLinkText',
        imgSourceLink: 'https://www.deutsche-kinemathek.de/',
        imgSourceText: 'Deutsche Kinemathek',
        imgAuthor: 'Deutsche Kinemathek',
        imgLicense: 'CC BY-SA 3.0',
        imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
        imgAlt: 'Filmprojektor vor einer Leinwand mit einem Schwarzweiß-Film',
        ...createResponsiveCardMedia('restaur_kurzfilme', 388, 210),
    },
    {
        description: "docFilmCollectionDescription",
        title: "docFilmCollectionTitle",
        link: `/search/?has_form=Documentary&subjects=Protest&subjects=Aufstand&subjects=Widerstand&subjects=Streik`,
        linkText: 'docFilmCollectionLinkText',
        imgSourceLink: 'https://www.deutsche-kinemathek.de/',
        imgSourceText: 'Deutsche Kinemathek',
        imgAuthor: 'Deutsche Kinemathek',
        imgLicense: 'CC BY-SA 3.0',
        imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
        imgAlt: 'Schwarzweiß-Aufnahme von Demonstrierenden mit Transparenten und Fahnen',
        ...createResponsiveCardMedia('aktiv_im_dok', 352, 256),
    },
    {
        title: 'trollerTitle',
        imgAlt: 'Georg Stefan Troller',
        description: 'trollerDescription',
        link: `/search/?directors_or_editors=Troller%2C%20Georg%20Stefan`,
        linkText: 'trollerLinkText',
        imgSourceLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg/800px-Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
        imgSourceText: 'Wikimedia Commons',
        imgAuthor: 'ZDF',
        imgLicense: 'CC BY-SA 3.0',
        imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
        imgCoverType: 'object-top',
        imgCaption: 'Georg Stefan Troller im ZDF bei "Vor 30 Jahren". 2011.',
        ...createResponsiveCardMedia('Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren', 213, 256),
    },
    {
        title: 'schlenkerTitle',
        description: 'schlenkerDescription',
        linkText: 'schlenkerLinkText',
        link: `/search/?production=Schlenker%2C%20Hermann&production=Hermann%20Schlenker%20Filmproduktion`,
        imgAlt: 'AVefi Platzhalter Bild',
        imgCoverType: '',
        imgSourceLink: '',
        imgSourceText: '',
        imgAuthor: '',
        imgLicense: '',
        imgLicenseLink: ''
    },
    /*
    {
        title: 'ddrTitle',
        imgSourceText: 'German Federal Archives',
        imgAuthor: 'Christa Hochneder',
        imgLicense: 'CC BY-SA 3.0 DE',
        imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',
        imgCoverType: 'object-center',
        imgCaption: 'Leipzig, Petersstraße, Kino "Capitol", Nacht. 7. Internationale Leipziger Dokumentar- und Kurzfilmwoche feierlich eröffnet. 15.11.1964.',
        imgDepictedPlace: 'Leipzig',
        imgDate: '1964-11-15',
        imgCollection: 'German Federal Archives',
        imgAccessionNumber: 'Bild 183-C1115-0001-001',
        description: 'ddrDescription',
        link: `/search/?located_in_has_name=Deutsche%20Demokratische%20Republik%20%28DDR%29`,
        linkText: 'ddrLinkText',
        imgAlt: 'Außenaufnahme des Kinos "Capitol" in Leipzig bei Nacht',
        imgSourceLink: '',
        ...createResponsiveCardMedia('Bundesarchiv_Bild_Leipzig_Capitol_Nacht', 343, 256),
    }
        */
]);

const featuredCarouselRef = ref<HTMLElement | null>(null);
const featuredCarouselReady = ref(false);
const timelineSectionRef = ref<HTMLElement | null>(null);
const timelineReady = ref(false);
const videoSectionRef = ref<HTMLElement | null>(null);
const videoReady = ref(false);
const issuerSectionRef = ref<HTMLElement | null>(null);
const issuerReady = ref(false);
const coreSectionRef = ref<HTMLElement | null>(null);
const coreReady = ref(false);
const ctaSectionRef = ref<HTMLElement | null>(null);
const ctaReady = ref(false);

function deferHydration(target: Ref<HTMLElement | null>, flag: Ref<boolean>, options: IntersectionObserverInit = { rootMargin: '200px 0px' }) {
    if (import.meta.server) return;
    const { stop } = useIntersectionObserver(
        target,
        ([entry]) => {
            if (entry?.isIntersecting) {
                flag.value = true;
                stop();
            }
        },
        options
    );
}

if (import.meta.client) {
    deferHydration(featuredCarouselRef, featuredCarouselReady, { rootMargin: '180px 0px' });
    deferHydration(timelineSectionRef, timelineReady, { rootMargin: '200px 0px' });
    deferHydration(videoSectionRef, videoReady, { rootMargin: '260px 0px' });
    deferHydration(issuerSectionRef, issuerReady, { rootMargin: '320px 0px' });
    deferHydration(coreSectionRef, coreReady, { rootMargin: '420px 0px' });
    deferHydration(ctaSectionRef, ctaReady, { rootMargin: '520px 0px' });
}

</script>

<style scoped>
/* ================================
   GLASS: pills + hero search card
   ================================ */

.glass-pill {
    border: 1px solid hsl(0 0% 100% / 0.35);
    background: hsl(0 0% 100% / 0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow:
        0 10px 24px -18px hsl(0 0% 0% / 0.35),
        inset 0 1px 0 hsl(0 0% 100% / 0.55);
}

.glass-pill--chip {
    background: hsl(0 0% 100% / 0.46);
    border: 1px solid hsl(0 0% 100% / 0.30);
}

/* Hero search card: glass + clean */
.hero-glass-card {
    border: 1px solid hsl(0 0% 100% / 0.30);
    background: hsl(0 0% 100% / 0.50);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow:
        0 26px 70px -48px hsl(0 0% 0% / 0.45),
        0 8px 26px -18px hsl(0 0% 0% / 0.18),
        inset 0 1px 0 hsl(0 0% 100% / 0.55);
}

.hero-panel,
.hero-search-card {
    transition: box-shadow 0.3s ease;
}

.hero-title {
    word-break: normal;
    overflow-wrap: normal;
    white-space: normal;
}

.hero-title__line {
    display: block;
}

@media (max-width: 767px) {

    .hero-panel,
    .hero-search-card {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: none !important;
    }

    .hero-search-card {
        padding: 1.5rem;
    }
}

/* ================================
   SECTION WASH: subtle “aurora” background
   (applied to below-hero sections)
   ================================ */

.section-wash {
    position: relative;
    overflow: hidden;
}

.section-wash::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;

    /* lightweight aurora glow */
    background:
        radial-gradient(900px 520px at 20% 10%, hsl(210 92% 70% / 0.12), transparent 62%),
        radial-gradient(900px 520px at 80% 22%, hsl(330 90% 72% / 0.10), transparent 62%),
        radial-gradient(900px 520px at 55% 88%, hsl(195 95% 68% / 0.08), transparent 64%);
    filter: saturate(1.15);
    opacity: 1;
    mix-blend-mode: normal;
}

.section-wash--a::before {
    opacity: 0.95;
}

.section-wash--b::before {
    opacity: 0.80;
    transform: rotate(180deg);
}

/* ensure actual content is above the wash */
.section-wash>* {
    position: relative;
    z-index: 1;
}

/* ================================
   GLASS PANEL: used for text blocks
   ================================ */

.glass-panel {
    border-radius: 1.25rem;
    border: 1px solid hsl(0 0% 100% / 0.42);
    background: linear-gradient(180deg,
            hsl(0 0% 100% / 0.55),
            hsl(0 0% 100% / 0.28));
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow:
        0 26px 70px -56px hsl(0 0% 0% / 0.36),
        0 10px 28px -22px hsl(0 0% 0% / 0.12),
        inset 0 1px 0 hsl(0 0% 100% / 0.55);
}

.glass-panel--dark {
    border: 1px solid hsl(0 0% 100% / 0.20);
    background: linear-gradient(180deg,
            hsl(220 8% 14% / 0.84),
            hsl(220 8% 8% / 0.92));
    box-shadow:
        0 24px 64px -48px hsl(0 0% 0% / 0.55),
        inset 0 1px 0 hsl(0 0% 100% / 0.12);
}

/* ================================
   HERO RESPONSIVE HELPERS
   ================================ */

.hero-panel ::selection,
.hero-search-card ::selection {
    background: hsl(0 0% 100% / 0.35);
    color: inherit;
}

.dark .hero-panel ::selection,
.dark .hero-search-card ::selection {
    background: hsl(0 0% 0% / 0.35);
}

/* ================================
   TIMELINE + CTA skeleton helpers
   ================================ */

.lazy-section-anchor .card,
.lazy-section-anchor section {
    transition: opacity 0.4s ease;
}
</style>