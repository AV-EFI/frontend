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
        <div class="hero-overlay absolute inset-0 w-full bg-center bg-cover 
            bg-no-repeat bg-fixed
            [background-image:url('/img/avefi_nodes-hero-480.webp')]
            sm:[background-image:url('/img/avefi_nodes-hero-720.webp')]
            lg:[background-image:url('/img/avefi_nodes-hero-1024.webp')]
            xl:[background-image:url('/img/avefi_nodes-hero-2040.webp')]
            dark:brightness-100 dark:invert dark:hue-rotate-180" aria-hidden="true">
          <!-- Aurora / glow overlays (light + dark variants) -->
          <div
            class="absolute inset-0 motion-reduce:transition-none motion-reduce:animate-none saturate-[1.05] pointer-events-none hidden md:block"
            aria-hidden="true" :class="[
              ]" />
          <!-- Vignette -->
          <div class="absolute inset-0 pointer-events-none hidden md:block
              mix-blend-multiply dark:mix-blend-normal
              bg-[radial-gradient(1200px_700px_at_50%_40%,rgba(0,0,0,0)_42%,rgba(0,0,0,0.08)_100%),linear-gradient(180deg,rgba(0,0,0,0.08),transparent_22%,transparent_78%,rgba(0,0,0,0.10))]
              dark:hidden">
          </div>
        </div>

        <div class="hero-content w-full lg:w-full">
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
                <h1 class="
                  mt-2 bree text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight
                  [text-shadow:0_1px_0_rgba(255,255,255,0.75)]
                  dark:[text-shadow:0_1px_0_rgba(0,0,0,0.55)]
                " tabindex="0"> {{ $t('avefiClaim') }}
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
                      :aria-labelledby="'home-search-label'" aria-live="polite" aria-atomic="false" tabindex="0">
                      <!-- Card header row: integrated mode switch -->
                      <div
                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-1 lg:gap-3 bg-base-200 rounded-xl">
                        <div class="md:justify-end" role="group"
                          :aria-label="$t('searchModeSwitcher') || 'Search mode switcher'">
                          <div class="join w-full">
                            <button class="join-item btn md:btn-sm" :aria-label="$t('showSimpleSearch')"
                              :class="!showAdvancedSearch ? 'btn-primary' : 'btn-ghost'"
                              @click="showAdvancedSearch = false" :aria-pressed="!showAdvancedSearch"
                              aria-controls="home-search-area">
                              <span class="hidden md:block">
                                {{ $t('showSimpleSearch') }}
                              </span>
                              <Icon name="tabler:zoom-scan" class="lg:hidden ml-1 md:ml-0" />

                            </button>
                            <button class="join-item btn md:btn-sm" :aria-label="$t('showAdvancedSearch')"
                              :class="showAdvancedSearch ? 'btn-primary' : 'btn-ghost'"
                              @click="showAdvancedSearch = true" :aria-pressed="showAdvancedSearch"
                              aria-controls="home-search-area">
                              <span class="hidden md:block">
                                {{ $t('showAdvancedSearch') }}
                              </span>
                              <Icon name="tabler:adjustments-cog" class="lg:hidden ml-1 md:ml-0" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Search component -->
                      <ClientOnly>
                        <component :is="showAdvancedSearch ? 'GlobalSearchCompExtended' : 'GlobalSearchCompReduced'"
                          ref="searchCompRef" :aria-labelledby="'home-search-label'" />
                      </ClientOnly>

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

    <section id="main" role="main" :aria-label="$t('featuredContent')"
      class="relative overflow-hidden border-t border-base-200 py-10">
      <!-- wash layer -->
      <!-- Aurora / glow overlays (light + dark variants) -->
      <div
        class="absolute inset-0 motion-reduce:transition-none motion-reduce:animate-none saturate-[1.05] pointer-events-none"
        aria-hidden="true" />

      <!-- content stays above -->
      <div class="relative z-10 container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div class="lg:col-span-4 flex justify-center w-full">
            <div class="card flex flex-col justify-center">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2">
                {{ $t('searchAndFind.title') }}
              </h2>
              <p class="text-base md:text-lg opacity-80">
                {{ $t('searchAndFind.text') }}
              </p>
            </div>
          </div>
          <div class="lg:col-span-8 flex justify-center w-full" ref="featuredCarouselRef">
            <ClientOnly v-if="featuredCarouselReady">
              <LazyGlobalCarouselCardComp :items="cardItems" />
            </ClientOnly>
            <div v-else class="grid gap-4 md:grid-cols-2 w-full" aria-hidden="true">
              <article v-for="(item, idx) in cardItems.slice(0, 2)" :key="`card-fallback-${idx}`"
                class="card border border-base-200 bg-white/95 dark:bg-base-200/80 shadow-sm p-4">
                <figure class="rounded-xl overflow-hidden mb-3 bg-base-200">
                  <img v-if="item.imgSrc" :src="item.imgSrc" :srcset="item.imgSrcSet || undefined"
                    :sizes="item.imgSizes || '50vw'" :alt="item.imgAlt" :width="item.imgWidth || undefined"
                    :height="item.imgHeight || undefined" loading="lazy" decoding="async"
                    class="w-full h-48 object-cover" />
                </figure>
                <h3 class="text-lg font-semibold mb-1">{{ $t(item.title) }}</h3>
                <p class="text-sm opacity-80 line-clamp-3">{{ $t(item.description) }}</p>
                <span class="btn btn-sm btn-ghost justify-start mt-3">
                  {{ $t(item.linkText) }}
                </span>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= FROM RECORD TO KNOWLEDGE (timeline) ======= -->
    <section class="relative border-t border-base-200 py-10 section-wash section-wash--a" role="region"
      :aria-label="$t('timeline.title')">
      <div class="container mx-auto p-6 lg:px-4 lg:min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
          <div
            class="w-full max-lg:card max-lg:bg-white/70 max-lg:dark:bg-neutral/30 max-lg:shadow-lg max-lg:rounded-xl p-6 flex flex-col justify-center">
            <h2 class="text-3xl text-left bree md:text-4xl font-extrabold mb-6" tabindex="0">
              {{ $t('timeline.title') }}
            </h2>
            <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical" role="list">
              <li role="listitem" tabindex="0">
                <div class="timeline-middle text-primary my-2">
                  <Icon class="text-2xl" name="tabler:search" aria-hidden="true" />
                </div>
                <div class="timeline-start md:text-end mb-4">
                  <div class="text-lg font-semibold">{{ $t('timeline.query.title') }}</div>
                  <div class="opacity-80">{{ $t('timeline.query.desc') }}</div>
                </div>
                <hr class="bg-primary/40" />
              </li>
              <li role="listitem" tabindex="0">
                <hr class="bg-primary/40" />
                <div class="timeline-middle text-primary my-2">
                  <Icon class="text-2xl" name="tabler:filter" aria-hidden="true" />
                </div>
                <div class="timeline-end mb-4">
                  <div class="text-lg font-semibold">{{ $t('timeline.refine.title') }}</div>
                  <div class="opacity-80">{{ $t('timeline.refine.desc') }}</div>
                </div>
                <hr class="bg-primary/40" />
              </li>
              <li role="listitem" tabindex="0">
                <hr class="bg-primary/40" />
                <div class="timeline-middle text-primary my-2">
                  <Icon class="text-2xl" name="tabler:share-2" aria-hidden="true" />
                </div>
                <div class="timeline-start md:text-end mb-4">
                  <div class="text-lg font-semibold">{{ $t('timeline.share.title') }}</div>
                  <div class="opacity-80">{{ $t('timeline.share.desc') }}</div>
                </div>
                <hr class="bg-primary/40" />
              </li>
              <li role="listitem" tabindex="0">
                <hr class="bg-primary/40" />
                <div class="timeline-middle text-primary my-2">
                  <Icon class="text-2xl" name="tabler:books" aria-hidden="true" />
                </div>
                <div class="timeline-end">
                  <div class="text-lg font-semibold">{{ $t('timeline.cite.title') }}</div>
                  <div class="opacity-80">{{ $t('timeline.cite.desc') }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div
            class="lg:col-span-1 flex justify-center items-center max-w-md md:max-w-lg lg:max-w-full px-6 md:px-6 lg:px-0 min-h-[300px]"
            data-v-492e7cc2="">
            <div class="text-left max-w-md" data-v-492e7cc2="">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0" data-v-492e7cc2="">
                {{ $t('build.linked.title') }}
              </h2>
              <p class="text-base md:text-lg opacity-80" tabindex="0" data-v-492e7cc2="">
                {{ $t('build.linked.lead') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- ======= VIDEO BAND ======= -->
    <section role="region" :aria-label="$t('videoSection')" class="relative border-t border-base-200 py-10">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="items-center mx-auto">
          <div class="flex justify-center">
            <video controls preload="none" :poster="videoPosterSrc"
              class="w-full mx-auto md:max-w-full rounded-xl border border-base-300 shadow-lg"
              :aria-describedby="'video-desc'">
              <source type="video/mp4" src="/vid/avefi_project_wo.mp4" />
              {{ $t('videoNotSupported') }}
            </video>
          </div>
        </div>
      </div>
    </section>

    <section class="relative border-t border-base-200 py-10 section-wash section-wash--a">
      <div class="px-4 text-center">
        <div class="w-full flex flex-col justify-center max-lg:mt-6">
          <h2 class="text-3xl bree md:text-4xl font-extrabold mt-6 mb-4 lg:mb-6 text-center" tabindex="0">
            {{ $t('topIssuers') || 'Top Publishers & Archives' }}
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
                  <img :src="issuer.image" :alt="issuer.alt" loading="lazy" decoding="async"
                    class="max-h-full max-w-full object-contain" />
                </figure>
                <h3 class="text-base font-semibold">{{ issuer.name }}</h3>
                <p class="text-sm opacity-75">{{ issuer.count.toLocaleString() }} {{ issuer.count === 1 ?
                  $t('dataset') : $t('datasets') }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= CORE FUNCTIONS ======= -->
    <section role="region" :aria-label="$t('coreFunctionsSection')" class="relative border-t border-base-200 py-10">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="card lg:max-w-96 md:p-2 shadow-md  bg-white/90 dark:bg-transparent" role="group"
          :aria-label="$t('openAndExtendable.title')">
          <div class="card-body">
            <div class="flex justify-start items-center gap-2">
              <Icon name="tabler:link" aria-hidden="true" />
              <h2 class="text-xl md:text-2xl font-extrabold bree" tabindex="0">
                {{ $t('openAndExtendable.title') }}
              </h2>
            </div>
            <ul class="mt-2" role="list">
              <li class="mb-2" role="listitem"><span class="text-base">{{ $t('openAndExtendable.content[0]') }}</span>
              </li>
              <li class="mb-2" role="listitem">
                <a target="_blank" :href="$t('openAndExtendable.content[2]')" class="text-base text-primary underline">
                  {{ $t('openAndExtendable.content[1]') }}
                </a>
              </li>
            </ul>
          </div>
          <div class="card-actions justify-end m-3">
            <a href="https://projects.tib.eu/av-efi/pid/efi-infrastruktur/" target="_blank"
              class="btn btn-outline max-md:btn-block">
              <span class="sr-only">{{ $t('openAndExtendable.cta') }} – </span>{{ $t('openAndExtendable.cta') }}
            </a>
          </div>
        </div>
      </div>
    </section>


    <!-- ======= Call to Action & Community ======= -->
    <section role="region" :aria-label="$t('callToAction.title')" class="relative border-t border-base-200 py-10">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center w-full">
          <div class="w-full lg:w-1/2 flex justify-center">
            <div class="card-body w-full max-w-xl text-left">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                {{ $t('callToAction.title') }}
              </h2>
              <p class="text-base md:text-lg opacity-80" tabindex="0">
                {{ $t('callToAction.text') }}
              </p>
            </div>
          </div>
          <div class="w-full lg:w-1/2 flex justify-center">
            <div class="w-full max-w-xl text-left" role="region"
              :aria-label="$t('becomeAPartner.title') || 'Become a partner call to action'">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                {{ $t('becomeAPartner.title') }}
              </h2>
              <p>{{ $t('becomeAPartner.text') }}</p>
              <a :href="$t('becomeAPartner.ctaLink')" target="_blank" class="btn btn-primary mt-4">
                {{ $t('becomeAPartner.cta') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRuntimeConfig, useSeoMeta, useHead } from 'nuxt/app';
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import type { Ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useMediaQuery, useIntersectionObserver, unrefElement } from '@vueuse/core';
import topIssuersData from '~/data/top-issuers.json';
import issuerImagesData from '~/data/issuer-images.json';

const route = useRoute();
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const criticalLinks: any[] = [
    {
        rel: 'preload',
        href: '/img/avefi_diamonds_prim_mobile.webp',
        as: 'image',
        media: '(max-width: 640px)',
        fetchpriority: 'high',
    },
];

if (runtimeConfig.public.matomoUrl) {
    criticalLinks.push(
        { rel: 'preconnect', href: runtimeConfig.public.matomoUrl, crossorigin: '' },
        { rel: 'dns-prefetch', href: runtimeConfig.public.matomoUrl }
    );
}

useHead({
    link: criticalLinks,
});

const CARD_IMAGE_WIDTHS = [240, 320, 480, 720, 1024] as const;
const CARD_IMAGE_SIZES = '(max-width: 640px) 240px, (max-width: 1024px) 320px, 380px';

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
const swapToggleRef = ref<HTMLElement | null>(null);

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

watch(showAdvancedSearch, async () => {
    await nextTick();
    focusFirstInput();
});

function onSwapKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const host = swapToggleRef.value;
        if (!host) return;
        const cb = host.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        if (cb) {
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
            cb.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            host.click();
        }
    }
}

definePageMeta({
    auth: false,
    layout: 'default',
});

const prefersCompactPoster = useMediaQuery('(max-width: 1024px)');
const videoPosterSrc = computed(() =>
    prefersCompactPoster.value ? '/img/avefi_vid_poster-360.webp' : '/img/avefi_vid_poster-1024.webp'
);


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
]);

const featuredCarouselRef = ref<HTMLElement | null>(null);
const featuredCarouselReady = ref(false);
const issuerCarouselRef = ref<HTMLElement | null>(null);
const issuerCarouselReady = ref(false);
const partnersCarouselRef = ref<HTMLElement | null>(null);
const partnersCarouselReady = ref(false);

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
    deferHydration(featuredCarouselRef, featuredCarouselReady, { rootMargin: '120px 0px' });
    deferHydration(issuerCarouselRef, issuerCarouselReady, { rootMargin: '520px 0px' });
    deferHydration(partnersCarouselRef, partnersCarouselReady, { rootMargin: '720px 0px' });
}

const issuerPlaceholderItems = computed(() => {
    const issuers = Array.isArray((topIssuersData as any)?.issuers)
        ? (topIssuersData as any).issuers
        : [];
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
    inset 0 1px 0 hsl(0 0% 100% / 0.60);
}

/* ================================
   PREMIUM CARD: consistent across page
   ================================ */

.premium-card {
  border-radius: 1.25rem;
  border: 1px solid hsl(0 0% 100% / 0.38);
  background: linear-gradient(180deg,
      hsl(0 0% 100% / 0.52),
      hsl(0 0% 100% / 0.22));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 28px 74px -60px hsl(0 0% 0% / 0.40),
    0 10px 26px -22px hsl(0 0% 0% / 0.12),
    inset 0 1px 0 hsl(0 0% 100% / 0.55);
}

/* optional: make dividers less “flat-grey” */
.border-base-200 {
  border-color: hsl(0 0% 0% / 0.08) !important;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
