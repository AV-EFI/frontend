<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount, unref } from 'vue';
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

const config = useRuntimeConfig();
const envLabel = config.public.ENV_LABEL;

const alphaClicked = ref(false);

const currentLocale = computed(() => unref(locale)); // ✅ safe locale

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

<template>
  <nav
    class="navbar border-b-2 bg-base-100 dark:bg-gray-950 dark:text-white dark:border-gray-700 hover:!opacity-100"
    :class="isScrolled ? 'md:mix-blend-multiply lg:opacity-90' : ''"
    :aria-label="ariaLabelMainNav"
  >
    <ClientOnly>
      <div class="container flex flex-wrap justify-between mx-auto p-0">
        <div class="navbar-start max-[400px]:w-full sm:w-1/2 md:w-2/5 flex justify-start">
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
              :src="currentLocale === 'en' ? '/img/avefi_claim_eng.svg' : '/img/avefi_claim_de.svg'"
              :alt="$t('avefiClaim')"   <!-- ✅ fixed -->
              :title="$t('avefiClaim')" <!-- ✅ fixed -->
              class="hidden h-12 w-auto ml-2 rounded-lg dark:invert"
            >
            <!-- Rest of your badge, alpha, envLabel code unchanged -->
          </div>
        </div>
        <!-- Rest of menu code unchanged -->
      </div>
    </ClientOnly>
  </nav>
</template>
