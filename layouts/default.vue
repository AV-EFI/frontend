<template>
  <div class="flex flex-col min-h-screen">
    <header
      :class="{'scrolled': isScrolled}"
      class="fixed top-0 left-0 w-full z-20"
    >
      <GlobalNavBar />
    </header>
    <main class="main grow bg-neutral dark:bg-slate-950 2xl:px-6 mt-[var(--header-height)]">
      <ClientOnly>
        <!--GlobalIndicatorComp /-->
      </ClientOnly>
      <slot />
      <GlobalComparisonDrawer />
    </main>
    <footer class="dark:bg-slate-800">
      <LazyGlobalFooter />
    </footer>
    <button
      v-if="showScrollToTop"
      class="fixed bottom-20 right-[20px] p-2 bg-secondary-400 h-[40px] w-[40px] text-white rounded-full"
      :title="$t('scrollToTop')"
      @click="scrollToTop"
    >
      <Icon
        name="heroicons:chevron-up"
        class="text-lg"
      />
    </button>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isScrolled: false,
            showScrollToTop: false
        };
    },
    mounted() {
        const header = document.querySelector('header');
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

        window.addEventListener('scroll', this.handleScroll);
        this.checkPageHeight();
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
            this.showScrollToTop = window.scrollY > window.innerHeight * 3;
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        checkPageHeight() {
            this.showScrollToTop = document.documentElement.scrollHeight > window.innerHeight * 3;
        }
    }
};
</script>
