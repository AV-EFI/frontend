<script setup lang="ts">

const { locale } = useI18n();
definePageMeta(
    { 
        auth: false 
    }
);

const skeletonSwitch = ref(false);

setTimeout(() => {
    skeletonSwitch.value = true;
},
2000);


const { data: sessionData } = useAuthState();

</script>

<template>
  <div class="container flex justify-items flex-col lg:flex-row w-full mx-auto">
    <div class="flex flex-col lg:flex-row container mx-auto p-4">
      <div class="lg:w-3/4">
        <div class="hero min-h-96 bg-base-100">
          <div class="hero-content flex-col lg:flex-row-reverse">          
            <div class="card shrink-0 w-full max-w-full bg-primary-100 dark:bg-primary-900 shadow-2xl">
              <div class="card-body">
                <GlobalSearchComp />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider lg:divider-horizontal">
        OR
      </div>      
      <div class="text-center lg:text-left lg:w-1/4">
        <article class="prose">
          <h2 class="">
            Welcome to the AVefi homepage
          </h2>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
          <GlobalAccessDenied v-if="!sessionData" />
        </article>
      </div>
    </div>
  </div>
</template>