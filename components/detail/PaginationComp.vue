<template>
  <div
    class="pagination px-2 flex justify-center w-full bg-white dark:bg-slate-800"
    role="navigation"
    :aria-label="$t('pagination')"
  >
    <ais-pagination
      :class-names="{
        'ais-Pagination': 'flex my-2 bg-white dark:bg-slate-800',
        'ais-Pagination-list': 'flex space-x-1 my-1',
        'ais-Pagination-item': 'btn btn-sm btn-circle btn-primary text-white btn-outline hover:text-white text-center',
        'ais-Pagination-link': 'text-center vertical-align-middle text-[12px]',
        'ais-Pagination-item--selected': 'btn btn-sm btn-circle btn-primary !text-white'
      }"
    />
  </div>
</template>