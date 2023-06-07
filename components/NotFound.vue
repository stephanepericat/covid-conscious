<template>
  <div class="not-found">
    <Icon class="not-found__icon" name="iconoir:file-not-found" />
    <h1 v-text="$t('notFound.title')" />
    <h3 v-text="$t('notFound.description', { category })" />
  </div>
</template>
<script setup>
  defineProps({
    category: { type: String, required: true },
  });
</script>
<style lang="scss" scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__icon {
      height: 80px;
      margin-bottom: 50px;
      opacity: .4;
      width: 80px;
    }
  }
</style>