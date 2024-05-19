<template>
  <div class="mobile-page">
    <section class="mobile-page__main">
      <div class="mobile-page__main--text">
        <h1 class="mobile-page__main--title">
          All your Covid-19 information.<br />
          In one place.
        </h1>
        <div class="mobile-page__main--links">
          <NuxtLink :to="`https://play.google.com/store/apps/details?id=com.shortwavlabs.tclmobile&hl=${locale}`" target="_blank">
            <NuxtImg
              :src="googlePlayBtn"
              class="mobile-page__main--button android"
              :class="locale"
            />
          </NuxtLink>
          <span>* Available soon on iOS</span>
        </div>
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
  const { locale } = useI18n()

  const googlePlayBtn = computed(() => `/google-play-badge-${locale.value}.png`)
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
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &--links {
      display: flex;
      align-items: center;
    }

    &--button {
      height: 60px;
      
      &.android {
        margin-bottom: 5px;
        margin-right: 12px;
        margin-top: 5px;

        &.en {
          height: 69px;
          margin-bottom: 0;
          margin-left: -12px;
          margin-right: 0;
          margin-top: 0;
        }
      }
    }

    &--visual {
      width: 100%;
    }
  }
}
</style>