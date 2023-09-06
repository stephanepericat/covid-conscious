<template>
  <div class="privacy-policy-page" :class="{ pending }">
    <h1 class="privacy-policy-page__title">
      {{ policy[0].title }}
    </h1>
    <ILoader v-if="pending" class="privacy-policy__loader" />
    <div class="privacy-policy-page__contents">
      <SanityContent :blocks="policy[0].contents" />
    </div>
  </div>
</template>
<script setup>
  import policyQuery from '~/sanity/poiicy.sanity'

  const { locale } = useI18n()
  const { data: policy, pending } = useLazySanityQuery(policyQuery, { locale, policyType: "Privacy Policy" })

</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.privacy-policy-page {
  &.pending {
    @include pending();
  }

  &__loader {
    @include loader();
  }

  &__title {
    @include title();
  }
}
</style>