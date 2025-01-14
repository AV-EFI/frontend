<script setup lag="ts">

const {
    data,
    signOut,
    signIn
} = useAuth();

//const data = null;

const triggerSignout = () => {
    signOut({callbackUrl: '/', external:true});
};
import {useObjectListStore} from '../../stores/compareList';
import { useShoppingCart } from '../../stores/shoppingCart';

const objectListStore = useObjectListStore();
const shoppingCart = useShoppingCart();

//console.log(data.value);
</script>

<template>
  <nav class="md:h-full navbar border-b-2 bg-neutral-50 dark:bg-gray-800 dark:text-white dark:border-gray-700">
    <ClientOnly>
      <div class="container flex justify-between mx-auto p-0">
        <div class="navbar-start w-1/4 flex justify-between lg:justify-start">
          <div class="dropdown">
            <div
              tabindex="0"
              role="button"
              alt="Menu"
              class="btn btn-ghost xl:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              /></svg>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <div v-if="data">
                  <div v-if="data?.Avatar">
                    <div
                      tabindex="0"
                      role="button"
                      alt="This is you"
                      class="btn btn-ghost btn-circle avatar"
                    >
                      <div class="w-10 rounded-full" />
                    </div>
                  </div>
                  <div v-else-if="data?.user?.name">
                    {{ $t("hello") }} {{ data?.user?.name }}
                  </div>              
                </div>
                <div v-else>
                  <Icon
                    name="fa-regular:user"
                    size="1.2em"
                    alt="Login"
                    @click="signIn('keycloak')"
                  />
                </div>
              </li>
              <li>
                <a 
                  :href="`/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`"
                >
                  {{ $t("filmresearch") }}
                </a>
              </li>
              <li v-if="objectListStore.objects?.length > 0">
                <ClientOnly>
                  <button
                    title="Show comparison items"
                    @click="$toggleComparisonDrawerState"
                  >
                    {{ $t("comparison") }}
                    <span class="indicator-item badge badge-secondary text-white">
                      {{ objectListStore.objects?.length }}
                    </span>
                  </button>
                </ClientOnly>
              </li>
              <li v-if="shoppingCart.objects?.length > 0">
                <ClientOnly>
                  <button
                    title="Show shoppingCart items"
                    @click="$toggleComparisonDrawerState"
                  >
                    {{ $t("comparison") }}
                    <span class="indicator-item badge badge-secondary text-white">
                      {{ shoppingCart.objects?.length }}
                    </span>
                  </button>
                </ClientOnly>
              </li>
              <li><a href="/contact">{{ $t("help") }}</a></li>
            </ul>
          </div>
          <a
            class="btn btn-ghost text-xl dark:bg-gray-700 "
            href="/"
          >
            <img
              src="/img/AV-EFI-Logo.png"
              alt="AVefi Logo"
              width="64"
              height="auto"
            ></a>
        </div>
        <div class="navbar-end w-3/4 flex hidden xl:flex">
          <ul class="menu w-full justify-end menu-horizontal items-center mb-2 justify-self-end px-1 z-20">
            <li v-if="shoppingCart.objects?.length > 0">
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
            <li v-if="objectListStore.objects?.length > 0">
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
            <li>
              <a :href="`/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`">{{ $t("filmresearch") }}</a>
            </li>
            <li><a href="/contact">{{ $t("help") }}</a></li>
            <li v-if="data">
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
                <ul class="p-2">
                  <li>
                    <a
                      href="/protected/dashboard"
                      :alt="$t('dashboard')"
                    >{{ $t('dashboard') }}</a>
                  </li>
                  <li>
                    <a
                      href="/protected/mergetool"
                      :alt="$t('mergeTool')"
                    >{{ $t('mergeTool') }}<span class="badge badge-accent text-white">1</span></a>
                  </li>
                  <li>
                    <a
                      href="/protected/institutionlist"
                      :alt="$t('myDatasets')"
                    >{{ $t('myDatasets') }}</a>
                  </li>
                  <li>
                    <a
                      href="/protected/favouriteslist"
                      :alt="$t('favourites')"
                    >{{ $t('favourites') }}</a>
                  </li>
                  <li>
                    <a
                      href="/protected/me"
                      :alt="$t('profile')"
                    >{{ $t('profile') }}</a>
                  </li>
                  <li>
                    <button
                      Logout
                      title="Logout"
                      @click="signOut()"
                    >
                      {{ $t('Logout') }}
                    </button>
                  </li>
                </ul>
              </details>
            </li>
            <li v-else>
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
              class="btn btn-ghost btn-circle avatar"
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
                  class="btn btn-outline w-1/2"
                  @click="toggleComparisonDrawerState"
                >
                  <MicroCompareIcon alt="Comparison" />
                </button>
              </ClientOnly>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </ClientOnly>
  </nav>
</template>
