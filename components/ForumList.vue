<template>
  <div class="forum-list">
    <IListGroup size="sm" :border="false">
      <IListGroupItem v-for="post in posts">
        <IMedia>
          <template v-if="!hideThumbnail" #image>
            <div class="forum-list__thumbnail--fallback">
            <ClientOnly>
              <img
                v-if="post.avatar"
                class="forum-list__thumbnail"
                :src="post.avatar"
              >
            </ClientOnly>
            <Icon v-if="!post.avatar || ssr" class="forum-list__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
          </div>
          </template>
          <h4 class="forum-list__link">
            <NuxtLink :to="localePath(`${rootPath}/${POST}/${post.id}`)">{{ post.headline }}</NuxtLink>
          </h4>
          <em>
            <IBadge class="forum-list__forum-tag" size="sm">{{ $t(`forum.create.categories.${post.topic}`) }}</IBadge>
            <span> &bullet; <NuxtLink :to="localePath(`${rootPath}/${USER}/${post.profiles.id}`)">{{ post.profiles.username }}</NuxtLink></span>
            <span> &bullet; {{ format(new Date(post.created_at), DEFAULT_DATE_FORMAT) }}</span>
          </em>
        </IMedia>
      </IListGroupItem>
    </IListGroup>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { POST, USER } from '~/assets/constants/types'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'

  const props = defineProps({
    hideThumbnail: Boolean,
    posts: { type: Array, default: [] },
    rootPath: { type: String, required: true },
    ssr: Boolean,
  })

  const localePath = useLocalePath()
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

  &__avatar,
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