<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <header class="sticky top-0 z-50 bg-base-100/95 backdrop-blur border-b border-base-200">
      <div class="container mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight">AVefi</NuxtLink>
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink class="btn btn-ghost btn-sm" to="/search">Search</NuxtLink>
          <NuxtLink class="btn btn-ghost btn-sm" to="/docs">Docs</NuxtLink>
          <NuxtLink class="btn btn-ghost btn-sm" to="/about">About</NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <NuxtLink class="btn btn-ghost btn-sm" to="/login">Sign in</NuxtLink>
          <NuxtLink class="btn btn-primary btn-sm" to="/search">Open Search</NuxtLink>
        </div>
      </div>
    </header>

    <!-- HERO: search is the star (centered, large) -->
    <section role="region" :aria-label="$t('bannerSection')" class="relative">
      <div class="hero min-h-[78vh]">
        <ClientOnly>
          <div class="hero-overlay">
            <video autoplay muted loop class="absolute inset-0 w-full h-full object-cover brightness-[.9] contrast-[.98]">
              <source src="/vid/klappe.mp4" type="video/mp4">
              {{ $t('videoNotSupported') }}
            </video>
            <div class="absolute inset-0 bg-gradient-to-b from-base-100/92 via-base-100/86 to-base-100/95"></div>
            <div class="absolute inset-0 opacity-15">
              <div class="size-full bg-[radial-gradient(circle_at_1px_1px,theme(colors.base-300/.6)_1px,transparent_1px)] [background-size:22px_22px]"></div>
            </div>
            <div class="absolute -top-40 -left-28 h-[48rem] w-[48rem] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]">
              <div class="size-full [background:repeating-linear-gradient(135deg,theme(colors.primary/30)_0_28px,transparent_28px_56px)]"></div>
            </div>
            <div class="absolute -bottom-48 -right-20 h-[50rem] w-[50rem] opacity-20 [mask-image:linear-gradient(to_top,black,transparent_70%)]">
              <div class="size-full [background:repeating-linear-gradient(135deg,theme(colors.accent/25)_0_28px,transparent_28px_56px)]"></div>
            </div>
          </div>

          <div class="hero-content w-full">
            <div class="w-full max-w-6xl mx-auto">
              <div class="text-center">
                <div class="inline-flex items-center gap-2 rounded-full border border-base-200 bg-base-100 px-3 py-1 text-sm">
                  <Icon name="fa-film" class="w-4 h-4" />
                  <span>Film science • Linked data • Research</span>
                </div>
                <h1 class="mt-4 text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight">
                  {{ $t('avefiClaim') }}
                </h1>
                <p class="mt-4 md:text-lg opacity-80 max-w-2xl mx-auto">
                  {{ $t('bannerDescription') }}
                </p>
              </div>

              <!-- Mode switch -->
              <div class="mt-6 flex justify-center">
                <div class="join">
                  <button class="join-item btn" :class="!showAdvancedSearch ? 'btn-primary' : 'btn-ghost'" @click="showAdvancedSearch=false" :aria-pressed="!showAdvancedSearch">
                    {{ $t('showSimpleSearch') }}
                  </button>
                  <button class="join-item btn" :class="showAdvancedSearch ? 'btn-primary' : 'btn-ghost'" @click="showAdvancedSearch=true" :aria-pressed="showAdvancedSearch">
                    {{ $t('showAdvancedSearch') }}
                  </button>
                </div>
              </div>

              <!-- BIG centered search card -->
              <div class="mt-5 grid place-items-center">
                <div class="w-full max-w-4xl">
                  <div class="card bg-base-100 border border-base-200 shadow-2xl">
                    <div class="card-body p-3 md:p-6">
                      <component :is="showAdvancedSearch ? 'GlobalSearchCompExtended' : 'GlobalSearchCompReduced'" />
                    </div>
                  </div>
                </div>
                <div class="mt-3 text-sm opacity-80 flex items-center gap-3">
                  <Icon name="fa:desktop" class="w-4 h-4" />
                  <span>PID-ready • Normdaten • FDO-friendly</span>
                </div>
              </div>

              <!-- playful chips -->
              <div class="mt-8 flex flex-wrap justify-center gap-3">
                <div class="badge badge-primary badge-outline">Works</div>
                <div class="badge badge-secondary">Manifestations</div>
                <div class="badge badge-accent">Items</div>
                <div class="badge badge-outline">Authority Links</div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- “Build the perfect research tool.” band -->
    <section class="relative border-t border-base-200 py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight">Build the perfect research tool.</h2>
          <p class="mt-3 opacity-80 md:text-lg">Compose deep queries, refine with nested facets, save and share reproducible states.</p>
        </div>

        <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="card bg-base-100 border border-base-200 shadow-xl">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <Icon name="lucide:square-stack" class="text-primary" />
                <div class="font-semibold">Schema: Work → Manifestation → Item</div>
              </div>
              <div class="mockup-code mt-3 text-sm">
                <pre data-prefix="$"><code>title:"Solo Sunny"</code></pre>
                <pre data-prefix=">"><code>manifestation.language:"deu"</code></pre>
                <pre data-prefix=">"><code>item.format:"35mm"</code></pre>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 border border-base-200 shadow-xl">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <Icon name="lucide:filter" class="text-primary" />
                <div class="font-semibold">Nested facets</div>
              </div>
              <div class="mockup-code mt-3 text-sm">
                <pre data-prefix="GET"><code>/search?refinementList[in_language_code][0]=deu</code></pre>
                <pre data-prefix="⇢"><code>"inner_hits": true</code></pre>
                <pre data-prefix="✓"><code>returns only matching nested docs</code></pre>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 border border-base-200 shadow-xl">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <Icon name="lucide:link-2" class="text-primary" />
                <div class="font-semibold">Linked data</div>
              </div>
              <div class="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div class="stat rounded-lg border border-base-300">
                  <div class="stat-title">GND</div>
                  <div class="stat-value text-primary text-2xl">1234567-X</div>
                  <div class="stat-desc">Authority</div>
                </div>
                <div class="stat rounded-lg border border-base-300">
                  <div class="stat-title">Wikidata</div>
                  <div class="stat-value text-accent text-2xl">Q12345</div>
                  <div class="stat-desc">Crosswalk</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="mt-10 flex justify-center">
          <ul class="steps steps-horizontal">
            <li class="step step-primary">Query</li>
            <li class="step step-primary">Refine</li>
            <li class="step step-primary">Share</li>
            <li class="step">Cite</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Keyboard band (Raycast-ish, film-flavored) -->
    <section class="relative border-t border-base-200">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-5">
            <h3 class="text-3xl font-extrabold">Power moves for metadata.</h3>
            <p class="mt-2 opacity-80">Run quick filters, jump to people/works, copy citations, and open authority records in a snap.</p>
            <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div class="kbd kbd-sm">/</div><div>Focus search</div>
              <div class="kbd kbd-sm">Esc</div><div>Clear query</div>
              <div class="kbd kbd-sm">↑/↓</div><div>Navigate results</div>
              <div class="kbd kbd-sm">Enter</div><div>Open record</div>
            </div>
          </div>
          <div class="lg:col-span-7">
            <div class="mockup-code text-sm">
              <pre data-prefix="$"><code>search "wolf" lang:deu format:35mm subject:"DDR"</code></pre>
              <pre data-prefix="•"><code>Konrad Wolf — works: 12 — manifestations: 24 — items: 63</code></pre>
              <pre data-prefix="•"><code>Solo Sunny (1980) — theatrical — 35mm — 103' — DEU</code></pre>
              <pre data-prefix="•"><code>… permalink copied</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured (your content) -->
    <section role="region" :aria-label="$t('featuredContent')" class="relative border-t border-base-200 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div class="lg:col-span-5">
            <div class="card bg-base-100 border border-base-200 shadow-lg">
              <div class="card-body p-6">
                <h3 class="text-3xl font-extrabold">{{ $t('bannerText') }}</h3>
                <p class="opacity-80 mt-2">{{ $t('bannerDescription') }}</p>
              </div>
            </div>
          </div>
          <div class="lg:col-span-7">
            <div class="mask mask-squircle bg-base-100 border border-base-200 shadow-lg p-4">
              <GlobalCarouselCardComp :items="cardItems" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core functions (your content) -->
    <section role="region" :aria-label="$t('coreFunctionsSection')" class="relative border-t border-base-200 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card bg-base-100 border border-base-200 shadow-md">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <Icon name="fa:desktop" class="text-2xl text-primary" />
                <h4 class="card-title">{{ $t('coreFunctionsTitle') }}</h4>
              </div>
              <ul class="mt-2 opacity-90">
                <li class="mb-2"><span class="text-primary">{{ $t('coreFunctions[0]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('coreFunctions[1]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('coreFunctions[2]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('coreFunctions[3]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('coreFunctions[4]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a href="https://projects.tib.eu/av-efi/projekt/" target="_blank" class="btn btn-outline max-md:btn-block">{{ $t('learnMore') }}</a>
            </div>
          </div>

          <div class="card bg-base-100 border border-base-200 shadow-md">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <Icon name="fa-film" class="text-2xl text-primary" />
                <h4 class="card-title">{{ $t('forFilmResearchersTitle') }}</h4>
              </div>
              <ul class="mt-2 opacity-90">
                <li class="mb-2"><span class="text-primary">{{ $t('forFilmResearchers[0]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('forFilmResearchers[1]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('forFilmResearchers[2]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('forFilmResearchers[3]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a href="https://projects.tib.eu/av-efi/metadaten/" target="_blank" class="btn btn-outline max-md:btn-block">{{ $t('learnMore') }}</a>
            </div>
          </div>

          <div class="card bg-base-100 border border-base-200 shadow-md">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <label aria-label="Toggle code/heart icon" class="swap swap-flip h-[30px] text-2xl text-primary">
                  <input type="checkbox" />
                  <div class="swap-off flex"><Icon name="tabler:code" /></div>
                  <div class="swap-on flex"><Icon class="animate-bounce text-accent" name="fa-heart-o" /></div>
                </label>
                <h4 class="card-title">{{ $t('technicalBasicsTitle') }}</h4>
              </div>
              <ul class="mt-2 opacity-90">
                <li class="mb-2"><span class="text-primary">{{ $t('technicalBasics[0]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('technicalBasics[1]') }}</span></li>
                <li class="mb-2"><span class="text-primary">{{ $t('technicalBasics[2]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a href="https://projects.tib.eu/av-efi/pid/efi-infrastruktur/" target="_blank" class="btn btn-outline max-md:btn-block">{{ $t('learnMore') }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="relative border-t border-base-200 py-12">
      <div class="container mx-auto px-4">
        <h3 class="text-3xl font-extrabold mb-6 text-center">From record to knowledge</h3>
        <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          <li>
            <div class="timeline-middle text-primary"><Icon name="lucide:search" /></div>
            <div class="timeline-start md:text-end mb-10">
              <div class="text-lg font-semibold">Query</div>
              <div class="opacity-80">Type, autocomplete, refine by fields</div>
            </div>
            <hr class="bg-primary" />
          </li>
          <li>
            <hr class="bg-primary" />
            <div class="timeline-middle text-primary"><Icon name="lucide:sliders-horizontal" /></div>
            <div class="timeline-end mb-10">
              <div class="text-lg font-semibold">Refine</div>
              <div class="opacity-80">Nested facets return only matching docs</div>
            </div>
            <hr class="bg-primary" />
          </li>
          <li>
            <hr class="bg-primary" />
            <div class="timeline-middle text-primary"><Icon name="lucide:share-2" /></div>
            <div class="timeline-start md:text-end mb-10">
              <div class="text-lg font-semibold">Share</div>
              <div class="opacity-80">Permalinks capture your state</div>
            </div>
            <hr class="bg-primary" />
          </li>
          <li>
            <hr class="bg-primary" />
            <div class="timeline-middle text-primary"><Icon name="lucide:book-text" /></div>
            <div class="timeline-end">
              <div class="text-lg font-semibold">Cite</div>
              <div class="opacity-80">PIDs & authority links for scholarship</div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Video -->
    <section role="region" :aria-label="$t('videoSection')" class="relative border-t border-base-200 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-6">
            <video controls class="w-full rounded-xl border border-base-300 shadow-lg">
              <source type="video/mp4" src="/vid/avefi_project_wo.mp4">
              {{ $t('videoNotSupported') }}
            </video>
          </div>
          <div class="lg:col-span-6">
            <div class="bg-base-100 border border-base-200 rounded-xl shadow-md p-6 md:p-8">
              <p class="text-xl md:text-2xl font-semibold leading-snug tracking-tight">
                {{ $t('videoSectionTitle') }}
              </p>
              <p class="mt-3 md:text-lg leading-relaxed opacity-80">
                {{ $t('videoSectionDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners -->
    <section role="region" :aria-label="$t('partnersSection')" class="relative border-t border-base-200 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-5">
            <div class="card bg-base-100 border border-base-200 shadow-md">
              <div class="card-body">
                <h3 class="text-2xl font-bold leading-tight mb-2">
                  {{ $t('partnersTitle') }}
                </h3>
                <p class="opacity-80">
                  {{ $t('partnersDescription') }}
                </p>
              </div>
            </div>
          </div>
          <div class="lg:col-span-7 flex justify-center">
            <div class="w-full max-w-xl">
              <GlobalCarouselComp :items="items" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-base-200">
      <div class="container mx-auto px-4 py-8 text-sm opacity-80 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div class="flex items-center gap-2">
          <Icon name="fa-film" class="w-4 h-4" />
          <span>AVefi • Film metadata for research</span>
        </div>
        <nav class="flex items-center gap-4">
          <NuxtLink to="/imprint" class="link link-hover">Imprint</NuxtLink>
          <NuxtLink to="/privacy" class="link link-hover">Privacy</NuxtLink>
          <NuxtLink to="/docs" class="link link-hover">Docs</NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const { t, locale } = useI18n()

const showAdvancedSearch = ref(false)

definePageMeta({
  auth: false,
  layout: 'default'
})

const items = ref([
  { src: '/img/gwdg_logo.min.svg', alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen', link: 'https://www.gwdg.de' },
  { src: '/img/logo_sdk.png', alt: 'Stiftung Deutsche Kinemathek', link: 'https://www.deutsche-kinemathek.de' },
  { src: '/img/logo_tib.png', alt: 'Technische Informationsbibliothek Hannover', link: 'https://www.tib.eu' },
  { src: '/img/logo_fmd.png', alt: 'Filmmuseum Düsseldorf', link: 'https://www.duesseldorf.de/filmmuseum' }
])

const cardItems = ref([
  {
    title: 'trollerTitle',
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
    imgAlt: 'Georg Stefan Troller',
    description: 'trollerDescription',
    link: `/search_altern/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bdirectors_or_editors%5D%5B0%5D=Troller%2C%20Georg%20Stefan`,
    linkText: 'trollerLinkText',
    imgSourceLink: 'https://commons.wikimedia.org/wiki/File:Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
    imgSourceText: 'Wikimedia Commons',
    imgAuthor: 'ZDF',
    imgLicense: 'CC BY-SA 3.0',
    imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
    imgCoverType: 'object-top'
  },
  {
    title: 'schlenkerTitle',
    description: 'schlenkerDescription',
    linkText: 'schlenkerLinkText',
    link: `/search_altern/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bproduction%5D%5B0%5D=Schlenker%2C%20Hermann&${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bproduction%5D%5B1%5D=Hermann%20Schlenker%20Filmproduktion`
  },
  {
    title: 'ddrTitle',
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Bundesarchiv_Bild_183-C1115-0001-001%2C_Leipzig%2C_Petersstra%C3%9Fe%2C_Kino_%22Capitol%22%2C_Nacht.jpg',
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
    link: `/search_altern/?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Blocated_in_has_name%5D%5B0%5D=Deutsche%20Demokratische%20Republik%20%28DDR%29`,
    linkText: 'ddrLinkText'
  }
])
</script>

<style scoped>
.card{
  box-shadow:
    0 12px 32px -14px hsl(0 0% 0%/.25),
    0 4px 14px -6px hsl(0 0% 0%/.12)
}
@media (prefers-reduced-motion: reduce){
  *{transition:none!important;animation:none!important}
}
</style>
