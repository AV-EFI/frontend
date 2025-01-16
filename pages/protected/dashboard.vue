<template>
  <div class="container mx-auto p-4">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('Dashboard'), `/protected/dashboard`],
      ]"
    />
    <div class="mt-4">
      <NuxtLayout name="partial-layout-1-center">
        <template #title>
          <h2 class="font-semibold">
            {{ authData?.user?.name }} | {{ authData?.user?.institution }}
          </h2>
          <div class="stats shadow mt-4">
            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="stat-title">
                {{ $t('workvariants') }}
              </div>
              <div class="stat-value">
                <MicroESCountComp
                  :category="'avefi:WorkVariant'"
                  :query_term="`${authData?.user?.institution}`"
                />
              </div>
            </div>

            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div class="stat-title">
                {{ $t('manifestations') }}
              </div>
              <div class="stat-value">
                <MicroESCountComp
                  :category="'avefi:Manifestation'"
                  :query_term="`${authData?.user?.institution}`"
                />
              </div>            
            </div>

            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div class="stat-title">
                {{ $t('items') }}
              </div>
              <div class="stat-value">
                <MicroESCountComp
                  :category="'avefi:Item'"
                  :query_term="`${authData?.user?.institution}`"
                />
              </div>
            </div>
          </div>
        </template>
        <template #cardBody>
          <ul class="menu bg-base-100 w-56 p-2 rounded-box mt-4">
            <li>
              <a
                href="/protected/mergetool"
                class="hover:bg-base-200 link link-primary"
              >{{ $t('mergeTool') }}<span class="badge badge-accent text-white">1</span></a>
            </li>
            <li>
              <a
                href="/protected/institutionlist"
                class="hover:bg-base-200 link link-primary"
              >{{ $t('myDatasets') }}</a>
            </li>
            <li>
              <a
                href="/protected/favouriteslist"
                class="hover:bg-base-200 link link-primary"
              >{{ $t('favourites') }}</a>
            </li>
            <li>
              <a
                href="/protected/loglist"
                class="hover:bg-base-200 link link-primary"
              >{{ $t('logList') }}</a>
            </li>
          </ul>
        </template>
      </NuxtLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
</script>