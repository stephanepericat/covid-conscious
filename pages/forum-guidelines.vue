<template>
  <div class="forum-guidelines-page">
    <ILoader v-if="pending" class="forum-guidelines-page__loader" />
    <template v-else>
      <h1 class="forum-guidelines-page__title">
        {{ policy[0].title }}
      </h1>
      
      <div class="forum-guidelines-page__contents">
        <SanityContent :blocks="policy[0].contents" :serializers="serializers" />
      </div>
    </template>
  </div>
</template>
<script setup>
  import policyQuery from '~/sanity/policy.sanity'
  import { serializers } from '~/assets/constants/serializers'

  const { locale } = useI18n()
  const { data: policy, pending } = useLazySanityQuery(policyQuery, { locale, policyType: "Forum Guidelines" })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.forum-guidelines-page {
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