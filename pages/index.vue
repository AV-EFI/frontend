<template>
  <div class="min-h-screen bg-base-100 text-base-content flow">
    <!-- Skip link -->
    <a href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-40 btn btn-sm btn-primary">
      {{ $t('skipToContent') || 'Skip to main content' }}
    </a>

    <!-- ======= HERO / SEARCH-FIRST ======= -->
    <section id="hero" role="banner" :aria-label="$t('bannerSection')" class="relative z-20">
      <div class="hero max-lg:min-h-[48vh] lg:min-h-[58vh]">
        <div class="hero-overlay w-full" :style="heroParallaxStyle">
          <!-- Toggle button for video/image (glass pill, non-competing) -->
          <div class="absolute top-4 right-4 z-40 hidden">
            <button
              class="btn btn-xs btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
              @click="heroMediaVisible = !heroMediaVisible" :aria-pressed="heroMediaVisible"
              :title="heroMediaVisible ? 'Hide background media' : 'Show background media'">
              <Icon :name="heroMediaVisible ? 'tabler:video-off' : 'tabler:video'" class="w-4 h-4" />
              <span class="sr-only">
                {{ heroMediaVisible ? $t('hideVideo') : $t('showVideo') }}
              </span>
            </button>
          </div>

          <!-- Background media -->
          <picture>
            <source srcset="/img/avefi_diamonds_prim_mobile.webp" media="(max-width: 640px)" />
            <source srcset="/img/avefi_diamonds_prim_tablet.webp" media="(max-width: 1023px)" />
            <source srcset="/img/avefi_diamonds_prim_desktop.webp" media="(min-width: 1024px)" />
            <img src="/img/avefi_diamonds_prim_white.webp" alt="Diamond pattern primary desktop" width="2040"
              height="1360" loading="eager" fetchpriority="high" decoding="async" sizes="100vw"
              class="max-sm:hidden lg:visible absolute inset-0 w-full h-full object-cover object-center dark:invert max-w-[600px] max-h-full lg:max-w-full lg:max-h-full" />
          </picture>
          <!-- Aurora / glow overlays (light + dark variants) -->
          <div
            class="absolute inset-0 motion-reduce:transition-none motion-reduce:animate-none saturate-[1.05] pointer-events-none"
            aria-hidden="true" :class="[
                // LIGHT
                'bg-[radial-gradient(900px_600px_at_18%_18%,hsl(210_80%_70%/0.18),transparent_60%),radial-gradient(900px_600px_at_82%_22%,hsl(330_85%_72%/0.16),transparent_60%),radial-gradient(900px_600px_at_56%_80%,hsl(200_85%_68%/0.12),transparent_62%),linear-gradient(180deg,hsl(0_0%_100%/0.82),hsl(0_0%_100%/0.88))]',
                // DARK
                'dark:bg-[radial-gradient(900px_600px_at_18%_18%,hsl(210_80%_60%/0.18),transparent_60%),radial-gradient(900px_600px_at_82%_22%,hsl(330_85%_62%/0.16),transparent_60%),radial-gradient(900px_600px_at_56%_80%,hsl(200_85%_58%/0.12),transparent_62%),linear-gradient(180deg,hsl(220_20%_10%/0.70),hsl(220_20%_10%/0.78))]',
              ]" />
          <!-- Vignette -->
          <div
            class="absolute inset-0 pointer-events-none
         mix-blend-multiply dark:mix-blend-normal
         bg-[radial-gradient(1200px_700px_at_50%_40%,rgba(0,0,0,0)_42%,rgba(0,0,0,0.14)_100%),linear-gradient(180deg,rgba(0,0,0,0.08),transparent_22%,transparent_78%,rgba(0,0,0,0.10))]
         dark:bg-[radial-gradient(1200px_700px_at_50%_40%,rgba(0,0,0,0)_42%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.12),transparent_22%,transparent_78%,rgba(0,0,0,0.14))]">
          </div>
          <!-- Subtle grid -->
          <div class="absolute inset-0 opacity-[0.08]" aria-hidden="true">
            <div class="size-full bg-[radial-gradient(circle_at_1px_1px,theme(colors.base-300/.5)_1px,transparent_1px)]
                       [background-size:22px_22px]">
            </div>
          </div>
        </div>

        <div class="hero-content w-full lg:w-full">
          <div class="w-full lg:max-w-6xl mx-auto">
            <!-- Center content panel: THIS is what makes it readable -->
            <div class="max-w-90vw lg:max-w-6xl mx-auto px-4 py-9 rounded-2xl
    border
    shadow-[0_28px_70px_-52px_rgba(0,0,0,0.40)]
    supports-[backdrop-filter]:backdrop-blur-[10px]
    motion-reduce:transition-none
  " :class="[
    // LIGHT glass
    'bg-white/85 border-white/40',
    // DARK glass (this is what was missing)
    'dark:bg-neutral/40 dark:border-white/10',
    // subtle inner highlight like your inset 1px
    'shadow-inner dark:shadow-none',
  ]">
              <div class="text-center">
                <h1 class="
    mt-2 bree text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight
    [text-shadow:0_1px_0_rgba(255,255,255,0.65)]
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
                  <div class="card
    border
    supports-[backdrop-filter]:backdrop-blur-[14px]
    shadow-[0_26px_70px_-48px_rgba(0,0,0,0.45),0_8px_26px_-18px_rgba(0,0,0,0.18)]
  " :class="[
    // LIGHT
    'bg-white/55 border-white/35',
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
        aria-hidden="true" :class="[
    // LIGHT
    'bg-[radial-gradient(900px_600px_at_18%_18%,hsl(210_80%_70%/0.18),transparent_60%),radial-gradient(900px_600px_at_82%_22%,hsl(330_85%_72%/0.16),transparent_60%),radial-gradient(900px_600px_at_56%_80%,hsl(200_85%_68%/0.12),transparent_62%),linear-gradient(180deg,hsl(0_0%_100%/0.82),hsl(0_0%_100%/0.88))]',
    // DARK
    'dark:bg-[radial-gradient(900px_600px_at_18%_18%,hsl(210_80%_60%/0.18),transparent_60%),radial-gradient(900px_600px_at_82%_22%,hsl(330_85%_62%/0.16),transparent_60%),radial-gradient(900px_600px_at_56%_80%,hsl(200_85%_58%/0.12),transparent_62%),linear-gradient(180deg,hsl(220_20%_10%/0.70),hsl(220_20%_10%/0.78))]',
  ]" />

      <!-- content stays above -->
      <div class="relative z-10 container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div class="lg:col-span-12 flex justify-center">
            <LazyGlobalCarouselCardComp :items="cardItems" />
          </div>
        </div>
      </div>
    </section>

    <!-- ======= BUILD THE PERFECT TOOL (2 cards only) ======= -->
    <section class="relative border-t border-base-200 py-10 section-wash section-wash--b" role="region"
      :aria-label="$t('buildSection') || 'Build the perfect tool'">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <!-- Schema -->
          <div class="card shadow-xl" role="group" :aria-label="$t('build.schema.title')">
            <div class="card-body">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="tabler:squares-selected" class="text-primary" aria-hidden="true" />
                <h2 class="text-3xl bree md:text-4xl font-extrabold" tabindex="0">
                  {{ $t('build.schema.title') }}
                </h2>
              </div>
              <div class="mockup-code mt-3 text-sm" role="region"
                :aria-label="$t('build.schema.codeLabel') || 'Example schema representation'">
                <pre data-prefix="$"><code>Work → Manifestation → Item</code></pre>
                <pre
                  data-prefix=">"><code>has_primary_title.has_name: "Menschen am Sonntag – Das Dokument der Gegenwart"</code></pre>
                <pre data-prefix=">"><code>has_event.has_date: "1929/1930"</code></pre>
                <pre
                  data-prefix=">"><code>has_event.has_activity.Director: ["Siodmak, Robert", "Ulmer, Edgar G."]</code></pre>
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

          <div
            class="lg:col-span-1 flex justify-center items-center max-w-md md:max-w-lg lg:max-w-full px-6 md:px-6 lg:px-0 min-h-[300px]">
            <div class="text-left max-w-md">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                {{ $t('build.linked.title') }}
              </h2>
              <p class="text-base md:text-lg opacity-80" tabindex="0">
                {{ $t('build.linked.lead') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative border-t border-base-200 py-10 section-wash section-wash--a" role="region"
      :aria-label="$t('timeline.title')">
      <div class="container mx-auto p-6 lg:px-4 lg:min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
          <div class="text-left max-w-md w-full lg:col-span-1 flex flex-col justify-center p-6">
            <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
              {{ $t('licensingInfo.title') }}
            </h2>
            <ul>
              <li class="opacity-80">{{ $t('licensingInfo.content[0]') }}</li>
              <li class="opacity-80">{{ $t('licensingInfo.content[1]') }}</li>
              <li class="opacity-80">{{ $t('licensingInfo.content[2]') }}</li>
            </ul>
          </div>
          <div class="flex justify-center items-center w-full lg:col-span-1 min-h-[300px]">
            <a href="#" class="hover-3d my-12 mx-2 cursor-pointer">
              <div
                class="card w-80 lg:w-96 bg-neutral text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
                <div class="card-body">
                  <div class="flex justify-between mb-10">
                    <div class="font-bold">CC BY 4.0</div>
                    <div class="text-5xl opacity-10">❁</div>
                  </div>
                  <div class="flex justify-center mb-4">
                    <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons Logo"
                      class="h-8 mr-2" />
                    <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution Logo"
                      class="h-8" />
                  </div>
                  <div class="text-xs opacity-40 text-center">Creative Commons Attribution</div>
                </div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </a>
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

          <div class="w-full flex flex-col justify-center max-lg:mt-6">
            <h2 class="text-3xl bree md:text-4xl font-extrabold mt-6 mb-4 lg:mb-6 text-center" tabindex="0">
              {{ $t('topIssuers') || 'Top Publishers & Archives' }}
            </h2>
            <div class="flex justify-center items-center">
              <div class="w-full max-w-md">
                <ClientOnly>
                  <LazyGlobalIssuerCarouselComp />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= CORE FUNCTIONS ======= -->
    <section role="region" :aria-label="$t('coreFunctionsSection')"
      class="relative border-t border-base-200 py-10 section-wash section-wash--b">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card md:p-2 shadow-md bg-white/90 dark:bg-transparent" role="group"
            :aria-label="$t('coreFunctionsTitle')">
            <div class="card-body">
              <div class="flex justify-start items-center gap-2 mb-2">
                <Icon name="fa:desktop" class="text-2xl text-primary" aria-hidden="true" />
                <h2 class="text-xl md:text-2xl font-extrabold bree" tabindex="0">
                  {{ $t('coreFunctionsTitle') }}
                </h2>
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
              <a href="https://projects.tib.eu/av-efi/projekt/" target="_blank"
                class="btn btn-outline max-md:btn-block">
                <span class="sr-only">{{ $t('learnMore') }} – </span>{{ $t('coreFunctionsTitle') }}
              </a>
            </div>
          </div>

          <div class="card md:p-2 shadow-md  bg-white/90 dark:bg-transparent" role="group"
            :aria-label="$t('forFilmResearchersTitle')">
            <div class="card-body">
              <div class="flex justify-start items-center gap-2 mb-2">
                <Icon name="fa-film" class="text-2xl text-primary" aria-hidden="true" />
                <h2 class="text-xl md:text-2xl font-extrabold bree" tabindex="0">{{ $t('forFilmResearchersTitle') }}
                </h2>
              </div>
              <ul class="mt-2" role="list">
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[0]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[1]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[2]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('forFilmResearchers[3]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a href="https://projects.tib.eu/av-efi/metadaten/" target="_blank"
                class="btn btn-outline max-md:btn-block">
                <span class="sr-only">{{ $t('learnMore') }} – </span>{{ $t('forFilmResearchersTitle') }}
              </a>
            </div>
          </div>

          <div class="card md:p-2 shadow-md  bg-white/90 dark:bg-transparent" role="group"
            :aria-label="$t('technicalBasicsTitle')">
            <div class="card-body">
              <div class="flex justify-start items-center gap-2">
                <label ref="swapToggleRef" tabindex="0" @keydown="onSwapKeydown" aria-label="Toggle code/heart icon"
                  class="swap swap-flip h-[30px] text-2xl text-primary">
                  <input type="checkbox" />
                  <div class="swap-off flex">
                    <Icon name="tabler:code" aria-hidden="true" />
                  </div>
                  <div class="swap-on flex">
                    <Icon class="text-accent" name="fa-heart-o" aria-hidden="true" />
                  </div>
                </label>
                <h2 class="text-xl md:text-2xl font-extrabold bree" tabindex="0">
                  {{ $t('technicalBasicsTitle') }}
                </h2>
              </div>
              <ul class="mt-2" role="list">
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('technicalBasics[0]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('technicalBasics[1]') }}</span></li>
                <li class="mb-2" role="listitem"><span class="text-base">{{ $t('technicalBasics[2]') }}</span></li>
              </ul>
            </div>
            <div class="card-actions justify-end m-3">
              <a href="https://projects.tib.eu/av-efi/pid/efi-infrastruktur/" target="_blank"
                class="btn btn-outline max-md:btn-block">
                <span class="sr-only">{{ $t('learnMore') }} – </span>{{ $t('technicalBasicsTitle') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= VIDEO BAND ======= -->
    <section role="region" :aria-label="$t('videoSection')"
      class="relative border-t border-base-200 py-10 section-wash section-wash--a">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-6">
            <video controls preload="none" :poster="videoPosterSrc"
              class="w-full rounded-xl border border-base-300 shadow-lg" :aria-describedby="'video-desc'">
              <source type="video/mp4" src="/vid/avefi_project_wo.mp4" />
              {{ $t('videoNotSupported') }}
            </video>
          </div>
          <div class="lg:col-span-6 lg:h-full">
            <div class="bg-base-100/90 rounded-xl p-6 md:p-8 lg:h-full border border-base-200/70">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                {{ $t('videoSectionTitle') }}
              </h2>
              <p id="video-desc" class="text-base md:text-lg opacity-80" tabindex="0">
                {{ $t('videoSectionDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= PARTNERS ======= -->
    <section role="region" :aria-label="$t('partnersSection')"
      class="relative border-t border-base-200 py-10 section-wash section-wash--b">
      <div class="container mx-auto px-4 min-h-[400px] flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-5">
            <div class="card-body">
              <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                {{ $t('partnersTitle') }}
              </h2>
              <p class="text-base md:text-lg opacity-80" tabindex="0">
                {{ $t('partnersDescription') }}
              </p>
            </div>
          </div>
          <div class="lg:col-span-7 flex justify-center">
            <div class="w-full max-w-xl" role="region"
              :aria-label="$t('partnersCarousel') || 'Project partners carousel'">
              <GlobalCarouselComp :items="items" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRuntimeConfig, useSeoMeta } from 'nuxt/app';
import { ref, onMounted, nextTick, watch, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useMediaQuery } from '@vueuse/core';

const route = useRoute();
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const CARD_IMAGE_WIDTHS = [240, 320, 480, 720, 1024] as const;
const CARD_IMAGE_SIZES = '(max-width: 480px) 92vw, (max-width: 1024px) 320px, 380px';

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

// --- HERO overlay media toggle ---
const heroMediaVisible = ref(false);
const HERO_MEDIA_KEY = 'heroMediaVisible';

const heroParallax = ref(0);
const heroParallaxStyle = computed(() => ({
  transform: `translateY(${heroParallax.value}px)`
}));

function onScrollParallax() {
  // Clamp to max 40px for subtle effect
  heroParallax.value = Math.min(window.scrollY * 0.18, 40);
}

onMounted(() => {
  window.addEventListener('scroll', onScrollParallax);
  onScrollParallax();
  const stored = localStorage.getItem(HERO_MEDIA_KEY);
  if (stored !== null) heroMediaVisible.value = stored === 'true';
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScrollParallax);
});
watch(heroMediaVisible, (val) => {
  localStorage.setItem(HERO_MEDIA_KEY, val ? 'true' : 'false');
});

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
const searchCompRef = ref<HTMLElement | null>(null);
const swapToggleRef = ref<HTMLElement | null>(null);

function focusFirstInput(root?: HTMLElement | null) {
    const scope =
    root ??
    ((searchCompRef.value &&
    (searchCompRef.value as unknown as { $el: HTMLElement }).$el
        ? (searchCompRef.value as unknown as { $el: HTMLElement }).$el
        : searchCompRef.value as HTMLElement) ??
      null);
    if (!scope) return;
    const el: HTMLElement | null = scope.querySelector(
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
  prefersCompactPoster.value ? '/img/avefi_vid_poster-360.webp' : '/img/avefi_vid_poster-720.webp'
);

const items = ref([
  {
    src: '/img/gwdg_logo.min.svg',
    width: 176.871,
    height: 52.384,
    alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen',
    link: 'https://www.gwdg.de'
  },
  {
    src: '/img/logo_sdk.webp',
    width: 50,
    height: 56,
    alt: 'Stiftung Deutsche Kinemathek',
    link: 'https://www.deutsche-kinemathek.de'
  },
  {
    src: '/img/logo_tib.webp',
    width: 85,
    height: 56,
    alt: 'Technische Informationsbibliothek Hannover',
    link: 'https://www.tib.eu'
  },
  {
    src: '/img/logo_fmd.webp',
    width: 199,
    height: 56,
    alt: 'Filmmuseum Düsseldorf',
    link: 'https://www.duesseldorf.de/filmmuseum'
  },
  {
    src: '/img/logo_mcdci.webp',
    width: 56,
    height: 56,
    alt: 'Marburg Center for Digital Culture and Infrastructure',
    link: 'https://www.uni-marburg.de/de/mcdci'
  }
]);

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
