<template>
  <div class="privacy-policy-page" :class="{ pending }">
    <ILoader v-if="pending" class="privacy-policy-page__loader" />
    <template v-else>
      <h1 class="privacy-policy-page__title">
        {{ policy[0].title }}
      </h1>

      <div class="privacy-policy-page__contents">
        <SanityContent
          :blocks="policy[0].contents"
          :serializers="serializers"
        />
      </div>
    </template>
  </div>
</template>
<script setup>
import policyQuery from '~/sanity/queries/policy.sanity'
import { serializers } from '~/assets/constants/serializers'

const { locale } = useI18n()
const { data: policy, pending } = useLazySanityQuery(policyQuery, {
  locale,
  policyType: 'Privacy Policy',
})

umTrackView()
</script>
<style lang="scss" scoped>
@import '~/assets/sass/mixins.scss';

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
