<template>
  <!-- has_event -->
  <div class="grid col-span-full grid-cols-12 gap-2">
    <!--left-->
    <div class="grid col-span-full md:col-span-8 grid-cols-12 gap-2">
      <div class="col-span-full md:col-span-12">
        <div class="grid col-span-8 grid-cols-12 gap-x-2 gap-y-1 md:p-4">
          <slot name="left" />
        </div>
      </div>
    </div>

    <!--right-->
    <div class="grid col-span-full md:col-span-4 gap-x-2 gap-y-1">
      <div class="col-span-full md:col-span-12">
        <div class="grid col-span-8 grid-cols-12 gap-x-2 gap-y-1 md:p-4">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>