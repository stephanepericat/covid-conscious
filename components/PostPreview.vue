<template>
  <div class="post-preview">
    <IMedia>
      <template v-if="!hideThumbnail" #image>
        <div class="post-preview__thumbnail--fallback">
        <ClientOnly>
          <img
            v-if="post.avatar"
            class="post-preview__thumbnail"
            :src="post.avatar"
          >
        </ClientOnly>
        <img v-if="!post.avatar || ssr" class="post-preview__thumbnail" src="/tcl-logo-big-grey.jpeg" />
      </div>
      </template>
      <h4 class="post-preview__link">
        <NuxtLink :to="localePath(`${rootPath}/${POST}/${post.id}`)">{{ post.headline }}</NuxtLink>
      </h4>
      <p class="post-preview__description">{{ cleanPostBody(post.body) }}</p>
      <em>
        <IBadge class="post-preview__forum-tag" size="sm">{{ $t(`forum.create.categories.${post.topic}`) }}</IBadge>
        <span> &bullet; <NuxtLink :to="localePath(`${rootPath}/${USER}/${post.profiles.id}`)">{{ post.profiles.username }}</NuxtLink></span>
        <span> &bullet; {{ format(new Date(post.created_at), DEFAULT_DATE_FORMAT) }}</span>
      </em>
    </IMedia>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { POST, USER } from '~/assets/constants/types'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { cleanPostBody } from '~/assets/utils/clean-post-body'

  const props = defineProps({
    hideThumbnail: Boolean,
    post: { type: Object, required: true },
    rootPath: { type: String, required: true },
    ssr: Boolean,
  })
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.post-preview {
  &__description {
    margin: 0;
  }
  
  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__forum-tag {
    font-style: normal;
  }
}
</style>