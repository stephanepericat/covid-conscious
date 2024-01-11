<template>
  <div class="author-page">
    <h1 class="author-page__title">{{ $t('comingSoon') }}</h1>
    <a href="#" @click="() => router.go(-1)">
      &laquo;
      {{ $t('forum.account.back') }}
    </a>
  </div>
</template>
<script setup>
  const router = useRouter()

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.author-page {
  &__title {
    @include title();
  }
}
</style>