<template>
  <div class="privacy-policy-page">
    <h1 class="privacy-policy-page__title">
      {{ $t('layout.privacyPolicy') }}
    </h1>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.privacy-policy-page {
  &__title {
    @include title();
  }
}
</style>