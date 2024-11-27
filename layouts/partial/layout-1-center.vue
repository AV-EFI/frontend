<template>
  <section>
    <div class="w-full lg:w-3/4 mx-auto card card-side bg-white dark:bg-gray-900 shadow-xl">
      <div class="card-body max-w-full">
        <div class="w-full flex flex-row items-center">
          <slot name="actions">
            no actions available
          </slot>
        </div>        
        <slot name="title" />
        <slot name="cardBody">
          Card content
        </slot>
      </div>
    </div>
  </section>
</template>