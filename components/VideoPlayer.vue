<template>
  <div class="video-player">
    <div class="video-player__list">
      <IListGroup size="sm" :border="false">
        <IListGroupItem
          class="video-player__list--item"
          v-for="video in vids"
          :key="video.id"
          :active="video.id === activeVideo"
          @click="setActiveVideo(video.id)"
        >
          <h4 class="video-player__list--item-title">{{ video.title }}</h4>
        </IListGroupItem>
      </IListGroup>
    </div>
    <div class="video-player__contents">
      <div
        class="video-player__contents--player"
        v-html="videoDetails.embedCode"
      />
      <p class="video-player__contents--summary">{{ videoDetails.summary }}</p>
      <ul class="video-player__contents--tags">
        <li
          v-for="{ uri, name } in videoDetails.tags"
          :key="uri"
          class="video-player__contents--tags-item"
        >
          <IBadge size="sm" @click="onTagClick({ uri })">{{ name }}</IBadge>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useTags } from '~/assets/composables/useTags'

const { onTagClick } = useTags()

const props = defineProps({
  videos: { type: Array, default: [] },
})

const { videos: vids } = toRefs(props)

const activeVideo = ref(vids.value[0]?.id || null)

const setActiveVideo = (id) => (activeVideo.value = id)

const videoDetails = computed(() => {
  return vids.value.find(({ id }) => id === activeVideo.value)
})
</script>
<style lang="scss" scoped>
@import '~/assets/sass/mixins.scss';

.video-player {
  display: flex;

  &__list {
    width: 33%;

    &--item {
      cursor: pointer;

      &-title {
        @include titleLink();
      }
    }
  }

  &__contents {
    border-left: 1px solid
      var(--list-group--border-bottom-color, var(--border-bottom-color));
    padding-left: 20px;
    width: 67%;

    &--player {
      aspect-ratio: 16 / 9;
    }

    &--summary {
      font-size: 13.33px;
      margin: 10px 0;
    }

    &--tags {
      display: inline;
      list-style: none;
      margin: 0;
      padding: 0;

      &-item {
        @include eyebrow();

        cursor: pointer;
        display: inline-block;
        font-style: normal;
        margin-right: 5px;

        &:last-of-type {
          margin-right: 1px;
        }
      }
    }
  }
}
</style>
<style>
.video-player__contents--player iframe {
  height: 100% !important;
  width: 100% !important;
}
</style>
