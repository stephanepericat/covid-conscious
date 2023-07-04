<template>
  <div class="disclaimer-page" :class="{ pending }">
    <ILoader v-if="pending" class="disclaimer-page__loader" />
    <template v-else>
      <h1 class="disclaimer-page__title" v-text="data.title" />
      <em class="disclaimer-page__update">
        {{ $t('disclaimer.updated') }}: {{ format(new Date(data.updated), DEFAULT_DATE_FORMAT) }}
      </em>
      <section>
        <h2 v-text="$t('disclaimer.website')" />
        <SanityContent :blocks="data.website" />
      </section>
      <section>
        <h2 v-text="$t('disclaimer.links')" />
        <SanityContent :blocks="data.links" />
      </section>
      <section>
        <h2 v-text="$t('disclaimer.professional')" />
        <SanityContent :blocks="data.professional" />
      </section>
      <section>
        <h2 v-text="$t('disclaimer.testimonials')" />
        <SanityContent :blocks="data.testimonials" />
      </section>
    </template>
  </div>
</template>
<script setup>
  import { format } from "date-fns";
  import disclaimerQuery from "~/sanity/disclaimer.sanity";
  import { DEFAULT_DATE_FORMAT } from "~/assets/constants/date-formats";

  const { locale } = useI18n();

  const { data, pending } = useLazySanityQuery(disclaimerQuery, { locale });
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

  &__update {
    display: block;
    margin-bottom: 40px;
  }
}
</style>