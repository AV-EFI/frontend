<script setup lang="ts">
import { useObjectListStore } from '../../stores/compareList';
import { useShoppingCart } from '../../stores/shoppingCart';

const { data, signOut, signIn } = useAuth();

const triggerSignout = () => {
    signOut({ callbackUrl: '/', external: true });
};

const objectListStore = useObjectListStore();
const shoppingCart = useShoppingCart();

const isScrolled = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
    const header = document.querySelector('header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    class="navbar border-b-2 bg-neutral-50 dark:bg-gray-950 dark:text-white dark:border-gray-700 hover:!opacity-100"
    :class="isScrolled? 'md:mix-blend-multiply md:opacity-90' : ''"
  >
    <ClientOnly>
      <div class="container flex justify-between mx-auto p-0">
        <div class="navbar-start w-1/4 flex justify-between lg:justify-start">
          <div class="dropdown">
            <div
              tabindex="0"
              role="button"
              alt="Menu"
              class="btn btn-ghost xl:hidden h-12"
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
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-52 menu-items"
            >
              <li
                v-if="shoppingCart.objects?.length > 0"
                class="h-12 flex justify-center"
              >
                <button
                  title="Show comparison items"
                  @click="$toggleComparisonDrawerState"
                >
                  {{ $t("shoppingcart") }}
                  <span class="indicator-item badge bg-shopping-cart text-white">
                    {{ shoppingCart.objects?.length }}
                  </span>
                </button>
              </li>
              <li
                v-if="objectListStore.objects?.length > 0"
                class="h-12 flex justify-center"
              >
                <button
                  title="Show comparison items"
                  @click="$toggleComparisonDrawerState"
                >
                  {{ $t("comparison") }}
                  <span class="indicator-item badge bg-compare-list text-white">
                    {{ objectListStore.objects?.length }}
                  </span>
                </button>
              </li>
              <li class="h-12 flex justify-center">
                <GlobalLanguageSwitch />
              </li>
              <li class="h-12 flex justify-center">
                <GlobalThemeSwitch />
              </li>
              <li class="h-12 flex justify-center">
                <a :href="`/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`">{{ $t("filmresearch") }}</a>
              </li>
              <li class="h-12 flex justify-center">
                <a href="/contact">{{ $t("help") }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a
                  href="/protected/dashboard"
                  :alt="$t('dashboard')"
                >{{ $t('dashboard') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a
                  href="/protected/mergetool"
                  :alt="$t('mergeTool')"
                >{{ $t('mergeTool') }}<span class="badge badge-accent text-white">1</span></a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a
                  href="/protected/institutionlist"
                  :alt="$t('myDatasets')"
                >{{ $t('myDatasets') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a
                  href="/protected/favouriteslist"
                  :alt="$t('favourites')"
                >{{ $t('favourites') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a
                  href="/protected/loglist"
                  :alt="$t('logList')"
                >{{ $t('logList') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <a
                  href="/protected/me"
                  :alt="$t('profile')"
                >{{ $t('profile') }}</a>
              </li>
              <li
                v-if="data"
                class="h-12 flex justify-center"
              >
                <button
                  Logout
                  title="logout"
                  @click="signOut()"
                >
                  {{ $t('logout') }}
                </button>
              </li>
            </ul>
          </div>
          <a
            class="btn btn-ghost text-xl dark:bg-gray-700 h-12"
            href="/"
          >
            <img
              src="/img/AV-EFI-Logo.png"
              alt="AVefi Logo"
              width="64"
              height="auto"
            >
          </a>
        </div>
        <div class="navbar-end w-3/4 flex hidden xl:flex">
          <ul class="menu w-full justify-end menu-horizontal items-center justify-self-end px-1 z-20 menu-items">
            <li
              v-if="shoppingCart.objects?.length > 0"
              class="h-12 flex justify-center"
            >
              <button
                title="Show comparison items"
                @click="$toggleComparisonDrawerState"
              >
                {{ $t("shoppingcart") }}
                <span class="indicator-item badge bg-shopping-cart text-white">
                  {{ shoppingCart.objects?.length }}
                </span>
              </button>
            </li>
            <li
              v-if="objectListStore.objects?.length > 0"
              class="h-12 flex justify-center"
            >
              <button
                title="Show comparison items"
                @click="$toggleComparisonDrawerState"
              >
                {{ $t("comparison") }}
                <span class="indicator-item badge bg-compare-list text-white">
                  {{ objectListStore.objects?.length }}
                </span>
              </button>
            </li>
            <li class="h-12 flex justify-center">
              <GlobalLanguageSwitch />
            </li>
            <li class="h-12 flex justify-center">
              <GlobalThemeSwitch />
            </li>
            <li class="h-12 flex justify-center">
              <a :href="`/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`">{{ $t("filmresearch") }}</a>
            </li>
            <li class="h-12 flex justify-center">
              <a href="/contact">{{ $t("help") }}</a>
            </li>
            <li
              v-if="data"
              class="h-12 flex justify-center"
            >
              <details>
                <summary>
                  <div v-if="data?.Avatar != null">
                    <div
                      tabindex="0"
                      role="button"
                      alt="This is you"
                      class="avatar"
                    >
                      <div class="w-10 rounded-full" />
                    </div>
                  </div>
                  <div v-else>
                    Hello {{ data?.user?.name }}
                  </div>
                </summary>
                <ul class="p-2 dark:bg-gray-800 menu-items">
                  <li class="h-12 flex justify-center">
                    <a
                      href="/protected/dashboard"
                      :alt="$t('dashboard')"
                    >{{ $t('dashboard') }}</a>
                  </li>
                  <li class="h-12 flex justify-center">
                    <a
                      href="/protected/mergetool"
                      :alt="$t('mergeTool')"
                    >{{ $t('mergeTool') }}<span class="badge badge-accent text-white">1</span></a>
                  </li>
                  <li class="h-12 flex justify-center">
                    <a
                      href="/protected/institutionlist"
                      :alt="$t('myDatasets')"
                    >{{ $t('myDatasets') }}</a>
                  </li>
                  <li class="h-12 flex justify-center">
                    <a
                      href="/protected/favouriteslist"
                      :alt="$t('favourites')"
                    >{{ $t('favourites') }}</a>
                  </li>
                  <li class="h-12 flex justify-center">
                    <a
                      href="/protected/loglist"
                      :alt="$t('logList')"
                    >{{ $t('logList') }}</a>
                  </li>
                  <li class="h-12 flex justify-center">
                    <a
                      href="/protected/me"
                      :alt="$t('profile')"
                    >{{ $t('profile') }}</a>
                  </li>
                  <li class="h-12 flex justify-center">
                    <button
                      Logout
                      title="logout"
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
              <Icon
                name="fa-regular:user"
                size="1.2em"
                alt="Login"
                @click="signIn('keycloak')"
              />
            </li>
          </ul>
          <div class="dropdown dropdown-end inline-flex md:hidden">
            <div
              tabindex="0"
              role="button"
              title="This is you"
              class="btn btn-ghost btn-circle avatar h-12"
            >
              <div class="w-10 rounded-full">
                <Icon
                  name="fa-regular:user"
                  size="1.2em"
                  alt="Login"
                  @click="signIn('keycloak')"
                />
              </div>
              <ClientOnly>
                <button 
                  class="btn btn-outline w-1/2 h-12"
                  @click="toggleComparisonDrawerState"
                >
                  <MicroCompareIcon alt="Comparison" />
                </button>
              </ClientOnly>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-52 menu-items"
            >
              <li class="h-12 flex justify-center">
                <a class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </a>
              </li>
              <li class="h-12 flex justify-center">
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ClientOnly>
  </nav>
</template>

<style scoped>
.menu-items li {
  height: 3rem; /* Adjust the height as needed */
}
</style>
