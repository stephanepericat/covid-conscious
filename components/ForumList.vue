<template>
  <div class="forum-list">
    <IListGroup size="sm" :border="false">
      <IListGroupItem v-for="post in posts" :key="post.id">
        <PostPreview
          :hide-thumbnail="hideThumbnail"
          :post="post"
          :root-path="rootPath"
          :ssr="ssr"
        />
      </IListGroupItem>
    </IListGroup>
  </div>
</template>
<script setup>
  import PostPreview from '~/components/PostPreview.vue'

  const props = defineProps({
    hideThumbnail: Boolean,
    posts: { type: Array, default: [] },
    rootPath: { type: String, required: true },
    ssr: Boolean,
  })
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.forum-list {
  &__description {
    &.no-margin {
      margin: 0;
    }
  }

  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__pagination {
    @include pagination();
  }

  &__metadata {
    display: block;
    margin-top: 5px;
  }

  &__tags {
    display: inline;
    list-style: none;
    margin: 0;
    padding: 0;

    &--item {
      cursor: pointer;
      display: inline-block;
      font-style: normal;
      margin-right: 5px;

      &:last-of-type {
        margin-right: 1px;
      }
    }
  }

  &__forum-tag {
    font-style: normal;
  }
}
</style>