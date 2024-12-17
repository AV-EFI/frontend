<script setup lang="ts">

definePageMeta({
    auth: false
});

</script>
<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('dataprotection'), '/dataprotection'],
      ]"
    />

    <div class="container">
      <article class="container flex justify-center">
        <div
          id="c7273"
          class="frame frame-default frame-type-text frame-layout-0 w-2/3 text-balance text-justify"
        >
          <div class="card">
            <div class="card-body">
              <h2 class="card-title font-">
                {{ $t('dataprotection') }}
              </h2>
              <iframe
                src="https://datenschutz.gwdg.de/services/av-efi"
                width="100%"
                height="800"
                style="border:none;"
              />
            </div>
          </div>          
        </div>
      </article>
    </div>
  </div>
</template>