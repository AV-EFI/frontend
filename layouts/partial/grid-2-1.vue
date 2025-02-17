<template>
  <!-- has_event -->
  <div class="grid col-span-full grid-cols-12">
    <div class="col-span-full">
      <h5 class="text-sm font-bold uppercase text-primary-800 tracking-wide dark:text-primary-100">
        <slot name="heading" />
      </h5>
    </div>

    <!--left-->
    <div class="grid col-span-full md:col-span-8 grid-cols-12 gap-2">
      <div class="col-span-full md:col-span-12">
        <div class="grid col-span-8 grid-cols-12 gap-2">
          <slot name="left">
            <div class="dark:text-white">
              Left
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!--right-->
    <div class="grid col-span-full md:col-span-4">
      <div class="flex flex-col dark:text-white">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>