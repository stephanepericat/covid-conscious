<template>
  <div class="mobile-page">
    <section class="mobile-page__main">
      <div class="mobile-page__main--text">
        <h1 class="mobile-page__main--title">
          <span v-text="$t('mobile.header')" /><br />
          <span class="subheader" v-text="$t('mobile.subheader')" />
        </h1>
        <div class="mobile-page__main--links">
          <NuxtLink :to="ANDROID_URL" target="_blank">
            <NuxtImg
              :src="googlePlayBtn"
              class="mobile-page__main--button android"
              :class="locale"
            />
          </NuxtLink>
          <NuxtLink :to="IOS_URL" target="_blank">
            <NuxtImg
              :src="appleStoreBtn"
              class="mobile-page__main--button ios"
              :class="locale"
            />
          </NuxtLink>
        </div>
      </div>
      <div>
        <NuxtImg
          class="mobile-page__main--visual"
          src="/app-promo-transparent.png"
        />
      </div>
    </section>
    <section class="mobile-page__details">
      <div class="mobile-page__details--section">
        <h3 v-text="$t('mobile.details.informed.title')" />
        <p v-text="$t('mobile.details.informed.description')" />
      </div>
      <div class="mobile-page__details--section">
        <h3 v-text="$t('mobile.details.archive.title')" />
        <p v-text="$t('mobile.details.archive.description')" />
      </div>
      <div class="mobile-page__details--section">
        <h3 v-text="$t('mobile.details.contribute.title')" />
        <p v-text="$t('mobile.details.contribute.description')" />
      </div>
    </section>
  </div>
</template>
<script setup>
import { useMobileButtons } from '~/assets/composables/useMobileButtons'

const { locale } = useI18n()
const { ANDROID_URL, IOS_URL, appleStoreBtn, googlePlayBtn } =
  useMobileButtons()
</script>
<style lang="scss">
@import '~/assets/sass/mixins.scss';
@import '@inkline/inkline/css/mixins';

.mobile-page {
  &__main {
    display: grid;
    grid-template-columns: 67% auto;
    gap: 2rem;

    &--title {
      @include title();

      .subheader {
        color: var(--color-primary-500);
      }
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
        height: 63px;
        margin-right: 12px;

        &.es {
          height: 62px;
        }
      }

      &.ios {
      }
    }

    &--visual {
      width: 100%;
    }
  }

  &__details {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(3, 1fr);
    margin: 40px 0;
  }

  @include breakpoint-down('md') {
    &__details {
      grid-template-columns: auto;
    }
  }

  @include breakpoint-down('sm') {
    &__main {
      grid-template-columns: auto;

      &--links {
        flex-direction: column;
      }

      &--title {
        text-align: center;
      }

      .android {
        margin-bottom: 20px;
        margin-right: 0;
        margin-top: 8px;
      }
    }

    &__details {
      &--section {
        text-align: center;
      }
    }
  }

  @include breakpoint-down('xs') {
    &__main {
      &--title {
        font-size: 36px;
      }
    }
  }
}
</style>
