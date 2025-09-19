<template>
  <nav
    class="navbar border-b-2 bg-base-100 dark:bg-gray-950 dark:text-white dark:border-gray-700 hover:!opacity-100"
    :class="isScrolled ? 'md:mix-blend-multiply lg:opacity-90' : ''"
    :aria-label="ariaLabelMainNav"
  >
    <ClientOnly>
      <div class="container flex flex-wrap justify-between mx-auto p-0">
        <div class="navbar-start max-[400px]:w-full sm:w-1/2 md:w-2/5 flex justify-start">
          <!-- Mobile menu toggle -->
          <div class="dropdown">
            <button
              type="button"
              class="btn btn-ghost xl:hidden h-12"
              aria-haspopup="true"
              :aria-expanded="mobileMenuOpen"
              :aria-label="ariaLabelOpenMenu"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            <!-- Mobile dropdown -->
            <ul
              v-show="mobileMenuOpen"
              role="menu"
              :aria-label="ariaLabelMainMenu"
              class="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-52 menu-items"
            >
              <li class="h-12 flex justify-center">
                <MicroSendMailButt />
              </li>
              <li class="h-12 flex justify-center">
                <a :href="`/${useRuntimeConfig().public.SEARCH_URL}/${currentUrlState}`">{{ $t("filmresearch") }}</a>
              </li>
              <li class="h-12 flex justify-center">
                <a href="/contact">{{ $t("help") }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a href="/protected/dashboard">{{ $t('dashboard') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a href="/protected/mergetool">{{ $t('mergeTool') }}<span class="badge badge-accent text-white">1</span></a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a href="/protected/institutionlist">{{ $t('myDatasets') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a href="/protected/favouriteslist">{{ $t('favourites') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a href="/protected/me">{{ $t('profile') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <button
                  title="logout"
                  :aria-label="ariaLabelLogout"
                  @click="signOut()"
                >
                  {{ $t('logout') }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Logo and claim -->
          <div class="mb-2 ml-2 flex items-center justify-center h-12">
            <a
              class="dark:bg-white rounded-lg p-2 text-xl h-12 my-auto flex items-center justify-center"
              href="/"
              :aria-label="$t('home')"
              :title="$t('home')"
            >
              <img
                src="/img/AV-EFI-Logo.png"
                alt="AVefi Logo"
                class="my-auto"
                width="70"
                height="auto"
              >
            </a>
            <img
              :src="locale === 'en' ? '/img/avefi_claim_eng.svg' : '/img/avefi_claim_de.svg'"
              :alt="t('avefiClaim')"
              :title="t('avefiClaim')"
              class="hidden h-12 w-auto ml-2 rounded-lg dark:invert"
            >
            <div class="hidden lg:flex lg:h-12 text-sm leading-none text-left dark:text-gray-200 max-w-32 ml-2">
              <span
                class="bree text-black dark:text-white my-auto"
                v-html="$t('avefiClaimHtml').replace('. ', '<br/>')"
              />
            </div>

            <div
              v-if="!alphaClicked"
              class="inline-block mr-auto ml-3 my-auto text-left h-6 w-24 cursor-pointer"
              @click="alphaClicked = !alphaClicked"
            >
              <span
                :aria-label="t('alpha')"
                :title="t('alpha')"
              >alpha</span>
            </div>
            <div
              class="h-12 ml-3 flex items-center justify-center"
              @click="alphaClicked = !alphaClicked"
            >
              <MicroRainbowStripeText
                v-if="alphaClicked"
                class="font-black flex justify-center text-4xl uppercase mr-auto my-auto cursor-pointer"
                text="alpha"
                :aria-label="t('alpha')"
                :title="t('alpha')"
              />
            </div>
          </div>
        </div>

        <!-- Desktop menu (xl and up) -->
        <div class="navbar-end w-3/5 flex-grow flex hidden xl:flex">
          <ul class="menu w-full justify-end menu-horizontal items-center justify-self-end px-1 z-20 menu-items">
            <li
              v-if="shoppingCart.objects?.length > 0"
              class="h-12 flex justify-center"
            >
              <button
                type="button"
                :aria-label="ariaLabelShoppingcart"
                @click="$toggleComparisonDrawerState('shopping')"
              >
                {{ $t("shoppingcart") }}
                <span class="indicator-item badge badge-favourites-list text-white">{{ shoppingCart.objects?.length }}</span>
              </button>
            </li>

            <li
              v-if="objectListStore.objects?.length > 0"
              class="h-12 flex justify-center"
            >
              <button
                type="button"
                :aria-label="ariaLabelComparison"
                @click="$toggleComparisonDrawerState('comparison')"
              >
                {{ $t("comparison") }}
                <span class="indicator-item badge badge-compare-list text-white">{{ objectListStore.objects?.length }}</span>
              </button>
            </li>
            <li class="h-12 flex justify-center">
              <a :href="`/${useRuntimeConfig().public.SEARCH_URL}/${currentUrlState}`">{{ $t("filmresearch") }}</a>
            </li>
            <li class="h-12 flex justify-center">
              <a href="/contact">{{ $t("help") }}</a>
            </li>
            <li class="h-12 flex justify-center">
              <MicroSendMailButt />
            </li>
            <li
              v-if="data"
              class="h-12 flex justify-center"
            >
              <details @toggle="detailsOpen = $event.target.open">
                <summary
                  aria-haspopup="menu"
                  :aria-expanded="detailsOpen"
                  :aria-label="ariaLabelUserMenu"
                >
                  <span class="sr-only">{{ $t('userMenu') }}</span>
                  <div
                    v-if="data?.Avatar != null"
                    class="avatar"
                  >
                    <div class="w-8 rounded-full" />
                  </div>
                  <div v-else>
                    Hello {{ data?.user?.name }}
                  </div>
                </summary>
                <ul
                  class="p-2 dark:bg-gray-800 w-64 menu-items right-4"
                  role="menu"
                  :aria-label="ariaLabelUserMenu"
                >
                  <li role="none">
                    <a
                      role="menuitem"
                      href="/protected/dashboard"
                    >{{ $t('dashboard') }}</a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      href="/protected/mergetool"
                    >{{ $t('mergeTool') }}<span class="badge badge-accent">1</span></a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      href="/protected/institutionlist"
                    >{{ $t('myDatasets') }}</a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      href="/protected/favouriteslist"
                    >{{ $t('favourites') }}</a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      href="/protected/me"
                    >{{ $t('profile') }}</a>
                  </li>
                  <li role="none">
                    <button
                      type="button"
                      class="w-full text-left"
                      :aria-label="ariaLabelLogout"
                      @click="signOut()"
                    >
                      {{ $t('logout') }}
                    </button>
                  </li>
                </ul>
              </details>
            </li>
            <li
              v-else
              class="h-12 flex justify-center"
            >
              <div
                role="button"
                class="btn btn-circle btn-sm btn-outline"
                :aria-label="ariaLabelLogin"
                :title="$t('Login')"                
                @click="signIn('keycloak')"
              >
                <LazyIcon
                  name="fa-regular:user"
                  aria-hidden="true"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ClientOnly>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useObjectListStore } from '../../stores/compareList';
import { useShoppingCart } from '../../stores/shoppingCart';
import { useCurrentUrlState } from '../../composables/useCurrentUrlState';

const { currentUrlState } = useCurrentUrlState();
const { data, signOut, signIn } = useAuth();
const { locale, t } = useI18n();

const objectListStore = useObjectListStore();
const shoppingCart = useShoppingCart();

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const detailsOpen = ref(false);

const alphaClicked = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
    const header = document.querySelector('header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
    window?.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

// ARIA labels via i18n
const ariaLabelMainNav = computed(() => t('mainNavigation'));
const ariaLabelOpenMenu = computed(() => t('openMenu'));
const ariaLabelMainMenu = computed(() => t('mainMenu'));
const ariaLabelUserMenu = computed(() => t('userMenu'));
const ariaLabelLogout = computed(() => t('logout'));
const ariaLabelLogin = computed(() => t('login'));
const ariaLabelComparison = computed(() => t('comparison'));
const ariaLabelShoppingcart = computed(() => t('shoppingcart'));
</script>

<style scoped>
.menu-items li {
  height: 3rem;
}
</style>
