<template>
  <div class="video-player">
    <div class="video-player__list">
      <IListGroup size="sm" :border="false">
        <IListGroupItem
          class="video-player__list--item"
          v-for="video in videoList"
          :key="video.id"
          :active="video.id === activeVideo"
          @click="setActiveVideo(video.id)"
        >
          <h4 class="video-player__list--item-title">{{ video.title }}</h4>
        </IListGroupItem>
      </IListGroup>
    </div>
    <div class="video-player__contents">&nbsp;</div>
  </div>
</template>
<script setup>
  const props = defineProps({
    videos: { type: Array, default: [] },
  })

  const { videos: vids } = toRefs(props)

  const videoList = computed(() => {
    return vids
      .value
      .filter((v) => v.embedCode !== null)
  })

  const activeVideo = ref(videoList.value[0]?.id || null)

  const setActiveVideo = (id) => activeVideo.value = id 
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

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
    width: 67%;
  }
}
</style>