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
                    <button type="button" class="btn btn-ghost h-12" :aria-expanded="mobileMenuOpen"
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
                        <li class="h-auto!">
                            <GlobalSettingsMenu v-model:open="mobileSettingsMenuOpen" inline />
                        </li>
                    </ul>
                </div>

                <!-- Logo and claim -->
                <div class="mb-2 ml-2 flex items-center justify-center h-12">
                    <a class="rounded-lg p-2 text-xl h-12 my-auto flex items-center justify-center" href="/"
                       :aria-label="$t('home.breadcrumbs')" :title="$t('home.breadcrumbs')">
                        <img src="/img/AV-EFI-Logo.svg" alt="AVefi Logo" class="my-auto dark:hidden" width="70" height="27">
                        <img src="/img/AV-EFI-Logo-dark.svg" alt="AVefi Logo dark" class="my-auto hidden dark:block" width="70"
                             height="27">
                    </a>
                    <img :src="locale === 'en' ? '/img/avefi_claim_en.svg' : '/img/avefi_claim_de.svg'" :alt="t('avefiClaim')"
                         :title="t('avefiClaim')" class="hidden h-12 w-auto ml-2 rounded-lg dark:invert" width="230" height="105">
                    <div class="hidden lg:flex text-sm leading-none text-left dark:text-gray-200 max-w-32 lg:h-12 ml-2">
                        <span class="bree my-auto" v-html="$t('avefiClaimHtml').replace('. ', '<br/>')" />
                    </div>
                    <div v-if="envLabel !== 'Production'" class="badge badge-neutral mr-auto ml-3 my-auto text-left h-6 w-24">
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
import { computed, ref, nextTick, onMounted, onBeforeUnmount, useId, watch } from 'vue';
import { useObjectListStore } from '../../stores/compareList.js';
import { useFavourites } from '../../stores/favourites.js';
import { useCurrentUrlState } from '../../composables/useCurrentUrlState.js';

const runtime = useRuntimeConfig();

const { currentUrlState } = useCurrentUrlState();
const { data, signOut, signIn } = useAuth();
const { locale, t } = useI18n();

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
