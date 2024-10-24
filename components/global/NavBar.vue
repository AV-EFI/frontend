<script setup lag="ts">

/*
const {
    data,
    signOut
} = useAuth();
*/
const data = null;

const triggerSignout = () => {
    signOut({callbackUrl: '/', external:true});
};
import {useObjectListStore} from '../../stores/compareList';

const objectListStore = useObjectListStore();

//console.log(data.value);
</script>

<template>
  <nav class="h-24 md:h-full navbar border-b-2 bg-neutral-50 dark:bg-gray-800 dark:text-white dark:border-gray-700">
    <ClientOnly>
      <div class="container flex justify-between mx-auto">
        <div class="navbar-start w-full flex justify-between lg:justify-start">
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
                      <div class="w-10 rounded-full">
                        <NuxtImg
                          provider="strapi"
                          :src="data.Avatar"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else-if="data?.username">
                    {{ $t("hello") }} {{ data.username }}
                  </div>              
                </div>
                <div v-else>
                  <a href="/login"><Icon
                    name="fa-regular:user"
                    size="1.2em"
                    alt="Login"
                  />
                  </a>
                </div>
              </li>
              <li>
                <a href="/search_altern">
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
              <li v-if="data?.username">
                <a href="/protected/filmident">
                  {{ $t("filmidentification") }}
                </a>
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
        <div class="navbar-end flex hidden xl:flex">
          <ul class="menu menu-horizontal items-center mb-2 justify-self-end px-1">
            <li v-if="objectListStore.objects?.length > 0">
              <button
                title="Show comparison items"
                @click="$toggleComparisonDrawerState"
              >
                {{ $t("comparison") }}
                <span class="indicator-item badge badge-secondary text-white">
                  {{ objectListStore.objects?.length }}
                </span>
              </button>
            </li>
            <li>
              <a href="/search_altern">{{ $t("filmresearch") }}</a>
            </li>
            <li v-if="data?.username">
              <a href="/protected/filmident">{{ $t("filmidentification") }}
              </a>
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
                      <div class="w-10 rounded-full">
                        <NuxtImg
                          provider="strapi"
                          :src="data.Avatar"
                          :alt="data.username"                  
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    Hello {{ data?.username }}
                  </div>
                </summary>
                <ul class="p-2">
                  <li>
                    <a
                      href="/protected/me"
                      alt="Profil"
                    >Profil</a>
                  </li>
                  <li>
                    <button
                      Logout
                      title="Logout"
                      @click="triggerSignout()"
                    >
                      Abmelden
                    </button>
                  </li>
                </ul>
              </details>
            </li>
            <li v-else>
              <a href="/login"><Icon
                name="fa-regular:user"
                size="1.2em"
                alt="Login"
              />
              </a>
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
                <a
                  alt="Zur Anmeldung"
                  href="/login"
                ><Icon
                  name="fa-regular:user"
                  size="1.2em"
                  alt="Login"
                />
                </a>
              </div>
              <ClientOnly>
                <button 
                  class="btn btn-outline w-1/2"
                  @click="toggleComparisonDrawerState"
                >
                  <CompareIcon alt="Comparison" />
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
