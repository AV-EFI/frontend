<!-- eslint-disable vue/no-v-html -->
<template>
    <nav
        class="navbar border-b-2 border-base-200 bg-base-100 dark:bg-gray-950 dark:text-white dark:border-gray-700 hover:!opacity-100 p-0 lg:p-2 relative"
        :aria-label="ariaLabelMainNav">
        <!-- Blending background layer -->
        <div v-if="isScrolled" class="absolute inset-0 w-full h-full md:mix-blend-multiply pointer-events-none z-0"></div>
        <div class="container w-full flex flex-wrap justify-between mx-auto p-0 relative z-20">
            <div class="navbar-start w-full xl:w-auto xl:shrink-0 flex justify-start">
                <!-- Mobile menu toggle -->
                <div ref="mobileMenuRef" class="dropdown xl:hidden" :class="{ 'dropdown-open': mobileMenuOpen }">
                    <button type="button" class="btn btn-ghost h-12 whitespace-nowrap" :aria-expanded="mobileMenuOpen"
                            :aria-controls="mobileMenuId" @click="toggleMobileMenu">
                        <Icon name="tabler:menu-2" class="icon-action" aria-hidden="true" />
                        <span>{{ ariaLabelMainMenu }}</span>
                    </button>
                    <!-- Mobile dropdown -->
                    <ul v-show="mobileMenuOpen" :id="mobileMenuId" :aria-label="ariaLabelMainMenu"
                        class="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow bg-base-100 dark:bg-gray-900 rounded-box w-64 menu-items xl:hidden"
                        @mousedown.stop>
                        <ClientOnly>
                            <li v-if="favourites.objects?.length > 0">
                                <GlobalNavItem icon="tabler:heart" :label="$t('favourites')" :badge="favourites.objects.length"
                                               badge-class="badge-favourites-list" @click="toggleComparisonDrawerState('favourites')" />
                            </li>
                            <li v-if="objectListStore.objects?.length > 0">
                                <GlobalNavItem icon="tabler:git-compare" :label="$t('comparison')" :badge="objectListStore.objects.length"
                                               badge-class="badge-compare-list" @click="toggleComparisonDrawerState('comparison')" />
                            </li>
                        </ClientOnly>
                        <li><GlobalNavItem :to="searchHref" icon="tabler:search" :label="$t('filmresearch')" /></li>
                        <li v-if="isNewsEnabled(runtime.public.newsEnabled)">
                            <GlobalNavItem to="/news" icon="tabler:news" :label="$t('news.title')" />
                        </li>
                        <li><GlobalNavItem to="/faq" icon="tabler:help-circle" :label="$t('faq.title')" /></li>
                        <li><GlobalNavItem to="/vocab" icon="tabler:book" :label="$t('vocab.title')" /></li>
                        <li>
                            <GlobalNavItem icon="tabler:send" :label="$t('navContact')" haspopup="dialog" @click="openContactForm" />
                        </li>
                        <ClientOnly>
                            <li v-if="!data?.user && loginEnabled">
                                <GlobalNavItem icon="tabler:login" :label="$t('login')" @click="signIn" />
                            </li>
                        </ClientOnly>
                        <template v-if="data?.user">
                            <li><GlobalNavItem to="/protected/dashboard" icon="tabler:layout-dashboard" :label="$t('dashboard')" /></li>
                            <li>
                                <GlobalNavItem to="/protected/mergetool" icon="tabler:git-merge" :label="$t('mergeTool')" badge="1"
                                               badge-class="badge-accent text-white" />
                            </li>
                            <li><GlobalNavItem to="/protected/favouriteslist" icon="tabler:heart" :label="$t('favourites')" /></li>
                            <li><GlobalNavItem to="/protected/me" icon="tabler:user" :label="$t('profile')" /></li>
                            <li><GlobalNavItem icon="tabler:logout" :label="$t('logout')" @click="signOut()" /></li>
                        </template>
                        <li class="h-auto! min-h-12">
                            <GlobalSettingsMenu v-model:open="mobileSettingsMenuOpen" inline />
                        </li>
                    </ul>
                </div>

                <!-- Logo and claim as set on projects.tib.eu: last claim baseline on the logo baseline (utils/brandLockup) -->
                <div class="mb-2 ml-2 flex items-center justify-center h-12">
                    <div class="brand-lockup whitespace-nowrap">
                        <a class="brand-lockup__logo rounded-lg p-2" href="/"
                           :aria-label="$t('home.breadcrumbs')" :title="$t('home.breadcrumbs')">
                            <img src="/img/AV-EFI-Logo.svg" alt="AVefi Logo" class="inline dark:hidden" width="70" height="27">
                            <img src="/img/AV-EFI-Logo-dark.svg" alt="AVefi Logo dark" class="hidden dark:inline" width="70"
                                 height="27">
                        </a>
                        <span class="brand-lockup__claim bree hidden lg:inline-block dark:text-gray-200">
                            <span v-for="line in claimLines" :key="line" class="block">{{ line }}</span>
                        </span>
                    </div>
                    <div v-if="envLabel !== 'Production'" class="badge badge-neutral mr-auto ml-3 my-auto text-left h-6 w-24 min-w-0 shrink truncate">
                        {{ envLabel }}
                    </div>                        
                </div>
            </div>

            <!-- Desktop menu (xl and up): every entry has an icon and a visible text -->
            <div class="navbar-end xl:w-auto min-w-0 grow hidden xl:flex">
                <ul
                    class="menu w-full justify-end menu-horizontal items-center justify-self-end px-1 z-20 menu-items overflow-visible">
                    <ClientOnly>
                        <li v-if="favourites.objects?.length > 0">
                            <GlobalNavItem icon="tabler:heart" :label="$t('favourites')" :badge="favourites.objects.length"
                                           badge-class="badge-favourites-list" @click="toggleComparisonDrawerState('favourites')" />
                        </li>
                        <li v-if="objectListStore.objects?.length > 0">
                            <GlobalNavItem icon="tabler:git-compare" :label="$t('comparison')" :badge="objectListStore.objects.length"
                                           badge-class="badge-compare-list" @click="toggleComparisonDrawerState('comparison')" />
                        </li>
                    </ClientOnly>
                    <li><GlobalNavItem :to="searchHref" icon="tabler:search" :label="$t('filmresearch')" /></li>
                    <li v-if="isNewsEnabled(runtime.public.newsEnabled)">
                        <GlobalNavItem to="/news" icon="tabler:news" :label="$t('news.title')" />
                    </li>
                    <li><GlobalNavItem to="/faq" icon="tabler:help-circle" :label="$t('faq.title')" /></li>
                    <li><GlobalNavItem to="/vocab" icon="tabler:book" :label="$t('vocab.title')" /></li>
                    <li>
                        <GlobalNavItem icon="tabler:send" :label="$t('navContact')" haspopup="dialog" @click="openContactForm" />
                    </li>
                    <ClientOnly>
                        <li ref="authItemRef" class="overflow-visible">
                            <GlobalUserMenu v-if="data?.user" :user-name="data?.user?.name ?? ''" @sign-out="signOut()" />
                            <GlobalNavItem v-else-if="loginEnabled" icon="tabler:login" :label="$t('login')" @click="signIn" />
                        </li>
                    </ClientOnly>
                    <li class="overflow-visible">
                        <GlobalSettingsMenu />
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { isNewsEnabled } from '~/utils/newsEnabled';
import {
    CLAIM_GAP_PER_CLAIM_EM,
    CLAIM_LINE_HEIGHT_EM,
    LOGO_DESCENT_PER_WIDTH,
    LOGO_WIDTH_PER_CLAIM_EM,
    splitClaimLines,
} from '~/utils/brandLockup';
import { computed, ref, nextTick, onMounted, onBeforeUnmount, useId, watch } from 'vue';
import { useObjectListStore } from '../../stores/compareList.js';
import { useFavourites } from '../../stores/favourites.js';
import { useCurrentUrlState } from '../../composables/useCurrentUrlState.js';

const runtime = useRuntimeConfig();

const { currentUrlState } = useCurrentUrlState();
const { data, signOut, signIn } = useAuth();
const { t } = useI18n();

const objectListStore = useObjectListStore();
const favourites = useFavourites();
const { $toggleComparisonDrawerState: toggleComparisonDrawerState } = useNuxtApp();

const isScrolled = ref(false);
const mobileMenuOpen = useState('navMobileMenuOpen', () => false);
const mobileSettingsMenuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);
const mobileMenuId = `main-menu-${useId()}`;
const authItemRef = ref<HTMLElement | null>(null);

const envLabel = runtime.public.ENV_LABEL;
const loginEnabled = computed(() => runtime.public.loginEnabled === true);
const searchHref = computed(() => `/${runtime.public.SEARCH_URL}/${currentUrlState.value}`);

const claimLines = computed(() => splitClaimLines(t('avefiClaim')));

/** The logo is sized from the claim whenever the claim is shown. At 0.9rem the claim line pitch is a whole 13px, so browsers do not snap it. */
const CLAIM_FONT_SIZE_REM = 0.9;
const lockupLogoWidth = `${(CLAIM_FONT_SIZE_REM * LOGO_WIDTH_PER_CLAIM_EM).toFixed(4)}rem`;
const lockupLogoDescent = `${(-LOGO_DESCENT_PER_WIDTH * CLAIM_FONT_SIZE_REM * LOGO_WIDTH_PER_CLAIM_EM).toFixed(4)}rem`;
const lockupClaimSize = `${CLAIM_FONT_SIZE_REM}rem`;
const lockupClaimLineHeight = CLAIM_LINE_HEIGHT_EM.toFixed(4);
const lockupClaimGap = `${CLAIM_GAP_PER_CLAIM_EM.toFixed(4)}em`;

const openContactForm = () => {
    window.dispatchEvent(new Event('toggle-contact-drawer'));
};

// The login button and the user menu swap places once the session is known. If keyboard
// focus was on the old control, move it to the new one instead of dropping it to <body>.
watch(() => !!data.value?.user, async () => {
    const hadFocus = authItemRef.value?.contains(document.activeElement) ?? false;
    await nextTick();
    if (hadFocus) {
        authItemRef.value?.querySelector<HTMLElement>('button, a')?.focus();
    }
});

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    if (!mobileMenuOpen.value) {
        mobileSettingsMenuOpen.value = false;
    }
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
    mobileSettingsMenuOpen.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
    if (!mobileMenuOpen.value) return;

    const target = event.target;
    if (!(target instanceof Node) || mobileMenuRef.value?.contains(target)) return;

    closeMobileMenu();
};

onMounted(() => {
    window?.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleDocumentClick, { capture: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleDocumentClick, { capture: true });
});

// ARIA labels via i18n
const ariaLabelMainNav = computed(() => t('mainNavigation'));
const ariaLabelMainMenu = computed(() => t('mainMenu'));
</script>

<style scoped>
/* Inline formatting puts the logo baseline and the claim's last baseline on one line box baseline. */
.brand-lockup {
  font-size: v-bind(lockupClaimSize);
  line-height: v-bind(lockupClaimLineHeight);
}

.brand-lockup__logo {
  display: inline-block;
}

.brand-lockup__logo img {
  width: 70px;
  height: auto;
  vertical-align: baseline;
}

.brand-lockup__claim {
  /* The logo link's p-2 right padding is part of the gap. */
  margin-left: calc(v-bind(lockupClaimGap) - 0.5rem);
  text-align: left;
}

@media (min-width: 64rem) {
  .brand-lockup__logo img {
    width: v-bind(lockupLogoWidth);
    margin-bottom: v-bind(lockupLogoDescent);
  }
}

.menu-items li {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-items li > a,
.menu-items li > button {
  width: 100%;
}

/* Desktop header: labels stay on one line and entries sit close together, so the row has room and wraps only as a last resort. */
.navbar-end .menu-items > li {
  flex: none;
}

.navbar-end .menu-items > li > a,
.navbar-end .menu-items > li > button,
.navbar-end .menu-items :deep(.header-menu-trigger) {
  padding-inline: 0.5rem;
  gap: 0.375rem;
  white-space: nowrap;
}
</style>
