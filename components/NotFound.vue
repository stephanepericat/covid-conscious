<template>
  <div class="not-found">
    <Icon class="not-found__icon" name="iconoir:file-not-found" />
    <h1 class="not-found__title" v-text="$t('notFound.title')" />
    <h3 v-text="$t('notFound.description', { category })" />
  </div>
</template>
<script setup>
  defineProps({
    category: { type: String, required: true },
  });
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    @include title();
  }

  &__icon {
    height: 80px;
    margin-bottom: 50px;
    opacity: .4;
    width: 80px;
  }
}
</style>