<template>
  <div class="card">card</div>
</template>
<script setup>

</script>
<style lang="scss">
@import "~/assets/sass/mixins.scss";

.card {
  @include lightBg();
}

.dark-theme {
  .card {
    @include darkBg();
  }
}
</style>