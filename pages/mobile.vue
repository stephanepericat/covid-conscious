<template>
  <div class="mobile-page">
    <section class="mobile-page__main">
      <div class="mobile-page__main--text">
        <h1 class="mobile-page__main--title">Text Goes Here</h1>
      </div>
      <div>
        <NuxtImg
          class="mobile-page__main--visual"
          src="/app-promo-transparent.png"
        />
      </div>
    </section>
  </div>
</template>
<script setup>
  // import { useInkline } from '@inkline/inkline'

  // const inkline = useInkline()
  // const visual = computed(() => `/app-promo-${inkline.options.colorMode}.png`)          
</script>
<style lang="scss">
@import "~/assets/sass/mixins.scss";
@import '@inkline/inkline/css/mixins';

.mobile-page {
  &__main {
    display: grid;
    grid-template-columns: 67% auto;
    gap: 2rem;

    &--title {
      @include title();
    }

    &--text {
      background: #ccc;
      display: flex;
      align-items: center;
    }

    &--visual {
      width: 100%;
    }
  }
}
</style>