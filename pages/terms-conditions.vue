<template>
  <div class="terms-conditions-page" :class="{ pending }">
    <ILoader v-if="pending" class="terms-conditions-page__loader" />
    <template v-else>
      <h1 class="terms-conditions-page__title">
        {{ policy[0].title }}
      </h1>
      
      <div class="terms-conditions-page__contents">
        <SanityContent :blocks="policy[0].contents" />
      </div>
    </template>
  </div>
</template>
<script setup>
  import policyQuery from '~/sanity/policy.sanity'

  const { locale } = useI18n()
  const { data: policy, pending } = useLazySanityQuery(policyQuery, { locale, policyType: "Terms & Conditions" })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.terms-conditions-page {
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