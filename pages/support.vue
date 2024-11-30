<template>
  <div class="support-page">
    <div class="support-page__form">
      <h1 class="support-page__title" v-text="$t('support.pageTitle')" />
      <p class="support-page__description" v-text="$t('support.description')" />
      <iframe
        title="Feedback Form"
        class="freshwidget-embedded-form"
        id="freshwidget-embedded-form"
        src="https://thatcovidlife.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&formTitle=&searchArea=no"
        scrolling="no"
        height="800px"
        width="100%"
        frameborder="0"
      >
      </iframe>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
@import '~/assets/sass/mixins.scss';

.support-page {
  &__title {
    @include title();
  }

  &__form {
    margin: 0 auto;
    max-width: 40rem;
  }
}
</style>
