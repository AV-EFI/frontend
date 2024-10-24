<script setup lang="ts">

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


//const { data: sessionData } = useAuthState();
const sessionData = null;

</script>

<template>
  <div class="container flex justify-items flex-col lg:flex-row w-full mx-auto">
    <div class="flex flex-col lg:flex-row container mx-auto p-4">
      <div class="w-full lg:w-3/4">
        <div class="hero-content min-h-48 w-full flex-col lg:flex-row-reverse">          
          <div class="card shrink-0 w-full">
            <div class="card-body p-2 md:p-4 w-full">
              <GlobalSearchCompReduced />
            </div>
          </div>
        </div>
      </div>
      <div class="divider lg:divider-horizontal divider-neutral" />      
      <div class="text-center lg:text-left w-full lg:w-1/4 md:ml-4">
        <article class="">
          <h2 class="text-xl">
            {{ $t('welcomeheading') }}
          </h2>
        </article>
      </div>
    </div>
  </div>
</template>