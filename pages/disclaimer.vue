<template>
  <div class="disclaimer-page" :class="{ pending }">
    <ILoader v-if="pending" class="disclaimer-page__loader" />
    <template v-else>
      <h1 class="disclaimer-page__title">
        {{ policy[0].title }}
      </h1>
      
      <div class="disclaimer-page__contents">
        <SanityContent :blocks="policy[0].contents" :serializers="serializers" />
      </div>
    </template>
  </div>
</template>
<script setup>
  import policyQuery from '~/sanity/queries/policy.sanity'
  import { serializers } from '~/assets/constants/serializers'

  const { locale } = useI18n()
  const { data: policy, pending } = useLazySanityQuery(policyQuery, { locale, policyType: "Disclaimer" })

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.disclaimer-page {
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