<template>
  <div class="post-preview">
    <IMedia>
      <template v-if="!hideThumbnail" #image>
        <div class="post-preview__thumbnail--fallback">
          <ClientOnly>
            <img
              v-if="post.thumbnail"
              class="post-preview__thumbnail"
              :src="post.thumbnail"
            />
          </ClientOnly>
          <img
            v-if="!post.thumbnail || ssr"
            class="post-preview__thumbnail"
            src="/tcl-logo-big-grey.jpeg"
          />
        </div>
      </template>
      <h4 class="post-preview__link">
        <NuxtLink :to="localePath(`${rootPath}/${POST}/${post.id}`)">{{
          post.title
        }}</NuxtLink>
      </h4>
      <p class="post-preview__description text-xs" v-if="withPreview">
        {{ cleanPostBody(post.description) }}
      </p>
      <em class="post-preview__metadata">
        <!-- <IBadge class="post-preview__forum-tag" size="sm">{{ $t(`forum.create.categories.${post.topic}`) }}</IBadge> -->
        <!-- TODO: make forum topic clickable -->
        <IBadge
          class="post-preview__forum-tag"
          size="sm"
          v-for="tag in post.tags"
          :key="tag.id"
          >{{ $t(`forum.create.categories.${tag.name}`) }}</IBadge
        >
        <span>
          &bullet;
          <NuxtLink
            class="post-preview__forum-author"
            :to="localePath(`${rootPath}/${USER}/${post.author.id}`)"
            >@{{ post.author.username || 'USER' }}</NuxtLink
          ></span
        >
        <span class="post-preview__forum-date">
          &bullet;
          {{
            format(new Date(post.published), LOCALIZED_DATE_FORMAT, {
              locale: getDateLocale(locale),
            })
          }}</span
        >
      </em>
    </IMedia>
  </div>
</template>
<script setup>
import { format } from 'date-fns'
import { POST, USER } from '~/assets/constants/types'
import { LOCALIZED_DATE_FORMAT } from '~/assets/constants/date-formats'
import { cleanPostBody } from '~/assets/utils/clean-post-body'
import { getDateLocale } from '~/assets/constants/date-locales'

const props = defineProps({
  hideThumbnail: Boolean,
  post: { type: Object, required: true },
  rootPath: { type: String, required: true },
  ssr: Boolean,
  withPreview: Boolean,
})

const localePath = useLocalePath()
const { locale } = useI18n()
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import '~/assets/sass/mixins.scss';

.post-preview {
  &__description {
    // font-size: 13.33px;
    // margin: 0;
    margin-bottom: 10px;
  }

  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__metadata {
    font-style: normal;
  }

  &__forum {
    &-author,
    &-date {
      @include eyebrow();

      font-size: 12px;
      font-weight: 600;
    }

    &-tag {
      @include eyebrow();
    }
  }
}
</style>
