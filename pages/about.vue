<template>
  <div class="about-page">
    <h1 class="about-page__title">{{ $t('layout.about') }}</h1>
    <p>{{ $t('comingSoon') }}</p>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.about-page {
  &__title {
    @include title();
  }
}
</style>