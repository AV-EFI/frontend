<template>
  <div class="min-h-screen bg-base-100 text-base-content flow">
    <!-- Skip link -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-sm btn-primary"
    >
      {{ $t('skipToContent') || 'Skip to main content' }}
    </a>

    <!-- ======= HERO / SEARCH-FIRST ======= -->
    <section id="hero" role="banner" :aria-label="$t('bannerSection')" class="relative z-20">
      <div class="hero min-h-[78vh]">
        <ClientOnly>
          <div class="hero-overlay">
            <!-- Background video (decorative) -->
            <video
              autoplay
              muted
              loop
              aria-hidden="true"
              class="absolute inset-0 w-full h-full object-cover brightness-[.9] contrast-[.98]"
            >
              <source src="/vid/klappe.mp4" type="video/mp4" />
            </video>
            <!-- Soft scrim -->
            <div class="absolute inset-0 bg-gradient-to-b from-base-100/92 via-base-100/86 to-base-100/95"></div>
            <!-- Dotted grid -->
            <div class="absolute inset-0 opacity-15" aria-hidden="true">
              <div class="size-full bg-[radial-gradient(circle_at_1px_1px,theme(colors.base-300/.6)_1px,transparent_1px)] [background-size:22px_22px]"></div>
            </div>
            <!-- Raycast-ish stripes -->
            <div class="absolute -top-40 -left-28 h-[48rem] w-[48rem] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true">
              <div class="size-full [background:repeating-linear-gradient(135deg,theme(colors.primary/30)_0_28px,transparent_28px_56px)]"></div>
            </div>
          </div>

          <div class="hero-content w-full">
            <div class="w-full max-w-6xl mx-auto">
              <div class="text-center">
                <h1
                  class="mt-4 bree text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight"
                  tabindex="0"
                >
                  {{ $t('avefiClaim') }}
                </h1>
                <p class="mt-4 md:text-lg opacity-80 max-w-2xl mx-auto" tabindex="0">
                  {{ $t('home.tagline') }}
                </p>
              </div>

              <!-- Mode switch -->
              <div class="mt-6 flex justify-center" role="group" :aria-label="$t('searchModeSwitcher') || 'Search mode switcher'">
                <div class="join">
                  <button
                    class="join-item btn"
                    :class="!showAdvancedSearch ? 'btn-primary' : 'btn-ghost'"
                    @click="showAdvancedSearch = false"
                    :aria-pressed="!showAdvancedSearch"
                    aria-controls="home-search-area"
                  >
                    {{ $t('showSimpleSearch') }}
                  </button>
                  <button
                    class="join-item btn"
                    :class="showAdvancedSearch ? 'btn-primary' : 'btn-ghost'"
                    @click="showAdvancedSearch = true"
                    :aria-pressed="showAdvancedSearch"
                    aria-controls="home-search-area"
                  >
                    {{ $t('showAdvancedSearch') }}
                  </button>
                </div>
              </div>

              <!-- BIG centered search -->
              <div class="mt-5 grid place-items-center">
                <div class="w-full max-w-4xl">
                  <div class="card bg-base-100 shadow-2xl">
                    <div
                      id="home-search-area"
                      class="card-body p-3 md:p-6 md:min-h-32 my-auto"
                      role="search"
                      :aria-labelledby="'home-search-label'"
                      aria-live="polite"
                      aria-atomic="false"
                      tabindex="0"
                    >
                      <!-- Visible to SR only: label for the search input inside the child component -->
                      <span id="home-search-label" class="sr-only">
                        {{ $t('mainSearch') }}
                      </span>

                      <component
                        :is="showAdvancedSearch ? 'GlobalSearchCompExtended' : 'GlobalSearchCompReduced'"
                        ref="searchCompRef"
                        :aria-labelledby="'home-search-label'"
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-3 text-sm opacity-80 flex items-center gap-3 hidden">
                  <Icon name="fa:desktop" class="w-4 h-4" aria-hidden="true" />
                  <span>{{ $t('hero.badgeLine') }}</span>
                </div>
              </div>

              <!-- playful chips -->
              <div class="mt-8 flex flex-wrap justify-center gap-3 hidden" role="group" :aria-label="$t('heroChips') || 'Content chips'">
                <div class="badge badge-work" tabindex="0">{{ $t('chips.works') }}</div>
                <div class="badge badge-manifestation" tabindex="0">{{ $t('chips.manifestations') }}</div>
                <div class="badge badge-item" tabindex="0">{{ $t('chips.items') }}</div>
                <div class="badge badge-accent" tabindex="0">{{ $t('chips.authorityLinks') }}</div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- ======= FEATURED (your text + carousel) ======= -->
    <section id="main" role="main" :aria-label="$t('featuredContent')" class="relative border-t border-base-200 py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div class="lg:col-span-6">
            <div class=" lg:h-full">
              <div class="card-body p-6">
                <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                  {{ $t('bannerText') }}
                </h2>
                <p class="opacity-80 text-base" tabindex="0">
                  {{ $t('bannerDescription') }}
                </p>
              </div>
            </div>
          </div>
          <div class="lg:col-span-6 flex justify-center">
            <div class="w-[250px] md:w-[384px] lg:w-128 flex justify-center" role="region" :aria-label="$t('featuredCarousel') || 'Featured collection carousel'">
              <GlobalCarouselCardComp :items="cardItems" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= BUILD THE PERFECT TOOL (2 cards only) ======= -->
    <section class="relative border-t border-base-200 py-6" role="region" :aria-label="$t('buildSection') || 'Build the perfect tool'">
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Schema -->
        <div class="card shadow-xl" role="group" :aria-label="$t('build.schema.title')">
          <div class="card-body">
            <div class="flex items-center gap-2">
              <Icon name="lucide:square-stack" class="text-primary" aria-hidden="true" />
              <div class="font-semibold" tabindex="0">{{ $t('build.schema.title') }}</div>
            </div>
            <div class="mockup-code mt-3 text-sm" role="region" :aria-label="$t('build.schema.codeLabel') || 'Example schema representation'">
              <pre data-prefix="$"><code>Work → Manifestation → Item</code></pre>
              <pre data-prefix=">"><code>has_primary_title.has_name: "Menschen am Sonntag – Das Dokument der Gegenwart"</code></pre>
              <pre data-prefix=">"><code>has_event.has_date: "1929/1930"</code></pre>
              <pre data-prefix=">"><code>has_event.has_activity.Director: ["Siodmak, Robert", "Ulmer, Edgar G."]</code></pre>
              <pre data-prefix=">"><code>has_event.has_activity.Writer: ["Wilder, Billy"]</code></pre>
              <pre data-prefix=">"><code>has_genre.has_name: "Fiction"</code></pre>
              <pre data-prefix=">"><code>manifestations: [</code></pre>
              <pre data-prefix="⋮"><code>  has_primary_title.has_name: "Menschen am Sonntag"</code></pre>
              <pre data-prefix="⋮"><code>  has_event.ProductionEvent.has_date: "2013/2014"</code></pre>
              <pre data-prefix="⋮"><code>  has_event.ReleaseEvent.has_date: "2014"</code></pre>
              <pre data-prefix="⋮"><code>  in_language.code: ["deu","eng","fra"]</code></pre>
              <pre data-prefix="⋮"><code>  has_colour_type: "BlackAndWhite"</code></pre>
              <pre data-prefix="⋮"><code>  has_sound_type: "Sound"</code></pre>
              <pre data-prefix="⋮"><code>  items: [</code></pre>
              <pre data-prefix="⋱"><code>    element_type: "DCP"</code></pre>
              <pre data-prefix="⋱"><code>    has_format.type: "MXF"</code></pre>
              <pre data-prefix="⋱"><code>    has_extent.has_value: 113</code></pre>
              <pre data-prefix="⋱"><code>    has_access_status: "Distribution"</code></pre>
              <pre data-prefix="⋮"><code>  ]</code></pre>
              <pre data-prefix=">"><code>]</code></pre>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="lg:h-full flex justify-center">
            <div class="card-body p-6 flex justify-center items-center">
              <div class="">
                <h2 class="text-4xl bree md:text-5xl font-extrabold tracking-tight" tabindex="0">
                  {{ $t('build.linked.title') }}
                </h2>
                <p class="mt-3 opacity-80 md:text-lg md:max-w-96 mx-auto" tabindex="0">
                  {{ $t('build.linked.lead') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= FROM RECORD TO KNOWLEDGE (timeline) ======= -->
    <section class="relative border-t border-base-200 py-6" role="region" :aria-label="$t('timeline.title')">
      <div class="container mx-auto px-4">
        <h3 class="text-3xl bree font-extrabold mb-6 text-center" tabindex="0">
          {{ $t('timeline.title') }}
        </h3>
        <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical" role="list">
          <li role="listitem" tabindex="0">
            <div class="timeline-middle text-primary my-2">
              <Icon class="text-2xl" name="tabler:search" aria-hidden="true" />
            </div>
            <div class="timeline-start md:text-end mb-10">
              <div class="text-lg font-semibold">{{ $t('timeline.query.title') }}</div>
              <div class="opacity-80">{{ $t('timeline.query.desc') }}</div>
            </div>
            <hr class="bg-primary" />
          </li>
          <li role="listitem" tabindex="0">
            <hr class="bg-primary" />
            <div class="timeline-middle text-primary my-2">
              <Icon class="text-2xl" name="tabler:filter" aria-hidden="true" />
            </div>
            <div class="timeline-end mb-10">
              <div class="text-lg font-semibold">{{ $t('timeline.refine.title') }}</div>
              <div class="opacity-80">{{ $t('timeline.refine.desc') }}</div>
            </div>
            <hr class="bg-primary" />
          </li>
          <li role="listitem" tabindex="0">
            <hr class="bg-primary" />
            <div class="timeline-middle text-primary my-2">
              <Icon class="text-2xl" name="tabler:share-2" aria-hidden="true" />
            </div>
            <div class="timeline-start md:text-end mb-10">
              <div class="text-lg font-semibold">{{ $t('timeline.share.title') }}</div>
              <div class="opacity-80">{{ $t('timeline.share.desc') }}</div>
            </div>
            <hr class="bg-primary" />
          </li>
          <li role="listitem" tabindex="0">
            <hr class="bg-primary" />
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
    </section>

    <!-- ======= CORE FUNCTIONS (your three cards) ======= -->
    <section role="region" :aria-label="$t('coreFunctionsSection')" class="relative border-t border-base-200 py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card shadow-md" role="group" :aria-label="$t('coreFunctionsTitle')">
            <div class="card-body">
              <div class="flex justify-start items-center gap-2">
                <Icon name="fa:desktop" class="text-2xl text-primary" aria-hidden="true" />
                <h3 class="card-title" tabindex="0">{{ $t('coreFunctionsTitle') }}</h3>
              </div>
              <ul class="mt-2" role="list">
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('coreFunctions[0]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('coreFunctions[1]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('coreFunctions[2]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('coreFunctions[3]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('coreFunctions[4]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a
                href="https://projects.tib.eu/av-efi/projekt/"
                target="_blank"
                class="btn btn-outline max-md:btn-block"
                :aria-label="$t('learnMore') + ' – ' + ($t('coreFunctionsTitle') || 'Core functions')"
              >
                {{ $t('learnMore') }}
              </a>
            </div>
          </div>

          <div class="card shadow-md" role="group" :aria-label="$t('forFilmResearchersTitle')">
            <div class="card-body">
              <div class="flex justify-start items-center gap-2">
                <Icon name="fa-film" class="text-2xl text-primary" aria-hidden="true" />
                <h3 class="card-title" tabindex="0">{{ $t('forFilmResearchersTitle') }}</h3>
              </div>
              <ul class="mt-2" role="list">
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[0]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[1]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[2]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[3]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a
                href="https://projects.tib.eu/av-efi/metadaten/"
                target="_blank"
                class="btn btn-outline max-md:btn-block"
                :aria-label="$t('learnMore') + ' – ' + ($t('forFilmResearchersTitle') || 'For film researchers')"
              >
                {{ $t('learnMore') }}
              </a>
            </div>
          </div>

          <div class="card shadow-md" role="group" :aria-label="$t('technicalBasicsTitle')">
            <div class="card-body">
              <div class="flex justify-start items-center gap-2">
                <!-- Keyboardable swap -->
                <label
                  ref="swapToggleRef"
                  tabindex="0"
                  @keydown="onSwapKeydown"
                  aria-label="Toggle code/heart icon"
                  class="swap swap-flip h-[30px] text-2xl text-primary"
                >
                  <input type="checkbox" />
                  <div class="swap-off flex"><Icon name="tabler:code" aria-hidden="true" /></div>
                  <div class="swap-on flex"><Icon class="animate-bounce text-accent" name="fa-heart-o" aria-hidden="true" /></div>
                </label>
                <h3 class="card-title" tabindex="0">{{ $t('technicalBasicsTitle') }}</h3>
              </div>
              <ul class="mt-2" role="list">
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('technicalBasics[0]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('technicalBasics[1]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('technicalBasics[2]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a
                href="https://projects.tib.eu/av-efi/pid/efi-infrastruktur/"
                target="_blank"
                class="btn btn-outline max-md:btn-block"
                :aria-label="$t('learnMore') + ' – ' + ($t('technicalBasicsTitle') || 'Technical basics')"
              >
                {{ $t('learnMore') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= VIDEO BAND (kept, restyled) ======= -->
    <section role="region" :aria-label="$t('videoSection')" class="relative border-t border-base-200 py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-6">
            <video
              controls
              poster="/img/avefi_vid_poster.png"
              class="w-full rounded-xl border border-base-300 shadow-lg"
              :aria-describedby="'video-desc'"
            >
              <source type="video/mp4" src="/vid/avefi_project_wo.mp4" />
              {{ $t('videoNotSupported') }}
            </video>
          </div>
          <div class="lg:col-span-6 lg:h-full">
            <div class="bg-base-100 rounded-xl p-6 md:p-8 lg:h-full">
              <h3 class="mt-4 bree text-3xl md:text-4xl font-extrabold leading-[0.95] tracking-tight" tabindex="0">
                {{ $t('videoSectionTitle') }}
              </h3>
              <p id="video-desc" class="mt-3 md:text-lg leading-relaxed opacity-80" tabindex="0">
                {{ $t('videoSectionDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= PARTNERS (kept) ======= -->
    <section role="region" :aria-label="$t('partnersSection')" class="relative border-t border-base-200 py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-5">
            <div class="">
              <div class="card-body">
                <h3 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                  {{ $t('partnersTitle') }}
                </h3>
                <p class="opacity-80 text-base" tabindex="0">
                  {{ $t('partnersDescription') }}
                </p>
              </div>
            </div>
          </div>
          <div class="lg:col-span-7 flex justify-center">
            <div class="w-full max-w-xl" role="region" :aria-label="$t('partnersCarousel') || 'Project partners carousel'">
              <GlobalCarouselComp :items="items" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const showAdvancedSearch = ref(false)
const searchCompRef = ref<InstanceType<any> | HTMLElement | null>(null)
const swapToggleRef = ref<HTMLElement | null>(null)

function focusFirstInput(root?: HTMLElement | null) {
  const scope = root ?? (
    (searchCompRef.value as any)?.$el as HTMLElement ??
    (searchCompRef.value as unknown as HTMLElement) ??
    null
  )
  if (!scope) return
  const el: HTMLElement | null = scope.querySelector(
    'input[type="text"], input:not([type]), textarea, [contenteditable="true"], [autofocus]'
  )
  if (el && typeof (el as any).focus === 'function') {
    ;(el as HTMLInputElement | HTMLTextAreaElement).focus()
    try {
      const inp = el as HTMLInputElement
      if ('selectionStart' in inp && typeof inp.value === 'string') {
        inp.selectionStart = inp.selectionEnd = inp.value.length
      }
    } catch {}
  }
}

onMounted(async () => {
  await nextTick()
  focusFirstInput()
})

watch(showAdvancedSearch, async () => {
  await nextTick()
  focusFirstInput()
})

function onSwapKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    const host = swapToggleRef.value
    if (!host) return
    const cb = host.querySelector('input[type="checkbox"]') as HTMLInputElement | null
    if (cb) {
      cb.checked = !cb.checked
      cb.dispatchEvent(new Event('change', { bubbles: true }))
      cb.dispatchEvent(new Event('input', { bubbles: true }))
    } else {
      host.click()
    }
  }
}

definePageMeta({
  auth: false,
  layout: 'default'
})

const agentLD = {
  activity: {
    category: "avefi:DirectingActivity",
    type: "Director",
    has_agent: [
      {
        has_name: "Wildenhahn, Klaus",
        type: "Person",
        category: "avefi:Agent",
        same_as: [
          { id: "118771779", category: "avefi:GNDResource" },
          { id: "f75729bb909446878dcf42fbff0a1545", category: "avefi:FilmportalResource" }
        ]
      }
    ]
  }
}

const items = ref([
  { src: '/img/gwdg_logo.min.svg', alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen', link: 'https://www.gwdg.de' },
  { src: '/img/logo_sdk.png', alt: 'Stiftung Deutsche Kinemathek', link: 'https://www.deutsche-kinemathek.de' },
  { src: '/img/logo_tib.png', alt: 'Technische Informationsbibliothek Hannover', link: 'https://www.tib.eu' },
  { src: '/img/logo_fmd.png', alt: 'Filmmuseum Düsseldorf', link: 'https://www.duesseldorf.de/filmmuseum' }
])

const cardItems = ref([
  {
    description: "restShortFilmCollectionDescription",
    title: "restShortFilmCollectionTitle",
    link: `/search/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bhas_form%5D%5B0%5D=Short&21.11155-denormalised-work%5BrefinementList%5D%5Bmanifestation_event_type%5D%5B0%5D=RestorationEvent`,
    linkText: 'restShortFilmCollectionLinkText',
    imgSourceLink: 'https://www.deutsche-kinemathek.de/',
    imgSourceText: 'Deutsche Kinemathek',
    imgAuthor: 'Deutsche Kinemathek',
    imgLicense: 'CC BY-SA 3.0',
    imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
    imgSrc: '/img/restaur_kurzfilme.jpg'
  },
  {
    description: "docFilmCollectionDescription",
    title: "docFilmCollectionTitle",
    link: `/search/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bhas_form%5D%5B0%5D=Documentary&21.11155-denormalised-work%5BrefinementList%5D%5Bsubjects%5D%5B0%5D=Protest&21.11155-denormalised-work%5BrefinementList%5D%5Bsubjects%5D%5B1%5D=Aufstand&21.11155-denormalised-work%5BrefinementList%5D%5Bsubjects%5D%5B2%5D=Widerstand&21.11155-denormalised-work%5BrefinementList%5D%5Bsubjects%5D%5B3%5D=Streik`,
    linkText: 'docFilmCollectionLinkText',
    imgSourceLink: 'https://www.deutsche-kinemathek.de/',
    imgSourceText: 'Deutsche Kinemathek',
    imgAuthor: 'Deutsche Kinemathek',
    imgLicense: 'CC BY-SA 3.0',
    imgLicenseLink: 'https://creativecommons.org/licenses/by-sa/3.0/',
    imgSrc: '/img/aktiv_im_dok.jpg'
  },
  {
    title: 'trollerTitle',
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.jpg',
    imgAlt: 'Georg Stefan Troller',
    description: 'trollerDescription',
    link: `/search/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bdirectors_or_editors%5D%5B0%5D=Troller%2C%20Georg%20Stefan`,
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
    link: `/search/index?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bproduction%5D%5B0%5D=Schlenker%2C%20Hermann&${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Bproduction%5D%5B1%5D=Hermann%20Schlenker%20Filmproduktion`
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
    link: `/search/?${useRuntimeConfig().public.ELASTIC_INDEX}%5BrefinementList%5D%5Blocated_in_has_name%5D%5B0%5D=Deutsche%20Demokratische%20Republik%20%28DDR%29`,
    linkText: 'ddrLinkText'
  }
])
</script>

<style scoped>
/* Premium but accessible shadows */
.card {
  box-shadow:
    0 12px 32px -14px hsl(0 0% 0% / 0.25),
    0 4px 14px -6px hsl(0 0% 0% / 0.12);
}
/* Remove legacy background helpers from old version */
.movie-classics-bg { display: none !important; }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
</style>
